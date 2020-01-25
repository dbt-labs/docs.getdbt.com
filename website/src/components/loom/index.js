import React from 'react';

import styles from './styles.module.css';

function LoomVideo({children, id}) {
  return (
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
  );
}

export default LoomVideo;
