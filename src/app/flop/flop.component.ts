import { HoldemService } from './../service/holdem.service';
import { Component, Input, OnInit } from '@angular/core';
import { trigger, keyframes, animate, transition, style } from '@angular/animations';
import { Gametemplate } from '../shared/model/gametemplate';

@Component({
  selector: 'app-flop',
  templateUrl: './flop.component.html',
  styleUrls: ['./flop.component.css'],
  animations: [
    trigger('messageChanged',
    [
      transition('void => *', []),   // when the item is created
      transition('* => void', []),   // when the item is removed
      transition('* => *', [         // when the item is changed
          animate(1800, keyframes([  // animate for 1200 ms
              style ({ background : 'white', color: 'black', offset: 0.0 }),
              style ({ background : 'inherit', color: 'inherit', offset: 1.0 }),
          ])),
      ]),
      ])]
})
export class FlopComponent implements OnInit {
  @Input() GameState: Gametemplate;

  starttime: Date;
  endtime: Date;

  card1SRC: string;
  card2SRC: string;
  card3SRC: string;
  card4SRC: string;
  card5SRC: string;
  message: string;

  timeLeft = '0:00:00';
  pot = 0;
  cardPath = 'assets/images/';
  hasChanged = true;
  constructor(private holdEmService: HoldemService) { }

  ngOnInit(): void {
    this.holdEmService.Hand$.subscribe(HAND => {
      this.card1SRC = this.cardPath + HAND.cardOne + '.png';
      this.card2SRC = this.cardPath + HAND.cardTwo + '.png';
      this.card3SRC = this.cardPath + HAND.cardThree + '.png';
      this.card4SRC = this.cardPath + HAND.cardFour + '.png';
      this.card5SRC = this.cardPath + HAND.cardFive + '.png';

      this.pot = HAND.potSize;
      if (this.message !== undefined){
          if (this.message !== HAND.message){
            this.hasChanged = !this.hasChanged;
          }
        }
      this.message = HAND.message;
    });

    if (!this.GameState.completed) {
    this.starttime = this.GameState.gameStartDate.toDate();

    this.endtime = new Date(this.starttime.getFullYear(),
                              this.starttime.getMonth(),
                              this.starttime.getDate(),
                              this.starttime.getHours() + 3,
                              this.starttime.getMinutes(),
                              this.starttime.getSeconds());

    const currentTime = new Date().getTime();
    const timeDelta = (currentTime - this.endtime.getTime()) / 1000;

    if (timeDelta < 0){
        // JS version here
        // this.startCountdown((timeDelta));
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
  }


  startCountdown(seconds) {
    let timeDelta = seconds;

    const newinterval = setInterval(() => {
      const hour = Math.floor(timeDelta / 360 ) + 13;
      const min = Math.floor(timeDelta / 60) + 1;
      const sec = timeDelta % 60;

      const hours = Math.floor(timeDelta / 60 / 60) + 1;
      const mins = (Math.floor(timeDelta / 60) - (hours * 60));
      // debugger
      // console.log(min + ':' + Math.trunc(sec) + ' ' +  timeDelta);
      // console.log(hours + ':' + mins + ':' + Math.trunc(sec) + ' ' +  timeDelta);

      const modifiedSecond = Math.abs(Math.trunc(sec)).toString().length === 1 ? `0${Math.abs(Math.trunc(sec))}` : Math.abs(Math.trunc(sec));
      this.timeLeft = `${Math.abs(hours)}:${Math.abs(mins)}:${modifiedSecond}`;

      timeDelta += 1;

      if (timeDelta > 0 ) {
        // All done!
        clearInterval(newinterval);
      }
    }, 1000);
  }
}
