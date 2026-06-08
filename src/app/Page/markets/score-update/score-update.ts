import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ScoreService } from '../../../Services/score-service';
import { StorageService } from '../../../Services/storage-service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { MarketBook } from '../../../interface/MarketBook';

@Component({
  selector: 'app-score-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './score-update.html',
  styleUrl: './score-update.css',
})
export class ScoreUpdate {
  scoreData: any;

  firstHalfHomeGoals: any[] = [];
  firstHalfAwayGoals: any[] = [];

  secondHalfHomeGoals: any[] = [];
  secondHalfAwayGoals: any[] = [];

  firstHalfHomeYellowCards: any[] = [];
  firstHalfAwayYellowCards: any[] = [];

  secondHalfHomeYellowCards: any[] = [];
  secondHalfAwayYellowCards: any[] = [];

  refreshSubscription?: Subscription;
  eventId: string = '';
  tennisScore: any = {
    playerA: '',
    playerB: '',
    currentSet: 0,
    setA: 0,
    setB: 0,

    playerASetScore: 0,
    playerBSetScore: 0,

    homeGame: 0,
    awayGame: 0,
    gameNumber: 0,

    homePoints: 0,
    awayPoints: 0,

    homeServiceBreaks: 0,
    awayServiceBreaks: 0
  };
  mainSportsname: string = '';
  constructor(public footballService: ScoreService, private storage: StorageService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.eventId = this.storage.get('eventID') || '';
    this.mainSportsname = (this.storage.get('selectedMarket') as MarketBook)?.mainSportsname || '';
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.eventId && this.mainSportsname === 'Soccer') {
      this.loadScore();
      this.refreshSubscription = interval(5000).subscribe(() => {
        this.loadScore();
      });
    }
    if (isPlatformBrowser(this.platformId) && this.eventId && this.mainSportsname === 'Tennis') {
      this.loadTennisScore();
      this.refreshSubscription = interval(5000).subscribe(() => {
        this.loadTennisScore();
      });
    }
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadTennisScore(): void {

    this.footballService.getMatchScore('1')
      .subscribe(res => {
var data = JSON.parse(res) || {};
        this.tennisScore = {
  playerA: data.playerA,
  playerB: data.playerB,
  currentSet: data.currentSet,
  setA: data.setA,
  setB: data.setB,
  playerASetScore: data.playerASetScore,
  playerBSetScore: data.playerBSetScore,
  homeGame: data.homeGame,
  awayGame: data.awayGame,
  gameNumber: data.gameNumber,
  homePoints: data.homePoints,
  awayPoints: data.awayPoints,
  homeServiceBreaks: data.homeServiceBreaks,
  awayServiceBreaks: data.awayServiceBreaks
}
      });

  }

  loadScore(): void {

    this.footballService.getMatchScore(this.eventId)
      .subscribe(res => {

        const scorecard = JSON.parse(res) || null;

        if (!scorecard) {
          return;
        }

        this.scoreData = scorecard;

        const updates = scorecard.updateDetails || [];

        this.firstHalfHomeGoals =
          updates.filter((x: any) =>
            x.type === 'Goal' &&
            x.team === 'home' &&
            x.matchTime <= 45);

        this.firstHalfAwayGoals =
          updates.filter((x: any) =>
            x.type === 'Goal' &&
            x.team === 'away' &&
            x.matchTime <= 45);

        this.secondHalfHomeGoals =
          updates.filter((x: any) =>
            x.type === 'Goal' &&
            x.team === 'home' &&
            x.matchTime > 45);

        this.secondHalfAwayGoals =
          updates.filter((x: any) =>
            x.type === 'Goal' &&
            x.team === 'away' &&
            x.matchTime > 45);

        this.firstHalfHomeYellowCards =
          updates.filter((x: any) =>
            x.type === 'YellowCard' &&
            x.team === 'home' &&
            x.matchTime <= 45);

        this.firstHalfAwayYellowCards =
          updates.filter((x: any) =>
            x.type === 'YellowCard' &&
            x.team === 'away' &&
            x.matchTime <= 45);

        this.secondHalfHomeYellowCards =
          updates.filter((x: any) =>
            x.type === 'YellowCard' &&
            x.team === 'home' &&
            x.matchTime > 45);

        this.secondHalfAwayYellowCards =
          updates.filter((x: any) =>
            x.type === 'YellowCard' &&
            x.team === 'away' &&
            x.matchTime > 45);
      });
  }

  get firstHalfTimelineWidth(): number {

    if (!this.scoreData) {
      return 0;
    }

    if (this.scoreData.timeElapsed >= 45) {
      return 100;
    }

    const extra = this.scoreData.timeElapsed * 2 * 0.1;

    return (this.scoreData.timeElapsed * 2) + extra;
  }

  get secondHalfTimelineWidth(): number {

    if (!this.scoreData || this.scoreData.timeElapsed <= 45) {
      return 0;
    }

    const time = this.scoreData.timeElapsed - 45;

    const extra = time * 2 * 0.1;

    return (time * 2) + extra;
  }

  firstHalfPosition(minute: number): number {
    return (minute * 2) + (minute * 2 * 0.1);
  }
  secondHalfPosition(minute: number): number {

    const time = minute - 45;

    return (time * 2) + (time * 2 * 0.1);
  }
}
