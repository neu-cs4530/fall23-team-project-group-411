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

export default class Rook implements IChessPiece {
  color: ChessColor;

  row: ChessBoardPosition;

  col: ChessBoardPosition;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessBoardPosition, col: ChessBoardPosition) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'R';
  }

  validate_move(
    newRow: ChessBoardPosition,
    newCol: ChessBoardPosition,
    board: ChessCell[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    const rowDiff = Math.abs(newRow - this.row);
    const colDiff = Math.abs(newCol - this.col);

    // check if the move is horizontal or vertical
    if ((rowDiff === 0 && colDiff > 0) || (rowDiff > 0 && colDiff === 0)) {
      // check if there are any pieces in the path
      if (!this._isPathClear(newRow, newCol, board)) {
        throw new InvalidParametersError('Failed path check in Rook');
      }

      // check if the destination square is empty or has an opponent's piece
      const destinationPiece = board[newRow][newCol];
      if (!(destinationPiece === null || destinationPiece?.color !== this.color)) {
        throw new InvalidParametersError('Failed dest check in Rook');
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
    let rowIncrement;
    let colIncrement;

    if (newRow > this.row) {
      rowIncrement = 1;
    } else if (newRow < this.row) {
      rowIncrement = -1;
    } else {
      rowIncrement = 0;
    }

    if (newCol > this.col) {
      colIncrement = 1;
    } else if (newCol < this.col) {
      colIncrement = -1;
    } else {
      colIncrement = 0;
    }

    let currentRow = this.row + rowIncrement;
    let currentCol = this.col + colIncrement;

    while (currentRow !== newRow || currentCol !== newCol) {
      if (board[currentRow][currentCol] !== undefined) {
        return false;
      }

      currentRow += rowIncrement;
      currentCol += colIncrement;
    }

    return true;
  }
}
