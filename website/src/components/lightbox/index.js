import React from 'react';

import styles from './styles.module.css';

function Lightbox({children, src, title}) {
  return (
    <div className={styles.docImage}>
        <div>
            <a href="#" data-featherlight={src}>
                <img
                    data-toggle="lightbox"
                    alt={title}
                    src={src} />
            </a>
        </div>
        <div className={styles.title}><em>{ title }</em></div>
    </div>
  );
}

export default Lightbox;

