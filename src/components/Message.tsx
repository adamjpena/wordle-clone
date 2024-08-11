import { FC } from 'react';
import styles from './Message.module.scss';

export const Message: FC<{ message: string }> = ({ message }) => {
  return <div className={styles.message}>{message}</div>;
};

export default Message;
