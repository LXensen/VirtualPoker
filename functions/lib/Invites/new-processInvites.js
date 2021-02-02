"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processInvites = void 0;
const playerConverter_1 = require("./../playerConverter");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.processInvites = functions.firestore.document('invites/{gameId}').onCreate(async (snap, context) => {
    // console.log(snap.data());
    try {
        let invites = snap.data().invites;
        const sortedUsers = [];
        const gameID = context.params.gameId;
        const player = {
            bgAntee: false,
            canBet: true,
            smAntee: false,
            cardOne: '',
            cardTwo: '',
            dealer: false,
            folded: false,
            hasChecked: false,
            isWinner: false,
            showCards: false,
            stack: 0,
            totalBet: 0,
            gameRef: gameID,
            userRef: '',
            name: ''
        };
        //console.log('********UNSORTED********');
        //console.log(invites);
        invites = invites.sort(() => Math.random() - 0.5);
        //console.log('-----------SORTED-----------');
        //console.log(invites);
        invites.forEach(invite => {
            const email = invite.email;
            admin.firestore().collection('users').where('email', '==', email).get().then((qSnap) => {
                if (qSnap.docs.length === 1) {
                    // this email exists in the App
                    const playerId = qSnap.docs[0].data().uid;
                    const name = qSnap.docs[0].data().displayName;
                    console.log(`mail is ${email} ===> userRef is ${playerId} ===> gameId is ${context.params.gameId}`);
                    // add the doc ref to the games.players
                    player.userRef = playerId;
                    player.name = name;
                    player.stack = Number(invite.stack);
                    // ************************************************************************
                    // You are doing this to gamePlayers, but you also have to add to userGames
                    // Only the 'Creator' is having their userGames created - this is how players
                    // games are listed
                    // ************************************************************************
                    // admin.firestore().collection('userGames').doc(playerId)
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    admin.firestore().collection('usersGames').doc(playerId).collection('games').doc(gameID)
                        .set({ id: gameID }, { merge: true })
                        .then()
                        .catch();
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    admin.firestore().collection('games').doc(gameID + '_sortedPlayers')
                        .set({ players: admin.firestore.FieldValue.arrayUnion(playerId) }, { merge: true })
                        .then()
                        .catch();
                    sortedUsers.push(playerId);
                    admin.firestore().collection('games').doc(gameID).collection('Players').doc(playerId)
                        .withConverter(playerConverter_1.playerConverter)
                        .set(player)
                        .catch((err) => {
                        console.error(err);
                    });
                }
                if (qSnap.docs.length === 0) {
                    // They may have an account in AUTH, but don't have an entry in users
                    // TODO that needs to be fixed. Shouldn't send out a 'signup'
                    // Or is it? Once some has signed up, they are automaticall put in the users table
                    console.log(`email does not exists: ${email}`);
                    const msg = `Hello! Someone has invited you to play Poker! Click <a href="http://stonebridgepokerclub.s3-website-us-east-1.amazonaws.com/signup/${gameID}">here</a> to register`;
                    // attempting to find them in auth
                    admin.firestore().collection('mail').add({
                        to: email,
                        message: {
                            subject: 'Poker Club Invite',
                            html: msg
                        }
                    })
                        .then(() => {
                        console.log('Queued email for delivery!');
                    })
                        .catch((err) => {
                        console.log(`There was an error creating a mail entry. Error is ${err}`);
                    });
                }
                if (qSnap.docs.length > 1) {
                    // There's a problem. There should only be one entry for that email
                    console.log('There was a problem. There should only be one entry for that email');
                }
            }).catch((err) => {
                console.error(err);
            });
        });
        // console.log('this executed before processing');
        // console.log(invites.length);
        // sortedUsers.forEach(element => {
        //     console.log(element)
        // });
        // // eslint-disable-next-line @typescript-eslint/no-floating-promises
        // admin.firestore().collection('games').doc(gameID + '_sortedPlayers')
        // .set({players: sortedUsers})
        // .then()
        // .catch();
    }
    catch (error) {
        console.log(error);
    }
});
//# sourceMappingURL=new-processInvites.js.map