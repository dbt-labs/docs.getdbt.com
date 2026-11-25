import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import {
  FIELD_LABELS,
  SURFACE_LABELS,
  SURFACE_TOOLTIP_LINKS,
  SURFACE_TOOLTIPS,
  availabilityPresets,
  getAccessFacets,
  getEngineFacet,
} from './availabilityPresets';

function normalizeAvailability(availability) {
  const availabilityObject = typeof availability === 'string'
    ? (SURFACE_LABELS[availability] ? { surface: availability } : { preset: availability })
    : availability;
  if (!availabilityObject || typeof availabilityObject !== 'object') {
    return null;
  }

  const preset = availabilityObject.preset ? availabilityPresets[availabilityObject.preset] : null;
  const merged = { ...preset, ...availabilityObject };

  const {
    engine,
    surface,
    access,
    minPlan,
    plans,
  } = merged;

  const engineFacet = getEngineFacet(engine);

  // surface can be a single value or a list (for features that live on more than one
  // surface, e.g. local development and the dbt platform). Dedupe by rendered label
  // since local and local_development share the "Local development" chip.
  const surfaceList = Array.isArray(surface) ? surface : (surface ? [surface] : []);
  const seenSurfaceLabels = new Set();
  const surfaceEntries = surfaceList.filter((item) => {
    const label = SURFACE_LABELS[item];
    if (!label || seenSurfaceLabels.has(label)) {
      return false;
    }
    seenSurfaceLabels.add(label);
    return true;
  });

  // Free access only renders alongside the platform surface, so treat a multi-surface
  // feature that includes platform as platform for the access facet.
  const accessSurface = surfaceList.includes('platform') ? 'platform' : surfaceList[0];
  const accessFacets = getAccessFacets(access, { minPlan, plans }, accessSurface);

  const rows = [];
  if (engineFacet) {
    rows.push({ label: FIELD_LABELS.engine, value: engineFacet.facet, tooltip: engineFacet.tooltip });
  }
  surfaceEntries.forEach((item) => {
    rows.push({
      label: FIELD_LABELS.surface,
      value: SURFACE_LABELS[item],
      tooltip: SURFACE_TOOLTIPS[item],
      tooltipLink: SURFACE_TOOLTIP_LINKS[item],
    });
  });
  accessFacets.forEach(({ facet, tooltip, tooltipLink, label }) => {
    rows.push({ label: label ?? FIELD_LABELS.access, value: facet, tooltip, tooltipLink });
  });

  // Engine leads the badge — it's the axis readers get stuck on first ("does this apply
  // to my dbt version at all?") before surface/access even matter.
  const badgeFacets = [
    engineFacet?.facet,
    ...surfaceEntries.map((item) => SURFACE_LABELS[item]),
    ...accessFacets.map(({ facet }) => facet),
  ].filter(Boolean);

  if (!badgeFacets.length) {
    return null;
  }

  return {
    badgeFacets,
    rows,
  };
}

function renderTooltipValue({ tooltip, value, tooltipLink }) {
  const text = tooltip || value;
  const linkText = tooltipLink?.text;
  const linkStart = linkText ? text.indexOf(linkText) : -1;

  if (linkStart === -1) {
    return text;
  }

  return (
    <>
      {text.slice(0, linkStart)}
      <a href={tooltipLink.href}>{linkText}</a>
      {text.slice(linkStart + linkText.length)}
    </>
  );
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

  const badgeText = normalized.badgeFacets.join(' | ');

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
              {index > 0 && <span className={styles.badgeSeparator}> | </span>}
              <span className={styles.badgeFacet}>{facet}</span>
            </React.Fragment>
          ))}
        </span>
        <span className={styles.infoIcon} aria-hidden="true">ⓘ</span>
      </button>
      {isOpen && (
        <span id={tooltipId} role="tooltip" className={styles.tooltip}>
          <dl className={styles.tooltipList}>
            {normalized.rows.map((row, index) => (
              <React.Fragment key={`${row.label}-${row.value}-${index}`}>
                <dt>{row.label}</dt>
                <dd>{renderTooltipValue(row)}</dd>
              </React.Fragment>
            ))}
          </dl>
        </span>
      )}
    </span>
  );
}
