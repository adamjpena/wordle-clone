import styles from './Tile.module.scss';
import cx from 'classnames';

const Tile = ({
  isAbsent = false,
  isPresent = false,
  isCorrect = false,
  letter = '',
}) => {
  return (
    <td
      className={cx(styles.tile, {
        [styles.absent]: isAbsent,
        [styles.present]: isPresent,
        [styles.correct]: isCorrect,
      })}
    >
      {letter.toUpperCase()}
    </td>
  );
};

export default Tile;
