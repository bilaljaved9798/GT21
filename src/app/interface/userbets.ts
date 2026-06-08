export interface DebitCredit {
  // add fields if needed
}

export interface UserBet {
  id: number;

  selectionID: string;
  selectionName: string;

  userOdd: number;
  amount: number;
  betSize: number;

  betType: 'back' | 'lay';

  liveOdd?: number;

  isMatched: boolean;
  status?: string;

  marketBookID: string;
  marketBookname: string;

  userID: number;

  createdDate: string;
  updateDate: string;

  liability?: number;
  totLiability?: number;

  lstDebitCredit?: DebitCredit[];

  pendingAmount: number;

  location?: string;

  parentID: number;

  deleteLabel?: string;

  poundRateB?: number;
}