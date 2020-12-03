import { Player } from './../shared/model/player';
import { AuthService } from './auth.service';
import { Deck } from './../shared/model/deck';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Gametemplate } from '../shared/model/gametemplate';
import { Hand } from '../shared/model/hand';
import { User } from '../shared/model/user';

@Injectable({
  providedIn: 'root'
})
export class HoldemService {
  constructor(protected firestore: AngularFirestore,
              private authService: AuthService) {
    this.authService.user$.subscribe(user => {
         this.GAMEREFID = user.currentGame;
         this.gameRef = firestore.collection(this.GAMESCOLLECTION).doc(user.currentGame);
         this.handRef = firestore.collection(this.GAMESCOLLECTION).doc(`${user.currentGame}_${this.HANDCOLLECTION}`);
    });

    this.Players$ = this.authService.user$.pipe(
        switchMap((user) => {
          // return this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', user.currentGame)).get();
          return this.firestore.collection(this.GAMESCOLLECTION).doc(user.currentGame).collection(this.PLAYERSCOLLECTION).get();
        }));

    this.Hand$ = this.authService.user$.pipe(
        switchMap((user) => {
          return this.firestore.collection(this.GAMESCOLLECTION).doc<Hand>(`${user.currentGame}_${this.HANDCOLLECTION}`).valueChanges();
        }));
}
  private currentDeck: Deck;

  private GAMEREFID = '';
  private GAMESCOLLECTION = 'games';
  private INVITESCOLLECTION = 'invites';
  private PLAYERSCOLLECTION = 'Players';
  // private GAMEPLAYERS = 'gamePlayers';
  private HANDCOLLECTION = 'Hand';
  private BLUECARD = 'blue_back';
  private GRAYCARD = 'gray_back';

  handRef: AngularFirestoreDocument;
  gameRef: AngularFirestoreDocument;

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  Players$: Observable<any>;
  Hand$: Observable<Hand>;

PushMessage(message: string) {
  // tslint:disable-next-line:object-literal-shorthand
  this.handRef.update({message: message});
}

GameState(): Observable<Gametemplate> {
  return this.authService.user$.pipe(
    switchMap((user) => {
      // TODO - This is getting hit a lot. Everytime the user is called?
      return this.firestore.collection(this.GAMESCOLLECTION).doc<Gametemplate>(`${user.currentGame}`).valueChanges();
    })
  );
}

LoadPlayer(playerRef: string): Observable<Player> {
  return this.authService.user$.pipe(
    switchMap((user) => {
      // return this.firestore.collection(this.GAMEPLAYERS).doc<Player>(`${user.currentGame}_${playerRef}`).valueChanges();
      return this.firestore.collection(this.GAMESCOLLECTION)
      .doc(`${user.currentGame}`)
      .collection(this.PLAYERSCOLLECTION)
      .doc<Player>(`${playerRef}`).valueChanges();
    })
  );
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
  this.authService.user$.subscribe(user => {
      // return this.firestore.collection(this.GAMEPLAYERS).doc(`${user.currentGame}_${user.uid}`).update({dealer: true});
      return this.firestore.collection(this.GAMESCOLLECTION)
            .doc(`${user.currentGame}`)
            .collection(this.PLAYERSCOLLECTION)
            .doc<Player>(`${user.uid}`)
            .update({dealer: true});
  });

}

FoldPlayer() {
  // remove this player from the list of PlayingPlayers
  this.authService.user$.subscribe(user => {
    // return this.firestore.collection(this.GAMEPLAYERS).doc(`${user.currentGame}_${user.uid}`).update({folded: true, cardOne: this.GRAYCARD, cardTwo: this.GRAYCARD});
    return this.firestore.collection(this.GAMESCOLLECTION)
          .doc(`${user.currentGame}`)
          .collection(this.PLAYERSCOLLECTION)
          .doc<Player>(`${user.uid}`)
          .update({folded: true, cardOne: this.GRAYCARD, cardTwo: this.GRAYCARD});
  });
}

CheckPlayer() {
  this.authService.user$.subscribe(user => {
    // return this.firestore.collection(this.GAMEPLAYERS).doc(`${user.currentGame}_${user.uid}`).update({hasChecked: true});
    return this.firestore.collection(this.GAMESCOLLECTION)
          .doc(`${user.currentGame}`)
          .collection(this.PLAYERSCOLLECTION)
          .doc<Player>(`${user.uid}`)
          .update({hasChecked: true});
  });
}
  // implements small, big and 'normal' bet
  Bet(amount: number, playerRef: string, name: string, betAmount: number, anteeType?: string) {
    let msg = '';
    const increaseBy = firebase.default.firestore.FieldValue.increment(Number(betAmount));

    this.authService.user$.subscribe(user => {
      // const playerref = this.firestore.collection(this.GAMEPLAYERS).doc(`${user.currentGame}_${user.uid}`);
      const playerref = this.firestore.collection(this.GAMESCOLLECTION)
                            .doc(`${user.currentGame}`)
                            .collection(this.PLAYERSCOLLECTION)
                            .doc(`${user.uid}`);

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
    });
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
              // const playerref = this.firestore.collection(this.GAMEPLAYERS).doc(`${this.GAMEREFID}_${player}`);
              const playerref = this.firestore.collection(this.GAMESCOLLECTION)
                                  .doc(this.GAMEREFID)
                                  .collection(this.PLAYERSCOLLECTION)
                                  .doc(player);
              playerref.update({stack: increaseStacktBy});
            });

            // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.GAMEREFID)
            this.firestore.collection(this.GAMESCOLLECTION).doc(this.GAMEREFID).collection(this.PLAYERSCOLLECTION, ref => ref.where('gameRef', '==', this.GAMEREFID)
            .where('canBet', '==', true))
            .get()
            .subscribe((val) => {
              const batch = this.firestore.firestore.batch();
              val.forEach((doc) => {
                // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.GAMEREFID}_${doc.data().userRef}`);
                const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                                  .doc(this.GAMEREFID)
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
                // make sure players with no money ( stack = 0 ) are set to canbet = false
                // find the players of this game ( starts with GameRefId - gamerefid_playerrefid)
                // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where(firebase.default.firestore.FieldPath.documentId(), '>=', this.GAMEREFID)
                // .where(firebase.default.firestore.FieldPath.documentId(), '<', '_'))
                //   .get()
                //   .toPromise().then((players) => {
                //     players.forEach((player) => {
                //       if (player.get('canBet') === true && player.get('stack') < 1){
                //         const playerref = this.firestore.collection(this.GAMEPLAYERS).doc(`${this.GAMEREFID}_${player.get('userRef')}`);
                //         playerref.update({canBet: false, stack: 0});
                //       }
                //     });
                //   });
                this.firestore.collection(this.GAMESCOLLECTION).doc(this.GAMEREFID).collection(this.PLAYERSCOLLECTION, ref => ref.where('canBet', '==', true)
                              .where('stack', '<', 1))
                              .get().subscribe(players => {
                                  players.forEach((player) => {
                                    const playerref = this.firestore.collection(this.GAMESCOLLECTION).doc(this.GAMEREFID).collection(this.PLAYERSCOLLECTION).doc(player.get('userRef'));
                                    console.log(player.get('userRef') + ' can not bet');
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
    // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.GAMEREFID)
    this.firestore.collection(this.GAMESCOLLECTION).doc(this.GAMEREFID)
        .collection(this.PLAYERSCOLLECTION, ref => ref.where('folded', '==', false)
        // .where('folded', '==', false)
        .where('canBet', '==', true))
        .get()
        .subscribe((playerRef) => {
          const batch = this.firestore.firestore.batch();
          playerRef.forEach((player) => {
          // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.GAMEREFID}_${player.data().userRef}`);
          const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                          .doc(this.GAMEREFID)
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
    // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.GAMEREFID)
    this.firestore.collection(this.GAMESCOLLECTION).doc(this.GAMEREFID)
        .collection(this.PLAYERSCOLLECTION, ref => ref.where('folded', '==', false)
        // .where('folded', '==', false)
        .where('canBet', '==', true))
        .get()
        .subscribe((playerRef) => {
          const batch = this.firestore.firestore.batch();
          playerRef.forEach((player) => {
          // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.GAMEREFID}_${player.data().userRef}`);
          const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                                .doc(this.GAMEREFID)
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
    // return this.firestore.collection(this.GAMEPLAYERS).doc(`${gameRef}_${userRef}`).get();
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
    this.firestore.collection(this.GAMESCOLLECTION).doc(this.GAMEREFID).collection(this.PLAYERSCOLLECTION, ref => ref.where('folded', '==', false)
    .where('canBet', '==', true))
    .get()
    // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.GAMEREFID)
    // .where('folded', '==', false)
    // .where('canBet', '==', true))
    // .get()
    .subscribe((val) => {
      const batch = this.firestore.firestore.batch();
      val.forEach((doc) => {
        // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.GAMEREFID}_${doc.data().userRef}`);
        const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                          .doc(this.GAMEREFID)
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
                                  .doc(`${this.GAMEREFID}`)
                                  .collection(this.PLAYERSCOLLECTION)
                                  .doc(`${playerRef}`)
                                  .update({
                                    isWinner: true
                                  });

    // this.firestore.collection(this.GAMEPLAYERS).doc(`${this.GAMEREFID}_${playerRef}`).update({
    //   isWinner: true
    // });
  }

  RemoveWinner(playerRef: string) {
    this.handRef.update({
      winner: firebase.default.firestore.FieldValue.arrayRemove(playerRef)
    });

    this.firestore.collection(this.GAMEREFID).doc(playerRef).update({
      isWinner: false
    });
  }

  FinishGame(firstPlaceRef: string, firstPlaceName: string, secondPlaceRef: string, secondPlaceName: string): Promise<void> {
    const batchEndGame = this.firestore.firestore.batch();

    const gameEndUpdate = this.firestore.firestore.collection(this.GAMESCOLLECTION).doc(this.GAMEREFID);
    batchEndGame.set(gameEndUpdate, {completed: true,
                                    winner: firstPlaceRef,
                                    second: secondPlaceRef,
                                    winnerName: firstPlaceName,
                                    secondName: secondPlaceName}, {merge: true});

    const gameDeleteInvites = this.firestore.firestore.collection(this.INVITESCOLLECTION).doc(this.GAMEREFID);
    batchEndGame.delete(gameDeleteInvites);

    return batchEndGame.commit();
  }

  StartGame(smallblind: number, bigblind: number, blindduration: number) {
    // TODO - This will be how we manage state
    this.authService.user$.subscribe(user => {
      this.firestore.collection(this.GAMESCOLLECTION).doc(user.currentGame)
        .update({started: true,
          small: smallblind,
          big: bigblind,
          blindDuration: blindduration,
          blindStartDate: firebase.default.firestore.Timestamp.now(),
          gameStartDate: firebase.default.firestore.Timestamp.now()});
    });
  }

  RaiseBlinds(smallBlind: number, bigBlind: number, blindduration: number) {
    this.authService.user$.subscribe(user => {
      this.firestore.collection(this.GAMESCOLLECTION).doc(user.currentGame)
        .update({small: smallBlind, big: bigBlind, blindDuration: blindduration, blindStartDate: firebase.default.firestore.Timestamp.now()});
    });

  }
  // Helpers
  private ResetPlayersBetTotal() {
    const batch = this.firestore.firestore.batch();

    this.firestore.collection(this.GAMESCOLLECTION).doc(this.GAMEREFID).collection(this.PLAYERSCOLLECTION, ref => ref.where('folded', '==', false)
    .where('canBet', '==', true))
    .get()
    // this.firestore.collection(this.GAMEPLAYERS, ref => ref.where('gameRef', '==', this.GAMEREFID)
    // .where('folded', '==', false)
    // .where('canBet', '==', true))
    // .get()
    .subscribe((playerRef) => {
      playerRef.forEach((player) => {
      // const batchRef = this.firestore.firestore.collection(this.GAMEPLAYERS).doc(`${this.GAMEREFID}_${player.data().userRef}`);
      const batchRef = this.firestore.firestore.collection(this.GAMESCOLLECTION)
                        .doc(this.GAMEREFID)
                        .collection(this.PLAYERSCOLLECTION)
                        .doc(player.data().userRef);
      batch.update(batchRef, {totalBet: 0, hasChecked: false});
    });
      batch.commit().then(() => {

      });
    });
  }
}
