import InvalidParametersError from '../../../../lib/InvalidParametersError';
import { ChessColor, ChessMove, ChessSquare, IChessPiece } from '../../../../types/CoveyTownSocket';

export default class Queen implements IChessPiece {
  color: ChessColor;

  row: ChessSquare;

  col: ChessSquare;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessSquare, col: ChessSquare) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'Q';
  }

  validate_move(
    newRow: ChessSquare,
    newCol: ChessSquare,
    board: IChessPiece[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    const rowDiff = Math.abs(newRow - this.row);
    const colDiff = Math.abs(newCol - this.col);

    // Check if the move is vertical, horizontal, or diagonal
    if (
      (rowDiff === colDiff && rowDiff > 0) ||
      (rowDiff === 0 && colDiff > 0) ||
      (rowDiff > 0 && colDiff === 0)
    ) {
      // Check if there are any pieces in the path
      if (!this._isPathClear(newRow, newCol, board)) {
        throw new InvalidParametersError('Failed path check in Queen');
      }

      // Check if the destination square is empty or has an opponent's piece
      const destinationPiece = board[newRow][newCol];
      if (!(destinationPiece === null || destinationPiece.color !== this.color)) {
        throw new InvalidParametersError('Failed dest check in Queen');
      }
    }

    return false;
  }

  private _isPathClear(newRow: ChessSquare, newCol: ChessSquare, board: IChessPiece[][]) {
    // eslint-disable-next-line no-nested-ternary
    const rowIncrement = newRow > this.row ? 1 : newRow < this.row ? -1 : 0;
    // eslint-disable-next-line no-nested-ternary
    const colIncrement = newCol > this.col ? 1 : newCol < this.col ? -1 : 0;

    let currentRow = this.row + rowIncrement;
    let currentCol = this.col + colIncrement;

    while (currentRow !== newRow || currentCol !== newCol) {
      if (board[currentRow][currentCol] !== null) {
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
