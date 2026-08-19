/**
 * Datadog RUM initialization for Core Web Vitals and session replay.
 * Config is passed from docusaurus.config.js (build-time env vars).
 */

import { datadogRum } from '@datadog/browser-rum';

let initialized = false;

/**
 * @param {Object} config - From siteConfig.datadog (DD_APP_ID, DD_CLIENT_TOKEN, etc.)
 */
export function initDatadogRum(config) {
  if (
    initialized ||
    !config?.applicationId ||
    !config?.clientToken ||
    typeof window === 'undefined'
  ) {
    return;
  }

  datadogRum.init({
    applicationId: config.applicationId,
    clientToken: config.clientToken,
    site: 'datadoghq.com',

    service: config.service || 'docs-getdbt-com',
    env: config.env || 'production',
    version: config.version || 'unknown',

    sessionSampleRate: config.sessionSampleRate ?? 25,
    sessionReplaySampleRate: config.sessionReplaySampleRate ?? 10,

    trackResources: true,
    trackLongTasks: true,
    trackUserInteractions: true,

    defaultPrivacyLevel: 'mask-user-input',
  });

  trackCspViolations();

  initialized = true;
}

/**
 * Second CSP detection channel, alongside the report-uri/report-to directives
 * in website/vercel.json.
 *
 * POSITIVE SIGNAL ONLY. It is consent-gated (see DatadogInitializer), attaches
 * after hydration so it misses load-time violations, and is session-sampled.
 * Violations here prove browsers are violating; an absence proves nothing, so
 * never diagnose collector silence from this channel.
 */
function trackCspViolations() {
  document.addEventListener('securitypolicyviolation', (event) => {
    datadogRum.addError(
      new Error(`CSP ${event.disposition}: ${event.effectiveDirective}`),
      {
        csp: {
          disposition: event.disposition,
          directive: event.effectiveDirective,
          blockedURI: event.blockedURI,
          documentURI: event.documentURI,
          sourceFile: event.sourceFile,
        },
      }
    );
  });
}
