import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { StorageService } from './storage-service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;
  public errorMessage: any = {}
  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private storage: StorageService,) { }

  login(username: string, password: string) {
    return this.http
      .post<any>(this.baseUrl + 'AccountApi', { username, password })
      .pipe(
        tap((response: any) => {
          if (isPlatformBrowser(this.platformId)) {
            this.storage.set('userInfo', response);
            this.storage.set('authToken', response.token);
            sessionStorage.setItem('authToken', response.token);
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }
  logout() {
    this.storage.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem('authToken');
  }

  getUserInfo(): any {
    if (typeof window !== 'undefined') {
      try {
        const data = sessionStorage.getItem('userInfo');
        return data ? JSON.parse(data) : {};
      } catch (e) {
        return {};
      }
    }
    return {};
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

}

