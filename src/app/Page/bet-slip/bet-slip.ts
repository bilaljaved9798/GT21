import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { UserbetService } from '../../Services/userbet-service';

@Component({
  selector: 'app-bet-slip',
  imports: [CommonModule],
  templateUrl: './bet-slip.html',
  styleUrl: './bet-slip.css',
})
export class BetSlip {
  @Input() selectionName!: string;
  @Input() type!: 'back' | 'lay';
  @Input() price!: number;
  @Input() size!: number;
  @Input() stake!: number;
  @Input() selectionId!: number;
  @Input() marketId!: number;
  @Input() marketName!: string;
  @Input() runnersCount!: number;
  @Input() eventId!: number;
  @Input() clickedLocation!: number;

@Output() closeEvent = new EventEmitter<void>();

  stakeButtons = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];

constructor(private userbetService: UserbetService) {
    var info = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    var userId = info?.user?.id || 0;

    this.selectionName;
    this.type;
    this.price;
    this.size;
    }
  ngOnInit() {
    console.log(this.selectionName);
    console.log(this.type);
    console.log(this.price);
    console.log(this.size);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['type']) {
      console.log('Type changed:', this.type);
    }
  }
 
  get profit(): number {
    if (!this.price || !this.stake) return 0;

    if (this.type === 'back') {
      return (this.price - 1) * this.stake;
    }

    return (this.price - 1) * this.stake; // liability for lay
  }

  setStake(amount: number) {
    this.stake = amount;
  }

  submitBet() {
    debugger;
    var info = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    var userId = info?.user?.id || 0;
  const payload = {
    UserId: userId,
    Amount: this.stake?.toString(),
    Odd: this.price?.toString(),
    BetType: this.type, // 'BACK' / 'LAY'
    SelectionID: [this.selectionId], // must be array
    Selectionname: this.selectionName,
    MarketbookID: this.marketId,
    MarketbookName: this.marketName,
    RunnersCount: this.runnersCount?.toString() || '0',
    Betslipamountlabel: this.profit?.toString() || '0',
    Clickedlocation: this.clickedLocation,
    Betslipsize: this.stake?.toString()
  };

  this.userbetService.insertUserBet(payload).subscribe({
    next: (response) => {
      console.log('Bet Submitted:', response);
    },
    error: (error) => {
      console.error('Error submitting bet:', error);
    }
  });

  this.close();
}  close() {
    this.stake = 0;
      this.closeEvent.emit();
  }

}
