// Sudoku puzzle generator using Backtracking algorithm
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Board = number[][];

export const GRID_SIZE = 9;
export const BOX_SIZE = 3;

function createEmptyBoard(): Board {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function isValid(board: Board, row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && board[row][c] === num) return false;
  }
  // Check column
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && board[r][col] === num) return false;
  }
  // Check 3x3 box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function fillBoard(board: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 0) {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function countSolutions(board: Board, limit: number = 2): number {
  let count = 0;

  function solve(): boolean {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) {
                if (count >= limit) {
                  board[row][col] = 0;
                  return true;
                }
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    count++;
    return count >= limit;
  }

  solve();
  return count;
}

function getCellsToRemove(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 30 + Math.floor(Math.random() * 6);     // 30-35
    case 'medium': return 36 + Math.floor(Math.random() * 10);  // 36-45
    case 'hard': return 46 + Math.floor(Math.random() * 7);     // 46-52
    case 'expert': return 53 + Math.floor(Math.random() * 6);   // 53-58
  }
}

export function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const solution = createEmptyBoard();
  fillBoard(solution);

  const puzzle = solution.map(row => [...row]);
  const cellsToRemove = getCellsToRemove(difficulty);

  const positions = shuffle(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  );

  let removed = 0;
  for (const [row, col] of positions) {
    if (removed >= cellsToRemove) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const testBoard = puzzle.map(r => [...r]);
    if (countSolutions(testBoard) === 1) {
      removed++;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return { puzzle, solution };
}

export function isValidPlacement(board: Board, row: number, col: number, num: number): boolean {
  return isValid(board, row, col, num);
}

export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] === 0) return false;
    }
  }
  return true;
}

export function isBoardCorrect(board: Board, solution: Board): boolean {
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (board[row][col] !== solution[row][col]) return false;
    }
  }
  return true;
}

export function getConflicts(board: Board, row: number, col: number, num: number): [number, number][] {
  if (num === 0) return [];
  const conflicts: [number, number][] = [];

  // Check row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (c !== col && board[row][c] === num) conflicts.push([row, c]);
  }
  // Check column
  for (let r = 0; r < GRID_SIZE; r++) {
    if (r !== row && board[r][col] === num) conflicts.push([r, col]);
  }
  // Check box
  const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = boxRow; r < boxRow + BOX_SIZE; r++) {
    for (let c = boxCol; c < boxCol + BOX_SIZE; c++) {
      if (!(r === row && c === col) && board[r][c] === num) {
        if (!conflicts.some(([cr, cc]) => cr === r && cc === c)) {
          conflicts.push([r, c]);
        }
      }
    }
  }
  return conflicts;
}

export const DIFFICULTY_LABELS: Record<Difficulty, { ko: string; en: string; jp: string; color: string; emoji: string }> = {
  easy: { ko: '쉬움', en: 'Easy', jp: '初級', color: '#22c55e', emoji: '🟢' },
  medium: { ko: '보통', en: 'Medium', jp: '中級', color: '#eab308', emoji: '🟡' },
  hard: { ko: '어려움', en: 'Hard', jp: '上級', color: '#ef4444', emoji: '🔴' },
  expert: { ko: '전문가', en: 'Expert', jp: '達人', color: '#0f766e', emoji: '⚫' },
};
