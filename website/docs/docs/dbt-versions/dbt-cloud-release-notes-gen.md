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


## December 17, 2025

### New

- **dbt platform**
  - **Cost Insights surfaces & controls**: Project Home now shows a Cost Insights card with cost/run/model-build tabs, CSV/table exports, and deployment-period filters, while workspace admins can toggle the capability and wire it into platform metadata credentials directly inside settings, so single-tenant teams can track Fusion savings without leaving the UI. <!-- https://github.com/dbt-labs/cloud-ui/compare/2717141a98fa3d56a1d08192798d43074d4f6ea3...6784e4a5969c83a5e129f78d710811125f364b8e -->

- **dbt Cloud app**
  - **Feature licensing service**: A new `/accounts/<id>/feature-licenses` endpoint issues short-lived JWTs that encode entitled features, and service/PAT authentication now checks that a caller holds an active license on the target account before any Fusion-enabled workflow runs. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-dbt-cloud-app-20248398200 -->
  - **Cost Insights metadata inventory**: Platform metadata credentials now carry a `cost_insights_enabled` flag and a gRPC endpoint lists the cross-account environments tied to those connections, giving managed tenants a programmatic inventory of where warehouse spend telemetry will originate. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-dbt-cloud-app-20248398200 -->
  - **Databricks platform metadata credentials**: Databricks warehouses can register platform metadata credentials (token plus optional catalog), enabling catalog ingestion, metadata sharing, and Cost Insights pipelines without custom adapters. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-dbt-cloud-app-20248398200 -->

- **dbt Cloud CLI**
  - **Invocation-specific retention overrides**: Both the HTTP API and Python client accept a `ttl_seconds` parameter when launching runs, so artifacts and events from short-lived single-tenant jobs can be purged as soon as the override expires instead of waiting on the global retention window. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-dbt-cloud-cli-server-20248398200 -->

- **dbt orc**
  - **Mantle query telemetry parity**: Mantle runs can now emit `.resource_queries.json` artifacts by parsing `run_model_query_data.json`, and the dispatcher automatically enables `DBT_ENGINE_WRITE_SQL_QUERY_DATA` when the relevant feature flags are set, putting Mantle on equal footing with Fusion for Cost Insights and SQL-level observability. <!-- https://github.com/dbt-labs/dbt-orc/compare/f950dc9cd1507d7c0ac22e4676f887255fc5b940...dc05d7e6bbfedc100e3afbf6aa66c356e56674ec -->

- **MetricFlow server**
  - **Manifest awareness**: The GraphQL `environmentInfo` field now reports `hasMetricsDefined`, letting admin tools hide Semantic Layer actions until a manifest actually contains metrics. <!-- https://github.com/dbt-labs/metricflow-server/compare/4ba6d0f...5d5febc -->

### Enhancements

- **dbt platform**
  - **Profile connection overrides**: Fusion profile pages show read-only connection values and allow warehouse/role/database overrides per environment, consolidating tuning for multi-profile tenants. <!-- https://github.com/dbt-labs/cloud-ui/compare/2717141a98fa3d56a1d08192798d43074d4f6ea3...6784e4a5969c83a5e129f78d710811125f364b8e -->
  - **Large list pagination**: Credential pickers and workspace project cards paginate after 25 rows (with search boxes and skeleton states), keeping navigation responsive for very large single-tenant deployments. <!-- https://github.com/dbt-labs/cloud-ui/compare/2717141a98fa3d56a1d08192798d43074d4f6ea3...6784e4a5969c83a5e129f78d710811125f364b8e -->

- **Metadata Explorer**
  - **Model context & lineage polish**: Model panels now show materialization type, lineage renders metadata strips only when content exists, and upstream public-model columns load automatically for better cross-project visibility. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-metadata-ui-20248398200 -->
  - **Freshness clarity & Studio navigation**: Source tiles respect the `meta5161ExpiredUnconfiguredSources` flag (showing warn/error thresholds) and "Open in IDE" links now point at `/studio/{accountId}/projects/{projectId}` to drop users directly into dbt Studio. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-metadata-ui-20248398200 -->

- **Insights UI**
  - **Bookmark workflow upgrades**: Bookmarked queries reopen with their full builder context (metrics, filters, order-bys, limits), the Save button only activates on real changes, and deep links keep the `bookmarkId` query string in sync while switching tabs. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-insights-ui-20248398200 -->
  - **Copilot guardrails**: The Copilot listener now hydrates builder tabs only when a semantic-layer payload arrives, preventing plain-SQL replies from overwriting editor state. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-insights-ui-20248398200 -->

- **dbt Cloud CLI**
  - **Monorepo-friendly file sync** (& IDE): Invocation file sync roots itself in the invocation directory, reruns dependency installs for nested `dependencies.yml`, and the IDE's LSP/file sync honors dbt subdirectories while keeping exclusion lists accurate. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-dbt-cloud-cli-server-20248398200 --> <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-ide-server-20248398200 -->

- **MetricFlow server**
  - **Resilient job lifecycle**: Export polling now returns in-progress statuses, HTTP clients share retry/read-timeout logic, jobs are watched and cancelled after 45 minutes with clear error messaging, and Arrow→pandas conversions sanitize timestamp/date columns before raising a dedicated error. <!-- https://github.com/dbt-labs/metricflow-server/compare/4ba6d0f...5d5febc -->

- **dbt orc**
  - **Artifact handling upgrades**: Conformance and partial-parse artifacts upload as binary-safe payloads, emit per-upload size metrics, and Mantle resource-query parsing is centralized for reuse across dispatcher components. <!-- https://github.com/dbt-labs/dbt-orc/compare/f950dc9cd1507d7c0ac22e4676f887255fc5b940...dc05d7e6bbfedc100e3afbf6aa66c356e56674ec -->

- **Notifications system**
  - **Webhook auditability**: Outbound calls now persist the exact JSON body in webhook history, making allowlisting and troubleshooting easier. <!-- https://github.com/dbt-labs/notifications-system/compare/6aa8df34c76637ac4df4f2753e8d210be478ee50...1a11cb0f15e55d8243e9f5a2eb0ccf85c870f4ed -->

- **Studio**
  - **dbt-themed editor & Monaco 11**: A new feature flag enables dbt-branded VS Code theming inside the embedded workbench, and Monaco 11 brings upstream editor fixes plus better syntax coloring. <!-- https://github.com/dbt-labs/studio/compare/11ed3b092efe17a745062af5a100a25077182f08...b96257ab99208174d6bb8bd17d25ba0c88bd20c2 -->
  - **Git sidebar + file refresh parity**: The file tree now mirrors Cloud VCS statuses (including conflicts) and automatically invalidates caches after `dbt deps`/`dbt clean`, so new or removed files appear without a reload. <!-- https://github.com/dbt-labs/studio/compare/11ed3b092efe17a745062af5a100a25077182f08...b96257ab99208174d6bb8bd17d25ba0c88bd20c2 -->
  - **Log viewers & autofix UX**: Command and interactive query logs adopt the new accordion-based viewer, and Autofix sessions in Fusion treat plain `parse` commands as the trigger for deprecation summaries, keeping remediation flows consistent. <!-- https://github.com/dbt-labs/studio/compare/11ed3b092efe17a745062af5a100a25077182f08...b96257ab99208174d6bb8bd17d25ba0c88bd20c2 -->

### Fixes

- **dbt platform**
  - **Environment variable editor stability**: Editing one variable no longer backfills blank cells with previously edited values, preventing accidental overrides. <!-- https://github.com/dbt-labs/cloud-ui/compare/2717141a98fa3d56a1d08192798d43074d4f6ea3...6784e4a5969c83a5e129f78d710811125f364b8e -->
  - **Cost optimization indicator accuracy**: Job pages once again display “Cost optimization features” whenever Fusion actually ran (and gating conditions are met), so customers see the right coverage status regardless of feature-flag permutations. <!-- https://github.com/dbt-labs/cloud-ui/compare/2717141a98fa3d56a1d08192798d43074d4f6ea3...6784e4a5969c83a5e129f78d710811125f364b8e -->

- **Insights UI**
  - **Deterministic query completion**: Tabs mark executions as finished and surface builder-compiled SQL even when the backend returns zero rows, stopping spinners from hanging on filtered-empty datasets. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-insights-ui-20248398200 -->

- **Semantic Layer Gateway**
  - **Postgres type handling**: Flight SQL exports now treat `uuid`, `json`, `jsonb`, and interval-like types as UTF‑8 fields, eliminating ingestion failures or nulls when those column types are requested. <!-- https://github.com/dbt-labs/semantic-layer-gateway/commit/fdfd0799b965bdf3c343081efd5121d8ca9c7003 -->

- **MetricFlow server**
  - **PyArrow conversion guardrails**: Prevent CSV/JSON exports from crashing when encountering exotic column types. <!-- https://github.com/dbt-labs/metricflow-server/compare/4ba6d0f...5d5febc -->

### Behavior changes

- **dbt Cloud app**
  - **Stronger tenant identity enforcement**: Service/PAT calls without an active license now fail authentication, Slack Copilot sessions build a scoped identity JWT for the invoking user, and SSO providers enforce auto-generated slugs (draft configs can’t be targeted), reducing misconfiguration risk. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-dbt-cloud-app-20248398200 -->

- **dbt Cloud CLI**
  - **User-isolated invocation history**: Every invocation lookup validates the caller’s user ID, preventing admins from accidentally reading another developer’s runs when multiple accounts share a CLI server. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-dbt-cloud-cli-server-20248398200 -->

- **IDE server**
  - **Support-impersonation guardrails & short-lived show artifacts**: Operators who “hijack” a customer session can no longer run show/run/build/test commands, and `dbt show` artifacts expire after 15 minutes to protect sensitive data. <!-- https://github.com/dbt-labs/helm-releases/tree/main/combined-diffs/diff-ide-server-20248398200 -->

- **Notifications**
  - **Event taxonomy update**: Webhook payloads emit canonical `job.run.started|errored|canceled|completed` event types instead of the legacy `on_*` strings; update downstream filters accordingly. <!-- https://github.com/dbt-labs/notifications-system/compare/6aa8df34c76637ac4df4f2753e8d210be478ee50...1a11cb0f15e55d8243e9f5a2eb0ccf85c870f4ed -->

- **MetricFlow server**
  - **Stricter query validation & timeouts**: Unsupported `metric_time` grains now fail fast instead of silently downgrading, and long-running tasks are cancelled after 45 minutes with explicit timeout messaging, preventing hung jobs. <!-- https://github.com/dbt-labs/metricflow-server/compare/4ba6d0f...5d5febc -->

- **dbt orc**
  - **Fusion compare support & new dependency**: Fusion tracks now treat `dbt compare` as a supported command (no more target-path hacks). <!-- https://github.com/dbt-labs/dbt-orc/compare/f950dc9cd1507d7c0ac22e4676f887255fc5b940...dc05d7e6bbfedc100e3afbf6aa66c356e56674ec -->

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
