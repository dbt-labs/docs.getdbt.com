---
title: "Weekly dbt single-tenant release notes"
description: "Release notes for weekly single-tenant updates."
id: "dbt-cloud-release-notes-gen"
sidebar: "dbt single-tenant release notes"
pagination_next: null
pagination_prev: null
unlisted: true
---

<Constant name="cloud" /> Single-tenant release notes for weekly updates. Release notes fall into one of these categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by date for single-tenant environments.

## December 10, 2025

### New
- **dbt platform – Private endpoints inventory**: Workspace settings now surface a gated “Private endpoints” page (feature flag + permission based) where single-tenant operators can search, sort, and paginate every PrivateLink endpoint without opening a support ticket. <!-- https://github.com/dbt-labs/cloud-ui/compare/bd5b51b3325707f35aa16a2b1db44371ac26d9fb...2717141a98fa3d56a1d08192798d43074d4f6ea3 -->

### Enhancements
- **AI codegen API**: Streaming middleware enforces request-scoped instrumentation across every AI endpoint, MCP SQL/Text-to-SQL tools now derive tenant tokens from `dbt-jwt-auth`, offload warehouse calls via threads, and expose human-readable tool names while gating keyword search behind LaunchDarkly for approved tenants. <!-- ✅ reviewed by mirna https://github.com/dbt-labs/ai-codegen-api/compare/3a63caa3608227c4f4f790767f2da6b0e161b3ce...53dd582d636b4ac6ed3830f0fa0277624e1279d8 -->
- **dbt platform – Operations clarity**: Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped so troubleshooting is faster. <!-- https://github.com/dbt-labs/cloud-ui/compare/bd5b51b3325707f35aa16a2b1db44371ac26d9fb...2717141a98fa3d56a1d08192798d43074d4f6ea3 -->
- **dbt platform – Sign-in resilience**: Regional account switching reuses PKCE params stored with a 10‑minute TTL, reducing OAuth retries for VS Code and cross-region redirects. <!-- https://github.com/dbt-labs/cloud-ui/compare/bd5b51b3325707f35aa16a2b1db44371ac26d9fb...2717141a98fa3d56a1d08192798d43074d4f6ea3 -->
- **dbt cloud app – Collaboration & notifications**: Slack Copilot mentions now run through hardened workers with CSV attachments and structured logging, while webhook channels accept very long URLs, gracefully handle warning-only subscriptions, and scrub corrupted job IDs. <!-- https://github.com/dbt-labs/dbt-cloud/compare/de23dc27acd4f236b182d115daae2c852b80a29b...1c771b16ebbb932158400a5e81ccf9cd04979e7 -->
- **dbt cloud app – Profile & credential management**: Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync. <!-- https://github.com/dbt-labs/dbt-cloud/compare/de23dc27acd4f236b182d115daae2c852b80a29b...1c771b16ebbb932158400a5e81ccf9cd04979e7 -->
- **dbt cloud CLI server – Internal enhancements**: Improved stability and performance for large projects. <!-- ✅ Reviewed by jp-dbt Tues Dec 9  https://github.com/dbt-labs/dbt-cloud-cli-server/commit/871e280694087e21ea3d5a7ca84d6805e6799450 -->
- **Studio - Fusion logging improvements*: On Fusion, node start and end times will now properly be displayed in command output. <!--  ✅  Reviewed by jp-dbt Tues Dec 9 https://github.com/dbt-labs/ide-server/commit/239863005992ff39687cc337e2f113ba9c0bb512 -->
- **IDE UI – AI entry points & run controls**: Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps with clear UI labels. <!-- https://github.com/dbt-labs/ide-ui/compare/0b9028083dd7ca9da858878755735a747782fa94...856b80ea1a37649ea257ca9d3352e44353f9fe88 -->
- **Scribe – Log lifecycle controls**: Redis log buffers can be purged immediately once uploads complete, and the uploader co-ordinates stop signals between S3 and Redis to prevent stray sentinel files. <!-- https://github.com/dbt-labs/scribe/compare/v0.0.71...v0.0.73 -->
- **Studio – Editing UX**: Studio's tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking.<!--  ✅  Reviewed by jp-dbt Tues Dec 9 https://github.com/dbt-labs/studio/compare/7eb6e566274fe08bf1cf7dc30e8c0ca2dd6571e8...11ed3b092efe17a745062af5a100a25077182f08 -->

### Fixes
- **IDE server – VCS errors**: Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier, making automation failures actionable. <!--  ✅ reviewed by mirna ✅ Reviewed by jp-dbt Tues Dec 9 https://github.com/dbt-labs/ide-server/commit/239863005992ff39687cc337e2f113ba9c0bb512 -->

### Behavior Changes
- **Insights UI – Download lockdown**: Chart PNG/CSV download buttons disappear automatically when the `ninja-498-disable-download` flag is on, keeping data-egress restrictions intact for regulated tenants. <!-- https://github.com/dbt-labs/insights-ui/compare/2dc1826aa16f2c30168b541dc4fa435274911d27...af7811ca2deab05584a63e27419c63e0bfb16b97 -->


## December 3, 2025

### New
- dbt platform – Command pane: Autofix deprecation warnings
  - When deprecations are detected, you now see “Autofix deprecation warnings”
 
- dbt platform – Autofix Packages detailed results
  - After running “Autofix packages,” you see a results panel with upgraded packages (with links), packages left unchanged and why, and quick access to `packages.yml` to help assess Fusion readiness and next steps.

### Enhancements
- dbt platform – Code Quality tab improvements
  - Clearer lint/format actions (SQLFluff, Prettier), better empty states, visible Config button when applicable, and simplified logs retrieval.
  - Applies to SQL, JSON, YAML, and Markdown workflows.
- dbt platform – Editor experience
  - Upgraded editor for stability, improved container sizing/overflow, “Save” overlay only appears when tabs are open, and minor action‑bar refinements.

### Fixes
- dbt platform – Lineage and Command pane stability
  - Reliability improved by aligning with updated IDE and VS Code command APIs; eliminates intermittent skips.

### Behavior changes
- dbt platform – dbt Core “versionless” renamed to “latest” so it's consistent and clear across tenants.
