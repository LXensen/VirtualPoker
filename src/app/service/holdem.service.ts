import { Player } from './../shared/model/player';
// import { AuthService } from './auth.service';
import { Deck } from './../shared/model/deck';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Gametemplate } from '../shared/model/gametemplate';
import { Hand } from '../shared/model/hand';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { User } from '../shared/model/user';
@Injectable({
  providedIn: 'root'
})
export class HoldemService {
  private currentDeck: Deck;

  private readonly GAMESCOLLECTION = 'games';
  private readonly INVITESCOLLECTION = 'invites';
  private readonly PLAYERSCOLLECTION = 'Players';
  private readonly HANDCOLLECTION = 'Hand';
  private readonly BLUECARD = 'blue_back';
  private readonly GRAYCARD = 'gray_back';

  // private gameRefId: string;
  private handRef: AngularFirestoreDocument;
  // private gameRef: AngularFirestoreDocument;

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  Players$: Observable<any>;
  NEWPlayers$: Observable<any>;
  Hand$: Observable<Hand>;

  get user(): User {
    return this.localStorage.get<User>('user');
  }

  constructor(protected firestore: AngularFirestore,
              private localStorage: LocalStorageService,
              // private authService: AuthService
              ) {
      if (!this.localStorage.isLocalStorageSupported){
          alert('Local storage is required to run the game')
      }
      
      // ********************************************************************************
      // We shouldn't check the the authService. There should be a user. If not redirect?
      // ********************************************************************************
      // console.log(this.localStorage.get<User>('user'));
      // if (this.user === null){
        // this.authService.user$.subscribe(user => {
        //   // this.gameRefId = user.currentGame;
        //   // this.gameRef = firestore.collection(this.GAMESCOLLECTION).doc(user.currentGame);
        //   this.handRef = firestore.collection(this.GAMESCOLLECTION).doc(`${this.user.currentGame}_${this.HANDCOLLECTION}`);
        //   const userData: User = {
        //     uid: user.uid,
        //     email: user.email,
        //     displayName: user.displayName,
        //     currentGame: user.currentGame
        //   };
        //   this.user = userData;

        //   // this.NEWPlayers$ = this.firestore.collection(this.GAMESCOLLECTION).doc(`${this.user.currentGame}_sortedPlayers`).get();

        //   this.InitPlayers();
        // });

      // } else {
        this.InitPlayers();

      //}
  }
  
PushMessage(message: string) {
  // tslint:disable-next-line:object-literal-shorthand
  this.handRef.update({message: message});
}

GameState(): Observable<Gametemplate> {
  return this.firestore.collection(this.GAMESCOLLECTION).doc<Gametemplate>(`${this.user.currentGame}`).valueChanges();
  // return this.authService.user$.pipe(
  //   switchMap((user: any) => {
  //     // TODO - This is getting hit a lot. Everytime the user is called?
  //     return this.firestore.collection(this.GAMESCOLLECTION).doc<Gametemplate>(`${user.currentGame}`).valueChanges();
  //   })
  // );
}

LoadPlayer(playerRef: string): Observable<Player> {
  // return this.authService.user$.pipe(
    // switchMap((user: any) => {
      //debugger;
      // return this.firestore.collection(this.GAMEPLAYERS).doc<Player>(`${user.currentGame}_${playerRef}`).valueChanges();
      return this.firestore.collection(this.GAMESCOLLECTION)
      .doc(`${this.user.currentGame}`)
      .collection(this.PLAYERSCOLLECTION)
      .doc<Player>(`${playerRef}`).valueChanges();
    // })
  // );
}

Deck(): Deck {
  if (!this.currentDeck) {
    this.currentDeck = new Deck(false);
  }
  return this.currentDeck;
}

  // Player Functions
 SetDealer() {
  this.messageSource.next('dealerSet');
  // this.authService.user$.subscribe(user => {
      // return this.firestore.collection(this.GAMEPLAYERS).doc(`${user.currentGame}_${user.uid}`).update({dealer: true});
      return this.firestore.collection(this.GAMESCOLLECTION)
            .doc(`${this.user.currentGame}`)
            .collection(this.PLAYERSCOLLECTION)
            .doc<Player>(`${this.user.uid}`)
            .update({dealer: true});
  // });

}

FoldPlayer() {
  // remove this player from the list of PlayingPlayers
  // this.authService.user$.subscribe(user => {
    // return this.firestore.collection(this.GAMEPLAYERS).doc(`${user.currentGame}_${user.uid}`).update({folded: true, cardOne: this.GRAYCARD, cardTwo: this.GRAYCARD});
    return this.firestore.collection(this.GAMESCOLLECTION)
          .doc(`${this.user.currentGame}`)
          .collection(this.PLAYERSCOLLECTION)
          .doc<Player>(`${this.user.uid}`)
          .update({folded: true, cardOne: this.GRAYCARD, cardTwo: this.GRAYCARD});
  // });
}

CheckPlayer() {
  // this.authService.user$.subscribe(user => {
    // return this.firestore.collection(this.GAMEPLAYERS).doc(`${user.currentGame}_${user.uid}`).update({hasChecked: true});
    return this.firestore.collection(this.GAMESCOLLECTION)
          .doc(`${this.user.currentGame}`)
          .collection(this.PLAYERSCOLLECTION)
          .doc<Player>(`${this.user.uid}`)
          .update({hasChecked: true});
  // });
}
  // implements small, big and 'normal' bet
  Bet(amount: number, playerRef: string, name: string, betAmount: number, anteeType?: string) {
    let msg = '';
    const increaseBy = firebase.default.firestore.FieldValue.increment(Number(betAmount));

    // this.authService.user$.subscribe(user => {
      // const playerref = this.firestore.collection(this.GAMEPLAYERS).doc(`${user.currentGame}_${user.uid}`);
      const playerref = this.firestore.collection(this.GAMESCOLLECTION)
                            .doc(`${this.user.currentGame}`)
                            .collection(this.PLAYERSCOLLECTION)
                            .doc(`${this.user.uid}`);

      if ( anteeType === 'small' ) {
        playerref.update({stack: amount, smAntee: true, totalBet: increaseBy});
        msg = name + ' anteed ' + betAmount;
      }

      if ( anteeType === '-small' ) {
        playerref.update({stack: amount, smAntee: false, totalBet: increaseBy});
        msg = name + ' undid the small for ' + betAmount;
      }

      if ( anteeType === 'big' ) {
        playerref.update({stack: amount, bgAntee: true, totalBet: increaseBy});
        msg = name + ' anteed ' + betAmount;
      }

      if ( anteeType === '-big' ) {
        playerref.update({stack: amount, bgAntee: false, totalBet: increaseBy});
        msg = name + ' undid the big for ' + betAmount;
      }
      // just a 'normal' bet
      if (anteeType === undefined) {
        playerref.update({stack: amount, totalBet: increaseBy});
        msg = name + ' bets ' + betAmount;
      }

      this.handRef.update({potSize: increaseBy});

      this.PushMessage(msg);
    // });
  }
  // END Player Functions

  NewHand() {
    this.handRef.get()
       .subscribe((docHandRef) => {
          const winningPlayer = docHandRef.get('winner');
          if (winningPlayer.length === 0) {
            this.PushMessage('You have to declare at least one winner');
          } else {
            // update the winners stack with the pot, then do this
            let pot = docHandRef.get('potSize');

            if ( winningPlayer.length === 2) {
              pot = pot / 2;
            }
            const increaseStacktBy = firebase.default.firestore.FieldValue.increment(Number(pot));
            winningPlayer.forEach(player => {
              // const playerref = this.firestore.collection(this.GAMEPLAYERS).doc(`${this.gameRefId}_${player}`);
              const playerref = this.firestore.collection(this.GAMESCOLLECTION)
                                  .doc(this.user.currentGame)
                                  .collection(this.PLAYERSCOLLECTION)
                                  .doc(player);
              playerref.update({stack: increaseStacktBy});
            });

            // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.gameRefId)
            this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame).collection(this.PLAYERSCOLLECTION, ref => ref.where('gameRef', '==', this.user.currentGame)
            .where('canBet', '==', true))
            .get()
            .subscribe((val) => {
              const batch = this.firestore.firestore.batch();
              val.forEach((doc) => {
                // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.gameRefId}_${doc.data().userRef}`);
                const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                                  .doc(this.user.currentGame)
                                  .collection(this.PLAYERSCOLLECTION)
                                  .doc(doc.data().userRef);
                // reset each Player
                batch.update(batchRef, {folded: false,
                  cardOne: '',
                  cardTwo: '',
                  totalBet: 0,
                  showCards: false,
                  hasChecked: false,
                  smAntee: false,
                  isWinner: false,
                  bgAntee: false,
                  dealer: false});
              });
              batch.commit().then(() => {
                this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame).collection(this.PLAYERSCOLLECTION, ref => ref.where('canBet', '==', true)
                              .where('stack', '<', 1))
                              .get().subscribe(players => {
                                  players.forEach((player) => {
                                    const playerref = this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame).collection(this.PLAYERSCOLLECTION).doc(player.get('userRef'));

                                    playerref.update({canBet: false, stack: 0});
                                  });
                              });
                // reset the hand
                this.handRef.update({cardOne: this.BLUECARD,
                  cardTwo: this.BLUECARD,
                  cardThree: this.BLUECARD,
                  cardFour: this.BLUECARD,
                  cardFive: this.BLUECARD,
                  message: '',
                  winner: [],
                  potSize: 0});
              });
            });
          }
       });

    this.messageSource.next('newHand');
  }

  // Dealer functions
  DealHand() {
    // instantiate a new deck
    this.currentDeck = null;
    // shuffle the deck before dealing
    this.Deck().Shuffle();
    // should only get players that are still 'active'
    // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.gameRefId)
    this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame)
        .collection(this.PLAYERSCOLLECTION, ref => ref.where('folded', '==', false)
        // .where('folded', '==', false)
        .where('canBet', '==', true))
        .get()
        .subscribe((playerRef) => {
          const batch = this.firestore.firestore.batch();
          playerRef.forEach((player) => {
          // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.gameRefId}_${player.data().userRef}`);
          const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                          .doc(this.user.currentGame)
                          .collection(this.PLAYERSCOLLECTION)
                          .doc(player.data().userRef);
          const card = this.Deck().cards.pop();
          batch.update(batchRef, {cardOne: card.url});
        });
          batch.commit().then(() => {

          });
        });

    // Now deal the second card, cardTwo. Doing this rathe than the for loop so that it approximates actual 'dealing', where
    // you deal one card at a time to each player
    // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.gameRefId)
    this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame)
        .collection(this.PLAYERSCOLLECTION, ref => ref.where('folded', '==', false)
        // .where('folded', '==', false)
        .where('canBet', '==', true))
        .get()
        .subscribe((playerRef) => {
          const batch = this.firestore.firestore.batch();
          playerRef.forEach((player) => {
          // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.gameRefId}_${player.data().userRef}`);
          const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                                .doc(this.user.currentGame)
                                .collection(this.PLAYERSCOLLECTION)
                                .doc(player.data().userRef);

          const card = this.Deck().cards.pop();
          batch.update(batchRef, {cardTwo: card.url});
        });
          batch.commit().then(() => {
          const msg = 'Dealing hand';
          this.PushMessage(msg);
          });
        });
  }

  GetGamePlayer(gameRef: string, userRef: string) {
    return this.firestore.collection(this.GAMESCOLLECTION)
            .doc(`${gameRef}`)
            .collection(this.PLAYERSCOLLECTION)
            .doc(`${userRef}`).get();
  }

  DealTurn() {
    this.Deck().cards.pop();

    this.handRef.update({cardFour: this.Deck().cards.pop().url});
    // reset total bet
    this.ResetPlayersBetTotal();
    this.PushMessage('Dealing turn');
  }

  DealRiver() {
    this.Deck().cards.pop();

    this.handRef.update({cardFive: this.Deck().cards.pop().url});
    // reset total bet
    this.ResetPlayersBetTotal();
    this.PushMessage('Dealing river');
  }

  DealFlop() {
    this.Deck().cards.pop();

    this.handRef.update({cardOne: this.Deck().cards.pop().url,
      cardTwo: this.Deck().cards.pop().url,
      cardThree: this.Deck().cards.pop().url});
    // reset total bet
    this.ResetPlayersBetTotal();
    this.PushMessage('Dealing flop');
  }

  ShowCards() {
    // Show all non-folded players
    this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame).collection(this.PLAYERSCOLLECTION, ref => ref.where('folded', '==', false)
    .where('canBet', '==', true))
    .get()
    // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.gameRefId)
    // .where('folded', '==', false)
    // .where('canBet', '==', true))
    // .get()
    .subscribe((val) => {
      const batch = this.firestore.firestore.batch();
      val.forEach((doc) => {
        // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.gameRefId}_${doc.data().userRef}`);
        const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                          .doc(this.user.currentGame)
                          .collection(this.PLAYERSCOLLECTION)
                          .doc(doc.data().userRef);
        batch.update(batchRef, {showCards: true});
      });
      batch.commit().then(() => {
        this.PushMessage('Showing cards');
      });
    });
  }
  // END Dealer functions

  AddWinner(playerRef: string) {
    this.handRef.update({
      winner: firebase.default.firestore.FieldValue.arrayUnion(playerRef)
    });

    this.firestore.collection(this.GAMESCOLLECTION)
                                  .doc(`${this.user.currentGame}`)
                                  .collection(this.PLAYERSCOLLECTION)
                                  .doc(`${playerRef}`)
                                  .update({
                                    isWinner: true
                                  });
  }

  RemoveWinner(playerRef: string) {
    this.handRef.update({
      winner: firebase.default.firestore.FieldValue.arrayRemove(playerRef)
    });

    this.firestore.collection(this.user.currentGame).doc(playerRef).update({
      isWinner: false
    });
  }

  FinishGame(firstPlaceRef: string, firstPlaceName: string, secondPlaceRef: string, secondPlaceName: string): Promise<void> {
    const batchEndGame = this.firestore.firestore.batch();

    const gameEndUpdate = this.firestore.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame);
    batchEndGame.set(gameEndUpdate, {completed: true,
                                    winner: firstPlaceRef,
                                    second: secondPlaceRef,
                                    winnerName: firstPlaceName,
                                    secondName: secondPlaceName}, {merge: true});

    const gameDeleteInvites = this.firestore.firestore.collection(this.INVITESCOLLECTION).doc(this.user.currentGame);
    batchEndGame.delete(gameDeleteInvites);

    return batchEndGame.commit();
  }

  StartGame(smallblind: number, bigblind: number, blindduration: number) {
    // TODO - This will be how we manage state
    // this.authService.user$.subscribe(user => {
      this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame)
        .update({started: true,
          small: smallblind,
          big: bigblind,
          blindDuration: blindduration,
          blindStartDate: firebase.default.firestore.Timestamp.now(),
          gameStartDate: firebase.default.firestore.Timestamp.now()});
    //});
  }

  RaiseBlinds(smallBlind: number, bigBlind: number, blindduration: number) {
    // this.authService.user$.subscribe(user => {
      this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame)
        .update({small: smallBlind, big: bigBlind, blindDuration: blindduration, blindStartDate: firebase.default.firestore.Timestamp.now()});
    // });

  }
  // Helpers
  private ResetPlayersBetTotal() {
    const batch = this.firestore.firestore.batch();

    this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame).collection(this.PLAYERSCOLLECTION, ref => ref.where('folded', '==', false)
    .where('canBet', '==', true))
    .get()
    .subscribe((playerRef) => {
      playerRef.forEach((player) => {
      // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.gameRefId}_${player.data().userRef}`);
      const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                        .doc(this.user.currentGame)
                        .collection(this.PLAYERSCOLLECTION)
                        .doc(player.data().userRef);
      batch.update(batchRef, {totalBet: 0, hasChecked: false});
    });
      batch.commit().then(() => {

      });
    });
  }

  private InitPlayers(){
    this.NEWPlayers$ = this.firestore.collection(this.GAMESCOLLECTION).doc(`${this.user.currentGame}_sortedPlayers`).get().pipe(
      switchMap((usr) => {
        let somearray = []
        usr.data().players.forEach(player => {
          somearray.push(this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame).collection(this.PLAYERSCOLLECTION).doc(player).get())
        });
        return somearray;
      })
    );
    // this.NEWPlayers$ = this.authService.user$.pipe(
    //   switchMap((user) => {
    //     return this.firestore.collection(this.GAMESCOLLECTION).doc(`${this.user.currentGame}_sortedPlayers`).get();
    //   }),
    //   switchMap((user) => {
    //     let somearray = []
    //     //debugger;
    //     user.data().players.forEach(player => {
    //       somearray.push(this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame).collection(this.PLAYERSCOLLECTION).doc(player).get())
    //     });
    //     return somearray;
    //   })
    //   );

    this.handRef = this.firestore.collection(this.GAMESCOLLECTION).doc(`${this.user.currentGame}_${this.HANDCOLLECTION}`);
    this.Players$ = this.firestore.collection(this.GAMESCOLLECTION).doc(this.user.currentGame).collection(this.PLAYERSCOLLECTION).get();
    this.Hand$ = this.firestore.collection(this.GAMESCOLLECTION).doc<Hand>(`${this.user.currentGame}_${this.HANDCOLLECTION}`).valueChanges();
    // this.NEWPlayers$ = this.authService.user$.pipe(
    //   switchMap((user) => {
    //     //debugger;
    //     // this.gameRefId = user.currentGame;
    //     return this.firestore.collection(this.GAMESCOLLECTION).doc(`${this.localStorage.get<User>('user').currentGame}_sortedPlayers`).get();
    //   }),
    //   switchMap((user) => {
    //     let somearray = []
    //     //debugger;
    //     user.data().players.forEach(player => {
    //       somearray.push(this.firestore.collection(this.GAMESCOLLECTION).doc(this.localStorage.get<User>('user').currentGame).collection(this.PLAYERSCOLLECTION).doc(player).get())
    //     });
    //     return somearray;
    //   })
    //   );

    // this.Players$ = this.authService.user$.pipe(
    //     switchMap((user) => {
    //       return this.firestore.collection(this.GAMESCOLLECTION).doc(this.localStorage.get<User>('user').currentGame).collection(this.PLAYERSCOLLECTION).get();
    //     }));

    // this.Hand$ = this.authService.user$.pipe(
    //     switchMap((user) => {
    //       //debugger;
    //       return this.firestore.collection(this.GAMESCOLLECTION).doc<Hand>(`${this.localStorage.get<User>('user').currentGame}_${this.HANDCOLLECTION}`).valueChanges();
    //     }));
  }
}
