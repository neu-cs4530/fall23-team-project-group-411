import { ChessCell, ChessMove } from '../../../../types/CoveyTownSocket';
import Pawn from './Pawn';
import Queen from './Queen';
import King from './King';

describe('ChessGame', () => {
    let pawn: Pawn;
    let board: ChessCell[][];
    let moves:  ReadonlyArray<ChessMove>;
    describe('normal, move up', () => {
        beforeEach(() => {
            pawn = new Pawn("W",1,2);
            moves = [];
            board = [
              [undefined,undefined,undefined,new Queen("W",0,3),new King("W",0,4),undefined,undefined,undefined],
                [new Pawn("W",1,0),new Pawn("W",1,1),pawn,new Pawn("W",1,3),new Pawn("W",1,4),new Pawn("W",1,5),new Pawn("W",1,6),new Pawn("W",1,7)],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
                [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
                [new Pawn("B",7,0),new Pawn("B",7,1),new Pawn("B",7,2),new Pawn("B",7,3),new Pawn("B",7,4),new Pawn("B",7,5),new Pawn("B",7,6),new Pawn("B",7,7)],
                [undefined,undefined,undefined,new Queen("B",7,3),new King("B",7,4),undefined,undefined,undefined],
              ];
          });
          it('white, move one up', () => {
            expect(pawn.validate_move(2,2,board,[])).not.toThrowError
            pawn.validate_move(2,2,board,moves)
          });
          it('white, move twice up', () => {
            pawn.validate_move(3,2,board,moves)
          });
    });
    describe('en passsant', () => {
        it('en passant, left, white', () => {
          pawn = new Pawn("W",4,2);
          moves = [{
            gamePiece: new Pawn("B",6,1),
            newRow: 4,
            newCol: 1,
          },]
          board = [
            [undefined,undefined,undefined,new Queen("W",0,3),new King("W",0,4),undefined,undefined,undefined],
              [new Pawn("W",1,0),new Pawn("W",1,1),undefined,new Pawn("W",1,3),new Pawn("W",1,4),new Pawn("W",1,5),new Pawn("W",1,6),new Pawn("W",1,7)],
              [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
              [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
              [undefined,new Pawn("B", 4,1),pawn,undefined,undefined,undefined,undefined,undefined],
              [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
              [new Pawn("B",6,0),undefined,new Pawn("B",6,2),new Pawn("B",6,3),new Pawn("B",6,4),new Pawn("B",6,5),new Pawn("B",6,6),new Pawn("B",6,7)],
              [undefined,undefined,undefined,new Queen("B",7,3),new King("B",7,4),undefined,undefined,undefined],
            ];
          expect(pawn.validate_move(5,1,board,moves)).not.toThrowError
        });
        it('en passant, right, white', () => {
          pawn = new Pawn("W",4,2);
          moves = [{
            gamePiece: new Pawn("B",6,3),
            newRow: 4,
            newCol: 3,
          },]
          board = [
            [undefined,undefined,undefined,new Queen("W",0,3),new King("W",0,4),undefined,undefined,undefined],
              [new Pawn("W",1,0),new Pawn("W",1,1),undefined,new Pawn("W",1,3),new Pawn("W",1,4),new Pawn("W",1,5),new Pawn("W",1,6),new Pawn("W",1,7)],
              [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
              [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
              [undefined,undefined,pawn,new Pawn("B", 4,3),undefined,undefined,undefined,undefined],
              [undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined],
              [new Pawn("B",6,0),new Pawn("B", 6,1),new Pawn("B",6,2),new Pawn("B",6,3),new Pawn("B",6,4),new Pawn("B",6,5),new Pawn("B",6,6),new Pawn("B",6,7)],
              [undefined,undefined,undefined,new Queen("B",7,3),new King("B",7,4),undefined,undefined,undefined],
            ];
          expect(pawn.validate_move(5,3,board,moves)).not.toThrowError
        });
  });

});
