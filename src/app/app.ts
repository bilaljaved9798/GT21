import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loaderservice } from './Services/loaderservice';
import { BetSlipService } from './Services/bet-slip-service';
import { BetSlip } from "./Page/bet-slip/bet-slip";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, BetSlip],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
isMobile :boolean = false;
  constructor(public loaderService: Loaderservice,public betSlipService: BetSlipService,@Inject(PLATFORM_ID) private platformId: Object) { }
  protected readonly title = signal('GT21');
  
  onResize = () => {
    this.checkScreen();
  };
checkScreen() {
  if (isPlatformBrowser(this.platformId)) {
    this.isMobile = window.innerWidth < 768;
  } else {
    this.isMobile = false; // default for SSR
  }
}
}
