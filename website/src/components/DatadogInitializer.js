/**
 * Initializes Datadog RUM when consent is given (OneTrust performance group).
 * Config is injected at build time via webpack DefinePlugin (see plugins/customWebpackConfig).
 */

import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { initDatadogRum } from '../utils/datadog';
import { hasPerformanceConsent, onConsentChanged } from '../utils/consent';

let isRumInitialized = false;

// Build config from env (injected at build time by customWebpackConfig)
function getDatadogConfig() {
  return {
    applicationId: process.env.DD_APP_ID || '',
    clientToken: process.env.DD_CLIENT_TOKEN || '',
    service: process.env.DD_SERVICE || 'docs-getdbt-com',
    env: process.env.DD_ENV || 'production',
    version: process.env.DD_VERSION || 'unknown',
    sessionSampleRate: parseInt(process.env.DD_SAMPLE_RATE || '25', 10),
    sessionReplaySampleRate: parseInt(process.env.DD_SESSION_REPLAY_SAMPLE_RATE || '10', 10),
  };
}

export function DatadogInitializer() {
  useEffect(() => {
    const datadogConfig = getDatadogConfig();
  
    const initRUM = () => {
      if (isRumInitialized || !datadogConfig.applicationId || !datadogConfig.clientToken) return;

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
  }, []);

  return null;
}
