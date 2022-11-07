import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useAnnouncementBar} from '@docusaurus/theme-common/internal';
import AnnouncementBarCloseButton from '@theme/AnnouncementBar/CloseButton';
import AnnouncementBarContent from '@theme/AnnouncementBar/Content';
import styles from './styles.module.css';
export default function AnnouncementBar() {
  const {announcementBar, announcementBarActive, announcementBarLink} = useThemeConfig();
  const {isActive, close} = useAnnouncementBar();
  if (!isActive || !announcementBarActive) {
    return null;
  }
  const {backgroundColor, textColor, isCloseable} = announcementBar;
  return (
    <div
      className={styles.announcementBar}
      style={{backgroundColor, color: textColor}}
      role="banner">
      {isCloseable && <div className={styles.announcementBarPlaceholder} />}
      {/* <AnnouncementBarContent className={styles.announcementBarContent} /> */}
      {announcementBarLink ? (
        <a 
          target="_blank" 
          rel="noopener noreferrer" 
          href={announcementBarLink}
          className={styles.announcementBarLink}
          style={{
            backgroundColor,
            color: textColor,
          }}
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
