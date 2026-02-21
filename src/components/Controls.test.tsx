import { fireEvent, render, screen } from '@testing-library/react';
import Controls from '@/components/Controls';
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

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    status: 'playing',
    difficulty: 'easy',
    puzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
    board: Array.from({ length: 9 }, () => Array(9).fill(0)),
    solution: Array.from({ length: 9 }, () => Array(9).fill(1)),
    notes: Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => new Set<number>())
    ),
    selectedCell: [0, 0],
    timer: 75,
    hintsUsed: 1,
    maxHints: 3,
    history: [],
    noteMode: false,
    showErrors: true,
    highlightSame: true,
    ...overrides,
  };
}

describe('Controls component', () => {
  const dispatch = jest.fn();
  const formatTime = jest.fn(() => '01:15');

  beforeEach(() => {
    jest.clearAllMocks();
    useI18nMock.mockReturnValue({
      locale: 'en',
      messages: getMessages('en'),
    });
  });

  test('renders controls in playing state', () => {
    useGameMock.mockReturnValue({
      state: createState(),
      dispatch,
      getConflictsForCell: jest.fn(),
      formatTime,
    });

    render(<Controls />);

    expect(screen.getByLabelText('Number input pad')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
    expect(screen.getByText('01:15')).toBeInTheDocument();
  });

  test('dispatches actions from buttons', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    useGameMock.mockReturnValue({
      state: createState(),
      dispatch,
      getConflictsForCell: jest.fn(),
      formatTime,
    });

    render(<Controls />);

    fireEvent.click(screen.getByLabelText('Go home'));
    fireEvent.click(screen.getByLabelText('Pause'));
    fireEvent.click(screen.getByLabelText('Input number 5'));

    expect(confirmSpy).toHaveBeenCalledWith('Leave the current game?');
    expect(dispatch).toHaveBeenCalledWith({ type: 'GO_HOME' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'TOGGLE_PAUSE' });
    expect(dispatch).toHaveBeenCalledWith({ type: 'INPUT_NUMBER', num: 5 });

    confirmSpy.mockRestore();
  });

  test('disables hint button when no hints are left', () => {
    useGameMock.mockReturnValue({
      state: createState({ hintsUsed: 3, maxHints: 3 }),
      dispatch,
      getConflictsForCell: jest.fn(),
      formatTime,
    });

    render(<Controls />);

    expect(screen.getByLabelText('Use hint')).toBeDisabled();
  });

  test('renders nothing outside playing or paused state', () => {
    useGameMock.mockReturnValue({
      state: createState({ status: 'idle' }),
      dispatch,
      getConflictsForCell: jest.fn(),
      formatTime,
    });

    const { container } = render(<Controls />);
    expect(container).toBeEmptyDOMElement();
  });
});

