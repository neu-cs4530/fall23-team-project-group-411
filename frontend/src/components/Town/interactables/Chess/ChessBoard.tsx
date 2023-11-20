import { Button, chakra, Container, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ChessBoardSquare } from '../../../../../../shared/types/CoveyTownSocket';
import ChessAreaController from '../../../../classes/interactable/ChessAreaController';
import useTownController from '../../../../hooks/useTownController';
<<<<<<< Updated upstream
import { IChessPiece } from '../../../../types/CoveyTownSocket';
=======
>>>>>>> Stashed changes

export type ChessGameProps = {
  gameAreaController: ChessAreaController;
};

/**
 * A component that will render a single cell on a Chess board, styled.
 * This component is made specifically to render the light squares.
 */ // ideally, whitesmoke colored
const StyledChessSquareLight = chakra(Button, {
  baseStyle: {
    background: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '0px',
    fontSize: '40px',
    _disabled: {
      opacity: '100%',
    },
  },
});

/**
 * A component that will render a single cell on a Chess board, styled.
 * This component is made specifically to render the dark squares.
 */ // ideally, dimgrey colored
const StyledChessSquareDark = chakra(Button, {
  baseStyle: {
    background: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '0px',
    fontSize: '40px',
    _disabled: {
      opacity: '100%',
    },
  },
});

/**
 * A component that will render the TicTacToe board, styled
 */
const StyledChessBoard = chakra(Container, {
  baseStyle: {
    display: 'table',
    maxWidth: '1000px',
    textAlign: 'center',
    padding: '30px'
  },
});

/**
 * TODO: Documentation
 *
 * @param gameAreaController the controller for the Chess game
 */
export default function ChessBoard({ gameAreaController }: ChessGameProps): JSX.Element {
  const townController = useTownController();

<<<<<<< Updated upstream
  const [board, setBoard] = useState<IChessPiece[][]>(gameAreaController.board);
=======
  const [board, setBoard] = useState<ChessBoardSquare[][]>(gameAreaController.board);
>>>>>>> Stashed changes
  const [isOurTurn, setIsOurTurn] = useState(gameAreaController.isOurTurn);

  const toast = useToast();

  useEffect(() => {
    gameAreaController.addListener('turnChanged', setIsOurTurn);
    gameAreaController.addListener('boardChanged', setBoard);
    return () => {
      gameAreaController.removeListener('boardChanged', setBoard);
      gameAreaController.removeListener('turnChanged', setIsOurTurn);
    };
  }, [gameAreaController]);

  const tempArray = [
    ["R", "N", "B", "K", "Q", "B", "N", "R"],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "K", "Q", "B", "N", "R"],
  ];

  return (
    <StyledChessBoard>
      {tempArray.map((row, i) => (
        <div key={i}>
          {row.map((cell, j) => (
            <StyledChessSquareDark key={j}>{cell}</StyledChessSquareDark>
          ))}
        </div>
      ))}
    </StyledChessBoard>
  );
}

  /* Saved code!
  function RenderWhitePlayerPOV(): JSX.Element {
    const renderBoard: JSX.Element[][] = [];

    for (let i = 7; i >= 0; i--) {
      for (let j = 7; j >= 0; j--) {
        if ((i % 2 === 0 && j % 2 === 0) || (i % 2 != 0 && j % 2 != 0)) {
          renderBoard[i][j] = (
            <StyledChessSquareDark
              key={`${i}.${j}`}
              // on-click: move logic
              disabled={!isOurTurn}
              aria-label={`Cell ${i},${j}`}>
              { (! board[i][j]) ? '' : board[i][j]?.type }
            </StyledChessSquareDark>
          );
        } else {
          renderBoard[i][j] = (
            <StyledChessSquareLight
            key={`${i}.${j}`}
            // on-click: move logic
            disabled={!isOurTurn}
            aria-label={`Cell ${i},${j}`}>
            { (! board[i][j]) ? '' : board[i][j]?.type }
            </StyledChessSquareLight>
          );
        }
      }
    }
    return <StyledChessBoard aria-label='Chessboard'>{renderBoard}</StyledChessBoard>;
  }

  // we need to add a check to determine how to render the board, depending on the player color.
  return (
    <RenderWhitePlayerPOV></RenderWhitePlayerPOV>
  );
  */

// Old Code
// renders the board from the Black player's POV.
// function renderBlackPlayerPOV(): JSX.Element {
//   const renderBoard: JSX.Element[][] = [];

//   for (let i = 7; i >= 0; i--) {
//     for (let j = 7; j >= 0; j--) {
//       if ((i % 2 === 0 && j % 2 === 0) || (i % 2 != 0 && j % 2 != 0)) {
//         renderBoard[i][j] = (
//           <StyledChessSquareDark
//             key={`${i}.${j}`}
//             onClick={async () => {
//               try {
//                 // TODO: makeMove logic
//                 // we need to store a "picked up" variable, or something
//                 // to keep track of when the user is about to move a piece.
//                 //
//                 // a boolean flag should be good enough; if it's our turn, and the
//                 // user has clicked a piece, then we assume that's the piece they
//                 // want to move. the next click on a square then is made as a move.
//                 // if the move is not legal, reject it, and wait until the player makes
//                 // a legal move.
//                 await gameAreaController.makeMove({
//                   gamePiece: undefined,
//                   newRow: 0,
//                   newCol: 0,
//                 });
//               } catch (e) {
//                 toast({
//                   title: 'Error making move',
//                   description: (e as Error).toString(),
//                   status: 'error',
//                 });
//               }
//             }}
//             disabled={!isOurTurn}
//             aria-label={`Cell ${i},${j}`}>
//             {/* Here, we draw the piece depending on if there's a gamepiece inside*/}
//           </StyledChessSquareDark>
//         );
//       } else {
//         renderBoard[i][j] = (
//           <StyledChessSquareLight
//             key={`${i}.${j}`}
//             onClick={async () => {
//               try {
//                 // TODO: makeMove logic
//                 // we need to store a "picked up" variable, or something
//                 // to keep track of when the user is about to move a piece.
//                 //
//                 // a boolean flag should be good enough; if it's our turn, and the
//                 // user has clicked a piece, then we assume that's the piece they
//                 // want to move. the next click on a square then is made as a move.
//                 // if the move is not legal, reject it, and wait until the player makes
//                 // a legal move.
//                 await gameAreaController.makeMove({
//                   gamePiece: undefined,
//                   newRow: 0,
//                   newCol: 0,
//                 });
//               } catch (e) {
//                 toast({
//                   title: 'Error making move',
//                   description: (e as Error).toString(),
//                   status: 'error',
//                 });
//               }
//             }}
//             disabled={!isOurTurn}
//             aria-label={`Cell ${i},${j}`}>
//             {/* Here, we draw the piece depending on if there's a gamepiece inside*/}
//           </StyledChessSquareLight>
//         );
//       }
//     }
//   }

//   return <StyledChessBoard aria-label='Chessboard'>{renderBoard}</StyledChessBoard>;
// }

  // // TODO: these functions are massive! we need to clean it up.
  // // Displays the board from the White player's POV.
  // function renderWhitePlayerPOV(): JSX.Element {
  //   const renderBoard: JSX.Element[][] = [];
  //   for (let i = 0; i < board.length; i++) {
  //     for (let j = 0; j < board[0].length; j++) {
  //       if ((i % 2 === 0 && j % 2 === 0) || (i % 2 != 0 && j % 2 != 0)) {
  //         renderBoard[i][j] = (
  //           <StyledChessSquareDark
  //             key={`${i}.${j}`}
  //             onClick={async () => {
  //               try {
  //                 // TODO: makeMove logic
  //                 // we need to store a "picked up" variable, or something
  //                 // to keep track of when the user is about to move a piece.

  //                 // a boolean flag should be good enough; if it's our turn, and the
  //                 // user has clicked a piece, then we assume that's the piece they
  //                 // want to move. the next click on a square then is made as a move.
  //                 // if the move is not legal, reject it, and wait until the player makes
  //                 // a legal move.
  //                 await gameAreaController.makeMove({
  //                   gamePiece: undefined,
  //                   newRow: 0,
  //                   newCol: 0,
  //                 });
  //               } catch (e) {
  //                 toast({
  //                   title: 'Error making move',
  //                   description: (e as Error).toString(),
  //                   status: 'error',
  //                 });
  //               }
  //             }}
  //             disabled={!isOurTurn}
  //             aria-label={`Cell ${i},${j}`}>
  //             {/* Here, we draw the piece depending on if there's a gamepiece inside*/}
  //           </StyledChessSquareDark>
  //         );
  //       } else {
  //         renderBoard[i][j] = (
  //           <StyledChessSquareLight
  //             key={`${i}.${j}`}
  //             onClick={async () => {
  //               try {
  //                 // TODO: makeMove logic
  //                 // we need to store a "picked up" variable, or something
  //                 // to keep track of when the user is about to move a piece.

  //                 // a boolean flag should be good enough; if it's our turn, and the
  //                 // user has clicked a piece, then we assume that's the piece they
  //                 // want to move. the next click on a square then is made as a move.
  //                 // if the move is not legal, reject it, and wait until the player makes
  //                 // a legal move.
  //                 await gameAreaController.makeMove({
  //                   gamePiece: undefined,
  //                   newRow: 0,
  //                   newCol: 0,
  //                 });
  //               } catch (e) {
  //                 toast({
  //                   title: 'Error making move',
  //                   description: (e as Error).toString(),
  //                   status: 'error',
  //                 });
  //               }
  //             }}
  //             disabled={!isOurTurn}
  //             aria-label={`Cell ${i},${j}`}>
  //             {/* Here, we draw the piece depending on if there's a gamepiece inside*/}
  //           </StyledChessSquareLight>
  //         );
  //       }
  //     }
  //   }

  //   return <StyledChessBoard aria-label='Chessboard'>{renderBoard}</StyledChessBoard>;
  // }
