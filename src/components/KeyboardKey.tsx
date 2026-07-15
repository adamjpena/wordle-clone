import cx from 'classnames';
import { TileStatus } from '../game/types';
import styles from './Keyboard.module.scss';

interface KeyboardKeyProps {
  letter: string;
  status?: Exclude<TileStatus, 'empty'>;
  setLetter: (letter: string) => void;
}

export const KeyboardKey = ({
  letter,
  status,
  setLetter,
}: KeyboardKeyProps) => {
  const handleClick = () => {
    setLetter(letter);
  };

  return (
    <button
      type="button"
      className={cx(styles.button, {
        [styles.absent]: status === 'absent',
        [styles.present]: status === 'present',
        [styles.correct]: status === 'correct',
      })}
      aria-label={`Letter ${letter.toUpperCase()}`}
      onClick={handleClick}
    >
      {letter.toUpperCase()}
    </button>
  );
};
