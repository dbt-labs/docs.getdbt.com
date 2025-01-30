/* eslint-disable */

import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import Lifecycle from '../lifeCycle';

function slugify(text) {
  return text.toString().toLowerCase()
    .normalize('NFD') // normalize to nfd unicode form
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-') // replace multiple - with a single -
    .replace(/^-+/, '') // trim - from the start
    .replace(/-+$/, ''); // trim - from the end
}

function Expandable({ children, alt_header = null, lifecycle }) {
  if (!alt_header) { return null; }
  const [isOn, setOn] = useState(false);
  const anchorId = slugify(alt_header);

  const handleToggleClick = (event) => {
    event.preventDefault();
    setOn(current => !current);
  };

  const handleCopyClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const url = `${window.location.href.split('#')[0]}#${anchorId}`;
    navigator.clipboard.writeText(url).then(() => {
      showCopyPopup();
    });
  };

  const showCopyPopup = () => {
    const popup = document.createElement('div');
    popup.classList.add('copy-popup');
    popup.innerText = 'Link copied!';

    // Add close button ('x')
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = ' &times;'; // '×' symbol for 'x'
    closeButton.addEventListener('click', () => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    });
    popup.appendChild(closeButton);

    document.body.appendChild(popup);

    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }, 3000);
  };

  useEffect(() => {
    if (window.location.hash === `#${anchorId}`) {
      setOn(true);
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [anchorId]);

  return (
    <div id={anchorId} className={`${styles.expandableContainer}`}>
      <div className={styles.header} onClick={handleToggleClick}>
        <span className={`${styles.toggle} ${isOn ? styles.toggleDown : styles.toggleRight}`}></span>
        &nbsp;
        <span className={styles.headerText}>
          {alt_header}
          <span onClick={(e) => e.stopPropagation()}>
            <Lifecycle status={lifecycle} />
          </span>
        </span>
        <span onClick={handleCopyClick} className={styles.copyIcon}></span>
      </div>
      <div style={{ display: isOn ? 'block' : 'none' }} className={styles.body}>
        {children}
      </div>
    </div>
  );
}

export default Expandable;
