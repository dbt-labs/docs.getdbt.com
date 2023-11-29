import React from "react";
import styles from "./styles.module.css";
import getSvgIcon from "../../utils/get-svg-icon";

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  ...props
}) => {
  return (
    <label htmlFor="search-input" className={styles.inputContainer}>
      {/* <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
      {getSvgIcon("fa-magnifying-glass")}
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
