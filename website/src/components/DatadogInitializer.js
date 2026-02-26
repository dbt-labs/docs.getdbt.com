/**
 * Initializes Datadog RUM when consent is given (OneTrust performance group).
 * Renders nothing; runs once on mount and reacts to consent changes.
 */

import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { initDatadogRum } from '../utils/datadog';
import { hasPerformanceConsent, onConsentChanged } from '../utils/consent';

let isRumInitialized = false;

export function DatadogInitializer() {
  const { siteConfig } = useDocusaurusContext();
  const datadogConfig = siteConfig?.datadog;

  useEffect(() => {
    const initRUM = () => {
      if (isRumInitialized || !datadogConfig) return;

      initDatadogRum(datadogConfig);
      isRumInitialized = true;
    };

    const disableRUM = () => {
      if (!isRumInitialized) return;

      // Clear any user-identifying context
      datadogRum.setGlobalContext({
        user: {
          id: undefined,
          name: undefined,
          email: undefined,
        },
      });

      // NOTE: Datadog RUM cannot be fully "stopped" once initialized.
      // This ensures no PII continues being sent.
    };

    const evaluateConsent = () => {
      const hasConsent =
        process.env.NODE_ENV === 'development' || hasPerformanceConsent();

      if (hasConsent) {
        initRUM();
      } else {
        disableRUM();
      }
    };

    // 1. Attempt immediately (handles non-GDPR + already-loaded OneTrust)
    evaluateConsent();

    // 2. Listen for OneTrust updates (handles timing issue)
    const removeListener = onConsentChanged(() => {
      evaluateConsent();
    });

    return () => {
      removeListener?.();
    };
  }, [datadogConfig]);

  return null;
}
