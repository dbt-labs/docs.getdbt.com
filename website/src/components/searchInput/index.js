import React from "react";
import styles from "./styles.module.css";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  ...props
}) => {
  return (
    <label for="search-input" className={styles.inputContainer}>
      <i class="fa-regular fa-magnifying-glass"></i>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
        className={styles.input}
        id="search-input"
      />
    </label>
  );
};

export default SearchInput;
