import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';


export default function Card({ title, body, link, icon }) {
  const { isDarkTheme } = useColorMode();
  return (
    <div className={styles.cardWrapper}>
      <Link
        to={useBaseUrl(link)}>
        <article className={styles.card}>
          <img
          src={isDarkTheme ? `/img/icons/white/${icon}_white.png` : `/img/icons/${icon}.png`}
          alt=""
          className={styles.icon}/>
          <h3>{title}</h3>
          <p>
            {body}
          </p>
        </article>
      </Link>
    </div>
  );
}

