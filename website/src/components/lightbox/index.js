import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import imageCacheWrapper from '../../../functions/image-cache-wrapper';

function Lightbox({ src, collapsed = false, alignment = "center", alt = undefined, title = undefined, width = undefined }) {
  const [isHovered, setIsHovered] = useState(false);
  const [expandImage, setExpandImage] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isHovered && !isScrolling) {
      timeoutId = setTimeout(() => {
        setExpandImage(true);
      }, 200); // Delay for expanding image after hover
    } else {
      setExpandImage(false);
    }
    return () => clearTimeout(timeoutId);
  }, [isHovered, isScrolling]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setExpandImage(false);
  };

  const handleScroll = () => {
    if (!isScrolling) {
      setIsScrolling(true);
      setTimeout(() => {
        setIsScrolling(false);
      }, 200); // Delay to reset scrolling state
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
              style={expandImage ? { transform: 'scale(1.04)', transition: 'transform 0.3s ease' } : {}}
            />
          </a>
        </span>
        {title && (
          <span className={styles.title}>{title}</span>
        )}
      </div>
    </>
  );
}

export default Lightbox;
