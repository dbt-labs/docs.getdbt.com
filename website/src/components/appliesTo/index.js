/* eslint-disable */

import React from 'react';
import styles from './styles.module.css';

/**
 * AppliesTo - renders a row of platform pills, like the "Applies to:" banner
 * on a function reference page. Shows users which data platforms a SQL function
 * is available on.
 *
 * Usage in MDX:
 *   <AppliesTo platforms="Snowflake, BigQuery, Redshift" />
 */
export default function AppliesTo({ platforms, label = 'Applies to:' }) {
  if (!platforms || typeof platforms !== 'string') {
    return null;
  }

  const items = platforms
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.appliesTo}>
      <span className={styles.label}>{label}</span>
      {items.map((platform, index) => (
        <span key={index} className={styles.pill}>
          {platform}
        </span>
      ))}
    </div>
  );
}
