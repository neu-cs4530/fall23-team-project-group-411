import { ChessBoardPosition, ChessCell, ChessMove } from '../../../../types/CoveyTownSocket';
import Pawn from './Pawn';
import Queen from './Queen';
import King from './King';
import Rook from './Rook';
import Knight from './Knight';
import Bishop from './Bishop';
import { INVALID_MOVE_MESSAGE } from '../../../../lib/InvalidParametersError';

describe('ChessGame', () => {
  let bishop1: Bishop;
  let bishop2: Bishop;
  let bishop3: Bishop;
  let bishop4: Bishop;
  let board: ChessCell[][];
  let moves: ReadonlyArray<ChessMove>;
  describe('moves from starting board', () => {
    beforeEach(() => {
      bishop1 = new Bishop('W', 0, 2);
      bishop2 = new Bishop('W', 0, 5);
      bishop3 = new Bishop('B', 7, 2);
      bishop4 = new Bishop('B', 7, 5);
      moves = [];
      board = [
        [
          new Rook('W', 0, 0),
          new Knight('W', 0, 1),
          bishop1,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          bishop2,
          new Knight('W', 0, 6),
          new Rook('W', 0, 2),
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
          new Rook('B', 7, 0),
          new Knight('B', 7, 1),
          bishop3,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          bishop4,
          new Knight('B', 7, 6),
          new Rook('B', 7, 2),
        ],
      ];
    });
    it('white, no valid moves from starting board', () => {
      function testValidation(i: ChessBoardPosition, j: ChessBoardPosition) {
        expect(() => bishop1.validate_move(i, j, board, moves)).toThrowError();
        expect(() => bishop2.validate_move(i, j, board, moves)).toThrowError();
      }
      for (let i: ChessBoardPosition = 0; i <= 7; i++) {
        for (let j: ChessBoardPosition = 0; j <= 7; j++) {
          testValidation(i as ChessBoardPosition, j as ChessBoardPosition);
        }
      }
    });
    it('black, no valid moves from starting board', () => {
      function testValidation(i: ChessBoardPosition, j: ChessBoardPosition) {
        expect(() => bishop3.validate_move(i, j, board, moves)).toThrowError();
        expect(() => bishop4.validate_move(i, j, board, moves)).toThrowError();
      }
      for (let i: ChessBoardPosition = 0; i <= 7; i++) {
        for (let j: ChessBoardPosition = 0; j <= 7; j++) {
          testValidation(i as ChessBoardPosition, j as ChessBoardPosition);
        }
      }
    });
  });
  describe('moves from custom board (starting position no pawns)', () => {
    beforeEach(() => {
      bishop1 = new Bishop('W', 0, 2);
      bishop2 = new Bishop('W', 0, 5);
      bishop3 = new Bishop('B', 7, 2);
      bishop4 = new Bishop('B', 7, 5);
      moves = [];
      board = [
        [
          new Rook('W', 0, 0),
          new Knight('W', 0, 1),
          bishop1,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          bishop2,
          new Knight('W', 0, 6),
          new Rook('W', 0, 2),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          new Rook('B', 7, 0),
          new Knight('B', 7, 1),
          bishop3,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          bishop4,
          new Knight('B', 7, 6),
          new Rook('B', 7, 2),
        ],
      ];
    });
    it('white, can moves on diagonals', () => {
      expect(() => bishop1.validate_move(1, 1, board, [])).not.toThrowError();
      expect(() => bishop1.validate_move(2, 0, board, [])).not.toThrowError();
      expect(() => bishop1.validate_move(2, 4, board, [])).not.toThrowError();
      expect(() => bishop1.validate_move(3, 5, board, [])).not.toThrowError();
      expect(() => bishop1.validate_move(4, 6, board, [])).not.toThrowError();
      expect(() => bishop1.validate_move(5, 7, board, [])).not.toThrowError();
      expect(() => bishop2.validate_move(1, 6, board, [])).not.toThrowError();
      expect(() => bishop2.validate_move(2, 7, board, [])).not.toThrowError();
      expect(() => bishop2.validate_move(1, 4, board, [])).not.toThrowError();
      expect(() => bishop2.validate_move(2, 3, board, [])).not.toThrowError();
      expect(() => bishop2.validate_move(3, 2, board, [])).not.toThrowError();
      expect(() => bishop2.validate_move(4, 1, board, [])).not.toThrowError();
      expect(() => bishop2.validate_move(5, 0, board, [])).not.toThrowError();
    });
    it('black, can moves on diagonals', () => {
      expect(() => bishop3.validate_move(6, 1, board, [])).not.toThrowError();
      expect(() => bishop3.validate_move(5, 0, board, [])).not.toThrowError();
      expect(() => bishop3.validate_move(6, 3, board, [])).not.toThrowError();
      expect(() => bishop3.validate_move(5, 4, board, [])).not.toThrowError();
      expect(() => bishop3.validate_move(4, 5, board, [])).not.toThrowError();
      expect(() => bishop3.validate_move(3, 6, board, [])).not.toThrowError();
      expect(() => bishop3.validate_move(2, 7, board, [])).not.toThrowError();
      expect(() => bishop4.validate_move(6, 6, board, [])).not.toThrowError();
      expect(() => bishop4.validate_move(5, 7, board, [])).not.toThrowError();
      expect(() => bishop4.validate_move(6, 4, board, [])).not.toThrowError();
      expect(() => bishop4.validate_move(5, 3, board, [])).not.toThrowError();
      expect(() => bishop4.validate_move(4, 2, board, [])).not.toThrowError();
      expect(() => bishop4.validate_move(3, 1, board, [])).not.toThrowError();
      expect(() => bishop4.validate_move(2, 0, board, [])).not.toThrowError();
    });
  });
  describe('moves from custom board v1', () => {
    beforeEach(() => {
      bishop1 = new Bishop('W', 3, 3);
      bishop2 = new Bishop('W', 3, 4);
      bishop3 = new Bishop('B', 4, 3);
      bishop4 = new Bishop('B', 4, 4);
      moves = [];
      board = [
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          undefined,
          new Rook('B', 2, 2),
          undefined,
          undefined,
          new King('W', 2, 5),
          undefined,
          undefined,
        ],
        [undefined, undefined, undefined, bishop1, bishop2, undefined, undefined, undefined],
        [undefined, undefined, undefined, bishop3, bishop3, undefined, undefined, undefined],
        [
          undefined,
          undefined,
          new Queen('W', 5, 2),
          undefined,
          undefined,
          new Pawn('B', 5, 5),
          undefined,
          undefined,
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      ];
    });
    it('white, cannot move through peices of opposite color', () => {
      expect(() => bishop2.validate_move(1, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => bishop2.validate_move(0, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move through peices of opposite color', () => {
      expect(() => bishop1.validate_move(1, 1, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => bishop1.validate_move(0, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot capture peice of same color', () => {
      expect(() => bishop2.validate_move(2, 5, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, can capture peice of opposite color', () => {
      expect(() => bishop1.validate_move(2, 2, board, [])).not.toThrowError();
    });
    it('black, cannot move through peices of opposite color', () => {
      expect(() => bishop3.validate_move(6, 1, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => bishop3.validate_move(7, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move through peices of same color', () => {
      expect(() => bishop4.validate_move(6, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => bishop4.validate_move(7, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot capture peice of same color', () => {
      expect(() => bishop4.validate_move(5, 5, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, can capture peice of opposite color', () => {
      expect(() => bishop3.validate_move(5, 2, board, [])).not.toThrowError();
    });
  });
  describe('moves from custom board v2', () => {
    beforeEach(() => {
      bishop1 = new Bishop('W', 3, 3);
      bishop2 = new Bishop('W', 3, 4);
      bishop3 = new Bishop('B', 4, 3);
      bishop4 = new Bishop('B', 4, 4);
      moves = [];
      board = [
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          new Rook('B', 1, 1),
          undefined,
          undefined,
          undefined,
          undefined,
          new King('W', 1, 6),
          undefined,
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, bishop1, bishop2, undefined, undefined, undefined],
        [undefined, undefined, undefined, bishop3, bishop3, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          new Queen('W', 6, 1),
          undefined,
          undefined,
          undefined,
          undefined,
          new Pawn('B', 6, 6),
          undefined,
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      ];
    });
    it('white, cannot move through peices of opposite color', () => {
      expect(() => bishop2.validate_move(2, 5, board, [])).not.toThrowError();
      expect(() => bishop2.validate_move(0, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move through peices of opposite color', () => {
      expect(() => bishop1.validate_move(2, 2, board, [])).not.toThrowError();
      expect(() => bishop1.validate_move(0, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot capture peice of same color', () => {
      expect(() => bishop2.validate_move(1, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, can capture peice of opposite color', () => {
      expect(() => bishop1.validate_move(1, 1, board, [])).not.toThrowError();
    });
    it('black, cannot move through peices of opposite color', () => {
      expect(() => bishop3.validate_move(5, 2, board, [])).not.toThrowError();
      expect(() => bishop3.validate_move(7, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move through peices of same color', () => {
      expect(() => bishop4.validate_move(5, 5, board, [])).not.toThrowError();
      expect(() => bishop4.validate_move(7, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot capture peice of same color', () => {
      expect(() => bishop4.validate_move(6, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, can capture peice of opposite color', () => {
      expect(() => bishop3.validate_move(6, 1, board, [])).not.toThrowError();
    });
  });
});
