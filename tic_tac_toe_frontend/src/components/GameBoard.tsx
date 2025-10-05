import React from 'react';
import Cell from './Cell';

type Props = {
  cells: Array<'X'|'O'|null>;
  onCellClick: (i: number) => void;
  winningLine: number[] | null;
};

// PUBLIC_INTERFACE
export default function GameBoard({ cells, onCellClick, winningLine }: Props) {
  /** 3x3 grid board, keyboard-accessible */
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
            isWinning={!!winningLine?.includes(idx)}
          />
        ))}
      </div>
    </div>
  );
}
