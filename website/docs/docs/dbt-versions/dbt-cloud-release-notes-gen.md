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

- **AI codegen API**: Streaming middleware enforces request-scoped instrumentation across every AI endpoint, offload warehouse calls via threads, and expose human-readable tool names while gating keyword search behind feature flag for approved tenants.
  
- **dbt platform**
  - **Operations clarity**: Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped so troubleshooting is faster.
  - **Collaboration & notifications**: Slack Copilot mentions are now more reliable, with hardened workers, support for CSV attachments, and improved logging. Webhook channels now accept longer URLs, handle “warning-only” subscriptions correctly, and automatically clean up corrupted job IDs.
  - **Profile & credential management**: Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync.

- **dbt CLI server**: Improved stability and performance for large projects.
- **Studio IDE**: For dbt Fusion logging, node start and end times will now properly be displayed in command output. 
- **Studio IDE**: Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps with clear UI labels. 
- **Studio IDE**: Tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking.

### Fixes

- **Studio IDE server**: Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier, making automation failures actionable.

## December 3, 2025

### New

- **dbt platform**
  - **Autofix deprecation warnings**: When deprecations are detected, you now see "Autofix deprecation warnings."
  - **Autofix Packages detailed results**: After running Autofix, you see a results panel with upgraded packages (with links), packages left unchanged and why, and quick access to `packages.yml` to help assess Fusion readiness and next steps.

### Enhancements

- **dbt platform**
  - **Code Quality tab improvements**
    - Clearer lint/format actions (SQLFluff, Prettier), better empty states, visible Config button when applicable, and simplified logs retrieval.
    - Applies to SQL, JSON, YAML, and Markdown workflows.  
  - **Editor experience**
    - Upgraded editor for stability.
    - Improved container sizing/overflow.
    - "Save" overlay only appears when tabs are open.
    - Minor action‑bar refinements.

### Fixes

- **dbt platform lineage and command pane stability**: Reliability improved by aligning with updated IDE and VS Code command APIs; eliminates intermittent skips.

### Behavior changes

- **dbt platform:** dbt Core “versionless” renamed to “latest” so it's consistent and clear across tenants.
