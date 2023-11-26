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

export default class Knight implements IChessPiece {
  color: ChessColor;

  row: ChessBoardPosition;

  col: ChessBoardPosition;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessBoardPosition, col: ChessBoardPosition) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'N';
  }

  validate_move(
    newRow: ChessBoardPosition,
    newCol: ChessBoardPosition,
    board: ChessCell[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    /* Move legality checklist:
     * The knight can only move to 8 squares at any given time. Each of them have a set pattern,
     * which is an L shape. We will just check if it satisfies any of the L shape patterns explicitly.
     *
     * Note that this function will throw an error if the move is invalid, and will do nothing
     * if the move is valid.
     */

    // We are dealing with a "column L"
    if (
      Math.abs(newCol - this.col) === 2 &&
      Math.abs(newRow - this.row) === 1 &&
      (board[newRow][newCol] === undefined || board[newRow][newCol]?.color !== this.color)
    ) {
      return;
    }

    // We are dealing with a "row L"
    if (
      Math.abs(newRow - this.row) === 2 &&
      Math.abs(newCol - this.col) === 1 &&
      (board[newRow][newCol] === undefined || board[newRow][newCol]?.color !== this.color)
    ) {
      return;
    }
    throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
  }
}
