import React, { useState, useRef, useEffect } from 'react';
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
  const [hoverStyle, setHoverStyle] = useState({});
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && !width) {
      const naturalWidth = imgRef.current.naturalWidth;
      const naturalHeight = imgRef.current.naturalHeight;

      // Calculate the expanded size for images without a specified width
      const expandedWidth = naturalWidth * 1.2; // Example: 20% increase
      const expandedHeight = naturalHeight * 1.2;

      setHoverStyle({
        width: `${expandedWidth}px`,
        height: `${expandedHeight}px`,
        transition: 'width 0.5s ease, height 0.5s ease',
      });
    }
  }, [width]);

  // Set alignment class if alignment prop used
  let imageAlignment = '';
  if(alignment === "left") {
    imageAlignment = styles.leftAlignLightbox;
  } else if(alignment === "right") {
    imageAlignment = styles.rightAlignLightbox;
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoverStyle({});
  };

  return (
    <>
      <link href="/css/featherlight-styles.css" type="text/css" rel="stylesheet" />
      <span 
        className={`
          ${styles.docImage} 
          ${collapsed ? styles.collapsed : ''}
          ${imageAlignment}
          ${isHovered ? styles.hovered : ''}
        `}
        style={width && {maxWidth: width}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span>
          <a href="#" data-featherlight={src}>
            <img
              ref={imgRef}
              data-toggle="lightbox"
              alt={alt ? alt : title ? title : ''}
              title={title ? title : ''}
              src={imageCacheWrapper(src)}
              style={isHovered && !width ? hoverStyle : {}}
            />
          </a>
        </span>
        {title && (
          <span className={styles.title}>{title}</span>
        )}
      </span>
    </>
  );
}

export default Lightbox;
