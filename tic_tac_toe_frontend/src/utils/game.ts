//
// Utility helpers for Tic Tac Toe logic (TypeScript flavored for future migration).
// These are duplicated in App.js for immediate use; this module is provided for clarity and potential reuse.
//

// PUBLIC_INTERFACE
export function calculateWinner(cells: Array<'X' | 'O' | null>) {
  /** Determine winner and winning line indices if present.
   * Returns: { winner: 'X'|'O'|null, line: number[]|null }
   */
  const lines: number[][] = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { winner: cells[a], line: [a,b,c] as number[] };
    }
  }
  return { winner: null as const, line: null as const };
}

// PUBLIC_INTERFACE
export function getBestAIMove(
  cells: Array<'X'|'O'|null>,
  aiMark: 'X'|'O',
  humanMark: 'X'|'O'
): number | null {
  const empty = cells.map((v, i) => (v ? null : i)).filter((v): v is number => v !== null);
  const current = calculateWinner(cells);
  if (current.winner || empty.length === 0) return null;

  // Try win
  for (const i of empty) {
    const clone = [...cells];
    clone[i] = aiMark;
    if (calculateWinner(clone).winner === aiMark) return i;
  }
  // Block
  for (const i of empty) {
    const clone = [...cells];
    clone[i] = humanMark;
    if (calculateWinner(clone).winner === humanMark) return i;
  }
  // Center
  if (empty.includes(4)) return 4;
  // Corner
  const corners = [0,2,6,8].filter(i => empty.includes(i));
  if (corners.length) return corners[0];
  // Sides
  const sides = [1,3,5,7].filter(i => empty.includes(i));
  return sides.length ? sides[0] : null;
}
