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

## New
- **dbt platform – Private endpoints inventory**: Workspace settings now surface a gated “Private endpoints” page (feature flag + permission based) where single-tenant operators can search, sort, and paginate every PrivateLink endpoint without opening a support ticket. <!-- https://github.com/dbt-labs/cloud-ui/compare/bd5b51b3325707f35aa16a2b1db44371ac26d9fb...2717141a98fa3d56a1d08192798d43074d4f6ea3 -->
- **MetricFlow server – Raw SQL deferral controls**: GraphQL and CLI paths now accept `defer_to_environment` (production, staging, or none) so tenants can validate Semantic Layer SQL against the right state before execution. <!-- https://github.com/dbt-labs/metricflow-server/commit/4ba6d0fff0045ddf432e4b5f1f7e9a77a8e521b0 -->
- **dbt cloud app – Cost Insights pilot**: New `cost_insights` feature gates, credentials, and gRPC surface area let selected tenants opt into Cost Insights via API without exposing the experience broadly. <!-- https://github.com/dbt-labs/dbt-cloud/compare/de23dc27acd4f236b182d115daae2c852b80a29b...1c771b16ebbb932158400a5e81ccf9cd04979e7 -->
- **ORC Fusion observability**: Feature flags now enable per-step resource query artifacts (`.resource_queries.json`) and optional pre-conformance project/target/log uploads so support can debug OOMs and Fusion behavior with full context. <!-- https://github.com/dbt-labs/dbt-orc/compare/ef353c390e8f179a96dc18b2e6420b22928e7217...f950dc9cd1507d7c0ac22e4676f887255fc5b940 -->

## Enhancements
- **AI codegen API**: Streaming middleware enforces request-scoped instrumentation across every AI endpoint, MCP SQL/Text-to-SQL tools now derive tenant tokens from `dbt-jwt-auth`, offload warehouse calls via threads, and expose human-readable tool names while gating keyword search behind LaunchDarkly for approved tenants. <!-- ✅ reviewed by mirna https://github.com/dbt-labs/ai-codegen-api/compare/3a63caa3608227c4f4f790767f2da6b0e161b3ce...53dd582d636b4ac6ed3830f0fa0277624e1279d8 -->
- **dbt platform – Operations clarity**: Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped so troubleshooting is faster. <!-- https://github.com/dbt-labs/cloud-ui/compare/bd5b51b3325707f35aa16a2b1db44371ac26d9fb...2717141a98fa3d56a1d08192798d43074d4f6ea3 -->
- **dbt platform – Sign-in resilience**: Regional account switching reuses PKCE params stored with a 10‑minute TTL, reducing OAuth retries for VS Code and cross-region redirects. <!-- https://github.com/dbt-labs/cloud-ui/compare/bd5b51b3325707f35aa16a2b1db44371ac26d9fb...2717141a98fa3d56a1d08192798d43074d4f6ea3 -->
- **dbt cloud app – Collaboration & notifications**: Slack Copilot mentions now run through hardened workers with CSV attachments and structured logging, while webhook channels accept very long URLs, gracefully handle warning-only subscriptions, and scrub corrupted job IDs. <!-- https://github.com/dbt-labs/dbt-cloud/compare/de23dc27acd4f236b182d115daae2c852b80a29b...1c771b16ebbb932158400a5e81ccf9cd04979e7 -->
- **dbt cloud app – Profile & credential management**: Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync. <!-- https://github.com/dbt-labs/dbt-cloud/compare/de23dc27acd4f236b182d115daae2c852b80a29b...1c771b16ebbb932158400a5e81ccf9cd04979e7 -->
- **dbt cloud CLI server – Internal enhancements**: Improved stability and performance for large projects. <!-- ✅ Reviewed by jp-dbt Tues Dec 9  https://github.com/dbt-labs/dbt-cloud-cli-server/commit/871e280694087e21ea3d5a7ca84d6805e6799450 -->
- **Studio - Fusion logging improvements*: On Fusion, node start and end times will now properly be displayed in command output. <!--  ✅  Reviewed by jp-dbt Tues Dec 9 https://github.com/dbt-labs/ide-server/commit/239863005992ff39687cc337e2f113ba9c0bb512 -->
- **IDE UI – AI entry points & run controls**: Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps with clear UI labels. <!-- https://github.com/dbt-labs/ide-ui/compare/0b9028083dd7ca9da858878755735a747782fa94...856b80ea1a37649ea257ca9d3352e44353f9fe88 -->
- **MetricFlow server – Dimension metadata & compatibility**: Dimensions/group-bys are keyed by dunder-qualified names, grain inference consults semantic models, legacy “measure” metadata is reconstructed for older clients, and dbt-semantic-interfaces 0.10 manifests are accepted. <!-- https://github.com/dbt-labs/metricflow-server/commit/4ba6d0fff0045ddf432e4b5f1f7e9a77a8e521b0 -->
- **MetricFlow server – Export performance & reliability**: The new cache engine finds exact or filterable matches, export jobs log cache options, streaming writes batches back to Redis via `run_coroutine_threadsafe`, SLG execution runs in dedicated threads, and the job manager tracks async tasks to keep cancellations responsive. <!-- https://github.com/dbt-labs/metricflow-server/commit/4ba6d0fff0045ddf432e4b5f1f7e9a77a8e521b0 -->
- **ORC Fusion – Automated recovery & telemetry**: Autofix runs automatically trigger `dbt deps`, recorder runs reuse the existing Fusion binary while capturing its version, Scribe honors early Redis deletion, and Semantic Layer HMAC tokens are URL-encoded to avoid bad-token errors. <!-- https://github.com/dbt-labs/dbt-orc/compare/ef353c390e8f179a96dc18b2e6420b22928e7217...f950dc9cd1507d7c0ac22e4676f887255fc5b940 -->
- **Scribe – Log lifecycle controls**: Redis log buffers can be purged immediately once uploads complete, and the uploader co-ordinates stop signals between S3 and Redis to prevent stray sentinel files. <!-- https://github.com/dbt-labs/scribe/compare/v0.0.71...v0.0.73 -->
- **semantic-layer gateway – Snowflake connectivity**: The service now pulls in the official Snowflake JDBC 3.27.1 driver, inheriting the latest MFA caching and security patches without shipping a custom jar. <!-- https://github.com/dbt-labs/semantic-layer-gateway/compare/6c5bf61aef9e5101c619ac3e848fcc7459cf6996...6e0e0d457a55f083b752126270e01d13569d24b3 -->
- **Studio – Editing UX**: Studio's tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking.<!--  ✅  Reviewed by jp-dbt Tues Dec 9 https://github.com/dbt-labs/studio/compare/7eb6e566274fe08bf1cf7dc30e8c0ca2dd6571e8...11ed3b092efe17a745062af5a100a25077182f08 -->

## Fixes
- **IDE server – VCS errors**: Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier, making automation failures actionable. <!--  ✅ reviewed by mirna ✅ Reviewed by jp-dbt Tues Dec 9 https://github.com/dbt-labs/ide-server/commit/239863005992ff39687cc337e2f113ba9c0bb512 -->

## Behavior Changes
- **ORC Fusion – Python model enforcement**: Build conformance now scans manifests for Python models, marks builds non-conformant with a clear log message, and enables beta Python models during recorder captures so tenants know exactly why FS can’t replay. <!-- https://github.com/dbt-labs/dbt-orc/compare/ef353c390e8f179a96dc18b2e6420b22928e7217...f950dc9cd1507d7c0ac22e4676f887255fc5b940 -->
- **Insights UI – Download lockdown**: Chart PNG/CSV download buttons disappear automatically when the `ninja-498-disable-download` flag is on, keeping data-egress restrictions intact for regulated tenants. <!-- https://github.com/dbt-labs/insights-ui/compare/2dc1826aa16f2c30168b541dc4fa435274911d27...af7811ca2deab05584a63e27419c63e0bfb16b97 -->
- **semantic-layer gateway – Export timeout**: MetricFlow export compilation now times out after 30 minutes (was 45), surfacing stuck exports faster without affecting standard queries. <!-- https://github.com/dbt-labs/semantic-layer-gateway/compare/6c5bf61aef9e5101c619ac3e848fcc7459cf6996...6e0e0d457a55f083b752126270e01d13569d24b3 -->

## Date

### New

### Enhancements

### Fixes

### Behavior changes

