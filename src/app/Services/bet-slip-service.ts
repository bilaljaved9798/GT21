import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BetSlipService {

  selectedBet = signal<any>(null);
  isOpen = signal<boolean>(false);

  open(bet: any) {
    this.selectedBet.set(bet);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.selectedBet.set(null);
  }
}