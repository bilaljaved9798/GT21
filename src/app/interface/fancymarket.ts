export interface FancyMarket  {
  AdjustmentFactor?: number | null;
  Average?: string;
  BackSize?: string;
  Backprice?: string;
  BettingAllowed?: boolean;
  Clothnumber?: string;
  ExchangePrices?: any; // You can define a proper interface if needed
  Handicap?: number | null;
  JockeyName?: string;
  LastPriceTraded?: number | null;
  LaySize?: string;
  Layprice?: string;
  Loss: number;
  MarketBookID: string;
  MarketStatusStr?: string;
  Matches?: any[]; // Replace with proper interface if available
  Orders?: any[];  // Replace with proper interface if available
  ProfitandLoss: number;
  RemovalDate?: Date | null;
  RunnerName: string;
  SelectionId: string;
  StallDraw?: string;
  StartingPrices?: any; // Define later if needed
  Status?: any;         // Enum or interface can be created
  StatusStr?: string;
  TotalMatched: number;
  TotalMatchedStr?: string;
  WearingDesc?: string;
  WearingURL?: string;
  isShow: boolean;
}

export interface Datum {
    gmid: number;
    mid: string;
    pmid: any;
    mname: string;
    rem: string;
    gtype: string;
    status: string;
    rc: number;
    visible: boolean;
    pid: number;
    gscode: number;
    maxb: number;
    sno: number;
    dtype: number;
    ocnt: number;
    m: number;
    max: number;
    min: number;
    biplay: boolean;
    umaxbof: number;
    boplay: boolean;
    iplay: boolean;
    btcnt: number;
    company: any;
    section: Section[];
}

export interface Section {
    mid: any;
    sid: number;
    psid: number;
    sno: number;
    psrno: number;
    gstatus: string;
    nat: string;
    gscode: number;
    max: number;
    min: number;
    rem: string;
    br: boolean;
    rname: any;
    jname: any;
    tname: any;
    hage: number;
    himg: any;
    adfa: number;
    rdt: any;
    cno: any;
    sdraw: any;
    odds: Odd[];
}

export interface Odd {
    sid: number;
    psid: number;
    odds: number;
    otype: string;
    oname: string;
    tno: number;
    size: number;
}