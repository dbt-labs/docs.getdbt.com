import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

function detailsToggle({ children, alt_header = null }) {
  const [isOn, setOn] = useState(false);
  const [hoverActive, setHoverActive] = useState(true);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleToggleClick = () => {
    setHoverActive(true); // Disable hover when clicked
    setOn(current => !current); // Toggle the current state
};

const handleMouseEnter = () => {
  if (isOn) return; // Ignore hover if already open
  setHoverActive(true); // Enable hover
  const timeout = setTimeout(() => {
      if (hoverActive) setOn(true);
  }, 500); 
  setHoverTimeout(timeout);
};

const handleMouseLeave = () => {
  if (!isOn) {
      clearTimeout(hoverTimeout);
      setOn(false);
  }
};

useEffect(() => {
  return () => clearTimeout(hoverTimeout);
}, [hoverTimeout]);

  return (
    <div className='detailsToggle'>
      <span 
        className={styles.link} 
        onClick={handleToggleClick}
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <span className={`${styles.toggle} ${isOn ? null : styles.toggleUpsideDown}`}></span>&nbsp;
        <span>{alt_header}</span>
        {/* Visual disclaimer */}
        <small className={styles.disclaimer}>Hover to view</small>
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
