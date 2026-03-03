'use client';

import { useGame } from '@/lib/gameContext';
import { useI18n } from '@/lib/i18nContext';
import { DIFFICULTY_LABELS } from '@/lib/sudoku';
import styles from './CompletionModal.module.css';

const difficultyClassMap = {
  easy: styles.easy,
  medium: styles.medium,
  hard: styles.hard,
  expert: styles.expert,
};

export default function CompletionModal() {
  const { state, dispatch, formatTime } = useGame();
  const { locale, messages } = useI18n();

  if (state.status !== 'completed' || !state.difficulty) return null;

  const info = DIFFICULTY_LABELS[state.difficulty];
  const hintValue = `${state.hintsUsed}${messages.completion.hintCountSuffix}`;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={messages.completion.dialogAria}>
      <div className={styles.modal}>
        <div className={styles.confetti}>🎉</div>
        <h2 className={styles.title}>{messages.completion.title}</h2>
        <p className={styles.subtitle}>{messages.completion.subtitle}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{messages.completion.timeLabel}</span>
            <span className={styles.statValue}>{formatTime(state.timer)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{messages.completion.difficultyLabel}</span>
            <span className={`${styles.statValue} ${difficultyClassMap[state.difficulty]}`}>
              {info.emoji} {info[locale]}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{messages.completion.hintLabel}</span>
            <span className={styles.statValue}>{hintValue}</span>
          </div>
        </div>

        {/* Ad slot placeholder */}
        <div className={styles.adSlot} data-ad-slot="true" aria-label={messages.game.adAreaAria}>
          <span className={styles.adPlaceholder}>AD 300×250</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.newGameBtn}
            onClick={() => dispatch({ type: 'GO_HOME' })}
          >
            {messages.completion.newGameButton}
          </button>
          <button
            className={styles.homeBtn}
            onClick={() => dispatch({ type: 'GO_HOME' })}
          >
            {messages.completion.homeButton}
          </button>
        </div>
      </div>
    </div>
  );
}
