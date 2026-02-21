import { fireEvent, render, screen } from '@testing-library/react';
import Board from '@/components/Board';
import { getMessages } from '@/lib/i18n';
import { useGame } from '@/lib/gameContext';
import { useI18n } from '@/lib/i18nContext';
import type { GameState } from '@/lib/gameContext';

jest.mock('@/lib/gameContext', () => ({
  useGame: jest.fn(),
}));

jest.mock('@/lib/i18nContext', () => ({
  useI18n: jest.fn(),
}));

const useGameMock = useGame as jest.MockedFunction<typeof useGame>;
const useI18nMock = useI18n as jest.MockedFunction<typeof useI18n>;

function createNotes() {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
}

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    status: 'playing',
    difficulty: 'easy',
    puzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
    board: Array.from({ length: 9 }, () => Array(9).fill(0)),
    solution: Array.from({ length: 9 }, () => Array(9).fill(1)),
    notes: createNotes(),
    selectedCell: [0, 0],
    timer: 0,
    hintsUsed: 0,
    maxHints: 3,
    history: [],
    noteMode: false,
    showErrors: true,
    highlightSame: true,
    ...overrides,
  };
}

describe('Board component', () => {
  const dispatch = jest.fn();
  const getConflictsForCell = jest.fn(() => []);

  beforeEach(() => {
    jest.clearAllMocks();
    useI18nMock.mockReturnValue({
      locale: 'en',
      messages: getMessages('en'),
    });
  });

  test('renders 9x9 grid cells', () => {
    useGameMock.mockReturnValue({
      state: createState(),
      dispatch,
      getConflictsForCell,
      formatTime: jest.fn(),
    });

    render(<Board />);

    expect(screen.getByRole('grid', { name: 'Sudoku game board' })).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell')).toHaveLength(81);
  });

  test('dispatches cell selection on click', () => {
    useGameMock.mockReturnValue({
      state: createState(),
      dispatch,
      getConflictsForCell,
      formatTime: jest.fn(),
    });

    render(<Board />);

    fireEvent.click(screen.getByRole('gridcell', { name: /Row 1, Column 2/ }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'SELECT_CELL', row: 0, col: 1 });
  });

  test('dispatches number input on keyboard', () => {
    useGameMock.mockReturnValue({
      state: createState(),
      dispatch,
      getConflictsForCell,
      formatTime: jest.fn(),
    });

    render(<Board />);

    fireEvent.keyDown(window, { key: '7' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'INPUT_NUMBER', num: 7 });
  });

  test('renders nothing when board data is missing', () => {
    useGameMock.mockReturnValue({
      state: createState({ board: null, puzzle: null }),
      dispatch,
      getConflictsForCell,
      formatTime: jest.fn(),
    });

    render(<Board />);

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
  });
});

