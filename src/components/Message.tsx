import { FC } from 'react';
import styles from './Message.module.scss';

export const Message: FC<{ message: string }> = ({ message }) => {
  return (
    <div className={styles.message} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default Message;
