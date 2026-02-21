'use client';

import { useGame } from '@/lib/gameContext';
import { DIFFICULTY_LABELS, type Difficulty } from '@/lib/sudoku';
import styles from './DifficultySelect.module.css';

export default function DifficultySelect() {
  const { dispatch } = useGame();
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  return (
    <section className={styles.container} aria-label="난이도 선택">
      <h2 className={styles.title}>난이도를 선택하세요</h2>
      <p className={styles.subtitle}>Choose your difficulty level</p>
      <div className={styles.grid}>
        {difficulties.map(d => {
          const info = DIFFICULTY_LABELS[d];
          return (
            <button
              key={d}
              className={styles.card}
              onClick={() => dispatch({ type: 'NEW_GAME', difficulty: d })}
              style={{ '--card-color': info.color } as React.CSSProperties}
              aria-label={`${info.ko} 난이도로 새 게임 시작`}
            >
              <span className={styles.emoji}>{info.emoji}</span>
              <span className={styles.level}>{info.en}</span>
              <span className={styles.levelKo}>{info.ko}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
