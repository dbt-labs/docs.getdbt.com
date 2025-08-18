import React from 'react';
import { motion } from 'framer-motion';
import styles from './styles.module.css';

function BorderBeam({ 
  size = 200, 
  duration = 6, 
  delay = 0, 
  colorFrom = '#ffaa40', 
  colorTo = '#9c40ff', 
  reverse = false, 
  initialOffset = 0, 
  borderWidth = 2,
  className = '',
  style = {}
}) {
  return (
    <div 
      className={styles.borderBeam}
      style={{
        '--border-beam-width': `${borderWidth}px`,
      }}
    >
      <motion.div
        className={`${styles.beam} ${className}`}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          '--color-from': colorFrom,
          '--color-to': colorTo,
          ...style
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
        }}
      />
    </div>
  );
}

export default BorderBeam;
