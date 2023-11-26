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
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player1.id,
              move,
            }),
          ).toThrowError(MOVE_NOT_YOUR_TURN_MESSAGE);
          const testPiece1 = new Pawn('W', 2, 1);
          const move1: ChessMove = {
            gamePiece: {
              piece: testPiece1,
              row: 2,
              col: 1,
            },
            toRow: 3,
            toCol: 1,
          };
          game.applyMove({
            gameID: game.id,
            playerID: player2.id,
            move: move1,
          });
          expect(() =>
            game.applyMove({
              gameID: game.id,
              playerID: player2.id,
              move,
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
      it('Valid move should update board', () => {
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
        expect(game.board[1][4]?.type).toEqual('P');
        expect(game.board[2][4]).toBeUndefined()
        expect(game.state.moves.length).toEqual(0);
        game.applyMove({gameID: game.id, playerID: player1.id, move});
        expect(game.state.moves.length).toEqual(1);
        expect(game.board[1][4]).toBeUndefined()
        expect(game.board[2][4]?.type).toEqual('P');
      });
      
      
    });
  });
});
