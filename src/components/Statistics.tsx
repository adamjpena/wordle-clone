import cx from 'classnames';
import styles from './Statistics.module.scss';
import { getDistributionMax, getWinPercentage } from '../game/logic';
import { GameStats, GuessNumber, guessNumbers } from '../game/types';

interface StatisticsProps {
  stats: GameStats;
  lastGuessCount: GuessNumber | null;
  closeStatistics: () => void;
  startNewGame: () => void;
  isWinner: boolean;
}

const Statistics = ({
  stats,
  lastGuessCount,
  closeStatistics,
  startNewGame,
  isWinner,
}: StatisticsProps) => {
  const distributionMax = getDistributionMax(stats.guessDistribution);

  return (
    <div
      className={styles.modal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="statistics-heading"
    >
      <button
        type="button"
        aria-label="Close statistics"
        onClick={closeStatistics}
        className={styles.closeIcon}
      >
        ✕
      </button>
      <div className={styles.container}>
        <h2
          id="statistics-heading"
          className={cx(styles.heading, styles.marginTop0)}
        >
          Statistics
        </h2>
        <table className={styles.mainStats}>
          <tbody>
            <tr>
              <td className={styles.stat}>{stats.played}</td>
              <td className={styles.stat}>{getWinPercentage(stats)}%</td>
              <td className={styles.stat}>{stats.currentStreak}</td>
              <td className={styles.stat}>{stats.maxStreak}</td>
            </tr>
            <tr>
              <td className={styles.label}>Played</td>
              <td className={styles.label}>Win %</td>
              <td className={styles.label}>Current Streak</td>
              <td className={styles.label}>Max Streak</td>
            </tr>
          </tbody>
        </table>
        <h2 className={styles.heading}>Guess Distribution</h2>
        <div className={styles.guessDistribution}>
          {guessNumbers.map((guesses) => {
            const count = stats.guessDistribution[guesses];
            const width = count === 0 ? '0%' : `${(count / distributionMax) * 100}%`;

            return (
              <div key={guesses} className={styles.graphContainer}>
                <div>{guesses}</div>
                <div className={styles.graph}>
                  <div
                    className={cx(styles.graphBar, {
                      [styles.highlight]:
                        isWinner && guesses === lastGuessCount,
                      [styles.alignRight]: count > 0,
                    })}
                    style={{
                      width,
                    }}
                  >
                    <div className={styles.numGuesses}>{count}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={startNewGame}
          className={styles.buttonNewGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default Statistics;
