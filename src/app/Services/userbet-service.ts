import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UserbetService {
   private baseUrl = environment.apiBaseUrl;
   
  constructor(private http: HttpClient) { }

  getUserBets(userId: number) {
    return this.http.get<any>(`${this.baseUrl}UserBetApi/GetUserBets?userId=${userId}`);
  }
  insertUserBet(betData: any) {
    return this.http.post<any>(`${this.baseUrl}UserBetApi/InsertUserBet`, betData);
  }
}
