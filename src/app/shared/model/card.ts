
enum Suit {
    Heart = 'Heart',
    Club = 'Club',
    Spade = 'Spade',
    Diamond = 'Diamond'
}

export enum Rank {
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14,
}

export class Card {
    static Suit = Suit;
    static Rank = Rank;
    readonly cardSuit: Suit; // Clubs
    readonly cardRank: Rank; // K
    readonly score: number; // 2=2, 3=3, J=11
    readonly url: string;
    constructor( suit: Suit, rank: Rank, score: number, url: string = '' ) {
        this.cardSuit = suit;
        this.cardRank = rank;
        this.score = score;
        this.url = url;
    }
}
