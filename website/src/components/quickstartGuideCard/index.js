import React from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import { useColorMode } from "@docusaurus/theme-common";

function QuickstartGuideCard({ frontMatter }) {
  const { id, title, time_to_complete, icon } = frontMatter;
  const { colorMode } = useColorMode();

  const renderIcon = () => {
    if (icon.startsWith('fa-')) {
      return <i className={`fa ${icon} ${styles.icon}`} />;
    } else {
      return (
        <img
          src={
            colorMode === "dark"
              ? `/img/icons/white/${icon}.svg`
              : `/img/icons/${icon}.svg`
          }
          alt=""
          className={`${styles.icon}`}
        />
      )
    }
  }

  return (
    <Link
      to={`/quickstarts/${id}`}
      frontMatter={frontMatter}
      className={styles.quickstartCard}
    >
      {icon && renderIcon()}
      
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
