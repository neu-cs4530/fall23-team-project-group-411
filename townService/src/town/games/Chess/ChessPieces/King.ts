import InvalidParametersError, {
  INVALID_MOVE_MESSAGE,
} from '../../../../lib/InvalidParametersError';
import {
  ChessCell,
  ChessColor,
  ChessMove,
  ChessBoardPosition,
  IChessPiece,
} from '../../../../types/CoveyTownSocket';

export default class King implements IChessPiece {
  color: ChessColor;

  row: ChessBoardPosition;

  col: ChessBoardPosition;

  canCastleShort: boolean;

  canCastleLong: boolean;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessBoardPosition, col: ChessBoardPosition) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'K';
    this.canCastleShort = true;
    this.canCastleLong = true;
  }

  validate_move(
    newRow: ChessBoardPosition,
    newCol: ChessBoardPosition,
    board: ChessCell[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    /* Move legality checklist:
     * First, check if the move is a castling move (just get this out of the way)
     * - newCol must be +/- 2 in either direction
     *   - note: short / long castling is the same for both colors
     * - in whichever direction, there can be no blocking pieces, and none of the enemy
     *   pieces should be able to take on a square that the king would have to pass though
     * - the corresponding rook cannot have made any moves
     * - the king can't have made any other moves
     *     - for the latter two points, we will take care of this via the two
     *       boolean flags for if a king can castle or not.
     *
     * If the player is not castling, we check:
     * - Is the move only 1 square away
     * - Is the move to an unoccupied square
     *
     * We don't need to account for checks, since our game win condition is if the king gets
     * captured, not by checkmate.
     *
     * Note that this function will throw an error if the move is invalid, and will do nothing
     * if the move is valid.
     */

    // First, we check for castling moves
    if (Math.abs(newCol - this.col) === 2 && this.row === newRow) {
      if (newCol > this.col) {
        // trying to short castle
        this._shortCastleCheck(board, moves);
        return; // if no error was thrown, then we can make the move!
      }
      // trying to long castle
      this._longCastleCheck(board, moves);
      return; // if no error was thrown, then we can make the move!
    }

    // If we aren't castling, check that the move is to an adjacent square
    if (
      Math.abs(newCol - this.col) > 1 ||
      Math.abs(newRow - this.row) > 1 ||
      board[newRow][newCol]?.color === this.color
    ) {
      throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
    }

    // no matter what, castling must be a king's first move. so, if it isn't...
    this.canCastleShort = false;
    this.canCastleLong = false;
  }

  /**
   * TODO: Documentation
   * Throws an error if the given king cannot short castle
   *
   * @param moves
   */
  private _shortCastleCheck(board: ChessCell[][], moves: ReadonlyArray<ChessMove>) {
    // first, we check if we can even castle to begin with!
    if (!this.canCastleShort) throw new InvalidParametersError(INVALID_MOVE_MESSAGE);

    // next, we check if any pieces are in the way

    // next, we check if any enemy pieces can "see" on the passing squares

    // last, check if the short castle rook has moved
    // if you are the white king: the rook on (7,0) <- using (x,y)
    // if you are the black king: the rook on (7,7) <- using (x,y)
    if (this.color === 'B') {
      // path has to be clear
      if (board[7][5] !== undefined && board[7][6] !== undefined) {
        throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
      }
      moves.forEach(move => {
        const piece = move.gamePiece;
        if (piece.piece.type !== 'R' && piece.piece.color !== this.color) {
          return;
        }

        if (piece.col === 7 && piece.row === 7) {
          // if we find the move, that means the piece has made a valid move
          throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
        }
      });
    } else {
      // path has to be clear
      if (board[0][5] !== undefined && board[0][6] !== undefined) {
        throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
      }
      moves.forEach(move => {
        const piece = move.gamePiece;
        if (piece.piece.type !== 'R' && piece.piece.color !== this.color) {
          return;
        }

        if (piece.col === 7 && piece.row === 0) {
          // if we find the move, that means the piece has made a valid move
          throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
        }
      });
    }
  }

  /**
   * TODO: Documentation
   * Throws an error if the given king cannot long castle
   *
   * @param moves
   */
  private _longCastleCheck(board: ChessCell[][], moves: ReadonlyArray<ChessMove>) {
    // first, we check if we can even castle to begin with!
    if (!this.canCastleLong) throw new InvalidParametersError(INVALID_MOVE_MESSAGE);

    // next, we check if any pieces are in the way

    // next, we check if any enemy pieces can "see" on the passing squares

    // last, check if the long castle rook has moved
    // if you are the white king: the rook on (0,0) <- using (x,y)
    // if you are the black king: the rook on (7,0) <- using (x,y)
    if (this.color === 'B') {
      // path has to be clear
      if (board[7][3] !== undefined && board[7][2] !== undefined && board[7][1] !== undefined) {
        throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
      }
      moves.forEach(move => {
        const piece = move.gamePiece;
        if (piece.piece.type !== 'R' && piece.piece.color !== this.color) {
          return;
        }

        if (piece.row === 0 && piece.col === 7) {
          // if we find the move, that means the piece has made a valid move
          throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
        }
      });
    } else {
      // path has to be clear
      if (board[0][3] !== undefined && board[0][2] !== undefined && board[0][1] !== undefined) {
        throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
      }
      moves.forEach(move => {
        const piece = move.gamePiece;
        if (piece.piece.type !== 'R' && piece.piece.color !== this.color) {
          return;
        }

        if (piece.row === 0 && piece.col === 0) {
          // if we find the move, that means the piece has made a valid move
          throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
        }
      });
    }
  }
}
