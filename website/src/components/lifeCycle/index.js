import React from 'react'
import styles from './styles.module.css';

const statusColors = {
  enterprise: '#f3f4f6',
  team: '#f3f4f6',
  developer: '#f3f4f6',
  new: '#047377',
  beta: '#047377',
  ga: '#047377',
  'public preview': '#047377',
};

const fontColors = {
    enterprise: '#000000',
    team: '#000000', 
    developer: '#000000', 
    // lifecycle statuses use the css determined font color (white)
  };

export default function Lifecycle(props) {
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
          <span key={index} className={styles.lifecycle} style={style}>
            {status}
          </span>
        );
      })}
    </>
  );
}
