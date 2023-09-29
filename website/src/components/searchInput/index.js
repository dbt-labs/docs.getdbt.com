import React from 'react';

const SearchInput = ({ value, onChange, placeholder = "Search...", ...props }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default SearchInput;
