import React, { useState, useEffect, useContext } from 'react';
import clsx from 'clsx';
import {useDocsSidebar, useLocalPathname} from '@docusaurus/theme-common/internal';
import styles from './styles.module.css';

/* dbt Customizations:
 * Import Admonition for version banners, and version-related plugin, context, method
 * Get page path with useLocalPathname hook
 * Check if page available for current version
 * Check whether this version is a isPrerelease
 * Check End of Life date and show unsupported banner if deprecated version
 * useEffect to show banner content
 * Show Admonition banners if needed
*/
import Admonition from '@theme/Admonition';
import {usePluginData} from '@docusaurus/useGlobalData';
import VersionContext from '../../../../stores/VersionContext'
import pageVersionCheck from '../../../../utils/page-version-check';

export default function DocPageLayoutMain({hiddenSidebarContainer, children}) {
  const sidebar = useDocsSidebar();
  
  // Get current page path
  const currentDocRoute = useLocalPathname()

  // Check if page available for current version
  
  const { versionedPages } = usePluginData('docusaurus-build-global-data-plugin');
  const { version: dbtVersion, EOLDate, isPrerelease, latestStableRelease } = useContext(VersionContext)
  const { pageAvailable, firstAvailableVersion } = pageVersionCheck(dbtVersion, versionedPages, currentDocRoute)

  // Check whether this version is a isPrerelease, and show banner if so
  const [PreData, setPreData] = useState({
    showisPrereleaseBanner: false,
    isPrereleaseBannerText: ''
  })

  // Check End of Life date and show unsupported banner if deprecated version
  const [EOLData, setEOLData] = useState({
    showEOLBanner: false,
    EOLBannerText: ''
  })

  useEffect(() => {
    // If version is not isPrerelease, do not show banner
    if(!isPrerelease) {
      setPreData({
        showisPrereleaseBanner: false,
        isPrereleaseBannerText: ''
      })
    } else {
        setPreData({
          showisPrereleaseBanner: true,
          isPrereleaseBannerText  : `You are currently viewing v${dbtVersion}, which is a prerelease of dbt Core. The latest stable version is v${latestStableRelease}`
        })
    }
    // If EOLDate not set for version, do not show banner
    if(!EOLDate) {
      setEOLData({
        showEOLBanner: false,
        EOLBannerText: ''
      })
    } else {
      let threeMonths = new Date(EOLDate)
      threeMonths.setMonth(threeMonths.getMonth() - 3)
      if(new Date() > new Date(EOLDate)) {
        setEOLData({
          showEOLBanner: true,
          EOLBannerText: `This version of dbt Core is <a href="/docs/core-versions">no longer supported</a>. No patch releases will be made, even for critical security issues. For better performance, improved security, and new features, you should upgrade to ${latestStableRelease}, the latest stable version.`
        })
      } else if(new Date() > threeMonths) {
        setEOLData({
          showEOLBanner: true,
          EOLBannerText: `This version of dbt Core is nearing the end of its <a href="/docs/core-versions">critical support period</a>. For better performance, improved security, and new features, you should upgrade to ${latestStableRelease}, the latest stable version.`
        })
      } else {
        setEOLData({
          showEOLBanner: false,
          EOLBannerText: ''
        })
      }
    }
  }, [dbtVersion])

  return (
    <main
      className={clsx(
        styles.docMainContainer,
        (hiddenSidebarContainer || !sidebar) && styles.docMainContainerEnhanced,
      )}>
      <div
        className={clsx(
          'container padding-top--md padding-bottom--lg',
          styles.docItemWrapper,
          hiddenSidebarContainer && styles.docItemWrapperEnhanced,
        )}>
        {!pageAvailable && dbtVersion && firstAvailableVersion && (
          <div className={styles.versionBanner}>
            <Admonition type="caution" title={`New feature!`} icon="🎉 " >
              <p style={{'marginTop': '5px', 'marginBottom': '0'}}>Unfortunately, this feature is not available in dbt Core version {dbtVersion}</p>
              <p> You should upgrade to {firstAvailableVersion} or later if you want to use this feature.</p>
            </Admonition>
          </div>
        )}
        {PreData.showisPrereleaseBanner && (
          <div className={styles.versionBanner}>
            <Admonition type="caution" title="Warning">
              <div dangerouslySetInnerHTML={{__html: PreData.isPrereleaseBannerText}} />
            </Admonition>
          </div>
        )}
        {EOLData.showEOLBanner && (
          <div className={styles.versionBanner}>
            <Admonition type="caution" title="Warning">
              <div dangerouslySetInnerHTML={{__html: EOLData.EOLBannerText}} />
            </Admonition>
          </div>
        )}
        {children}
      </div>
    </main>
  );
}
