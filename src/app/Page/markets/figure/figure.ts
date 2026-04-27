import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Datum, Odd } from '../../../interface/fancymarket';
import { MarketService } from '../../../Services/marketservice';
import { StorageService } from '../../../Services/storage-service';
import { NumberFormatPipe } from "../../../Services/number-format-pipe";

@Component({
  selector: 'app-figure',
  imports: [CommonModule, NumberFormatPipe],
  templateUrl: './figure.html',
  styleUrl: './figure.css',
})
export class Figure {
   @Input() eventId!: string;
 @Input() marketId!: string
  market: any;
    marketboos: Datum | null = null;
  userid: any;
   selectedBet:any;
   readonly priceSlots = 1;
 isMobile = false;
showBetSlipModal = false;
 private destroy$ = new Subject<void>();
constructor(private marketService: MarketService,private cdr: ChangeDetectorRef,private storage: StorageService,@Inject(PLATFORM_ID) private platformId: Object) {
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
    this.market = data.diamondRoot.data.find((x: any) => x?.gtype === 'cricketcasino') || null;
     this.marketboos =this.market;
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
}
