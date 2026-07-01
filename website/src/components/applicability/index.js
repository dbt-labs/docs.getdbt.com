import React from 'react';
import styles from './styles.module.css';

const SURFACE_LABELS = {
  platform: 'dbt platform',
  local: 'local development',
  oss: 'OSS only',
  both: 'dbt platform and local development',
};

const PLAN_LABELS = {
  all: 'All plans',
  'developer+': 'All plans',
  'starter+': 'Starter+',
  'enterprise+': 'All Enterprise tiers',
  'enterprise-only': 'Enterprise only',
};

const ENGINE_LABELS = {
  core: 'Core (Python)',
  fusion: 'Fusion',
};

export default function Applicability({ surface, plan = 'all', engine = 'both' }) {
  if (!surface) {
    return null;
  }

  const surfaceLabel = SURFACE_LABELS[surface];
  const shouldShowPlan = !['local', 'oss', 'both'].includes(surface) && PLAN_LABELS[plan];
  const shouldShowEngine = engine !== 'both' && ENGINE_LABELS[engine];

  if (surface === 'both' && !shouldShowPlan && !shouldShowEngine) {
    return (
      <div className={styles.applicability} aria-label="Page applicability">
        <span className={styles.surface}>
          Applies to <strong>all users</strong>
        </span>
      </div>
    );
  }

  if (!surfaceLabel) {
    return null;
  }

  return (
    <div className={styles.applicability} aria-label="Page applicability">
      <span className={styles.surface}>
        Applies to <strong>{surfaceLabel}</strong>
      </span>
      {shouldShowPlan && (
        <>
          <span className={styles.separator} aria-hidden="true">·</span>
          <span className={styles.planPill}>{PLAN_LABELS[plan]}</span>
        </>
      )}
      {shouldShowEngine && (
        <>
          <span className={styles.separator} aria-hidden="true">·</span>
          <span className={styles.enginePill}>{ENGINE_LABELS[engine]}</span>
        </>
      )}
    </div>
  );
}
