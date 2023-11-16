import { move } from 'ramda';
import InvalidParametersError, { INVALID_MOVE_MESSAGE } from '../../../../lib/InvalidParametersError';
import { ChessCell, ChessColor, ChessMove, ChessSquare, IChessPiece } from '../../../../types/CoveyTownSocket';

export default class Pawn implements IChessPiece {
  color: ChessColor;

  row: ChessSquare;

  col: ChessSquare;

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';

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
    if (this.type === 'P'){
      if (this.color === 'W') {
        // first move can move two up directionly up if there isn't a piece there
        if (this.row == 1 && newRow == 3 && this.col == newCol && board[newRow][newCol] === undefined) {
          return;
        } 
        // otherwise we can online move upward once
        if (newRow === this.row + 1 && this.col == newCol && board[newRow][newCol] === undefined) {
          return;
        }
        // diagonal capture
        if (newRow === this.row + 1 && (newCol === this.col - 1 || newCol === this.col + 1) && board[newRow][newCol]?.color === 'B') {
          return;
        }
        //  en passaunt
        if (newRow === this.row + 1 && (newCol === this.col - 1 || newCol === this.col + 1) && board[this.row][newCol]?.type === 'P' && board[this.row][newCol]?.color === 'B') {
          const i = moves.length-1
          if (moves[i].gamePiece?.type === 'P' && moves[i].gamePiece?.row === this.row + 2 && moves[i].gamePiece?.col === newCol && moves[i].newCol === newCol && moves[i].newRow === this.row) {
            return;
          } 
        }
        // promotion
      }
    }
    throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
  }
}
