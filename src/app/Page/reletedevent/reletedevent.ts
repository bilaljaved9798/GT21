import { CommonModule } from '@angular/common';
import { Component, Input, input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InPlayMatch } from '../../interface/in-play-matches';
import { Dashboardservices } from '../../Services/dashboardservices';
import { MarketBook } from '../../interface/MarketBook';
import { StorageService } from '../../Services/storage-service';

@Component({
  selector: 'app-reletedevent',
  imports: [CommonModule, FormsModule],
  templateUrl: './reletedevent.html',
  styleUrl: './reletedevent.css',
})
export class Reletedevent implements OnChanges {

  @Input() eventType!: string;
  @Input() marketId!: string;
  events: InPlayMatch[] = [];
  marketbook: MarketBook | null = null;
  constructor(private router: Router, private deshboardService: Dashboardservices, private storage: StorageService) {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['eventType'] || changes['marketId']) {

      this.loadRelatedEvents();

    }
  }

  ngOnInit(): void {
    this.loadRelatedEvents();
  }

  loadRelatedEvents() {

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


  openMarket(match: any) {

    const market: MarketBook = {
      marketId: match.marketCatalogueID,
      eventID: match.eventID,
      marketBookName: match.eventName,
      mainSportsname: this.eventType,
      orignalOpenDate: match.eventOpenDate
    } as MarketBook;

    this.storage.set('selectedMarket', market);

    this.router.navigate(['/market'], {
      queryParams: {
        id: match.marketCatalogueID
      }
    });

  }
}
