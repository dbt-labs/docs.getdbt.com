/* eslint-disable */

import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useColorMode } from '@docusaurus/theme-common';
import styles from './styles.module.css';

// Coverage data is imported straight from the committed JSON the weekly job
// produces, so the grid updates itself whenever the data refreshes.
import snowflake from '@site/static/data/functions/snowflake.json';
import bigquery from '@site/static/data/functions/bigquery.json';
import databricks from '@site/static/data/functions/databricks.json';
import redshift from '@site/static/data/functions/redshift.json';
import trino from '@site/static/data/functions/trino.json';
import duckdb from '@site/static/data/functions/duckdb.json';

// One entry per platform: display name, the data file, its page, and an icon.
// `icon` is a file in /static/img/icons (with a /white variant for dark mode);
// `mono` is a fallback letter badge for platforms with no logo yet (Trino).
const PLATFORMS = [
  { name: 'Snowflake', data: snowflake, link: '/reference/resource-configs/snowflake-function-support', icon: 'snowflake' },
  { name: 'BigQuery', data: bigquery, link: '/reference/resource-configs/bigquery-function-support', icon: 'bigquery' },
  { name: 'Databricks', data: databricks, link: '/reference/fusion-function-support/databricks-function-support', icon: 'databricks' },
  { name: 'Amazon Redshift', data: redshift, link: '/reference/fusion-function-support/redshift-function-support', icon: 'redshift' },
  { name: 'Trino', data: trino, link: '/reference/fusion-function-support/trino-function-support', mono: 'T' },
  { name: 'DuckDB', data: duckdb, link: '/reference/fusion-function-support/duckdb-function-support', icon: 'duckdb-seeklogo' },
];

function PlatformIcon({ platform }) {
  const { colorMode } = useColorMode();
  if (platform.mono) {
    return <span className={styles.mono} aria-hidden="true">{platform.mono}</span>;
  }
  const dir = colorMode === 'dark' ? '/img/icons/white/' : '/img/icons/';
  return <img className={styles.icon} src={useBaseUrl(`${dir}${platform.icon}.svg`)} alt="" />;
}

function PlatformCard({ platform }) {
  const fns = platform.data.functions || [];
  const total = fns.length;
  const supported = fns.filter((f) => f.fusion_typecheck).length;
  const pct = total ? Math.round((supported / total) * 100) : 0;

  return (
    <Link to={useBaseUrl(platform.link)} className={styles.card}>
      <div className={styles.header}>
        <PlatformIcon platform={platform} />
        <span className={styles.name}>{platform.name}</span>
      </div>

      <div className={styles.count}>
        <strong>{supported.toLocaleString()}</strong> of {total.toLocaleString()} functions
      </div>

      <div className={styles.barTrack} role="img" aria-label={`${pct}% typecheck coverage`}>
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>

      <div className={styles.footer}>
        <span className={styles.pct}>{pct}% typecheckable</span>
        <span className={styles.cta}>View functions →</span>
      </div>
    </Link>
  );
}

export default function FunctionSupportGrid() {
  return (
    <div className={styles.grid}>
      {PLATFORMS.map((p) => (
        <PlatformCard key={p.name} platform={p} />
      ))}
    </div>
  );
}
