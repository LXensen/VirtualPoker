"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerGameConverter = void 0;
exports.playerGameConverter = {
    toFirestore(player) {
        return { currentGame: player.currentGame,
            hasStarted: player.hasStarted,
            isCreator: player.isCreator,
            pastGames: player.pastGames
        };
    },
    fromFirestore(data) {
        const player = {
            currentGame: data.currentGame,
            hasStarted: data.hasStarted,
            isCreator: data.isCreator,
            pastGames: data.pastGames
        };
        return player;
    }
};
//# sourceMappingURL=playerGameConverter.js.map