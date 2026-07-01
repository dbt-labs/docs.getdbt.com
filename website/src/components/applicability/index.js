import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import { FIELD_LABELS, VALUE_LABELS, availabilityPresets } from './availabilityPresets';

const SURFACE_LABELS = {
  platform: 'dbt platform',
  local: 'local development',
  oss: 'OSS only',
  both: 'dbt platform and local development',
};

const PLAN_LABELS = {
  all: 'All plans',
  'developer+': 'All plans',
  'starter+': 'Starter and above',
  'enterprise+': 'Enterprise',
  'enterprise-only': 'Enterprise only',
};

const ENGINE_LABELS = {
  core: 'Core (Python)',
  fusion: 'Fusion',
};

const ROW_ORDER = [
  'product',
  'feature',
  'workflow',
  'surface',
  'availableTo',
  'engine',
  'plans',
  'license',
  'status',
  'availability',
  'registration',
  'optional',
  'partialSupport',
  'notes',
  'excludes',
];

const AVAILABILITY_ALIASES = {
  partial_support: 'partialSupport',
  available_to: 'availableTo',
};

function normalizeKey(key) {
  return AVAILABILITY_ALIASES[key] || key;
}

function formatValue(key, value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const normalizedKey = normalizeKey(key);

  if (Array.isArray(value)) {
    return value
      .map((entry) => formatValue(normalizedKey, entry))
      .filter(Boolean)
      .join('; ');
  }

  return VALUE_LABELS[normalizedKey]?.[value] || value;
}

function getBadgeText(badge) {
  if (!badge) {
    return null;
  }

  if (Array.isArray(badge)) {
    return `Applies to: ${badge.filter(Boolean).join(' · ')}`;
  }

  return badge.startsWith('Applies to:') ? badge : `Applies to: ${badge}`;
}

function getBadgeParts(badgeText) {
  const prefix = 'Applies to:';
  if (!badgeText.startsWith(prefix)) {
    return {
      prefix: null,
      facets: [badgeText],
    };
  }

  return {
    prefix,
    facets: badgeText.slice(prefix.length).trim().split(' · ').filter(Boolean),
  };
}

function isPlanFacet(facet) {
  return [
    'All plans',
    'Starter and above',
    'Enterprise',
    'Enterprise+',
  ].includes(facet);
}

function buildRows(availability) {
  const productValue = formatValue('product', availability.product);

  return ROW_ORDER.map((key) => {
    const value = availability[key] ?? availability[normalizeKey(key)];
    const formatted = formatValue(key, value);
    if (!formatted) {
      return null;
    }

    const labelKey = key === 'engine' && ['all_engines', 'core_and_fusion'].includes(availability.engine) ? 'engines' : key;
    if (labelKey === 'surface' && productValue === formatted) {
      return null;
    }

    return {
      label: FIELD_LABELS[labelKey] || key,
      value: formatted,
    };
  }).filter(Boolean);
}

function normalizeAvailabilityKeys(availability) {
  return Object.entries(availability).reduce((normalized, [key, value]) => ({
    ...normalized,
    [normalizeKey(key)]: value,
  }), {});
}

function normalizeStructuredAvailability(availability) {
  const availabilityObject = typeof availability === 'string' ? { preset: availability } : availability;
  if (!availabilityObject || typeof availabilityObject !== 'object') {
    return null;
  }

  const preset = availabilityObject.preset ? availabilityPresets[availabilityObject.preset] : null;
  const merged = normalizeAvailabilityKeys({
    ...preset,
    ...availabilityObject,
  });
  const badgeText = getBadgeText(merged.badge || preset?.badge);

  if (!badgeText || badgeText === 'Applies to: dbt') {
    return null;
  }

  return {
    badgeText,
    badgeParts: getBadgeParts(badgeText),
    rows: buildRows(merged),
  };
}

function normalizeLegacyApplicability({ surface, plan = 'all', engine = 'both' }) {
  if (!surface) {
    return null;
  }

  const surfaceLabel = SURFACE_LABELS[surface];
  const shouldShowPlan = !['local', 'oss', 'both'].includes(surface) && PLAN_LABELS[plan];
  const shouldShowEngine = engine !== 'both' && ENGINE_LABELS[engine];

  if (surface === 'both' && !shouldShowPlan && !shouldShowEngine) {
    const badgeText = 'Applies to: all users';
    return {
      badgeText,
      badgeParts: getBadgeParts(badgeText),
      rows: [{ label: 'Availability', value: 'Applies to all users' }],
    };
  }

  if (!surfaceLabel) {
    return null;
  }

  const badge = [surfaceLabel];
  const rows = [{ label: 'Surface', value: surfaceLabel }];

  if (shouldShowPlan) {
    badge.push(PLAN_LABELS[plan]);
    rows.push({
      label: 'Plans',
      value: plan === 'enterprise+' ? 'Enterprise and Enterprise+' : PLAN_LABELS[plan],
    });
  }

  if (shouldShowEngine) {
    badge.push(ENGINE_LABELS[engine]);
    rows.push({ label: 'Engine', value: ENGINE_LABELS[engine] });
  }

  return {
    badgeText: getBadgeText(badge),
    badgeParts: getBadgeParts(getBadgeText(badge)),
    rows,
  };
}

export default function Applicability({ availability, ...legacyApplicability }) {
  const normalized = useMemo(
    () => normalizeStructuredAvailability(availability) || normalizeLegacyApplicability(legacyApplicability),
    [availability, legacyApplicability]
  );
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
        className={styles.applicability}
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
