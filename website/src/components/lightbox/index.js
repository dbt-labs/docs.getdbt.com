import React from 'react';

import styles from './styles.module.css';

function Lightbox({children, src, title, collapsed}) {
  var collapsedClass = !!collapsed ? styles.collapsed : '';

  return (
    <div className={ `${styles.docImage} ${collapsedClass}` }>
        <span>
            <a href="#" data-featherlight={src}>
                <img
                    data-toggle="lightbox"
                    alt={title}
                    src={src}
                />
            </a>
        </span>
        <p className={styles.title}><em>{ title }</em></p>
    </div>
  );
}

export default Lightbox;
