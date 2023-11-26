import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../../lib/InvalidParametersError';
import Player from '../../../lib/Player';
import {
  GameMove,
  ChessGameState,
  ChessMove,
  ChessCell,
  ChessBoardPosition,
  ChessPiecePosition,
} from '../../../types/CoveyTownSocket';

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
  board: ChessCell[][] = ChessGame.createNewBoard();

  public constructor() {
    super({
      pieces: [],
      moves: [],
      status: 'WAITING_TO_START',
    });
    this.state.pieces = ChessGame.boardToPieceList(this.board);
  }

  private _checkForGameEnding() {
    let wk = 0;
    let bk = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row][col]?.type === 'K') {
          if (this.board[row][col]?.color === 'W') {
            wk += 1;
          }
          if (this.board[row][col]?.color === 'B') {
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
    const moveLocationPiece = this.board[move.toRow][move.toCol];
    // if there is a piece at the resulting space, remove it
    if (moveLocationPiece) {
      const index = this.state.pieces.findIndex(
        piece =>
          piece.piece.type === moveLocationPiece.type &&
          piece.piece.color === moveLocationPiece.color &&
          piece.row === moveLocationPiece.row &&
          piece.col === moveLocationPiece.col,
      );
      if (index !== -1) {
        this.state.pieces.splice(index, 1);
      }
    }

    // find the piece we are trying to move
    const movePiece = this.board[move.gamePiece.row][move.gamePiece.col];
    if (movePiece) {
      const index = this.state.pieces.findIndex(
        piece =>
          piece.piece.type === movePiece.type &&
          piece.piece.color === movePiece.color &&
          piece.row === movePiece.row &&
          piece.col === movePiece.col,``
      );
      // when we find the piece we are trying to move, we change it in the list of pieces
      if (index !== -1) {
        this.state.pieces[index] = {
          piece: { type: movePiece.type, color: movePiece.color },
          col: movePiece.col,
          row: movePiece.row,
        };
      }
    }

    // update the state to match
    this.state = {
      ...this.state,
      moves: [...this.state.moves, move],
    };

    // check to see if the game is in an end state
    console.log(`Pieces: ${this.state.pieces}`);
    console.log(`Moves: ${this.state.moves}`)
    this._checkForGameEnding();
  }

  /**
   * General move validation for a ChessMove. These checks apply
   * universally to every move that is made, regardless of piece type.
   * Things that are checked:
   * - Turn order
   * - Game progress
   * - Cannot take your own pieces
   */
  private _genericValidateMove(move: ChessMove) {
    // A move is only valid if it is the player's turn
    // A move is only valid if it is the player's turn
    if (move.gamePiece.piece.color === 'W' && this.state.moves.length % 2 === 1) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    } else if (move.gamePiece.piece.color === 'B' && this.state.moves.length % 2 === 0) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    }

    // A move is valid only if game is in progress
    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    }
    const ourColor = move.gamePiece.piece.color;

    // First Check if our dest space is clear, or not occupied by a friendly piece
    if (this.board[move.toRow][move.toCol]?.color === ourColor) {
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
    
    const movePiece = this.board[move.move.gamePiece.row][move.move.gamePiece.row];

    if (!movePiece) {
      throw new InvalidParametersError('start location contains no piece to move!');
    }
    let color: 'W' | 'B';
    if (move.playerID === this.state.black) {
      color = 'B';
    } else {
      color = 'W';
    }
    const piece = new Pawn(color, move.move.gamePiece.row, move.move.gamePiece.col);
    const cleanMove: ChessMove = {
      gamePiece: {
        piece,
        row: move.move.gamePiece.row,
        col: move.move.gamePiece.col,
      },
      toRow: move.move.toRow,
      toCol: move.move.toCol,
    };
    this._genericValidateMove(cleanMove);
    piece.validate_move(cleanMove.toRow, cleanMove.toCol, this.board, this.state.moves);
    this._applyMove(cleanMove);
    
    // add in logic for moving the physical piece in the board.
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
        pieces: [],
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
   * A quirk behind this implementation is that we will consider row 0 column 0 to be the
   * BOTTOM LEFT CORNER of the board, or the A1 square on a real chessboard.
   * We are also assuming the board is instantiated as [row][col]
   * @returns
   */
  static createNewBoard(): ChessCell[][] {
    // fill the board with undefined cells
    const newBoard = Array.from({ length: 8 }).map(() => Array.from({ length: 8 }).fill(undefined));

    // instantiate the pawns
    for (let col = 0; col < 8; col++) {
      newBoard[1][col] = new Pawn('W', 1, col as ChessBoardPosition);
      newBoard[6][col] = new Pawn('B', 6, col as ChessBoardPosition);
    }

    // Add in the Rooks:
    newBoard[0][0] = new Rook('W', 0, 0);
    newBoard[0][7] = new Rook('W', 0, 7);
    newBoard[7][0] = new Rook('B', 7, 0);
    newBoard[7][7] = new Rook('B', 7, 7);

    // Add in the Knights:
    newBoard[0][1] = new Knight('W', 0, 1);
    newBoard[0][6] = new Knight('W', 0, 6);
    newBoard[7][1] = new Knight('B', 7, 1);
    newBoard[7][6] = new Knight('B', 7, 6);

    // Add in the Bishops:
    newBoard[0][2] = new Bishop('W', 0, 2);
    newBoard[0][5] = new Bishop('W', 0, 5);
    newBoard[7][2] = new Bishop('B', 7, 2);
    newBoard[7][5] = new Bishop('B', 7, 5);

    // Add in Queens:
    newBoard[0][3] = new Queen('W', 0, 3);
    newBoard[7][3] = new Queen('B', 7, 3);

    // Add in Kings:
    newBoard[0][4] = new King('W', 0, 4);
    newBoard[7][4] = new King('B', 7, 4);

    return newBoard as ChessCell[][];
  }

  /**
   * Converts a ChessBoard into ChessPiecePosition[], where the list holds all
   * the remaining pieces on the board.
   */
  static boardToPieceList(board: ChessCell[][]): ChessPiecePosition[] {
    return board
      .flat()
      .filter(item => item !== undefined)
      .map(
        chessPiece =>
          ({
            piece: { type: chessPiece?.type, color: chessPiece?.color },
            col: chessPiece?.col,
            row: chessPiece?.row,
          } as ChessPiecePosition),
      );
  }
}
