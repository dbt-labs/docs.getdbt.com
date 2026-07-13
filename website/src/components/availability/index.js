import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import {
  FIELD_LABELS,
  SURFACE_LABELS,
  SURFACE_TOOLTIPS,
  availabilityPresets,
  getAccessFacets,
} from './availabilityPresets';

function normalizeAvailability(availability) {
  const availabilityObject =
    typeof availability === 'string' ? { preset: availability } : availability;
  if (!availabilityObject || typeof availabilityObject !== 'object') {
    return null;
  }

  const preset = availabilityObject.preset ? availabilityPresets[availabilityObject.preset] : null;
  const merged = { ...preset, ...availabilityObject };

  let { surface, access, plans } = merged;

  // A platform page with no explicit access requirement defaults to free, with a console
  // warning — bare "dbt platform" badges can otherwise read as implicitly paid.
  if (surface === 'platform' && !access) {
    // eslint-disable-next-line no-console
    console.warn(
      `Availability: surface "platform" has no access set (availability: ${JSON.stringify(
        availabilityObject
      )}). Defaulting access to "free".`
    );
    access = 'free';
  }

  const accessFacets = getAccessFacets(access, plans, surface);
  const surfaceLabel = SURFACE_LABELS[surface];

  const rows = [];
  if (surfaceLabel) {
    rows.push({ label: FIELD_LABELS.surface, value: surfaceLabel, tooltip: SURFACE_TOOLTIPS[surface] });
  }
  accessFacets.forEach(({ facet, tooltip }) => {
    rows.push({ label: FIELD_LABELS.access, value: facet, tooltip });
  });

  const badgeFacets = [surfaceLabel, ...accessFacets.map(({ facet }) => facet)].filter(Boolean);

  if (!badgeFacets.length) {
    return null;
  }

  return {
    badgeFacets,
    rows,
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

  const badgeText = normalized.badgeFacets.join(' · ');

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
        aria-label={`${badgeText}. Show availability details`}
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
          {normalized.badgeFacets.map((facet, index) => (
            <React.Fragment key={`${facet}-${index}`}>
              {index > 0 && <span className={styles.badgeSeparator}> · </span>}
              <span className={styles.badgeFacet}>{facet}</span>
            </React.Fragment>
          ))}
        </span>
        <span className={styles.infoIcon} aria-hidden="true">ⓘ</span>
      </button>
      {isOpen && (
        <span id={tooltipId} role="tooltip" className={styles.tooltip}>
          <span className={styles.tooltipTitle}>Applies to</span>
          <dl className={styles.tooltipList}>
            {normalized.rows.map((row, index) => (
              <React.Fragment key={`${row.label}-${row.value}-${index}`}>
                <dt>{row.label}</dt>
                <dd>
                  {row.value}
                  {row.tooltip ? <span className={styles.tooltipDescription}> — {row.tooltip}</span> : null}
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </span>
      )}
    </span>
  );
}
