/* eslint-disable */

import React from 'react';
import styles from './styles.module.css';
import { STATUS_URLS } from './lifecycle-urls.js';

const statusColors = {
  enterprise: '#EBEDF0',
  team: '#EBEDF0',
  developer: '#EBEDF0',
  new: '#047377',
  beta: '#047377',
  ga: '#047377',
  preview: '#047377',
};

const fontColors = {
  enterprise: '#262A38',
  team: '#262A38',
  developer: '#262A38',
  preview: '#ffff',
  beta: '#ffff',
  ga: '#ffff',
};

// URL mapping for predefined lifecycle statuses. urls defined in ../lifeCycle/lifecycle-urls.js file so we can update them in one place
const statusUrls = STATUS_URLS;

export default function Lifecycle(props) {
  const statuses = props.status?.split(',');
  if (!props.status || !statuses?.length) {
    return null;
  }

  return (
    <>
      {statuses.map((status, index) => {
        const isKnownStatus = Object.prototype.hasOwnProperty.call(statusColors, status);
        const url = isKnownStatus ? statusUrls[status] || props.customUrl || null : null;

        const style = {
          backgroundColor: props.backgroundColor || statusColors[status] || '#d3d3d3', // Default gray for unknown status
          color: fontColors[status] || '#000', // Default black for unknown status
          cursor: url ? 'pointer' : 'default', // Non-clickable for unknown status
          transition: 'background-color 0.2s ease, transform 0.2s ease, text-decoration 0.2s ease',
          padding: '5px 10px',
          borderRadius: '16px',
          textDecoration: url ? 'underline' : 'none', // Underline for clickable pills only
        };

        // Render a clickable pill for known statuses with a URL
        if (url) {
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.lifecycle} lifecycle`}
              style={style}
              title={`Go to ${url}`} // optional tooltip for better UX
            >
              {status}
            </a>
          );
        }

        // Render a static pill for unknown or unlinked statuses
        return (
          <span
            key={index}
            className={`${styles.lifecycle} lifecycle`}
            style={style}
          >
            {status}
          </span>
        );
      })}
    </>
  );
}
