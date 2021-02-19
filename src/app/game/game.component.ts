import { HoldemService } from './../service/holdem.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Player } from '../shared/model/player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  players = new Array<Player>();

  constructor(private holdEmService: HoldemService) {
   }

  ngOnInit(): void {
    this.holdEmService.NEWPlayers$.subscribe(players => {
      players.subscribe(data => {
        this.players.push(data.data());
      });
    });
  }
}
