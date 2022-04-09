import Tile from './Tile';

import styles from './TileGrid.module.scss';

const TileGrid = ({ word, currentRow, entries }) => {
  return (
    <table className={styles.table}>
      <tbody className={styles.tbody}>
        {entries.map((row, i) => {
          const isFrozen = currentRow > i;
          return (
            <tr key={`row-${i}`} className={styles.row}>
              {row.map((letter, j) => {
                const isAbsent = isFrozen && !word.includes(letter);
                const isPresent = isFrozen && word.includes(letter);
                const isCorrect = isFrozen && word[j] === letter;
                return (
                  <Tile
                    key={`row-${i}-column-${j}`}
                    isAbsent={isAbsent}
                    isPresent={isPresent}
                    isCorrect={isCorrect}
                    letter={letter}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TileGrid;
