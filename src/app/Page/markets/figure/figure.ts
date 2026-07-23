import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Datum, Odd } from '../../../interface/fancymarket';
import { MarketService } from '../../../Services/marketservice';
import { StorageService } from '../../../Services/storage-service';
import { NumberFormatPipe } from "../../../Services/number-format-pipe";
import { BetSlipService } from '../../../Services/bet-slip-service';

@Component({
  selector: 'app-figure',
  imports: [CommonModule],
  templateUrl: './figure.html',
  styleUrl: './figure.css',
})
export class Figure {

  getLastFigureName(name?: string): string {
    if (!name) {
      return '';
    }

    return name.replace(/\s+[A-Za-z0-9&.-]+\s+VS\s+.+$/i, '').trim();
  }

  @Input() eventId!: string;
  @Input() marketId!: string
  market: any=[];
   marketboos: Datum[] =[];
  userid: any;
   selectedBet:any;
   readonly priceSlots = 1;
 isMobile = false;
showBetSlipModal = false;
 private destroy$ = new Subject<void>();
constructor(private marketService: MarketService,public betSlipService: BetSlipService,private cdr: ChangeDetectorRef,private storage: StorageService,@Inject(PLATFORM_ID) private platformId: Object) {
      const info = this.storage.get<any>('userInfo');
      this.userid =  info?.user?.id;;
     }

     ngOnInit() {
       this.checkScreen();
   if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize);
    }
    this.marketService.markets$
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {
    this.market = data?.diamondRoot?.data
  ?.filter((x: any) => x?.gtype === 'cricketcasino') || [];
  this.marketboos = this.market;
    });
  }

    loadToss() {
       var fata=this.marketService.AllMarkets;
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
getBackPrices(Odds: Odd[] = []) {
  const arr = Odds
    .filter(x => x?.otype?.toLowerCase() === 'back')
    .slice(0, this.priceSlots)
    .reverse(); // 👈 move reverse here

  return [
    ...Array(Math.max(0, this.priceSlots - arr.length)).fill(null),
    ...arr
  ];
}

getLayPrices(Odds: Odd[] = []) {
  const arr = Odds.filter(x=>x.otype === 'lay') ?? [];

  // pad at END
  return [
    ...arr.slice(0, this.priceSlots),
    ...Array(Math.max(0, this.priceSlots - arr.length)).fill(null)
  ];
}
   showBetSlip(
   
    selectionId: number,
    selectionName: string,
    type: string,
    price: number,
    stake: number,
    MarketBookID: string,
    marketName: string,
    size: number,
    index: number
  ) {
    debugger;
   this.betSlipService.addBet({
    selectionId: selectionId,
    selectionName: selectionName + ' - ' + marketName,
    marketId: MarketBookID,
    marketName: selectionName + ' - ' + marketName,
    eventId: this.eventId,
    type: type,
    price: price,
    size: size,
    stack:0,
    Clickedlocation:8, // 8 for figure market
    runnersCount: 1, // or this.market?.runners?.length || 0
    categoryName: 'Fancy'
  });
  }
}
