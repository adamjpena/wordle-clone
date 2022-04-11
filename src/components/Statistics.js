import cx from 'classnames';

import styles from './Statistics.module.scss';

const Statistics = ({
  gameCount,
  winCount,
  streak,
  maxStreak,
  guessDistribution,
  currentRow,
  closeStatistics,
  startNewGame,
  isWinner,
}) => {
  return (
    <div className={styles.modal}>
      <button onClick={closeStatistics} className={styles.closeIcon}>
        ✕
      </button>
      <div className={styles.container}>
        <h1 className={cx(styles.heading, styles.marginTop0)}>STATISTICS</h1>
        <table className={styles.mainStats}>
          <tbody>
            <tr>
              <td className={styles.stat}>{gameCount}</td>
              <td className={styles.stat}>
                {Math.floor((winCount / gameCount) * 100)}%
              </td>
              <td className={styles.stat}>{streak}</td>
              <td className={styles.stat}>{maxStreak}</td>
            </tr>
            <tr>
              <td className={styles.label}>Played</td>
              <td className={styles.label}>Win %</td>
              <td className={styles.label}>Current Streak</td>
              <td className={styles.label}>Max Streak</td>
            </tr>
          </tbody>
        </table>
        <h1 className={styles.heading}>GUESS DISTRIBUTION</h1>
        <div className={styles.guessDistribution}>
          {Object.entries(guessDistribution).map(([guesses, count]) => {
            return (
              <div key={guesses} className={styles.graphContainer}>
                <div>{guesses}</div>
                <div className={styles.graph}>
                  <div
                    className={cx(styles.graphBar, {
                      [styles.highlight]:
                        isWinner && parseInt(guesses) === currentRow,
                      [styles.alignRight]: count > 0,
                    })}
                    style={{
                      width:
                        count === 0
                          ? 0
                          : `${Math.floor((count / winCount) * 100)}%`,
                    }}
                  >
                    <div className={styles.numGuesses}>{count}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={startNewGame} className={styles.buttonNewGame}>
          NEW GAME
        </button>
      </div>
    </div>
  );
};

export default Statistics;
