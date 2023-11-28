import { mock } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import { createPlayerForTesting } from '../../../TestUtils';
import {
  GAME_ID_MISSMATCH_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  INVALID_COMMAND_MESSAGE,
} from '../../../lib/InvalidParametersError';
import Player from '../../../lib/Player';
import {
  GameInstanceID,
  ChessGameState,
  ChessMove,
  TownEmitter,
} from '../../../types/CoveyTownSocket';
import King from './ChessPieces/King';
import * as ChessGameModule from './ChessGame';
import ChessGameArea from './ChessGameArea';
import Game from '../Game';

class TestingGame extends Game<ChessGameState, ChessMove> {
  public constructor() {
    super({
      pieces: [],
      moves: [],
      status: 'WAITING_TO_START',
    });
  }

  public applyMove(): void {}

  public endGame(winner?: string) {
    this.state = {
      ...this.state,
      status: 'OVER',
      winner,
    };
  }

  protected _join(player: Player): void {
    if (this.state.white) {
      this.state.black = player.id;
    } else {
      this.state.white = player.id;
    }
    this._players.push(player);
  }

  protected _leave(): void {}
}
describe('ChessArea', () => {
  let gameArea: ChessGameArea;
  let player1: Player;
  let player2: Player;
  let interactableUpdateSpy: jest.SpyInstance;
  let game: TestingGame;
  beforeEach(() => {
    const gameConstructorSpy = jest.spyOn(ChessGameModule, 'default');
    game = new TestingGame();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Testing without using the real game class)
    gameConstructorSpy.mockReturnValue(game);

    player1 = createPlayerForTesting();
    player2 = createPlayerForTesting();
    gameArea = new ChessGameArea(
      nanoid(),
      { x: 0, y: 0, width: 100, height: 100 },
      mock<TownEmitter>(),
    );
    gameArea.add(player1);
    gameArea.add(player2);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore (Test requires access to protected method)
    interactableUpdateSpy = jest.spyOn(gameArea, '_emitAreaChanged');
  });
  describe('handleCommand', () => {
    describe('[T3.1] when given a JoinGame command', () => {
      describe('when there is no game in progress', () => {
        it('should create a new game and call _emitAreaChanged', () => {
          const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, player1);
          expect(gameID).toBeDefined();
          if (!game) {
            throw new Error('Game was not created by the first call to join');
          }
          expect(gameID).toEqual(game.id);
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        });
      });
      describe('when there is a game in progress', () => {
        it('should dispatch the join command to the game and call _emitAreaChanged', () => {
          const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, player1);
          if (!game) {
            throw new Error('Game was not created by the first call to join');
          }
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);

          const joinSpy = jest.spyOn(game, 'join');
          const gameID2 = gameArea.handleCommand({ type: 'JoinGame' }, player2).gameID;
          expect(joinSpy).toHaveBeenCalledWith(player2);
          expect(gameID).toEqual(gameID2);
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(2);
        });
        it('should not call _emitAreaChanged if the game throws an error', () => {
          gameArea.handleCommand({ type: 'JoinGame' }, player1);
          if (!game) {
            throw new Error('Game was not created by the first call to join');
          }
          interactableUpdateSpy.mockClear();

          const joinSpy = jest.spyOn(game, 'join').mockImplementationOnce(() => {
            throw new Error('Test Error');
          });
          expect(() => gameArea.handleCommand({ type: 'JoinGame' }, player2)).toThrowError(
            'Test Error',
          );
          expect(joinSpy).toHaveBeenCalledWith(player2);
          expect(interactableUpdateSpy).not.toHaveBeenCalled();
        });
      });
    });
    describe('[T3.2] when given a GameMove command', () => {
      it('should throw an error when there is no game in progress', () => {
        const testPiece = new King('B', 0, 0);
        expect(() =>
          gameArea.handleCommand(
            {
              type: 'ChessMove',
              move: {
                gamePiece: {
                  piece: testPiece,
                  row: 0,
                  col: 0,
                },
                toRow: 0,
                toCol: 1,
              },
              gameID: nanoid(),
            },
            player1,
          ),
        ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      });
      describe('when there is a game in progress', () => {
        let gameID: GameInstanceID;
        beforeEach(() => {
          gameID = gameArea.handleCommand({ type: 'JoinGame' }, player1).gameID;
          gameArea.handleCommand({ type: 'JoinGame' }, player2);
          interactableUpdateSpy.mockClear();
        });
        it('should throw an error when the game ID does not match', () => {
          const testPiece = new King('B', 0, 0);
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
            gameArea.handleCommand({ type: 'ChessMove', move, gameID: nanoid() }, player1),
          ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
        });
        it('should dispatch the move to the game and call _emitAreaChanged', () => {
          const testPiece = new King('B', 0, 0);
          const move: ChessMove = {
            gamePiece: {
              piece: testPiece,
              row: 0,
              col: 0,
            },
            toRow: 0,
            toCol: 1,
          };
          const applyMoveSpy = jest.spyOn(game, 'applyMove');
          gameArea.handleCommand({ type: 'ChessMove', move, gameID }, player1);
          expect(applyMoveSpy).toHaveBeenCalledWith({
            gameID: game.id,
            playerID: player1.id,
            move: {
              ...move,
              gamePiece: {
                piece: testPiece,
                row: 0,
                col: 0,
              },
              toRow: 0,
              toCol: 1,
            },
          });
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        });
        it('should not call _emitAreaChanged if the game throws an error', () => {
          const testPiece = new King('B', 0, 0);
          const move: ChessMove = {
            gamePiece: {
              piece: testPiece,
              row: 0,
              col: 0,
            },
            toRow: 0,
            toCol: 2,
          };
          const applyMoveSpy = jest.spyOn(game, 'applyMove').mockImplementationOnce(() => {
            throw new Error('Test Error');
          });
          expect(() =>
            gameArea.handleCommand({ type: 'ChessMove', move, gameID }, player1),
          ).toThrowError('Test Error');
          expect(applyMoveSpy).toHaveBeenCalledWith({
            gameID: game.id,
            playerID: player1.id,
            move: {
              ...move,
              gamePiece: {
                piece: testPiece,
                row: 0,
                col: 0,
              },
              toRow: 0,
              toCol: 2,
            },
          });
          expect(interactableUpdateSpy).not.toHaveBeenCalled();
        });
        describe('when the game is over, it records a new row in the history and calls _emitAreaChanged', () => {
          test('when White wins', () => {
            const testPiece = new King('B', 0, 0);
            const move: ChessMove = {
              gamePiece: {
                piece: testPiece,
                row: 0,
                col: 0,
              },
              toRow: 0,
              toCol: 1,
            };
            jest.spyOn(game, 'applyMove').mockImplementationOnce(() => {
              game.endGame(player1.id);
            });
            gameArea.handleCommand({ type: 'ChessMove', move, gameID }, player1);
            expect(game.state.status).toEqual('OVER');
            expect(gameArea.history.length).toEqual(1);
            expect(gameArea.history[0]).toEqual({
              gameID: game.id,
              scores: {
                [player1.userName]: 1,
                [player2.userName]: 0,
              },
            });
            expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
          });
          test('when Black wins', () => {
            const testPiece = new King('B', 0, 0);
            const move: ChessMove = {
              gamePiece: {
                piece: testPiece,
                row: 0,
                col: 0,
              },
              toRow: 0,
              toCol: 1,
            };
            jest.spyOn(game, 'applyMove').mockImplementationOnce(() => {
              game.endGame(player2.id);
            });
            gameArea.handleCommand({ type: 'ChessMove', move, gameID }, player2);
            expect(game.state.status).toEqual('OVER');
            expect(gameArea.history.length).toEqual(1);
            expect(gameArea.history[0]).toEqual({
              gameID: game.id,
              scores: {
                [player1.userName]: 0,
                [player2.userName]: 1,
              },
            });
            expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
          });
          test('when there is a tie', () => {
            const testPiece = new King('B', 0, 0);
            const move: ChessMove = {
              gamePiece: {
                piece: testPiece,
                row: 0,
                col: 0,
              },
              toRow: 0,
              toCol: 1,
            };
            jest.spyOn(game, 'applyMove').mockImplementationOnce(() => {
              game.endGame();
            });
            gameArea.handleCommand({ type: 'ChessMove', move, gameID }, player1);
            expect(game.state.status).toEqual('OVER');
            expect(gameArea.history.length).toEqual(1);
            expect(gameArea.history[0]).toEqual({
              gameID: game.id,
              scores: {
                [player1.userName]: 0,
                [player2.userName]: 0,
              },
            });
            expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
          });
        });
      });
    });

    describe('[T3.3] when given a LeaveGame command', () => {
      describe('when there is no game in progress', () => {
        it('should throw an error', () => {
          expect(() =>
            gameArea.handleCommand({ type: 'LeaveGame', gameID: nanoid() }, player1),
          ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
          expect(interactableUpdateSpy).not.toHaveBeenCalled();
        });
      });
      describe('when there is a game in progress', () => {
        it('should throw an error when the game ID does not match', () => {
          gameArea.handleCommand({ type: 'JoinGame' }, player1);
          interactableUpdateSpy.mockClear();
          expect(() =>
            gameArea.handleCommand({ type: 'LeaveGame', gameID: nanoid() }, player1),
          ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
          expect(interactableUpdateSpy).not.toHaveBeenCalled();
        });
        it('should dispatch the leave command to the game and call _emitAreaChanged', () => {
          const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, player1);
          if (!game) {
            throw new Error('Game was not created by the first call to join');
          }
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
          const leaveSpy = jest.spyOn(game, 'leave');
          gameArea.handleCommand({ type: 'LeaveGame', gameID }, player1);
          expect(leaveSpy).toHaveBeenCalledWith(player1);
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(2);
        });
        it('should not call _emitAreaChanged if the game throws an error', () => {
          gameArea.handleCommand({ type: 'JoinGame' }, player1);
          if (!game) {
            throw new Error('Game was not created by the first call to join');
          }
          interactableUpdateSpy.mockClear();
          const leaveSpy = jest.spyOn(game, 'leave').mockImplementationOnce(() => {
            throw new Error('Test Error');
          });
          expect(() =>
            gameArea.handleCommand({ type: 'LeaveGame', gameID: game.id }, player1),
          ).toThrowError('Test Error');
          expect(leaveSpy).toHaveBeenCalledWith(player1);
          expect(interactableUpdateSpy).not.toHaveBeenCalled();
        });
        it('should update the history if the game is over', () => {
          const { gameID } = gameArea.handleCommand({ type: 'JoinGame' }, player1);
          gameArea.handleCommand({ type: 'JoinGame' }, player2);
          interactableUpdateSpy.mockClear();
          jest.spyOn(game, 'leave').mockImplementationOnce(() => {
            game.endGame(player1.id);
          });
          gameArea.handleCommand({ type: 'LeaveGame', gameID }, player1);
          expect(game.state.status).toEqual('OVER');
          expect(gameArea.history.length).toEqual(1);
          expect(gameArea.history[0]).toEqual({
            gameID: game.id,
            scores: {
              [player1.userName]: 1,
              [player2.userName]: 0,
            },
          });
          expect(interactableUpdateSpy).toHaveBeenCalledTimes(1);
        });
      });
    });
    describe('[T3.4] when given a ChessDraw command', () => {
      it('should throw an error when there is no game in progress', () => {
        expect(() =>
          gameArea.handleCommand(
            {
              type: 'ChessDraw',
              gameID: nanoid(),
            },
            player1,
          ),
        ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      });
      describe('when there is a game in progress', () => {
        // let gameID: GameInstanceID;
        beforeEach(() => {
          // gameID = gameArea.handleCommand({ type: 'JoinGame' }, player1).gameID;
          gameArea.handleCommand({ type: 'JoinGame' }, player2);
          interactableUpdateSpy.mockClear();
        });
        it('should throw an error when there if the game id does not match', () => {
          expect(() =>
            gameArea.handleCommand(
              {
                type: 'ChessDraw',
                gameID: nanoid(),
              },
              player1,
            ),
          ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
        });
      });
    });
    /** 
    describe('[T3.4] when given a Promotion command', () => {
      it('should throw an error when there is no game in progress', () => {
        expect(() =>
          gameArea.handleCommand(
            {
              type: 'Promotion',
              gameID: nanoid(),
               promo: 'Q',
            },
            player1,
          ),
        ).toThrowError(GAME_NOT_IN_PROGRESS_MESSAGE);
      });
      
      describe('when there is a game in progress', () => {
        let gameID: GameInstanceID;
        beforeEach(() => {
          gameID = gameArea.handleCommand({ type: 'JoinGame' }, player1).gameID;
          gameArea.handleCommand({ type: 'JoinGame' }, player2);
          interactableUpdateSpy.mockClear();
        });
        it('should throw an error when there if the game id does not match', () => {
          expect(() =>
            gameArea.handleCommand(
              {
                type: 'Promotion',
                gameID: nanoid(),
                promo: 'Q',
              },
              player1,
            ),
          ).toThrowError(GAME_ID_MISSMATCH_MESSAGE);
        });
        it('should update the promotion type when given a valid command', () => {
          gameArea.handleCommand(
            {
              type: 'Promotion',
              gameID,
              promo: 'R',
            },
            player1,
          );
          expect(gameArea.game?.promotion).toEqual('R');
        });
        it('should update the promotion type when given a valid command v2', () => {
          gameArea.handleCommand(
            {
              type: 'Promotion',
              gameID,
              promo: 'N',
            },
            player1,
          );
          expect(gameArea.game?.promotion).toEqual('N');
          gameArea.handleCommand(
            {
              type: 'Promotion',
              gameID: game.id,
              promo: 'Q',
            },
            player1,
          );
          expect(gameArea.game?.promotion).toEqual('Q');
        });
      });
    }); */
    describe('[T3.4] when given an invalid command', () => {
      it('should throw an error', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore (Testing an invalid command, only possible at the boundary of the type system)
        expect(() => gameArea.handleCommand({ type: 'InvalidCommand' }, player1)).toThrowError(
          INVALID_COMMAND_MESSAGE,
        );
        expect(interactableUpdateSpy).not.toHaveBeenCalled();
      });
    });
  });
});
