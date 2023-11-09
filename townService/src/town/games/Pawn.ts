import InvalidParametersError, { INVALID_MOVE_MESSAGE } from '../../lib/InvalidParametersError';
import { ChessColor, ChessMove, ChessSquare, IChessPiece } from '../../types/CoveyTownSocket';
import ChessCell from '../../../../frontend/src/classes/interactable/ChessAreaController'


export default class Pawn implements IChessPiece {
  color: ChessColor;

  row: ChessSquare;

  col: ChessSquare;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'None';

  constructor(color: ChessColor, row: ChessSquare, col: ChessSquare) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'P';
  }

  validate_move(
    newRow: ChessSquare,
    newCol: ChessSquare,
    board: ChessCell[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    if (this.color === 'W') {
      // pawn must move one row up at a time (unless its first move)
      if (newRow !== this.row + 1) {
        throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
      }
      // standard upward movement
      if (newCol === this.col) {
        if (board[newRow][newCol] !== undefined) {
          throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
        }
        // diagonal capture
      } else if (newCol === this.col - 1 || newCol === this.col + 1) {
        if (board[newRow][newCol] === undefined) {
          throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
        }
        // en passaunt
      }
      // promotion
    }
  }
}
