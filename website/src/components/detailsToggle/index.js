import React, { useState } from 'react';
import styles from './styles.module.css';

function DetailsToggle({ children, alt_header = null }) {
  const [isOn, setOn] = useState(false);

  const handleToggleClick = () => {
    setOn(current => !current);
  };


  return (
    <div className='detailsToggle'>
      <span 
        className={styles.link} 
        onClick={handleToggleClick}
      >
        <span className={`${styles.toggle} ${isOn ? null : styles.toggleUpsideDown}`}></span>&nbsp;
        <span className={styles.headerText}>{alt_header}</span>
      </span>
      <div 
        style={{ display: isOn ? 'block' : 'none' }} 
        className={styles.body}
      >
        {children}
      </div>
    </div>
  );
}

export default DetailsToggle;
