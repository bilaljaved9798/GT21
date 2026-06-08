import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class PlService {
constructor(private http: HttpClient) {}

  baseUrl = environment.apiBaseUrl;

  getBalanceDetails() {

    return this.http.get(
      `${this.baseUrl}DashBoard/GetBalnceDetails`
    );
  }

  getProfitLoss(payload: any) {
    return this.http.post(
      `${this.baseUrl}DashBoardApi/ProfitandLoss`,
      payload
    );
  }

   getLedger(payload: any) {
    return this.http.get(
      `${this.baseUrl}DashBoardApi/LedgerDetails`,
      { params: { DateFrom: payload.DateFrom, DateTo: payload.DateTo, UserID: payload.UserID,isCredit: false } }
    );
  }
}
