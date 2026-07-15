import { COLUMN_COUNT } from './constants';
import {
  Board,
  GameStats,
  GuessDistribution,
  GuessNumber,
  KeyboardStatus,
  TileStatus,
  createEmptyGuessDistribution,
  createEmptyStats,
  guessNumbers,
} from './types';

const statusRank: Record<Exclude<TileStatus, 'empty'>, number> = {
  absent: 0,
  present: 1,
  correct: 2,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const asNonNegativeInteger = (value: unknown): number => {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
};

export const normalizeGuess = (letters: string[]): string =>
  letters.join('').toLowerCase();

export const isCompleteGuess = (letters: string[]): boolean =>
  letters.length === COLUMN_COUNT && letters.every(Boolean);

export const isValidGuess = ({
  guess,
  answer,
  dictionary,
}: {
  guess: string;
  answer: string;
  dictionary: readonly string[];
}): boolean => guess === answer || dictionary.includes(guess);

export const chooseRandomWord = ({
  words,
  completedWords,
  random = Math.random,
}: {
  words: readonly string[];
  completedWords: readonly string[];
  random?: () => number;
}): string => {
  if (words.length === 0) {
    throw new Error('Cannot choose a word from an empty word list.');
  }

  const completed = new Set(completedWords);
  const availableWords = words.filter((word) => !completed.has(word));
  const choices = availableWords.length > 0 ? availableWords : words;
  const index = Math.min(Math.floor(random() * choices.length), choices.length - 1);

  return choices[index];
};

export const scoreGuess = (guess: string, answer: string): TileStatus[] => {
  const guessLetters = guess.split('');
  const answerLetters = answer.split('');
  const statuses: TileStatus[] = Array(COLUMN_COUNT).fill('absent');

  guessLetters.forEach((letter, index) => {
    if (letter === answerLetters[index]) {
      statuses[index] = 'correct';
      answerLetters[index] = '';
    }
  });

  guessLetters.forEach((letter, index) => {
    if (statuses[index] === 'correct') {
      return;
    }

    const answerIndex = answerLetters.indexOf(letter);
    if (answerIndex >= 0) {
      statuses[index] = 'present';
      answerLetters[answerIndex] = '';
    }
  });

  return statuses;
};

export const getBoardStatuses = ({
  board,
  answer,
  submittedRows,
}: {
  board: Board;
  answer: string;
  submittedRows: number;
}): TileStatus[][] =>
  board.map((row, rowIndex) => {
    if (rowIndex >= submittedRows) {
      return Array(COLUMN_COUNT).fill('empty');
    }

    return scoreGuess(normalizeGuess(row), answer);
  });

export const getKeyboardStatuses = ({
  board,
  answer,
  submittedRows,
}: {
  board: Board;
  answer: string;
  submittedRows: number;
}): KeyboardStatus => {
  const statuses: KeyboardStatus = {};

  board.slice(0, submittedRows).forEach((row) => {
    const guess = normalizeGuess(row);
    const rowStatuses = scoreGuess(guess, answer);

    guess.split('').forEach((letter, index) => {
      const status = rowStatuses[index];
      if (status === 'empty') {
        return;
      }

      const currentStatus = statuses[letter];
      if (!currentStatus || statusRank[status] > statusRank[currentStatus]) {
        statuses[letter] = status;
      }
    });
  });

  return statuses;
};

export const recordGame = ({
  stats,
  didWin,
  guesses,
}: {
  stats: GameStats;
  didWin: boolean;
  guesses: GuessNumber;
}): GameStats => {
  const currentStreak = didWin ? stats.currentStreak + 1 : 0;

  return {
    played: stats.played + 1,
    wins: didWin ? stats.wins + 1 : stats.wins,
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    guessDistribution: {
      ...stats.guessDistribution,
      [guesses]: didWin
        ? stats.guessDistribution[guesses] + 1
        : stats.guessDistribution[guesses],
    },
  };
};

export const getWinPercentage = ({ played, wins }: GameStats): number => {
  if (played === 0) {
    return 0;
  }

  return Math.round((wins / played) * 100);
};

export const getDistributionMax = (distribution: GuessDistribution): number =>
  Math.max(1, ...Object.values(distribution));

export const normalizeGuessDistribution = (
  value: unknown
): GuessDistribution => {
  const distribution = createEmptyGuessDistribution();

  if (!isRecord(value)) {
    return distribution;
  }

  guessNumbers.forEach((guessNumber) => {
    distribution[guessNumber] = asNonNegativeInteger(value[guessNumber]);
  });

  return distribution;
};

export const normalizeStats = (value: unknown): GameStats => {
  if (!isRecord(value)) {
    return createEmptyStats();
  }

  const played = asNonNegativeInteger(value.played);
  const wins = Math.min(asNonNegativeInteger(value.wins), played);
  const currentStreak = Math.min(asNonNegativeInteger(value.currentStreak), wins);

  return {
    played,
    wins,
    currentStreak,
    maxStreak: Math.max(asNonNegativeInteger(value.maxStreak), currentStreak),
    guessDistribution: normalizeGuessDistribution(value.guessDistribution),
  };
};

export const createStatsFromLegacyValues = ({
  gameCount,
  winCount,
  guessDistribution,
}: {
  gameCount: unknown;
  winCount: unknown;
  guessDistribution: unknown;
}): GameStats => {
  const played = asNonNegativeInteger(gameCount);
  const wins = Math.min(asNonNegativeInteger(winCount), played);

  return {
    played,
    wins,
    currentStreak: wins,
    maxStreak: wins,
    guessDistribution: normalizeGuessDistribution(guessDistribution),
  };
};
