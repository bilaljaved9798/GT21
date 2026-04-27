import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { MarketBook } from '../../interface/MarketBook';
import { interval, Subject, switchMap, takeUntil } from 'rxjs';
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

@Component({
  selector: 'app-markets',
  imports: [TiedMarket, Figure, BetSlip, Fancy, LineMarket, NumberFormatPipe,CommonModule],
  templateUrl: './markets.html',
  styleUrl: './markets.css',
})
export class Markets {

  backgrod = '#263238';      // use your ViewBag.backgrod
  color = '#fffefe'; 
  market: MarketBook | null = null;
  selectedMarketId: string | null = null;
  private destroy$ = new Subject<void>();
  model: any = {};
  timerText: any;
  now = Date.now();
  matchData: any;
  eventId: string = '';
  marketId: string = '';
  mainsportsname: string = '';
  selectedBet:any;
readonly priceSlots = 3;
 isMobile = false;
showBetSlipModal = false;
matchStartTime: Date = new Date();
  constructor(private marketService: MarketService,public betSlipService: BetSlipService,private route: ActivatedRoute,private cdr: ChangeDetectorRef,private router: Router ,private storage: StorageService,@Inject(PLATFORM_ID) private platformId: Object) {
    const info = this.storage.get<any>('userInfo');
    this.model.userId = info?.user?.id;
    const nav = this.router.getCurrentNavigation();
     this.market = nav?.extras?.state?.['match'];
     
     if (this.market !=undefined && this.market !=null) {  
      this.storage.set('selectedMarket', this.market);
   this.storage.set('eventID', this.market?.eventID || '');
     this.eventId = this.market?.eventID || '';
      this.marketId = this.market?.marketId || '';
      this.mainsportsname = this.market?.mainSportsname || '';
     }else{
      this.eventId = this.storage.get('eventID') || '';
      this.marketId = this.storage.get('marketID') || '';
      this.model.selectedMarketBook = (this.storage.get('selectedMarket') as MarketBook)?.marketBookName || '';
      this.model.selectedMarketStartTime = (this.storage.get('selectedMarket') as MarketBook)?.orignalOpenDate || '';
      this.model.selectedSport = (this.storage.get('selectedMarket') as MarketBook)?.mainSportsname || '';
      this.model.eventName = (this.storage.get('selectedMarket') as MarketBook) ?.marketBookName || '';
      this.model.mainSportsname = (this.storage.get('selectedMarket') as MarketBook)?.mainSportsname || '';
     }
     this.route.queryParams.subscribe(params => {
      this.model.selectedMarketId = params['id'];      
    });
    
  }

ngOnInit(): void { 
   this.model.selectedMarketBook = (this.storage.get('selectedMarket') as MarketBook)?.marketBookName || '';
      this.model.selectedMarketStartTime = (this.storage.get('selectedMarket') as MarketBook)?.orignalOpenDate || '';
      this.model.selectedSport = (this.storage.get('selectedMarket') as MarketBook)?.mainSportsname || '';
      this.model.eventName = (this.storage.get('selectedMarket') as MarketBook) ?.marketBookName || '';
      this.model.mainSportsname = (this.storage.get('selectedMarket') as MarketBook)?.mainSportsname || '';
      this.mainsportsname = this.model.mainSportsname;
   this.checkScreen();

    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize);
    }
     //   this.signalRService.startConnection().then(() => {

  //   // ✅ subscribe to market
  //   this.signalRService.subscribeMarket(this.model.selectedMarketId, this.model.sheetname, this.model.mainSportsname, this.model.userId);

  //   // ✅ receive real-time updates
  //   this.signalRService.onMarketUpdate((res) => {
  //     this.market = res;
  //     this.now = Date.now();
  //     this.timerText = this.getRemainingTime(this.model.selectedMarketStartTime);
  //     this.cdr.markForCheck();
  //   });

  // });
  if (isPlatformBrowser(this.platformId)) {
     this.matchStartTime = this.addHours((this.storage.get('selectedMarket') as MarketBook)?.orignalOpenDate || '', 5);
   this.marketService.getMarkets(this.model).subscribe(res => {
      this.market = res;
        this.cdr.markForCheck();
        this.loadMarkets()   
        if(this.mainsportsname==='Cricket'){
        this.marketService.startPolling(this.eventId, this.marketId, this.model.userId);
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
    interval(1000) // ⏱ every 1 seconds
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.marketService.getMarkets(this.model))
      )
      .subscribe(res => {
        this.market = res;
        this.cdr.markForCheck();
        
      });
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
  const arr = runner?.exchangePrices?.availableToBack ?? [];

  const prices = arr
    .slice(0, this.priceSlots)
     // 👈 reverse here

  return [
    ...Array(Math.max(0, this.priceSlots - prices.length)).fill(null),
    ...prices
  ];
}
getLayPrices(runner: any) {
  const arr = runner?.exchangePrices?.availableToLay ?? [];

  // pad at END
  return [
    ...arr.slice(0, this.priceSlots),
    ...Array(Math.max(0, this.priceSlots - arr.length)).fill(null)
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

  showBetSlip(
    selectionId: string,
    selectionName: string,
    type: string,
    price: number,
    stake: number,
    marketId: string,
    marketName: string,
    size: number,
    index: number
  ) {
    debugger;
    this.selectedBet = {
      selectionName: selectionName,
      selectionId: selectionId,
      type: type,
      price: price,
      size: size,
      stake: stake,
      marketId: marketId,
      marketName: marketName
    };
    if (this.isMobile) {
      this.showBetSlipModal = true;
    }
  }
  openBetSlip(runner: any, type: 'BACK' | 'LAY') {

  const bet = {
    selectionName: runner.RunnerName,
    type,
    price: type === 'BACK' ? runner.Backprice : runner.Layprice,
    size: type === 'BACK' ? runner.BackSize : runner.LaySize,
    selectionId: runner.SelectionId,
    marketId: this.marketId,
    //marketName: this.marketName,
    eventId: this.eventId,
    clickedLocation: window.location.href
  };

  this.betSlipService.open(bet);
}

}
