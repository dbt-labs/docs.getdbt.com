import React, {useState} from 'react';
import styles from './styles.module.css';

function FAQ({children, src}) {
  const file = require('../../../docs/tutorial/' + src + '.md')
  const meta = file.metadata;
  const contents = file.default({});

  const [isOn, setOn] = useState(false);
  const toggleOn = function() {
      setOn(!isOn);
  }

  return (
      <div>
          <span className={styles.link} onClick={toggleOn}>
              <span className={styles.toggle}
                    style={{
                        transform: isOn ? null : 'rotateX(180deg)'
                    }}>
              </span>&nbsp;
              <span>{ meta.title }</span>
          </span>
          <div style={{display: (isOn ? 'block' : 'none')}} className={styles.body}>
              { contents }
          </div>
      </div>
  );
}

export default FAQ;
