import React from 'react';
import styles from './styles.module.css';

function Callout({children, type, title}) {
  return (
    <div className={["alert", "alert--" + type, styles[type], styles.alert].join(" ")}
         role="alert">
      {title && title.length > 0 && (
          <h4>{title}</h4>
      )}
      {children}
    </div>
  );
}

export default Callout;
