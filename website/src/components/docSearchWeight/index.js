import React from 'react';
import styles from './styles.module.css';

function DocSearchWeight({ weight }) {

  let searchWeight

  let allowedValues = ['light', 'medium', 'heavy']

  // Intercept the value from frontmatter and set it to the correct value
  if (!weight) {
    searchWeight = 0
  } else if (weight == "light") {
    searchWeight = 25
  } else if (weight == "medium") {
    searchWeight = 50
  } else if (weight == "heavy") {
    searchWeight = 100
  }

  // Throw an error if the value is not allowed
  if (weight && !allowedValues.includes(weight)) {
    throw `Invalid value for search_weight: ${weight}. Allowed values are: ${allowedValues.join(', ')}.`
  }

  return (
    <div className={`${styles.customSearchWeight} algolia-custom-search-weight`}>{searchWeight}</div>
  );
}

export default DocSearchWeight;
