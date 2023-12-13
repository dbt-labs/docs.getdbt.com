import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

function detailsToggle({ children, alt_header = null }) {
  const [isOn, setOn] = useState(false);
  const [hoverActive, setHoverActive] = useState(true);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleToggleClick = () => {
    setOn(!isOn);
    setHoverActive(false); // Disable hover effect after click
  };

  const handleMouseEnter = () => {
    if (!hoverActive) return; // Ignore hover if disabled
    const timeout = setTimeout(() => {
      setOn(true);
    }, 300); // 300ms delay
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
    setOn(false); // Hide content and deactivate hover
    setHoverActive(true); // Re-enable hover for next interaction
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
        <span className={styles.toggle}></span>&nbsp;
        <span>{alt_header}</span>
        {/* Disclaimer or visual cue */}
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
