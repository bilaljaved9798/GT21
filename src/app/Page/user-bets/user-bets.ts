import { Component } from '@angular/core';
import { UserBet } from '../../interface/userbets';
import { UserbetService } from '../../Services/userbet-service';
import { StorageService } from '../../Services/storage-service';
import { CommonModule } from '@angular/common';
import { UserbetSignalRService } from '../../Services/BetSignalRService';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { StackPopup } from '../../shared/stack-popup/stack-popup';

@Component({
  selector: 'app-user-bets',
  imports: [CommonModule],
  templateUrl: './user-bets.html',
  styleUrl: './user-bets.css',
})
export class UserBets {
  private destroy$ = new Subject<void>();
bets: UserBet[] = [];
model: any = {};
constructor(private betService: UserbetService,protected storage: StorageService,public betSignal : UserbetSignalRService,private dialog: MatDialog) {
  const info = this.storage.get<any>('userInfo');
    this.model.userId = info?.user?.id;
   // this.loadBets();
  }
  async ngOnInit() {
    const userId = '160';
this.loadBets();
  // this.betSignal.startConnection(userId);

  // setTimeout(() => {
  //   this.betSignal.getUserBets(160);
    
  // }, 2000);



  //await this.betSignal.startConnection(userId);
 this.betService.userBets$
  .pipe(takeUntil(this.destroy$))
  .subscribe(data => {
    this.bets = data;
  });

  }

   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
loadBets() {
    this.betService.getUserBets(this.model.userId);
  }

  get unmatched() {
    return this.bets.filter(x => !x.isMatched);
  }

  get matched() {
    return this.bets.filter(x => x.isMatched)
      .sort((a, b) => b.id - a.id);
  }

  deleteBet(id: number) {
    this.betService.deleteBet(id).subscribe(() => {
      this.bets = this.bets.filter(x => x.id !== id);
    });
  }
   cancelAll() {
    const ids = this.unmatched.map(x => x.id);
    this.betService.cancelBets(ids).subscribe(() => {
      this.loadBets();
    });
  }

  openBetSlipSetting() {
  this.dialog.open(StackPopup, {
    width: '700px',
    disableClose: true
  });
}
  
}
