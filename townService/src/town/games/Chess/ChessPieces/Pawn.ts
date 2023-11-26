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

export default class Pawn implements IChessPiece {
  color: ChessColor;

  row: ChessBoardPosition;

  col: ChessBoardPosition;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessBoardPosition, col: ChessBoardPosition) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'P';
  }

  validate_move(
    newRow: ChessBoardPosition,
    newCol: ChessBoardPosition,
    board: ChessCell[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    if (this.type === 'P') {
      if (this.color === 'W') {
        // first move can move two up directionly up if there isn't a piece there
        if (
          this.row === 1 &&
          newRow === 3 &&
          this.col === newCol &&
          board[newRow][newCol] === undefined &&
          board[newRow - 1][newCol] === undefined
        ) {
          return;
        }
        // otherwise we can online move upward once
        if (newRow === this.row + 1 && this.col === newCol && board[newRow][newCol] === undefined) {
          return;
        }
        // diagonal capture
        if (
          newRow === this.row + 1 &&
          (newCol === this.col - 1 || newCol === this.col + 1) &&
          board[newRow][newCol]?.color === 'B'
        ) {
          return;
        }
        //  en passaunt
        if (
          newRow === this.row + 1 &&
          newRow === 5 &&
          (newCol === this.col - 1 || newCol === this.col + 1) &&
          board[this.row][newCol]?.type === 'P' &&
          board[this.row][newCol]?.color === 'B'
        ) {
          const i = moves.length - 1;
          if (
            i !== -1 &&
            moves[i].gamePiece.piece.type === 'P' &&
            moves[i].gamePiece.row === this.row + 2 &&
            moves[i].gamePiece.col === newCol &&
            moves[i].toCol === newCol &&
            moves[i].toRow === this.row
          ) {
            return;
          }
        }
        // promotion
      }
      if (this.color === 'B') {
        // first move can move two up directionly up if there isn't a piece there
        if (
          this.row === 6 &&
          newRow === 4 &&
          this.col === newCol &&
          board[newRow][newCol] === undefined &&
          board[newRow + 1][newCol] === undefined
        ) {
          return;
        }
        // otherwise we can online move upward once
        if (newRow === this.row - 1 && this.col === newCol && board[newRow][newCol] === undefined) {
          return;
        }
        // diagonal capture
        if (
          newRow === this.row - 1 &&
          (newCol === this.col - 1 || newCol === this.col + 1) &&
          board[newRow][newCol]?.color === 'W'
        ) {
          return;
        }
        //  en passaunt
        if (
          newRow === this.row - 1 &&
          newRow === 2 &&
          (newCol === this.col - 1 || newCol === this.col + 1) &&
          board[this.row][newCol]?.type === 'P' &&
          board[this.row][newCol]?.color === 'W'
        ) {
          const i = moves.length - 1;
          if (
            i !== -1 &&
            moves[i].gamePiece.piece.type === 'P' &&
            moves[i].gamePiece.row === this.row - 2 &&
            moves[i].gamePiece.col === newCol &&
            moves[i].toCol === newCol &&
            moves[i].toRow === this.row
          ) {
            return;
          }
        }
        // promotion
      }
    }
    throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
  }
}
