import React from 'react';

import styles from './styles.module.css';

function LoomVideo({id}) {
  return (
    <div style={{"margin": "40px 10px"}}>
        <div className={styles.loomWrapper}>
            <iframe width="640"
                    className={styles.loomFrame}
                    height="400"
                    src={`https://www.loom.com/embed/${id}`}
                    frameBorder="0"
                    allowFullScreen={true}
                    webkitallowfullscreen="true"
                    mozallowfullscreen="true"></iframe>
        </div>
    </div>
  );
}

export default LoomVideo;
