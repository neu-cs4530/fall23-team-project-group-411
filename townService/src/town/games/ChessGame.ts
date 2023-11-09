import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../lib/InvalidParametersError';
import Player from '../../lib/Player';
import { GameMove, ChessGameState, ChessMove, IChessPiece } from '../../types/CoveyTownSocket';
import Game from './Game';

/**
 * A ChessGame is a Game that implements the rules of chess.
 * @see https://en.wikipedia.org/wiki/Rules_of_chess
 */

export default class ChessGame extends Game<ChessGameState, ChessMove> {

  public constructor() {
    super({
      moves: [],
      status: 'WAITING_TO_START',
    });
  }


  private get _board() {
    return [[]];
  }

  private _checkForGameEnding() {
    // let wk = 0;
    // let bk = 0;
    // for (let row = 0; row < 8; row++) {
    //   for (let col = 0; col < 8; col++) {
    //     if (this._chessBoard[row][col].type === 'K') {
    //       if (this._chessBoard[row][col].color === 'W') {
    //         wk += 1;
    //       }
    //       if (this._chessBoard[row][col].color === 'B') {
    //         bk += 1;
    //       }
    //     }
    //   }
    // }
    // if (bk === 0) {
    //   this.state = {
    //     ...this.state,
    //     status: 'OVER',
    //     winner: this.state.white,
    //   };
    // } else if (wk === 0) {
    //   this.state = {
    //     ...this.state,
    //     status: 'OVER',
    //     winner: this.state.black,
    //   };
    // }
  }

  private _applyMove(move: ChessMove): void {
    this.state = {
      ...this.state,
      moves: [...this.state.moves, move],
    };
    this._checkForGameEnding();
  }

  
  private _validateMove(move: ChessMove) {
    // A move is only valid if it is the player's turn
    if (move.gamePiece?.color === 'W' && this.state.moves.length % 2 === 1) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    } else if (move.gamePiece?.color  === 'B' && this.state.moves.length % 2 === 0) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    }
    // A move is valid only if game is in progress
    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    }
  }

  /*
   * TODO:
   */
  public applyMove(move: GameMove<ChessMove>): void {
    this._validateMove(move.move);
    move.move.gamePiece?.validate_move(
      move.move.newRow,
      move.move.newCol,
      this._board,
      this.state.moves,
    );
    this._applyMove(move.move);
  }

  /**
   * Adds a player to the game.
   * Updates the game's state to reflect the new player.
   * If the game is now full (has two players), updates the game's state to set the status to IN_PROGRESS.
   *
   * @param player The player to join the game
   * @throws InvalidParametersError if the player is already in the game (PLAYER_ALREADY_IN_GAME_MESSAGE)
   *  or the game is full (GAME_FULL_MESSAGE)
   */
  protected _join(player: Player): void {
    if (this.state.white === player.id || this.state.black === player.id) {
      throw new InvalidParametersError(PLAYER_ALREADY_IN_GAME_MESSAGE);
    }
    if (!this.state.white) {
      this.state = {
        ...this.state,
        white: player.id,
      };
    } else if (!this.state.black) {
      this.state = {
        ...this.state,
        black: player.id,
      };
    } else {
      throw new InvalidParametersError(GAME_FULL_MESSAGE);
    }
    if (this.state.white && this.state.black) {
      this.state = {
        ...this.state,
        status: 'IN_PROGRESS',
      };
    }
  }

  /**
   * Removes a player from the game.
   * Updates the game's state to reflect the player leaving.
   * If the game has two players in it at the time of call to this method,
   *   updates the game's status to OVER and sets the winner to the other player.
   * If the game does not yet have two players in it at the time of call to this method,
   *   updates the game's status to WAITING_TO_START.
   *
   * @param player The player to remove from the game
   * @throws InvalidParametersError if the player is not in the game (PLAYER_NOT_IN_GAME_MESSAGE)
   */
  protected _leave(player: Player): void {
    if (this.state.white !== player.id && this.state.black !== player.id) {
      throw new InvalidParametersError(PLAYER_NOT_IN_GAME_MESSAGE);
    }
    // Handles case where the game has not started yet
    if (this.state.black === undefined) {
      this.state = {
        moves: [],
        status: 'WAITING_TO_START',
      };
      return;
    }
    if (this.state.white === player.id) {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: this.state.black,
      };
    } else {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: this.state.white,
      };
    }
  }
}
