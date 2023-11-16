import InvalidParametersError, {
  INVALID_MOVE_MESSAGE,
} from '../../../../lib/InvalidParametersError';
import {
  ChessCell,
  ChessColor,
  ChessMove,
  ChessSquare,
  IChessPiece,
} from '../../../../types/CoveyTownSocket';

export default class Bishop implements IChessPiece {
  color: ChessColor;

  row: ChessSquare;

  col: ChessSquare;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessSquare, col: ChessSquare) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'B';
  }

  
  validate_move(
    newRow: ChessSquare,
    newCol: ChessSquare,
    board: ChessCell[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    const rowDiff = Math.abs(newRow - this.row);
    const colDiff = Math.abs(newCol - this.col);

    // check if the move is diagonal
    if (rowDiff === colDiff && rowDiff > 0) {
      // check if there are any pieces in the path
      if (!this._isPathClear(newRow, newCol, board)) {
        throw new InvalidParametersError('Failed path check in Bishop');
      }

      // check if the destination square is empty or has an opponent's piece
      const destinationPiece = board[newRow][newCol];
      if (!(destinationPiece === null || destinationPiece?.color !== this.color)) {
        throw new InvalidParametersError('Failed dest check in Bishop');
      }
    } else {
      throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
    }
  }

  private _isPathClear(newRow: ChessSquare, newCol: ChessSquare, board: ChessCell[][]) {
    const rowIncrement = newRow > this.row ? 1 : -1;
    const colIncrement = newCol > this.col ? 1 : -1;

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


