import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import getIconType from "../../utils/get-icon-type";
import getSvgIcon from "../../utils/get-svg-icon";

export default function QuickstartGuideCard({ frontMatter }) {
  const { id, title, time_to_complete, icon, tags, level, recently_updated } =
    frontMatter;

  const rightArrow = getSvgIcon('fa-arrow-right')

  return (
    <Link to={`/guides/${id}`} className={styles.quickstartCard}>
      {recently_updated && (
        <span className={styles.recently_updated}>Updated</span>
      )}
      {icon && getIconType(icon, styles.icon)}

      <h3>{title}</h3>

      {time_to_complete && (
        <span className={styles.time_to_complete}>{time_to_complete}</span>
      )}

      <span to={`/guides/${id}`} className={styles.start}>
        Start <span className={styles.right_arrow}>{rightArrow}</span>
      </span>

      {(tags || level) && (
        <div className={styles.tag_container}>
          {tags &&
            tags.map((tag, i) => (
              <div className={styles.tag} key={i}>
                {tag}
              </div>
            ))}
          {level && <div className={styles.tag}>{level}</div>}
        </div>
      )}
    </Link>
  );
}

// Component that handles the information under the title on the quickstart guide page
export function QuickstartGuideTitle({ frontMatter }) {
  const { time_to_complete, tags, level, recently_updated } =
    frontMatter;

  return (
    <div className={styles.infoContainer}>
      {recently_updated && (
        <span className={styles.recently_updated}>Updated</span>
      )}
      {time_to_complete && (
        <span className={styles.time_to_complete}>{getSvgIcon('fa-clock')} {time_to_complete}</span>
      )}

      {(tags || level) && (
        <div className={styles.tag_container}>
          {tags &&
            tags.map((tag, i) => (
              <div className={styles.tag} key={i}>
                {tag}
              </div>
            ))}
          {level && <div className={styles.tag}>{level}</div>}
        </div>
      )}
    </div>
  );
}
