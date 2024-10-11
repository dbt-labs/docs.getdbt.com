import React, {useState} from 'react';

function Collapsible({children, header, description, expand}) {

  const [expanded, setExpanded] = useState(expand);
  const toggleExpanded = function() {
      setExpanded(!expanded);
  }

  return (
    <>
        <h2 onClick={toggleExpanded}>
            <span style={{ color: expanded ? 'orange' : 'orange' }}>
              { expanded ?  ' ^ '  : ' > ' }
            </span>
            {header}
        </h2>
        { expanded ? children : <span>{ description ? description : "Click above for details" }</span> }
    </>
  );
}

export default Collapsible;

