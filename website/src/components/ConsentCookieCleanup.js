/**
 * Removes tracking cookies for any OneTrust category the visitor opts out of.
 * Runs once on mount (cleans up a prior session) and on every consent change.
 */

import { useEffect } from 'react';
import { onConsentChanged } from '../utils/consent';
import { clearOptedOutCookies } from '../utils/cookieCleanup';

export function ConsentCookieCleanup() {
  useEffect(() => {
    // Handles non-GDPR + already-loaded OneTrust.
    clearOptedOutCookies();

    // Re-run whenever the visitor updates their consent.
    const removeListener = onConsentChanged(() => {
      clearOptedOutCookies();
    });

    return () => {
      removeListener?.();
    };
  }, []);

  return null;
}
