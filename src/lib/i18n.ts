export const SUPPORTED_LOCALES = ['ko', 'en', 'jp'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';
export const LOCALE_COOKIE = 'sudoku-locale';

export interface LocaleMessages {
  site: {
    skipLink: string;
    navAria: string;
    brandChip: string;
    brandTitle: string;
    siteNote: string;
    languageLabel: string;
    footerLine1: string;
    footerLine2: string;
  };
  game: {
    adAreaAria: string;
    heroKicker: string;
    heroTitle: string;
    heroTagline: string;
    seoAboutTitle: string;
    seoAboutBody: string;
    seoHowToTitle: string;
    seoHowToItems: string[];
    pauseTitle: string;
    resumeButton: string;
  };
  difficulty: {
    title: string;
    subtitle: string;
  };
  controls: {
    homeAria: string;
    homeTitle: string;
    homeConfirm: string;
    timerAria: string;
    resumeAria: string;
    pauseAria: string;
    resumeTitle: string;
    pauseTitle: string;
    numberPadAria: string;
    numberInputLabel: string;
    toolsAria: string;
    notesAria: string;
    notesTitle: string;
    notesLabel: string;
    undoAria: string;
    undoTitle: string;
    undoLabel: string;
    eraseAria: string;
    eraseTitle: string;
    eraseLabel: string;
    hintAria: string;
    hintTitlePrefix: string;
    hintRemainSuffix: string;
    hintLabel: string;
  };
  board: {
    boardAria: string;
    rowLabel: string;
    colLabel: string;
    valueLabel: string;
    emptyLabel: string;
    fixedLabel: string;
  };
  completion: {
    dialogAria: string;
    title: string;
    subtitle: string;
    timeLabel: string;
    difficultyLabel: string;
    hintLabel: string;
    hintCountSuffix: string;
    newGameButton: string;
    homeButton: string;
  };
}

export const MESSAGES: Record<Locale, LocaleMessages> = {
  ko: {
    site: {
      skipLink: '본문 바로가기',
      navAria: '메인 네비게이션',
      brandChip: 'Logic Daily',
      brandTitle: 'Sudoku Atelier',
      siteNote: '9x9 두뇌 트레이닝',
      languageLabel: '언어',
      footerLine1: '© 2026 Sudoku Online. All rights reserved.',
      footerLine2: '스도쿠 온라인 — 무료로 즐기는 두뇌 퍼즐 게임',
    },
    game: {
      adAreaAria: '광고 영역',
      heroKicker: 'Daily Logic Puzzle',
      heroTitle: 'Sudoku Atelier',
      heroTagline: '무료로 즐기는 9×9 두뇌 트레이닝',
      seoAboutTitle: '스도쿠란?',
      seoAboutBody:
        '스도쿠(數獨, Sudoku)는 9×9 격자에 1부터 9까지의 숫자를 채우는 논리 퍼즐입니다. 각 행, 열, 3×3 박스에 1~9가 한 번씩만 들어가야 합니다. 쉬움부터 전문가까지 4단계 난이도를 선택하여 도전해보세요!',
      seoHowToTitle: '스도쿠 플레이 방법',
      seoHowToItems: [
        '빈 셀을 클릭하고 1~9 숫자를 입력하세요',
        '같은 행, 열, 3×3 박스에 같은 숫자가 중복되면 안 됩니다',
        '메모 기능으로 후보 숫자를 기록할 수 있습니다',
        '힌트 버튼으로 정답을 확인할 수 있습니다',
        '키보드 단축키: 숫자키(1-9), 방향키, Ctrl+Z(취소), H(힌트)',
      ],
      pauseTitle: '일시정지',
      resumeButton: '계속하기',
    },
    difficulty: {
      title: '난이도를 선택하세요',
      subtitle: '원하는 단계로 게임을 시작하세요',
    },
    controls: {
      homeAria: '홈으로 돌아가기',
      homeTitle: '홈으로 돌아가기',
      homeConfirm: '진행 중인 게임을 종료할까요?',
      timerAria: '게임 시간',
      resumeAria: '계속하기',
      pauseAria: '일시정지',
      resumeTitle: '계속하기 (P)',
      pauseTitle: '일시정지 (P)',
      numberPadAria: '숫자 입력 패드',
      numberInputLabel: '숫자',
      toolsAria: '도구 버튼',
      notesAria: '메모 모드 전환',
      notesTitle: '메모 모드 (Shift+숫자)',
      notesLabel: '메모',
      undoAria: '실행 취소',
      undoTitle: '실행 취소 (Ctrl+Z)',
      undoLabel: '취소',
      eraseAria: '지우기',
      eraseTitle: '지우기 (Delete)',
      eraseLabel: '지우기',
      hintAria: '힌트 사용',
      hintTitlePrefix: '힌트 (H) -',
      hintRemainSuffix: '회 남음',
      hintLabel: '힌트',
    },
    board: {
      boardAria: '스도쿠 게임 보드',
      rowLabel: '행',
      colLabel: '열',
      valueLabel: '값',
      emptyLabel: '비어있음',
      fixedLabel: '고정',
    },
    completion: {
      dialogAria: '게임 클리어',
      title: '축하합니다!',
      subtitle: '퍼즐을 완성했습니다',
      timeLabel: '소요 시간',
      difficultyLabel: '난이도',
      hintLabel: '힌트 사용',
      hintCountSuffix: '회',
      newGameButton: '🔄 새 게임',
      homeButton: '🏠 홈',
    },
  },
  en: {
    site: {
      skipLink: 'Skip to main content',
      navAria: 'Main navigation',
      brandChip: 'Logic Daily',
      brandTitle: 'Sudoku Atelier',
      siteNote: '9x9 Brain Training',
      languageLabel: 'Language',
      footerLine1: '© 2026 Sudoku Online. All rights reserved.',
      footerLine2: 'Sudoku Online - Free brain puzzle game',
    },
    game: {
      adAreaAria: 'Ad area',
      heroKicker: 'Daily Logic Puzzle',
      heroTitle: 'Sudoku Atelier',
      heroTagline: 'Train your brain with free 9x9 Sudoku',
      seoAboutTitle: 'What is Sudoku?',
      seoAboutBody:
        'Sudoku is a logic puzzle where you fill a 9x9 grid with digits from 1 to 9. Each row, column, and 3x3 box must contain each number exactly once. Pick one of four difficulty levels and start solving.',
      seoHowToTitle: 'How to Play',
      seoHowToItems: [
        'Click an empty cell and enter a number from 1 to 9',
        'The same number cannot be repeated in a row, column, or 3x3 box',
        'Use notes to keep candidate numbers',
        'Use hints to reveal the correct value',
        'Keyboard shortcuts: 1-9, Arrow keys, Ctrl+Z (undo), H (hint)',
      ],
      pauseTitle: 'Paused',
      resumeButton: 'Resume',
    },
    difficulty: {
      title: 'Choose your difficulty',
      subtitle: 'Start a new puzzle at your preferred level',
    },
    controls: {
      homeAria: 'Go home',
      homeTitle: 'Go home',
      homeConfirm: 'Leave the current game?',
      timerAria: 'Game timer',
      resumeAria: 'Resume',
      pauseAria: 'Pause',
      resumeTitle: 'Resume (P)',
      pauseTitle: 'Pause (P)',
      numberPadAria: 'Number input pad',
      numberInputLabel: 'Input number',
      toolsAria: 'Tool buttons',
      notesAria: 'Toggle note mode',
      notesTitle: 'Note mode (Shift+number)',
      notesLabel: 'Notes',
      undoAria: 'Undo',
      undoTitle: 'Undo (Ctrl+Z)',
      undoLabel: 'Undo',
      eraseAria: 'Erase',
      eraseTitle: 'Erase (Delete)',
      eraseLabel: 'Erase',
      hintAria: 'Use hint',
      hintTitlePrefix: 'Hint (H) -',
      hintRemainSuffix: 'left',
      hintLabel: 'Hint',
    },
    board: {
      boardAria: 'Sudoku game board',
      rowLabel: 'Row',
      colLabel: 'Column',
      valueLabel: 'Value',
      emptyLabel: 'empty',
      fixedLabel: 'fixed',
    },
    completion: {
      dialogAria: 'Puzzle completed',
      title: 'Great job!',
      subtitle: 'You solved the puzzle',
      timeLabel: 'Time',
      difficultyLabel: 'Difficulty',
      hintLabel: 'Hints used',
      hintCountSuffix: '',
      newGameButton: '🔄 New Game',
      homeButton: '🏠 Home',
    },
  },
  jp: {
    site: {
      skipLink: 'メインコンテンツへ移動',
      navAria: 'メインナビゲーション',
      brandChip: 'Logic Daily',
      brandTitle: 'Sudoku Atelier',
      siteNote: '9x9 脳トレーニング',
      languageLabel: '言語',
      footerLine1: '© 2026 Sudoku Online. All rights reserved.',
      footerLine2: 'Sudoku Online - 無料で遊べる数字パズル',
    },
    game: {
      adAreaAria: '広告エリア',
      heroKicker: 'Daily Logic Puzzle',
      heroTitle: 'Sudoku Atelier',
      heroTagline: '無料で楽しむ9x9脳トレ数独',
      seoAboutTitle: '数独とは？',
      seoAboutBody:
        '数独（Sudoku）は、9x9のマスに1から9の数字を入れる論理パズルです。各行・各列・3x3のブロックには、1から9がそれぞれ1回ずつ入ります。4段階の難易度から選んで挑戦してください。',
      seoHowToTitle: '遊び方',
      seoHowToItems: [
        '空いているマスをクリックして1〜9を入力します',
        '同じ行・列・3x3ブロックに同じ数字は入れられません',
        'メモ機能で候補数字を記録できます',
        'ヒントボタンで正しい数字を確認できます',
        'ショートカット: 1-9, 矢印キー, Ctrl+Z(元に戻す), H(ヒント)',
      ],
      pauseTitle: '一時停止',
      resumeButton: '再開',
    },
    difficulty: {
      title: '難易度を選択してください',
      subtitle: 'お好みのレベルで新しいゲームを開始',
    },
    controls: {
      homeAria: 'ホームへ戻る',
      homeTitle: 'ホームへ戻る',
      homeConfirm: '進行中のゲームを終了しますか？',
      timerAria: 'ゲーム時間',
      resumeAria: '再開',
      pauseAria: '一時停止',
      resumeTitle: '再開 (P)',
      pauseTitle: '一時停止 (P)',
      numberPadAria: '数字入力パッド',
      numberInputLabel: '数字',
      toolsAria: 'ツールボタン',
      notesAria: 'メモモード切替',
      notesTitle: 'メモモード (Shift+数字)',
      notesLabel: 'メモ',
      undoAria: '元に戻す',
      undoTitle: '元に戻す (Ctrl+Z)',
      undoLabel: '戻す',
      eraseAria: '消去',
      eraseTitle: '消去 (Delete)',
      eraseLabel: '消去',
      hintAria: 'ヒントを使う',
      hintTitlePrefix: 'ヒント (H) -',
      hintRemainSuffix: '回残り',
      hintLabel: 'ヒント',
    },
    board: {
      boardAria: '数独ゲームボード',
      rowLabel: '行',
      colLabel: '列',
      valueLabel: '値',
      emptyLabel: '空き',
      fixedLabel: '固定',
    },
    completion: {
      dialogAria: 'ゲームクリア',
      title: 'おめでとうございます！',
      subtitle: 'パズルを完成しました',
      timeLabel: '時間',
      difficultyLabel: '難易度',
      hintLabel: 'ヒント使用',
      hintCountSuffix: '回',
      newGameButton: '🔄 新しいゲーム',
      homeButton: '🏠 ホーム',
    },
  },
};

export const LOCALE_NAMES: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  jp: '日本語',
};

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return !!value && SUPPORTED_LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale | null {
  return isSupportedLocale(value) ? value : null;
}

export function getMessages(locale: Locale): LocaleMessages {
  return MESSAGES[locale];
}

export function localeFromCountry(country: string | null | undefined): Locale | null {
  const code = country?.toUpperCase();
  if (code === 'KR') return 'ko';
  if (code === 'JP') return 'jp';
  return null;
}

export function localeFromAcceptLanguage(header: string | null | undefined): Locale | null {
  const value = header?.toLowerCase() ?? '';
  if (!value) return null;
  if (value.includes('ko')) return 'ko';
  if (value.includes('ja')) return 'jp';
  if (value.includes('en')) return 'en';
  return null;
}

