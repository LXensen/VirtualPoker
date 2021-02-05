import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISchedule } from '../models/schedule';
import { timer, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { IGameDate } from '../models/gamedate';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {
  tickerMessage: string;
  polledData$: Observable<ISchedule>;

  gamedates: Array<IGameDate>
  // private year: number; month: number; day: number;

  // private api_key = '336ffrdtkv9zu668ugd7dy2c';
  // private daily_schedule_URL: string;

  constructor(private httpclient: HttpClient) {

   }
  ngOnInit(): void {
    // let today = new Date();
    // this.year = today.getFullYear();
    // this.month = today.getMonth() + 1;
    // this.day = today.getDay();
    const schedule$ = this.httpclient.get('https://statsapi.web.nhl.com/api/v1/schedule');

    // this.polledData$ = timer(0, 10000)
    // .pipe(
    //   concatMap(_ => schedule$),
    //   map((response: ISchedule) => {
    //     this.tickerMessage = '';
    //     response.dates.forEach(gamedates => {
    //       gamedates.games.forEach(game => {
    //       this.tickerMessage = this.tickerMessage + 
    //             `<div style='display: inline;'>${game.teams.home.team.name}&nbsp;&nbsp; ${game.teams.home.score}</div>
    //              <div style='display: inline;'>${game.teams.away.team.name}&nbsp;&nbsp; ${game.teams.away.score}</div>
    //              <br />`
    //       })
    //     });
    //     this.gamedates = response.dates;

    //     return response;
    //   })
    // )
    // this.polledData$ = timer(0, 10000).pipe(
    //   concatMap(_ => schedule$),
    //   map((response: ISchedule) => {
    //     debugger;
    //     this.tickerMessage = '';
    //     response.dates.forEach(gamedates => {
    //       gamedates.games.forEach(game => {
    //       this.tickerMessage = game.teams.home.team.name + ':' + game.teams.home.score
    //       })
    //     });
    //     return response;
    //   })
    // )

    // this.httpclient.get<ISchedule>('https://statsapi.web.nhl.com/api/v1/schedule').subscribe(data => {
    //   debugger;
    // })
  }

}
