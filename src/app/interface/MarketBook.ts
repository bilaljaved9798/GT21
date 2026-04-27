export interface Runner {
  selectionId: string;
  runnerName: string;
  statusStr: string;
  jockeyName: string;
  stallDraw: string;
  clothnumber: string;
  wearingURL: string;
  profitandLoss: number;
  loss?: number;
  lastPriceTraded?: number;
  totalMatched?: number;
  exchangePrices: {
    availableToBack: { price: number; size: number }[];
    availableToLay: { price: number; size: number }[];
  };
}

export interface MarketBook {
  openDate: any;
  runnersCount: number;
  marketId: string;
  marketBookName: string;
  marketsopened: number;
  mainSportsname: string;
  orignalOpenDate: any; // ISO string
  sheetName: string;
  bettingAllowed: boolean;
  bettingAllowedOverAll: boolean;
  totalMatched: number;
  favoriteSelectionName: string;
  favoriteID: string;
  favoriteBack: number;
  favoriteBackSize: number;
  favoriteLay: number;
  favoriteLaySize: number;
  marketStatusstr: string;
  lineVMarkets?: any[];
  cricketMatchKey?: string;
  runners: Runner[];
  getMatchUpdatesFrom: string;
  eventID: string;
}