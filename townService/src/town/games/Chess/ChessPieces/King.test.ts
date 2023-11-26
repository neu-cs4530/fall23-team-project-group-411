import { ChessBoardPosition, ChessCell, ChessMove } from '../../../../types/CoveyTownSocket';
import Pawn from './Pawn';
import Queen from './Queen';
import King from './King';
import Rook from './Rook';
import Knight from './Knight';
import Bishop from './Bishop';
// import { INVALID_MOVE_MESSAGE } from '../../../../lib/InvalidParametersError';

describe('ChessGame', () => {
  let king1: King;
  let king2: King;
  let board: ChessCell[][];
  let moves: ReadonlyArray<ChessMove>;
  describe('moves from starting board', () => {
    beforeEach(() => {
      king1 = new King('W', 0, 4);
      king2 = new King('B', 7, 4);
      moves = [];
      board = [
        [
          new Rook('W', 0, 0),
          new Knight('W', 0, 1),
          new Bishop('W', 0, 2),
          new Queen('W', 0, 3),
          king1,
          new Bishop('W', 0, 5),
          new Knight('W', 0, 6),
          new Rook('W', 0, 7),
        ],
        [
          new Pawn('W', 1, 0),
          new Pawn('W', 1, 1),
          new Pawn('W', 1, 2),
          new Pawn('W', 1, 3),
          new Pawn('W', 1, 4),
          new Pawn('W', 1, 5),
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          new Pawn('B', 6, 0),
          new Pawn('B', 6, 1),
          new Pawn('B', 6, 2),
          new Pawn('B', 6, 3),
          new Pawn('B', 6, 4),
          new Pawn('B', 6, 5),
          new Pawn('B', 6, 6),
          new Pawn('B', 6, 7),
        ],
        [
          new Rook('W', 7, 0),
          new Knight('B', 7, 1),
          new Bishop('B', 7, 2),
          new Queen('B', 7, 3),
          king2,
          new Bishop('B', 7, 5),
          new Knight('B', 7, 6),
          new Rook('W', 7, 7),
        ],
      ];
    });
    it('white, no valid moves from starting board', () => {
      function testValidation(i: ChessBoardPosition, j: ChessBoardPosition) {
        expect(() => king1.validate_move(i, j, board, moves)).toThrowError();
      }
      for (let i: ChessBoardPosition = 0; i <= 7; i++) {
        for (let j: ChessBoardPosition = 0; j <= 7; j++) {
          testValidation(i as ChessBoardPosition, j as ChessBoardPosition);
        }
      }
    });
    it('black, no valid moves from starting board', () => {
      function testValidation(i: ChessBoardPosition, j: ChessBoardPosition) {
        expect(() => king2.validate_move(i, j, board, moves)).toThrowError();
      }
      for (let i: ChessBoardPosition = 0; i <= 7; i++) {
        for (let j: ChessBoardPosition = 0; j <= 7; j++) {
          testValidation(i as ChessBoardPosition, j as ChessBoardPosition);
        }
      }
    });
  });
  describe('test castling', () => {
    beforeEach(() => {
      king1 = new King('W', 0, 4);
      king2 = new King('B', 7, 4);
      moves = [];
      board = [
        [
          new Rook('W', 0, 0),
          undefined,
          undefined,
          undefined,
          king1,
          undefined,
          undefined,
          new Rook('W', 0, 7),
        ],
        [
          new Pawn('W', 1, 0),
          new Pawn('W', 1, 1),
          new Pawn('W', 1, 2),
          new Pawn('W', 1, 3),
          new Pawn('W', 1, 4),
          new Pawn('W', 1, 5),
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          new Pawn('B', 6, 0),
          new Pawn('B', 6, 1),
          new Pawn('B', 6, 2),
          new Pawn('B', 6, 3),
          new Pawn('B', 6, 4),
          new Pawn('B', 6, 5),
          new Pawn('B', 6, 6),
          new Pawn('B', 6, 7),
        ],
        [
          new Rook('W', 7, 0),
          undefined,
          undefined,
          undefined,
          king2,
          undefined,
          undefined,
          new Rook('W', 7, 7),
        ],
      ];
    });
    it('white, short castle', () => {
      expect(() => king1.validate_move(0, 6, board, moves)).not.toThrowError();
    });
    it('white, long castle', () => {
      expect(() => king1.validate_move(0, 2, board, moves)).not.toThrowError();
    });
    it('white, short castle', () => {
      expect(() => king2.validate_move(7, 6, board, moves)).not.toThrowError();
    });
    it('white, long castle', () => {
      expect(() => king2.validate_move(7, 2, board, moves)).not.toThrowError();
    });
    it('white, cannot castle long if rook (0,0) has moved', () => {
      moves = [
        {
          gamePiece: {
            piece: new Rook('W', 0, 0),
            row: 0,
            col: 0,
          },
          toRow: 0,
          toCol: 1,
        },
        {
          gamePiece: {
            piece: new Rook('W', 0, 1),
            row: 0,
            col: 1,
          },
          toRow: 0,
          toCol: 0,
        },
      ];
      expect(() => king1.validate_move(0, 2, board, moves)).toThrowError();
      expect(() => king1.validate_move(0, 6, board, moves)).not.toThrowError();
      expect(() => king2.validate_move(0, 2, board, moves)).toThrowError();
      expect(() => king2.validate_move(0, 6, board, moves)).toThrowError();
    });
    it('white, cannot castle long if rook (7,0) has moved', () => {
      moves = [
        {
          gamePiece: {
            piece: new Rook('W', 0, 7),
            row: 0,
            col: 7,
          },
          toRow: 0,
          toCol: 6,
        },
        {
          gamePiece: {
            piece: new Rook('W', 0, 6),
            row: 0,
            col: 6,
          },
          toRow: 0,
          toCol: 7,
        },
      ];
      expect(() => king1.validate_move(0, 6, board, moves)).toThrowError();
      expect(() => king1.validate_move(0, 2, board, moves)).not.toThrowError();
      expect(() => king2.validate_move(0, 2, board, moves)).toThrowError();
      expect(() => king2.validate_move(0, 6, board, moves)).toThrowError();
    });
    it('black, cannot castle long if rook (7,0) has moved', () => {
      moves = [
        {
          gamePiece: {
            piece: new Rook('B', 7, 0),
            row: 7,
            col: 0,
          },
          toRow: 7,
          toCol: 1,
        },
        {
          gamePiece: {
            piece: new Rook('B', 7, 1),
            row: 7,
            col: 1,
          },
          toRow: 7,
          toCol: 0,
        },
      ];
      expect(() => king2.validate_move(7, 2, board, moves)).toThrowError();
      expect(() => king2.validate_move(7, 6, board, moves)).not.toThrowError();
      expect(() => king1.validate_move(7, 2, board, moves)).toThrowError();
      expect(() => king1.validate_move(7, 6, board, moves)).toThrowError();
    });
    it('black, cannot castle long if rook (7,7) has moved', () => {
      moves = [
        {
          gamePiece: {
            piece: new Rook('B', 7, 7),
            row: 7,
            col: 7,
          },
          toRow: 7,
          toCol: 6,
        },
        {
          gamePiece: {
            piece: new Rook('B', 7, 6),
            row: 7,
            col: 6,
          },
          toRow: 7,
          toCol: 7,
        },
      ];
      expect(() => king2.validate_move(7, 6, board, moves)).toThrowError();
      expect(() => king2.validate_move(7, 2, board, moves)).not.toThrowError();
      expect(() => king1.validate_move(7, 2, board, moves)).toThrowError();
      expect(() => king1.validate_move(7, 6, board, moves)).toThrowError();
    });
  });
});
