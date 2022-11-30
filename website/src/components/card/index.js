import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';


function Card({ title, body, link, icon }) {
  const { isDarkTheme } = useColorMode();
  return (
    <div className={styles.cardWrapper}>
      {link ? <Link
        to={useBaseUrl(link)}>
        <article className={styles.card}>
          {icon && <img
            src={isDarkTheme ? `/img/icons/white/${icon}.svg` : `/img/icons/${icon}.svg`}
            alt=""
            className={styles.icon} />}
          <h3>{title}</h3>
          <p>
            {body}
          </p>
        </article>
      </Link> : <article className={styles.card}>
      {icon && <img
            src={isDarkTheme ? `/img/icons/white/${icon}.svg` : `/img/icons/${icon}.svg`}
            alt=""
            className={styles.icon} />}
        <h3>{title}</h3>
        <p>
          {body}
        </p>
      </article>}
    </div>
  );
}

export default Card;

