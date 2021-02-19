import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISchedule } from '../models/schedule';
import { timer, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css']
})
export class TickerComponent implements OnInit {
  polledData$: Observable<ISchedule>;

  constructor(private httpclient: HttpClient) {

   }
  ngOnInit(): void {
    const schedule$ = this.httpclient.get('https://statsapi.web.nhl.com/api/v1/schedule');

    this.polledData$ = timer(0, 10000)
    .pipe(
      concatMap(_ => schedule$),
      map((response: ISchedule) => {
        return response;
      })
    );
  }

  openLineScore(gameId: string){
    window.open(`/linescore/${gameId}`, '_blank', 'scrollbars=yes,status=no,toolbar=no,menubar=no,width=600,height=400');
    // window.open(`/linescore/${gameId}`, '_blank');
  }
}
