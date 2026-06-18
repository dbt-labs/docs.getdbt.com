/**
 * Deletes tracking cookies for OneTrust categories the visitor has opted out of.
 *
 * OneTrust blocks/re-blocks tags but does not reliably delete already-set
 * first-party cookies immediately on opt-out, so users would otherwise have to
 * clear cookies manually. This runs on load and on every consent change and
 * removes only the cookies for categories that are NOT currently active.
 *
 * The authoritative category -> cookie mapping is read at runtime from
 * window.OneTrust.GetDomainData() so it stays in sync with the OneTrust scan.
 * A small fallback map is used only when GetDomainData is unavailable.
 */

const STRICTLY_NECESSARY_GROUP_ID = 'C0001';

// OneTrust's own consent cookies must never be deleted.
const PROTECTED_COOKIE_NAMES = ['OptanonConsent', 'OptanonAlertBoxClosed'];

// Used only when OneTrust.GetDomainData() is unavailable (e.g. local dev where
// the OneTrust script is not injected). At runtime GetDomainData is authoritative.
const FALLBACK_COOKIE_PATTERNS = {
  // Performance / Analytics
  C0002: ['_ga', '_ga_', '_gid', '_gat', '_sp_id.', '_sp_ses.', 'optimizelyEndUserId'],
  // Functional
  C0003: ['__hstc', '__hssc', '__hssrc', 'hubspotutk'],
  // Targeting / Advertising
  C0004: ['__hstc', '__hssc', '__hssrc', 'hubspotutk'],
};

function isOneTrustReady() {
  if (typeof window === 'undefined') return false;
  return (
    typeof window.OnetrustActiveGroups === 'string' ||
    typeof window.OneTrust?.GetDomainData === 'function'
  );
}

function getActiveGroupIds() {
  const ids = (window.OnetrustActiveGroups || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);
  return new Set(ids);
}

function normalizePattern(name) {
  // OneTrust may store wildcard names like "_ga_*" — strip the trailing wildcard.
  return name.replace(/\*+$/, '').trim();
}

function collectGroupCookieNames(group) {
  const names = [];

  for (const cookie of group.FirstPartyCookies ?? []) {
    if (cookie.Name) names.push(cookie.Name);
  }
  for (const host of group.Hosts ?? []) {
    for (const cookie of host.Cookies ?? []) {
      if (cookie.Name) names.push(cookie.Name);
    }
  }

  return names;
}

/**
 * Cookie-name patterns for every category the visitor is NOT consented to,
 * excluding Strictly Necessary and OneTrust's own cookies.
 */
function getOptedOutPatterns() {
  const active = getActiveGroupIds();
  const groups = window.OneTrust?.GetDomainData?.()?.Groups ?? [];
  const patterns = new Set();

  const add = (name) => {
    const normalized = normalizePattern(name);
    if (normalized && !PROTECTED_COOKIE_NAMES.includes(normalized)) {
      patterns.add(normalized);
    }
  };

  if (groups.length > 0) {
    for (const group of groups) {
      const id = group.CustomGroupId || group.OptanonGroupId;
      if (!id || id === STRICTLY_NECESSARY_GROUP_ID || active.has(id)) continue;
      for (const name of collectGroupCookieNames(group)) add(name);
    }
  } else {
    for (const [id, names] of Object.entries(FALLBACK_COOKIE_PATTERNS)) {
      if (active.has(id)) continue;
      for (const name of names) add(name);
    }
  }

  return [...patterns];
}

function getDomainCandidates() {
  const { hostname } = window.location;
  const candidates = [undefined, hostname, `.${hostname}`];
  // Cookies shared across www/docs are set on the registrable parent domain.
  if (hostname.endsWith('getdbt.com')) candidates.push('.getdbt.com');
  return candidates;
}

function expireCookie(name) {
  const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
  for (const domain of getDomainCandidates()) {
    const domainPart = domain ? `; domain=${domain}` : '';
    document.cookie = `${name}=; expires=${expires}; path=/${domainPart}`;
  }
}

/**
 * Delete every current cookie whose name matches (exactly or by prefix) a
 * pattern from a category the visitor has opted out of. Safe to call repeatedly.
 */
export function clearOptedOutCookies() {
  if (!isOneTrustReady()) return;

  const patterns = getOptedOutPatterns();
  if (patterns.length === 0) return;

  const currentCookieNames = document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0].trim())
    .filter(Boolean);

  for (const cookieName of currentCookieNames) {
    if (PROTECTED_COOKIE_NAMES.includes(cookieName)) continue;
    const matches = patterns.some(
      (pattern) => cookieName === pattern || cookieName.startsWith(pattern)
    );
    if (matches) expireCookie(cookieName);
  }
}
