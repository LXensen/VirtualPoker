import { Router } from '@angular/router';
import { GameService } from './../service/game.service';
import { Component, OnInit, ViewChild, ElementRef, isDevMode } from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { addPlayersTransition } from './add-players-animations';
import * as firebase from 'firebase';
import {AngularFireFunctions} from '@angular/fire/functions';

@Component({
  selector: 'app-newgame',
  templateUrl: './newgame.component.html',
  styleUrls: ['./newgame.component.css'],
  animations: [addPlayersTransition]
})
export class NewgameComponent implements OnInit {
  addedPlayers = new Array<string>();
  @ViewChild('email') emailInput: ElementRef;

  creatingGame = false;
  isValid = true;
  errorMessage: string;
  createButtonText = 'Create Game';
  model: NgbDateStruct;

  constructor(private gameSvc: GameService, private router: Router, private affs: AngularFireFunctions) {  }

  ngOnInit(): void {
  }

  Add(email: string) {
    if ( this.addedPlayers.length === 8) {
      // error message to say you can't
      alert('No more than 8 players at a table');
      return;
    }

    if (email) {
      this.addedPlayers.push(email.toLowerCase());
      this.emailInput.nativeElement.value = '';
    } else {
      window.alert('An email address is required');
    }
  }

  RemovePlayer(email: string) {
    this.addedPlayers.splice(this.addedPlayers.indexOf(email, 0), 1);
  }

  CreateGame(stack: number) {
    const startDate = new Date(`${this.model.year}/${this.model.month}/${this.model.day}`);

    if (stack < 0 || stack === undefined) {
      this.isValid = false;
      this.errorMessage = 'Starting stack is required';
    }

    if ( this.addedPlayers.length === 0 ) {
      this.isValid = false;
      this.errorMessage = 'You need at least one player, though that would not be fun';
    }

    if ( this.addedPlayers.length === 8 ) {
      this.isValid = false;
      this.errorMessage = 'Only 8 players can fit at a table';
    }

    if ( startDate === null) {
      this.isValid = false;
    }

    if (this.isValid) {
      this.creatingGame = true;
      this.createButtonText = 'Creating game...';
      console.log('creating game');
      try {
        // if (isDevMode()){
        //   firebase.default.functions().useEmulator('localhost', 5001);
        // }
        this.gameSvc.NewGame(this.addedPlayers, `${this.model.year}/${this.model.month}/${this.model.day}`, stack).subscribe(x => {
          this.router.navigate(['account']);
        });
        // const newgame = firebase.functions().httpsCallable('createGame');
        // newgame({players: this.addedPlayers, amount: stack, startDate: `${this.model.year}/${this.model.month}/${this.model.day}`})
        //   .then((resp) => {
        //     resp.data.state === 'ok' ? this.router.navigate(['account']) : window.alert('Something went wrong. We could not create the game. Please try again');
        // });
      } catch (error) {
        console.log(error);
      }
    }
  }
}
