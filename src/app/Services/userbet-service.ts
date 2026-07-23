import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserBet } from '../interface/userbets';
import { Subject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserbetService {
   private baseUrl = environment.apiBaseUrl;
    private userBetsSource = new Subject<any>();
    private userAllBetsSource = new Subject<any>();
    
    private betPlacedSource = new Subject<void>();
   
     // Public observable
     userBets$ = this.userBetsSource.asObservable();
     userAllBets$ = this.userAllBetsSource.asObservable();
     betPlaced$ = this.betPlacedSource.asObservable();
  constructor(private http: HttpClient) { }

getUserBets1(userId: string) {
  return this.http.get<UserBet[]>(
    `${this.baseUrl}UserBetApi/UserBets`,
    { params: { userId } }
  );
}

 getUserBets(userId: string) {
    this.http.get<any>(
      `${this.baseUrl}UserBetApi/UserBets?UserId=${userId}`
    )
    .subscribe(res => {
      this.userBetsSource.next(res);
    });
  }

  refreshUserBets(userId: string) {
    return this.http.get<any>(
      `${this.baseUrl}UserBetApi/UserBets?UserId=${userId}`
    ).pipe(
      tap(res => this.userBetsSource.next(res))
    );
  }
  
  insertUserBet(betData: any) {
    return this.http.post<any>(`${this.baseUrl}UserBetApi/InsertUserBet`, betData);
  }

  notifyBetPlaced() {
    this.betPlacedSource.next();
  }
   deleteBet(id: number) {
    return this.http.delete(`/api/userbets/${id}`);
  }

  cancelBets(ids: number[]) {
    return this.http.post('/api/userbets/cancel', ids);
  }

  validateBet(payload: any) {
  return this.http.post<any>(
    `${environment.apiBaseUrl}UserBetApi/CheckforPlaceBet`,
    payload
  );
}
 getAllUserBets(userId: string) {
   return this.http.get<any>(
      `${this.baseUrl}UserBetApi/UserAllBets?UserId=${userId}`
    )
  }

}
