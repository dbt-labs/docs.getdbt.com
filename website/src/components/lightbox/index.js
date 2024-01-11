import React, { useState, useEffect } from 'react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [expandImage, setExpandImage] = useState(false);

  useEffect(() => {
    let timeoutId;

    if (isHovered) {
      // Delay the expansion by 5 milliseconds
      timeoutId = setTimeout(() => {
        setExpandImage(true);
      }, 5);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isHovered]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setExpandImage(false);
  };

  return (
    <>
      <link href="/css/featherlight-styles.css" type="text/css" rel="stylesheet" />
      <div
        className={`
          ${styles.docImage}
          ${collapsed ? styles.collapsed : ''}
          ${alignment === "left" ? styles.leftAlignLightbox : ''}
          ${alignment === "right" ? styles.rightAlignLightbox : ''}
          ${isHovered ? styles.hovered : ''}
        `}
        style={width && { maxWidth: width }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span>
          <a href="#" data-featherlight={src}>
            <img
              data-toggle="lightbox"
              alt={alt ? alt : title ? title : ''}
              title={title ? title : ''}
              src={imageCacheWrapper(src)}
              style={expandImage ? { transform: 'scale(1.3)', transition: 'transform 0.3s ease', zIndex: '9999' } : {}}
            />
          </a>
        </span>
        {title && (
          <span className={styles.title}>{ title }</span>
        )}
      </div>
    </>
  );
}

export default Lightbox;
