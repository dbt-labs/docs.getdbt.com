import React, {useState} from 'react';

import styles from './styles.module.css';

function Collapsible({children, header, expand}) {

  const [expanded, setExpanded] = useState(expand);
  const toggleExpanded = function() {
      setExpanded(!expanded);
  }

  return (
    <>
        <h2 onClick={toggleExpanded}>
            { expanded ?  '➖'  : '➕' }
            {header}
        </h2>
        { expanded ? children : <span>Click to expand</span> }
    </>
  );
}

export default Collapsible;

