import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { MarketBook } from '../../interface/MarketBook';
import { Subject, switchMap, takeUntil, timer, catchError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { BetSlip } from '../bet-slip/bet-slip';
import { StorageService } from '../../Services/storage-service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MarketService } from '../../Services/marketservice';
import { TiedMarket } from "./tied-market/tied-market";
import { Figure } from "./figure/figure";
import { Fancy } from "./fancy/fancy";
import { LineMarket } from "./line-market/line-market";
import { NumberFormatPipe } from "../../Services/number-format-pipe";
import { BetSlipService } from '../../Services/bet-slip-service';
import { UserBets } from "../user-bets/user-bets";
import { UserbetService } from '../../Services/userbet-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ScoreUpdate } from "./score-update/score-update";
import { MultipleBetSlipService } from '../../Services/multiple-bet-slip-service';
import { ScoreService } from '../../Services/score-service';
import { GoalMarket } from "./goal-market/goal-market";
import { Reletedevent } from "../reletedevent/reletedevent";
import { EvenOdd } from "./even-odd/even-odd";

@Component({
  selector: 'app-markets',
  imports: [TiedMarket, Figure, BetSlip, Fancy, NumberFormatPipe, CommonModule, UserBets, ScoreUpdate, GoalMarket, Reletedevent, EvenOdd],
  templateUrl: './markets.html',
  styleUrl: './markets.css',
})

export class Markets {

  isExpanded: boolean = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

 selectedRunners: any[] = [];

favoriteSelectionName = '';
favoriteBackPrice = '0.00';
favoriteLayPrice = '0.00';
favoriteBackSize = '';
favoriteLaySize = '';
  activeTab: 'video' | 'score' = 'score';
  backgrod = '#263238';      // use your ViewBag.backgrod
  color = '#fffefe';
  market: MarketBook | null = null;
  selectedMarketId: string | null = null;
  private destroy$ = new Subject<void>();
  private marketPollStop$ = new Subject<void>();
  model: any = {};
  timerText: any;
  now = Date.now();
  matchData: any;
  eventId: string = '';
  marketId: string = '';
  mainsportsname: string = '';
  selectedBet: any;
  readonly priceSlots = 3;
  isMobile = false;
  showBetSlipModal = false;
  matchStartTime: Date = new Date();
  betNotAllowedMessage = '';
  videoUrl!: SafeResourceUrl;
  scoreCardUrl!: SafeResourceUrl;
  eventType:number = 4;
  score: any = {};
  constructor(private marketService: MarketService, private sanitizer: DomSanitizer, public betSlipService: BetSlipService, private userbetService: UserbetService,private scoreService: ScoreService,
    private route: ActivatedRoute,public multiSlip: MultipleBetSlipService, private cdr: ChangeDetectorRef, private router: Router, private storage: StorageService, @Inject(PLATFORM_ID) private platformId: Object) {
    debugger;
      const info = this.storage.get<any>('userInfo');
    this.model.userId = info?.user?.id;
    const nav = this.router.getCurrentNavigation();
    this.market = nav?.extras?.state?.['match'];

    if (this.market != undefined && this.market != null) {
      this.storage.set('selectedMarket', this.market);
      this.storage.set('eventID', this.market?.eventID || '');
      this.eventId = this.market?.eventID || '';
      this.marketId = this.market?.marketId || '';
      this.mainsportsname = this.market?.mainSportsname || '';
      this.eventType = this.market?.mainSportsname === 'Cricket' ? 4 : 1;
    } else {
      this.eventId = this.storage.get('eventID') || '';
      this.marketId = this.storage.get('marketID') || '';
      this.model.selectedMarketBook = (this.storage.get('selectedMarket') as MarketBook)?.marketBookName || '';
      this.model.selectedMarketStartTime = (this.storage.get('selectedMarket') as MarketBook)?.orignalOpenDate || '';
      this.model.selectedSport = (this.storage.get('selectedMarket') as MarketBook)?.mainSportsname || '';
      this.model.eventName = (this.storage.get('selectedMarket') as MarketBook)?.marketBookName || '';
      this.model.mainSportsname = (this.storage.get('selectedMarket') as MarketBook)?.mainSportsname || '';
      this.eventType =  (this.storage.get('selectedMarket') as MarketBook)?.mainSportsname  === 'Cricket' ? 4 : 1;
    }
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.model.selectedMarketId = params['id'];
      this.setmarketOpen();
      this.updateMarketFromNavigationState();
      if (isPlatformBrowser(this.platformId) && this.model.selectedMarketId) {
       setTimeout(() => {
          this.refreshMarket();
          this.loadMarkets();
        }, 100);
      }
    });
  }
 setmarketOpen() {
  this.marketService.SetmarketOpen(this.model.selectedMarketId)
  .subscribe({
    next: (result) => {
      console.log('Market opened:', result);
    },
    error: (err) => {
      console.error('Error:', err);
    }
  });
}
private calculateMultipleOdds(): void {

  if (this.selectedRunners.length < 2) {
    this.favoriteSelectionName = '';
    this.favoriteBackPrice = '0.00';
    this.favoriteLayPrice = '0.00';
    return;
  }

  let backOdd =
    Number(this.selectedRunners[0].backPrice) - 1;

  let layOdd =
    Number(this.selectedRunners[0].layPrice) - 1;

  let selectionName =
    this.selectedRunners[0].clothNumber ||
    this.selectedRunners[0].runnerName;

  for (let i = 1; i < this.selectedRunners.length; i++) {

    const runner = this.selectedRunners[i];

    const currentBack =
      Number(runner.backPrice) - 1;

    const currentLay =
      Number(runner.layPrice) - 1;

    // BACK FORMULA
    const equation2Back =
      (backOdd * currentBack) - 1;

    const equation1Back =
      (backOdd + currentBack) + 2;

    backOdd = equation2Back / equation1Back;

    // LAY FORMULA
    const equation2Lay =
      (layOdd * currentLay) - 1;

    const equation1Lay =
      (layOdd + currentLay) + 2;

    layOdd = equation2Lay / equation1Lay;

    selectionName += '+' +
      (runner.clothNumber || runner.runnerName);
  }

  this.favoriteSelectionName = selectionName;

  this.favoriteBackPrice =
    isNaN(backOdd) || backOdd <= 0
      ? '0.00'
      : backOdd.toFixed(2);

  this.favoriteLayPrice =
    isNaN(layOdd) || layOdd <= 0
      ? '0.00'
      : layOdd.toFixed(2);

  const lastRunner =
    this.selectedRunners[this.selectedRunners.length - 1];

  this.favoriteBackSize = lastRunner.backSize;
  this.favoriteLaySize = lastRunner.laySize;
}
 ngOnInit(): void {

  this.checkScreen();

  if (isPlatformBrowser(this.platformId)) {
    window.addEventListener('resize', this.onResize);
  }

  // Load market whenever query parameter changes
  this.route.queryParamMap
    .pipe(takeUntil(this.destroy$))
    .subscribe(params => {

      const marketId = params.get('id');

      if (!marketId) {
        return;
      }

      this.loadMarket(marketId);

    });

  // Refresh after bet placed
  this.userbetService.betPlaced$
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.refreshMarket());

  this.showTab('score');

  this.score.matchName='billions vs kings';
  this.score.score='115/3 (10.0)';
  this.score.over='20';
  this.score.RR='5.75';
  this.score.wickets='3';
  this.score.overs='20.0';

}

private loadMarket(marketId: string): void {
debugger;
  const selectedMarket = this.storage.get('selectedMarket') as MarketBook;

  if (!selectedMarket) {
    return;
  }

  this.model.selectedMarketId = marketId;
  this.model.selectedMarketBook = selectedMarket.marketBookName || '';
  this.model.selectedMarketStartTime = selectedMarket.orignalOpenDate || '';
  this.model.selectedSport = selectedMarket.mainSportsname || '';
  this.model.eventName = selectedMarket.marketBookName || '';
  this.model.mainSportsname = selectedMarket.mainSportsname || '';
  this.marketId= selectedMarket.marketId;
  this.mainsportsname = this.model.mainSportsname;
  this.eventId = selectedMarket.eventID;

  if (isPlatformBrowser(this.platformId)) {

    this.matchStartTime = this.addHours(
      selectedMarket.orignalOpenDate || '',
      5
    );

    // Stop previous polling
    this.marketService.stopPolling();

    // Load selected market
    this.marketService.getMarkets(this.model).subscribe(res => {

      this.market = res;

      this.cdr.markForCheck();

      this.loadMarkets();

      if (this.mainsportsname === 'Cricket') {

        this.marketService.startPolling(
          this.eventId,
          marketId,
          this.model.userId
        );

      }

    });

  }

}

  addHours(dateValue: any, hours: number): Date {
    const date = new Date(dateValue);
    date.setHours(date.getHours() + hours);
    return date;
  }
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };

    const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(date);

    const map: any = {};
    parts.forEach(p => map[p.type] = p.value);

    return `${map.weekday} ${map.month} ${map.day} ${map.year} ${map.hour}:${map.minute} ${map.dayPeriod}`;
  }

  getStatusText(status: string | undefined): string {
    switch (status) {
      case 'In Play':
        return 'IN-PLAY';
      case 'Active':
        return 'GOING LIVE';
      default:
        return 'CLOSED';
    }
  }

  getStatusClass(status: string | undefined): string {
    switch (status) {
      case 'In Play':
        return 'status-inplay';
      case 'Active':
        return 'status-active';
      default:
        return 'status-closed';
    }
  }

  loadMarkets(): void {
    this.marketPollStop$.next();
    timer(0, 2000) // Increased initial delay and interval to reduce load
      .pipe(
        takeUntil(this.destroy$),
        takeUntil(this.marketPollStop$),
        switchMap(() => this.marketService.getMarkets(this.model).pipe(
          catchError(error => {
            // Handle cancelled requests gracefully
            if (error.name === 'AbortError' || error.status === 0) {
              console.log('Request cancelled - component likely destroyed');
              return []; // Return empty to prevent errors
            }
            throw error; // Re-throw other errors
          })
        ))
      )
      .subscribe({
        next: res => {
          this.market = res;
          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Market polling error:', err);
        }
      });
  }

  refreshMarket(): void {
    this.marketService.getMarkets(this.model)
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          if (error.name === 'AbortError' || error.status === 0) {
            console.log('Refresh request cancelled');
            return []; // Return empty to prevent errors
          }
          throw error;
        })
      )
      .subscribe({
        next: res => {
          this.market = res;
          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Market refresh error:', err);
        }
      });
  }

  updateMarketFromNavigationState(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const stateMarket = history.state?.match as MarketBook | undefined;
    if (!stateMarket) return;

    this.market = stateMarket;
    this.storage.set('selectedMarket', stateMarket);
    this.storage.set('eventID', stateMarket.eventID || '');
    this.eventId = stateMarket.eventID || '';
    this.marketId = stateMarket.marketId || '';
    this.mainsportsname = stateMarket.mainSportsname || '';
    this.model.selectedMarketBook = stateMarket.marketBookName || '';
    this.model.selectedMarketStartTime = stateMarket.orignalOpenDate || '';
    this.model.selectedSport = stateMarket.mainSportsname || '';
    this.model.eventName = stateMarket.marketBookName || '';
    this.model.mainSportsname = stateMarket.mainSportsname || '';
    this.matchStartTime = this.addHours(stateMarket.orignalOpenDate || '', 5);
  }

  onResize = () => {
    this.checkScreen();
  };
  checkScreen() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 768;
    } else {
      this.isMobile = false; // default for SSR
    }
  }
  ngOnDestroy(): void {
    this.marketPollStop$.next();
    this.marketPollStop$.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
  getMarketImages(sport: string): string {
    switch (sport) {
      case 'Cricket': return 'assets/images/ws4.png';
      case 'Horse Racing': return 'assets/images/ws7.png';
      case 'Greyhound Racing': return 'assets/images/ws4339.png';
      case 'Tennis': return 'assets/images/ws2.png';
      case 'Soccer': return 'assets/images/ws1.png';
      default: return '';
    }
  }
getBackPrices(runner: any) {
  const arr = [...(runner?.exchangePrices?.availableToBack ?? [])]
    .slice(0, this.priceSlots)
    .reverse(); // highest back price nearest center

  return [
    ...Array(this.priceSlots - arr.length).fill(null),
    ...arr
  ];
}
 getLayPrices(runner: any) {
  const prices = runner?.exchangePrices?.availableToLay ?? [];

  const arr = prices.slice(0, this.priceSlots);

  // Left align
  return [
    ...arr,
    ...Array(this.priceSlots - arr.length).fill(null)
  ];
}
  showMarketRules(sport: string, marketBookName: string, runnersCount: number) {
    console.log('Show rules', sport, marketBookName, runnersCount);
    // Implement your rule popup logic
  }

  addTime(duration: string, addHours: number, addMinutes: number): string {
    let [days, hours, minutes, seconds] = duration.split(':').map(Number);

    // Add minutes first
    minutes += addMinutes;
    const extraHoursFromMinutes = Math.floor(minutes / 60);
    minutes = minutes % 60;

    // Add hours + overflow from minutes
    hours += addHours + extraHoursFromMinutes;
    const extraDays = Math.floor(hours / 24);
    hours = hours % 24;

    // Add extra days
    days += extraDays;

    return `${days}:${hours}:${minutes}:${seconds}`;
  }

  selectMarket(marketId: string): void {
    this.selectedMarketId = marketId;
  }

  isSelected(marketId: string): boolean {
    return this.selectedMarketId === marketId;
  }

  addRunnersForMultipleBets(selectionId: string) {
    // same as AddRunnersformultiplebets
    console.log('Selected:', selectionId);
  }

  triggerChangeMethod(selectionId: string, marketId: string) {
    console.log(selectionId, marketId);
  }
  onCloseBetSlip() {
    this.showBetSlipModal = false;
  }

  isBettingAllowed(): boolean {
    return !!this.market?.bettingAllowed;
  }

  showBetSlip(
    selectionId: number,
    selectionName: string,
    type: string,
    price: number,
    stake: number,
    marketId: string,
    marketName: string,
    size: number,
    index: number
  ) {
    if (!this.isBettingAllowed()) {
      this.betSlipService.clear();
      this.betNotAllowedMessage = 'Bet not allowed';
      setTimeout(() => {
        this.betNotAllowedMessage = '';
        this.cdr.markForCheck();
      }, 2500);
      return;
    }

    this.betNotAllowedMessage = '';
    this.betSlipService.addBet({
      selectionId: selectionId,
      selectionName: selectionName,
      marketId: marketId,
      marketName: marketName,
      eventId: this.eventId,
      type: type,
      price: price,
      size: size,
      stack: 0,
      Clickedlocation: 0,
      runnersCount: this.market?.runners?.length || 0,
      categoryName: this.market?.mainSportsname || ''
    });
  }

  showMultiRunnerBetSlip(type: 'back' | 'lay'): void {

  if (!this.selectedRunners.length) {
    this.betNotAllowedMessage = 'Please select at least one runner';
    setTimeout(() => {
      this.betNotAllowedMessage = '';
    }, 3000);
    return;
  }

  const selectionIds = this.selectedRunners.map(x => x.selectionId);

  const runnerNames = this.selectedRunners
    .map(x => x.clothNumber || x.runnerName)
    .join('+');

  const betSlip = {
    isMultiple: true,
    selectionIds,
    selectionName: runnerNames,
    marketId: this.market?.marketId,
    marketName: this.market?.marketBookName,
    betType: type,
    price: type === 'back'
      ? this.market?.favoriteBack
      : this.market?.favoriteLay,
    size: type === 'back'
      ? this.market?.favoriteBackSize
      : this.market?.favoriteLaySize
  };

  this.betSlipService.openMultipleBetSlip(betSlip);
}

showTab(tab: 'video' | 'score') {

  this.marketService.getVideoUrl(this.eventType, this.eventId)
  .subscribe(url => {
    var link= url;
    var res = link.find(x => x.EventID===this.eventId);
    var videoLink = link.find(x => x.EventID===this.eventId)?.tvlink1;
    var scorecardLink = link.find(x => x.EventID===this.eventId)?.scorecard;
      this.videoUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl('https://e765432.diamondcricketid.com/dtv.php?id=' + videoLink || '');

      if (tab === 'score') {
        this.scoreCardUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(scorecardLink || '');
      }

      this.activeTab = tab;
    });
}

toggleRunner(runner: any): void {

  const index = this.selectedRunners.findIndex(
    x => x.selectionId === runner.selectionId
  );

  if (index > -1) {
    this.selectedRunners.splice(index, 1);
  } else {

    this.selectedRunners.push({
      selectionId: runner.selectionId,
      runnerName: runner.runnerName,
      clothNumber: runner.clothNumber,

      backPrice: this.getBackPrices(runner)[0]?.price ?? 0,
      layPrice: this.getLayPrices(runner)[0]?.price ?? 0,

      backSize: this.getBackPrices(runner)[0]?.size ?? 0,
      laySize: this.getLayPrices(runner)[0]?.size ?? 0
    });
  }

  this.selectedRunners = [...this.selectedRunners];

  this.calculateMultipleOdds();
}

isRunnerSelected(selectionId: any): boolean {
  return this.selectedRunners.some(
    x => x.selectionId === selectionId
  );
}

getSelectedRunnerNames(): string {
  var names = this.selectedRunners    .map(x => x.runnerName)
    .join('+');
  console.log('Selected runner names:', names);
  
  return this.selectedRunners
    .map(x => x.runnerName)
    .join('+');
}

onRunnerClick(runner: any) {

  if (!this.canSelectRunner()) {
    return;
  }

  this.toggleRunner(runner);
}
canSelectRunner(): boolean {

  const category = this.market?.mainSportsname || '';
  const marketName = this.market?.marketBookName || '';
  const status = (this.market?.marketStatusstr || '').toUpperCase();

  if (!category.includes('Racing')) {
    return false;
  }

  if (marketName.includes('To Be Placed')) {
    return false;
  }

  if (marketName.includes('(US)')) {
    return false;
  }

  if (status === 'SUSPENDED' || status === 'CLOSED') {
    return false;
  }

  return true;
}
getWearingUrl(url: string): string {

  if (!url) return '';

  return url.replace(
    'content-cache.betfair.com/feeds_images/Horses/SilkColours/',
    'content.betfair.com/feeds_images/Horses/SilkColours/'
  );
}

onImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = 'assets/images/not-found.png';
}

}
