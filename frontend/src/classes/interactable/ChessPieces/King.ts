
import {
  ChessCell,
  ChessColor,
  ChessMove,
  ChessSquare,
  IChessPiece,
} from '../../../types/CoveyTownSocket';


export default class King implements IChessPiece {
  color: ChessColor;

  row: ChessSquare;

  col: ChessSquare;

  canCastleShort: boolean;

  canCastleLong: boolean;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessSquare, col: ChessSquare) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'K';
    this.canCastleShort = true;
    this.canCastleLong = false;
  }

  validate_move(
    newRow: ChessSquare,
    newCol: ChessSquare,
    board: ChessCell[][],
    moves: ReadonlyArray<ChessMove>,
  ) {
    return;
  }
}
