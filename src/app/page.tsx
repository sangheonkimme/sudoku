import { GameProvider } from '@/lib/gameContext';
import GameContainer from '@/components/GameContainer';

export default function Home() {
  return (
    <>
      <header className="site-header">
        <nav className="site-nav" aria-label="메인 네비게이션">
          <div className="site-brand">
            <span className="brand-chip">Logic Daily</span>
            <span className="brand-title">Sudoku Atelier</span>
          </div>
          <span className="site-note">9x9 Number Craft</span>
        </nav>
      </header>

      <main id="main-content">
        <GameProvider>
          <GameContainer />
        </GameProvider>
      </main>

      <footer className="site-footer">
        <p>© 2026 Sudoku Online. All rights reserved.</p>
        <p className="site-footline">
          스도쿠 온라인 — 무료로 즐기는 두뇌 퍼즐 게임
        </p>
      </footer>
    </>
  );
}
