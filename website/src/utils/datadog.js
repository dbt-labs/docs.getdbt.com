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
 * Second CSP detection channel, independent of the report endpoint.
 *
 * Violations are also POSTed to the collector via the report-uri/report-to
 * directives in website/vercel.json. This listener is deliberate redundancy: it
 * still fires when report delivery is blocked in transit -- by an ad blocker, a
 * corporate proxy, or a filter list targeting the collector's host -- and it
 * correlates each violation with the RUM session and replay we already collect.
 *
 * It is what distinguishes "there were no violations" from "the reports never
 * arrived", which are otherwise indistinguishable, and the reassuring reading is
 * the one people tend to believe.
 *
 * Subject to RUM session sampling, so treat it as a cross-check on whether
 * reports are flowing rather than a substitute for the collector.
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
