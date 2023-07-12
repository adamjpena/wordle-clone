import { useMemo } from 'react';
import { Confetti } from 'react-confetti-cannon';

const ConfettiLayer = ({ guesses = 6 }) => {
  const launchPoints = useMemo(
    () => [
      () => ({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.9,
        angle: 0,
        spreadAngle: Math.PI,
      }),
    ],
    [],
  );

  return (
    <Confetti
      launchPoints={launchPoints}
      burstAmount={100 - 14 * guesses}
      afterBurstAmount={0}
    />
  );
};

export default ConfettiLayer;
