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

### Enhancements
- **AI codegen API**: Streaming middleware enforces request-scoped instrumentation across every AI endpoint, MCP SQL/Text-to-SQL tools now derive tenant tokens from `dbt-jwt-auth`, offload warehouse calls via threads, and expose human-readable tool names while gating keyword search behind LaunchDarkly for approved tenants. 
- **dbt platform
  – **Operations clarity**: Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped so troubleshooting is faster.
  - **Collaboration & notifications**: Slack Copilot mentions now run through hardened workers with CSV attachments and structured logging, while webhook channels accept very long URLs, gracefully handle warning-only subscriptions, and scrub corrupted job IDs.
  - **Profile & credential management**: Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync. 
- **dbt CLI server – Internal enhancements**: Improved stability and performance for large projects. 
- **Studio - Fusion logging improvements**: On Fusion, node start and end times will now properly be displayed in command output. 
- **IDE UI – AI entry points & run controls**: Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps with clear UI labels. 
- **Studio – Editing UX**: Studio's tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking.

### Fixes
- **IDE server – VCS errors**: Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier, making automation failures actionable. 
## December 3, 2025

### New
- dbt platform
  - Command pane: Autofix deprecation warnings
    - When deprecations are detected, you now see “Autofix deprecation warnings”
   – Autofix Packages detailed results
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
