import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { environment } from '../environments/environments';
import {  map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FancyMarket } from '../interface/fancymarket';
import { MarketBook } from '../interface/MarketBook';

@Injectable({ providedIn: 'root' })
export class MarketService {
    private baseUrl = environment.apiBaseUrl;

     private marketsSource = new BehaviorSubject<any>(null);
  markets$ = this.marketsSource.asObservable();

  private destroy$ = new Subject<void>();
  
    AllMarkets: any[] = []; // Store all markets for later use
  constructor(private http: HttpClient) {}

 startPolling(eventId: string, marketId: string, userId: string) {

    interval(2000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.http.get<any>(
            `${this.baseUrl}Fancy2MarketAPI/LoadFancyMarketIN` +
            `?EventID=${eventId}` +
            `&MarketBookID=${marketId}` +
            `&UserId=${userId || ''}`
          )
        )
      )
      .subscribe(res => {

        let parsed: any = {};

        try {
          parsed = res?.page ? JSON.parse(res.page) : {};
        } catch {
          parsed = {};
        }

        // ✅ Update global store
        this.marketsSource.next(parsed);
      });
  }

  // 🔥 Stop polling (important)
  stopPolling() {
    this.destroy$.next();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
 getMarkets(model: any): Observable<MarketBook> {
  return this.http.get<any>(
    `${this.baseUrl}MarketApi/MarketBookData` +
    `?ID=${model.selectedMarketId}` +
    `&sheetname=${model.selectedMarketBook}` +
    `&MainSportsCategory=${model.selectedSport}` +
    `&userId=${model.userId || ''}`
  ).pipe(

    tap(res => console.log('API Response:', res)),
    
    map(res => ({
      openDate: res.OpenDate,
      runnersCount: res.RunnersCount,
      marketId: res.MarketId,
      marketBookName: res.MarketBookName,
      marketsopened: res.Marketsopened,
      mainSportsname: res.MainSportsname,
      orignalOpenDate: res.OrignalOpenDate,
      sheetName: res.SheetName,
      bettingAllowed: res.BettingAllowed,
      bettingAllowedOverAll: res.BettingAllowedOverAll,
      totalMatched: res.TotalMatched,
      favoriteSelectionName: res.FavoriteSelectionName,
      favoriteID: res.FavoriteID,
      favoriteBack: res.FavoriteBack,
      favoriteBackSize: res.FavoriteBackSize,
      favoriteLay: res.FavoriteLay,
      favoriteLaySize: res.FavoriteLaySize,
      marketStatusstr: res.MarketStatusstr,
      lineVMarkets: res.LineVMarkets,
      cricketMatchKey: res.CricketMatchKey,
      getMatchUpdatesFrom: res.GetMatchUpdatesFrom,
      eventID: res.EventID,

      // 🔥 Nested Runners Mapping
      runners: res.Runners?.map((r: any) => ({
        selectionId: r.SelectionId,
        runnerName: r.RunnerName,
        statusStr: r.StatusStr,
        jockeyName: r.JockeyName,
        stallDraw: r.StallDraw,
        clothnumber: r.Clothnumber,
        wearingURL: r.WearingURL,
        profitandLoss: r.ProfitandLoss,
        loss: r.Loss,
        lastPriceTraded: r.LastPriceTraded,
        totalMatched: r.TotalMatched,

        exchangePrices: {
          availableToBack: r.ExchangePrices?.AvailableToBack?.map((b: any) => ({
            price: b.Price,
            size: b.Size
          })) || [],

          availableToLay: r.ExchangePrices?.AvailableToLay?.map((l: any) => ({
            price: l.Price,
            size: l.Size
          })) || []
        }
      })) || []
    }))
  );
}

  getMarketsFancy(eventId: string, marketId: string, userId: string): Observable<FancyMarket[]> {

  return this.http.get<any>(
    `${this.baseUrl}Fancy2MarketAPI/LoadFancyMarketIN` +
    `?EventID=${eventId}` +
    `&MarketBookID=${marketId}` +
    `&UserId=${userId || ''}`
  ).pipe(
    map(res => {

      // ✅ STEP 1: Parse JSON string
      const parsed = res?.page ? JSON.parse(res.page) : [];
      this.AllMarkets = parsed; // Store all markets for later use
      // ✅ STEP 2: Ensure it's array
      const runners = Array.isArray(parsed.session) ? parsed.session  : parsed?.Runners || [];

      // ✅ STEP 3: Map data
      return runners.map((r: any): FancyMarket => ({
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

        Loss: r.Loss,

        MarketBookID: r.MarketBookID,
        MarketStatusStr: r.GameStatus,

        Matches: r.Matches || [],
        Orders: r.Orders || [],

        ProfitandLoss: r.ProfitandLoss,

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
    })
  );
}

  getMarketsLine(eventId: string, userId: string): Observable<MarketBook[]> {

  return this.http.get<any[]>(
    `${this.baseUrl}FancyApi/GetFancyMarket` +
    `?EventID=${eventId}` +
    `&UserId=${userId || ''}`
  ).pipe(
    map(res => res.map(m => ({
      openDate: m.OpenDate,
      runnersCount: m.RunnersCount,
      marketId: m.MarketId,
      marketBookName: m.MarketBookName,
      marketsopened: m.Marketsopened,
      mainSportsname: m.MainSportsname,
      orignalOpenDate: m.OrignalOpenDate,
      sheetName: m.SheetName,
      bettingAllowed: m.BettingAllowed,
      bettingAllowedOverAll: m.BettingAllowedOverAll,
      totalMatched: m.TotalMatched,
      favoriteSelectionName: m.FavoriteSelectionName,
      favoriteID: m.FavoriteID,
      favoriteBack: m.FavoriteBack,
      favoriteBackSize: m.FavoriteBackSize,
      favoriteLay: m.FavoriteLay,
      favoriteLaySize: m.FavoriteLaySize,
      marketStatusstr: m.MarketStatusstr,
      lineVMarkets: m.LineVMarkets,
      cricketMatchKey: m.CricketMatchKey,
      getMatchUpdatesFrom: m.GetMatchUpdatesFrom,
      eventID: m.EventID,

      // 🔥 Nested Runners Mapping
      runners: m.Runners?.map((r: any) => ({
        selectionId: r.SelectionId,
        runnerName: r.RunnerName,
        statusStr: r.StatusStr,
        jockeyName: r.JockeyName,
        stallDraw: r.StallDraw,
        clothnumber: r.Clothnumber,
        wearingURL: r.WearingURL,
        profitandLoss: r.ProfitandLoss,
        loss: r.Loss,
        lastPriceTraded: r.LastPriceTraded,
        totalMatched: r.TotalMatched,

        exchangePrices: {
          availableToBack: r.ExchangePrices?.AvailableToBack?.map((b: any) => ({
            price: b.Price,
            size: b.Size
          })) || [],

          availableToLay: r.ExchangePrices?.AvailableToLay?.map((l: any) => ({
            price: l.Price,
            size: l.Size
          })) || []
        }
      })) || []
    }))
  ));
}

gettoss(eventId: string, marketId: string, userId: string): Observable<any[]> {

   return this.http.get<any>(
    `${this.baseUrl}Fancy2MarketAPI/LoadFancyMarketIN` +
    `?EventID=${eventId}` +
    `&MarketBookID=${marketId}` +
    `&UserId=${userId || ''}`
  ).pipe(
    map(res => {

      // ✅ STEP 1: Parse JSON string
      const parsed = res?.page ? JSON.parse(res.page) : [];
      this.AllMarkets = parsed; // Store all markets for later use
      // ✅ STEP 2: Ensure it's array
      const runners = Array.isArray(parsed.session) ? parsed.session  : parsed?.Runners || [];

      // ✅ STEP 3: Return runners
      return parsed;
    })
  );
}
gettied(eventId: string, marketId: string, userId: string): Observable<any[]> {

   return this.http.get<any>(
    `${this.baseUrl}Fancy2MarketAPI/LoadFancyMarketIN` +
    `?EventID=${eventId}` +
    `&MarketBookID=${marketId}` +
    `&UserId=${userId || ''}`
  ).pipe(
    map(res => {

      // ✅ STEP 1: Parse JSON string
      const parsed = res?.page ? JSON.parse(res.page) : [];
      this.AllMarkets = parsed; // Store all markets for later use
      // ✅ STEP 2: Ensure it's array
      const runners = Array.isArray(parsed.session) ? parsed.session  : parsed?.Runners || [];

      // ✅ STEP 3: Return runners
      return parsed;
    })
  );
}
}
