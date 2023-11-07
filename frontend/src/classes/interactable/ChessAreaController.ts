import _ from 'lodash';
import {
  GameArea,
  GameStatus,
  ChessGameState,
  IChessPiece,
  ChessColor,
  ChessMove
} from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, { GameEventTypes } from './GameAreaController';

export const PLAYER_NOT_IN_GAME_ERROR = 'Player is not in game';

export const NO_GAME_IN_PROGRESS_ERROR = 'No game in progress';

export type ChessEvents = GameEventTypes & {
  boardChanged: (board: IChessPiece[][]) => void;
  turnChanged: (isOurTurn: boolean) => void;
};

/**
 * This class is responsible for managing the state of the Chess game, and for sending commands to the server
 */
export default class ChessAreaController extends GameAreaController<
  ChessGameState,
  ChessEvents
> {

  protected _board: IChessPiece[][] = []; // here we instantiate an empty board

  /**
   * TODO: add documentation
   */
  get board(): IChessPiece[][] {
    return [][0];
  }

  /**
   * Returns the player with the white pieces, if there is one, or undefined otherwise
   */
  get white(): PlayerController | undefined {
    const w = this._model.game?.state.w;
    if (w) {
      return this.occupants.find(eachOccupant => eachOccupant.id === w);
    }
    return undefined;
  }

  /**
   * Returns the player with the black pieces, if there is one, or undefined otherwise
   */
  get black(): PlayerController | undefined {
    const b = this._model.game?.state.b;
    if (b) {
      return this.occupants.find(eachOccupant => eachOccupant.id === b);
    }
    return undefined;
  }

  /**
   * Returns the number of moves that have been made in the game
   */
  get moveCount(): number {
    return this._model.game?.state.moves.length || 0;
  }

  /**
   * Returns the winner of the game, if there is one
   */
  get winner(): PlayerController | undefined {
    const winner = this._model.game?.state.winner;
    if (winner) {
      return this.occupants.find(eachOccupant => eachOccupant.id === winner);
    }
    return undefined;
  }

  /**
   * Returns the player whose turn it is, if the game is in progress
   * Returns undefined if the game is not in progress
   */
  get whoseTurn(): PlayerController | undefined {
    const w = this.white;
    const b = this.black;
    if (!w || !b || this._model.game?.state.status !== 'IN_PROGRESS') {
      return undefined;
    }
    if (this.moveCount % 2 === 0) {
      return w;
    } else if (this.moveCount % 2 === 1) {
      return b;
    } else {
      throw new Error('Invalid move count');
    }
  }

  get isOurTurn(): boolean {
    return this.whoseTurn?.id === this._townController.ourPlayer.id;
  }

  /**
   * Returns true if the current player is a player in this game
   */
  get isPlayer(): boolean {
    return this._model.game?.players.includes(this._townController.ourPlayer.id) || false;
  }

  /**
   * Returns the game piece of the current player, if the current player is a player in this game
   *
   * Throws an error PLAYER_NOT_IN_GAME_ERROR if the current player is not a player in this game
   */
  get gamePiece(): ChessColor {
    if (this.white?.id === this._townController.ourPlayer.id) {
      return 'W';
    } else if (this.black?.id === this._townController.ourPlayer.id) {
      return 'B';
    }
    throw new Error(PLAYER_NOT_IN_GAME_ERROR);
  }

  /**
   * Returns the status of the game.
   * Defaults to 'WAITING_TO_START' if the game is not in progress
   */
  get status(): GameStatus {
    const status = this._model.game?.state.status;
    if (!status) {
      return 'WAITING_TO_START';
    }
    return status;
  }

  /**
   * Returns true if the game is in progress
   */
  public isActive(): boolean {
    return this._model.game?.state.status === 'IN_PROGRESS';
  }

  /**
   * Updates the internal state of this TicTacToeAreaController to match the new model.
   *
   * Calls super._updateFrom, which updates the occupants of this game area and
   * other common properties (including this._model).
   *
   * If the board has changed, emits a 'boardChanged' event with the new board. If the board has not changed,
   *  does not emit the event.
   *
   * If the turn has changed, emits a 'turnChanged' event with true if it is our turn, and false otherwise.
   * If the turn has not changed, does not emit the event.
   */
  protected _updateFrom(newModel: GameArea<ChessGameState>): void {
    const wasOurTurn = this.whoseTurn?.id === this._townController.ourPlayer.id;
    super._updateFrom(newModel);
    const newState = newModel.game;
    if (newState) {
      // normally, the TicTacToe game makes a new board here
      const newBoard: IChessPiece[][] = [];

      // then, it fills it up
      /*
      newState.state.moves.forEach(move => {
        newBoard[move.row][move.col] = move.gamePiece;
      });
      */
      if (!_.isEqual(newBoard, this._board)) {
        this._board = newBoard;
        this.emit('boardChanged', this._board);
      }
    }
    const isOurTurn = this.whoseTurn?.id === this._townController.ourPlayer.id;
    if (wasOurTurn != isOurTurn) this.emit('turnChanged', isOurTurn);
  }

  /**
   * TODO: documentation
   */
  public async makeMove(move: ChessMove) {
    const instanceID = this._instanceID;
    if (!instanceID || this._model.game?.state.status !== 'IN_PROGRESS') {
      throw new Error(NO_GAME_IN_PROGRESS_ERROR);
    }
    await this._townController.sendInteractableCommand(this.id, {
      type: 'GameMove',
      gameID: instanceID,
      move: move,
    });
  }
}