import React from 'react';
import styles from './styles.module.css';

const STATE_LABELS = {
  ga: 'Yes',
  preview: 'Preview',
  'private-preview': 'Private preview',
  beta: 'Beta',
  none: 'Not supported',
};

const PLAN_LABELS = {
  all: 'All plans',
  'developer+': 'All plans',
  'starter+': 'Starter and above',
  'enterprise+': 'Enterprise',
  'enterprise-only': 'Enterprise only',
};

function normalizeCell(cell) {
  if (!cell) {
    return { state: 'none' };
  }

  if (typeof cell === 'string') {
    return { state: cell };
  }

  return cell;
}

function AvailabilityCell({ cell, oss = false }) {
  const normalizedCell = normalizeCell(cell);
  const { state = 'none', plan } = normalizedCell;
  const label = state === 'ga' && oss ? 'Free' : STATE_LABELS[state] || state;

  if (state === 'none') {
    return (
      <span className={styles.notSupported}>
        <span aria-hidden="true">—</span> {label}
      </span>
    );
  }

  if (state === 'ga') {
    return (
      <span className={styles.available}>
        <i className="ti ti-check" aria-hidden="true" />
        <span>{label}</span>
        {plan && <span className={styles.planTag}>{PLAN_LABELS[plan] || plan}</span>}
      </span>
    );
  }

  return (
    <span className={`${styles.statePill} ${styles[state.replace('-', '')] || ''}`}>
      {label}
      {plan && <span className={styles.planTag}>{PLAN_LABELS[plan] || plan}</span>}
    </span>
  );
}

function EngineMatrix({ rows }) {
  return (
    <div className={styles.matrixWrapper}>
      <table className={styles.matrix}>
        <thead>
          <tr>
            <th scope="col">Engine</th>
            <th scope="col">OSS / CLI</th>
            <th scope="col">dbt platform</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.engine}>
              <th scope="row">{row.engine}</th>
              <td><AvailabilityCell cell={row.oss} oss /></td>
              <td><AvailabilityCell cell={row.platform} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConnectionMatrix({ rows }) {
  return (
    <div className={styles.matrixWrapper}>
      <table className={styles.matrix}>
        <thead>
          <tr>
            <th scope="col">Connection</th>
            <th scope="col">Core (Python)</th>
            <th scope="col">Fusion</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">
                {row.href ? <a href={row.href}>{row.label}</a> : row.label}
                {row.lifecycle}
              </th>
              <td><AvailabilityCell cell={row.core} /></td>
              <td><AvailabilityCell cell={row.fusion} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AvailabilityMatrix({ rows = [], type = 'engine' }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  if (type === 'connection') {
    return <ConnectionMatrix rows={rows} />;
  }

  return <EngineMatrix rows={rows} />;
}
