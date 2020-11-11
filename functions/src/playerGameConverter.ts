import { PlayerGameTemplate } from './PlayerGameTemplate';

export const playerGameConverter = {
    toFirestore(player: PlayerGameTemplate): FirebaseFirestore.DocumentData {
      return {currentGame: player.currentGame, 
            hasStarted: player.hasStarted,
            isCreator: player.isCreator,
            pastGames: player.pastGames
        };
    },
    fromFirestore(
      data: FirebaseFirestore.DocumentData
    ): PlayerGameTemplate {
        const player: PlayerGameTemplate = {
            currentGame: data.currentGame,
            hasStarted: data.hasStarted,
            isCreator: data.isCreator,
            pastGames: data.pastGames
          };
      return player;
    }
  };