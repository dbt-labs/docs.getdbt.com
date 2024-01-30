import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

function detailsToggle({ children, alt_header = null }) {
  const [isOn, setOn] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleToggleClick = () => {
    setOn(current => !current);
  };

  useEffect(() => {
    return () => clearTimeout(hoverTimeout);
  }, [hoverTimeout]);

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

export default detailsToggle;
