import React from 'react';
import styles from './styles.module.css';

function Lightbox({src, alt = undefined, title = undefined, collapsed = false}) {
  const collapsedClass = !!collapsed ? styles.collapsed : '';

  return (
    <>
      <link href="/css/featherlight-styles.css" type="text/css" rel="stylesheet" />
      <div className={ `${styles.docImage} ${collapsedClass}` }>
        <span>
          <a href="#" data-featherlight={src}>
            <img
              data-toggle="lightbox"
              alt={alt ? alt : title ? title : ''}
              src={src}
            />
          </a>
        </span>
        {title && (
          <p className={styles.title}>{ title }</p>
        )}
      </div>
    </>
  );
}

export default Lightbox;
