import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const createGame = functions.https.onCall( async (data, context) => {
    // const GAMES = 'games';
    // const INVITES = 'invites';
    // const USERS = 'users';
    // const GAMEPLAYERS = 'gamePlayers';
    // const BLUE_BACK = 'blue_back';

    // const emails: [] = data.players;
    // const stackSize: number = data.amount;
    // const userId = context.auth?.uid;

    try {
      // const newGame = {
      //   gameStartDate: new Date(data.startDate.replace('-', '/')),
      //   big: 0,
      //   small: 0,
      //   startingStack: stackSize,
      //   winner: '',
      //   second: '',
      //   completed: false,
      //   started: false,
      //   gameRef: '',
      //   userRef: '',  // Creator of the game
      //   blindDuration: '',
      //   blindStartDate: new Date(data.startDate.replace('-', '/'))
      // };

    //   const newPlayer = {
    //     canBet: true,
    //     folded: false,
    //     hasChecked: false,
    //     smAntee: 0,
    //     bgAntee: 0,
    //     dealer: false,
    //     showCards: false,
    //     isWinner: false,
    //     cardOne: '',
    //     cardTwo: '',
    //     stack: data.stackSize,
    //     name: '',
    //     userRef: '',
    //     gameRef: '',
    //     totalBet: 0,
    //   };

    //   const newHand = {
    //     cardFive: BLUE_BACK,
    //     cardFour: BLUE_BACK,
    //     cardThree: BLUE_BACK,
    //     cardTwo: BLUE_BACK,
    //     cardOne: BLUE_BACK,
    //     potSize: 0,
    //     message: '',
    //     winner: new Array<string>(),
    //   };

    //   if (!data.players.includes(context.auth?.token.email) ) {
    //        data.players.push(context.auth?.token.email);
    //   }
      // newGame.userRef = userId;
      // tslint:disable-next-line: no-floating-promises
    return admin.firestore().collection('users').where('email', '==', 'christensen.lee@gmail.com').get()
       .then((qSnap: any) => {
        return {state: 'ok'};
       })
       .catch(error => {
            console.log(error);
            return {state: 'error', details: error};
       });
    //   admin.firestore().collection(GAMES).add(newGame)
    //   .then(gameRef => {

    //       // tslint:disable-next-line: no-floating-promises
    //     // admin.firestore().collection(GAMES).doc(gameRef.id).update({gameRef: gameRef.id}).then();

    //     // const invites = new Array<any>();
    //     // emails.forEach(email => {
    //     //   invites.push({email, state: 'invited', stack: stackSize});
    //     //   // Find the user based on this email. Return the REFID, add a new game to their pastGames
    //     // });
    //     // // tslint:disable-next-line: no-floating-promises
    //     // admin.firestore().collection(INVITES).doc(gameRef.id).set({invites})
    //     // .then(() => {
    //     //     // tslint:disable-next-line: no-floating-promises
    //     //   admin.firestore().collection(USERS).doc(userId)
    //     //     .set({pastGames: admin.firestore.FieldValue.arrayUnion(gameRef.id)}, {merge: true});
    //     //   newPlayer.userRef = userId;
    //     //   newPlayer.gameRef = gameRef.id;
    //     //   newPlayer.name = context.auth?.token.name;
    //     //   newPlayer.stack = stackSize;
    //     //   console.log(newPlayer);
    //     //   // tslint:disable-next-line: no-floating-promises
    //     //   admin.firestore().collection(GAMEPLAYERS).doc(`${gameRef.id}_${userId}`).set(newPlayer);
    //     //   // initialize the doc that will hold the hand
    //     //   // tslint:disable-next-line: no-floating-promises
    //     //   admin.firestore().collection(GAMES).doc(`${gameRef.id}_Hand`).set(newHand).then();
    //     // });
    //   }).then(() => {
    //         console.log('added ' + emails + ' players');
    //         return {state: 'ok'};
    //   }).catch(err => {
    //     console.log(err);
    //       return {state: 'error', details: err};
    //   });
    } catch (error) {
        console.log(error);
        return {state: 'error'};
    }
});
