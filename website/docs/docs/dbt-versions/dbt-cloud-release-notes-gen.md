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


## January 14, 2026

## New

### dbt platform and Studio

- **Salesforce Data 360 connection support (dbt Fusion required)**: Salesforce can now be selected as a connection type, with compatibility checks to ensure the required dbt Fusion + adapter support is present. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=cc-3048` `https://github.com/dbt-labs/cloud-ui/pulls?q=salesforce_v0` `https://github.com/dbt-labs/studio/compare/47ce4ccdd4dd2c4841335b796d368390a79bdc5e...20c68a3ebce6d171e5240509934446b7d14c09c3` -->

### APIs

- **Fusion migration readiness endpoint**: Added an API endpoint to determine whether a project is eligible for Fusion migration. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+is%3Amerged+FusionStatusView+is_fusion_eligible` -->

## Enhancements

### Copilot and AI assistance

- **More resilient agent runs when tools fail**: Copilot/agent tool execution errors are now returned as structured tool-error responses instead of failing the entire run. <!-- PRs: `https://github.com/dbt-labs/ai-codegen-api/compare/fa7756165da9d3039ca4013b12e7fb264fe565ba...b48536eb201734c6753040ea63beacd4bc41720a` -->

- **Better project context retrieval for agent workflows**: Production agent toolsets now include additional retrieval/search tooling to improve relevance of agent responses. <!-- PRs: `https://github.com/dbt-labs/ai-codegen-api/compare/fa7756165da9d3039ca4013b12e7fb264fe565ba...b48536eb201734c6753040ea63beacd4bc41720a` -->

- **Improved Azure OpenAI connection verification for GPT‑5 deployments**: Azure OpenAI connection verification now uses GPT‑5-compatible completion parameters for GPT‑5 deployments, reducing false verification failures. <!-- PRs: `https://github.com/dbt-labs/ai-codegen-api/compare/fa7756165da9d3039ca4013b12e7fb264fe565ba...b48536eb201734c6753040ea63beacd4bc41720a` -->

- **More robust OpenAI request parameter handling**: Completion calls now avoid parameter conflicts when providing defaults while still allowing overrides, improving compatibility with custom LLM parameter tuning. <!-- PRs: `https://github.com/dbt-labs/ai-codegen-api/compare/fa7756165da9d3039ca4013b12e7fb264fe565ba...b48536eb201734c6753040ea63beacd4bc41720a` -->

- **Simplified Azure OpenAI setup in dbt platform**: Azure OpenAI configuration now supports pasting a “Target URI” and automatically parsing endpoint details, reducing setup friction. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=parseAzureTargetUri` `https://github.com/dbt-labs/cloud-ui/pulls?q=azure_target_uri_input` -->

### Insights experience

- **Query Builder is no longer labeled “Beta”**: The Query Builder UI is no longer marked as beta across entry points and saved-query tabs. <!-- PRs: `https://github.com/dbt-labs/insights-ui/compare/e7693d6136f4995444c34255891f3286249f7564...1f5f9f8dc959cee59f2078f5f064953869eaa8ac` -->

- **Copilot (if enabled): improved chat handoff, streaming, and navigation**: Copilot chat handoffs are more reliable, streaming message updates are more robust, auto-scroll behavior is improved, and Copilot deep links/routes are more consistent. <!-- PRs: `https://github.com/dbt-labs/insights-ui/compare/e7693d6136f4995444c34255891f3286249f7564...1f5f9f8dc959cee59f2078f5f064953869eaa8ac` -->

### Search and catalog

- **Improved search relevance and highlighting**: Search scoring now prioritizes exact and “most terms match” results more strongly, and highlight selection is more deterministic. Clients may now see column-description matches surfaced distinctly. <!-- PRs: `https://github.com/dbt-labs/codex-api/compare/d24b0f0e9b9c8f2f1505a057731dfb171177ebf3...05c1a0924a74c2684baacf4796cb1d4eee126d8a` `https://github.com/dbt-labs/metadata-ui/compare/692970d29da27b9fe80ad8fec42d00b06ac66b31...4b4c66fbc2e42254de9a183080098dd6c81f8bfd` -->

- **Saved Queries are more broadly available in Explorer**: Saved Queries and related Explorer navigation/filtering are no longer hidden behind internal-only flags where supported by your account/features. <!-- PRs: `https://github.com/dbt-labs/metadata-ui/compare/692970d29da27b9fe80ad8fec42d00b06ac66b31...4b4c66fbc2e42254de9a183080098dd6c81f8bfd` -->

- **Explorer search and lineage UX improvements**: Search field labels and match wording are more consistent (including column-description matches), and the embedded/non-fullscreen lineage view uses a lighter query path for improved load responsiveness. <!-- PRs: `https://github.com/dbt-labs/metadata-ui/compare/692970d29da27b9fe80ad8fec42d00b06ac66b31...4b4c66fbc2e42254de9a183080098dd6c81f8bfd` -->

### IDE / editing workflows

- **Studio uses a single IDE experience**: Studio now loads a unified IDE package rather than switching between separate “legacy” and “next” IDE modes. <!-- PRs: `https://github.com/dbt-labs/studio/compare/47ce4ccdd4dd2c4841335b796d368390a79bdc5e...20c68a3ebce6d171e5240509934446b7d14c09c3` -->

- **Defer-to-production honors `defer-env-id` override (supported dbt versions)**: If your project sets `dbt-cloud.defer-env-id`, Studio will now use it without requiring a feature flag (when the Cloud CLI runtime is supported). <!-- PRs: `https://github.com/dbt-labs/studio/compare/47ce4ccdd4dd2c4841335b796d368390a79bdc5e...20c68a3ebce6d171e5240509934446b7d14c09c3` -->

- **Improved log exporting in Studio**: Download/copy behavior for command logs is now applied more consistently (including debug logs), making it easier to export logs for troubleshooting. <!-- PRs: `https://github.com/dbt-labs/studio/compare/47ce4ccdd4dd2c4841335b796d368390a79bdc5e...20c68a3ebce6d171e5240509934446b7d14c09c3` -->

- **More powerful multi-edit support in the IDE**: The IDE `files/replace` API now supports applying multiple explicit edits in one request (including multiline edits) with safer validation and file handling. <!-- PRs: `https://github.com/dbt-labs/ide-server/compare/4608a18aaa83ac11bcab67efd282fc79a04bfced...acd70d6529f606d7b6c7aa115441b7c85f6267c5` -->

- **More actionable errors when starting Cloud CLI sessions**: Cloud CLI session creation now returns clearer HTTP errors and guidance for common setup/permission/config issues (including IDE/LSP flows). <!-- PRs: `https://github.com/dbt-labs/dbt-cloud-cli/compare/2eb7278c23acdf7e168ecc232ad64e1736abce22...1181ac1885b00fca2380c4f56050e2817b9eba34` -->

- **Invocation metadata includes a globally unique account identifier**: Invocation/session metadata now includes an `account_identifier` (e.g., `act_…`) in addition to numeric `account_id` to improve auditing and supportability. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud-cli/compare/2eb7278c23acdf7e168ecc232ad64e1736abce22...1181ac1885b00fca2380c4f56050e2817b9eba34` -->

### dbt platform administration

- **Settings detail pages moved to a resizable drawer**: Settings detail experiences (users, webhooks, tokens, IP restrictions, audit log details, etc.) now use a Drawer-based UI with improved interaction behavior. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=SettingsSideDrawer` `https://github.com/dbt-labs/cloud-ui/pulls?q=SettingsDrawerContent` -->

- **Profile creation is more resilient**: Profile creation now explicitly creates dependencies and performs best-effort cleanup on failures to reduce partial/orphaned objects. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=useCreateProfileWithDependencies` -->

## Fixes

### Core application / API

- **Profiles API supports clearing extended attributes**: The Profiles update API now allows unsetting extended attributes by setting `extended_attributes_id` to `null`. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+is%3Amerged+extended_attributes_id+Set+to+null+to+unset` -->

- **Recently Viewed updates are more reliable (and keeps 5 items)**: Recently Viewed entries now update atomically to reduce duplicates, and the list retains the 5 most recent items. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+is%3Amerged+RecentlyViewedDjangoModel+update_or_create` -->

- **Run log tailing is more reliable on non-AWS object storage**: Debug logs for completed runs now consistently fetch only the tail of the log when requested. <!-- Reviewed by Bianca PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+is%3Amerged+ObjectStorageReader+LAST_CHUNK_BYTE_SIZE` -->

- **Stricter account scoping for run-step execution**: Starting a run step now validates that the run belongs to the provided `account_id`, preventing cross-account access. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+is%3Amerged+StartRunStep+not+found+for+account` -->

- **Reduced intermittent feature-flag lookup errors under concurrency**: LaunchDarkly context lookups are now protected with cache locking to reduce race-condition failures under load. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+is%3Amerged+TTLCache+lock+KeyError+race` -->

### IDE / editing workflows

- **More reliable `show` and `compile` executions**: CLI flags intended to disable cache/JSON/partial parsing are now appended in a CLI-safe position to avoid dbt CLI parsing issues during `show`/`compile`. <!-- PRs: `https://github.com/dbt-labs/ide-server/compare/4608a18aaa83ac11bcab67efd282fc79a04bfced...acd70d6529f606d7b6c7aa115441b7c85f6267c5` -->

### Model/metadata services

- **Model Execution History is now safely tenant-scoped**: Execution history lookups now validate `(account, project, environment)` ownership and return “not found” for mismatches; results are also filtered by `account_id` to prevent cross-tenant leakage. <!-- PRs: `https://github.com/dbt-labs/cloud-artifacts-internal-api/compare/846f78282973348f3e9bb1c75a8a0e547512c37e...c78b57e73288f12319535f65438b7adf7458c220` -->

- **Exposure “latest run” reporting is more reliable**: Exposure latest-run tracking now consistently populates `account_id` (including a backfill for existing rows) to improve per-account scoping and correctness. <!-- PRs: `https://github.com/dbt-labs/codex/pull/2181` `https://github.com/dbt-labs/codex/pull/2191` -->


### Visual editor

- **Preview and Source upload/seed are more reliable with `--no-defer`**: Fixed argument ordering so `--no-defer` is interpreted consistently, reducing preview/seed failures caused by CLI flag parsing. <!-- PRs: `https://github.com/dbt-labs/visual-editor/compare/c854a51a529265fd7c1da7be7734d922cec039be...af6fe9d7c16cb9c71217b1f9575d6920d1fda80a` -->

### Logging

- **Enhanced logging limits for in-progress runs**: Logs for in-progress runs are also limited by memory usage, in addition to the existing 1,000-line limit. <!-- Reviewed by Bianca PRs: `https://github.com/dbt-labs/dbt-orc/pulls?q=SCRIBE_REDIS_BYTE_SIZE_LIMIT` -->

## Behavior Changes

### Authentication / authorization

- **Catalog requests require identity context**: Catalog authorization now requires identity-header validation; requests missing required identity context may now be rejected where they previously succeeded. <!-- PRs: `https://github.com/dbt-labs/codex-api/compare/d24b0f0e9b9c8f2f1505a057731dfb171177ebf3...05c1a0924a74c2684baacf4796cb1d4eee126d8a` -->

- **Reduced risk of intermittent permission issues near token expiry**: Cached authorization decisions now use a shorter TTL to reduce edge cases where cached decisions outlive practical token validity under latency. <!-- PRs: `https://github.com/dbt-labs/codex-api/compare/d24b0f0e9b9c8f2f1505a057731dfb171177ebf3...05c1a0924a74c2684baacf4796cb1d4eee126d8a` -->

### APIs and client generation

- **Stricter request validation metadata in gRPC protos**: Some gRPC request fields are now annotated as required; if you generate client stubs from these protos, ensure your build/runtime includes the appropriate `buf.validate` dependencies for your language. <!-- PRs: `https://github.com/dbt-labs/cloud-artifacts-internal-api/compare/846f78282973348f3e9bb1c75a8a0e547512c37e...c78b57e73288f12319535f65438b7adf7458c220` -->

### Operations

- **Upgrade note: additional database constraints/migrations**: This release includes additional account-isolation/support-constraint migrations that may increase upgrade runtime depending on database size. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+is%3Amerged+account_isolation_batch_6+support_constraints_batch_10` -->

- **Upgrade note: tighter project/environment scoping for Model Execution History**: Model Execution History now enforces stricter `(account, project, environment)` validation; ensure any required migrations/backfills are applied so existing environments are properly scoped after upgrade. <!-- PRs: `https://github.com/dbt-labs/cloud-artifacts-internal-api/compare/846f78282973348f3e9bb1c75a8a0e547512c37e...c78b57e73288f12319535f65438b7adf7458c220` -->

- **Feature flag updates can propagate faster (LaunchDarkly streaming)**: Some services no longer force LaunchDarkly streaming off, allowing near real-time flag updates; ensure your environment allows outbound connectivity for long-lived LaunchDarkly streaming connections if you use restrictive egress rules. <!-- PRs: `https://github.com/dbt-labs/scheduler/compare/b6cf66a557d4fafdc5ddf8965243c82e5dcee5ea...5fb1846cf6ce3f0c5783c3cc3b3f47192f3174a3` -->

### UI messaging

- **Updated dbt v1.7 end-of-life labeling**: dbt v1.7 is now labeled as end-of-life in version lifecycle messaging. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=End-of-life+as+of+Nov+2%2C+2024` `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+is%3Amerged+1.7+End-of-life+Nov` -->

(Also written to `release-notes/final-release-notes-2026-01-14.md`.)


## January 7, 2026

No changes of note this week.

## December 24, 2025

### New

- **AI Codegen**
  - **File-aware LangGraph agents**: Analysts can now drop `@path` references in the bundled CLI to stream local files into `/private/v1/agents/run`, which are auto-rendered as text inside the run so copilots have the exact config or SQL snippet you referenced.  


- **dbt platform**
  - **Slack Copilot feedback loops**: Copilot replies now carry inline "Did that answer your question?" buttons, so you can rate answers without leaving Slack.  

- **Codex workflows**
  - **Databricks cost tracking for Model Cost Over Time**: A Databricks history provider and DBU-based cost query now surface daily model cost alongside Snowflake coverage, so Databricks tenants get unified FinOps reporting.  

- **Canvas**
  - **CSV upload GA**: The CSV upload endpoint is now generally available.

### Enhancements

- **Cloud artifacts**
  - **Better similar-model suggestions**: Attachment workflows now only recommend meaningfully related models.  

- **dbt platform**
  - **Unified SSO & SCIM admin**: Settings consolidate SSO + SCIM, add an empty state for auto-generated slugs, and render read-only login URLs so admins can start configuration without touching slug fields.  
  - **SCIM token management polish**: Token tables gain fixed pagination, inline search, consistent iconography, and clearer deletion warnings to avoid accidental cuts to live integrations.  
  - **Twice the per-environment custom variables**: The v3 API/UI now allow up to 20 scoped environment variables before enforcing limits, giving larger projects more room for secrets.  

- **Canvas**
  - **Dialect-aware projection SQL**: SELECT * RENAME/EXCEPT support now respects each warehouse's syntax using schema metadata, so SQL previews and column metadata stay accurate across Snowflake, Databricks, BigQuery, and Redshift.  

### Fixes

- **dbt platform**
  - **Webhook editor keeps job selections**: Default values are cached after the first render and stop resetting once the user edits the form, eliminating accidental job-list clearing while tabbing through fields.  

- **Codex GraphQL**
  - **Exposure parents mirror the manifest**: `parentsModels` and `parentsSources` now derive from the manifest's `parents` list, so exposures with mixed upstreams display complete lineage in both the GraphQL API and UI.  


### Behavior changes

- **dbt platform**
  - **Legacy Cost Management UI retired**: All cost management pages and hooks were removed, and platform metadata credentials now only expose catalog ingestion and Cost Insights toggles, eliminating dead-end controls.  


## December 17, 2025

### New

- **dbt platform**
  - **Feature licensing service**: A new `/accounts/<id>/feature-licenses` endpoint issues short-lived JWTs that encode entitled features, and service/PAT authentication now checks that a caller holds an active license on the target account before any Fusion-enabled workflow runs. 
  - **Databricks platform metadata credentials**: Databricks warehouses can register platform metadata credentials (token plus optional catalog), enabling catalog ingestion, metadata sharing, and Cost Insights pipelines without custom adapters. 

### Enhancements

- **dbt platform**
  - **Large list pagination**: Settings's Projects and Credentials now paginate after 25 rows (with search boxes and skeleton states), keeping navigation responsive for large deployments.
- **Metadata Explorer**
  - **Model context & lineage polish**: Model panels now show materialization type, lineage renders metadata strips only when content exists, and upstream public-model columns load automatically for better cross-project visibility.
  - **Freshness clarity & Studio navigation**: Source tiles respect the `meta5161ExpiredUnconfiguredSources` flag (showing warn/error thresholds) and "Open in IDE" links now point at `/studio/{accountId}/projects/{projectId}` to drop users directly into dbt Studio.

- **Insights UI**
  - **Copilot guardrails**: The Copilot listener now hydrates builder tabs only when a semantic-layer payload arrives, preventing plain-SQL replies from overwriting editor state. 
- **dbt CLI**
  - **Improved monorepo support for file sync and the IDE**:
    - File sync now anchors itself to the invocation directory, making monorepo structures behave more predictably.
    - Nested `dependencies.yml` files correctly trigger dependency installs.
    - The IDE’s LSP and file sync now recognize dbt subdirectories properly.
    - Exclusion lists remain accurate even in multi-project repositories.
- **Notifications system**
  - **Webhook auditability**: Outbound calls now persist the exact JSON body in webhook history, making allowlisting and troubleshooting easier. 

- **Studio**
  - **Git sidebar & file refresh parity**: The file tree now mirrors Cloud VCS statuses (including conflicts) and automatically invalidates caches after `dbt deps`/`dbt clean`, so new or removed files appear without a reload.
  - **Log viewers & Autofix UX**: Command and interactive query logs adopt the new accordion-based viewer, and Autofix sessions in Fusion treat plain `parse` commands as the trigger for deprecation summaries, keeping remediation flows consistent.

### Fixes

- **dbt platform**
  - **Environment variable editor stability**: Editing one variable no longer backfills blank cells with previously edited values, preventing accidental overrides. 
  - **Cost optimization indicator accuracy**: Job pages once again display “Cost optimization features” whenever Fusion actually runs (and gating conditions are met), so users see the right coverage status regardless of feature-flag permutations. 

### Behavior changes

- **dbt platform**
  - **Stronger tenant identity enforcement**: Service/PAT calls without an active license now fail authentication, Slack Copilot sessions build a scoped identity JWT for the invoking user, and SSO providers enforce auto-generated slugs (draft configs can’t be targeted), reducing misconfiguration risk. 

- **dbt CLI**
  - **User-isolated invocation history**: Every invocation lookup validates the caller’s user ID, preventing admins from accidentally reading another developer’s runs when multiple accounts share a CLI server. 
- **IDE server**
  - **Enhanced security for support-assisted sessions:** Support impersonation sessions now restrict the execution of `show`, `run`, `build`, and `test` commands. Artifacts generated by `dbt show` are also short-lived and will automatically expire after 15 minutes to limit unintended data retention.

- **dbt Orchestration**
  - **Fusion compare support & new dependency**: Fusion tracks now treat `dbt compare` as a supported command (no more target-path hacks). 

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
