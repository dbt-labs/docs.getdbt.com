import React from 'react';
import styles from './styles.module.css';

const IntroText = ({ children }) => {
  return (
    <p className={styles.introText}>
      {children}
    </p>
  );
};

export default IntroText;
