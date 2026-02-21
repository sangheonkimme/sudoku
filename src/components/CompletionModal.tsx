'use client';

import { useGame } from '@/lib/gameContext';
import { DIFFICULTY_LABELS } from '@/lib/sudoku';
import styles from './CompletionModal.module.css';

export default function CompletionModal() {
  const { state, dispatch, formatTime } = useGame();

  if (state.status !== 'completed' || !state.difficulty) return null;

  const info = DIFFICULTY_LABELS[state.difficulty];

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="게임 클리어">
      <div className={styles.modal}>
        <div className={styles.confetti}>🎉</div>
        <h2 className={styles.title}>축하합니다!</h2>
        <p className={styles.subtitle}>퍼즐을 완성했습니다</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>소요 시간</span>
            <span className={styles.statValue}>{formatTime(state.timer)}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>난이도</span>
            <span className={styles.statValue} style={{ color: info.color }}>
              {info.emoji} {info.ko}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>힌트 사용</span>
            <span className={styles.statValue}>{state.hintsUsed}회</span>
          </div>
        </div>

        {/* Ad slot placeholder */}
        <div className={styles.adSlot} aria-label="광고 영역">
          <span className={styles.adPlaceholder}>AD 300×250</span>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.newGameBtn}
            onClick={() => dispatch({ type: 'GO_HOME' })}
          >
            🔄 새 게임
          </button>
          <button
            className={styles.homeBtn}
            onClick={() => dispatch({ type: 'GO_HOME' })}
          >
            🏠 홈
          </button>
        </div>
      </div>
    </div>
  );
}
