import { ChangeDetectorRef, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { MarketBook } from '../../../interface/MarketBook';
import { interval, Subject, switchMap, takeUntil } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketService } from '../../../Services/marketservice';
import { StorageService } from '../../../Services/storage-service';
import { BetSlip } from '../../bet-slip/bet-slip';
import { NumberFormatPipe } from "../../../Services/number-format-pipe";

@Component({
  selector: 'app-line-market',
  imports: [NumberFormatPipe,CommonModule],
  templateUrl: './line-market.html',
  styleUrl: './line-market.css',
})
export class LineMarket {
@Input() eventId!: string;
marketBooks: MarketBook[] | null = null;
userid: any;
 private destroy$ = new Subject<void>();
 isMobile = false;
 readonly priceSlots = 3;
  constructor(private marketService: MarketService,private cdr: ChangeDetectorRef,@Inject(PLATFORM_ID) private platformId: Object) { 

   }

  ngOnInit() {
  this.checkScreen();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('resize', this.onResize);
    }
      this.marketService.getMarketsLine(this.eventId, this.userid)
        .subscribe(res => {
          this.marketBooks = res;
          this.cdr.markForCheck();
          this.loadMarketBooks();
        }); 
  }

  loadMarketBooks() {
    interval(4000) // ⏱ every 1 second
        .pipe(
          takeUntil(this.destroy$),
          switchMap(() => this.marketService.getMarketsLine(this.eventId, this.userid))
        )
        .subscribe(res => {
          this.marketBooks = res;
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
  showMarketRules() {
  console.log('Show Rules');
}

hideFancyMarket() {
  console.log('Hide Market');
}

showCompletedUserBets(marketId: string) {
  console.log('Book clicked:', marketId);
}



getBackPrices(runner: any) {
  const arr = runner?.exchangePrices?.availableToBack ?? [];

  // pad at START
  return [
    ...Array(Math.max(0, this.priceSlots - arr.length)).fill(null),
    ...arr.slice(0, this.priceSlots)
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
  // this.betSlipService.setBet({
  //   selectionId,
  //   selectionName,
  //   type,
  //   price,
  //   stake,
  //   size,
  //   marketId,
  //   marketName,
  //   index
  // });
}
}
