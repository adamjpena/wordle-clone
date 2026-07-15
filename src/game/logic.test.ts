import {
  chooseRandomWord,
  getKeyboardStatuses,
  recordGame,
  scoreGuess,
} from './logic';
import { Board, createEmptyStats } from './types';

const toBoard = (guesses: string[]): Board =>
  guesses.map((guess) => guess.split(''));

describe('scoreGuess', () => {
  it('scores duplicate letters using the available answer letters once', () => {
    expect(scoreGuess('allee', 'abbey')).toEqual([
      'correct',
      'absent',
      'absent',
      'correct',
      'absent',
    ]);
  });

  it('scores present and correct letters separately', () => {
    expect(scoreGuess('eagle', 'allee')).toEqual([
      'present',
      'present',
      'absent',
      'present',
      'correct',
    ]);
  });
});

describe('chooseRandomWord', () => {
  it('chooses from words that have not been completed', () => {
    expect(
      chooseRandomWord({
        words: ['apple', 'berry'],
        completedWords: ['apple'],
        random: () => 0.999,
      })
    ).toBe('berry');
  });

  it('falls back to the full word list when every word is completed', () => {
    expect(
      chooseRandomWord({
        words: ['apple', 'berry'],
        completedWords: ['apple', 'berry'],
        random: () => 1,
      })
    ).toBe('berry');
  });
});

describe('getKeyboardStatuses', () => {
  it('promotes key status instead of letting lower-value results overwrite it', () => {
    expect(
      getKeyboardStatuses({
        board: toBoard(['plead', 'apple']),
        answer: 'apple',
        submittedRows: 2,
      })
    ).toMatchObject({
      a: 'correct',
      p: 'correct',
      l: 'correct',
      e: 'correct',
      d: 'absent',
    });
  });
});

describe('recordGame', () => {
  it('records wins, streaks, and guess distribution', () => {
    const stats = recordGame({
      stats: createEmptyStats(),
      didWin: true,
      guesses: 3,
    });

    expect(stats).toMatchObject({
      played: 1,
      wins: 1,
      currentStreak: 1,
      maxStreak: 1,
      guessDistribution: {
        3: 1,
      },
    });
  });

  it('resets current streak after a loss without lowering max streak', () => {
    const afterWin = recordGame({
      stats: createEmptyStats(),
      didWin: true,
      guesses: 2,
    });
    const afterLoss = recordGame({
      stats: afterWin,
      didWin: false,
      guesses: 6,
    });

    expect(afterLoss).toMatchObject({
      played: 2,
      wins: 1,
      currentStreak: 0,
      maxStreak: 1,
      guessDistribution: {
        2: 1,
        6: 0,
      },
    });
  });
});
