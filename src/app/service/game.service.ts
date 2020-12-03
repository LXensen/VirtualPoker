import { Player } from './../shared/model/player';
import { Hand } from '../shared/model/hand';
import { map, switchMap, take } from 'rxjs/operators';
import { User } from './../shared/model/user';
import { Gametemplate } from './../shared/model/gametemplate';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import * as firebase from 'firebase';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private GAMES = 'games';
  private INVITES = 'invites';
  private USERS = 'users';
  // private GAMEPLAYERS = 'gamePlayers';
  private BLUE_BACK = 'blue_back';

  constructor(private afStore: AngularFirestore, private authService: AuthService) {
  }

  // **********************
  // THIS IS NOW A FUNCTION
  // **********************
  NewGame(emails: Array<string>, startDate: string, stackSize: number ) {
    let userid: string;
    let displayname: string;

    const newGame: Gametemplate = {
      gameStartDate: new Date(startDate.replace('-', '/')),
      big: 0,
      small: 0,
      startingStack: stackSize,
      winner: '',
      second: '',
      completed: false,
      started: false,
      gameRef: '',
      userRef: '',  // Creator of the game
      blindDuration: '',
      blindStartDate: new Date(startDate.replace('-', '/')),
    };

    const newPlayer: Player = {
      canBet: true,
      folded: false,
      hasChecked: false,
      smAntee: 0,
      bgAntee: 0,
      dealer: false,
      showCards: false,
      isWinner: false,
      cardOne: '',
      cardTwo: '',
      stack: stackSize,
      name: '',
      userRef: '',
      gameRef: '',
      totalBet: 0,
    };

    const newHand: Hand = {
      cardFive: this.BLUE_BACK,
      cardFour: this.BLUE_BACK,
      cardThree: this.BLUE_BACK,
      cardTwo: this.BLUE_BACK,
      cardOne: this.BLUE_BACK,
      potSize: 0,
      message: '',
      winner: new Array<string>(),
    };

    return this.authService.user$.pipe(
      take(1),
      map(usr => {
      if (!emails.includes(usr.email) ) {
        emails.push(usr.email);
      }

      displayname = usr.displayName;
      userid = usr.uid;
      newGame.userRef = usr.uid;

      return this.afStore.collection(this.GAMES).add(newGame)
      .then(gameRef => {
        this.afStore.collection(this.GAMES).doc(gameRef.id).update({gameRef: gameRef.id}).then();

        const invites = new Array<any>();
        emails.forEach(email => {
          invites.push({email, state: 'invited', stack: stackSize});
          // Find the user based on this email. Return the REFID, add a new game to their pastGames
        });
        return this.afStore.collection(this.INVITES).doc(gameRef.id).set({invites})
        .then(() => {
          this.afStore.collection(this.USERS).doc(userid)
            .set({pastGames: firebase.default.firestore.FieldValue.arrayUnion(gameRef.id)}, {merge: true});
            // this.afStore.collection(this.USERGAMES).doc(this.userRef)
            // .set({currentGame: gameRef.id, isCreator: true, hasStarted: false, pastGames: []}, {merge: true});
          newPlayer.userRef = userid;
          newPlayer.gameRef = gameRef.id;
          newPlayer.name = displayname;
          newPlayer.stack = stackSize;
          console.log(newPlayer);
          this.afStore.collection(this.GAMES).doc(gameRef.id).collection('Players').doc(userid).set(newPlayer);
          // this.afStore.collection(this.GAMEPLAYERS).doc(`${gameRef.id}_${userid}`).set(newPlayer);
          // initialize the doc that will hold the hand
          this.afStore.collection(this.GAMES).doc(`${gameRef.id}_Hand`).set(newHand);
        });
      });
    }));
    // return this.authService.user$.subscribe(usr => {
    //   if (!emails.includes(usr.email) ) {
    //     emails.push(usr.email);
    //   }

    //   displayname = usr.displayName;
    //   userid = usr.uid;
    //   newGame.userRef = usr.uid;

    //   this.afStore.collection(this.GAMES).add(newGame)
    //   .then(gameRef => {
    //     this.afStore.collection(this.GAMES).doc(gameRef.id).update({gameRef: gameRef.id}).then();

    //     const invites = new Array<any>();
    //     emails.forEach(email => {
    //       invites.push({email, state: 'invited', stack: stackSize});
    //       // Find the user based on this email. Return the REFID, add a new game to their pastGames
    //     });
    //     this.afStore.collection(this.INVITES).doc(gameRef.id).set({invites})
    //     .then(() => {
    //       this.afStore.collection(this.USERS).doc(userid)
    //         .set({pastGames: firebase.firestore.FieldValue.arrayUnion(gameRef.id)}, {merge: true});
    //         // this.afStore.collection(this.USERGAMES).doc(this.userRef)
    //         // .set({currentGame: gameRef.id, isCreator: true, hasStarted: false, pastGames: []}, {merge: true});
    //       newPlayer.userRef = userid;
    //       newPlayer.gameRef = gameRef.id;
    //       newPlayer.name = displayname;
    //       newPlayer.stack = stackSize;
    //       console.log(newPlayer);
    //       this.afStore.collection(this.GAMEPLAYERS).doc(`${gameRef.id}_${userid}`).set(newPlayer);
    //       // initialize the doc that will hold the hand
    //       this.afStore.collection(this.GAMES).doc(`${gameRef.id}_Hand`).set(newHand);
    //     });
    //   });
    // });

    // if (!emails.includes(this.authService.FireUser.email) ) {
    //      emails.push(this.authService.FireUser.email);
    // }

    // newGame.userRef = this.authService.FireUser.uid;

    // return this.afStore.collection(this.GAMES).add(newGame)
    //     .then(gameRef => {
    //       this.afStore.collection(this.GAMES).doc(gameRef.id).update({gameRef: gameRef.id}).then();

    //       const invites = new Array<any>();
    //       emails.forEach(email => {
    //         invites.push({email, state: 'invited', stack: stackSize});
    //         // Find the user based on this email. Return the REFID, add a new game to their pastGames
    //       });
    //       this.afStore.collection(this.INVITES).doc(gameRef.id).set({invites})
    //       .then(() => {
    //         this.afStore.collection(this.USERS).doc(this.authService.FireUser.uid)
    //           .set({pastGames: firebase.firestore.FieldValue.arrayUnion(gameRef.id)}, {merge: true});
    //           // this.afStore.collection(this.USERGAMES).doc(this.userRef)
    //           // .set({currentGame: gameRef.id, isCreator: true, hasStarted: false, pastGames: []}, {merge: true});
    //         newPlayer.userRef = this.authService.FireUser.uid;
    //         newPlayer.gameRef = gameRef.id;
    //         newPlayer.name = this.authService.FireUser.displayName;
    //         newPlayer.stack = stackSize;
    //         console.log(newPlayer);
    //         this.afStore.collection(this.GAMEPLAYERS).doc(`${gameRef.id}_${this.authService.FireUser.uid}`).set(newPlayer);
    //         // initialize the doc that will hold the hand
    //         this.afStore.collection(this.GAMES).doc(`${gameRef.id}_Hand`).set(newHand);
    //       });
    //     });
  }

  PlayersGames(pastgames: Array<string>): Observable<any> {
      return this.afStore.collection(this.GAMES, ref => ref.where('gameRef', 'in', pastgames).orderBy('gameStartDate', 'desc')).valueChanges();
    }

   async AddNewlySignedUpPlayerToInvitedGame(gameRefId: string,
                                             userRefId: string,
                                             displayName: string,
                                             email: string) {

    // TODO
    // verify that this email has been invited to the game
    return this.afStore.firestore.collection(this.INVITES).doc(gameRefId).get().then(list => {
      let canjoin = false;
      let stackSize = 0;

      const invites = new Array<any>();

      list.data().invites.forEach(element => {
        if (element.email === email) {
          element.state = 'subscribed';
          stackSize = element.stack;
          canjoin = true;
        }
        invites.push(element);
      });

      if (canjoin) {
        const batchUpdate = this.afStore.firestore.batch();

        const usersBatch = this.afStore.firestore.collection(this.USERS).doc(userRefId);
        batchUpdate.set(usersBatch, {pastGames: firebase.default.firestore.FieldValue.arrayUnion(gameRefId)}, {merge: true});

        const invitesBatch = this.afStore.firestore.collection(this.INVITES).doc(gameRefId);
        batchUpdate.set(invitesBatch, {invites});

        // const gamesUserAddBatch = this.afStore.firestore.collection(this.GAMEPLAYERS).doc(`${gameRefId}_${userRefId}`);
        const gamesUserAddBatch = this.afStore.firestore.collection(this.GAMES).doc(gameRefId).collection('Players').doc(userRefId);
        batchUpdate.set(gamesUserAddBatch, {
          bgAntee: false,
          smAntee: false,
          canBet: true,
          name: displayName,
          cardOne: '',
          cardTwo: '',
          dealer: false,
          folded: false,
          hasChecked: false,
          isWinner: false,
          showCards: false,
          stack: stackSize,
          totalBet: 0,
          gameRef: gameRefId,
          userRef: userRefId,
        });
        batchUpdate.commit().then(() => {

        }).catch(err => {
          console.log(`problem updating newly created user data ${err}`);
        });
      }
    });
  }

  AddNewlySignedUpUser(userRefId: string,
                       displayName: string,
                       email: string): Promise<void> {
          return this.afStore.collection(this.USERS).doc(userRefId).set({displayName, email, uid: userRefId});
  }

  GameInvitees(gameRefId: string): Observable<any> {
    return this.afStore.collection(this.INVITES).doc(gameRefId).get();
  }

  // remove this game from the players(based on email) pastGames
  // remove this player from the games/gamerefid/Players collection
  RemovePlayer(gameRefId: string, email: string) {
    this.afStore.collection(this.USERS, ref => ref.where('email', '==', email))
        .get()
        .subscribe(userDoc => {
          this.afStore.collection(this.GAMES).doc(gameRefId).collection('Players')
                  .doc(userDoc.docs[0].data().uid).delete().then(() => {
                    this.afStore.firestore.collection(this.INVITES).doc(gameRefId).get()
                    .then(details => {
                      const items: Array<any> = [];
                      details.data().invites.forEach(invite => {
                        if (invite.email === email){
                          items.push({email: invite.email, stack: invite.stack, state: 'removed'});
                        } else {
                          items.push({email: invite.email, stack: invite.stack, state: invite.state});
                        }
                      });
                      this.afStore.firestore.collection(this.INVITES).doc(gameRefId).set({invites: items});
                    });
          });
        });
  }

  SetPlayersCurrentGame(gameRefId: string, user: User): Promise<any> {
    const batchUpdate = this.afStore.firestore.batch();

    const usersBatch = this.afStore.firestore.collection(this.USERS).doc(user.uid);
    batchUpdate.set(usersBatch, {currentGame: gameRefId}, {merge: true});

    const gamePlayersBatch = this.afStore.firestore.collection(this.GAMES).doc(gameRefId).collection('Players').doc(user.uid);
    batchUpdate.set(gamePlayersBatch, {name: user.displayName}, {merge: true});

    this.afStore.firestore.collection(this.INVITES).doc(gameRefId).get()
          .then(details => {
            const items: Array<any> = [];
            details.data().invites.forEach(invite => {
              if (invite.email === user.email){
                items.push({email: invite.email, stack: invite.stack, state: 'joined'});
              } else {
                items.push({email: invite.email, stack: invite.stack, state: invite.state});
              }
            });
            this.afStore.firestore.collection(this.INVITES).doc(gameRefId).set({invites: items});
          });
    return batchUpdate.commit();
    return;
  }
}
