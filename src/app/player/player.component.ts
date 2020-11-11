import { AuthService } from './../service/auth.service';
import { Player } from './../shared/model/player';
import { User } from '../shared/model/user';
import { HoldemService } from './../service/holdem.service';
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @ViewChild('betInput') betInput: ElementRef;

  private isWinner = false;
  private isSmallBlind = false;
  private isBigBlind = false;
  private smallAmount: number;
  private bigAmount: number;
  private cardPath = 'assets/images/';
  private isSelectedCSSClass = 'btn btn-success';
  private secondaryUnChecked = 'btn btn-outline-secondary';
  public flippedCardSRC = 'blue_back.png';
  public foldedCardSRC = 'gray_back.png';
  public card1SRC = this.cardPath + this.flippedCardSRC;
  public card2SRC = this.cardPath + this.flippedCardSRC;
  public smallAnteClass: string;
  public bigAnteeClass: string;
  public deallingClass: string;
  public checkedClass: string;
  public isWinnerClass: string;

  public isDisabled = false;
  public isChecked = false;

  user: User;
  currentPlayer: Player;
  @Output() messageEvent = new EventEmitter<string>();

  @Input()
  set player(plyr: Player) {
    this.smallAnteClass = this.secondaryUnChecked;
    this.bigAnteeClass = this.secondaryUnChecked;
    this.checkedClass = this.secondaryUnChecked;
    this.isWinnerClass = this.secondaryUnChecked;

    this.deallingClass = 'btn btn-outline-secondary';
    this.card2SRC = this.cardPath + this.flippedCardSRC;
    this.card1SRC = this.cardPath + this.flippedCardSRC;

    if (plyr) {
      this.holdEmService.LoadPlayer(plyr.userRef).subscribe((val) => {
      this.isDisabled = false;
      this.isChecked = false;

      this.currentPlayer = val;

      if ( this.currentPlayer.cardOne === '') {
        this.card1SRC = this.cardPath + this.flippedCardSRC;
      }

      if ( this.currentPlayer.cardTwo === '') {
        this.card2SRC = this.cardPath + this.flippedCardSRC;
      }

      if ( this.currentPlayer.folded || (this.currentPlayer.canBet === false) ) {
        this.card1SRC = this.cardPath + this.foldedCardSRC;
        this.card2SRC = this.cardPath + this.foldedCardSRC;
        this.isDisabled = true;
      }

      if ( this.currentPlayer.smAntee ) {
       this.smallAnteClass = this.isSelectedCSSClass;
       this.isSmallBlind = true;
      } else {
       this.smallAnteClass = this.secondaryUnChecked;
       this.isSmallBlind = false;
      }

      if ( this.currentPlayer.bgAntee ) {
       this.bigAnteeClass = this.isSelectedCSSClass;
       this.isBigBlind = true;
      } else {
       this.bigAnteeClass = this.secondaryUnChecked;
       this.isBigBlind = false;
      }

      if ( this.currentPlayer.hasChecked ) {
        this.checkedClass = this.isSelectedCSSClass;
      } else {
        this.checkedClass = this.secondaryUnChecked;
      }

      if (this.currentPlayer.showCards) {
        this.card1SRC = this.cardPath + this.currentPlayer.cardOne + '.png';
        this.card2SRC = this.cardPath + this.currentPlayer.cardTwo + '.png';
      }

      if ( this.currentPlayer.dealer ) {
        this.deallingClass = this.isSelectedCSSClass;
      } else {
       this.deallingClass = 'btn btn-outline-secondary';
      }

      if ( this.currentPlayer.isWinner ) {
        this.isWinnerClass = this.isSelectedCSSClass;
        this.isWinner = true;
       } else {
        this.isWinnerClass = this.secondaryUnChecked;
        this.isWinner = false;
       }
      });
    } else {
      this.card1SRC = this.cardPath + this.foldedCardSRC;
      this.card2SRC = this.cardPath + this.foldedCardSRC;
      this.isDisabled = true;
    }
  }
  constructor(private holdEmService: HoldemService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.holdEmService.GameState().subscribe(state => {
      this.bigAmount = state.big;
      this.smallAmount = state.small;
    });

    this.authService.user$.subscribe(usr => {
      this.user = usr;
    });
  }

  ToggleWinner() {
    if (this.isWinner) {
      this.isWinner = false;
      this.isWinnerClass = this.secondaryUnChecked;
      this.holdEmService.RemoveWinner(this.currentPlayer.userRef);
    } else {
      this.isWinner = true;
      this.isWinnerClass = this.isSelectedCSSClass;
      this.holdEmService.AddWinner(this.currentPlayer.userRef);
    }
  }

  Min() {
    this.IsViewingPlayer$().subscribe(val => {
      if (val) {
        if (this.currentPlayer.stack - this.bigAmount >= 0) {
          this.holdEmService.Bet(this.currentPlayer.stack - this.bigAmount,
                                this.currentPlayer.userRef,
                                this.currentPlayer.name,
                                this.bigAmount);
        }
      }
    });
  }

  Small() {
    if ( this.isSmallBlind) {
      this.isSmallBlind = false;
      this.smallAnteClass = this.secondaryUnChecked;
      // give them theire blind back
      this.holdEmService.Bet((this.currentPlayer.stack + this.smallAmount),
                            this.currentPlayer.userRef,
                            this.currentPlayer.name,
                            -Math.abs(this.smallAmount),
                            '-small');
    } else {
      this.isSmallBlind = true;
      this.smallAnteClass = this.isSelectedCSSClass;
      if (this.currentPlayer.stack - this.currentPlayer.smAntee >= 0) {
        if (!this.currentPlayer.smAntee && !this.currentPlayer.bgAntee) {
          this.holdEmService.Bet((this.currentPlayer.stack - this.smallAmount),
                              this.currentPlayer.userRef,
                              this.currentPlayer.name,
                              this.smallAmount,
                              'small');
        }
      } else {
        this.holdEmService.PushMessage(this.currentPlayer.name + ' does not have enough to buy in.');
      }
    }

  }

  Big() {
    if ( this.isBigBlind) {
      this.isBigBlind = false;
      this.bigAnteeClass = this.secondaryUnChecked;
      // give them theire blind back
      this.holdEmService.Bet((this.currentPlayer.stack + this.bigAmount),
                        this.currentPlayer.userRef,
                        this.currentPlayer.name,
                        -Math.abs(this.bigAmount),
                        '-big');
    } else {
      this.isBigBlind = true;
      this.bigAnteeClass = this.secondaryUnChecked;
      if (this.currentPlayer.stack - this.currentPlayer.bgAntee >= 0) {
        if (!this.currentPlayer.smAntee && !this.currentPlayer.bgAntee) {
          this.holdEmService.Bet((this.currentPlayer.stack - this.bigAmount),
                              this.currentPlayer.userRef,
                              this.currentPlayer.name,
                              this.bigAmount,
                              'big');
        }
      } else {
        this.holdEmService.PushMessage(this.currentPlayer.name + ' does not have enough to buy in.');
      }
  }
  }

  FoldHand() {
    this.IsViewingPlayer$().subscribe(val => {
      if (val) {
        this.holdEmService.FoldPlayer();
        this.holdEmService.PushMessage(this.currentPlayer.name + ' folds');
        this.isDisabled = true;
      }
    });
  }

  Check() {
    this.IsViewingPlayer$().subscribe(val => {
      if (val) {
        this.holdEmService.CheckPlayer();
        this.holdEmService.PushMessage(this.currentPlayer.name + ' checks');
      }
    });
  }

  Dealer() {
    this.IsViewingPlayer$().subscribe(val => {
      if (val && !this.isDisabled) {
          this.holdEmService.SetDealer();
       }
    });
  }

  TurnOverCards() {
      if ( this.currentPlayer.cardOne === '' ) {
        this.holdEmService.PushMessage('No card to see yet. No one has dealt!');
      } else {
        this.IsViewingPlayer$().subscribe(val => {
          if (val) {
            this.card1SRC = this.cardPath + this.currentPlayer.cardOne + '.png';
            this.card2SRC = this.cardPath + this.currentPlayer.cardTwo + '.png';
          } else {
            this.holdEmService.GetGamePlayer(this.user.currentGame, this.user.uid).subscribe(doc => {
              if (doc.get('stack') === 0 ){
                this.card1SRC = this.cardPath + this.currentPlayer.cardOne + '.png';
                this.card2SRC = this.cardPath + this.currentPlayer.cardTwo + '.png';
              }
            });
          }
        });
      }
  }

  // CanOtherPlayerSeeCards(): Observable<any> {
  //   return this.authService.user$.pipe(
  //     // tslint:disable-next-line: arrow-return-shorthand
  //     map(user => {
  //       return user;
  //     }),
  //     map(x => {
  //       this.holdEmService.GetGamePlayer(x.currentGame, x.uid).subscribe(val => {
  //         debugger;
  //         return of(true);
  //         //return true;
  //       });
  //       // this.holdEmService.GetGamePlayer(x.currentGame, x.uid).pipe(
  //       //   map(abc => {
  //       //     debugger;
  //       //     return abc;
  //       //   })
  //       // );
  //     })
  //   );
  //   // this.holdEmService.GetGamePlayer(this.gameRef, this.authService.user$.subscribe(user => { return user.uid })).pipe(
  //   //   map(obj => {

  //   //   })
  //   // );
  //       // this.holdEmService.Players$.subscribe(players => {
  //       //   // for (let i = 0; i++; i < players.length){
  //       //   //   //if (players[i].get('stack') === 0 && players[i].get('userRef') === user.uid) {
  //       //   //     console.log(players[i]['stack'] + ' ' + players[i]['userRef'] + ' ' + user.uid);
  //       //   //   //}
  //       //   // }
  //       //   let found = false;
  //       //   players.forEach(element => {
  //       //     if (element.get('stack') === 0 && element.get('userRef') === user.uid) {
  //       //       found = true;
  //       //       console.log(element.get('stack') + ' ' + element.get('userRef') + ' ' + user.uid);
  //       //     }
  //       //   });

  //       // });
  // }

  private IsViewingPlayer$(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        return this.currentPlayer.userRef === user.uid ? true : false;
    }));
  }

  // private IsViewingPlayer(): boolean {
  //   // TODO - Use the obove - IsViewingPlayer$
  //   if (this.currentPlayer.userRef === this.authService.FireUser.uid) {
  //     return true;
  //   } else { // check the stack size. Anyone 'out' can turn over
  //     if (this.currentPlayer.stack === 0) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  Bet(amount: number) {
    this.IsViewingPlayer$().subscribe(val => {
      if (val) {
        if ( !amount ) {
          this.holdEmService.PushMessage(this.currentPlayer.name + ' you can not bet nothing. Try again....');
        } else {
          if (this.currentPlayer.stack - amount >= 0) {
            this.holdEmService.Bet(this.currentPlayer.stack - amount, this.currentPlayer.userRef, this.currentPlayer.name, amount);
            this.betInput.nativeElement.value = '';
          } else {
            this.holdEmService.PushMessage(this.currentPlayer.name + ' tried to bet more than he has...Try again');
          }
        }
      }
    });
  }
}
