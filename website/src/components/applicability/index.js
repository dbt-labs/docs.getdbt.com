import React from 'react';
import styles from './styles.module.css';

const SURFACE_LABELS = {
  platform: 'dbt platform',
  oss: 'local development',
  both: 'dbt platform and local development',
};

const PLAN_LABELS = {
  'developer+': 'Developer+',
  'starter+': 'Starter+',
  'enterprise+': 'Enterprise+',
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
  const shouldShowPlan = surface !== 'oss' && plan !== 'all' && PLAN_LABELS[plan];
  const shouldShowEngine = engine !== 'both' && ENGINE_LABELS[engine];

  if (surface === 'both' && !shouldShowPlan && !shouldShowEngine) {
    return null;
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
