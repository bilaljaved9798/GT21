import { Component, signal } from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { PlService } from '../../Services/pl-service';
import { StorageService } from '../../Services/storage-service';

@Component({
  selector: 'app-ledger',
  imports: [MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  FormsModule,MatButtonModule,MatCheckboxModule,CommonModule],
  templateUrl: './ledger.html',
  styleUrl: './ledger.css',
})

export class Ledger {
 loading = signal(false);

  fromDate = new Date();
  toDate = new Date();
  userid: any;
   reports = signal<any[]>([]);
  constructor(private plService: PlService,private storage: StorageService) {
     const info = this.storage.get<any>('userInfo');
    this.userid = info?.user?.id;
  }

  ngOnInit(): void {
    // default dates
    const today = new Date();
    this.fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.toDate = today;
  }
formatDate(date: Date): string {

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }
  loadReport() {

    this.loading.set(true);

    const payload = {

      DateFrom: this.formatDate(this.fromDate),
      DateTo: this.formatDate(this.toDate),
      UserID: this.userid,
    };

    this.plService.getLedger(payload)
      .subscribe({
        next: (res: any) => {

          this.reports.set(res.useraccount);

          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }
}
