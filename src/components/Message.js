import styles from './Message.module.scss';

export const Message = (message) => {
  return <div className={styles.message}>{message}</div>;
};

export default Message;
