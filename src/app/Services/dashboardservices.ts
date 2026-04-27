import { Injectable } from '@angular/core';
import { environment } from '../environments/environments';
import { StorageService } from './storage-service';
import { HttpClient } from '@angular/common/http';

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

  getInPlaySoccer(userid: number, typeId: number) {
  return this.http.get<any>(`${this.baseUrl}DashBoardApi/InPlayMatches?userid=${userid}&mainSportsCategory=${typeId}`);
}
}
