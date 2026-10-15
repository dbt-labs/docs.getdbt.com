import React, { useContext } from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import getIconType from "../../utils/get-icon-type";
import BorderBeam from '../borderBeam';
import Lifecycle from '../lifeCycle';
import VersionContext from '../../stores/VersionContext';
import { availableInCurrentVersion } from '../../utils/available-in-current-version';

function Card({ title, body, link, icon, pills, tag, lifecycle, showBorderBeam = false, platformHref, v1Href, v2Href, badgeHref, headingLevel = 4 }) {
  const { version } = useContext(VersionContext);
  const baseLink = useBaseUrl(link || "/");
  // Callers can raise the title's heading level to keep the page outline
  // sequential (for example, h3 cards under an h2 on the homepage). The
  // heading-4 class keeps the look the same at any level.
  const Heading = `h${headingLevel}`;

  // Set styles for icon if available in styles.module.css
  let imgClass = styles[icon] || ''

  const showV1 = Boolean(v1Href) && availableInCurrentVersion(version, "0", "1.99");
  const showV2 = Boolean(v2Href) && availableInCurrentVersion(version, "2.0");
  const hasVersionedLinks = Boolean(platformHref || v1Href || v2Href);

  // Hide the card unless this version has an install link. A platform setup link
  // alone is not enough, so v1-only adapters do not stay on the v2 page.
  if (hasVersionedLinks && !showV1 && !showV2) {
    return null;
  }

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

  if (hasVersionedLinks) {
    parsedPills = [
      platformHref && "dbt platform",
      showV1 && "dbt v1",
      showV2 && "dbt v2",
    ].filter(Boolean);
  }

  const cardBody = hasVersionedLinks ? (
    <div className={styles.cardBody}>
      <ul>
        {platformHref && (
          <li>
            <a href={platformHref}>Set up in the dbt platform</a>
          </li>
        )}
        {showV1 && (
          <li>
            <a href={v1Href}>Install with dbt v1</a>
          </li>
        )}
        {showV2 && (
          <li>
            <a href={v2Href}>Install with dbt v2</a>
          </li>
        )}
      </ul>
      {badgeHref && availableInCurrentVersion(version, "0", "1.99") && (
        <a href={badgeHref}>
          <img alt="" src={`${badgeHref}.svg`} />
        </a>
      )}
    </div>
  ) : (
    <div
      className={styles.cardBody}
      dangerouslySetInnerHTML={{ __html: body }}
    ></div>
  );

  const article = (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        {icon && getIconType(icon, styles.icon , imgClass)}
        {lifecycle && <Lifecycle status={lifecycle} />}
      </div>
      {tag && <span className="tag">{tag}</span>}
      <Heading className="heading-4">{title}</Heading>
      {cardBody}
      {!link && parsedPills && parsedPills.length > 0 && (
        <div className={styles.pillsContainer}>
          {parsedPills.map((pill, index) => (
            <span key={index} className={styles.pill}>
              {pill}
            </span>
          ))}
        </div>
      )}
      {showBorderBeam && <BorderBeam />}
    </article>
  );

  return (
    <div className={styles.cardWrapper}>
      {link ? <Link to={baseLink}>{article}</Link> : article}
    </div>
  );
}

export default Card;
