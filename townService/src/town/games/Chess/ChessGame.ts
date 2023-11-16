import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../../lib/InvalidParametersError';
import Player from '../../../lib/Player';
import { GameMove, ChessGameState, ChessMove, ChessCell, ChessSquare } from '../../../types/CoveyTownSocket';
import Game from '../Game';
import Pawn from './ChessPieces/Pawn';
import King from './ChessPieces/King';
import Queen from './ChessPieces/Queen';
import Rook from './ChessPieces/Rook';
import Bishop from './ChessPieces/Bishop';
import Knight from './ChessPieces/Knight';
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
    const { moves } = this.state;
    const board = [
      [new Rook("W", 0, 0), new Knight("W",0,1), new Bishop("W",0,2), new Queen("W", 0, 3), new King("W", 0, 4), new Bishop("W",0,5), new Knight("W",0,6), new Rook("W", 7, 0)],
      [new Pawn("W",1,0),new Pawn("W",1,1),new Pawn("W",2,3),new Pawn("W",1,3),new Pawn("W",1,4),new Pawn("W",1,5),new Pawn("W",1,6),new Pawn("W",1,7)],
      [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
      [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
      [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
      [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
      [new Pawn("B",6,0),new Pawn("B",6,1),new Pawn("B",6,2),new Pawn("B",6,3),new Pawn("B",6,4),new Pawn("B",6,5),new Pawn("B",6,6),new Pawn("B",6,7)],
      [new Rook("B", 7, 0),new Knight("B",7,1),new Bishop("B",7,2),new Queen("B",7,3),new King("B",7,4),new Bishop("B",7,5),new Knight("B",7,6),new Rook("B", 7, 7)],
    ];
    /* 
    why don't we just store the board as a field, and then update it each time we make a move?
    and then we can just return the field directly, which would be a big improvement from
    manually applying every single move each render

    for (const move of moves) {
      const gp = move.gamePiece;
      if (gp !== undefined) {
        board[gp?.row][gp?.col] = undefined;
        board[move.newRow][move.newCol] = gp;
      }
    }
    */
    return board;
  }

  private _checkForGameEnding() {
    let wk = 0;
    let bk = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this._board[row][col]?.type === 'K') {
          if (this._board[row][col]?.color === 'W') {
            wk += 1;
          }
          if (this._board[row][col]?.color === 'B') {
            bk += 1;
          }
        }
      }
    }
    if (bk === 0) {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: this.state.white,
      };
    } else if (wk === 0) {
      this.state = {
        ...this.state,
        status: 'OVER',
        winner: this.state.black,
      };
    }
  }

  private _applyMove(move: ChessMove): void {
    this.state = {
      ...this.state,
      moves: [...this.state.moves, move],
    };
    this._checkForGameEnding();
  }

  /**
   * TODO: Documentation
   * Things that are checked:
   * - Turn order
   * - Game progress
   * - Cannot take your own pieces
   *
   * @param move
   */
  private _validateMove(move: ChessMove) {
    // A move is only valid if it is the player's turn
    if (move.gamePiece?.color === 'W' && this.state.moves.length % 2 === 1) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    } else if (move.gamePiece?.color === 'B' && this.state.moves.length % 2 === 0) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    }

    // A move is valid only if game is in progress
    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    }

    const ourColor = move.gamePiece?.color;
    const ourBoard = this._board;

    // First Check if our dest space is
    if (ourBoard[move.newRow][move.newCol]?.color === ourColor) {
      throw new InvalidParametersError(
        'INVALID MOVE: CANNOT TAKE YOUR OWN PIECE (ChessGame.ts - _validateMove)',
      );
    }
  }

  /*
   * TODO: Documentation
   * note: we should change the naming convention here, it might get confusing.
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

  /**
   * This function will create a brand new chessboard, with all the pieces properly placed
   * to start a new game.
   * 
   * A quirk behind this implementation is that we will consider row 0 column 0 to be the
   * BOTTOM LEFT CORNER of the board, or the A1 square on a real chessboard.
   * 
   * We are also assuming the board is instantiated as [row][col]
   * 
   * @returns 
   */
  static createNewBoard(): ChessCell[][] {
    // fill the board with undefined cells
    const newBoard = Array.from({ length: 7 }).map(() => Array.from({ length: 7 }).fill(undefined));
    
    // instantiate the pawns
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = new Pawn('W', 1, col as ChessSquare);
      newBoard[6][col] = new Pawn('B', 6, col as ChessSquare);
    }

    // Add in the Rooks:
    // newBoard[0][0] = new Rook('W', 0, 0);
    // newBoard[0][0] = new Rook('W', 7, 0);
    // newBoard[7][0] = new Rook('B', 0, 7);
    // newBoard[7][0] = new Rook('W', 7, 7);
    
    // Add in the Knights:
    newBoard[0][1] = new Knight('W', 0, 1);
    newBoard[0][6] = new Knight('W', 0, 6);
    newBoard[7][1] = new Knight('B', 7, 1);
    newBoard[7][6] = new Knight('B', 7, 6);

    // Add in the Bishops:
    // newBoard[0][0] = new Bishop('W', 0, 0);
    // newBoard[0][0] = new Bishop('W', 0, 0);
    // newBoard[0][0] = new Bishop('W', 0, 0);
    // newBoard[0][0] = new Bishop('W', 0, 0);

    // Add in Queens:
    newBoard[0][3] = new Queen('W', 0, 3);
    newBoard[7][3] = new Queen('B', 7, 3);

    // Add in Kings:
    newBoard[0][3] = new King('W', 0, 4);
    newBoard[7][3] = new King('B', 7, 4);

    return newBoard as ChessCell[][];
  }

}
