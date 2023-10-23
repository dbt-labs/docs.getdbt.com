import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import getIconType from "../../utils/get-icon-type";

export default function QuickstartGuideCard({ frontMatter }) {
  const { id, title, time_to_complete, icon, tags, level, recently_updated } =
    frontMatter;

  return (
    <Link to={`/quickstarts/${id}`} className={styles.quickstartCard}>
      {recently_updated && (
        <span className={styles.recently_updated}>Updated</span>
      )}
      {icon && getIconType(icon, styles.icon)}

      <h3>{title}</h3>

      {time_to_complete && (
        <span className={styles.time_to_complete}>{time_to_complete}</span>
      )}

      <span to={`/quickstarts/${id}`} className={styles.start}>
        Start
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

export function QuickstartGuideTitle({ frontMatter }) {
  const { id, title, time_to_complete, icon, tags, level, recently_updated } =
    frontMatter;

  return (
    <div>
      {recently_updated && (
        <span className={styles.recently_updated}>Updated</span>
      )}
      {time_to_complete && (
        <span className={styles.time_to_complete}>{time_to_complete}</span>
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
