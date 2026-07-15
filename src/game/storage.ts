import { STORAGE_KEYS } from './constants';
import {
  createStatsFromLegacyValues,
  normalizeStats,
} from './logic';
import { GameStats } from './types';

const readRawStoredValue = (key: string): unknown => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return undefined;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : undefined;
  } catch {
    return undefined;
  }
};

export const normalizeCompletedWords = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((word): word is string => typeof word === 'string')
        .map((word) => word.toLowerCase())
    )
  );
};

export const getInitialStats = (): GameStats => {
  const currentStats = readRawStoredValue(STORAGE_KEYS.stats);

  if (currentStats) {
    return normalizeStats(currentStats);
  }

  return createStatsFromLegacyValues({
    gameCount: readRawStoredValue(STORAGE_KEYS.legacyGameCount),
    winCount: readRawStoredValue(STORAGE_KEYS.legacyWinCount),
    guessDistribution: readRawStoredValue(
      STORAGE_KEYS.legacyGuessDistribution
    ),
  });
};
