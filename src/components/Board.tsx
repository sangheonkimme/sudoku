'use client';

import { useGame } from '@/lib/gameContext';
import { useEffect, useCallback } from 'react';
import styles from './Board.module.css';

export default function Board() {
  const { state, dispatch, getConflictsForCell } = useGame();
  const { board, puzzle, selectedCell, notes, showErrors, highlightSame } = state;

  // Keyboard handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (state.status !== 'playing') return;

    if (e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const num = parseInt(e.key);
      if (e.shiftKey) {
        // Note mode with shift
        if (selectedCell && puzzle && puzzle[selectedCell[0]][selectedCell[1]] === 0) {
          const prevNoteMode = state.noteMode;
          if (!prevNoteMode) dispatch({ type: 'TOGGLE_NOTES' });
          dispatch({ type: 'INPUT_NUMBER', num });
          if (!prevNoteMode) dispatch({ type: 'TOGGLE_NOTES' });
        }
      } else {
        dispatch({ type: 'INPUT_NUMBER', num });
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      dispatch({ type: 'ERASE' });
    } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      dispatch({ type: 'UNDO' });
    } else if (e.key === 'h' || e.key === 'H') {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        dispatch({ type: 'HINT' });
      }
    } else if (e.key === 'p' || e.key === 'P') {
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_PAUSE' });
      }
    } else if (e.key === 'ArrowUp' && selectedCell) {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', row: Math.max(0, selectedCell[0] - 1), col: selectedCell[1] });
    } else if (e.key === 'ArrowDown' && selectedCell) {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', row: Math.min(8, selectedCell[0] + 1), col: selectedCell[1] });
    } else if (e.key === 'ArrowLeft' && selectedCell) {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', row: selectedCell[0], col: Math.max(0, selectedCell[1] - 1) });
    } else if (e.key === 'ArrowRight' && selectedCell) {
      e.preventDefault();
      dispatch({ type: 'SELECT_CELL', row: selectedCell[0], col: Math.min(8, selectedCell[1] + 1) });
    }
  }, [state.status, selectedCell, puzzle, state.noteMode, dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!board || !puzzle) return null;

  const selectedValue = selectedCell ? board[selectedCell[0]][selectedCell[1]] : 0;

  function getCellClass(row: number, col: number): string {
    const classes = [styles.cell];

    const isFixed = puzzle![row][col] !== 0;
    const value = board![row][col];

    if (isFixed) classes.push(styles.fixed);

    // Selected cell
    if (selectedCell && selectedCell[0] === row && selectedCell[1] === col) {
      classes.push(styles.selected);
    }

    // Same row/col/box as selected
    if (selectedCell) {
      const [sr, sc] = selectedCell;
      const sameRow = sr === row;
      const sameCol = sc === col;
      const sameBox = Math.floor(sr / 3) === Math.floor(row / 3) &&
                      Math.floor(sc / 3) === Math.floor(col / 3);
      if ((sameRow || sameCol || sameBox) && !(sr === row && sc === col)) {
        classes.push(styles.highlighted);
      }
    }

    // Highlight same number
    if (highlightSame && selectedValue && value === selectedValue && value !== 0) {
      classes.push(styles.sameNumber);
    }

    // Error
    if (showErrors && value !== 0 && !isFixed) {
      const conflicts = getConflictsForCell(row, col);
      if (conflicts.length > 0) {
        classes.push(styles.error);
      }
    }

    // Box borders
    if (col % 3 === 0) classes.push(styles.boxLeft);
    if (row % 3 === 0) classes.push(styles.boxTop);

    return classes.join(' ');
  }

  return (
    <div className={styles.board} role="grid" aria-label="스도쿠 게임 보드">
      {board.map((row, r) => (
        <div key={r} className={styles.row} role="row">
          {row.map((cell, c) => {
            const isFixed = puzzle[r][c] !== 0;
            const cellNotes = notes?.[r]?.[c];
            const hasNotes = cellNotes instanceof Set && cellNotes.size > 0;

            return (
              <button
                key={`${r}-${c}`}
                className={getCellClass(r, c)}
                onClick={() => dispatch({ type: 'SELECT_CELL', row: r, col: c })}
                role="gridcell"
                aria-label={`행 ${r + 1}, 열 ${c + 1}${cell ? `, 값 ${cell}` : ', 비어있음'}${isFixed ? ', 고정' : ''}`}
                aria-selected={selectedCell?.[0] === r && selectedCell?.[1] === c}
                tabIndex={selectedCell?.[0] === r && selectedCell?.[1] === c ? 0 : -1}
              >
                {cell !== 0 ? (
                  <span className={styles.cellValue}>{cell}</span>
                ) : hasNotes ? (
                  <div className={styles.notes}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                      <span key={n} className={styles.note}>
                        {cellNotes.has(n) ? n : ''}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
