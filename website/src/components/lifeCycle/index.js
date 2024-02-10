import React from 'react'
import styles from './styles.module.css';

const statusColors = {
  enterprise: '#EBEDF0',
  team: '#EBEDF0',
  developer: '#EBEDF0',
  new: '#047377',
  beta: '#047377',
  ga: '#047377',
  'public preview': '#047377',
};

const fontColors = {
    enterprise: '#262A38',
    team: '#262A38', 
    developer: '#262A38', 
    // lifecycle statuses use the css determined font color (white)
  };

export default function Lifecycle(props) {
  if (!props.status || (Array.isArray(props.status) && props.status.length === 0)) {
    return null;
  }
  // Check if props.status is an array or a single value
  const statuses = Array.isArray(props.status) ? props.status : [props.status];

  return (
    <>
      {statuses.map((status, index) => {
        const style = {
          backgroundColor: props.backgroundColor || statusColors[status] || '#047377', // default to teal if no match
          color: fontColors[status] || '#fff' // default font color if no matc
        };

        return (
          <span key={index} className={`${styles.lifecycle} lifecycle-badge`} style={style}>
            {status}
          </span>
        );
      })}
    </>
  );
}
