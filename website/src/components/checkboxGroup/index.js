import React from "react";
import styles from "./styles.module.css";

export function CheckboxGroup({ options, selectedValues, onChange, label }) {
  const [showAll, setShowAll] = React.useState(false);

  // Show all options if showAll is true, otherwise show only a set amount in this case 3
  const displayedOptions = showAll ? options : options.slice(0, 3);
  const hasMoreOptions = options.length > 3;

  const allSelected = options.length === selectedValues.length;

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      onChange([]);
    } else {
      // Select all
      onChange(options);
    }
  };

  const handleCheckboxChange = (option) => {
    const isCurrentlySelected = selectedValues.some(
      (item) => item.value === option.value
    );
    const newValues = isCurrentlySelected
      ? selectedValues.filter((item) => item.value !== option.value)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className={styles.checkboxGroup}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.checkboxContainer}>
        {displayedOptions.map((option) => (
          <label key={option.value} className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={selectedValues.some(
                (item) => item.value === option.value
              )}
              onChange={() => handleCheckboxChange(option)}
              className={styles.checkbox}
            />
            {option.label}
          </label>
        ))}
      </div>

      <div className={styles.buttonContainer}>
      {hasMoreOptions && (
        <button
          className={styles.viewMoreButton}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "- View less" : `+ View more (${options.length - 3})`}
        </button>
      )}
        <button className={styles.selectAllButton} onClick={handleSelectAll}>
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>
    </div>
  );
}
