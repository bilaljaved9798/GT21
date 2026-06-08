import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FancyMarket } from '../../../interface/fancymarket';
import { interval, Subject, switchMap, takeUntil } from 'rxjs';
import { MarketService } from '../../../Services/marketservice';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../Services/storage-service';
import { CommonModule } from '@angular/common';
import { BetSlipService } from '../../../Services/bet-slip-service';

@Component({
  selector: 'app-fancy',
  imports: [CommonModule],
  templateUrl: './fancy.html',
  styleUrl: './fancy.css',
})
export class Fancy {

 private destroy$ = new Subject<void>();
@Input() eventId!: string;
@Input() marketId!: string;
@Output() closeEvent = new EventEmitter<void>();
userid: any;
private now: number = 0;
private timerText: string = '';
private model: any = {};
 market: FancyMarket[] = [];

constructor(private marketService: MarketService,private betSlipService: BetSlipService,private route: ActivatedRoute,private cdr: ChangeDetectorRef,private router: Router,private storage: StorageService) {
 const info = this.storage.get<any>('userInfo');
  this.userid = info?.user?.id;
}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
ngOnInit() {
  this.marketService.markets$
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {
     const runners = Array.isArray(data?.session)
  ? data.session
  : Array.isArray(data?.Runners)
    ? data.Runners
    : [];
this.market = runners.map((r: any): FancyMarket => ({
        AdjustmentFactor: r.AdjustmentFactor ?? null,
        Average: r.Average,
        BackSize:  r.BackSize1,
        Backprice: r.BackPrice1,
        BettingAllowed: r.BettingAllowed,
        Clothnumber: r.Clothnumber,
        ExchangePrices: r.ExchangePrices,
        Handicap: r.Handicap ?? null,
        JockeyName: r.JockeyName,
        LastPriceTraded: r.LastPriceTraded ?? null,
        LaySize: r.LaySize1,
        Layprice: r.LayPrice1,
        Loss: r.Lose,
        MarketBookID: r.MarketBookID,
        MarketStatusStr: r.GameStatus,
        Matches: r.Matches || [],
        Orders: r.Orders || [],
        Profit: r.Profit,
        RemovalDate: r.RemovalDate ? new Date(r.RemovalDate) : null,
        RunnerName: r.RunnerName,
        SelectionId: r.SelectionId,
        StallDraw: r.StallDraw,
        StartingPrices: r.StartingPrices,
        Status: r.Status,
        StatusStr: r.StatusStr,
        TotalMatched: r.TotalMatched,
        TotalMatchedStr: r.TotalMatchedStr,
        WearingDesc: r.WearingDesc,
        WearingURL: r.WearingURL,
        isShow: r.isShow ?? true
      }));
  });
}


showMarketRules(market: string, country: string, id: string) {
    console.log('Show market rules:', market, country, id);
    // Navigate to market rules page or open modal
  }

  showCompletedUserBets(marketBookID: string, selectionId: string) {
    console.log('Show user bets:', marketBookID, selectionId);
    // Navigate to completed bets page with parameters
    this.router.navigate(['/bets/completed'], { queryParams: { marketBookID, selectionId } });
  }

  trackByMarketBookID(index: number, runner: FancyMarket ) {
    return runner.MarketBookID || index;
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
   this.betSlipService.addBet({
    selectionId: selectionId,
    selectionName: selectionName,
    marketId: this.eventId,
    marketName: selectionName,
    eventId: this.eventId,
    type: type,
    price: price,
    size: size,
    stack:0,
    Clickedlocation:9, // 9 for fancy market
    runnersCount: 1, // or this.market?.runners?.length || 0,
    categoryName: 'Fancy'
  });
  }
}
