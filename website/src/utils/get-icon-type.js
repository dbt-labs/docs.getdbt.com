// Util function to check which icon to render
import React from "react";
import { useColorMode } from "@docusaurus/theme-common";
import getSvgIcon from "./get-svg-icon";

export default function getIconType(icon, ...styles) {
  const { colorMode } = useColorMode();
  const combinedStyles = styles.join(" ");

  if (icon.startsWith("fa-")) {
    return (
      <>
        {/* <!--! Font Awesome Pro 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}
        <div className={combinedStyles}>
          {getSvgIcon(icon)}
        </div>
      </>
    ) 
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
