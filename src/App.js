import { useState, useEffect } from 'react';
import TileGrid from './components/TileGrid';
import Overlay from './components/Overlay';
import { words } from './store/words';
import { randomIntFromInterval } from './helpers';
import useLocalStorage from './hooks/useLocalStorage';

import styles from './App.module.scss';
import Keyboard from './components/Keyboard';
import Statistics from './components/Statistics';

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

  const endGame = ({ win = false }) => {
    let updatedGuessDistribution = guessDistribution;
    updatedGuessDistribution[currentRow + 1] += 1;
    setGameOver(true);
    setGameCount(gameCount + 1);
    if (win) {
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      setCurrentRow(currentRow + 1);
      setWinCount(winCount + 1);
      setCompletedWords([...completedWords, word]);
      setGuessDistribution(updatedGuessDistribution);
      setShouldShowStats(true);
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
      return;
    }
    const entryWord = entry.join('');
    let currentEntries = [...entries];
    if (entryWord === word) {
      setMatches(entry);
      currentEntries[currentRow] = entry;
      setEntries(currentEntries);
      endGame({ win: true });
      return;
    }
    // TODO use api to determine if word is real
    const isWord = true;
    if (!isWord) {
      // TODO banner alert: word isn't real
      return;
    }

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
    setGameOver(false);
  };

  return (
    <div className={styles.app}>
      <header className='App-header'>
        <h1 className={styles.heading}>WORDLE</h1>
      </header>
      <main>
        <TileGrid word={word} currentRow={currentRow} entries={entries} />
        <Keyboard
          matches={matches}
          misses={misses}
          setLetter={setLetter}
          removeLetter={removeLetter}
          submitEntry={submitEntry}
        />
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
            />
          </Overlay>
        )}
      </main>
    </div>
  );
};

export default App;
