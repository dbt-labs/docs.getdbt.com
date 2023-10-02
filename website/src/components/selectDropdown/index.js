import React from "react";
import Select from "react-select";
import styles from "./styles.module.css";

export const SelectDropdown = ({ options, value, onChange, isMulti, placeHolder }) => {


  return (
    <Select
      isMulti={isMulti}
      name="multi-select-dropdown"
      options={options}
      className={styles.selectContainer}
      classNamePrefix={styles.select}
      value={value}
      onChange={onChange}
      placeholder={placeHolder}
      aria-label="Multi Select Dropdown"
      unstyled
    />
  );
};
 