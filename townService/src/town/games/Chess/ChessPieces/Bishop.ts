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

export default class King implements IChessPiece {
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
  }
}
