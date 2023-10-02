import React from 'react';
import styles from './styles.module.css';

const SearchInput = ({ value, onChange, placeholder = "Search...", ...props }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      {...props}
      className={styles.inputContainer}
    />
  );
};

export default SearchInput;
