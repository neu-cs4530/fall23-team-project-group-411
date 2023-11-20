import InvalidParametersError, { INVALID_MOVE_MESSAGE } from '../../../../lib/InvalidParametersError';
<<<<<<< Updated upstream
import { ChessCell, ChessColor, ChessMove, ChessSquare, IChessPiece } from '../../../../types/CoveyTownSocket';
import { error } from 'console';

export default class Pawn implements IChessPiece {
  color: ChessColor;
  row: ChessSquare;
  col: ChessSquare;
=======
import { ChessCell, ChessColor, ChessMove, ChessBoardPosition, IChessPiece } from '../../../../types/CoveyTownSocket';

export default class Pawn implements IChessPiece {
  color: ChessColor;

  row: ChessBoardPosition;

  col: ChessBoardPosition;
>>>>>>> Stashed changes

  type: 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'None';

  constructor(color: ChessColor, row: ChessBoardPosition, col: ChessBoardPosition) {
    this.color = color;
    this.row = row;
    this.col = col;
    this.type = 'P';
  }

  validate_move(
    newRow: ChessBoardPosition,
    newCol: ChessBoardPosition,
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
          if (moves[i].gamePiece.piece.type === 'P' && moves[i].gamePiece.rank === this.row + 2 && moves[i].gamePiece.file === newCol && moves[i].toCol === newCol && moves[i].toRow === this.row) {
            return;
          } 
        }
        // promotion
      }
    }
    throw new InvalidParametersError(INVALID_MOVE_MESSAGE);
  }
}
