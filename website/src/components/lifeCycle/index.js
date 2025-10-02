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
  [MANAGED_PLUS]: '#E5E7EB',
  [MANAGED]: '#E5E7EB',
  [SELF_SERVICE]: '#E5E7EB',
  [DEVELOPER]: '#E5E7EB',
  new: '#bab2ff',
  beta: '#bab2ff',
  private_beta: '#bab2ff',
  ga: '#ff9e5f',
  preview: '#FE6703',
  private_preview: '#FE6703',
  // new_constant: '#99A1AF', use this gray color if you want a new color.
};

const fontColors = {
  [MANAGED_PLUS]: "#030711",
  [MANAGED]: "#030711",
  [SELF_SERVICE]: "#030711",
  [DEVELOPER]: "#030711",
  preview: "#030711",
  ga: "#030711",
  new: "#030711",
  beta: "#030711",
  private: "#030711",
  private_beta: "#030711",
  private_preview: "#030711",
};

// Display names for status values
const statusDisplayNames = {
  [MANAGED_PLUS]: MANAGED_PLUS,
  [MANAGED]: MANAGED,
  [SELF_SERVICE]: SELF_SERVICE,
  [DEVELOPER]: DEVELOPER,
  new: 'New',
  beta: 'Beta',
  private_beta: 'Private beta',
  ga: 'GA',
  preview: 'Preview',
  private_preview: 'Private preview',
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
          textDecoration: 'none', // No underline
        };

        // Get display name or fallback to status
        const displayName = statusDisplayNames[status] || status;

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
              {displayName}
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
            {displayName}
          </span>
        );
      })}
    </>
  );
}
