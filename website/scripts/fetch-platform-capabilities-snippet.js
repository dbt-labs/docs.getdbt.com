/**
 * Fetches platform_capabilities.yml from the dbt-cloud-platform-validator-metadata repo
 * and writes website/snippets/_platform-capabilities-from-catalog.md (Markdown tables).
 *
 * Override URL:
 *   PLATFORM_CAPABILITIES_YAML_URL=https://raw.githubusercontent.com/org/repo/main/platform_capabilities.yml
 *
 * Private repo (required for dbt-labs/dbt-cloud-platform-validator-metadata):
 *   VALIDATOR_DOCS_REPO_TOKEN — PAT with read access (same token as deployment-config-validator README fetch)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const yaml = require('js-yaml');

const YAML_URL =
  process.env.PLATFORM_CAPABILITIES_YAML_URL ||
  'https://raw.githubusercontent.com/dbt-labs/dbt-cloud-platform-validator-metadata/main/platform_capabilities.yml';

const OUT_PATH = path.join(
  __dirname,
  '..',
  'snippets',
  '_platform-capabilities-from-catalog.md'
);

function fetch(url) {
  const token = process.env.VALIDATOR_DOCS_REPO_TOKEN;
  const headers = token ? { Authorization: `token ${token}` } : {};
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers }, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
          return;
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        res.on('error', reject);
      })
      .on('error', reject);
  });
}

function regionsTable(regions) {
  if (!Array.isArray(regions) || regions.length === 0) {
    return '_No regions defined in catalog._';
  }
  const headers = [
    'Region id',
    'Cloud',
    'Code',
    'Display name',
    'Lifecycle',
    'PrivateLink / PSC',
    'Tenancy',
    'Auth notes',
  ];
  const rows = regions.map((r) => {
    let ten = '—';
    const t = r.tenancy;
    if (typeof t === 'string') ten = t;
    else if (Array.isArray(t) && t.length) ten = t.join(', ');
    return [
      r.id ?? '—',
      r.cloud ?? '—',
      r.region_code ?? '—',
      (r.display_name ?? '—').replace(/\|/g, '\\|'),
      r.lifecycle ?? '—',
      r.private_link ?? '—',
      ten.replace(/\|/g, '\\|'),
      (r.auth_notes ?? '').replace(/\|/g, '\\|'),
    ];
  });
  const esc = (c) => String(c);
  const headerLine = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map(esc).join(' | ')} |`).join('\n');
  return `${headerLine}\n${sep}\n${body}`;
}

function authCell(v) {
  if (v === true) return '✅';
  if (v === false) return '❌';
  return '—';
}

/** Core engine matrix — mirrors Developer Hub “dbt Core” authentication table. */
function warehouseAuthCoreTable(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return '_No Core warehouse auth rows in catalog._';
  }
  const headers = [
    'Integration',
    'User credentials',
    'Service account credentials',
    'Warehouse OAuth (users)',
    'External OAuth (users)',
    'Service-to-service OAuth',
    'SSH',
    'Private connectivity',
  ];
  const bodyRows = rows.map((r) => [
    (r.display_name ?? r.id ?? '—').replace(/\|/g, '\\|'),
    authCell(r.user_credentials),
    authCell(r.service_account_credentials),
    authCell(r.warehouse_oauth_users),
    authCell(r.external_oauth_users),
    authCell(r.service_to_service_oauth),
    authCell(r.ssh),
    authCell(r.private_connectivity),
  ]);
  const esc = (c) => String(c);
  const headerLine = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = bodyRows.map((line) => `| ${line.map(esc).join(' | ')} |`).join('\n');
  return `${headerLine}\n${sep}\n${body}`;
}

/** Fusion engine matrix — mirrors Developer Hub Fusion authentication table. */
function warehouseAuthFusionTable(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return '_No Fusion warehouse auth rows in catalog._';
  }
  const headers = [
    'Integration',
    'User credentials / token',
    'Service account credentials',
    'Warehouse OAuth (users)',
    'External OAuth (users)',
    'Service-to-service OAuth',
    'Key / pair',
    'MFA',
    'SSH',
    'Private connectivity',
  ];
  const bodyRows = rows.map((r) => [
    (r.display_name ?? r.id ?? '—').replace(/\|/g, '\\|'),
    authCell(r.user_credentials),
    authCell(r.service_account_credentials),
    authCell(r.warehouse_oauth_users),
    authCell(r.external_oauth_users),
    authCell(r.service_to_service_oauth),
    authCell(r.key_pair),
    authCell(r.mfa),
    authCell(r.ssh),
    authCell(r.private_connectivity),
  ]);
  const esc = (c) => String(c);
  const headerLine = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = bodyRows.map((line) => `| ${line.map(esc).join(' | ')} |`).join('\n');
  return `${headerLine}\n${sep}\n${body}`;
}

async function main() {
  try {
    const raw = await fetch(YAML_URL);
    const doc = yaml.load(raw);
    const timestamp = new Date().toISOString().split('T')[0];
    const ver = doc?.catalog_version ?? '?';
    const regionsMd = regionsTable(doc?.regions);
    const wca = doc?.warehouse_connection_auth;
    const hubAuth =
      doc?.docs_urls?.warehouse_auth_methods ??
      'https://docs.getdbt.com/docs/platform/connect-data-platform/about-connections#supported-authentication-methods';
    let authMd = '';
    if (wca && typeof wca === 'object') {
      const syncNote = wca.docs_sync_note
        ? `\n\n_${String(wca.docs_sync_note).replace(/\|/g, '\\|')}_`
        : '';
      authMd = `

## Warehouse connection authentication

Matrices below are generated from the catalog YAML (same semantics as [Supported authentication methods](${hubAuth}) on the Developer Hub).${syncNote}

### dbt Core (Latest)

${warehouseAuthCoreTable(wca.core)}

### dbt Fusion

${warehouseAuthFusionTable(wca.fusion)}

_Private connectivity_ depends on cloud provider and deployment type; see the Hub page for details.
`;
    }

    const content = `<!-- Auto-generated from ${YAML_URL}. Do not edit. catalog_version=${ver} Last fetched: ${timestamp} -->

:::note Workshop draft

This page is generated from **`platform_capabilities.yml`** in the **[dbt-cloud-platform-validator-metadata](https://github.com/dbt-labs/dbt-cloud-platform-validator-metadata)** repo. **Regions** include workshop PrivateLink/PSC values until Infra publishes authoritative posture. **Warehouse auth** rows follow the [Supported authentication methods](${hubAuth}) tables.

:::

## Regions

${regionsMd}
${authMd}
`;

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, content, 'utf8');
    console.log('Wrote', OUT_PATH);
  } catch (err) {
    console.warn('fetch-platform-capabilities-snippet.js warning:', err.message);
    if (fs.existsSync(OUT_PATH)) {
      console.warn('Using previously generated snippet as fallback.');
    } else {
      console.error('No fallback snippet found — build will likely fail.');
      process.exit(1);
    }
  }
}

main();
