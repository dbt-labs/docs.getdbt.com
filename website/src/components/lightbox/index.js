import React from 'react';
import styles from './styles.module.css';

function Lightbox({
  src, 
  collapsed = false, 
  alt = undefined, 
  title = undefined, 
  width = undefined
}) {
  return (
    <>
      <link href="/css/featherlight-styles.css" type="text/css" rel="stylesheet" />
      <div 
        className={`${styles.docImage} ${collapsed ? styles.collapsed : ''}`}
        style={width && {maxWidth: width}}
      >
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
