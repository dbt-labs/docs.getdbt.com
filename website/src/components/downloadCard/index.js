import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

/**
 * DownloadCard - A download card with a one-click primary button for the
 * reader's operating system, plus every other installer underneath.
 *
 * @param {string} title - Card heading
 * @param {string} subtitle - Line under the heading
 * @param {Array} downloads - Installers: { id, os, label, ext, url, note? }
 *   `os` is one of 'mac', 'windows', or 'linux' and drives auto-detection.
 *   The first entry for each `os` is the primary button for that OS.
 */

const CDN = 'https://public.cdn.getdbt.com/dbt-wizard/latest';

const DEFAULT_DOWNLOADS = [
  {
    id: 'mac-arm',
    os: 'mac',
    label: 'macOS (Apple silicon)',
    ext: '.dmg',
    url: `${CDN}/dbt-wizard-app-aarch64-apple-darwin.dmg`,
  },
  {
    id: 'mac-intel',
    os: 'mac',
    label: 'macOS (Intel)',
    ext: '.dmg',
    url: `${CDN}/dbt-wizard-app-x86_64-apple-darwin.dmg`,
  },
  {
    id: 'windows',
    os: 'windows',
    label: 'Windows (64-bit)',
    ext: '.exe',
    url: `${CDN}/dbt-wizard-app-x86_64-pc-windows-msvc.exe`,
  },
  {
    id: 'linux-x64',
    os: 'linux',
    label: 'Linux (x86_64)',
    ext: '.deb',
    url: `${CDN}/dbt-wizard-app-x86_64-unknown-linux-gnu.deb`,
  },
  {
    id: 'linux-arm',
    os: 'linux',
    label: 'Linux (ARM64)',
    ext: '.deb',
    url: `${CDN}/dbt-wizard-app-aarch64-unknown-linux-gnu.deb`,
  },
];

const OS_NAMES = { mac: 'macOS', windows: 'Windows', linux: 'Linux' };

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

// The Wizard, colored by part to match the brand (hat, face, legs)
const WIZARD = [
  { text: '   ▄', part: 'hat' },
  { text: '    █▄', part: 'hat' },
  { text: '   ████', part: 'hat' },
  { text: '▄▄██████▄▄', part: 'hat' },
  { text: '  ▄▄ ▄ ▄▄', part: 'face' },
  { text: '  ▀██▀██', part: 'face' },
  { text: '   ▀▀▀▀▀', part: 'face' },
  { text: '   ███ █', part: 'legs' },
  { text: ' ████   █', part: 'legs' },
  { text: '███ █   ███', part: 'legs' },
];

function DownloadIcon() {
  return (
    <svg
      className={styles.icon}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

export default function DownloadCard({
  title = 'Download Wizard Desktop',
  subtitle = 'Free to download for macOS, Windows, and Linux.',
  downloads = DEFAULT_DOWNLOADS,
}) {
  // Render macOS on the server so the first paint matches, then swap on mount
  const [os, setOs] = useState('mac');
  useEffect(() => {
    setOs(detectOs());
  }, []);

  const primary = downloads.find((d) => d.os === os) || downloads[0];
  const others = downloads.filter((d) => d.id !== primary.id);

  return (
    <div className={styles.card}>
      <pre className={styles.wizard} aria-hidden="true">
        {WIZARD.map((line, i) => (
          <span key={i} className={styles[line.part]}>
            {line.text}
            {'\n'}
          </span>
        ))}
      </pre>

      <div className={styles.content}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.badge}>Public beta</span>
        </div>
        <p className={styles.subtitle}>{subtitle}</p>

        <a className={styles.button} href={primary.url} download rel="noopener noreferrer">
          <DownloadIcon />
          <span>Download for {OS_NAMES[primary.os]}</span>
          <span className={styles.ext}>{primary.ext}</span>
        </a>

        <p className={styles.others}>
          {primary.label}. Also available:{' '}
          {others.map((d, i) => (
            <React.Fragment key={d.id}>
              {i > 0 && ' · '}
              <a href={d.url} download rel="noopener noreferrer">
                {d.label}
              </a>
            </React.Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
