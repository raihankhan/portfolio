"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BackToArcadeButton, RestartButton } from "@/components/game-console/game-ui"

type Player = "X" | "O" | null
type Board = Player[]

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export default function TicTacToePage() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState<Player>(null)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [isDraw, setIsDraw] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [isAIEnabled, setIsAIEnabled] = useState(true)

  const checkWinner = useCallback((squares: Board): { winner: Player; line: number[] | null } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combination }
      }
    }
    return { winner: null, line: null }
  }, [])

  const minimax = useCallback(
    (squares: Board, depth: number, isMaximizing: boolean): number => {
      const { winner } = checkWinner(squares)
      if (winner === "O") return 10 - depth
      if (winner === "X") return depth - 10
      if (squares.every((cell) => cell !== null)) return 0

      if (isMaximizing) {
        let bestScore = Number.NEGATIVE_INFINITY
        for (let i = 0; i < 9; i++) {
          if (squares[i] === null) {
            squares[i] = "O"
            const score = minimax(squares, depth + 1, false)
            squares[i] = null
            bestScore = Math.max(score, bestScore)
          }
        }
        return bestScore
      } else {
        let bestScore = Number.POSITIVE_INFINITY
        for (let i = 0; i < 9; i++) {
          if (squares[i] === null) {
            squares[i] = "X"
            const score = minimax(squares, depth + 1, true)
            squares[i] = null
            bestScore = Math.min(score, bestScore)
          }
        }
        return bestScore
      }
    },
    [checkWinner],
  )

  const getBestMove = useCallback(
    (squares: Board): number => {
      let bestScore = Number.NEGATIVE_INFINITY
      let bestMove = 0

      for (let i = 0; i < 9; i++) {
        if (squares[i] === null) {
          squares[i] = "O"
          const score = minimax(squares, 0, false)
          squares[i] = null
          if (score > bestScore) {
            bestScore = score
            bestMove = i
          }
        }
      }

      return bestMove
    },
    [minimax],
  )

  const handleClick = useCallback(
    (index: number) => {
      if (board[index] || winner || isDraw) return
      if (isAIEnabled && !isXNext) return

      const newBoard = [...board]
      newBoard[index] = isXNext ? "X" : "O"
      setBoard(newBoard)

      const { winner: newWinner, line } = checkWinner(newBoard)
      if (newWinner) {
        setWinner(newWinner)
        setWinningLine(line)
        setScores((prev) => ({ ...prev, [newWinner]: prev[newWinner] + 1 }))
        return
      }

      if (newBoard.every((cell) => cell !== null)) {
        setIsDraw(true)
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }))
        return
      }

      setIsXNext(!isXNext)

      // AI move
      if (isAIEnabled && isXNext) {
        setTimeout(() => {
          const aiMove = getBestMove(newBoard)
          const aiBoard = [...newBoard]
          aiBoard[aiMove] = "O"
          setBoard(aiBoard)

          const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard)
          if (aiWinner) {
            setWinner(aiWinner)
            setWinningLine(aiLine)
            setScores((prev) => ({ ...prev, [aiWinner]: prev[aiWinner] + 1 }))
            return
          }

          if (aiBoard.every((cell) => cell !== null)) {
            setIsDraw(true)
            setScores((prev) => ({ ...prev, draws: prev.draws + 1 }))
            return
          }

          setIsXNext(true)
        }, 400)
      }
    },
    [board, winner, isDraw, isXNext, isAIEnabled, checkWinner, getBestMove],
  )

  const restartGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setWinningLine(null)
    setIsDraw(false)
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
    restartGame()
  }

  return (
    <div className="relative min-h-screen px-6 py-24">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <BackToArcadeButton />
          <motion.button
            onClick={() => setIsAIEnabled(!isAIEnabled)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isAIEnabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            AI: {isAIEnabled ? "ON" : "OFF"}
          </motion.button>
        </div>

        {/* Scoreboard */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid grid-cols-3 gap-4"
        >
          <div className="rounded-xl border border-border/50 bg-card/60 p-4 text-center backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">Player (X)</p>
            <p className="text-2xl font-bold text-primary">{scores.X}</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/60 p-4 text-center backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">Draws</p>
            <p className="text-2xl font-bold text-muted-foreground">{scores.draws}</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card/60 p-4 text-center backdrop-blur-xl">
            <p className="text-xs text-muted-foreground">{isAIEnabled ? "AI" : "Player"} (O)</p>
            <p className="text-2xl font-bold text-secondary">{scores.O}</p>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
          {winner ? (
            <p className="text-lg font-semibold text-foreground">
              {winner === "X" ? "You win!" : isAIEnabled ? "AI wins!" : "O wins!"}
            </p>
          ) : isDraw ? (
            <p className="text-lg font-semibold text-muted-foreground">It's a draw!</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isXNext ? "Your turn (X)" : isAIEnabled ? "AI thinking..." : "O's turn"}
            </p>
          )}
        </motion.div>

        {/* Game Board */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto mb-8 grid w-fit grid-cols-3 gap-3 rounded-2xl border border-border/50 bg-card/40 p-4 backdrop-blur-xl"
        >
          {board.map((cell, index) => (
            <motion.button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!cell || !!winner || isDraw || (isAIEnabled && !isXNext)}
              className={`relative flex h-24 w-24 items-center justify-center rounded-xl border transition-colors ${
                winningLine?.includes(index)
                  ? "border-primary bg-primary/20"
                  : "border-border/50 bg-card/60 hover:bg-card"
              } ${!cell && !winner && !isDraw && (isXNext || !isAIEnabled) ? "cursor-pointer" : "cursor-default"}`}
              whileHover={!cell && !winner && !isDraw ? { scale: 1.05 } : {}}
              whileTap={!cell && !winner && !isDraw ? { scale: 0.95 } : {}}
            >
              <AnimatePresence mode="wait">
                {cell && (
                  <motion.span
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    className={`text-4xl font-bold ${cell === "X" ? "text-primary" : "text-secondary"}`}
                  >
                    {cell}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          ))}

          {/* Winning line animation */}
          {winningLine && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="pointer-events-none absolute inset-0"
            >
              <svg className="h-full w-full" viewBox="0 0 300 300">
                <motion.line
                  x1={getLineCoords(winningLine).x1}
                  y1={getLineCoords(winningLine).y1}
                  x2={getLineCoords(winningLine).x2}
                  y2={getLineCoords(winningLine).y2}
                  stroke="var(--primary)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <RestartButton onRestart={restartGame} label="New Game" />
          <motion.button
            onClick={resetScores}
            className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-4 py-2 text-sm text-muted-foreground backdrop-blur-xl transition-colors hover:bg-card hover:text-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Scores
          </motion.button>
        </div>
      </div>
    </div>
  )
}

function getLineCoords(line: number[]): { x1: number; y1: number; x2: number; y2: number } {
  const cellSize = 96
  const gap = 12
  const padding = 16
  const offset = cellSize / 2

  const getCenter = (index: number) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    return {
      x: padding + col * (cellSize + gap) + offset,
      y: padding + row * (cellSize + gap) + offset,
    }
  }

  const start = getCenter(line[0])
  const end = getCenter(line[2])

  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y }
}
