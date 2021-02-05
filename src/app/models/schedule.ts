import { IGameDate } from "./gamedate";

export interface ISchedule {
    copyright: string,
    totalItems: number,
    totalEvents: number,
    totalGames: number,
    totalMatches: number,
    wait: number,
    dates: Array<IGameDate>
}