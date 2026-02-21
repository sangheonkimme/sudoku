'use client';

import { useGame } from '@/lib/gameContext';
import styles from './Controls.module.css';

export default function Controls() {
  const { state, dispatch, formatTime } = useGame();
  const { status, noteMode, timer, hintsUsed, maxHints, difficulty } = state;

  if (status !== 'playing' && status !== 'paused') return null;

  return (
    <div className={styles.controls}>
      {/* Timer bar */}
      <div className={styles.timerBar}>
        <div className={styles.leftGroup}>
          <button
            className={styles.homeBtn}
            onClick={() => {
              if (window.confirm('진행 중인 게임을 종료할까요?')) {
                dispatch({ type: 'GO_HOME' });
              }
            }}
            aria-label="홈으로 돌아가기"
            title="홈으로 돌아가기"
          >
            🏠
          </button>
          <span className={styles.difficulty}>
            {difficulty && difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
        <div className={styles.timer}>
          <span className={styles.timerIcon}>⏱</span>
          <span>{formatTime(timer)}</span>
          <button
            className={styles.pauseBtn}
            onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
            aria-label={status === 'paused' ? '계속하기' : '일시정지'}
            title={status === 'paused' ? '계속하기 (P)' : '일시정지 (P)'}
          >
            {status === 'paused' ? '▶' : '⏸'}
          </button>
        </div>
      </div>

      {/* Number pad */}
      <div className={styles.numPad} role="group" aria-label="숫자 입력 패드">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            className={styles.numBtn}
            onClick={() => dispatch({ type: 'INPUT_NUMBER', num })}
            aria-label={`숫자 ${num} 입력`}
            disabled={status === 'paused'}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Tool buttons */}
      <div className={styles.tools} role="group" aria-label="도구 버튼">
        <button
          className={`${styles.toolBtn} ${noteMode ? styles.active : ''}`}
          onClick={() => dispatch({ type: 'TOGGLE_NOTES' })}
          aria-label="메모 모드 전환"
          aria-pressed={noteMode}
          title="메모 모드 (Shift+숫자)"
          disabled={status === 'paused'}
        >
          <span className={styles.toolIcon}>✏️</span>
          <span className={styles.toolLabel}>메모</span>
        </button>
        <button
          className={styles.toolBtn}
          onClick={() => dispatch({ type: 'UNDO' })}
          aria-label="실행 취소"
          title="실행 취소 (Ctrl+Z)"
          disabled={status === 'paused'}
        >
          <span className={styles.toolIcon}>↩️</span>
          <span className={styles.toolLabel}>취소</span>
        </button>
        <button
          className={styles.toolBtn}
          onClick={() => dispatch({ type: 'ERASE' })}
          aria-label="지우기"
          title="지우기 (Delete)"
          disabled={status === 'paused'}
        >
          <span className={styles.toolIcon}>🗑</span>
          <span className={styles.toolLabel}>지우기</span>
        </button>
        <button
          className={styles.toolBtn}
          onClick={() => dispatch({ type: 'HINT' })}
          aria-label="힌트 사용"
          title={`힌트 (H) - ${maxHints - hintsUsed}회 남음`}
          disabled={status === 'paused' || hintsUsed >= maxHints}
        >
          <span className={styles.toolIcon}>💡</span>
          <span className={styles.toolLabel}>힌트 {maxHints - hintsUsed}</span>
        </button>
      </div>
    </div>
  );
}
