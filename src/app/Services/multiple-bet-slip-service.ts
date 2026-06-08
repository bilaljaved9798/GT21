import { Injectable, signal } from '@angular/core';

export interface SelectedRunner {
  selectionId: number;
  selectionName: string;
  clothNumber?: string;
  marketId: string;
  marketName: string;
}

@Injectable({
  providedIn: 'root'
})
export class MultipleBetSlipService {

  selectedRunners = signal<SelectedRunner[]>([]);

  maxSelection = 6;

  toggle(runner: SelectedRunner) {

    const current = this.selectedRunners();

    const exists = current.some(
      x => x.selectionId === runner.selectionId
    );

    if (exists) {

      this.selectedRunners.set(
        current.filter(x => x.selectionId !== runner.selectionId)
      );

      return;
    }

    if (current.length >= this.maxSelection) {
      alert(`You can select only ${this.maxSelection} runners`);
      return;
    }

    this.selectedRunners.set([
      ...current,
      runner
    ]);
  }

  clear() {
    this.selectedRunners.set([]);
  }
}