import { useState, useEffect } from 'react';
import { words } from './store/game-words';
import { wordsDictionary } from './store/dictionary-five-letters';
import { randomIntFromInterval } from './helpers';
import useLocalStorage from './hooks/useLocalStorage';

import Header from './components/Header';
import Message from './components/Message';
import TileGrid from './components/TileGrid';
import Overlay from './components/Overlay';
import Keyboard from './components/Keyboard';
import Statistics from './components/Statistics';
import ConfettiLayer from './components/ConfettiLayer';

import styles from './App.module.scss';

const MESSAGES = {
  notEnoughLetters: 'Not enough letters',
  notInWordList: 'Not in word list',
  endGame: ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'],
};
const ROW_COUNT = 6;
const COLUMN_COUNT = 5;

const App = () => {
  const [completedWords, setCompletedWords] = useLocalStorage(
    'completedWords',
    [],
  );
  const [gameCount, setGameCount] = useLocalStorage('gameCount', 0);
  const [winCount, setWinCount] = useLocalStorage('winCount', 0);
  const [streak, setStreak] = useLocalStorage('winCount', 0);
  const [maxStreak, setMaxStreak] = useLocalStorage('winCount', 0);
  const [guessDistribution, setGuessDistribution] = useLocalStorage(
    'guessDistribution',
    {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    },
  );

  const wordsToRemove = new Set(completedWords);
  const nonCompletedWords = words.filter((x) => !wordsToRemove.has(x));
  const [word, setWord] = useState(
    nonCompletedWords[randomIntFromInterval(0, nonCompletedWords.length)],
  );
  const [entries, setEntries] = useState(
    Array.from({ length: ROW_COUNT }, () => Array(COLUMN_COUNT).fill('')),
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [matches, setMatches] = useState([]);
  const [misses, setMisses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [shouldShowStats, setShouldShowStats] = useState(false);
  const [shouldShowConfetti, setShouldShowConfetti] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [message, setMessage] = useState(null);
  const [isWinner, setIsWinner] = useState(false);

  const showMessage = ({ message, invalid = false }) => {
    setMessage(message);
    if (invalid) {
      setIsInvalid(true);
    }
    let messageTimeout = setTimeout(() => {
      setMessage(null);
      if (invalid) {
        setIsInvalid(false);
      }
      clearInterval(messageTimeout);
    }, 2500);
  };
  const endGame = ({ win = false }) => {
    showMessage({
      message: win ? MESSAGES.endGame[currentRow] : word.toUpperCase(),
    });
    setGameOver(true);
    setGameCount(gameCount + 1);
    if (win) {
      setIsWinner(true);
      let updatedGuessDistribution = guessDistribution;
      updatedGuessDistribution[currentRow + 1] += 1;
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      setCurrentRow(currentRow + 1);
      setWinCount(winCount + 1);
      setCompletedWords([...completedWords, word]);
      setGuessDistribution(updatedGuessDistribution);
      setShouldShowConfetti(true);
      let showStatsTimeout = setTimeout(() => {
        setShouldShowStats(true);
        clearInterval(showStatsTimeout);
      }, 2500);
      return;
    }
    setStreak(0);
    setShouldShowStats(true);
  };

  const submitEntry = () => {
    if (gameOver) {
      return;
    }
    const entry = entries[currentRow];
    if (entry.includes('')) {
      showMessage({ message: MESSAGES.notEnoughLetters, invalid: true });
      return;
    }
    const entryWord = entry.join('');
    let currentEntries = [...entries];
    if (entryWord === word) {
      setIsInvalid(false);
      setMatches(entry);
      currentEntries[currentRow] = entry;
      setEntries(currentEntries);
      endGame({ win: true });
      return;
    }
    if (!wordsDictionary.includes(entryWord)) {
      showMessage({ message: MESSAGES.notInWordList, invalid: true });
      return;
    }
    setIsInvalid(false);
    setCurrentRow(currentRow + 1);
    currentEntries[currentRow] = entry;
    setEntries(currentEntries);
    const currentMatches = entry.filter((letter) => word.includes(letter));
    setMatches(Array.from(new Set([...currentMatches, ...matches])));
    const currentMisses = entry.filter((letter) => !word.includes(letter));
    setMisses(Array.from(new Set([...currentMisses, ...misses])));
    if (currentRow === ROW_COUNT - 1) {
      endGame({ win: false });
    }
  };

  const setLetter = (letter) => {
    if (gameOver) {
      return;
    }
    let currentEntries = [...entries];
    let currentEntryArray = entries[currentRow];
    const firstEmptyTile = currentEntryArray.indexOf('');
    if (firstEmptyTile === -1) {
      return;
    }
    currentEntryArray[firstEmptyTile] = letter;
    currentEntries[currentRow] = currentEntryArray;
    setEntries(currentEntries);
  };

  const removeLetter = () => {
    let currentEntryArray = entries[currentRow];
    const firstEmptyTile = currentEntryArray.indexOf('');
    if (firstEmptyTile === 0) {
      return;
    }
    let currentEntries = [...entries];
    currentEntryArray[
      firstEmptyTile === -1 ? COLUMN_COUNT - 1 : firstEmptyTile - 1
    ] = '';
    currentEntries[currentRow] = currentEntryArray;
    setEntries(currentEntries);
  };

  const handleKeyPress = (e) => {
    e.preventDefault();
    if (e.keyCode === 8) {
      removeLetter();
      return;
    }
    if (e.keyCode === 13) {
      submitEntry();
      return;
    }
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      setLetter(e.key.toLowerCase());
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });

  if (process.env.NODE_ENV === 'development') {
    // show word for dev purposes
    console.log(word);
  }

  const startNewGame = () => {
    const wordsToRemove = new Set(completedWords);
    const nonCompletedWords = words.filter((x) => !wordsToRemove.has(x));
    setEntries(
      Array.from({ length: ROW_COUNT }, () => Array(COLUMN_COUNT).fill('')),
    );
    setWord(
      nonCompletedWords[randomIntFromInterval(0, nonCompletedWords.length)],
    );
    setCurrentRow(0);
    setMatches([]);
    setMisses([]);
    setShouldShowStats(false);
    setShouldShowConfetti(false);
    setIsWinner(false);
    setGameOver(false);
  };

  return (
    <div className={styles.app}>
      <Header />
      <main>
        {message && <Message message={message} />}
        <TileGrid
          word={word}
          currentRow={currentRow}
          entries={entries}
          isInvalid={isInvalid}
        />
        <Keyboard
          matches={matches}
          misses={misses}
          setLetter={setLetter}
          removeLetter={removeLetter}
          submitEntry={submitEntry}
        />
        {shouldShowConfetti && <ConfettiLayer guesses={currentRow + 1} />}
        {shouldShowStats && (
          <Overlay>
            <Statistics
              gameCount={gameCount}
              winCount={winCount}
              streak={streak}
              maxStreak={maxStreak}
              guessDistribution={guessDistribution}
              currentRow={currentRow}
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
