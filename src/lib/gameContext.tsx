'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { generatePuzzle, isBoardCorrect, isBoardComplete, getConflicts, type Board, type Difficulty } from '@/lib/sudoku';

// Types
export interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'completed';
  difficulty: Difficulty | null;
  puzzle: Board | null;         // Original puzzle (fixed cells)
  board: Board | null;          // Current board state
  solution: Board | null;
  notes: Set<number>[][];     // 9x9 array of Sets for memo
  selectedCell: [number, number] | null;
  timer: number;                // seconds
  hintsUsed: number;
  maxHints: number;
  history: { row: number; col: number; prevValue: number; prevNotes: number[] }[];
  noteMode: boolean;
  showErrors: boolean;
  highlightSame: boolean;
}

export type GameAction =
  | { type: 'NEW_GAME'; difficulty: Difficulty }
  | { type: 'SELECT_CELL'; row: number; col: number }
  | { type: 'INPUT_NUMBER'; num: number }
  | { type: 'ERASE' }
  | { type: 'UNDO' }
  | { type: 'HINT' }
  | { type: 'TOGGLE_NOTES' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'TICK' }
  | { type: 'SET_SHOW_ERRORS'; value: boolean }
  | { type: 'SET_HIGHLIGHT_SAME'; value: boolean }
  | { type: 'LOAD_STATE'; state: GameState }
  | { type: 'GO_HOME' };

function createNotes(): Set<number>[][] {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
}

export const initialState: GameState = {
  status: 'idle',
  difficulty: null,
  puzzle: null,
  board: null,
  solution: null,
  notes: createNotes(),
  selectedCell: null,
  timer: 0,
  hintsUsed: 0,
  maxHints: 3,
  history: [],
  noteMode: false,
  showErrors: true,
  highlightSame: true,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_GAME': {
      const { puzzle, solution } = generatePuzzle(action.difficulty);
      return {
        ...initialState,
        status: 'playing',
        difficulty: action.difficulty,
        puzzle: puzzle.map(r => [...r]),
        board: puzzle.map(r => [...r]),
        solution,
        notes: createNotes(),
        showErrors: state.showErrors,
        highlightSame: state.highlightSame,
      };
    }
    case 'SELECT_CELL':
      return { ...state, selectedCell: [action.row, action.col] };

    case 'INPUT_NUMBER': {
      if (!state.board || !state.puzzle || !state.selectedCell || state.status !== 'playing') return state;
      const [row, col] = state.selectedCell;
      if (state.puzzle[row][col] !== 0) return state; // fixed cell

      if (state.noteMode) {
        const newNotes = state.notes.map(r => r.map(s => new Set(s)));
        const set = newNotes[row][col];
        if (set.has(action.num)) set.delete(action.num);
        else set.add(action.num);
        return { ...state, notes: newNotes };
      }

      const prevValue = state.board[row][col];
      const prevNotes = Array.from(state.notes[row]?.[col] || []);
      const newBoard = state.board.map(r => [...r]);
      newBoard[row][col] = action.num;

      const newNotes2 = state.notes.map(r => r.map(s => new Set(s)));
      newNotes2[row][col] = new Set();

      const newState: GameState = {
        ...state,
        board: newBoard,
        notes: newNotes2,
        history: [...state.history, { row, col, prevValue, prevNotes }],
      };

      if (isBoardComplete(newBoard) && state.solution && isBoardCorrect(newBoard, state.solution)) {
        return { ...newState, status: 'completed' };
      }
      return newState;
    }

    case 'ERASE': {
      if (!state.board || !state.puzzle || !state.selectedCell || state.status !== 'playing') return state;
      const [row, col] = state.selectedCell;
      if (state.puzzle[row][col] !== 0) return state;

      const prevValue = state.board[row][col];
      const prevNotes = Array.from(state.notes[row]?.[col] || []);
      const newBoard = state.board.map(r => [...r]);
      newBoard[row][col] = 0;

      const newNotes = state.notes.map(r => r.map(s => new Set(s)));
      newNotes[row][col] = new Set();

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        history: [...state.history, { row, col, prevValue, prevNotes }],
      };
    }

    case 'UNDO': {
      if (!state.board || state.history.length === 0 || state.status !== 'playing') return state;
      const last = state.history[state.history.length - 1];
      const newBoard = state.board.map(r => [...r]);
      newBoard[last.row][last.col] = last.prevValue;

      const newNotes = state.notes.map(r => r.map(s => new Set(s)));
      newNotes[last.row][last.col] = new Set(last.prevNotes);

      return {
        ...state,
        board: newBoard,
        notes: newNotes,
        history: state.history.slice(0, -1),
      };
    }

    case 'HINT': {
      if (!state.board || !state.solution || !state.puzzle || state.status !== 'playing') return state;
      if (state.hintsUsed >= state.maxHints) return state;

      // Find an empty or wrong cell
      const emptyCells: [number, number][] = [];
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (state.puzzle[r][c] === 0 && state.board[r][c] !== state.solution[r][c]) {
            emptyCells.push([r, c]);
          }
        }
      }
      if (emptyCells.length === 0) return state;

      // Prefer selected cell, otherwise random
      let targetCell: [number, number];
      if (state.selectedCell &&
          state.puzzle[state.selectedCell[0]][state.selectedCell[1]] === 0 &&
          state.board[state.selectedCell[0]][state.selectedCell[1]] !== state.solution[state.selectedCell[0]][state.selectedCell[1]]) {
        targetCell = state.selectedCell;
      } else {
        targetCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }

      const [r, c] = targetCell;
      const newBoard = state.board.map(row => [...row]);
      newBoard[r][c] = state.solution[r][c];

      const newNotes = state.notes.map(row => row.map(s => new Set(s)));
      newNotes[r][c] = new Set();

      const newState: GameState = {
        ...state,
        board: newBoard,
        notes: newNotes,
        hintsUsed: state.hintsUsed + 1,
        selectedCell: targetCell,
        history: [...state.history, { row: r, col: c, prevValue: state.board[r][c], prevNotes: Array.from(state.notes[r][c]) }],
      };

      if (isBoardComplete(newBoard) && isBoardCorrect(newBoard, state.solution)) {
        return { ...newState, status: 'completed' };
      }
      return newState;
    }

    case 'TOGGLE_NOTES':
      return { ...state, noteMode: !state.noteMode };

    case 'TOGGLE_PAUSE':
      if (state.status === 'playing') return { ...state, status: 'paused' };
      if (state.status === 'paused') return { ...state, status: 'playing' };
      return state;

    case 'TICK':
      if (state.status !== 'playing') return state;
      return { ...state, timer: state.timer + 1 };

    case 'SET_SHOW_ERRORS':
      return { ...state, showErrors: action.value };

    case 'SET_HIGHLIGHT_SAME':
      return { ...state, highlightSame: action.value };

    case 'GO_HOME':
      return { ...initialState, showErrors: state.showErrors, highlightSame: state.highlightSame };

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  getConflictsForCell: (row: number, col: number) => [number, number][];
  formatTime: (seconds: number) => string;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const storageHydratedRef = useRef(false);

  // Timer
  useEffect(() => {
    if (state.status !== 'playing') return;
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(interval);
  }, [state.status]);

  // Save state to localStorage
  useEffect(() => {
    if (!storageHydratedRef.current) return;

    if (state.status === 'idle') {
      try { localStorage.removeItem('sudoku-game'); } catch {}
      return;
    }
    try {
      const serializable = {
        ...state,
        notes: state.notes && Array.isArray(state.notes)
          ? state.notes.map(r =>
              Array.isArray(r) ? r.map(s => Array.from(s instanceof Set ? s : [])) : []
            )
          : [],
      };
      localStorage.setItem('sudoku-game', JSON.stringify(serializable));
    } catch {}
  }, [state]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sudoku-game');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.status && parsed.status !== 'idle') {
          parsed.notes = parsed.notes?.map((r: number[][]) =>
            r.map((s: number[]) => new Set(s))
          ) || createNotes();
          dispatch({ type: 'LOAD_STATE', state: parsed });
        }
      }
    } catch {}
    storageHydratedRef.current = true;
  }, []);

  const getConflictsForCell = useCallback((row: number, col: number): [number, number][] => {
    if (!state.board || state.board[row][col] === 0) return [];
    return getConflicts(state.board, row, col, state.board[row][col]);
  }, [state.board]);

  const formatTime = useCallback((seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch, getConflictsForCell, formatTime }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
