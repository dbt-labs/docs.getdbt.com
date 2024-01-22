import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

function DetailsToggle({ children, alt_header = null, index }) {
  const [isOn, setOn] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const handleToggleClick = () => {
    if (isOn) {
      closeToggle();
    } else {
      closePreviouslyOpenToggle();
      openToggle();
    }
  };

  const handleMouseEnter = () => {
    if (isScrolling) return;
    const timeout = setTimeout(() => {
      closeToggle(); // close the toggle first
      openToggle(); // then open it
    }, 700);
    setHoverTimeout(timeout);
    closePreviouslyOpenToggle();
  };

  const handleMouseLeave = () => {
    if (!isOn) {
      clearTimeout(hoverTimeout);
      closeToggle();
    }
  };

  const handleScroll = () => {
    setIsScrolling(true);
    clearTimeout(hoverTimeout);

    if (isOn) {
      closeToggle();
    }

    setTimeout(() => {
      setIsScrolling(false);
    }, 300);
  };

  const openToggle = () => {
    setOn(true);
  };

  const closeToggle = () => {
    setOn(false);
  };

  const closePreviouslyOpenToggle = () => {
    const allToggles = document.querySelectorAll('.detailsToggle');
    allToggles.forEach((toggle, toggleIndex) => {
      if (toggleIndex !== index) {
        const toggleIsOpen = toggle.querySelector(`.${styles.body}`).style.display === 'block';
        if (toggleIsOpen) {
          toggle.querySelector(`.${styles.body}`).style.display = 'none';
        }
      }
    });
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

export default DetailsToggle;
