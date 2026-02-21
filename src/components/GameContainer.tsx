'use client';

import { useGame } from '@/lib/gameContext';
import Board from '@/components/Board';
import Controls from '@/components/Controls';
import DifficultySelect from '@/components/DifficultySelect';
import CompletionModal from '@/components/CompletionModal';
import { useI18n } from '@/lib/i18nContext';
import styles from './GameContainer.module.css';

export default function GameContainer() {
  const { state, dispatch } = useGame();
  const { messages } = useI18n();

  // Idle → show landing + difficulty select
  if (state.status === 'idle') {
    return (
      <div className={styles.landing}>
        <div className={styles.hero}>
          <p className={styles.kicker}>{messages.game.heroKicker}</p>
          <h1 className={styles.logo}>{messages.game.heroTitle}</h1>
          <p className={styles.tagline}>{messages.game.heroTagline}</p>
        </div>
        <DifficultySelect />

        {/* Ad slot - Leaderboard */}
        <div className={styles.adLeaderboard} data-ad-slot="true" aria-label={messages.game.adAreaAria}>
          <span className={styles.adPlaceholder}>AD 728×90</span>
        </div>

        {/* SEO content for crawlers */}
        <section className={styles.seoContent}>
          <h2>{messages.game.seoAboutTitle}</h2>
          <p>{messages.game.seoAboutBody}</p>
          <h2>{messages.game.seoHowToTitle}</h2>
          <ul>
            {messages.game.seoHowToItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
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
        <aside className={styles.adSide} data-ad-slot="true" aria-label={messages.game.adAreaAria}>
          <span className={styles.adPlaceholder}>AD 160×600</span>
        </aside>

        <div className={styles.gameCenter}>
          <div className={`${styles.boardWrapper} ${styles.boardMuted}`}>
            <Board />
            <div className={styles.pauseOverlay}>
              <span className={styles.pauseIcon}>⏸</span>
              <p>{messages.game.pauseTitle}</p>
              <button
                className={styles.resumeBtn}
                onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
              >
                {messages.game.resumeButton}
              </button>
            </div>
          </div>
          <Controls />

          {/* Bottom ad slot */}
          <div className={styles.adBottom} data-ad-slot="true" aria-label={messages.game.adAreaAria}>
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
      <aside className={styles.adSide} data-ad-slot="true" aria-label={messages.game.adAreaAria}>
        <span className={styles.adPlaceholder}>AD 160×600</span>
      </aside>

      <div className={styles.gameCenter}>
        <Board />
        <Controls />

        {/* Bottom ad slot */}
        <div className={styles.adBottom} data-ad-slot="true" aria-label={messages.game.adAreaAria}>
          <span className={styles.adPlaceholder}>AD 728×90</span>
        </div>
      </div>

      <CompletionModal />
    </div>
  );
}
