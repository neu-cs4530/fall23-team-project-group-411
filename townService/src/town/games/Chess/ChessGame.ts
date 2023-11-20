import InvalidParametersError, {
  GAME_FULL_MESSAGE,
  GAME_NOT_IN_PROGRESS_MESSAGE,
  MOVE_NOT_YOUR_TURN_MESSAGE,
  PLAYER_ALREADY_IN_GAME_MESSAGE,
  PLAYER_NOT_IN_GAME_MESSAGE,
} from '../../../lib/InvalidParametersError';
import Player from '../../../lib/Player';
<<<<<<< Updated upstream
import { GameMove, ChessGameState, ChessMove, IChessPiece } from '../../../types/CoveyTownSocket';
import Game from '../Game';

import Pawn from '../Chess/ChessPieces/Pawn'
import King from '../Chess/ChessPieces/King'
import Queen from '../Chess/ChessPieces/Queen'
=======
import { GameMove, ChessGameState, ChessMove, ChessCell, ChessBoardPosition, IChessPiece, ChessPiece, ChessPiecePosition } from '../../../types/CoveyTownSocket';
import Game from '../Game';
import Pawn from './ChessPieces/Pawn';
import King from './ChessPieces/King';
import Queen from './ChessPieces/Queen';
import Rook from './ChessPieces/Rook';
import Bishop from './ChessPieces/Bishop';
import Knight from './ChessPieces/Knight';

>>>>>>> Stashed changes
/**
 * A ChessGame is a Game that implements the rules of chess.
 * @see https://en.wikipedia.org/wiki/Rules_of_chess
 */
export default class ChessGame extends Game<ChessGameState, ChessMove> {
<<<<<<< Updated upstream
=======
  private board: ChessCell[][];
  private pieces: ChessPiecePosition[];
>>>>>>> Stashed changes

  public constructor() {
    super({
      pieces: [],
      moves: [],
      status: 'WAITING_TO_START',
      board: ChessGame.createNewBoard(),
    });
    
<<<<<<< Updated upstream
  }

<<<<<<< Updated upstream

  private get _board() {
    const { moves } = this.state;
    const board =  [
      [undefined,undefined,undefined,new Queen("W",0,3),new King("W",0,4),undefined,undefined,undefined],
        [new Pawn("W",1,0),new Pawn("W",1,1),new Pawn("W",2,3),new Pawn("W",1,3),new Pawn("W",1,4),new Pawn("W",1,5),new Pawn("W",1,6),new Pawn("W",1,7)],
        [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
        [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
        [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
        [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
        [new Pawn("B",6,0),new Pawn("B",6,1),new Pawn("B",6,2),new Pawn("B",6,3),new Pawn("B",6,4),new Pawn("B",6,5),new Pawn("B",6,6),new Pawn("B",6,7)],
        [undefined,undefined,undefined,new Queen("B",7,3),new King("B",7,4),undefined,undefined,undefined],
      ];
    for (const move of moves) {
      const gp = move.gamePiece;
        if (gp != undefined) {
          board[gp?.row][gp?.col] = undefined;
          board[move.newRow][move.newCol] = gp;
        }
    }
    return board;
=======
    this.board = ChessGame.createNewBoard();
    this.pieces = ChessGame.boardToPieceList(this.board);
>>>>>>> Stashed changes
  }

=======
>>>>>>> Stashed changes
  private _checkForGameEnding() {
    let wk = 0;
    let bk = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
<<<<<<< Updated upstream
        if (super.state.board[row][col]?.type === 'K') {
          if (super.state.board[row][col]?.color === 'W') {
            wk += 1;
          }
          if (super.state.board[row][col]?.color === 'B') {
=======
        if (this.board[row][col]?.type === 'K') {
          if (this.board[row][col]?.color === 'W') {
            wk += 1;
          }
          if (this.board[row][col]?.color === 'B') {
>>>>>>> Stashed changes
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
      const index = this.pieces.findIndex((piece) => {
        return piece.piece.type === moveLocationPiece.type &&
          piece.piece.color === moveLocationPiece.color &&
          piece.rank === moveLocationPiece.row &&
          piece.file === moveLocationPiece.col; 
      });

      if (index !== -1) {
        this.pieces.splice(index, 1);
      }
    }

    const movePiece = this.board[move.gamePiece.rank][move.gamePiece.file];
    if (movePiece) {
      const index = this.pieces.findIndex((piece) => {
        return piece.piece.type === movePiece.type &&
          piece.piece.color === movePiece.color &&
          piece.rank === movePiece.row &&
          piece.file === movePiece.col; 
      });

      if (index !== -1) {
        this.pieces[index] = {
          piece: { type: movePiece.type, color: movePiece.color, },
          file: movePiece.col,
          rank: movePiece.row,
        };
      }
    }
    
    this.state = {
      ...this.state,
      pieces: this.pieces,
      moves: [...this.state.moves, move],
    };
    this._checkForGameEnding();
  }

<<<<<<< Updated upstream
  private _validateMove(move: ChessMove) {
=======
  /**
   * General move validation for a ChessMove. These checks apply
   * universally to every move that is made, regardless of piece type.
   * 
   * Things that are checked:
   * - Turn order
   * - Game progress
   * - Cannot take your own pieces
   */
  private _genericValidateMove(move: ChessMove) {
>>>>>>> Stashed changes
    // A move is only valid if it is the player's turn
    if (move.gamePiece.piece.color === 'W' && 
      this.state.moves.length % 2 === 1) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    } else if (move.gamePiece.piece.color === 'W' && 
      this.state.moves.length % 2 === 0) {
      throw new InvalidParametersError(MOVE_NOT_YOUR_TURN_MESSAGE);
    }
    // A move is valid only if game is in progress
    if (this.state.status !== 'IN_PROGRESS') {
      throw new InvalidParametersError(GAME_NOT_IN_PROGRESS_MESSAGE);
    }
<<<<<<< Updated upstream
    const ourColor = move.gamePiece?.color;
<<<<<<< Updated upstream
    const ourBoard = this._board;
=======

>>>>>>> Stashed changes
    // First Check if our dest space is
    if (super.state.board[move.newRow][move.newCol]?.color === ourColor) {
=======

    const ourColor = move.gamePiece.piece.color;

    // First Check if our dest space is clear, or not occupied by a friendly piece
    if (this.board[move.toRow][move.toCol]?.color === ourColor) {
>>>>>>> Stashed changes
      throw new InvalidParametersError(
        'INVALID MOVE: CANNOT TAKE YOUR OWN PIECE (ChessGame.ts - _validateMove)',
      );
    }
  }

  /*
   * TODO:
   */
  public applyMove(move: GameMove<ChessMove>): void {
<<<<<<< Updated upstream
    this._validateMove(move.move);
    move.move.gamePiece?.validate_move(
      move.move.newRow,
      move.move.newCol,
<<<<<<< Updated upstream
      this._board, 
=======
      super.state.board,
>>>>>>> Stashed changes
=======
    const movePiece = this.board[move.move.gamePiece.rank][move.move.gamePiece.rank];

    if (!movePiece) {
      throw new InvalidParametersError('start location contains no piece to move!');
    }

    this._genericValidateMove(move.move);

    movePiece.validate_move(
      move.move.toRow,
      move.move.toCol,
      this.board,
>>>>>>> Stashed changes
      this.state.moves,
    );
    this._applyMove(move.move);
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
        board: super.state.board,
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
<<<<<<< Updated upstream
=======

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
    newBoard[0][0] = new Bishop('W', 0, 2);
    newBoard[0][0] = new Bishop('W', 0, 5);
    newBoard[0][0] = new Bishop('B', 7, 2);
    newBoard[0][0] = new Bishop('B', 7, 5);

    // Add in Queens:
    newBoard[0][3] = new Queen('W', 0, 3);
    newBoard[7][3] = new Queen('B', 7, 3);

    // Add in Kings:
    newBoard[0][3] = new King('W', 0, 4);
    newBoard[7][3] = new King('B', 7, 4);

    return newBoard as ChessCell[][];
  }

  /**
   * Converts a ChessBoard into ChessPiecePosition[], where the list holds all
   * the remaining pieces on the board.
   */
    static boardToPieceList(board: ChessCell[][]): ChessPiecePosition[] {
      return board.flat()
        .filter(item => item !== undefined)
        .map(chessPiece => {
          return {
            piece: { type: chessPiece?.type, color: chessPiece?.color, },
            file: chessPiece?.col,
            rank: chessPiece?.row,
          } as ChessPiecePosition;
        });
    }
>>>>>>> Stashed changes
}
