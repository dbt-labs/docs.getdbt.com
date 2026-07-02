import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useAnnouncementBar} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import AnnouncementBarCloseButton from '@theme/AnnouncementBar/CloseButton';
import AnnouncementBarContent from '@theme/AnnouncementBar/Content';
import clsx from 'clsx';
import styles from './styles.module.css';

/* dbt Customizations:
 * 1. Wrap entire AnnouncementBar in link to make whole banner clickable
 * 2. Allow an individual page to override the global announcement bar via a
 *    `banner` frontmatter property (text / link / open_in_new_tab). The
 *    buildPageBanners plugin collects these at build time into global data
 *    keyed by permalink, so the correct banner is rendered into the static
 *    HTML during SSR — no client-side swap, no flash.
*/

// Match the build plugin's normalization (drop trailing slash, keep root "/").
function normalizePath(pathname) {
  if (!pathname) return pathname;
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

// Look up a page-specific banner for the current route from build-time data.
function usePageBanner() {
  const data = usePluginData('docusaurus-build-page-banners-plugin');
  const {pathname} = useLocation();
  const banners = data?.banners ?? {};
  return banners[normalizePath(pathname)] ?? null;
}

// Render a page-specific banner using the built-in announcement bar styling
function PageAnnouncementBanner({ banner }) {
  const { text, link, open_in_new_tab } = banner;

  const content = (
    <div
      className={styles.announcementBarContent}
      // Authors provide the banner text, including any inline HTML.
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  return (
    <div
      className={clsx(styles.announcementBar, styles.pageAnnouncementBar)}
      role="banner">
      {link ? (
        <a
          href={link}
          className={styles.announcementBarLink}
          {...(open_in_new_tab
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

export default function AnnouncementBar() {
  const {announcementBar, announcementBarActive, announcementBarLink} = useThemeConfig();
  const {isActive, close} = useAnnouncementBar();
  const pageBanner = usePageBanner();

  // dbt Custom: a page-level banner overrides the global announcement bar and
  // is shown regardless of whether the global bar is active or dismissed.
  if (pageBanner?.text) {
    return <PageAnnouncementBanner banner={pageBanner} />;
  }

  if (!isActive || !announcementBarActive) {
    return null;
  }
  const { isCloseable } = announcementBar;
  return (
    <div
      className={styles.announcementBar}
      role="banner">
      {isCloseable && <div className={styles.announcementBarPlaceholder} />}
      {announcementBarLink ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={announcementBarLink}
          className={styles.announcementBarLink}
          >
          <AnnouncementBarContent className={styles.announcementBarContent} />
        </a>
      ) : (
        <AnnouncementBarContent className={styles.announcementBarContent} />
      )}
      {isCloseable && (
        <AnnouncementBarCloseButton
          onClick={close}
          className={styles.announcementBarClose}
        />
      )}
    </div>
  );
}
