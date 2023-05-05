import React from 'react';
import styles from './styles.module.css';

function Hero({ heading, subheading, showGraphic = false, customStyles = {}, classNames = '', colClassNames = '' }) {
  return (
    <header className={` ${styles.Hero} container-fluid ${classNames ? classNames : ''}`} style={customStyles && customStyles}>
      {showGraphic && (
        <div className={styles.showGraphic}></div>
      )}
      <div className={`container`}>
        <div className="row justify-content-center">
          <div className={`col col--7 ${colClassNames ? colClassNames : ''}`}>
            <h1>{heading}</h1>
            <p>{subheading}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;

