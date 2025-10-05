import React from 'react';

type Props = {
  onNewGame: () => void;
  onToggleMode: () => void;
  mode: 'ai'|'pvp';
  onUndo: () => void;
  canUndo: boolean;
};

// PUBLIC_INTERFACE
export default function Controls({ onNewGame, onToggleMode, mode, onUndo, canUndo }: Props) {
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
