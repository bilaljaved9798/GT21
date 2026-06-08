import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subject, timer } from 'rxjs';
import { map, switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import { FancyMarket } from '../interface/fancymarket';
import { MarketBook } from '../interface/MarketBook';
import { StorageService } from './storage-service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MarketService {
  private baseUrl = environment.apiBaseUrl;

  private marketsSource = new BehaviorSubject<any>(null);
  markets$ = this.marketsSource.asObservable();
  userid: any;
  private destroy$ = new Subject<void>();

  AllMarkets: any[] = []; // Store all markets for later use
  constructor(private http: HttpClient, protected storage: StorageService) {
    const info = this.storage.get<any>('userInfo');
    this.userid = info?.user?.id;
  }

  startPolling(eventId: string, marketId: string, userId: string) {
    timer(0, 3000) // Increased to 3 seconds to reduce server load
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.http.get<any>(
            `${this.baseUrl}Fancy2MarketAPI/LoadFancyMarketIN` +
            `?EventID=${eventId}` +
            `&MarketBookID=${marketId}` +
            `&UserId=${this.userid || ''}`
          ).pipe(
            catchError(error => {
              if (error.name === 'AbortError' || error.status === 0) {
                console.log('Fancy polling request cancelled');
                return [null]; // Return null to prevent errors
              }
              throw error;
            })
          )
        )
      )
      .subscribe({
        next: res => {
          if (res === null) return; // Skip cancelled requests

          let parsed: any = {};

          try {
            parsed = res?.page ? JSON.parse(res.page) : {};
          } catch {
            parsed = {};
          }

          // ✅ Update global store
          this.marketsSource.next(parsed);
        },
        error: err => {
          console.error('Fancy polling error:', err);
        }
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
      `&userId=${this.userid || ''}`
    ).pipe(
      map(res => {
        const marketBook = Array.isArray(res)
          ? res[0]
          : (Array.isArray(res?.marketbook) ? res.marketbook[0] : res);

        return ({
          openDate: marketBook.OpenDate,
          runnersCount: marketBook.RunnersCount,
          marketId: marketBook.MarketId,
          marketBookName: marketBook.MarketBookName,
          marketsopened: marketBook.Marketsopened,
          mainSportsname: marketBook.MainSportsname,
          orignalOpenDate: marketBook.OrignalOpenDate,
          sheetName: marketBook.SheetName,
          bettingAllowed: marketBook.BettingAllowed ?? marketBook.bettingAllowed ?? false,
          bettingAllowedOverAll: marketBook.BettingAllowedOverAll ?? marketBook.bettingAllowedOverAll,
          totalMatched: marketBook.TotalMatched,
          favoriteSelectionName: marketBook.FavoriteSelectionName,
          favoriteID: marketBook.FavoriteID,
          favoriteBack: marketBook.FavoriteBack,
          favoriteBackSize: marketBook.FavoriteBackSize,
          favoriteLay: marketBook.FavoriteLay,
          favoriteLaySize: marketBook.FavoriteLaySize,
          marketStatusstr: marketBook.MarketStatusstr,
          lineVMarkets: marketBook.LineVMarkets,
          cricketMatchKey: marketBook.CricketMatchKey,
          getMatchUpdatesFrom: marketBook.GetMatchUpdatesFrom,
          eventID: marketBook.EventID,

          // 🔥 Nested Runners Mapping
          runners: marketBook.Runners?.map((r: any) => ({
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
        });
      })
    );
  }

  SetmarketOpen(marketId: string) {
  return this.http.get<boolean>(
    `${this.baseUrl}MarketApi/SetmarketOpen?ID=${marketId}`
  );
}

  getMarketsLine(eventId: string, userId: string): Observable<MarketBook[]> {

    return this.http.get<any[]>(
      `${this.baseUrl}FancyApi/GetFancyMarket` +
      `?EventID=${eventId}` +
      `&UserId=${this.userid || ''}`
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
      `&UserId=${this.userid || ''}`
    ).pipe(
      map(res => {

        // ✅ STEP 1: Parse JSON string
        const parsed = res?.page ? JSON.parse(res.page) : [];
        this.AllMarkets = parsed; // Store all markets for later use
        // ✅ STEP 2: Ensure it's array
        const runners = Array.isArray(parsed.session) ? parsed.session : parsed?.Runners || [];

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
        const runners = Array.isArray(parsed.session) ? parsed.session : parsed?.Runners || [];

        // ✅ STEP 3: Return runners
        return parsed;
      })
    );
  }

  getVideoUrl(sportId: number, eventId: string): Observable<string> {
    return this.http.get(
      `${this.baseUrl}MarketApi/GetTvLinks?sportId=${sportId}&eventId=${eventId}`,
      { responseType: 'text' }
    );
  }
}
