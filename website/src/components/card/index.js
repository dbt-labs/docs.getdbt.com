import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import getIconType from "../../utils/get-icon-type";


function Card({ title, body, link, icon }) {

  // Set styles for icon if available in styles.module.css
  let imgClass = styles[icon] || ''

  return (
    <div className={styles.cardWrapper}>
      {link ? <Link
        to={useBaseUrl(link)}>
        <article className={styles.card}>
            {icon && getIconType(icon, styles.icon , imgClass)}
          <h3>{title}</h3>
          <div
            className={styles.cardBody}
            dangerouslySetInnerHTML={{ __html: body }}
          ></div>
        </article>
      </Link> : <article className={styles.card}>
        {icon && getIconType(icon, styles.icon , imgClass)}
        <h3>{title}</h3>
        <div
          className={styles.cardBody}
          dangerouslySetInnerHTML={{ __html: body }}
        ></div>
      </article>}
    </div>
  );
}

export default Card;

