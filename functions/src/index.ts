import * as admin from 'firebase-admin';

admin.initializeApp();

const processInvites = require('./Invites/new-processInvites');
// const createGame = require('./game/createGame');


exports.processInvites = processInvites.processInvites;
// exports.createGame = createGame.createGame;
