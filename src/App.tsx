import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { words } from './store/game-words';
import { wordsDictionary } from './store/dictionary-five-letters';
import {
  MESSAGES,
  ROW_COUNT,
  STORAGE_KEYS,
} from './game/constants';
import {
  chooseRandomWord,
  getBoardStatuses,
  getKeyboardStatuses,
  isCompleteGuess,
  isValidGuess,
  normalizeGuess,
  normalizeStats,
  recordGame,
} from './game/logic';
import { getInitialStats, normalizeCompletedWords } from './game/storage';
import {
  GameStats,
  GuessNumber,
  createEmptyBoard,
} from './game/types';
import { useLocalStorage } from './hooks/useLocalStorage';

import Header from './components/Header';
import Message from './components/Message';
import TileGrid from './components/TileGrid';
import Overlay from './components/Overlay';
import Keyboard from './components/Keyboard';
import Statistics from './components/Statistics';
import ConfettiLayer from './components/ConfettiLayer';

import styles from './App.module.scss';

const messageDurationMs = 2500;

const toGuessNumber = (value: number): GuessNumber => {
  if (value < 1 || value > ROW_COUNT) {
    throw new Error(`Invalid guess count: ${value}`);
  }

  return value as GuessNumber;
};

const App = () => {
  const [completedWords, setCompletedWords] = useLocalStorage<string[]>(
    STORAGE_KEYS.completedWords,
    [],
    normalizeCompletedWords
  );
  const [stats, setStats] = useLocalStorage<GameStats>(
    STORAGE_KEYS.stats,
    getInitialStats,
    normalizeStats
  );
  const [word, setWord] = useState(() =>
    chooseRandomWord({ words, completedWords })
  );
  const [entries, setEntries] = useState(createEmptyBoard);
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [shouldShowStats, setShouldShowStats] = useState(false);
  const [shouldShowConfetti, setShouldShowConfetti] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isWinner, setIsWinner] = useState(false);
  const [lastGuessCount, setLastGuessCount] = useState<GuessNumber | null>(
    null
  );
  const messageTimeoutRef = useRef<number | null>(null);
  const statsTimeoutRef = useRef<number | null>(null);

  const clearMessageTimeout = useCallback(() => {
    if (messageTimeoutRef.current !== null) {
      window.clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
  }, []);

  const clearStatsTimeout = useCallback(() => {
    if (statsTimeoutRef.current !== null) {
      window.clearTimeout(statsTimeoutRef.current);
      statsTimeoutRef.current = null;
    }
  }, []);

  const showMessage = useCallback(
    ({
      nextMessage,
      invalid = false,
    }: {
      nextMessage: string;
      invalid?: boolean;
    }) => {
      clearMessageTimeout();
      setMessage(nextMessage);
      setIsInvalid(invalid);

      messageTimeoutRef.current = window.setTimeout(() => {
        setMessage(null);
        setIsInvalid(false);
        messageTimeoutRef.current = null;
      }, messageDurationMs);
    },
    [clearMessageTimeout]
  );

  const boardStatuses = useMemo(
    () =>
      getBoardStatuses({
        board: entries,
        answer: word,
        submittedRows: currentRow,
      }),
    [currentRow, entries, word]
  );

  const keyboardStatuses = useMemo(
    () =>
      getKeyboardStatuses({
        board: entries,
        answer: word,
        submittedRows: currentRow,
      }),
    [currentRow, entries, word]
  );

  const setLetter = useCallback(
    (letter: string) => {
      if (gameOver || currentRow >= ROW_COUNT || !/^[a-z]$/.test(letter)) {
        return;
      }

      setEntries((currentEntries) => {
        const currentEntry = [...currentEntries[currentRow]];
        const firstEmptyTile = currentEntry.indexOf('');

        if (firstEmptyTile === -1) {
          return currentEntries;
        }

        currentEntry[firstEmptyTile] = letter;

        return currentEntries.map((row, rowIndex) =>
          rowIndex === currentRow ? currentEntry : row
        );
      });
    },
    [currentRow, gameOver]
  );

  const removeLetter = useCallback(() => {
    if (gameOver || currentRow >= ROW_COUNT) {
      return;
    }

    setEntries((currentEntries) => {
      const currentEntry = [...currentEntries[currentRow]];
      const firstEmptyTile = currentEntry.indexOf('');
      const letterIndex =
        firstEmptyTile === -1 ? currentEntry.length - 1 : firstEmptyTile - 1;

      if (letterIndex < 0) {
        return currentEntries;
      }

      currentEntry[letterIndex] = '';

      return currentEntries.map((row, rowIndex) =>
        rowIndex === currentRow ? currentEntry : row
      );
    });
  }, [currentRow, gameOver]);

  const endGame = useCallback(
    ({ didWin, guesses }: { didWin: boolean; guesses: GuessNumber }) => {
      setGameOver(true);
      setIsWinner(didWin);
      setLastGuessCount(guesses);
      setStats((currentStats) =>
        recordGame({ stats: currentStats, didWin, guesses })
      );

      if (didWin) {
        setCompletedWords((currentCompletedWords) =>
          currentCompletedWords.includes(word)
            ? currentCompletedWords
            : [...currentCompletedWords, word]
        );
        setShouldShowConfetti(true);
        showMessage({ nextMessage: MESSAGES.endGame[guesses - 1] });
        clearStatsTimeout();
        statsTimeoutRef.current = window.setTimeout(() => {
          setShouldShowStats(true);
          statsTimeoutRef.current = null;
        }, messageDurationMs);
        return;
      }

      showMessage({ nextMessage: word.toUpperCase() });
      setShouldShowStats(true);
    },
    [
      clearStatsTimeout,
      setCompletedWords,
      setStats,
      showMessage,
      word,
    ]
  );

  const submitEntry = useCallback(() => {
    if (gameOver || currentRow >= ROW_COUNT) {
      return;
    }

    const entry = entries[currentRow];

    if (!isCompleteGuess(entry)) {
      showMessage({
        nextMessage: MESSAGES.notEnoughLetters,
        invalid: true,
      });
      return;
    }

    const guess = normalizeGuess(entry);

    if (!isValidGuess({ guess, answer: word, dictionary: wordsDictionary })) {
      showMessage({
        nextMessage: MESSAGES.notInWordList,
        invalid: true,
      });
      return;
    }

    const guesses = toGuessNumber(currentRow + 1);
    const didWin = guess === word;

    setIsInvalid(false);
    setCurrentRow((row) => row + 1);

    if (didWin || currentRow === ROW_COUNT - 1) {
      endGame({ didWin, guesses });
    }
  }, [currentRow, endGame, entries, gameOver, showMessage, word]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key === 'Backspace') {
        event.preventDefault();
        removeLetter();
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        submitEntry();
        return;
      }

      if (/^[a-zA-Z]$/.test(event.key)) {
        event.preventDefault();
        setLetter(event.key.toLowerCase());
      }
    },
    [removeLetter, setLetter, submitEntry]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    return () => {
      clearMessageTimeout();
      clearStatsTimeout();
    };
  }, [clearMessageTimeout, clearStatsTimeout]);

  const startNewGame = useCallback(() => {
    clearMessageTimeout();
    clearStatsTimeout();
    setEntries(createEmptyBoard());
    setWord(chooseRandomWord({ words, completedWords }));
    setCurrentRow(0);
    setShouldShowStats(false);
    setShouldShowConfetti(false);
    setIsWinner(false);
    setLastGuessCount(null);
    setGameOver(false);
    setIsInvalid(false);
    setMessage(null);
  }, [clearMessageTimeout, clearStatsTimeout, completedWords]);

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.main}>
        {message && <Message message={message} />}
        <TileGrid
          entries={entries}
          isInvalid={isInvalid}
          statuses={boardStatuses}
          currentRow={currentRow}
        />
        <Keyboard
          keyStatuses={keyboardStatuses}
          setLetter={setLetter}
          removeLetter={removeLetter}
          submitEntry={submitEntry}
        />
        {shouldShowConfetti && lastGuessCount && (
          <ConfettiLayer guesses={lastGuessCount} />
        )}
        {shouldShowStats && (
          <Overlay>
            <Statistics
              stats={stats}
              lastGuessCount={lastGuessCount}
              startNewGame={startNewGame}
              closeStatistics={startNewGame}
              isWinner={isWinner}
            />
          </Overlay>
        )}
      </main>
    </div>
  );
};

export default App;
