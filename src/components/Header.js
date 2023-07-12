import nLogo from '../assets/logo.png';
import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <a className={styles.logoLink} href='https://adamjpena.com'>
        <img height='40' width='40' src={nLogo} alt='Adam Pena logo icon' />
      </a>
      <h1 className={styles.heading}>WORDLE</h1>
    </header>
  );
};

export default Header;
