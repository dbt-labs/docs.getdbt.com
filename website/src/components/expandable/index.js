/* eslint-disable */

import React, { useState } from 'react';
import styles from './styles.module.css';

function slugify(text) {
  return text.toString().toLowerCase()
    .normalize('NFD') // Normalize to NFD Unicode form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

function expandable({ children, alt_header = null }) {
  const [isOn, setOn] = useState(false);
  // generate a slug from the alt_header
  const anchorId = slugify(alt_header);

  const handleToggleClick = (event) => {
    event.preventDefault();
    setOn(current => !current);
  };

  return (
    <div id={anchorId} className={`${styles.expandableContainer} ${styles.local} expandable-anchor anchor`}>
      <a 
        href={`#${anchorId}`}
        className={styles.link}
        onClick={handleToggleClick}
        role="button"
        tabIndex="0"
      >
        <span className={`${styles.toggle} ${isOn ? styles.toggleDown : styles.toggleRight}`}></span>
        &nbsp;
        <span className={styles.headerText}>{alt_header}</span>
      </a>
      <div 
        style={{ display: isOn ? 'block' : 'none' }} 
        className={styles.body}
      >
        {children}
      </div>
    </div>
  );
}

export default expandable;
