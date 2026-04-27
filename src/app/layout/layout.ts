import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../Services/auth-service';
import { Dashboardservices } from '../Services/dashboardservices';
import { StorageService } from '../Services/storage-service';


@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  openMenu: string = '';

  isHorseAllowed = true;      // from API / auth
  isGreyhoundAllowed = true;  // from API / auth
  showSection: string = '';
soccerMatches: any[] = [];
loading = false;
selectedSport: string = '';
sidebarOpen: boolean = true;

  constructor(private auth: AuthService, private router: Router, private dashboardservices: Dashboardservices,@Inject(PLATFORM_ID) private platformId: Object,private storage: StorageService) { }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
  toggleMenu(menu: string) {
  if(menu === 'sports') { 
    this.openMenu = this.openMenu === menu ? '' : menu;
    return;
  }
  this.openMenu = this.openMenu === menu ? '' : menu;
  var info=JSON.parse(sessionStorage.getItem('userInfo') || '{}');

this.dashboardservices.getInPlaySoccer(info?.user.id, 7).subscribe({
  next: (res) => {
    this.soccerMatches = res.page || res;  // Adjust based on actual response structure
  },
  error: (err) => {
    console.error('API ERROR:', err);   // 👈 IMPORTANT
  }
});
}

selectSport(sport: string) {

  this.selectedSport = sport;
  this.loading = true;

  const info = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
  const userId = info?.user?.id;

  if (!userId) {
    console.error('User missing');
    return;
  }

  // 🔥 Map sport → typeId
  let typeId = 0;

  switch (sport) {
    case 'Cricket': typeId = 4; break;
    case 'Soccer': typeId = 1; break;
    case 'Tennis': typeId = 2; break;
  }

  this.dashboardservices.getInPlaySoccer(userId, typeId).subscribe({
    next: (res) => {
      console.log(res);
      this.soccerMatches = res?.page || res;
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

loadHorse(typeId: number) {

}

loadGreyhound() {
  console.log('Greyhound Racing');
}

goTo(page: string) {
  console.log('Navigate:', page);
}
openMarket(match: any) {
  this.router.navigate(['/market'], {
    state: { match: match },
    queryParams: { id: match.marketId}
  });
}
setSidebarDefault() {
  if (isPlatformBrowser(this.platformId)) {
    if (window.innerWidth <= 768) {
      this.sidebarOpen = false; 
    }else{
      this.sidebarOpen = true;
    }
  }
}

ngOnInit() {
  this.setSidebarDefault();
}
// Optional: handle resize
@HostListener('window:resize', [])
onResize() {
  this.setSidebarDefault();
}

}
