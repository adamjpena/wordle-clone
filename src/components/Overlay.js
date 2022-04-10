import styles from './Overlay.module.scss';

const Overlay = ({ children }) => {
  return <div className={styles.overlay}>{children}</div>;
};

export default Overlay;
