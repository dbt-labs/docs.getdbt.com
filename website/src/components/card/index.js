import React, { useContext } from 'react';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import getIconType from "../../utils/get-icon-type";
import BorderBeam from '../borderBeam';
import Lifecycle from '../lifeCycle';
import VersionContext from '../../stores/VersionContext';
import { availableInCurrentVersion } from '../../utils/available-in-current-version';
import pageVersionCheck from '../../utils/page-version-check';

function Card({ title, body, link, icon, pills, tag, lifecycle, showBorderBeam = false, platformHref, v1Href, v2Href, badgeHref, designation, headingLevel = 4 }) {
  const { version } = useContext(VersionContext);
  const { versionedPages } = usePluginData('docusaurus-build-global-data-plugin');
  const baseLink = useBaseUrl(link || "/");
  // Callers can raise the title's heading level to keep the page outline
  // sequential (for example, h3 cards under an h2 on the homepage). The
  // heading-4 class keeps the look the same at any level.
  const Heading = `h${headingLevel}`;

  // Set styles for icon if available in styles.module.css
  let imgClass = styles[icon] || ''
  // getIconType calls a hook, so call it before any early return to keep the
  // hook order stable when the selected version hides or shows this card.
  const iconElement = icon ? getIconType(icon, styles.icon, imgClass) : null;

  const showV1 = Boolean(v1Href) && availableInCurrentVersion(version, "0", "1.99");
  const isV2 = availableInCurrentVersion(version, "2.0");
  const showV2 = Boolean(v2Href) && isV2;
  // A v2 adapter designation (first-party or community-maintained) applies to
  // v2 only. A designated adapter stays on the v2 page even before its v2 setup
  // page exists.
  const showDesignation = Boolean(designation) && isV2;
  // A platform setup page can be limited to v1 or v2. Hide the link and the
  // "dbt platform" pill when the selected version cannot use that page.
  const showPlatform = Boolean(platformHref) && (
    Array.isArray(versionedPages)
      ? pageVersionCheck(version, versionedPages, platformHref).pageAvailable
      : true
  );
  const hasVersionedLinks = Boolean(platformHref || v1Href || v2Href);

  // Hide the card unless this version has an install link. A platform setup link
  // alone is not enough, so v1-only adapters do not stay on the v2 page.
  if (hasVersionedLinks && !showV1 && !showV2 && !showDesignation) {
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
      showPlatform && "dbt platform",
      showV1 && "dbt v1",
      (showV2 || showDesignation) && "dbt v2",
    ].filter(Boolean);
  }

  const cardBody = hasVersionedLinks ? (
    <div className={styles.cardBody}>
      {(showPlatform || showV1 || showV2) && (
      <ul>
        {showPlatform && (
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
      )}
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
        {iconElement}
        {lifecycle && <Lifecycle status={lifecycle} />}
      </div>
      {tag && <span className="tag">{tag}</span>}
      {showDesignation && <span className="tag">{designation}</span>}
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
