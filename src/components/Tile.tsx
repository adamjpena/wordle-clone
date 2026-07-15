import styles from './Tile.module.scss';
import cx from 'classnames';
import { TileStatus } from '../game/types';

interface TileProps {
  status: TileStatus;
  letter: string;
}

const Tile = ({ status, letter }: TileProps) => {
  const displayLetter = letter.toUpperCase();

  return (
    <div
      role="gridcell"
      aria-label={displayLetter ? `${displayLetter}, ${status}` : 'Empty tile'}
      className={cx(styles.tile, {
        [styles.absent]: status === 'absent',
        [styles.present]: status === 'present',
        [styles.correct]: status === 'correct',
      })}
    >
      {displayLetter}
    </div>
  );
};

export default Tile;
