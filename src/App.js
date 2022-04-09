import { useState } from 'react';
import TileGrid from './components/TileGrid';
import { words } from './store/words';
import { randomIntFromInterval } from './helpers';
import useLocalStorage from './hooks/useLocalStorage';

import './App.scss';
import Keyboard from './components/Keyboard';

const ROW_COUNT = 6;
const COLUMN_COUNT = 5;

const App = () => {
  const [completedWords, setCompletedWords] = useLocalStorage(
    'completedWords',
    [],
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

  const submitEntry = () => {
    if (currentRow > ROW_COUNT - 1) {
      return;
    }
    const entry = entries[currentRow];
    if (entry.includes('')) {
      return;
    }
    const entryWord = entry.join('');
    let currentEntries = [...entries];
    if (entryWord === word) {
      setCurrentRow(currentRow + 1);
      currentEntries[currentRow] = entry;
      setEntries(currentEntries);
      setMatches(entry);
      setGameOver(true);
      setCompletedWords([...completedWords, word]);
      // TODO add celebration
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
  };

  const setLetter = (letter) => {
    if (gameOver) {
      return;
    }
    if (currentRow > ROW_COUNT - 1) {
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
    if (currentRow > ROW_COUNT - 1) {
      return;
    }
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

  return (
    <div className='App'>
      <header className='App-header'>
        <h1>WORDLE</h1>
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
      </main>
    </div>
  );
};

export default App;
