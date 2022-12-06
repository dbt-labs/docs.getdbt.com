import React from 'react';
import styles from './styles.module.css';

function Lightbox({children, src, title, collapsed}) {
  var collapsedClass = !!collapsed ? styles.collapsed : '';

  return (
    <>
      <link href="/css/featherlight-styles.css" type="text/css" rel="stylesheet" />
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
          <p className={styles.title}>{ title }</p>
      </div>
    </>
  );
}

export default Lightbox;
