export interface Player {
    canBet: boolean;
    folded: boolean;
    hasChecked: boolean;
    smAntee: number;
    bgAntee: number;
    dealer: boolean;
    showCards: boolean;
    isWinner: boolean;
    cardOne: string;
    cardTwo: string;
    stack: number;
    name: string; // TODO
    userRef: string;
    gameRef: string;
    totalBet: number;
}
