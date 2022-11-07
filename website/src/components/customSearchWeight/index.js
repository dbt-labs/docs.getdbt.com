import React from 'react';

function CustomSearchWeight({ weight }) {

const searchWeight = weight ? weight : 0

  return (
    <div className="custom-search-weight">{searchWeight}</div>
  );
}

export default CustomSearchWeight;
