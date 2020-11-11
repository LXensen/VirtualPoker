import { Player } from './../shared/model/player';
import { HoldemService } from './../service/holdem.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Hand } from '../shared/model/hand';
import { Gametemplate } from '../shared/model/gametemplate';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  dealDisabled = false;
  flopDisabled = false;
  turnDisabled = false;
  riverDisabled = false;

  dealVisible = true;
  flopVisible = false;
  turnVisible = false;
  riverVisible = false;
  finalCardsVisible = true;

  gamestate: Gametemplate;
  allPlayers = new Array<Player>();

  starttime: Date;
  endtime: Date;

  constructor(private holdEmService: HoldemService) {
    this.holdEmService.Players$.subscribe(player => {
      player.docs.forEach(p => {
          this.allPlayers.push(p.data());
        });
    });

    this.holdEmService.GameState().subscribe(state => {
      this.gamestate = state;
    });

    this.holdEmService.Hand$.subscribe(state => {
      if (this.gamestate.started && !this.gamestate.completed ) {
        this.DetermineButtonState(state.message);
      }
    });
   }

  ngOnInit(): void {
  }


  DetermineButtonState(state: string){
    switch (state) {
      case 'Dealing hand':
        this.dealDisabled = true;
        this.flopVisible = true;
        break;
      case 'Dealing flop':
        this.dealDisabled = true;
        this.flopVisible = true;
        this.flopDisabled = true;
        this.turnVisible = true;
        break;
      case 'Dealing turn':
        this.dealDisabled = true;
        this.flopVisible = true;
        this.flopDisabled = true;
        this.turnVisible = true;
        this.turnDisabled = true;
        this.riverVisible = true;
        break;
      case 'Dealing river':
        this.dealDisabled = true;
        this.flopVisible = true;
        this.flopDisabled = true;
        this.turnVisible = true;
        this.turnDisabled = true;
        this.riverVisible = true;
        this.riverDisabled = true;
        this.finalCardsVisible = true;
        break;
        case '':
          this.dealDisabled = false;
          this.flopDisabled = false;
          this.turnDisabled = false;
          this.riverDisabled = false;

          this.dealVisible = true;
          this.flopVisible = false;
          this.turnVisible = false;
          this.riverVisible = false;
          this.finalCardsVisible = true;
          break;
      default:
        break;
    }
  }

  Deal() {
    this.holdEmService.DealHand();
  }

  DealFlop() {
    this.holdEmService.DealFlop();
  }

  DealTurn() {
    this.holdEmService.DealTurn();
  }

  DealRiver() {
    this.holdEmService.DealRiver();
  }

  ShowCards() {
    this.holdEmService.ShowCards();
  }

  NewHand() {
    this.holdEmService.NewHand();
  }
}
