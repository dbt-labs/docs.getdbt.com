import React from 'react';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

/**
 * ProductCard - A pill-sized rectangular component with an animated iridescent gradient border.
 * 
 * @param {string} text - The text to display inside the card
 * @param {string} backgroundColor - Optional background color (default: uses theme background)
 * @param {string} colorFrom - Start color for the gradient (default: '#ffaa40')
 * @param {string} colorTo - End color for the gradient (default: '#9c40ff')
 * @param {number} duration - Animation duration in seconds (default: 3)
 * @param {string} url - Optional URL to link to (relative paths open in same window, external URLs open in new tab)
 * @param {string} className - Additional CSS classes
 */
function ProductCard({
  text,
  backgroundColor,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  duration = 3,
  url,
  className = '',
}) {
  const content = (
    <span
      className={`${styles.productCard} ${className}`}
      style={{
        '--color-from': colorFrom,
        '--color-to': colorTo,
        '--animation-duration': `${duration}s`,
        '--bg-color': backgroundColor,
      }}
    >
      <span className={styles.gradientBorder}></span>
      <span className={styles.inner}>
        <span className={styles.text}>{text}</span>
      </span>
    </span>
  );

  if (url) {
    // Check if URL is external (starts with http:// or https://)
    const isExternal = /^https?:\/\//.test(url);

    if (isExternal) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.productCardLink}
          title={text}
        >
          {content}
        </a>
      );
    }

    // Internal link - use Docusaurus Link for client-side routing
    return (
      <Link
        to={url}
        className={styles.productCardLink}
        title={text}
      >
        {content}
      </Link>
    );
  }

  return content;
}

export default ProductCard;

