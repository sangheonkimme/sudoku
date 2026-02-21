'use client';

import { useGame } from '@/lib/gameContext';
import Board from '@/components/Board';
import Controls from '@/components/Controls';
import DifficultySelect from '@/components/DifficultySelect';
import CompletionModal from '@/components/CompletionModal';
import styles from './GameContainer.module.css';

export default function GameContainer() {
  const { state, dispatch } = useGame();

  // Idle → show landing + difficulty select
  if (state.status === 'idle') {
    return (
      <div className={styles.landing}>
        <div className={styles.hero}>
          <p className={styles.kicker}>Daily Logic Puzzle</p>
          <h1 className={styles.logo}>Sudoku Atelier</h1>
          <p className={styles.tagline}>무료로 즐기는 9×9 두뇌 트레이닝</p>
        </div>
        <DifficultySelect />

        {/* Ad slot - Leaderboard */}
        <div className={styles.adLeaderboard} aria-label="광고 영역">
          <span className={styles.adPlaceholder}>AD 728×90</span>
        </div>

        {/* SEO content for crawlers */}
        <section className={styles.seoContent}>
          <h2>스도쿠란?</h2>
          <p>
            스도쿠(數獨, Sudoku)는 9×9 격자에 1부터 9까지의 숫자를 채우는 논리 퍼즐입니다.
            각 행, 열, 3×3 박스에 1~9가 한 번씩만 들어가야 합니다.
            쉬움부터 전문가까지 4단계 난이도를 선택하여 도전해보세요!
          </p>
          <h2>스도쿠 플레이 방법</h2>
          <ul>
            <li>빈 셀을 클릭하고 1~9 숫자를 입력하세요</li>
            <li>같은 행, 열, 3×3 박스에 같은 숫자가 중복되면 안 됩니다</li>
            <li>메모 기능으로 후보 숫자를 기록할 수 있습니다</li>
            <li>힌트 버튼으로 정답을 확인할 수 있습니다</li>
            <li>키보드 단축키: 숫자키(1-9), 방향키, Ctrl+Z(취소), H(힌트)</li>
          </ul>
        </section>
      </div>
    );
  }

  // Paused → blur the board
  if (state.status === 'paused') {
    return (
      <div className={styles.gameLayout}>
        {/* Side ad slot - Desktop */}
        <aside className={styles.adSide} aria-label="광고 영역">
          <span className={styles.adPlaceholder}>AD 160×600</span>
        </aside>

        <div className={styles.gameCenter}>
          <div className={`${styles.boardWrapper} ${styles.boardMuted}`}>
            <Board />
            <div className={styles.pauseOverlay}>
              <span className={styles.pauseIcon}>⏸</span>
              <p>일시정지</p>
              <button
                className={styles.resumeBtn}
                onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
              >
                계속하기
              </button>
            </div>
          </div>
          <Controls />

          {/* Bottom ad slot */}
          <div className={styles.adBottom} aria-label="광고 영역">
            <span className={styles.adPlaceholder}>AD 728×90</span>
          </div>
        </div>
      </div>
    );
  }

  // Playing or Completed
  return (
    <div className={styles.gameLayout}>
      {/* Side ad slot - Desktop only */}
      <aside className={styles.adSide} aria-label="광고 영역">
        <span className={styles.adPlaceholder}>AD 160×600</span>
      </aside>

      <div className={styles.gameCenter}>
        <Board />
        <Controls />

        {/* Bottom ad slot */}
        <div className={styles.adBottom} aria-label="광고 영역">
          <span className={styles.adPlaceholder}>AD 728×90</span>
        </div>
      </div>

      <CompletionModal />
    </div>
  );
}
