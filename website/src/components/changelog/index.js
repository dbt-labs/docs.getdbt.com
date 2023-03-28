import React, {useState} from 'react';

function Changelog({children, expand}) {

  const [expanded, setExpanded] = useState(expand);
  const toggleExpanded = function() {
      setExpanded(!expanded);
  }

  return (
    <div style={{marginBottom: "10px"}}>
        <span onClick={toggleExpanded}>
            { expanded ?  '▼' : '▶' }
            <span style={{cursor: "pointer", fontStyle: "italic", marginLeft: "5px"}}>
                Changelog
            </span>
        </span>
        { expanded && (
            <div style={{borderLeft: "1px solid #ccc", paddingLeft: "10px", marginLeft: "5px"}}>
                {children}
            </div>
        ) }
    </div>
  );
}

export default Changelog;

