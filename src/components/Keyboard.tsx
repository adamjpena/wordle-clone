import { KeyboardKey } from './KeyboardKey';
import cx from 'classnames';
import styles from './Keyboard.module.scss';
import { KEYBOARD_ROWS } from '../game/constants';
import { KeyboardStatus } from '../game/types';

interface KeyboardProps {
  keyStatuses: KeyboardStatus;
  setLetter: (letter: string) => void;
  removeLetter: () => void;
  submitEntry: () => void;
}

const Keyboard = ({
  keyStatuses,
  setLetter,
  removeLetter,
  submitEntry,
}: KeyboardProps) => {
  return (
    <div className={styles.keyboard} aria-label="Keyboard">
      {KEYBOARD_ROWS.map((keyboardRow, rowIndex) => {
        const isLastRow = rowIndex === KEYBOARD_ROWS.length - 1;

        return (
          <div className={styles.row} key={`keyboard-row-${rowIndex}`}>
            {isLastRow && (
              <button
                type="button"
                className={cx(styles.button, styles.special)}
                onClick={submitEntry}
              >
                Enter
              </button>
            )}
            {keyboardRow.map((letter) => (
              <KeyboardKey
                key={`keyboard-key-${letter}`}
                letter={letter}
                status={keyStatuses[letter]}
                setLetter={setLetter}
              />
            ))}
            {isLastRow && (
              <button
                type="button"
                className={cx(styles.button, styles.special)}
                aria-label="Backspace"
                onClick={removeLetter}
              >
                ⌫
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Keyboard;
