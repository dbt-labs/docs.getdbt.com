import React from 'react';
import styles from './styles.module.css';

function Hero({ heading, subheading, showGraphic = false, customStyles = {}, classNames = '', colClassNames = '', callToActionsTitle, callToActions = [] }) {
  return (
    <header className={` ${styles.Hero} container-fluid ${classNames ? classNames : ''}`} style={customStyles && customStyles}>
      {showGraphic && (
        <div className={styles.showGraphic}></div>
      )}
      <div className={`container`}>
        <div className="row justify-content-center">
          <div className={`col col--7 ${colClassNames ? colClassNames : ''}`}>
            <h1>{heading}</h1>
            <p>{subheading}</p>
            {callToActionsTitle && <span className={styles.callToActionsTitle}>{callToActionsTitle}</span>}
            {callToActions.length > 0 && (
              <div className={styles.callToActions}>
                {callToActions.map((c, index) => (
                  c.href ? (
                    <a key={index} href={c.href} title={c.title} className={`${styles.callToAction}`} target={c.newTab ? '_blank' : '_self'}>
                      {c.title}
                    </a>
                  ) : (
                    <a key={index} onClick={c.onClick} className={`${styles.callToAction}`}>
                      {c.title}
                    </a>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Hero;

