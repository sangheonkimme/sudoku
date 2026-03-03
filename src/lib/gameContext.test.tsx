import { render, screen, waitFor } from '@testing-library/react';
import {
  GameProvider,
  gameReducer,
  initialState,
  useGame,
  type GameState,
} from '@/lib/gameContext';
import type { Board } from '@/lib/sudoku';

jest.mock('@/lib/sudoku', () => {
  const actual = jest.requireActual('@/lib/sudoku');
  return {
    ...actual,
    generatePuzzle: jest.fn(),
  };
});

const { generatePuzzle } = jest.requireMock('@/lib/sudoku') as {
  generatePuzzle: jest.Mock;
};

const SOLVED_BOARD: Board = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

const PUZZLE_BOARD: Board = SOLVED_BOARD.map((row) => [...row]);
PUZZLE_BOARD[0][0] = 0;
PUZZLE_BOARD[0][1] = 0;

function makeBoard(value: number): number[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(value));
}

type SerializedGameState = Omit<GameState, 'notes'> & { notes: number[][][] };

function createSerializedState(overrides: Partial<SerializedGameState> = {}): SerializedGameState {
  const notes = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => [] as number[])
  );
  notes[0][0] = [1, 2];

  return {
    status: 'playing',
    difficulty: 'hard',
    puzzle: makeBoard(0),
    board: makeBoard(0),
    solution: makeBoard(1),
    notes,
    selectedCell: [0, 0],
    timer: 123,
    hintsUsed: 1,
    maxHints: 3,
    history: [],
    noteMode: false,
    showErrors: true,
    highlightSame: true,
    ...overrides,
  };
}

function StateProbe() {
  const { state } = useGame();
  const firstNote = state.notes?.[0]?.[0];
  const notesType = firstNote instanceof Set ? 'set' : 'other';

  return (
    <div>
      <p data-testid="status">{state.status}</p>
      <p data-testid="difficulty">{state.difficulty ?? 'none'}</p>
      <p data-testid="timer">{state.timer}</p>
      <p data-testid="notes-type">{notesType}</p>
    </div>
  );
}

describe('GameProvider localStorage hydration', () => {
  beforeEach(() => {
    localStorage.clear();
    generatePuzzle.mockReset();
    generatePuzzle.mockReturnValue({
      puzzle: PUZZLE_BOARD.map((row) => [...row]),
      solution: SOLVED_BOARD.map((row) => [...row]),
    });
  });

  test('restores an in-progress game from localStorage on mount', async () => {
    localStorage.setItem('sudoku-game', JSON.stringify(createSerializedState()));

    render(
      <GameProvider>
        <StateProbe />
      </GameProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('playing')
    );

    expect(screen.getByTestId('difficulty')).toHaveTextContent('hard');
    expect(screen.getByTestId('timer')).toHaveTextContent('123');
    expect(screen.getByTestId('notes-type')).toHaveTextContent('set');
  });

  test('does not delete saved game during hydration', async () => {
    localStorage.setItem('sudoku-game', JSON.stringify(createSerializedState()));

    render(
      <GameProvider>
        <StateProbe />
      </GameProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('playing')
    );

    const persisted = localStorage.getItem('sudoku-game');
    expect(persisted).not.toBeNull();
    expect(JSON.parse(persisted as string).status).toBe('playing');
  });

  test('handles new game, input, and undo transitions', () => {
    const started = gameReducer(initialState, { type: 'NEW_GAME', difficulty: 'easy' });

    expect(started.status).toBe('playing');
    expect(started.puzzle?.[0][0]).toBe(0);
    expect(started.board?.[0][0]).toBe(0);

    const selected = gameReducer(started, { type: 'SELECT_CELL', row: 0, col: 0 });
    const withInput = gameReducer(selected, { type: 'INPUT_NUMBER', num: 5 });

    expect(withInput.board?.[0][0]).toBe(5);
    expect(withInput.history).toHaveLength(1);

    const undone = gameReducer(withInput, { type: 'UNDO' });
    expect(undone.board?.[0][0]).toBe(0);
    expect(undone.history).toHaveLength(0);
  });

  test('completes puzzle when final correct value is entered', () => {
    const started = gameReducer(initialState, { type: 'NEW_GAME', difficulty: 'easy' });
    const selected = gameReducer(started, { type: 'SELECT_CELL', row: 0, col: 0 });
    const afterFirst = gameReducer(selected, { type: 'INPUT_NUMBER', num: 5 });
    const selectedSecond = gameReducer(afterFirst, { type: 'SELECT_CELL', row: 0, col: 1 });
    const completed = gameReducer(selectedSecond, { type: 'INPUT_NUMBER', num: 3 });

    expect(completed.status).toBe('completed');
    expect(completed.board?.[0][0]).toBe(5);
    expect(completed.board?.[0][1]).toBe(3);
  });
});
