'use client';

import { useGame } from '@/lib/gameContext';
import { useI18n } from '@/lib/i18nContext';
import { DIFFICULTY_LABELS } from '@/lib/sudoku';
import styles from './Controls.module.css';

export default function Controls() {
  const { state, dispatch, formatTime } = useGame();
  const { locale, messages } = useI18n();
  const { status, noteMode, timer, hintsUsed, maxHints, difficulty } = state;

  if (status !== 'playing' && status !== 'paused') return null;

  const remainingHints = maxHints - hintsUsed;
  const difficultyText = difficulty ? DIFFICULTY_LABELS[difficulty][locale] : '';
  const hintTitle = locale === 'ko'
    ? `${messages.controls.hintTitlePrefix} ${remainingHints}회 남음`
    : locale === 'jp'
      ? `${messages.controls.hintTitlePrefix} 残り${remainingHints}回`
      : `${messages.controls.hintTitlePrefix} ${remainingHints} left`;

  return (
    <div className={styles.controls}>
      {/* Timer bar */}
      <div className={styles.timerBar}>
        <div className={styles.leftGroup}>
          <button
            className={styles.homeBtn}
            onClick={() => {
              if (window.confirm(messages.controls.homeConfirm)) {
                dispatch({ type: 'GO_HOME' });
              }
            }}
            aria-label={messages.controls.homeAria}
            title={messages.controls.homeTitle}
          >
            🏠
          </button>
          <span className={styles.difficulty}>{difficultyText}</span>
        </div>
        <div className={styles.timer} aria-label={messages.controls.timerAria}>
          <span className={styles.timerIcon}>⏱</span>
          <span>{formatTime(timer)}</span>
          <button
            className={styles.pauseBtn}
            onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
            aria-label={status === 'paused' ? messages.controls.resumeAria : messages.controls.pauseAria}
            title={status === 'paused' ? messages.controls.resumeTitle : messages.controls.pauseTitle}
          >
            {status === 'paused' ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      {/* Number pad */}
      <div className={styles.numPad} role="group" aria-label={messages.controls.numberPadAria}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className={styles.numBtn}
            onClick={() => dispatch({ type: 'INPUT_NUMBER', num })}
            aria-label={`${messages.controls.numberInputLabel} ${num}`}
            disabled={status === 'paused'}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Tool buttons */}
      <div className={styles.tools} role="group" aria-label={messages.controls.toolsAria}>
        <button
          className={`${styles.toolBtn} ${noteMode ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_NOTES' })}
          data-testid="notes-toggle"
          aria-label={messages.controls.notesAria}
          aria-pressed={noteMode}
          title={messages.controls.notesTitle}
          disabled={status === 'paused'}
        >
          <span className={styles.toolIcon}>✏️</span>
          <span className={styles.toolLabel}>{messages.controls.notesLabel}</span>
        </button>
        <button
          className={styles.toolBtn}
          onClick={() => dispatch({ type: 'UNDO' })}
          aria-label={messages.controls.undoAria}
          title={messages.controls.undoTitle}
          disabled={status === 'paused'}
        >
          <span className={styles.toolIcon}>↩️</span>
          <span className={styles.toolLabel}>{messages.controls.undoLabel}</span>
        </button>
        <button
          className={styles.toolBtn}
          onClick={() => dispatch({ type: 'ERASE' })}
          aria-label={messages.controls.eraseAria}
          title={messages.controls.eraseTitle}
          disabled={status === 'paused'}
        >
          <span className={styles.toolIcon}>🗑</span>
          <span className={styles.toolLabel}>{messages.controls.eraseLabel}</span>
        </button>
        <button
          className={styles.toolBtn}
          onClick={() => dispatch({ type: 'HINT' })}
          aria-label={messages.controls.hintAria}
          title={hintTitle}
          disabled={status === 'paused' || hintsUsed >= maxHints}
        >
          <span className={styles.toolIcon}>💡</span>
          <span className={styles.toolLabel}>{messages.controls.hintLabel} {remainingHints}</span>
        </button>
      </div>
    </div>
  );
}
