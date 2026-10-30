import React, { useEffect, useState } from 'react';
import {
  faApple,
  faWindows,
  faLinux,
} from '@fortawesome/free-brands-svg-icons';
import styles from './styles.module.css';

/**
 * DownloadCard - Three platform cards (macOS, Windows, Linux) that each link
 * straight to an installer, plus a note for the other architectures. The card
 * matching the reader's operating system is highlighted.
 *
 * @param {Array} platforms - Cards: { os, icon, title, description, ext, url }
 * @param {Array} alternates - Other installers: { label, ext, url }
 */

const CDN = 'https://public.cdn.getdbt.com/dbt-wizard/latest';

const DEFAULT_PLATFORMS = [
  {
    os: 'mac',
    icon: faApple,
    title: 'Download for macOS',
    description: 'For Apple silicon Macs',
    ext: '.dmg',
    url: `${CDN}/dbt-wizard-app-aarch64-apple-darwin.dmg`,
  },
  {
    os: 'windows',
    icon: faWindows,
    title: 'Download for Windows',
    description: 'For x64 processors',
    ext: '.exe',
    url: `${CDN}/dbt-wizard-app-x86_64-pc-windows-msvc.exe`,
  },
  {
    os: 'linux',
    icon: faLinux,
    title: 'Download for Linux',
    description: 'For x86_64, Ubuntu and Debian',
    ext: '.deb',
    url: `${CDN}/dbt-wizard-app-x86_64-unknown-linux-gnu.deb`,
  },
];

const DEFAULT_ALTERNATES = [
  {
    label: 'Intel Mac',
    ext: '.dmg',
    url: `${CDN}/dbt-wizard-app-x86_64-apple-darwin.dmg`,
  },
  {
    label: 'Linux ARM64',
    ext: '.deb',
    url: `${CDN}/dbt-wizard-app-aarch64-unknown-linux-gnu.deb`,
  },
];

function detectOs() {
  if (typeof navigator === 'undefined') return 'mac';
  const platform = (
    navigator.userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent ||
    ''
  ).toLowerCase();
  if (platform.includes('win')) return 'windows';
  if (platform.includes('linux') || platform.includes('x11')) return 'linux';
  return 'mac';
}

function BrandIcon({ icon }) {
  const [width, height, , , path] = icon.icon;
  return (
    <svg
      className={styles.icon}
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

export default function DownloadCard({
  platforms = DEFAULT_PLATFORMS,
  alternates = DEFAULT_ALTERNATES,
}) {
  // Render macOS on the server so the first paint matches, then swap on mount
  const [os, setOs] = useState('mac');
  useEffect(() => {
    setOs(detectOs());
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.tiles}>
          {platforms.map((p) => (
            <a
              key={p.os}
              className={`${styles.tile} ${p.os === os ? styles.detected : ''}`}
              href={p.url}
              download
              rel="noopener noreferrer"
            >
              <BrandIcon icon={p.icon} />
              <span className={styles.tileText}>
                <span className={styles.tileTitle}>{p.title}</span>
                <span className={styles.tileDescription}>
                  {p.description} · <span className={styles.ext}>{p.ext}</span>
                </span>
              </span>
            </a>
          ))}
        </div>

        <p className={styles.others}>
          Need a different build?{' '}
          {alternates.map((a, i) => (
            <React.Fragment key={a.label}>
              {i > 0 && ' · '}
              <a href={a.url} download rel="noopener noreferrer">
                {a.label} ({a.ext})
              </a>
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
