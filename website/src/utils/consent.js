/**
 * OneTrust consent helpers for performance/cookie consent.
 * Used to gate Datadog RUM (Core Web Vitals) on user consent.
 */

const PERFORMANCE_GROUP_ID = 'C0002';

export function hasPerformanceConsent() {
  if (typeof window === 'undefined') return false;

  const groups = window.OnetrustActiveGroups || '';
  return groups.split(',').includes(PERFORMANCE_GROUP_ID);
}

/**
 * Listen for OneTrust consent updates.
 * Returns a function to remove the listener, or undefined when not in browser.
 */
export function onConsentChanged(callback) {
  if (typeof window === 'undefined') return undefined;

  const handler = () => {
    callback();
  };
  window.addEventListener('OneTrustGroupsUpdated', handler);
  return () => {
    window.removeEventListener('OneTrustGroupsUpdated', handler);
  };
}
