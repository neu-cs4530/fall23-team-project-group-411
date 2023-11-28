import { createPlayerForTesting } from '../../../TestUtils';
import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../../lib/InvalidParametersError';
import Player from '../../../lib/Player';
import { ChessMove } from '../../../types/CoveyTownSocket';
import ChessGame from './ChessGame';
import Game from '../Game';
import Pawn from './ChessPieces/Pawn';
import King from './ChessPieces/King';
import Queen from './ChessPieces/Queen';
import Rook from './ChessPieces/Rook';
import Bishop from './ChessPieces/Bishop';
import Knight from './ChessPieces/Knight';
import { length } from 'ramda';

describe('ChessGame', () => {
  let game: ChessGame;

  beforeEach(() => {
    game = new ChessGame();
  });

  describe('ChessGame _join', () => {
    it('should throw an error if the player is already in the game', () => {
      const player = createPlayerForTesting();
      game.join(player);
      expect(() => game.join(player)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
      const player2 = createPlayerForTesting();
      game.join(player2);
      expect(() => game.join(player2)).toThrowError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    });
    it('should throw an error if the game is full', () => {
      const player1 = createPlayerForTesting();
      const player2 = createPlayerForTesting();
      const player3 = createPlayerForTesting();
      game.join(player1);
      game.join(player2);
      expect(() => game.join(player3)).toThrowError(GAME_FULL_MESSAGE);
    });
    describe('When the player can be added', () => {
      it('makes the first player white and initializes the state with status WAITING_TO_START', () => {
        const player = createPlayerForTesting();
        game.join(player);
        expect(game.state.white).toEqual(player.id);
        expect(game.state.black).toBeUndefined();
        expect(game.state.moves).toHaveLength(0);
        expect(game.state.status).toEqual('WAITING_TO_START');
        expect(game.state.winner).toBeUndefined();
      });
      describe('When the second player joins', () => {
        const player1 = createPlayerForTesting();
        const player2 = createPlayerForTesting();
        beforeEach(() => {
          game.join(player1);
          game.join(player2);
        });
        it('makes the second player black', () => {
          expect(game.state.white).toEqual(player1.id);
          expect(game.state.black).toEqual(player2.id);
        });
        it('sets the game status to IN_PROGRESS', () => {
          expect(game.state.status).toEqual('IN_PROGRESS');
          expect(game.state.winner).toBeUndefined();
          expect(game.state.moves).toHaveLength(0);
        });
      });
    });
  });
  describe('ChessGame _leave', () => {
    it('should throw an error if the player is not in the game', () => {
      expect(() => game.leave(createPlayerForTesting())).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
      const player = createPlayerForTesting();
      game.join(player);
      expect(() => game.leave(createPlayerForTesting())).toThrowError(PLAYER_NOT_IN_GAME_MESSAGE);
    });
    describe('when the player is in the game', () => {
      describe('when the game is in progress, it should set the game status to OVER and declare the other player the winner', () => {
        test('when white player leaves', () => {
          const player1 = createPlayerForTesting();
          const player2 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          expect(game.state.white).toEqual(player1.id);
          expect(game.state.black).toEqual(player2.id);

          game.leave(player1);

          expect(game.state.status).toEqual('OVER');
          expect(game.state.winner).toEqual(player2.id);
          expect(game.state.moves).toHaveLength(0);

          expect(game.state.white).toEqual(player1.id);
          expect(game.state.black).toEqual(player2.id);
        });
        test('when black player leaves', () => {
          const player1 = createPlayerForTesting();
          const player2 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          expect(game.state.white).toEqual(player1.id);
          expect(game.state.black).toEqual(player2.id);

          game.leave(player2);

          expect(game.state.status).toEqual('OVER');
          expect(game.state.winner).toEqual(player1.id);
          expect(game.state.moves).toHaveLength(0);

          expect(game.state.white).toEqual(player1.id);
          expect(game.state.black).toEqual(player2.id);
        });
      });
      it('when the game is not in progress, it should set the game status to WAITING_TO_START and remove the player', () => {
        const player1 = createPlayerForTesting();
        game.join(player1);
        expect(game.state.white).toEqual(player1.id);
        expect(game.state.black).toBeUndefined();
        expect(game.state.status).toEqual('WAITING_TO_START');
        expect(game.state.winner).toBeUndefined();
        game.leave(player1);
        expect(game.state.white).toBeUndefined();
        expect(game.state.black).toBeUndefined();
        expect(game.state.status).toEqual('WAITING_TO_START');
        expect(game.state.winner).toBeUndefined();
      });
    });
  });
  describe('applyMove', () => {
    let moves: ChessMove[] = [];
    describe('when given an invalid move', () => {
      it('should throw an error if the game is not in progress', () => {
        const player1 = createPlayerForTesting();
        game.join(player1);
        const testPiece = new King('W', 0, 0);
        const move: ChessMove = {
          gamePiece: {
            piece: testPiece,
            row: 0,
            col: 0,
          },
          toRow: 0,
          toCol: 1,
        };
        expect(() =>
          game.applyMove({
            gameID: game.id,
            playerID: player1.id,
            move,
          }),
        ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      });
      describe('when the game is in progress', () => {
        let player1: Player;
        let player2: Player;
        beforeEach(() => {
          player1 = createPlayerForTesting();
          player2 = createPlayerForTesting();
          game.join(player1);
          game.join(player2);
          expect(game.state.status).toEqual('IN_PROGRESS');
        });
        it('should rely on the player ID to determine whose turn it is', () => {
          const testPiece = new Pawn('W', 1, 1);
          const move: ChessMove = {
            gamePiece: {
              piece: testPiece,
              row: 1,
              col: 1,
            },
            toRow: 2,
            toCol: 1,
          };
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player2.id,
              move,
            }),
          ).toThrowError(MOVE_NOT_YOUR_TURN_MESSAGE);
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player1.id,
              move,
            }),
          ).not.toThrowError(MOVE_NOT_YOUR_TURN_MESSAGE);
        });
        it('should throw an error if the move is out of turn for the player ID', () => {
          const testPiece = new Pawn('W', 1, 1);
          const move: ChessMove = {
            gamePiece: {
              piece: testPiece,
              row: 1,
              col: 1,
            },
            toRow: 2,
            toCol: 1,
          };
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player2.id,
              move,
            }),
          ).toThrowError(MOVE_NOT_YOUR_TURN_MESSAGE);
          game.applyMove({
            gameID: game.id,
            playerID: player1.id,
            move,
          });
          const testPiece2 = new Pawn('W', 1, 2);
          const move2: ChessMove = {
            gamePiece: {
              piece: testPiece2,
              row: 1,
              col: 2,
            },
            toRow: 2,
            toCol: 2,
          };
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player1.id,
              move: move2,
            }),
          ).toThrowError(MOVE_NOT_YOUR_TURN_MESSAGE);
          const testPiece1 = new Pawn('B', 6, 3);
          const move1: ChessMove = {
            gamePiece: {
              piece: testPiece1,
              row: 6,
              col: 3,
            },
            toRow: 5,
            toCol: 3,
          };
          game.applyMove({
            gameID: game.id,
            playerID: player2.id,
            move: move1,
          });
          const testPiece3 = new Rook('W', 0, 0);
          const move3: ChessMove = {
            gamePiece: {
              piece: testPiece3,
              row: 0,
              col: 0,
            },
            toRow: 0,
            toCol: 7,
          };
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player2.id,
              move: move3,
            }),
          ).toThrowError(MOVE_NOT_YOUR_TURN_MESSAGE);
        });
        it('should throw an error if the move is on an occupied space of same color', () => {
          const testPiece = new King('W', 0, 4);
          const move: ChessMove = {
            gamePiece: {
              piece: testPiece,
              row: 0,
              col: 4,
            },
            toRow: 0,
            toCol: 5,
          };
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player2.id,
              move,
            }),
          ).toThrowError(InvalidParametersError);
        });
        it('should throw an error if moving to same square', () => {
          const testPiece = new King('W', 0, 4);
          const move: ChessMove = {
            gamePiece: {
              piece: testPiece,
              row: 0,
              col: 4,
            },
            toRow: 0,
            toCol: 4,
          };
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player2.id,
              move,
            }),
          ).toThrowError(InvalidParametersError);
        });
        it('should not change whose turn it is when an invalid move is made', () => {
          const testPiece = new King('W', 0, 4);
          const move: ChessMove = {
            gamePiece: {
              piece: testPiece,
              row: 0,
              col: 4,
            },
            toRow: 0,
            toCol: 5,
          };
          expect(() => {
            game.applyMove({
              gameID: game.id,
              playerID: player1.id,
              move,
            });
          }).toThrowError(InvalidParametersError);
          expect(game.state.moves).toHaveLength(0);
          const testPiece1 = new Pawn('W', 1, 1);
          const move1: ChessMove = {
            gamePiece: {
              piece: testPiece1,
              row: 1,
              col: 1,
            },
            toRow: 2,
            toCol: 1,
          };
          game.applyMove({
            gameID: game.id,
            playerID: player1.id,
            move: move1,
          });
          expect(game.state.moves).toHaveLength(1);
        });
      });
    });
    describe('when given a valid move', () => {
      let player1: Player;
      let player2: Player;
      let numMoves = 0;
      beforeEach(() => {
        player1 = createPlayerForTesting();
        player2 = createPlayerForTesting();
        numMoves = 0;
        moves = [];
        game.join(player1);
        game.join(player2);
        expect(game.state.status).toEqual('IN_PROGRESS');
      });
      it('Valid move should update state', () => {
        const testPiece = new Pawn('W', 1, 4);
        const move: ChessMove = {
          gamePiece: {
            piece: testPiece,
            row: 1,
            col: 4,
          },
          toRow: 2,
          toCol: 4,
        };

        expect(game.state.moves.length).toEqual(0);
        game.applyMove({gameID: game.id, playerID: player1.id, move});
        expect(game.state.moves.length).toEqual(1);
        expect(game.state.moves[0]).toEqual(move);
      });
      it('should not end the game if the move does not end the game', () => {
        const testPiece = new Pawn('W', 1, 4);
        const move: ChessMove = {
          gamePiece: {
            piece: testPiece,
            row: 1,
            col: 4,
          },
          toRow: 2,
          toCol: 4,
        };
        expect(game.state.moves.length).toEqual(0);
        game.applyMove({gameID: game.id, playerID: player1.id, move});
        expect(game.state.moves.length).toEqual(1);
        expect(game.state.moves[0]).toEqual(move);
        const testPiece1 = new Pawn('B', 6, 4);
        const move1: ChessMove = {
          gamePiece: {
            piece: testPiece1,
            row: 6,
            col: 4,
          },
          toRow: 5,
          toCol: 4,
        };
        game.applyMove({gameID: game.id, playerID: player2.id, move: move1});
        expect(game.state.moves.length).toEqual(2);
        expect(game.state.moves[0]).toEqual(move);
        expect(game.state.moves[1]).toEqual(move1);
      });
      it('should end the game and declare a white win if the black king is not on the board', () => {
        const testPiece = new Pawn('W', 1, 3);
        const move: ChessMove = {
          gamePiece: {
            piece: testPiece,
            row: 1,
            col: 3,
          },
          toRow: 2,
          toCol: 3,
        };
        game.applyMove({gameID: game.id, playerID: player1.id, move});

        const testPiece1 = new Pawn('B', 6, 4);
        const move1: ChessMove = {
          gamePiece: {
            piece: testPiece1,
            row: 6,
            col: 4,
          },
          toRow: 5,
          toCol: 4,
        };
        game.applyMove({gameID: game.id, playerID: player2.id, move: move1});
        const testPiece2 = new Bishop('W', 0, 2);
        const move2: ChessMove = {
          gamePiece: {
            piece: testPiece2,
            row: 0,
            col: 2,
          },
          toRow: 4,
          toCol: 6,
        };
        game.applyMove({gameID: game.id, playerID: player1.id, move: move2});

        const testPiece3 = new Pawn('B', 6, 7);
        const move3: ChessMove = {
          gamePiece: {
            piece: testPiece3,
            row: 6,
            col: 7,
          },
          toRow: 5,
          toCol: 7,
        };
        game.applyMove({gameID: game.id, playerID: player2.id, move: move3});

        const testPiece4 = new Bishop('W', 4, 6);
        const move4: ChessMove = {
          gamePiece: {
            piece: testPiece4,
            row: 4,
            col: 6,
          },
          toRow: 7,
          toCol: 3,
        };
        game.applyMove({gameID: game.id, playerID: player1.id, move: move4});
        expect(game.state.status).toEqual('OVER');
        expect(game.state.winner).toEqual(player1.id);
      });
      it('should end the game and declare a black win if the white king is not on the board', () => {
        const testPiece = new Pawn('W', 1, 4);
        const move: ChessMove = {
          gamePiece: {
            piece: testPiece,
            row: 1,
            col: 4,
          },
          toRow: 2,
          toCol: 4,
        };
        game.applyMove({gameID: game.id, playerID: player1.id, move});
        const testPiece1 = new Pawn('B', 6, 3);
        const move1: ChessMove = {
          gamePiece: {
            piece: testPiece1,
            row: 6,
            col: 3,
          },
          toRow: 5,
          toCol: 3,
        };
        game.applyMove({gameID: game.id, playerID: player2.id, move: move1});
        const testPiece2 = new Pawn('W', 1, 0);
        const move2: ChessMove = {
          gamePiece: {
            piece: testPiece2,
            row: 1,
            col: 0,
          },
          toRow: 2,
          toCol: 0,
        };
        game.applyMove({gameID: game.id, playerID: player1.id, move: move2});

        const testPiece3 = new Bishop('B', 7, 2);
        const move3: ChessMove = {
          gamePiece: {
            piece: testPiece3,
            row: 7,
            col: 2,
          },
          toRow: 3,
          toCol: 6,
        };
        game.applyMove({gameID: game.id, playerID: player2.id, move: move3});

        const testPiece4 = new Pawn('W', 2, 0);
        const move4: ChessMove = {
          gamePiece: {
            piece: testPiece4,
            row: 2,
            col: 0,
          },
          toRow: 3,
          toCol: 0,
        };
        game.applyMove({gameID: game.id, playerID: player1.id, move: move4});

        const testPiece5 = new Bishop('W', 3, 6);
        const move5: ChessMove = {
          gamePiece: {
            piece: testPiece5,
            row: 3,
            col: 6,
          },
          toRow: 0,
          toCol: 3,
        };
        game.applyMove({gameID: game.id, playerID: player2.id, move: move5});
        expect(game.state.status).toEqual('OVER');
        expect(game.state.winner).toEqual(player2.id);
      });
    });
  });
});
