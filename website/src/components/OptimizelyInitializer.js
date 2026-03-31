/**
 * Handles Optimizely opt-out when OneTrust performance consent is revoked.
 * The Optimizely script loads synchronously in <head> (see docusaurus.config.js
 * headTags) and runs opted-in by default. Users who previously rejected consent
 * already have the optimizelyOptOut cookie set, so Optimizely self-disables on
 * load without any action here. We only intervene when OneTrust reports a
 * consent state change during the session.
 */

import { useEffect } from 'react';
import { hasPerformanceConsent, onConsentChanged } from '../utils/consent';

export function OptimizelyInitializer() {
  useEffect(() => {
    const removeListener = onConsentChanged(() => {
      const hasConsent =
        process.env.NODE_ENV === 'development' || hasPerformanceConsent();

      if (typeof window.optimizely?.push === 'function') {
        window.optimizely.push({
          type: 'optOut',
          isOptOut: !hasConsent,
        });
      }
    });

    return () => removeListener?.();
  }, []);

  return null;
}
