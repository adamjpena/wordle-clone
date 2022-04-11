import { KeyboardKey } from './KeyboardKey';
import cx from 'classnames';

import styles from './Keyboard.module.scss';

const Keyboard = ({
  matches = [],
  misses = [],
  setLetter,
  removeLetter,
  submitEntry,
}) => {
  const keyboardLetters = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];
  return (
    <table className={styles.keyboard}>
      <tbody>
        {keyboardLetters.map((keyboardRow, i) => {
          const isLastRow = i === keyboardLetters.length - 1;
          return (
            <tr className={styles.row} key={`keyboard-row-${i}`}>
              {isLastRow && (
                <td>
                  <button
                    className={cx(styles.button, styles.special)}
                    onClick={submitEntry}
                  >
                    ENTER
                  </button>
                </td>
              )}
              {keyboardRow.map((letter) => {
                const isInMatches = matches.includes(letter);
                const isInMisses = misses.includes(letter);
                return (
                  <td className={styles.cell} key={`keyboard-key-${letter}`}>
                    <KeyboardKey
                      className={cx(styles.button, {
                        [styles.absent]: isInMisses,
                        [styles.correct]: isInMatches,
                      })}
                      letter={letter}
                      setLetter={setLetter}
                    />
                  </td>
                );
              })}
              {isLastRow && (
                <td>
                  <button
                    className={cx(styles.button, styles.special)}
                    onClick={removeLetter}
                  >
                    ⌫
                  </button>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Keyboard;
