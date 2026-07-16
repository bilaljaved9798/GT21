import { Injectable } from '@angular/core';
import { BetSlipKeys } from '../interface/BetSlipKeys ';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StorageService } from './storage-service';
@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClient,private storage: StorageService) {}
   private baseUrl = environment.apiBaseUrl;

  getBetSlipKeys() {
    return this.http.get<BetSlipKeys>(
      `${this.baseUrl}/accounts/GetBetSlipKeys`
    );
  }

  updateBetSlipKeys(model: BetSlipKeys) {
    const info = this.storage.get<any>('userInfo');
    model.UserID = info?.user?.id;
    return this.http.post(
      `${this.baseUrl}DashBoardApi/UpdateBetSlipKeys`,
      model
    );
  }
}
