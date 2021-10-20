import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mobile',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.css']
})
export class MobileComponent implements OnInit {

  private cardPath = 'assets/images/';
  card1SRC: string;
  card2SRC: string;
  card3SRC: string;
  card4SRC: string;
  card5SRC: string;

  timeLeft = '0:00:00';
  pot = 0;
  
  numberOfPlayers: number[] = new Array(6);

  constructor() {
    this.card1SRC = this.cardPath + 'blue_back.png';
    this.card2SRC = this.cardPath + 'blue_back.png';
    this.card3SRC = this.cardPath + 'blue_back.png';
    this.card4SRC = this.cardPath + 'blue_back.png';
    this.card5SRC = this.cardPath + 'blue_back.png';
   }

  ngOnInit(): void {
  }

}
