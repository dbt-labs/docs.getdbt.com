import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

function QuickstartGuideCard({ frontMatter }) {
  const { id, title, time_to_complete } = frontMatter;

  return (
    <Link
      to={`/quickstarts/${id}`}
      frontMatter={frontMatter}
      className={styles.quickstartCard}
    >
      <h3>{title}</h3>

      {time_to_complete && (
        <span className={styles.time_to_complete}>{time_to_complete}</span>
      )}

      <span to={`/quickstarts/${id}`} className={styles.start}>
        Start
      </span>
    </Link>
  );
}

export default QuickstartGuideCard;
