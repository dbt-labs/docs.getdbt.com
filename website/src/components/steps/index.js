/* eslint-disable */
import React, { useState } from 'react';
import styles from './styles.module.css';

// <Step title="..."> ... </Step> — a single step. Rendered only through <Steps>,
// which reads its `title` and children; returned as-is if used on its own.
export function Step({ children }) {
  return <>{children}</>;
}

// <Steps> ... </Steps> — a compact stepper. Shows one step at a time with a
// numbered dot nav and a "View all steps" toggle that expands the full list.
export default function Steps({ children }) {
  const steps = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.props && 'title' in child.props
  );
  const total = steps.length;
  const [expanded, setExpanded] = useState(false);
  const [current, setCurrent] = useState(0);

  if (!total) return null;

  const title = (step, i) => step.props.title || `Step ${i + 1}`;

  if (expanded) {
    return (
      <div className={styles.wrapper}>
        <ol className={styles.list}>
          {steps.map((step, i) => (
            <li key={i} className={styles.listItem}>
              <span className={styles.badge}>{i + 1}</span>
              <div className={styles.content}>
                <div className={styles.title}>{title(step, i)}</div>
                <div className={styles.body}>{step.props.children}</div>
              </div>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className={styles.linkButton}
          onClick={() => setExpanded(false)}
        >
          View step by step
        </button>
      </div>
    );
  }

  const step = steps[current];
  return (
    <div className={styles.wrapper}>
      <div className={styles.nav}>
        <div className={styles.dots}>
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              className={i === current ? `${styles.dot} ${styles.dotActive}` : styles.dot}
              aria-label={`Go to step ${i + 1}`}
              aria-current={i === current ? 'step' : undefined}
              onClick={() => setCurrent(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className={styles.navRight}>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => setExpanded(true)}
          >
            View all steps
          </button>
          {current > 0 && (
            <button
              type="button"
              className={styles.navButton}
              onClick={() => setCurrent((c) => c - 1)}
            >
              Back
            </button>
          )}
          {current < total - 1 && (
            <button
              type="button"
              className={styles.navButton}
              onClick={() => setCurrent((c) => c + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
      <div className={styles.single}>
        <span className={styles.badge}>{current + 1}</span>
        <div className={styles.content}>
          <div className={styles.title}>{title(step, current)}</div>
          <div className={styles.body}>{step.props.children}</div>
        </div>
      </div>
    </div>
  );
}
