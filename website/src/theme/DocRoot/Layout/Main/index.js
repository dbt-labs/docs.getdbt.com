import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import { useDocsSidebar } from "@docusaurus/plugin-content-docs/client";
import { useLocalPathname } from "@docusaurus/theme-common/internal";
import styles from "./styles.module.css";

/* dbt Customizations:
 * Import Admonition for version banners, and version-related plugin, context, method
 * Get page path with useLocalPathname hook
 * Check if page available for current version
 * Check whether this version is a isPrerelease
 * Check End of Life date and show unsupported banner if deprecated version
 * useEffect to show banner content
 * Show Admonition banners if needed
 */
import Admonition from "@theme/Admonition";
import { usePluginData } from "@docusaurus/useGlobalData";
import VersionContext from "../../../../stores/VersionContext";
import pageVersionCheck from "../../../../utils/page-version-check";
import sanitizeHtml from "sanitize-html";

export default function DocRootLayoutMain({
  hiddenSidebarContainer,
  children,
}) {
  const sidebar = useDocsSidebar();

  // Get current page path
  const currentDocRoute = useLocalPathname();

  // Check if page available for current version

  const { versionedPages } = usePluginData(
    "docusaurus-build-global-data-plugin"
  );

  const {
    version: dbtVersion,
    EOLDate,
    isPrerelease,
    latestStableRelease,
  } = useContext(VersionContext);

  const { 
    pageAvailable, 
    firstAvailableVersion, 
    lastAvailableVersion 
  } = pageVersionCheck(dbtVersion, versionedPages, currentDocRoute);

  const hasFirstAvailableVersion =
    firstAvailableVersion && firstAvailableVersion !== "0";

  // Check whether this version is a isPrerelease, and show banner if so
  const [PreData, setPreData] = useState({
    showisPrereleaseBanner: false,
    isPrereleaseBannerText: "",
  });

  // Check End of Life date and show unsupported banner if deprecated version
  const [EOLData, setEOLData] = useState({
    showEOLBanner: false,
    EOLBannerText: "",
  });

  useEffect(() => {
    // If version is not isPrerelease, do not show banner
    if (!isPrerelease) {
      setPreData({
        showisPrereleaseBanner: false,
        isPrereleaseBannerText: "",
      });
    } else {
      // Check if this is Fusion (version 2.0) or another prerelease
      if (dbtVersion === "2.0") {
        setPreData({
          showisPrereleaseBanner: true,
          isPrereleaseBannerText: `You're viewing the preview docs for the <a href="https://docs.getdbt.com/docs/fusion">dbt Fusion engine</a>.`,
        });
      } else {
        // For other prerelease versions (like 1.11 beta)
        setPreData({
          showisPrereleaseBanner: true,
          isPrereleaseBannerText: `You're viewing the docs for the beta version of dbt Core. Features may change before final release. Read more in the <a href="/docs/dbt-versions/core-upgrade/upgrading-to-v1.11">Upgrade guide</a>.`,
        });
      }
    }
    // If EOLDate not set for version, do not show banner
    if (!EOLDate) {
      setEOLData({
        showEOLBanner: false,
        EOLBannerText: "",
      });
    } else {
      let threeMonths = new Date(EOLDate);
      threeMonths.setMonth(threeMonths.getMonth() - 3);
      if (new Date() > new Date(EOLDate)) {
        setEOLData({
          showEOLBanner: true,
          EOLBannerText: `This version of dbt Core is <a href="/docs/dbt-versions/core">no longer supported</a>. There will be no more patches or security fixes. For improved performance, security, and features, upgrade to the <a href="https://github.com/dbt-labs/dbt-core/releases/latest"> latest stable version</a>. Some dbt customers might have an extended <a href="/docs/dbt-versions/core">critical support window</a>. `,
        });
      } else if (new Date() > threeMonths) {
        setEOLData({
          showEOLBanner: true,
          EOLBannerText: `This version of dbt Core is nearing the end of its <a href="/docs/dbt-versions/core">critical support period</a>. For improved perfomance, security, and features, upgrade to the <a href="https://github.com/dbt-labs/dbt-core/releases/latest"> latest stable version</a>.`,
        });
      } else {
        setEOLData({
          showEOLBanner: false,
          EOLBannerText: "",
        });
      }
    }
  }, [dbtVersion]);

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced
      )}
    >
      <div
        className={clsx(
          "container padding-top--md padding-bottom--lg",
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced
        )}
      >
        {PreData.showisPrereleaseBanner && (
          <div className={styles.versionBanner}>
            <Admonition type="info" title="Important">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(PreData.isPrereleaseBannerText),
                }}
              />
            </Admonition>
          </div>
        )}
        {EOLData.showEOLBanner && (
          <div className={styles.versionBanner}>
            <Admonition type="caution" title="Warning">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(EOLData.EOLBannerText),
                }}
              />
            </Admonition>
          </div>
        )}
        {children}
      </div>
    </main>
  );
}
