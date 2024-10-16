"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "react-hot-toast";

type Player = "X" | "O" | null;

interface GameState {
  board: Player[];
  currentPlayer: Player;
  winner: Player | "draw" | null;
}

const initialState: GameState = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  winner: null,
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function TicTacToe() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  useEffect(() => {
    if (gameState.currentPlayer === "O" && !gameState.winner) {
      const timer = setTimeout(computerMove, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState.winner) {
      if (gameState.winner === "X") {
        toast.success("شما برنده شدید!");
      } else if (gameState.winner === "O") {
        toast.error("شما باختید!");
      } else {
        toast("بازی مساوی شد!");
      }
    }
  }, [gameState.winner]);

  const checkWinner = (board: Player[]): Player | "draw" | null => {
    for (let combo of winningCombinations) {
      if (
        board[combo[0]] &&
        board[combo[0]] === board[combo[1]] &&
        board[combo[0]] === board[combo[2]]
      ) {
        return board[combo[0]];
      }
    }
    return board.every((cell) => cell !== null) ? "draw" : null;
  };

  const handleCellClick = (index: number) => {
    if (
      gameState.board[index] ||
      gameState.winner ||
      gameState.currentPlayer !== "X"
    )
      return;

    const newBoard = [...gameState.board];
    newBoard[index] = "X";
    const winner = checkWinner(newBoard);

    setGameState({
      board: newBoard,
      currentPlayer: "O",
      winner,
    });
  };

  const computerMove = () => {
    const emptyCells = gameState.board.reduce(
      (acc: number[], cell, index) => (cell === null ? [...acc, index] : acc),
      []
    );

    if (emptyCells.length > 0) {
      const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newBoard = [...gameState.board];
      newBoard[randomIndex] = "O";
      const winner = checkWinner(newBoard);

      setGameState({
        board: newBoard,
        currentPlayer: "X",
        winner,
      });
    }
  };

  const resetGame = () => {
    setGameState(initialState);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-screen">
      <h1 className="text-4xl font-bold mb-8">بازی نقطه خط</h1>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {gameState.board.map((cell, index) => (
          <Button
            key={index}
            onClick={() => handleCellClick(index)}
            className="w-20 h-20 text-3xl font-bold"
            variant={cell ? "default" : "outline"}
            disabled={
              !!cell || !!gameState.winner || gameState.currentPlayer !== "X"
            }
          >
            {cell}
          </Button>
        ))}
      </div>
      <Button onClick={resetGame} className="mt-4">
        شروع مجدد
      </Button>
      <Toaster position="top-center" />
    </div>
  );
}
