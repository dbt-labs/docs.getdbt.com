import React from 'react';
import styles from './styles.module.css';


function File({children, name}) {
  return (
      <div className={styles.wrapper}>
        <div className={styles.title}>
            <div className={styles.titleInner}>
                <svg className={styles.icon}
                     viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.5 5L10 7.5 7.5 10l-.75-.75L8.5 7.5 6.75 5.75 7.5 5zm-3 0L2 7.5 4.5 10l.75-.75L3.5 7.5l1.75-1.75L4.5 5zM0 13V2c0-.55.45-1 1-1h10c.55 0 1 .45 1 1v11c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1zm1 0h10V2H1v11z"></path>
                </svg>
                <span>{name}</span>
            </div>
        </div>
        {children}
      </div>
  );
}

export default File;

