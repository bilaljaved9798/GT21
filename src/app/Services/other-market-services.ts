import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class OtherMarketServices {
  private baseUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient, private storage: StorageService) {}
  GetEvenOdd(eventId: string): Observable<any[]> {
    const info = this.storage.get<any>('userInfo');
    return this.http.get<any[]>(
      `${this.baseUrl}FigureApi/GetEvenOdd?eventID=${eventId}}`
    );
  }
}
