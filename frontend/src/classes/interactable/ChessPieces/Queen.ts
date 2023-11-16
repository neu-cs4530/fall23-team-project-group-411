
import {
  ChessCell,
  ChessColor,
  ChessMove,
  ChessSquare,
  IChessPiece,
} from '../../../types/CoveyTownSocket';


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
    return;
  }
}
