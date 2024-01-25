import React from 'react'
import styles from './styles.module.css';

const statusColors = {
  enterprise: '#727d91',
  team: '#727d91',
  developer: '#727d91',
  new: '#047377',
  beta: '#047377',
  ga: '#047377',
  'public preview': '#047377',
};

export default function Lifecycle(props) {
  // Check if props.status is an array or a single value
  const statuses = Array.isArray(props.status) ? props.status : [props.status];

  return (
    <>
      {statuses.map((status, index) => {
        const style = {
          backgroundColor: props.backgroundColor || statusColors[status] || '#047377' // Default to teal if no match
        };

        return (
          <span key={index} className={styles.lifecycle} style={style}>
            {status}
          </span>
        );
      })}
    </>
  );
}
