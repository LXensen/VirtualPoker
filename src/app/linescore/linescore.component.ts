import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { ILineScore } from '../models/linescore';

@Component({
  selector: 'app-linescore',
  templateUrl: './linescore.component.html',
  styleUrls: ['./linescore.component.css']
})
export class LinescoreComponent implements OnInit {
  linescoreData$: Observable<ILineScore>;

  periodOneHomeData: string;
  periodTwoHomeData: string;
  periodThreeHomeData: string;
  totalHomeData: string;
  periodOneAwayData: string;
  periodTwoAwayData: string;
  periodThreeAwayData: string;
  totalAwayData: string;

  data: ILineScore;

  constructor(private httpclient: HttpClient,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    const gameid = this.route.snapshot.paramMap.get('gameid');
    const linescorefeed$ = this.httpclient.get(`https://statsapi.web.nhl.com/api/v1/game/${gameid}/linescore`);

    this.linescoreData$ = timer(0, 10000)
    .pipe(
      concatMap(_ => linescorefeed$),
      map((response: any) => {
        this.data = response;
        return response;
      })
    );
  }

  showShots() {
      // away numbers
      this.periodOneAwayData = this.data.periods[0].away.shotsOnGoal.toString();
      this.periodTwoAwayData =  this.data.periods.length > 1 ? this.data.periods[1].away.shotsOnGoal.toString() : '-';
      this.periodThreeAwayData =  this.data.periods.length > 2 ? this.data.periods[2].away.shotsOnGoal.toString() : '-';
      this.totalAwayData = this.data.teams.away.shotsOnGoal.toString();
      // Home numbers
      this.periodOneHomeData = this.data.periods[0].away.shotsOnGoal.toString();
      this.periodTwoHomeData =  this.data.periods.length > 1 ? this.data.periods[1].away.shotsOnGoal.toString() : '-';
      this.periodThreeHomeData =  this.data.periods.length > 2 ? this.data.periods[2].away.shotsOnGoal.toString() : '-';
      this.totalHomeData = this.data.teams.home.shotsOnGoal.toString();
  }

  showGoals() {
    this.periodOneAwayData = this.data.periods[0].away.goals.toString();
    this.periodTwoAwayData =  this.data.periods.length > 1 ? this.data.periods[1].away.goals.toString() : '-';
    this.periodThreeAwayData =  this.data.periods.length > 2 ? this.data.periods[2].away.goals.toString() : '-';
    this.totalAwayData = this.data.teams.away.goals.toString();
    // Home numbers
    this.periodOneHomeData = this.data.periods[0].away.goals.toString();
    this.periodTwoHomeData =  this.data.periods.length > 1 ? this.data.periods[1].away.goals.toString() : '-';
    this.periodThreeHomeData =  this.data.periods.length > 2 ? this.data.periods[2].away.goals.toString() : '-';
    this.totalHomeData = this.data.teams.home.goals.toString();
  }

  showPIMS() {

  }
}
