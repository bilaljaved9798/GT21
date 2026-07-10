import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InPlayMatch } from '../../interface/in-play-matches';
import { Dashboardservices } from '../../Services/dashboardservices';
import { MarketBook } from '../../interface/MarketBook';
import { StorageService } from '../../Services/storage-service';

@Component({
  selector: 'app-reletedevent',
  imports: [CommonModule,FormsModule],
  templateUrl: './reletedevent.html',
  styleUrl: './reletedevent.css',
})
export class Reletedevent {

@Input() eventType!: string;
@Input() marketId!: string;
  events: InPlayMatch[] = [];
  constructor(private router: Router,private deshboardService: Dashboardservices,private storage: StorageService) {
    
  }

  ngOnInit(): void {
    this.deshboardService.GetReletedMarkets(this.eventType, this.marketId).subscribe({
      next: res => {
        if (res && res.length > 0) {
          this.events = res;
        }
      }
    });
  }

  isPast(date: Date): boolean {
    return new Date(date).getTime() < Date.now();
  }

  formatDate(date: Date): Date {
    // Your API already returns UTC
    // Add 5 hours like MVC if required
    const d = new Date(date);
    d.setHours(d.getHours() + 5);
    return d;
  }

   isRace(item: InPlayMatch): boolean {
    return item.eventTypeName === 'Horse Racing'
        || item.eventTypeName === 'Greyhound Racing';
  }
  
   openMarket(item: any): void {

    // Scroll Top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Navigate
    this.router.navigate(['/market', item.marketCatalogueID]);

    // OR if using your service
    // this.marketService.loadMarket(item.marketCatalogueID);
  }
}
