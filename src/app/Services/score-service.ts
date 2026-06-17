import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  
constructor(private http: HttpClient) {}
  baseUrl = environment.apiBaseUrl;

  getMatchScore(eventId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}CricketScoreApi/CreateScoreCard?EventID=${eventId}`
    );
  }
  getMatchTennisScore(eventId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}CricketScoreApi/CreateScoreCard?EventID=${eventId}`
    );
  }
  getothersportsScore(eventId: string, userId: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}CricketScoreApi/GetOtherSoccer?EventID=${eventId};userId=${userId}  `
    );
  }
}
