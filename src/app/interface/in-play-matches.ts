import { Runner } from "./MarketBook";

export interface InPlayMatch {
  eventTypeID: string;
  eventName: string;
  marketStatus: string;
  competitionID: string;
  competitionName: string;
  eventID: string;
  marketCatalogueID: string;
  marketCatalogueName: string;
  eventTypeName: string;
  runners: Runner[];
  sheetName: string;
  associateEventID: string;
  eventOpenDate: Date ;
  selectionName: string;
  selectionID: string;
  countryCode: string;
}
