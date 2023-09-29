import React from "react";
import Select from "react-select";
import styles from "./styles.module.css";

export const SelectDropdown = ({ options, value, onChange }) => {
  return (
    <Select
      isMulti
      name="multi-select-dropdown"
      options={options}
      className={styles.selectContainer}
      value={value}
      onChange={onChange}
      aria-label="Multi Select Dropdown"
    />
  );
};
