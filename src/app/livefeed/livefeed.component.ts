import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-livefeed',
  templateUrl: './livefeed.component.html',
  styleUrls: ['./livefeed.component.css']
})
export class LivefeedComponent implements OnInit {

  constructor(private httpclient: HttpClient,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    const gameid = this.route.snapshot.paramMap.get('gameid');
    debugger;
    const feed$ = this.httpclient.get(`https://statsapi.web.nhl.com/api/v1/game/${gameid}/boxscore`);
  }

}
