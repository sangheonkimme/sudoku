import {
  generatePuzzle,
  getConflicts,
  isBoardComplete,
  isBoardCorrect,
  isValidPlacement,
  type Board,
} from '@/lib/sudoku';

function makeBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

describe('sudoku utilities', () => {
  test('generatePuzzle returns 9x9 puzzle and solution', () => {
    const { puzzle, solution } = generatePuzzle('easy');

    expect(puzzle).toHaveLength(9);
    expect(solution).toHaveLength(9);
    expect(puzzle.every((row) => row.length === 9)).toBe(true);
    expect(solution.every((row) => row.length === 9)).toBe(true);

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        expect(solution[r][c]).toBeGreaterThanOrEqual(1);
        expect(solution[r][c]).toBeLessThanOrEqual(9);
        if (puzzle[r][c] !== 0) {
          expect(puzzle[r][c]).toBe(solution[r][c]);
        }
      }
    }
  });

  test('checks board completion and correctness', () => {
    const incomplete = makeBoard();
    const full = Array.from({ length: 9 }, () => Array(9).fill(1));

    expect(isBoardComplete(incomplete)).toBe(false);
    expect(isBoardComplete(full)).toBe(true);
    expect(isBoardCorrect(full, full)).toBe(true);

    const different = full.map((row) => [...row]);
    different[0][0] = 2;
    expect(isBoardCorrect(full, different)).toBe(false);
  });

  test('validates placement by row, column, and box rules', () => {
    const board = makeBoard();
    board[0][1] = 7;
    board[2][0] = 8;
    board[1][1] = 9;

    expect(isValidPlacement(board, 0, 0, 7)).toBe(false);
    expect(isValidPlacement(board, 0, 0, 8)).toBe(false);
    expect(isValidPlacement(board, 0, 0, 9)).toBe(false);
    expect(isValidPlacement(board, 0, 0, 4)).toBe(true);
  });

  test('returns unique conflict coordinates', () => {
    const board = makeBoard();
    board[0][0] = 5;
    board[0][3] = 5;
    board[3][0] = 5;
    board[1][1] = 5;

    const conflicts = getConflicts(board, 0, 0, 5);

    expect(conflicts).toEqual(
      expect.arrayContaining([
        [0, 3],
        [3, 0],
        [1, 1],
      ])
    );
    expect(new Set(conflicts.map(([r, c]) => `${r}-${c}`)).size).toBe(conflicts.length);
  });
});

