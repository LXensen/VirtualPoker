import { Player } from './../shared/model/player';
import { HoldemService } from './../service/holdem.service';
import { Component, OnInit } from '@angular/core';
import { Gametemplate } from '../shared/model/gametemplate';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { User } from '../shared/model/user';

@Component({
  selector: 'app-tablesmall',
  templateUrl: './tablesmall.component.html',
  styleUrls: ['./tablesmall.component.css']
})
export class TablesmallComponent implements OnInit {
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
              private svcLocalStorage: LocalStorageService) {
   }

  ngOnInit(): void {
      this.thisPlayer = this.holdEmService.LoadPlayer(this.svcLocalStorage.get<User>('user').uid);

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
