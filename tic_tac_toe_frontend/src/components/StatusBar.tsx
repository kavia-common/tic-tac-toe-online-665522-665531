import React from 'react';

// PUBLIC_INTERFACE
export default function StatusBar({ currentPlayer, winner, isDraw }: { currentPlayer: 'X'|'O', winner: 'X'|'O'|null, isDraw: boolean }) {
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
