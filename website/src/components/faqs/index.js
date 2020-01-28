import React, {useState} from 'react';

function FAQ({children, src}) {
  const file = require('../../../docs/tutorial/' + src + '.md')
  const meta = file.metadata;
  const contents = file.default({});

  const [isOn, setOn] = useState(false);
  const toggleOn = function() {
      setOn(!isOn);
  }

  return (
      <div style={{ backgroundColor: "#fafafa" }}>
          <a href="javascript:void(0)" onClick={toggleOn}>
              <span>
                  { isOn ? '-' : '+' }
              </span>
              <span>{ meta.title }</span>
          </a>
          <div style={{ display: (isOn ? 'block' : 'none'), marginLeft: '10px', padding: '10px' }}>
              { contents }
          </div>
      </div>
  );
}

export default FAQ;
