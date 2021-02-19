export interface ILineScore {
    copyright: string;
    currentPeriod: number;
    periods: Array<{
        periodType: string;
        startTime: Date;
        endTime: Date;
        num: number;
        ordinalNumber: string;
        home: {
            goals: number;
            shotsOnGoal: number;
            rinkSide: string;
        };
        away: {
            goals: number;
            shotsOnGoal: number;
            rinkSide: string;
        };
    }>;
    shootoutInfo: {
        away: {
            scores: number;
            attempts: number;
        };
        home: {
            scores: number;
            attempts: number;
        };
    };
    teams: {
        home: {
            team: {
                id: number;
                name: string;
                link: string;
            };
            goals: number;
            shotsOnGoal: number;
            goaliePulled: boolean;
            numSkaters: number;
            powerPlay: boolean;
        };
        away: {
            team: {
                id: number;
                name: string;
                link: string;
            };
            goals: number;
            shotsOnGoal: number;
            goaliePulled: boolean;
            numSkaters: number;
            powerPlay: boolean;
        };
        powerPlayStrength: string;
        hasShootout: boolean;
    };
    intermissionInfo: {
        intermissionTimeRemaining: number;
        intermissionTimeElapsed: number;
        inIntermission: boolean;
    };
}
