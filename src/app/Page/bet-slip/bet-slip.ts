import { CommonModule } from '@angular/common';
import { Component, computed, signal, SimpleChanges } from '@angular/core';
import { UserbetService } from '../../Services/userbet-service';
import { BetSlipService } from '../../Services/bet-slip-service';
import { FormsModule } from '@angular/forms';
import { effect } from '@angular/core';
import { finalize, switchMap, throwError } from 'rxjs';
import { StorageService } from '../../Services/storage-service';
import { QuickStake } from '../../interface/BetSlipKeys ';

@Component({
  selector: 'app-bet-slip',
  imports: [CommonModule, FormsModule],
  templateUrl: './bet-slip.html',
  styleUrl: './bet-slip.css',
})
export class BetSlip {
  

  //stakeButtons = [500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
private userId = 0;
private userType = 0;
userlimit: any = {};
errorMessage = signal('');
stake = signal<number>(0);
 submitting = signal<boolean>(false);

 quickStakes: QuickStake[] = [];
 
constructor(private userbetService: UserbetService,private storage: StorageService,public betSlipService: BetSlipService) {
    var info = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    this.userId = Number(info?.user?.id || 0);
    this.userType = Number(info?.user?.userTypeId || info?.user?.userTypeID || info?.user?.userType || 0);
    this.userlimit = info?.user?.result || {};
    effect(() => {
    const b = this.bet();
    if (b) {
      this.stake.set(0);
    }
  });
    }

 

  setStake(val: number) {
    this.stake.set(Number(val) || 0);
  }

  ngOnInit() {
     const result = this.storage.get<any>('userInfo')?.user?.result;

  if (!result) return;

  const buttons = [
  result.simpleBtn1,
  result.simpleBtn2,
  result.simpleBtn3,
  result.simpleBtn4,
  result.simpleBtn5,
  result.simpleBtn6,
  result.simpleBtn7,
  result.simpleBtn8,
  result.simpleBtn9,
  result.simpleBtn10,
  result.simpleBtn11,
  result.simpleBtn12
];
 
this.quickStakes = buttons
  .filter(x => x)
  .map(x => ({
    label: x,                      // "500" or "+56242"
    value: Number(x.replace('+', '')),
    isAdd: x.startsWith('+')
  }));

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['type']) {
      console.log('Type changed:', this.type);
    }
  }


bet = computed(() => this.betSlipService.selectedBet());

  // 👉 Derived values
  selectionName = computed(() => this.bet()?.selectionName);
  type = computed(() => this.bet()?.type);
  price = computed(() => this.bet()?.price);
  size = computed(() => this.bet()?.size);


profit = computed(() => {
  const b = this.bet();
  if (!b) return 0;

  const stake = this.stake();
  const odds = Number(b.price) || 0;
  const runners = Number(b.runnersCount || 0);
  const type = b.type;

  if (runners === 1) return stake;

  if (type === 'lay') return stake;

  return stake * (odds - 1);
});

loss = computed(() => {
  const b = this.bet();
  if (!b) return 0;

  const stake = this.stake();
  const odds = Number(b.price) || 0;
  const runners = Number(b.runnersCount || 0);
  const type = b.type;

  const loc = b.Clickedlocation;
  const sizef = (this.size() || 0) / 100;

  // 🔥 Special logic (your jQuery case)
  if (loc === 8 || loc === 9) {
    if (type === 'lay') {
      return parseFloat((stake * sizef).toFixed(2));
    }
    return parseFloat(stake.toFixed(2));
  }else{

  if (runners === 1) return stake;

  if (type === 'lay') return (odds - 1) * stake;

  return stake;
  }
});

oddsChange = computed(() => {
  const b = this.bet();
  if (!b) return null;

  const prev = this.betSlipService.previousOdds()[b.selectionId];

  if (!prev) return null;

  if (b.price > prev) return 'up';
  if (b.price < prev) return 'down';

  return null;
});

  close() {
    this.betSlipService.clear();
  }

submitBet() {
 
  const b = this.bet();

  if(b?.Clickedlocation === 8 || b?.Clickedlocation === 9){
    b.runnersCount = 0;
  }

  if (!b || this.submitting() || this.stake() <= 0) return;

  const payload = {
    UserId: this.userId,
    UserType: this.userType,
    Amount: this.stake().toString(),
    Odd: b.price.toString(),
    BetType: b.type,
    SelectionID: [b.selectionId.toString()],
    MarketbookID: b.marketId,
    MarketbookName: b.marketName,
    Selectionname: b.selectionName,
    RunnersCount: b.runnersCount?.toString(),
    Betslipamountlabel: this.loss().toFixed(2).toString(),
    Betslipsize: b.size.toString(),
    Clickedlocation: b.Clickedlocation
  };
  
   const limits = this.getBetLimits(
  b.categoryName || '',
  b.marketName
);

const lowerLimit = limits.lowerbetlimit;
const upperLimit = limits.betupperlimit;

const amount = Number(this.stake());


// ✅ CLIENT SIDE VALIDATION
if (amount < lowerLimit || amount > upperLimit) {

 this.errorMessage.set(
  `Bet amount should be between ${lowerLimit} and ${upperLimit}`
);

  return;
}

  this.submitting.set(true);

  this.userbetService.validateBet(payload)
    .pipe(
      switchMap((res: any) => {

        // ✅ HANDLE VALIDATION HERE (NO THROW)
        if (!res.success) {
          return throwError(() => new Error(res.message));
        }

        // ✅ STEP 2: PLACE BET
        return this.userbetService.insertUserBet(payload);
      }),

      switchMap(() =>
        this.userbetService.refreshUserBets(this.userId.toString())
      ),

      finalize(() => {
        this.submitting.set(false);
      })
    )
    .subscribe({
      next: (res) => {    
        // global update
        this.userbetService.notifyBetPlaced();

        // clear slip
        this.betSlipService.clear();

      },

      error: (err) => {

        // ❗ important: show validation / API error properly
this.errorMessage.set(
  err?.message || 'Bet failed'
);
        // ensure UI reset safety
        this.submitting.set(false);
      }
    });
}

getBetLimits(categoryname: string, marketbookname: string) {

  let lowerbetlimit = 0;
  let betupperlimit = 0;

  // ✅ FANCY
  if (categoryname === 'Fancy') {

    lowerbetlimit = this.userlimit.betLowerLimitFancy;
    betupperlimit = this.userlimit.betUpperLimitFancy;

  } else {

    // ✅ HORSE RACING WIN
    if (
      categoryname.includes('Horse Racing') &&
      !marketbookname.includes('To Be Placed')
    ) {

      lowerbetlimit = this.userlimit.betLowerLimit;
      betupperlimit = this.userlimit.betUpperLimit;
    }

    // ✅ HORSE RACING PLACE
    else if (
      categoryname.includes('Horse Racing') &&
      marketbookname.includes('To Be Placed')
    ) {

      lowerbetlimit = this.userlimit.betLowerLimitHorsePlace;
      betupperlimit = this.userlimit.betUpperLimitHorsePlace;
    }

    // ✅ GREYHOUND PLACE
    else if (
      categoryname.includes('Greyhound Racing') &&
      marketbookname.includes('To Be Placed')
    ) {

      lowerbetlimit = this.userlimit.betLowerLimitGrayHoundPlace;
      betupperlimit = this.userlimit.betUpperLimitGrayHoundPlace;
    }

    // ✅ GREYHOUND WIN
    else if (
      categoryname.includes('Greyhound Racing') &&
      !marketbookname.includes('To Be Placed')
    ) {

      lowerbetlimit = this.userlimit.betLowerLimitGrayHoundWin;
      betupperlimit = this.userlimit.betUpperLimitGrayHoundWin;
    }

    // ✅ COMPLETED MATCH
    else if (marketbookname.includes('Completed Match')) {

      lowerbetlimit = this.userlimit.betLowerLimitCompletedMatch;
      betupperlimit = this.userlimit.betUpperLimitCompletedMatch;
    }

    // ✅ INNINGS RUNS
    else if (
      marketbookname.includes('Innings Runs') ||
      marketbookname.includes('Inns Runs')
    ) {

      lowerbetlimit = this.userlimit.betLowerLimitInningsRuns;
      betupperlimit = this.userlimit.betUpperLimitInningsRuns;
    }

    // ✅ TENNIS
    else if (categoryname === 'Tennis') {

      lowerbetlimit = this.userlimit.betLowerLimitMatchOddsTennis;
      betupperlimit = this.userlimit.betUpperLimitMatchOddsTennis;
    }

    // ✅ SOCCER
    else if (categoryname === 'Soccer') {

      lowerbetlimit = this.userlimit.betLowerLimitMatchOddsSoccer;
      betupperlimit = this.userlimit.betUpperLimitMatchOddsSoccer;
    }

    // ✅ TIED MATCH
    else if (marketbookname.includes('Tied Match')) {

      lowerbetlimit = this.userlimit.betLowerLimitTiedMatch;
      betupperlimit = this.userlimit.betUpperLimitTiedMatch;
    }

    // ✅ WINNER / TOSS
    else if (
      marketbookname.includes('Winner') ||
      marketbookname.includes('To Win the Toss')
    ) {

      lowerbetlimit = this.userlimit.betLowerLimitWinner;
      betupperlimit = this.userlimit.betUpperLimitWinner;
    }

    // ✅ DEFAULT MATCH ODDS
    else {

      lowerbetlimit = this.userlimit.betLowerLimitMatchOdds;
      betupperlimit = this.userlimit.betUpperLimitMatchOdds;
    }
  }

  return {
    lowerbetlimit,
    betupperlimit
  };
}
}
