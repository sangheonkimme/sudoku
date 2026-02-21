'use client';

import { useGame } from '@/lib/gameContext';
import { DIFFICULTY_LABELS, type Difficulty } from '@/lib/sudoku';
import { useI18n } from '@/lib/i18nContext';
import styles from './DifficultySelect.module.css';

export default function DifficultySelect() {
  const { dispatch } = useGame();
  const { locale, messages } = useI18n();
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  return (
    <section className={styles.container} aria-label={messages.difficulty.title}>
      <h2 className={styles.title}>{messages.difficulty.title}</h2>
      <p className={styles.subtitle}>{messages.difficulty.subtitle}</p>
      <div className={styles.grid}>
        {difficulties.map(d => {
          const info = DIFFICULTY_LABELS[d];
          const mainLabel = info[locale];
          const subLabel = locale === 'en' ? info.ko : info.en;
          const newGameLabel = locale === 'ko'
            ? `${mainLabel} 난이도로 새 게임 시작`
            : locale === 'jp'
              ? `${mainLabel}で新しいゲームを開始`
              : `Start a new ${mainLabel} game`;

          return (
            <button
              key={d}
              className={styles.card}
              onClick={() => dispatch({ type: 'NEW_GAME', difficulty: d })}
              style={{ '--card-color': info.color } as React.CSSProperties}
              aria-label={newGameLabel}
            >
              <span className={styles.emoji}>{info.emoji}</span>
              <span className={styles.level}>{mainLabel}</span>
              <span className={styles.levelKo}>{subLabel}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
