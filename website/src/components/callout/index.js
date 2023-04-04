import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';

function Callout({ heading, subheading, cta, link }) {
  return (
    <div className={`${styles.Callout} container-fluid`}>
      <div className={`container`}>
        <div className="row justify-content-center">
          <div className="col col--8">
            <h2>{heading}</h2>
            <p>{subheading}</p>
            <Link
        to={useBaseUrl(link)}>
          <a className={styles.button}>{cta}</a>
        </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Callout;

