import { HoldemService } from './../service/holdem.service';
import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Gametemplate } from '../shared/model/gametemplate';
import { Player } from '../shared/model/player';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  glowingtext = 'form-control mr-sm-2';
  timerCountdown: string;
  starttime: Date;
  endtime: Date;
  gamestate: Gametemplate;
  players = new Array<Player>();

  constructor(private holdEmService: HoldemService) {
    this.timerCountdown = '';
   }

  ngOnInit(): void {
    this.holdEmService.NEWPlayers$.subscribe(players => {
      players.subscribe(data => {
        this.players.push(data.data())
      })
    });
    // this.holdEmService.Players$.subscribe(players => {
    //   this.players = players.docs;
    // });
    this.holdEmService.GameState().subscribe(state => {
      this.gamestate = state;
      if (!state.completed) {
        // this.bigBlindAmount = state.big;
        // this.smallBlindAmount = state.small;
        // this.gameHasStarted = state.started;
        // figure out the blind and game time here, since everyone subscribes to this
        this.starttime = state.blindStartDate.toDate();

        this.endtime = new Date(this.starttime.getFullYear(),
                                this.starttime.getMonth(),
                                this.starttime.getDate(),
                                this.starttime.getHours(),
                                this.starttime.getMinutes() + (Number.parseInt(state.blindDuration, 10)),
                                this.starttime.getSeconds());

        const currentTime = new Date().getTime();
        let delta = (currentTime - this.endtime.getTime()) / 1000;
        // let timeDelta = delta - Number.parseInt(state.blindDuration, 10);
        const timeDelta = (currentTime - this.endtime.getTime()) / 1000 - Number.parseInt(state.blindDuration, 10);
        // console.log(currentTime + ' ' + this.endtime + ' ' + (delta / 1000) + ' ' + delta); //state.blindStartDate.toDate() + ' ' + this.endtime);

        if (timeDelta < 0){
          // JS version here
          this.startCountdown((timeDelta));

          // Observable version. Not sure about performance here?
          // interval(1000).pipe(
          //   map(val => {
          //     timeDelta += 1;
          //     // https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
          //     // NOTE THE COMMENT ABOUT NEGATIVE
          //     // Only use this when counint down for the blinds
          //     const min = Math.floor(timeDelta / 60) + 1;
          //     const sec = timeDelta % 60;
          //     // console.log(min + ':' + Math.trunc(sec) + ' ' +  val);

          //     // this.timerCountdown = `${Math.abs(min)}:${Math.abs(Math.trunc(sec))}`;
          //     return val;
          //   }),
          //   takeWhile(v => Number.parseInt(timeDelta.toFixed(), 10) < 0 )).subscribe();
        }
      }
    });
  }

  startCountdown(seconds) {
    let timeDelta = seconds;

    const newinterval = setInterval(() => {
      const min = Math.floor(timeDelta / 60) + 1;
      const sec = timeDelta % 60;
      // console.log(min + ':' + Math.trunc(sec) + ' ' +  Math.trunc(timeDelta) );

      const modifiedSecond = Math.abs(Math.trunc(sec)).toString().length === 1 ? `0${Math.abs(Math.trunc(sec))}` : Math.abs(Math.trunc(sec));
      this.timerCountdown = `${Math.abs(min)}:${modifiedSecond}`;

      timeDelta += 1;

      if (timeDelta > 0 ) {
        // All done!
        this.glowingtext = 'form-control mr-sm-2 button-glow';
        clearInterval(newinterval);
      }
    }, 1000);
  }

  StartGame(small: any, big: any, duration: number) {
    debugger;
      let durationValid = false;
      let smallValid = false;
      let bigValid = false;

      let durationValue = 0;
      let smallValue = 0;
      let bigValue = 0;

      if (!isNaN(duration)){
        console.log(Number.isInteger(Number(duration)));
        if (Number.isInteger(Number(duration))) {
          durationValue = Number(duration);
          durationValid = true;
        }
      }

      if (!durationValid) {
        alert('Enter a number for duration, in minutes, of blind ( ie: 10 )');
      }

      if (!isNaN(small)){
        if (Number.isInteger(Number(small))) {
          smallValue = Number(small);
          smallValid = true;
        }
      }

      if (!smallValid) {
        alert('Enter a number for small blind ( ie: 25 )');
      }

      if (!isNaN(big)){
        if (Number.isInteger(Number(big))) {
          bigValue = Number(big);
          bigValid = true;
        }
      }

      if (!bigValid) {
        alert('Enter a number for big blind ( ie: 50 )');
      }

      if (smallValue === 0 || bigValue === 0 || durationValue === 0) {
        alert('Values are required for small, big blind and duration');
      } else {
        if (!this.gamestate.started) {
          if (confirm('Starting the game will start your 3 hour limit. Do you wish to start? **there\'s no time limit for now. just a place holder**')) {
            this.holdEmService.StartGame(Number(small), Number(big), Number(duration));
          }
        } else {
          this.glowingtext = 'form-control mr-sm-2';
          this.holdEmService.RaiseBlinds(Number(small), Number(big), Number(duration));
        }
    }
  }

  FinishGame(firstPlace: any, secondPlace: any) {
      this.holdEmService.FinishGame(firstPlace.value, firstPlace.selectedOptions[0].text, secondPlace.value, secondPlace.selectedOptions[0].text).then(
        this.gamestate = null
      );
  }
}
