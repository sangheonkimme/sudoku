import { render, screen, waitFor } from '@testing-library/react';
import { GameProvider, useGame, type GameState } from '@/lib/gameContext';

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
});
