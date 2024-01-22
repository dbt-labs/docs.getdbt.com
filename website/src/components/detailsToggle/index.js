import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

function detailsToggle({ children, alt_header = null }) {
  const [isOn, setOn] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // New state to track scrolling
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleToggleClick = () => {
    setOn(current => !current); // Toggle the current state
  };

  const handleMouseEnter = () => {
    if (isOn || isScrolling) return; // Ignore hover if already open or if scrolling
    const timeout = setTimeout(() => {
      if (!isScrolling) setOn(true);
    }, 700); // 
    setHoverTimeout(timeout);
  };
  
  const handleMouseLeave = () => {
    if (!isOn) {
      clearTimeout(hoverTimeout);
      setOn(false);
    }
  };

  const handleScroll = () => {
    if (isOn)  {
      setIsScrolling(true);
      clearTimeout(hoverTimeout);
      setOn(false);
  }

    // Reset scrolling state after a  delay
    setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
        <span className={styles.headerText}>{alt_header}</span>
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
