"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
admin.initializeApp();
const processInvites = require('./Invites/new-processInvites');
// const createGame = require('./game/createGame');
exports.processInvites = processInvites.processInvites;
// exports.createGame = createGame.createGame;
//# sourceMappingURL=index.js.map