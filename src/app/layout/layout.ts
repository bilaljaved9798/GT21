import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../Services/auth-service';
import { Dashboardservices } from '../Services/dashboardservices';
import { StorageService } from '../Services/storage-service';
import { UserbetService } from '../Services/userbet-service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  openMenu: string = '';

  isHorseAllowed = true;
  isGreyhoundAllowed = true;
  showSection: string = '';
  soccerMatches: any[] = [];
  loading = false;
  selectedSport: string = '';
  sidebarOpen: boolean = true;
  userName = '';
  AccountBalance= 0;
  userId: any;
  userTypeId = 0;
  currentBalance = 0;
  currentLiability = 0;
  showUserMenu = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private dashboardservices: Dashboardservices,
    @Inject(PLATFORM_ID) private platformId: Object,
    private storage: StorageService,
    private userbetService: UserbetService
  ) {
    const info = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    const user = info?.user || info;
    this.userId = user?.id;
    this.userName = user?.userName || user?.username || '';
    this.currentLiability = Number(user?.currentLiabality || user?.CurrentLiabality || user?.currentLiability || user?.liability || 0);
    this.AccountBalance = Number(user?.AccountBalance || user?.accountBalance || 0);

    // Subscribe to bet placement events to update liability
    this.userbetService.betPlaced$.subscribe(() => {
      this.refreshLiability();
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.showUserMenu = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  toggleMenu(menu: string) {
    if (menu === 'sports') {
      this.openMenu = this.openMenu === menu ? '' : menu;
      this.selectedSport = '';
      this.soccerMatches = [];
      this.loading = false;
      return;
    }

    this.openMenu = this.openMenu === menu ? '' : menu;
  }

  selectSport(sport: string) {
    this.selectedSport = sport;
    this.loading = true;

    if (!this.userId) {
      console.error('User missing');
      this.loading = false;
      return;
    }

    let typeId = 0;

    switch (sport) {
      case 'Cricket': typeId = 4; break;
      case 'Soccer': typeId = 1; break;
      case 'Tennis': typeId = 2; break;
    }

    this.dashboardservices.getInPlaySoccer(this.userId, typeId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.soccerMatches = res?.page || res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadHorse(typeId: number) {
    this.loadEventType('horse', typeId);
  }

  loadCricket(typeId: number) {
    this.loadEventType('Cricket', typeId);
  }

  loadGreyhound(typeId: number) {
     this.loadEventType('Greyhound', typeId);
  }

  goTo(page: string) {
  if(page === 'pl') {
    this.router.navigate(['/pl']);
  } else if(page === 'ledger') {
    this.router.navigate(['/ledger']);
  } else {
    //this.router.navigate(['/dashboard']);
  }
}
gohome() {
  this.router.navigate(['/dashboard']);  
}

canManageUsers() {
  return [1, 2, 8, 9].includes(this.userTypeId);
}

canViewActivity() {
  return this.userTypeId === 1;
}

canAddCredit() {
  return [2, 8, 9].includes(this.userTypeId);
}

canUseAdminTools() {
  return this.userTypeId === 1;
}

  openMarket(match: any) {
    this.router.navigate(['/market'], {
      state: { match: match },
      queryParams: { id: match.marketId}
    });
  }

  private loadEventType(menu: string, typeId: number) {
    if (this.openMenu === menu) {
      this.openMenu = '';
      return;
    }

    if (!this.userId) {
      console.error('User missing');
      return;
    }

    this.openMenu = menu;
    this.loading = true;
    this.soccerMatches = [];

    this.dashboardservices.getInPlaySoccer(this.userId, typeId).subscribe({
      next: (res: any) => {
        this.soccerMatches = res?.page || res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('API ERROR:', err);
        this.loading = false;
      }
    });
  }

  setSidebarDefault() {
    if (isPlatformBrowser(this.platformId)) {
      if (window.innerWidth <= 768) {
        this.sidebarOpen = false;
      } else {
        this.sidebarOpen = true;
      }
    }
  }

  refreshLiability() {
    if (!this.userId) return;

    this.dashboardservices.getUserBalance(this.userId).subscribe({
      next: (res) => {
        // Update liability from API response
        this.currentLiability = Number(res?.page || 0);
        this.AccountBalance = Number(res?.accountBalance || res?.AccountBalance || this.AccountBalance);
      },
      error: (err) => {
        console.error('Error fetching user balance:', err);
      }
    });
  }

  ngOnInit() {
    this.setSidebarDefault();
    this.refreshLiability(); // Initial liability load
  }

  @HostListener('window:resize', [])
  onResize() {
    this.setSidebarDefault();
  }
}
