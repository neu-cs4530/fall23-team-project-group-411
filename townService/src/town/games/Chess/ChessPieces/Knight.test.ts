import { ChessBoardPosition, ChessCell, ChessMove } from '../../../../types/CoveyTownSocket';
import Pawn from './Pawn';
import Queen from './Queen';
import King from './King';
import Rook from './Rook';
import Knight from './Knight';
import Bishop from './Bishop';
import { INVALID_MOVE_MESSAGE } from '../../../../lib/InvalidParametersError';

describe('ChessGame', () => {
  let knight1: Knight;
  let knight2: Knight;
  let knight3: Knight;
  let knight4: Knight;
  let board: ChessCell[][];
  let moves: ReadonlyArray<ChessMove>;
  describe('moves from starting board', () => {
    beforeEach(() => {
      knight1 = new Knight('W', 0, 1);
      knight2 = new Knight('W', 0, 6);
      knight3 = new Knight('B', 7, 1);
      knight4 = new Knight('B', 7, 6);
      moves = [];
      board = [
        [
          new Rook('W', 0, 0),
          knight1,
          new Bishop('W', 0, 2),
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          new Bishop('W', 0, 5),
          knight2,
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
          knight3,
          new Bishop('B', 7, 2),
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          new Bishop('B', 7, 5),
          knight4,
          new Rook('B', 7, 2),
        ],
      ];
    });
    it('white, correct moves from starting board', () => {
      expect(() => knight1.validate_move(2, 0, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(2, 2, board, [])).not.toThrowError();
      expect(() => knight2.validate_move(2, 7, board, [])).not.toThrowError();
      expect(() => knight2.validate_move(2, 5, board, [])).not.toThrowError();
    });
    it('white, invalid moves from starting board', () => {
      function testValidation1(i: ChessBoardPosition, j: ChessBoardPosition) {
        expect(() => knight1.validate_move(i, j, board, moves)).toThrowError();
      }
      function testValidation2(i: ChessBoardPosition, j: ChessBoardPosition) {
        expect(() => knight2.validate_move(i, j, board, moves)).toThrowError();
      }
      for (let i: ChessBoardPosition = 0; i <= 7; i++) {
        for (let j: ChessBoardPosition = 0; j <= 7; j++) {
          if (!((i === 2 && j === 2) || (i === 2 && j === 0))) {
            testValidation1(i as ChessBoardPosition, j as ChessBoardPosition);
          }
          if (!((i === 2 && j === 7) || (i === 2 && j === 5))) {
            testValidation2(i as ChessBoardPosition, j as ChessBoardPosition);
          }
        }
      }
    });
    it('black, correct moves from starting board', () => {
      expect(() => knight3.validate_move(5, 0, board, [])).not.toThrowError();
      expect(() => knight3.validate_move(5, 2, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(5, 7, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(5, 5, board, [])).not.toThrowError();
    });
    it('black, invalid moves from starting board', () => {
      function testValidation1(i: ChessBoardPosition, j: ChessBoardPosition) {
        expect(() => knight3.validate_move(i, j, board, moves)).toThrowError();
      }
      function testValidation2(i: ChessBoardPosition, j: ChessBoardPosition) {
        expect(() => knight4.validate_move(i, j, board, moves)).toThrowError();
      }
      for (let i: ChessBoardPosition = 0; i <= 7; i++) {
        for (let j: ChessBoardPosition = 0; j <= 7; j++) {
          if (!((i === 5 && j === 2) || (i === 5 && j === 0))) {
            testValidation1(i as ChessBoardPosition, j as ChessBoardPosition);
          }
          if (!((i === 5 && j === 7) || (i === 5 && j === 5))) {
            testValidation2(i as ChessBoardPosition, j as ChessBoardPosition);
          }
        }
      }
    });
  });
  describe('moves from custom board', () => {
    beforeEach(() => {
      knight1 = new Knight('W', 0, 1);
      knight2 = new Knight('W', 0, 6);
      knight3 = new Knight('B', 7, 1);
      knight4 = new Knight('B', 7, 6);
      moves = [];
      board = [
        [
          new Rook('W', 0, 0),
          knight1,
          new Bishop('W', 0, 2),
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          new Bishop('W', 0, 5),
          knight2,
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
        [
          new Rook('B', 2, 0),
          undefined,
          new Queen('B', 2, 2),
          undefined,
          undefined,
          new King('B', 5, 2),
          undefined,
          new Pawn('B', 7, 2),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          new Knight('W', 5, 0),
          undefined,
          new Knight('W', 5, 2),
          undefined,
          undefined,
          new Knight('W', 5, 7),
          undefined,
          new Knight('W', 5, 7),
        ],
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
          knight3,
          new Bishop('B', 7, 2),
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          new Bishop('B', 7, 5),
          knight4,
          new Rook('B', 7, 2),
        ],
      ];
    });
    it('white, can capture all peices of opposite colors', () => {
      expect(() => knight1.validate_move(2, 0, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(2, 2, board, [])).not.toThrowError();
      expect(() => knight2.validate_move(2, 7, board, [])).not.toThrowError();
      expect(() => knight2.validate_move(2, 5, board, [])).not.toThrowError();
    });
    it('black, can capture all peices of opposite colors', () => {
      expect(() => knight3.validate_move(5, 0, board, [])).not.toThrowError();
      expect(() => knight3.validate_move(5, 2, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(5, 7, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(5, 5, board, [])).not.toThrowError();
    });
  });
  describe('moves from custom board', () => {
    beforeEach(() => {
      knight1 = new Knight('W', 0, 1);
      knight2 = new Knight('W', 0, 6);
      knight3 = new Knight('B', 7, 1);
      knight4 = new Knight('B', 7, 6);
      moves = [];
      board = [
        [
          new Rook('W', 0, 0),
          knight1,
          new Bishop('W', 0, 2),
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          new Bishop('W', 0, 5),
          knight2,
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
        [
          new Rook('W', 2, 0),
          undefined,
          new Queen('W', 2, 2),
          undefined,
          undefined,
          new King('W', 5, 2),
          undefined,
          new Pawn('W', 7, 2),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          new Knight('B', 5, 0),
          undefined,
          new Knight('B', 5, 2),
          undefined,
          undefined,
          new Knight('B', 5, 7),
          undefined,
          new Knight('B', 5, 7),
        ],
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
          knight3,
          new Bishop('B', 7, 2),
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          new Bishop('B', 7, 5),
          knight4,
          new Rook('B', 7, 2),
        ],
      ];
    });
    it('white, cannot capture all peices of same color', () => {
      expect(() => knight1.validate_move(2, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => knight1.validate_move(2, 2, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => knight2.validate_move(2, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => knight2.validate_move(2, 5, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot capture all peices of opposite color', () => {
      expect(() => knight3.validate_move(5, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => knight3.validate_move(5, 2, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => knight4.validate_move(5, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => knight4.validate_move(5, 5, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
  });
  describe('can move all 8 places', () => {
    beforeEach(() => {
      knight1 = new Knight('W', 3, 3);
      knight4 = new Knight('B', 4, 4);
      moves = [];
      board = [
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, knight1, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, knight4, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      ];
    });
    it('white', () => {
      expect(() => knight1.validate_move(1, 2, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(1, 4, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(2, 1, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(2, 5, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(4, 1, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(4, 5, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(5, 2, board, [])).not.toThrowError();
      expect(() => knight1.validate_move(5, 4, board, [])).not.toThrowError();
    });
    it('black', () => {
      expect(() => knight4.validate_move(2, 3, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(2, 5, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(3, 2, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(3, 6, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(5, 2, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(5, 6, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(6, 3, board, [])).not.toThrowError();
      expect(() => knight4.validate_move(6, 5, board, [])).not.toThrowError();
    });
  });
});
