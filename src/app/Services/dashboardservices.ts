import { Injectable } from '@angular/core';

import { StorageService } from './storage-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Dashboardservices {
  
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient,private storage: StorageService) { }

  getDefultDashboards() {
    return this.http.get<any>(
      `${this.baseUrl}DashBoardApi/GetDefaultPageData?userid=160`);
  }

  getUserBalance(userId: number) {
    return this.http.get<any>(`${this.baseUrl}DashBoardApi/GetBalnceDetails?userId=${userId}`);
  }

  getInPlaySoccer(userid: number, typeId: number) {
    return this.http.get<any>(`${this.baseUrl}DashBoardApi/InPlayMatches?userid=${userid}&mainSportsCategory=${typeId}`);
  }

  GetSoccerMarkets(eventId: string) {
    return this.http.get<any>(`${this.baseUrl}DashBoardApi/GetSoccerMarkets?eventId=${eventId}`);
  }
}
