import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlService } from '../../Services/pl-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { StorageService } from '../../Services/storage-service';

@Component({
  selector: 'app-pl',
  imports: [ MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule,MatButtonModule,MatCheckboxModule,CommonModule],
  templateUrl: './pl.html',
  styleUrl: './pl.css',
})
export class Pl {
  userid: any;
constructor(private plService: PlService, private storage: StorageService) {
      const info = this.storage.get<any>('userInfo');
    this.userid = info?.user?.id;
}

  loading = signal(false);

  fromDate = new Date();
  toDate = new Date();

  chkSession = false;
  chkFancy = false;
  chkByMarket = false;
  chkByMarketCricket = false;

  reports = signal<any[]>([]);
  balance = signal<any>(null);

  ngOnInit(): void {

    // default dates
    const today = new Date();

    const oldDate = new Date();
    oldDate.setDate(today.getDate() - 5);

    this.fromDate = oldDate;
    this.toDate = today;

    // load balance
    this.loadBalanceDetails();
  }

  formatDate(date: Date): string {

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  loadBalanceDetails() {

    this.loading.set(true);

    this.plService.getBalanceDetails()
      .subscribe({
        next: (res) => {

          this.balance.set(res);

          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  loadReport() {

    this.loading.set(true);

    const payload = {

      DateFrom: this.formatDate(this.fromDate),
      DateTo: this.formatDate(this.toDate),
      UserID: this.userid,

      chkseassion: this.chkSession,
      chkfancy: this.chkFancy,
      chkByMarket: this.chkByMarket,
      chkByMarketCricket: this.chkByMarketCricket
    };

    this.plService.getProfitLoss(payload)
      .subscribe({
        next: (res: any) => {

          this.reports.set(res);

          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }
}
