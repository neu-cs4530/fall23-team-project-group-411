
import {
  ChessCell,
  ChessColor,
  ChessMove,
  ChessSquare,
  IChessPiece,
} from '../../../types/CoveyTownSocket';


export default class Rook implements IChessPiece {
  color: ChessColor;

  row: ChessSquare;

  col: ChessSquare;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

  constructor(color: ChessColor, row: ChessSquare, col: ChessSquare) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'R';
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
