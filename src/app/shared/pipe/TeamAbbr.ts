import { Pipe, PipeTransform } from '@angular/core';
import { TEAM, Teams } from '../constants';

@Pipe({
    name: 'TeamAbbr'
})
export class TeamAbbr implements PipeTransform {

    transform(value: string) {
        switch (value) {
            case TEAM.NJD: {
                return this.getKey(TEAM.NJD);
            }
            case TEAM.NYI: {
                return this.getKey(TEAM.NYI);
            }
            case TEAM.NYR: {
                return this.getKey(TEAM.NYR);
            }
            case TEAM.OTT: {
                return this.getKey(TEAM.OTT);
            }
            case TEAM.MTL: {
                return this.getKey(TEAM.MTL);
            }
            case TEAM.BOS: {
                return this.getKey(TEAM.BOS);
            }
            case TEAM.TOR: {
                return this.getKey(TEAM.TOR);
            }
            case TEAM.PHI: {
                return this.getKey(TEAM.PHI);
            }
            case TEAM.PIT: {
                return this.getKey(TEAM.PIT);
            }
            case TEAM.BUF: {
                return this.getKey(TEAM.BUF);
            }
            case TEAM.CAR: {
                return this.getKey(TEAM.CAR);
            }
            case TEAM.FLA: {
                return this.getKey(TEAM.FLA);
            }
            case TEAM.TBL: {
                return this.getKey(TEAM.TBL);
            }
            case TEAM.WSH: {
                return this.getKey(TEAM.WSH);
            }
            case TEAM.CHI: {
                return this.getKey(TEAM.CHI);
            }
            case TEAM.DET: {
                return this.getKey(TEAM.DET);
            }
            case TEAM.NSH: {
                return this.getKey(TEAM.NSH);
            }
            case TEAM.STL: {
                return this.getKey(TEAM.STL);
            }
            case TEAM.CGY: {
                return this.getKey(TEAM.CGY);
            }
            case TEAM.COL: {
                return this.getKey(TEAM.COL);
            }
            case TEAM.EDM: {
                return this.getKey(TEAM.EDM);
            }
            case TEAM.VAN: {
                return this.getKey(TEAM.VAN);
            }
            case TEAM.ANA: {
                return this.getKey(TEAM.ANA);
            }
            case TEAM.DAL: {
                return this.getKey(TEAM.DAL);
            }
            case TEAM.LAK: {
                return this.getKey(TEAM.LAK);
            }
            case TEAM.SJS: {
                return this.getKey(TEAM.SJS);
            }
            case TEAM.CBJ: {
                return this.getKey(TEAM.CBJ);
            }
            case TEAM.MIN: {
                return this.getKey(TEAM.MIN);
            }
            case TEAM.WIN: {
                return this.getKey(TEAM.WIN);
            }
            case TEAM.ARI: {
                return this.getKey(TEAM.ARI);
            }
            case TEAM.VGK: {
                return this.getKey(TEAM.VGK);
            }
            default: {
                return 'NA';
            }
        }
    }

    getKey(code: string): string {
        for (let [key, value] of Teams.entries()){
            if (value === code){
                return key;
            }
          }
    }
}
