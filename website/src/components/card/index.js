import React from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import getIconType from "../../utils/get-icon-type";
import BorderBeam from '../borderBeam';
import Lifecycle from '../lifeCycle';

function Card({ title, body, link, icon, pills, tag, lifecycle, showBorderBeam = false, headingLevel = 4 }) {
  // Callers can raise the title's heading level to keep the page outline
  // sequential (for example, h3 cards under an h2 on the homepage). The
  // heading-4 class keeps the look the same at any level.
  const Heading = `h${headingLevel}`;

  // Set styles for icon if available in styles.module.css
  let imgClass = styles[icon] || ''

  // Parse pills prop if it is a string
  // Prevents syntax highlighting error in the markdown file
  let parsedPills = pills;
  try {
    if (typeof pills === 'string') {
      parsedPills = JSON.parse(pills);
    }
  } catch (error) {
    console.error("Failed to parse pills prop", error);
    parsedPills = []; 
  }

  return (
    <div className={styles.cardWrapper}>
      {link ? <Link
        to={useBaseUrl(link)}>
        <article className={styles.card}>
          <div className={styles.cardHeader}>
            {icon && getIconType(icon, styles.icon , imgClass)}
            {lifecycle && <Lifecycle status={lifecycle} />}
          </div>
          {tag && <span className="tag">{tag}</span>}
          <Heading className="heading-4">{title}</Heading>
          <div
            className={styles.cardBody}
            dangerouslySetInnerHTML={{ __html: body }}
          ></div>
          {showBorderBeam && <BorderBeam />}
        </article>
      </Link> : <article className={styles.card}>
        <div className={styles.cardHeader}>
          {icon && getIconType(icon, styles.icon , imgClass)}
          {lifecycle && <Lifecycle status={lifecycle} />}
        </div>
        {tag && <span className="tag">{tag}</span>}
        <Heading className="heading-4">{title}</Heading>
        <div
          className={styles.cardBody}
          dangerouslySetInnerHTML={{ __html: body }}
        ></div>
        {parsedPills && parsedPills.length > 0 && (
          <div className={styles.pillsContainer}>
            {parsedPills.map((pill, index) => (
              <span key={index} className={styles.pill}>
                {pill}
              </span>
            ))}
          </div>
        )}
        {showBorderBeam && <BorderBeam />}
      </article>}
    </div>
  );
}

export default Card;
