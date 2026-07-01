import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import {
  ENGINE_BADGE_LABELS,
  FIELD_LABELS,
  PLAN_BADGE_LABELS,
  SURFACE_LABELS,
  VALUE_LABELS,
  availabilityPresets,
} from './availabilityPresets';

// Tooltip rows, in display order. Kept deliberately short: Where, Engine(s), Plans.
// Lifecycle status is owned by the H1 <Lifecycle> pill and is never repeated here.
const ROW_ORDER = ['surface', 'engine', 'plans'];

const PLAN_FACETS = Object.values(PLAN_BADGE_LABELS);

function formatValue(key, value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return VALUE_LABELS[key]?.[value] || value;
}

function getBadgeText(facets) {
  const filtered = facets.filter(Boolean);
  if (!filtered.length) {
    return null;
  }

  return `Applies to: ${filtered.join(' · ')}`;
}

function getBadgeParts(badgeText) {
  const prefix = 'Applies to:';
  return {
    prefix,
    facets: badgeText.slice(prefix.length).trim().split(' · ').filter(Boolean),
  };
}

function isPlanFacet(facet) {
  return PLAN_FACETS.includes(facet);
}

function buildRows(availability) {
  return ROW_ORDER.map((key) => {
    const formatted = formatValue(key, availability[key]);
    if (!formatted) {
      return null;
    }

    // Use the plural "Engines" label when the value covers more than one engine.
    const labelKey =
      key === 'engine' && ['all_engines', 'core_and_fusion'].includes(availability.engine)
        ? 'engines'
        : key;

    return { label: FIELD_LABELS[labelKey] || key, value: formatted };
  }).filter(Boolean);
}

// The badge is always derived from surface + plans + engine — writers never write badge text.
function getBadgeFacets(merged) {
  if (merged.preset === 'all_users') {
    return ['all users'];
  }

  if (!merged.surface) {
    return [];
  }

  return [
    SURFACE_LABELS[merged.surface],
    PLAN_BADGE_LABELS[merged.plans],
    ENGINE_BADGE_LABELS[merged.engine],
  ];
}

function normalizeAvailability(availability) {
  const availabilityObject =
    typeof availability === 'string' ? { preset: availability } : availability;
  if (!availabilityObject || typeof availabilityObject !== 'object') {
    return null;
  }

  const preset = availabilityObject.preset ? availabilityPresets[availabilityObject.preset] : null;
  const merged = { ...preset, ...availabilityObject };

  // A platform page with no explicit plan tier applies to every plan.
  if (merged.surface === 'platform' && !merged.plans) {
    merged.plans = 'all_platform_plans';
  }

  const badgeText = getBadgeText(getBadgeFacets(merged));

  if (!badgeText) {
    return null;
  }

  return {
    badgeText,
    badgeParts: getBadgeParts(badgeText),
    rows: buildRows(merged),
  };
}

export default function Availability({ availability }) {
  const normalized = useMemo(() => normalizeAvailability(availability), [availability]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const wrapperRef = useRef(null);
  const openTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const tooltipId = useId();

  const clearHoverTimers = useCallback(() => {
    window.clearTimeout(openTimeoutRef.current);
    window.clearTimeout(closeTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsPinned(false);
        setIsOpen(false);
      }
    }

    function handleFocusIn(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setIsPinned(false);
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsPinned(false);
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => () => clearHoverTimers(), [clearHoverTimers]);

  if (!normalized) {
    return null;
  }

  return (
    <span
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={() => {
        if (isPinned) {
          return;
        }

        clearHoverTimers();
        openTimeoutRef.current = window.setTimeout(() => setIsOpen(true), 250);
      }}
      onMouseLeave={() => {
        if (isPinned) {
          return;
        }

        clearHoverTimers();
        closeTimeoutRef.current = window.setTimeout(() => setIsOpen(false), 150);
      }}
    >
      <button
        type="button"
        className={styles.availability}
        aria-label={`${normalized.badgeText}. Show availability details`}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        onClick={() => {
          clearHoverTimers();
          setIsPinned((current) => {
            const nextPinned = !current;
            setIsOpen(nextPinned);
            return nextPinned;
          });
        }}
        onFocus={() => {
          clearHoverTimers();
          window.setTimeout(() => {
            setIsOpen(true);
          }, 0);
        }}
      >
        <span className={styles.badgeText}>
          {normalized.badgeParts?.prefix && (
            <span className={styles.badgePrefix}>{normalized.badgeParts.prefix} </span>
          )}
          {normalized.badgeParts?.facets.map((facet, index) => (
            <React.Fragment key={`${facet}-${index}`}>
              {index > 0 && <span className={styles.badgeSeparator}> · </span>}
              <span
                className={isPlanFacet(facet) ? styles.planFacet : styles.badgeFacet}
                data-availability-facet={isPlanFacet(facet) ? 'plan' : undefined}
              >
                {facet}
              </span>
            </React.Fragment>
          ))}
        </span>
        <span className={styles.infoIcon} aria-hidden="true">ⓘ</span>
      </button>
      {isOpen && (
        <span id={tooltipId} role="tooltip" className={styles.tooltip}>
          <span className={styles.tooltipTitle}>Applies to</span>
          <dl className={styles.tooltipList}>
            {normalized.rows.map((row) => (
              <React.Fragment key={`${row.label}-${row.value}`}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </React.Fragment>
            ))}
          </dl>
        </span>
      )}
    </span>
  );
}
