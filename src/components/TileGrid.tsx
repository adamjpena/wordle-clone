import Tile from './Tile';
import cx from 'classnames';
import styles from './TileGrid.module.scss';
import { Board, TileStatus } from '../game/types';

interface TileGridProps {
  currentRow: number;
  entries: Board;
  statuses: TileStatus[][];
  isInvalid: boolean;
}

const TileGrid = ({
  currentRow,
  entries,
  statuses,
  isInvalid,
}: TileGridProps) => {
  return (
    <div className={styles.board} role="grid" aria-label="Word guesses">
      {entries.map((row, rowIndex) => (
        <div
          role="row"
          key={`row-${rowIndex}`}
          className={cx(styles.row, {
            [styles.invalid]: isInvalid && currentRow === rowIndex,
          })}
        >
          {row.map((letter, columnIndex) => (
            <Tile
              key={`row-${rowIndex}-column-${columnIndex}`}
              status={statuses[rowIndex][columnIndex]}
              letter={letter}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TileGrid;
