import React from 'react';

type Props = {
  index: number;
  value: 'X'|'O'|null;
  onClick: () => void;
  isWinning?: boolean;
};

// PUBLIC_INTERFACE
export default function Cell({ index, value, onClick, isWinning }: Props) {
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
