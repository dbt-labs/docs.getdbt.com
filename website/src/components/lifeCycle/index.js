/* eslint-disable */

import React from 'react';
import styles from './styles.module.css';
import { STATUS_URLS, MANAGED_PLUS,MANAGED, SELF_SERVICE, DEVELOPER } from './lifecycle-urls.js';

// mapping of variable names to their values (both uppercase and lowercase)
const PLAN_VARIABLES = {
  // Uppercase
  'MANAGED_PLUS': MANAGED_PLUS,
  'MANAGED': MANAGED,
  'SELF_SERVICE': SELF_SERVICE,
  'DEVELOPER': DEVELOPER,
  // Lowercase
  'managed_plus': MANAGED_PLUS,
  'managed': MANAGED,
  'self_service': SELF_SERVICE,
  'developer': DEVELOPER,
};

const statusColors = {
  [MANAGED_PLUS]: '#d1d5dc',
  [MANAGED]: '#d1d5dc',
  [SELF_SERVICE]: '#d1d5dc',
  [DEVELOPER]: '#d1d5dc',
  new: '#bab2ff',
  beta: '#bab2ff',
  ga: '#ff9e5f',
  preview: '#ff9e5f',
};

const fontColors = {
  [MANAGED_PLUS]: "#030711",
  [MANAGED]: "#030711",
  [SELF_SERVICE]: "#030711",
  [DEVELOPER]: "#030711",
  preview: "#030711",
  ga: "#030711",
  new: "#ffff",
  beta: "#ffff",
};

// URL mapping for predefined lifecycle statuses. urls defined in ../lifeCycle/lifecycle-urls.js file so we can update them in one place
const statusUrls = STATUS_URLS;

export default function Lifecycle(props) {
  if (!props.status || typeof props.status !== 'string') {
    return null;
  }

  const statuses = props.status.split(',').map(s => {
    const trimmedStatus = s.trim();
    return PLAN_VARIABLES[trimmedStatus] || trimmedStatus;
  });

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
          padding: '4px 8px',
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
