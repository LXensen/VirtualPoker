import { Player } from './../shared/model/player';
import { HoldemService } from './../service/holdem.service';
import { Component, OnInit } from '@angular/core';
import { Gametemplate } from '../shared/model/gametemplate';
import { AuthService } from '../service/auth.service';
import { Observable } from 'rxjs';

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

  gamestate: Gametemplate;
  allPlayers = new Array<Player>();
  thisPlayer: Observable<Player>;

  starttime: Date;
  endtime: Date;

  constructor(private holdEmService: HoldemService,
              private authSvc: AuthService) {
   }

  ngOnInit(): void {
    this.authSvc.user$.subscribe(user => {
        this.thisPlayer = this.holdEmService.LoadPlayer(user.data().uid);
    });

    // let tempPlayers = [];
    this.holdEmService.NEWPlayers$.subscribe(player => {
      player.subscribe(data => {
      this.allPlayers.push(data.data());
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
