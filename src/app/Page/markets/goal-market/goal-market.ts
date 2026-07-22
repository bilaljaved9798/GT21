import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from "../../../Services/number-format-pipe";
import { FormsModule } from '@angular/forms';
import { MarketBook } from '../../../interface/MarketBook';
import { Subject } from 'rxjs';
import { BetSlipService } from '../../../Services/bet-slip-service';
import { Dashboardservices } from '../../../Services/dashboardservices';
import { MarketService } from '../../../Services/marketservice';

@Component({
  selector: 'app-goal-market',
  imports: [NumberFormatPipe, CommonModule,FormsModule],
  templateUrl: './goal-market.html',
  styleUrls: ['./goal-market.css'],
})
export class GoalMarket implements OnInit {
@Input() eventId!: string;
market: MarketBook [] = [];
 private destroy$ = new Subject<void>();
  private marketPollStop$ = new Subject<void>();
   readonly priceSlots = 3;
  isMobile = false;
  showBetSlipModal = false;
    betNotAllowedMessage = '';
    MarketIDs:any;
constructor(private betSlipService: BetSlipService,private marketService: MarketService,private cdr: ChangeDetectorRef,private dashboardService: Dashboardservices) { }

  ngOnInit(): void {
    this.marketService.GetOtherSoccer(this.eventId).subscribe({
    next: res => {
      if (res && res.length > 0) {  
        this.MarketIDs=res;
      }
      }
    })
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
      runnersCount: this.market?.[0]?.runners?.length || 0,
      categoryName: this.market?.[0] ?.mainSportsname || ''
    });
  }
  
    isBettingAllowed(): boolean {
    return !!this.market?.[0]?.bettingAllowed;
  }
}

