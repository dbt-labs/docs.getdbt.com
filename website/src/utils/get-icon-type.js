// Util function to check which icon to render
import React from "react";
import { useColorMode } from "@docusaurus/theme-common";

export default function getIconType(icon, ...styles) {
  const { colorMode } = useColorMode();
  const combinedStyles = styles.join(" ");

  if (icon.startsWith("fa-")) {
    return <i className={`fa ${icon} ${combinedStyles}`} />;
  } else {
    return (
      <img
        src={
          colorMode === "dark"
            ? `/img/icons/white/${icon}.svg`
            : `/img/icons/${icon}.svg`
        }
        alt=""
        className={`${combinedStyles}`}
      />
    );
  }
}
