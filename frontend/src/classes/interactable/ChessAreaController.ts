import _ from 'lodash';
import {
  GameArea,
  GameStatus,
  ChessGameState,
  ChessMove,
  ChessBoardSquare,
  ChessColor,
  ChessPiece,
} from '../../types/CoveyTownSocket';
import PlayerController from '../PlayerController';
import GameAreaController, { GameEventTypes } from './GameAreaController';

export const PLAYER_NOT_IN_GAME_ERROR = 'Player is not in game';
export const NO_GAME_IN_PROGRESS_ERROR = 'No game in progress';

type ChessEvents = GameEventTypes & {
  boardChanged: (board: ChessBoardSquare[][]) => void;
  turnChanged: (isOurTurn: boolean) => void;
};

/**
 * This class is responsible for managing the state of the Chess game, and for sending commands to the server
 */
export default class ChessAreaController extends GameAreaController<ChessGameState, ChessEvents> {
  protected _board: ChessBoardSquare[][] = this._createNewBoard();

  /**
   * Returns the current chessboard.
   */
  get board(): ChessBoardSquare[][] {
    return this._board;
  }

  /**
   * Returns the number of moves that have occurred in this game.
   */
  get moveCount(): number {
    return this._model.game?.state.moves.length || 0;
  }

  /**
   * Returns the player with the white pieces, if there is one, or undefined otherwise
   */
  get white(): PlayerController | undefined {
    const w = this._model.game?.state.white;
    if (w) {
      return this.occupants.find(eachOccupant => eachOccupant.id === w);
    }
    return undefined;
  }

  /**
   * Returns the player with the black pieces, if there is one, or undefined otherwise
   * Returns the player with the black pieces, if there is one, or undefined otherwise.
   */
  get black(): PlayerController | undefined {
    const b = this._model.game?.state.black;
    if (b) {
      return this.occupants.find(eachOccupant => eachOccupant.id === b);
    }
    return undefined;
  }

  /**
   * Returns the winner of the game, if there is one
   * Returns the winner of the game, if there is one.
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

  /**
   * Docs
   */
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
   * Returns the game color of the current player, if the current player is a player in this game
   *
   * Throws an error PLAYER_NOT_IN_GAME_ERROR if the current player is not a player in this game
   */
  get gameColor(): ChessColor {
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
    console.log(`newState: ${newModel.game}`)
    console.log(`move list: ${newState?.state.pieces}`);
    if (newState) {
      const newBoard = Array.from({ length: 8 }).map(() => Array.from({ length: 8 }).fill(undefined));
      newState.state.pieces.forEach(piece => {
        console.log(`Filling up slot ${piece.row}.${piece.col} with ${piece.piece.type}`);
        newBoard[piece.row][piece.col] = piece.piece;
      });
      if (!_.isEqual(newBoard, this._board)) {
        this._board = newBoard as unknown as ChessBoardSquare[][];
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

  /**
   * This function will create a brand new chessboard, with all the pieces properly placed
   * to start a new game.
   */
  private _createNewBoard(): ChessBoardSquare[][] {
    // fill the board with undefined cells
    const newBoard = Array.from({ length: 8 }).map(() => Array.from({ length: 8 }).fill(undefined));

    // instantiate the pawns
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = {type: 'P', color: 'W'} as ChessPiece;
      newBoard[6][col] = {type: 'P', color: 'B'} as ChessPiece;;
    }

    // Add in the Rooks:
    newBoard[0][0] = {type: 'R', color: 'W'} as ChessPiece;
    newBoard[0][7] = {type: 'R', color: 'W'} as ChessPiece;
    newBoard[7][0] = {type: 'R', color: 'B'} as ChessPiece;
    newBoard[7][7] = {type: 'R', color: 'B'} as ChessPiece;

    // Add in the Knights:
    newBoard[0][1] = {type: 'N', color: 'W'} as ChessPiece;
    newBoard[0][6] = {type: 'N', color: 'W'} as ChessPiece;
    newBoard[7][1] = {type: 'N', color: 'B'} as ChessPiece;
    newBoard[7][6] = {type: 'N', color: 'B'} as ChessPiece;

    // Add in the Bishops:
    newBoard[0][2] = {type: 'B', color: 'W'} as ChessPiece;
    newBoard[0][5] = {type: 'B', color: 'W'} as ChessPiece;
    newBoard[7][2] = {type: 'B', color: 'B'} as ChessPiece;
    newBoard[7][5] = {type: 'B', color: 'B'} as ChessPiece;

    // Add in Queens:
    newBoard[0][4] = {type: 'Q', color: 'W'} as ChessPiece;
    newBoard[7][4] = {type: 'Q', color: 'B'} as ChessPiece;

    // Add in Kings:
    newBoard[0][3] = {type: 'K', color: 'W'} as ChessPiece;
    newBoard[7][3] = {type: 'K', color: 'B'} as ChessPiece;

    return newBoard as ChessBoardSquare[][];
  }
}
