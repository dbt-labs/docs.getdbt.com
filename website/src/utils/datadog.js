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

  initialized = true;
}
