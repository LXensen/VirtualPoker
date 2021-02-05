import { IGame } from "./game";

export interface IGameDate {
    date: Date,
    totalItems: number,
    totalEvents: number,
    totalGames: number,
    totalMatches: number,
    games: Array<IGame>,
    events: Array<any>,
    matches: Array<any>
}