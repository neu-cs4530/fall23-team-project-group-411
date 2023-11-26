import { ChessCell, ChessMove } from '../../../../types/CoveyTownSocket';
import Pawn from './Pawn';
import Queen from './Queen';
import King from './King';
import Rook from './Rook';
import { INVALID_MOVE_MESSAGE } from '../../../../lib/InvalidParametersError';

describe('ChessGame', () => {
  let pawn: Pawn;
  let pawn1: Pawn;
  let pawn2: Pawn;
  let pawn3: Pawn;
  let pawn4: Pawn;
  let pawn5: Pawn;
  let board: ChessCell[][];
  let moves: ReadonlyArray<ChessMove>;
  describe('white correct moves', () => {
    beforeEach(() => {
      pawn = new Pawn('W', 1, 2);
      pawn1 = new Pawn('W', 1, 1);
      pawn2 = new Pawn('W', 1, 4);
      pawn3 = new Pawn('W', 1, 0);
      pawn4 = new Pawn('W', 1, 5);
      pawn5 = new Pawn('W', 2, 7);
      moves = [];
      board = [
        [
          undefined,
          undefined,
          undefined,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          undefined,
          undefined,
          undefined,
        ],
        [
          pawn3,
          pawn1,
          pawn,
          new Pawn('W', 1, 3),
          pawn2,
          pawn4,
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [
          undefined,
          new Rook('B', 2, 1),
          undefined,
          new Rook('B', 2, 3),
          new Rook('W', 2, 4),
          undefined,
          undefined,
          pawn5,
        ],
        [
          new Rook('B', 3, 0),
          undefined,
          undefined,
          undefined,
          undefined,
          new Rook('W', 3, 5),
          undefined,
          undefined,
        ],
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
          undefined,
          undefined,
          undefined,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          undefined,
          undefined,
          undefined,
        ],
      ];
    });
    it('white, move one up', () => {
      expect(() => pawn.validate_move(2, 2, board, [])).not.toThrowError();
    });
    it('white, move twice up', () => {
      expect(() => pawn.validate_move(3, 2, board, [])).not.toThrowError();
    });
    it('white, capture left', () => {
      expect(() => pawn.validate_move(2, 1, board, [])).not.toThrowError();
    });
    it('white, capture right', () => {
      expect(() => pawn.validate_move(2, 3, board, [])).not.toThrowError();
    });
    it('white, cannot capture white piece', () => {
      expect(() => pawn4.validate_move(2, 4, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move up when blocked by black piece', () => {
      expect(() => pawn1.validate_move(2, 1, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move up twice when blocked by black piece in first position', () => {
      expect(() => pawn1.validate_move(3, 1, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move up twice when blocked by black piece in second position', () => {
      expect(() => pawn3.validate_move(3, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move up when blocked by white piece', () => {
      expect(() => pawn2.validate_move(2, 4, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move up twice when blocked by white piece in first position', () => {
      expect(() => pawn2.validate_move(3, 4, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move up twice when blocked by white piece in first position', () => {
      expect(() => pawn4.validate_move(3, 5, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot stay in same place', () => {
      expect(() => pawn4.validate_move(1, 5, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move across the board', () => {
      expect(() => pawn.validate_move(7, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn.validate_move(4, 2, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn.validate_move(5, 2, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn.validate_move(6, 2, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn.validate_move(7, 2, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move backward', () => {
      expect(() => pawn3.validate_move(0, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move twice if not on the first row', () => {
      expect(() => pawn5.validate_move(3, 7, board, [])).not.toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn5.validate_move(4, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('white, cannot move sideways', () => {
      expect(() => pawn5.validate_move(2, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn5.validate_move(2, 5, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn5.validate_move(2, 4, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn5.validate_move(2, 3, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn5.validate_move(2, 2, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
  });
  describe('black correct moves', () => {
    beforeEach(() => {
      pawn = new Pawn('B', 6, 2);
      pawn1 = new Pawn('B', 6, 3);
      pawn2 = new Pawn('B', 6, 0);
      pawn3 = new Pawn('B', 6, 6);
      pawn4 = new Pawn('B', 6, 5);
      pawn5 = new Pawn('B', 5, 7);
      moves = [];
      board = [
        [
          undefined,
          undefined,
          undefined,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          undefined,
          undefined,
          undefined,
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
        [
          new Rook('W', 4, 0),
          undefined,
          undefined,
          undefined,
          undefined,
          new Rook('B', 4, 5),
          undefined,
          undefined,
        ],
        [
          undefined,
          new Rook('W', 5, 1),
          undefined,
          new Rook('W', 5, 3),
          undefined,
          undefined,
          new Rook('B', 5, 6),
          pawn5,
        ],
        [
          pawn2,
          new Pawn('B', 6, 1),
          pawn,
          pawn1,
          new Pawn('B', 6, 4),
          pawn4,
          pawn3,
          new Pawn('B', 6, 7),
        ],
        [
          undefined,
          undefined,
          undefined,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          undefined,
          undefined,
          undefined,
        ],
      ];
    });
    it('black, move one up', () => {
      expect(() => pawn.validate_move(5, 2, board, [])).not.toThrowError();
    });
    it('black, move twice up', () => {
      expect(() => pawn.validate_move(4, 2, board, [])).not.toThrowError();
    });
    it('black, captue diagonally left', () => {
      expect(() => pawn.validate_move(5, 1, board, [])).not.toThrowError();
    });
    it('black, captue diagonally right', () => {
      expect(() => pawn.validate_move(5, 3, board, [])).not.toThrowError();
    });
    it('black, cannot capture black piece', () => {
      expect(() => pawn4.validate_move(5, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move up when blocked by white piece', () => {
      expect(() => pawn1.validate_move(5, 3, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move up twice when blocked by white piece in first position', () => {
      expect(() => pawn1.validate_move(4, 3, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move up twice when blocked by white piece in second position', () => {
      expect(() => pawn2.validate_move(5, 0, board, [])).not.toThrowError();
      expect(() => pawn2.validate_move(4, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move up when blocked by black piece', () => {
      expect(() => pawn3.validate_move(5, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move up twice when blocked by black piece in first position', () => {
      expect(() => pawn3.validate_move(4, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move up twice when blocked by white piece in second position', () => {
      expect(() => pawn4.validate_move(5, 5, board, [])).not.toThrowError();
      expect(() => pawn4.validate_move(4, 5, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move up twice not on 7th row', () => {
      expect(() => pawn5.validate_move(4, 7, board, [])).not.toThrowError();
      expect(() => pawn5.validate_move(3, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move sideways', () => {
      expect(() => pawn5.validate_move(5, 6, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn5.validate_move(5, 4, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn5.validate_move(5, 3, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn5.validate_move(5, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot stay in place', () => {
      expect(() => pawn5.validate_move(5, 7, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move backward', () => {
      expect(() => pawn2.validate_move(7, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('black, cannot move across the board', () => {
      expect(() => pawn1.validate_move(3, 3, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn1.validate_move(2, 3, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn1.validate_move(1, 3, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn1.validate_move(0, 3, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
      expect(() => pawn1.validate_move(0, 0, board, [])).toThrowError(INVALID_MOVE_MESSAGE);
    });
  });
  describe('en passsant', () => {
    it('en passant, left, white', () => {
      pawn = new Pawn('W', 4, 2);
      moves = [
        {
          gamePiece: {
            piece: new Pawn('W', 6, 1),
            row: 6,
            col: 1,
          },
          toRow: 4,
          toCol: 1,
        },
      ];
      board = [
        [
          undefined,
          undefined,
          undefined,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          undefined,
          undefined,
          undefined,
        ],
        [
          new Pawn('W', 1, 0),
          new Pawn('W', 1, 1),
          undefined,
          new Pawn('W', 1, 3),
          new Pawn('W', 1, 4),
          new Pawn('W', 1, 5),
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          new Pawn('B', 4, 1),
          pawn,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          new Pawn('B', 6, 0),
          undefined,
          new Pawn('B', 6, 2),
          new Pawn('B', 6, 3),
          new Pawn('B', 6, 4),
          new Pawn('B', 6, 5),
          new Pawn('B', 6, 6),
          new Pawn('B', 6, 7),
        ],
        [
          undefined,
          undefined,
          undefined,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          undefined,
          undefined,
          undefined,
        ],
      ];
      expect(() => pawn.validate_move(5, 1, board, moves)).not.toThrowError();
    });
    it('en passant, right, white', () => {
      pawn = new Pawn('W', 4, 2);
      moves = [
        {
          gamePiece: {
            piece: new Pawn('B', 6, 3),
            row: 6,
            col: 3,
          },
          toRow: 4,
          toCol: 3,
        },
      ];
      board = [
        [
          undefined,
          undefined,
          undefined,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          undefined,
          undefined,
          undefined,
        ],
        [
          new Pawn('W', 1, 0),
          new Pawn('W', 1, 1),
          undefined,
          new Pawn('W', 1, 3),
          new Pawn('W', 1, 4),
          new Pawn('W', 1, 5),
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          undefined,
          pawn,
          new Pawn('B', 4, 3),
          undefined,
          undefined,
          undefined,
          undefined,
        ],
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
          undefined,
          undefined,
          undefined,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          undefined,
          undefined,
          undefined,
        ],
      ];
      expect(() => pawn.validate_move(5, 3, board, moves)).not.toThrowError();
    });
    it('en passant, right, black', () => {
      pawn = new Pawn('B', 3, 2);
      moves = [
        {
          gamePiece: {
            piece: new Pawn('W', 1, 3),
            row: 1,
            col: 3,
          },
          toRow: 3,
          toCol: 3,
        },
      ];
      board = [
        [
          undefined,
          undefined,
          undefined,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          undefined,
          undefined,
          undefined,
        ],
        [
          new Pawn('W', 1, 0),
          new Pawn('W', 1, 1),
          new Pawn('W', 1, 2),
          undefined,
          new Pawn('W', 1, 4),
          new Pawn('W', 1, 5),
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          undefined,
          pawn,
          new Pawn('W', 3, 3),
          undefined,
          undefined,
          undefined,
          undefined,
        ],
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
          undefined,
          undefined,
          undefined,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          undefined,
          undefined,
          undefined,
        ],
      ];
      expect(() => pawn.validate_move(2, 3, board, moves)).not.toThrowError();
    });
    it('en passant, left, black', () => {
      pawn = new Pawn('B', 3, 4);
      moves = [
        {
          gamePiece: {
            piece: new Pawn('W', 1, 3),
            row: 1,
            col: 3,
          },
          toRow: 3,
          toCol: 3,
        },
      ];
      board = [
        [
          undefined,
          undefined,
          undefined,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          undefined,
          undefined,
          undefined,
        ],
        [
          new Pawn('W', 1, 0),
          new Pawn('W', 1, 1),
          new Pawn('W', 1, 2),
          undefined,
          new Pawn('W', 1, 4),
          new Pawn('W', 1, 5),
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          undefined,
          undefined,
          new Pawn('W', 3, 3),
          pawn,
          undefined,
          undefined,
          undefined,
        ],
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
          undefined,
          undefined,
          undefined,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          undefined,
          undefined,
          undefined,
        ],
      ];
      expect(() => pawn.validate_move(2, 3, board, moves)).not.toThrowError();
    });
    it('cannot en passant if it was not the last move v1', () => {
      pawn = new Pawn('B', 3, 4);
      moves = [
        {
          gamePiece: {
            piece: new Pawn('W', 1, 3),
            row: 1,
            col: 3,
          },
          toRow: 3,
          toCol: 3,
        },
        {
          gamePiece: {
            piece: new Pawn('W', 1, 0),
            row: 1,
            col: 0,
          },
          toRow: 1,
          toCol: 3,
        },
      ];
      board = [
        [
          undefined,
          undefined,
          undefined,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          undefined,
          undefined,
          undefined,
        ],
        [
          new Pawn('W', 1, 0),
          new Pawn('W', 1, 1),
          new Pawn('W', 1, 2),
          undefined,
          new Pawn('W', 1, 4),
          new Pawn('W', 1, 5),
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          undefined,
          undefined,
          new Pawn('W', 3, 3),
          pawn,
          undefined,
          undefined,
          undefined,
        ],
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
          undefined,
          undefined,
          undefined,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          undefined,
          undefined,
          undefined,
        ],
      ];
      expect(() => pawn.validate_move(2, 3, board, moves)).toThrowError(INVALID_MOVE_MESSAGE);
    });
    it('cannot en passant if it was not the last move v2', () => {
      pawn = new Pawn('B', 3, 4);
      moves = [];
      board = [
        [
          undefined,
          undefined,
          undefined,
          new Queen('W', 0, 3),
          new King('W', 0, 4),
          undefined,
          undefined,
          undefined,
        ],
        [
          new Pawn('W', 1, 0),
          new Pawn('W', 1, 1),
          new Pawn('W', 1, 2),
          undefined,
          new Pawn('W', 1, 4),
          new Pawn('W', 1, 5),
          new Pawn('W', 1, 6),
          new Pawn('W', 1, 7),
        ],
        [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
        [
          undefined,
          undefined,
          undefined,
          new Pawn('W', 3, 3),
          pawn,
          undefined,
          undefined,
          undefined,
        ],
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
          undefined,
          undefined,
          undefined,
          new Queen('B', 7, 3),
          new King('B', 7, 4),
          undefined,
          undefined,
          undefined,
        ],
      ];
      expect(() => pawn.validate_move(2, 3, board, moves)).toThrowError(INVALID_MOVE_MESSAGE);
    });
  });
});
