 /* eslint-disable */
 
 import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import Lifecycle from '../lifeCycle';

function slugify(text) {
  return text.toString().toLowerCase()
    .normalize('NFD') // Normalize to NFD Unicode form
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with a single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

function Expandable({ children, alt_header = null, lifecycle }) {
  if (!alt_header) return null;

  const [isOpen, setIsOpen] = useState(false);
  const detailsRef = useRef(null);
  const anchorId = slugify(alt_header);

  // Handles clicking on the header to expand/collapse
  const handleToggleClick = (event) => {
    event.preventDefault();
    setIsOpen((prev) => !prev);
  };

  // Copy link function
  const handleCopyClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const url = `${window.location.href.split('#')[0]}#${anchorId}`;
    navigator.clipboard.writeText(url).then(() => showCopyPopup());
  };

  // Show "Link Copied!" popup
  const showCopyPopup = () => {
    const popup = document.createElement('div');
    popup.classList.add('copy-popup');
    popup.innerText = 'Link copied!';

    // Close button ('x')
    const closeButton = document.createElement('span');
    closeButton.classList.add('close-button');
    closeButton.innerHTML = ' &times;';
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

  // Auto-expand when linked via hash (URL fragment)
  useEffect(() => {
    if (window.location.hash === `#${anchorId}`) {
      setIsOpen(true);
      detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [anchorId]);

  // Observe search highlight and auto-expand
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const details = detailsRef.current;
      if (details && details.querySelector('mark')) {
        details.open = true;
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <details ref={detailsRef} id={anchorId} className={styles.expandableContainer} open={isOpen}>
      <summary className={styles.header} onClick={handleToggleClick}>
        <span className={`${styles.toggle} ${isOpen ? styles.toggleDown : styles.toggleRight}`}></span>
        &nbsp;
        <span className={styles.headerText}>
          {alt_header}
          <span onClick={(e) => e.stopPropagation()}>
            <Lifecycle status={lifecycle} />
          </span>
        </span>
        <span onClick={handleCopyClick} className={styles.copyIcon}></span>
      </summary>
      <div className={styles.body}>
        {children}
      </div>
    </details>
  );
}

export default Expandable;
