import { PlayerTemplate } from './PlayerTemplate';

export const playerConverter = {
    toFirestore(player: PlayerTemplate): FirebaseFirestore.DocumentData {
      return {
            canBet: player.canBet,
            bgAntee: player.bgAntee, 
            smAntee: player.smAntee,
            cardOne: player.cardOne,
            cardTwo: player.cardTwo,
            dealer: player.dealer,
            folded: player.folded,
            hasChecked: player.hasChecked,
            isWinner: player.isWinner,
            showCards: player.showCards,
            stack: player.stack,
            totalBet: player.totalBet,
            gameRef: player.gameRef,
            userRef: player.userRef,
            name: player.name
        };
    },
    fromFirestore(
      data: FirebaseFirestore.DocumentData
    ): PlayerTemplate {
        const player: PlayerTemplate = {
            canBet: data.canBet,
            bgAntee: data.bgAntee,
            smAntee: data.smAntee,
            cardOne: data.cardOne,
            cardTwo: data.cardTwo,
            dealer: data.dealer,
            folded: data.folded,
            hasChecked: data.hasChecked,
            isWinner: data.isWinner,
            showCards: data.showCards,
            stack: data.stack,
            totalBet: data.totalBet,
            gameRef: data.gameRef,
            userRef: data.userRef,
            name: data.name
          };
      return player;
    }
  };