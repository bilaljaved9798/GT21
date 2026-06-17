import { ChangeDetectorRef, Component } from '@angular/core';
import { Dashboardservices } from '../../Services/dashboardservices';
import { AuthService } from '../../Services/auth-service';
import { Router } from '@angular/router';
import { MarketBook } from '../../interface/MarketBook';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  eventTypes: string[] = [
    'Cricket',
    'Soccer',
    'Tennis',
    'Horse Racing',
    'Greyhound Racing'
  ];
  allMarkets: MarketBook[] = [];
  activeCategory: string = '';
  groupedMarkets: { [key: string]: any[] } = {};
  constructor(
    private router: Router,
    private authService: AuthService,
    public _dashboardServices: Dashboardservices, private cdr: ChangeDetectorRef
  ) {
  }

ngOnInit(): void {
    this.functionDashboard();
  }

 getMarketsByEventType(eventType: string) {

  return [...new Map(
    this.allMarkets
      .filter(m => m.mainSportsname === eventType)
      .map(item => [item.marketId, item]) // distinct by marketId
  ).values()];
}

  functionDashboard() {
    this._dashboardServices.getDefultDashboards()
      .subscribe(res => {
        this.allMarkets = res.page.allMarkets;
       this.allMarkets.forEach(market => {
         if (!this.groupedMarkets[market.mainSportsname]) {
          this.groupedMarkets[market.mainSportsname] = [];
        }
        this.groupedMarkets[market.mainSportsname].push(market);
        });

   if (this.eventTypes.length > 0) {
       this.activeCategory = this.eventTypes[0];
    }
        this.cdr.markForCheck();
  });
  }

   setActiveCategory(category: string) {
     this.activeCategory = category;
   }
  getCount(category: string): number {
    return new Set(
  this.allMarkets
    .filter(x => x.mainSportsname === category)
    .map(x => x.marketId)
).size;
    //return this.allMarkets.filter(x => x.mainSportsname === category).length;
  }


addHours(dateValue: any, hours: number): Date {
  const date = new Date(dateValue);
  date.setHours(date.getHours() + hours);
  return date;
}

  normalizeCategory(item: string): string {
    if (item === 'Horse Racing') return 'Horse';
    if (item === 'Greyhound Racing') return 'Greyhound';
    return item;
  }

  isRacing(item: string): boolean {
    return item === 'Horse Racing' || item === 'Greyhound Racing';
  }

  getCaretColor(match: any, isCricket: boolean): string {
    if (isCricket && match.MarketBookName === 'Winner') return 'green';
    switch (match.MarketStatus) {
      case 'In Play': return 'green';
      case 'Closed':
      case 'suspended': return '#bb2d3b';
      default: return 'black';
    }
  }

  getMatchStatusColor(match: any): string {
    switch (match.MarketStatus) {
      case 'In Play': return 'green';
      case 'Closed':
      case 'suspended': return '#bb2d3b';
      default: return 'black';
    }
  }

 openMarket(match: any) {
  this.router.navigate(['/market'], {
    state: { match: match },
    queryParams: { id: match.marketId}
  });
}

}

