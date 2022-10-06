import React from 'react';
import styles from './styles.module.css';
import { useColorMode } from '@docusaurus/theme-common';


function Hero({ heading, subheading, showGraphic = false }) {
  const { isDarkTheme } = useColorMode();
  return (
    <header className={`${styles.showGraphic} ${styles.Hero} container-fluid`}>
     <div className="container">
     <h1>{heading}</h1>
      <p>{subheading}</p>
     </div>
    </header>
  );
}

export default Hero;

