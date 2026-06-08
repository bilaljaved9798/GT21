import { Injectable, signal, computed } from '@angular/core';

export interface BetModel {
  selectionId: number;
  selectionName: string;
  marketId: string;
  marketName: string;
  eventId: string;
  type:string;
  price: number;
  stack: number;
  size: number;
  Clickedlocation: number;
  runnersCount?: number;
  categoryName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BetSlipService {
isOpen = signal<boolean>(false);
  // 🔹 Main basket
  private _bets = signal<BetModel[]>([]);
 selectedBet = signal<BetModel | null>(null);
 previousOdds = signal<{ [key: string]: number }>({});
  // 🔹 Expose readonly
  bets = this._bets.asReadonly();

  // 🔹 Total Stake
  totalStake = computed(() =>
    this._bets().reduce((sum, b) => sum + (Number(b.size) || 0), 0)
  );

  // 🔹 Add or Update Bet
addBet(bet: any) {
  const current = this._bets();

  const index = current.findIndex(
    x => x.selectionId === bet.selectionId && x.marketId === bet.marketId
  );

  if (index > -1) {
    const oldOdds = current[index].price;

    const updated = [...current];
    updated[index] = {
      ...updated[index],
      price: bet.price,
      type: bet.type
    };

    this._bets.set(updated);

    // 👉 store previous odds
    this.previousOdds.update(p => ({
      ...p,
      [bet.selectionId]: oldOdds
    }));

    this.selectedBet.set({ ...updated[index] });

  } else {
    const newBet = { ...bet };
    this._bets.set([...current, newBet]);

    this.selectedBet.set({ ...newBet });
  }
  this.isOpen.set(true);
}

  // 🔹 Update stake (size)
  updateStake(selectionId: number, size: number) {
    const updated = this._bets().map(b =>
      b.selectionId === selectionId
        ? { ...b, size }
        : b
    );

    this._bets.set(updated);
  }

  // 🔹 Remove single bet
  removeBet(selectionId: number) {
    this._bets.set(
      this._bets().filter(b => b.selectionId !== selectionId)
    );
  }

  // 🔹 Check if selection already added
  isSelected(selectionId: number): boolean {
    return this._bets().some(b => b.selectionId === selectionId);
  }

  // 🔹 Get bet by selection
  getBet(selectionId: number): BetModel | undefined {
    return this._bets().find(b => b.selectionId === selectionId);
  }
   close() {
    this.isOpen.set(false);
  }
    clear() {
    this._bets.set([]);
    this.isOpen.set(false);
    this.selectedBet.set(null);
  }

  openMultipleBetSlip(data: any): void {
  this.addBet(data);
}

}