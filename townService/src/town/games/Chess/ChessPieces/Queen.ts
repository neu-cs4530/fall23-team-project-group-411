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

export default class Queen implements IChessPiece {
  color: ChessColor;

  row: ChessBoardPosition;

  col: ChessBoardPosition;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessBoardPosition, col: ChessBoardPosition) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'Q';
  }

  validate_move(
    newRow: ChessBoardPosition,
    newCol: ChessBoardPosition,
    board: ChessCell[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    const rowDiff = Math.abs(newRow - this.row);
    const colDiff = Math.abs(newCol - this.col);

    if (rowDiff === 0 && colDiff === 0) {
      throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
    }
    // Check if the move is vertical, horizontal, or diagonal
    if (
      (rowDiff === colDiff && rowDiff > 0) ||
      (rowDiff === 0 && colDiff > 0) ||
      (rowDiff > 0 && colDiff === 0)
    ) {
      // Check if there are any pieces in the path
      if (!this._isPathClear(newRow, newCol, board)) {
        throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
      }
      // Check if the destination square is empty or has an opponent's piece
      const destinationPiece = board[newRow][newCol];
      if (!(destinationPiece === null || destinationPiece?.color !== this.color)) {
        throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
      }
    } else {
      throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
    }
  }

  private _isPathClear(
    newRow: ChessBoardPosition,
    newCol: ChessBoardPosition,
    board: ChessCell[][],
  ) {
    // eslint-disable-next-line no-nested-ternary
    const rowIncrement = newRow > this.row ? 1 : newRow < this.row ? -1 : 0;
    // eslint-disable-next-line no-nested-ternary
    const colIncrement = newCol > this.col ? 1 : newCol < this.col ? -1 : 0;

    let currentRow = this.row + rowIncrement;
    let currentCol = this.col + colIncrement;

    while (currentRow !== newRow || currentCol !== newCol) {
      if (board[currentRow][currentCol] !== undefined) {
        // There is a piece in the path
        return false;
      }

      currentRow += rowIncrement;
      currentCol += colIncrement;
    }

    // The path is clear
    return true;
  }
}
