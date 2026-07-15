import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ROW_COUNT } from '../game/constants';
import { GuessNumber } from '../game/types';

interface ConfettiLayerProps {
  guesses: GuessNumber;
}

const ConfettiLayer = ({ guesses }: ConfettiLayerProps) => {
  useEffect(() => {
    confetti({
      particleCount: Math.max(48, 120 - guesses * 12),
      spread: 70,
      origin: { x: 0.5, y: 0.85 },
      ticks: 220 - (ROW_COUNT - guesses) * 12,
    });
  }, [guesses]);

  return null;
};

export default ConfettiLayer;
