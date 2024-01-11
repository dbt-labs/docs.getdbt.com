import React from 'react';
import styles from './styles.module.css';
import imageCacheWrapper from '../../../functions/image-cache-wrapper';

function Lightbox({
  src, 
  collapsed = false,
  alignment = "center", 
  alt = undefined, 
  title = undefined, 
  width = undefined,
}) {

  // Set alignment class if alignment prop used
  let imageAlignment = ''
  if(alignment === "left") {
    imageAlignment = styles.leftAlignLightbox
  } else if(alignment === "right") {
    imageAlignment = styles.rightAlignLightbox
  }

  return (
    <>
      <link href="/css/featherlight-styles.css" type="text/css" rel="stylesheet" />
      <span 
        className={`
          ${styles.docImage} 
          ${collapsed ? styles.collapsed : ''}
          ${imageAlignment}
        `}
        style={width && {maxWidth: width}}
      >
        <span>
          <a href="#" data-featherlight={src}>
            <img
              data-toggle="lightbox"
              alt={alt ? alt : title ? title : ''}
              title={title ? title : ''}
              src={imageCacheWrapper(src)}
            />
          </a>
        </span>
        {title && (
          <span className={styles.title}>{ title }</span>
        )}
      </span>
    </>
  );
}

export default Lightbox;
