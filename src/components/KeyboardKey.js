export function KeyboardKey({ className, letter, setLetter }) {
  const handleClick = () => {
    setLetter(letter);
  };
  return (
    <button className={className} onClick={handleClick}>
      {letter.toUpperCase()}
    </button>
  );
}
