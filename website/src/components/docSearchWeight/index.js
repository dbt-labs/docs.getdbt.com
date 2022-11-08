import React from 'react';
import styles from './styles.module.css';

function DocSearchWeight({ weight }) {

const searchWeight = weight ? weight : 0

  return (
    <div className={`${styles.customSearchWeight} algolia-custom-search-weight`}>{searchWeight}</div>
  );
}

export default DocSearchWeight;
