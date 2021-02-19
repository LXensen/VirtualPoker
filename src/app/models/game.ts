import { IStatus } from './gameStatus';
import { IGameTeams } from './gameTeams';
import { IVenue } from './gameVenue';
export interface IGame {
    gamePk: number;
    link: string;
    gameType: string;
    season: string;
    gameDate: Date;
    status: IStatus;
    teams: IGameTeams;
    venue: IVenue;
    content: { 'link': string};
}
