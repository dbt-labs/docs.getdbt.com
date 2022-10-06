import React, {useState} from 'react';

import styles from './styles.module.css';

function Collapsible({children, header, description, expand}) {

  const [expanded, setExpanded] = useState(expand);
  const toggleExpanded = function() {
      setExpanded(!expanded);
  }

  return (
    <>
        <h2 onClick={toggleExpanded}>
            {header}
            { expanded ?  ' -'  : ' +' }
        </h2>
        { expanded ? children : <span>{ description ? description : "Click to expand" }</span> }
    </>
  );
}

export default Collapsible;

