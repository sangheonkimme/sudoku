'use client';

import { useGame } from '@/lib/gameContext';
import Board from '@/components/Board';
import Controls from '@/components/Controls';
import DifficultySelect from '@/components/DifficultySelect';
import CompletionModal from '@/components/CompletionModal';
import AdSlot from '@/components/AdSlot';
import { useI18n } from '@/lib/i18nContext';
import { ADSENSE_SLOTS } from '@/lib/ads';
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
        <AdSlot
          className={styles.adLeaderboard}
          ariaLabel={messages.game.adAreaAria}
          slot={ADSENSE_SLOTS.leaderboard}
          fallback="AD 728×90"
          fallbackClassName={styles.adPlaceholder}
          format="horizontal"
        />

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
        <AdSlot
          className={`${styles.adSide} ${styles.adSideSized}`}
          ariaLabel={messages.game.adAreaAria}
          slot={ADSENSE_SLOTS.side}
          fallback="AD 160×600"
          fallbackClassName={styles.adPlaceholder}
          format="vertical"
          fullWidthResponsive={false}
        />

        <div className={styles.gameCenter}>
          <div className={`${styles.boardWrapper} ${styles.boardMuted}`}>
            <Board />
            <div className={styles.pauseOverlay}>
              <span className={styles.pauseIcon}>⏸</span>
              <p>{messages.game.pauseTitle}</p>
              <button
                className={styles.resumeBtn}
                onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
                aria-label={messages.game.resumeButton}
              >
                {messages.game.resumeButton}
              </button>
            </div>
          </div>
          <Controls />

          {/* Bottom ad slot */}
          <AdSlot
            className={styles.adBottom}
            ariaLabel={messages.game.adAreaAria}
            slot={ADSENSE_SLOTS.bottom}
            fallback="AD 728×90"
            fallbackClassName={styles.adPlaceholder}
            format="horizontal"
          />
        </div>
      </div>
    );
  }

  // Playing or Completed
  return (
    <div className={styles.gameLayout}>
      {/* Side ad slot - Desktop only */}
      <AdSlot
        className={`${styles.adSide} ${styles.adSideSized}`}
        ariaLabel={messages.game.adAreaAria}
        slot={ADSENSE_SLOTS.side}
        fallback="AD 160×600"
        fallbackClassName={styles.adPlaceholder}
        format="vertical"
        fullWidthResponsive={false}
      />

      <div className={styles.gameCenter}>
        <Board />
        <Controls />

        {/* Bottom ad slot */}
        <AdSlot
          className={styles.adBottom}
          ariaLabel={messages.game.adAreaAria}
          slot={ADSENSE_SLOTS.bottom}
          fallback="AD 728×90"
          fallbackClassName={styles.adPlaceholder}
          format="horizontal"
        />
      </div>

      <CompletionModal />
    </div>
  );
}
