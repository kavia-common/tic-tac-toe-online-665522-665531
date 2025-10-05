import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.css';

/**
 * Utilities: winner detection and AI
 */

// PUBLIC_INTERFACE
export function calculateWinner(cells) {
  /** Determine winner and winning line indices if present.
   * Returns: { winner: 'X'|'O'|null, line: number[]|null }
   * We iterate over the set of all winning combinations.
   */
  // All possible winning triplets
  const WIN_LINES = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6],          // diags
  ];
  for (let i = 0; i < WIN_LINES.length; i += 1) {
    const [a, b, c] = WIN_LINES[i];
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
export function getBestAIMove(cells, aiMark, humanMark) {
  /** Simple AI:
   * 1) Win if possible
   * 2) Block opponent immediate win
   * 3) Take center
   * 4) Take a corner
   * 5) Take a side
   */
  const empty = cells.map((v, i) => (v ? null : i)).filter(v => v !== null);
  const { winner: _w } = calculateWinner(cells);
  if (_w || empty.length === 0) return null;

  // Note: Explicit win lines aren't needed here; calculateWinner handles checks

  // 1) Try to win
  for (const i of empty) {
    const clone = [...cells];
    clone[i] = aiMark;
    if (calculateWinner(clone).winner === aiMark) return i;
  }
  // 2) Block human
  for (const i of empty) {
    const clone = [...cells];
    clone[i] = humanMark;
    if (calculateWinner(clone).winner === humanMark) return i;
  }
  // 3) Center
  if (empty.includes(4)) return 4;
  // 4) Corner
  const corners = [0,2,6,8].filter(i => empty.includes(i));
  if (corners.length) return corners[0];
  // 5) Side
  const sides = [1,3,5,7].filter(i => empty.includes(i));
  return sides.length ? sides[0] : null;
}

/**
 * Cell Component
 */
// PUBLIC_INTERFACE
function Cell({ index, value, onClick, isWinning }) {
  /** A single board cell as an accessible button */
  const markClass = value === 'X' ? 'cellX' : value === 'O' ? 'cellO' : '';
  return (
    <button
      type="button"
      className={`cellBtn ${markClass} ${isWinning ? 'winHighlight' : ''}`}
      role="gridcell"
      aria-label={`Cell ${index + 1}${value ? ` contains ${value}` : ''}`}
      onClick={onClick}
      disabled={!!value}
    >
      <span className="cellContent" aria-hidden="true">{value || ''}</span>
      <span className="sr-only">{value ? value : 'Empty'}</span>
    </button>
  );
}

/**
 * GameBoard Component
 */
// PUBLIC_INTERFACE
function GameBoard({ cells, onCellClick, winningLine }) {
  /** 3x3 grid board, keyboard-accessible via tab navigation */
  return (
    <div className="boardWrap">
      <div
        className="board"
        role="grid"
        aria-label="Tic Tac Toe Board"
        aria-rowcount={3}
        aria-colcount={3}
      >
        {cells.map((val, idx) => (
          <Cell
            key={idx}
            index={idx}
            value={val}
            onClick={() => onCellClick(idx)}
            isWinning={!!(winningLine && winningLine.includes(idx))}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * StatusBar Component
 */
// PUBLIC_INTERFACE
function StatusBar({ currentPlayer, winner, isDraw }) {
  /** Shows whose turn, or winner/draw status with themed markers */
  const content = winner
    ? (
      <>
        <span className={winner === 'X' ? 'markerX' : 'markerO'} aria-hidden="true">
          {winner}
        </span>
        <span>Winner: {winner}</span>
      </>
    )
    : isDraw
      ? (<span>It&apos;s a draw!</span>)
      : (
        <>
          <span className={currentPlayer === 'X' ? 'markerX' : 'markerO'} aria-hidden="true">
            {currentPlayer}
          </span>
          <span>Turn: {currentPlayer}</span>
        </>
      );

  return (
    <div className="statusBar" role="status" aria-live="polite">
      <div className="statusPill">
        {content}
      </div>
    </div>
  );
}

/**
 * Controls Component
 */
// PUBLIC_INTERFACE
function Controls({ onNewGame, onToggleMode, mode, onUndo, canUndo }) {
  /** Buttons for new game, toggle mode, and optional undo */
  return (
    <div className="controls">
      <button className="btn btnPrimary" onClick={onNewGame}>
        New Game
      </button>
      <button className="btn btnSecondary" onClick={onToggleMode} aria-pressed={mode === 'ai'}>
        Mode: {mode === 'ai' ? 'AI' : 'PvP'}
      </button>
      <button className="btn btnGhost" onClick={onUndo} disabled={!canUndo} aria-disabled={!canUndo}>
        Undo
      </button>
    </div>
  );
}

/**
 * Root Game Component
 */
// PUBLIC_INTERFACE
function App() {
  /** Main game container handling state and interactions. */
  const [cells, setCells] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X'); // X goes first
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('ttt_mode');
    return saved === 'ai' || saved === 'pvp' ? saved : 'ai';
  });
  const [history, setHistory] = useState([]);
  const aiMark = 'O';
  const humanMark = 'X';
  const thinkingRef = useRef(false);

  const { winner, line } = useMemo(() => calculateWinner(cells), [cells]);
  const isDraw = useMemo(() => !winner && cells.every(Boolean), [winner, cells]);

  // Persist mode
  useEffect(() => {
    localStorage.setItem('ttt_mode', mode);
  }, [mode]);

  // Trigger AI move when in AI mode and it's AI's turn
  useEffect(() => {
    if (mode !== 'ai') return;
    if (winner || isDraw) return;
    if (currentPlayer !== aiMark) return;
    if (thinkingRef.current) return;

    thinkingRef.current = true;
    const timer = setTimeout(() => {
      const move = getBestAIMove(cells, aiMark, humanMark);
      if (move !== null) {
        setHistory(h => [...h, cells]);
        setCells(prev => {
          const next = [...prev];
          next[move] = aiMark;
          return next;
        });
        setCurrentPlayer(humanMark);
      }
      thinkingRef.current = false;
    }, 350); // small delay for UX

    return () => clearTimeout(timer);
  }, [mode, currentPlayer, cells, winner, isDraw]);

  const handleCellClick = (idx) => {
    if (winner || isDraw) return;
    if (cells[idx]) return;

    if (mode === 'ai') {
      // Human is always X here
      if (currentPlayer !== humanMark) return;
      setHistory(h => [...h, cells]);
      setCells(prev => {
        const next = [...prev];
        next[idx] = humanMark;
        return next;
      });
      setCurrentPlayer(aiMark);
    } else {
      // PvP alternating
      setHistory(h => [...h, cells]);
      setCells(prev => {
        const next = [...prev];
        next[idx] = currentPlayer;
        return next;
      });
      setCurrentPlayer(prev => (prev === 'X' ? 'O' : 'X'));
    }
  };

  const handleNewGame = () => {
    setCells(Array(9).fill(null));
    setCurrentPlayer('X');
    setHistory([]);
  };

  const handleToggleMode = () => {
    setMode(m => (m === 'ai' ? 'pvp' : 'ai'));
    // Reset game on mode change to keep logic simple
    handleNewGame();
  };

  const handleUndo = () => {
    if (!history.length) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCells(prev);
    // Recompute current player based on move count
    const moves = prev.filter(Boolean).length;
    setCurrentPlayer(moves % 2 === 0 ? 'X' : 'O');
  };

  const canUndo = history.length > 0;

  return (
    <div className="app">
      <main className="card" aria-label="Tic Tac Toe Game">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">Violet Dreams — Play {mode === 'ai' ? 'vs AI' : 'with a friend'}</p>
        </header>

        <StatusBar currentPlayer={currentPlayer} winner={winner} isDraw={isDraw} />
        <GameBoard cells={cells} onCellClick={handleCellClick} winningLine={line} />
        <Controls
          onNewGame={handleNewGame}
          onToggleMode={handleToggleMode}
          mode={mode}
          onUndo={handleUndo}
          canUndo={canUndo}
        />
      </main>
    </div>
  );
}

export default App;
