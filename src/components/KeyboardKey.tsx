import { FC } from 'react';

interface KeyboardKeyProps {
  className: string;
  letter: string;
  setLetter: (letter: string) => void;
}

export const KeyboardKey: FC<KeyboardKeyProps> = ({
  className,
  letter,
  setLetter,
}) => {
  const handleClick = () => {
    setLetter(letter);
  };

  return (
    <button className={className} onClick={handleClick}>
      {letter.toUpperCase()}
    </button>
  );
};
