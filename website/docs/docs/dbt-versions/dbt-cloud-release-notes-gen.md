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


## January 21, 2026

### New

- **dbt platform**
  - **Favorites are now available in Catalog**: Add resources to favorites and organize your frequently accessed resources in the Catalog navigation. <!-- PRs: `https://github.com/dbt-labs/metadata-ui/pulls?q=is%3Apr+favorites+generally+available+Explorer` -->

- **Connectivity / private networking**
  - **New v3 API endpoint to fetch a specific PrivateLink endpoint**: You can now retrieve individual PrivateLink endpoints by ID, enabling better automation and troubleshooting workflows. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+private-endpoints+PrivateLink+api%2Fv3` -->

- **Cost Insights**
  - **BigQuery Cost Insights support**: Cost Insights now supports BigQuery cost attribution, allowing you to track and analyze costs for BigQuery-backed projects. <!-- PRs: `https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+BigQuery+Cost+Insights+INFORMATION_SCHEMA.JOBS` -->

### Enhancements

- **dbt platform**
  - **Run artifacts are now searchable**: Find specific artifacts faster in run history with the new artifacts search box and improved empty states. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+Run+Details+Artifacts+search` -->
  - **Webhooks editor is more stable**: The webhook form no longer resets while job options are loading, and server-generated fields now display reliably after creation. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+webhook+form+reset+job+options` -->
  - **Fusion onboarding completion card can be dismissed**: After completing the Fusion onboarding checklist, you can now dismiss the card and it will stay dismissed. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+Fusion+checklist+completed+dismiss` -->
  - **Salesforce connection setup flow is clearer**: Connection setup now clearly separates connection details from credentials, with improved field validation and pre-filling. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+Salesforce+connection+credentials+client_id+private_key` -->
  - **Cost Insights charts have a clearer grouping control**: A dedicated grouping selector (daily, weekly, or monthly) is now available alongside the period selector in Cost Insights charts. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+Cost+Insights+grouping+selector` -->

- **Catalog & Search**

  - **Improved Catalog search relevance and performance**: Enhanced search scoring and matching provides more accurate results, with better column matching and highlighting for large catalogs. <!-- PRs: `https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+catalog.searchv2+function_score+dbt_columns_nested` -->
  - **Search results are refreshed when column metadata changes**: Column name and description updates now automatically trigger re-indexing, ensuring search results stay current. <!-- PRs: `https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+column+description+reindex+version+hash` -->
  - **Search typeahead includes "View all results"**: Quickly access full search results from the typeahead dropdown with the new footer link. <!-- PRs: `https://github.com/dbt-labs/metadata-ui/pulls?q=is%3Apr+typeahead+%22View+all+results%22` -->
  - **Cleaner environment dropdown behavior**: The environment selector now only shows "Staging" when your account has projects with a staging environment configured. <!-- PRs: `https://github.com/dbt-labs/metadata-ui/pulls?q=is%3Apr+environment+dropdown+show+Staging+only+when+exists` -->

- **Cost Insights**
  - **BigQuery v1 platform metadata credentials**: BigQuery v1 connections now support platform metadata credentials with both Service Account JSON and Workload Identity Federation (WIF) authentication methods. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+bigquery_v1+Workload+Identity+Federation+platform+metadata+credentials` -->
  - **Better Cost Insights setup diagnostics**: Connection test status and error details are now tracked to provide more actionable information when setup issues occur. <!-- PRs: `https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+Cost+Insights+connection+test+status` -->

- **Runs / orchestration**
  - **More accurate run reporting via warehouse time tracking**: Warehouse execution time is now captured and reported for `run`, `build`, and `snapshot` commands, improving usage and cost reporting accuracy. <!-- PRs: `https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+warehouse_time_seconds` -->
  - **Improved reliability when restoring from RepoCache**: Repository restores are now more reliable, reducing failures caused by stale or uncommitted changes. <!-- PRs: `https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+hard+reset+RepoCache+checkout` -->
  - **Run warehouse wait time is now captured**: Warehouse wait time is now stored to enable more accurate reporting and analysis of run performance. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+warehouse+wait+time+run_warehouse_time` -->

- **Studio IDE**
  - **Clearer error messages when fetching dev credentials and defer state**: IDE-related endpoints now return more specific and helpful error messages for common configuration issues and timeouts. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud-cli/pulls?q=is%3Apr+profiles+dev+credentials+defer+manifest+error` -->
  - **Improved reliability of idle worker cleanup**: Background cleanup processes are now more reliable, reducing disruptions to development sessions. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud-cli/pulls?q=is%3Apr+reaper+idle+worker+cleanup` -->
  - **Studio console and command log viewer improvements**: Enhanced command log viewer with improved download capabilities and more consistent error log viewing. <!-- PRs: `https://github.com/dbt-labs/studio/pulls?q=is%3Apr+command+log+viewer+download+error+logs` -->

### Fixes

- **AI-assisted workflows**
  - **Documentation generation more reliably adds missing column descriptions**: AI-assisted documentation now correctly detects column names across various `schema.yml` layouts, adds only missing descriptions, and preserves existing ones. <!-- PRs: `https://github.com/dbt-labs/ai-codegen-api/pulls?q=is%3Apr+schema.yml+column+description+missing` -->
  - **BYOK (OpenAI/Azure OpenAI) misconfiguration errors are handled more cleanly**: Improved error handling for common configuration issues, including clearer messages for Azure OpenAI "deployment not found" errors. <!-- PRs: `https://github.com/dbt-labs/ai-codegen-api/pulls?q=is%3Apr+Azure+OpenAI+%22deployment+not+found%22+BYOK` -->

- **Catalog & lineage**
  - **Fixes missing auto-generated exposures in model lineage**: Auto-generated exposures now appear correctly in lineage views. <!-- PRs: `https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+auto+exposure+normalize+unique+id` -->
  - **Catalog search no longer errors when a warehouse connection name is missing**: Search now handles missing connection names gracefully without causing errors. <!-- PRs: `https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+warehouseAsset.connectionName+null` -->
  - **Improved security: malformed identity headers are rejected cleanly**: Requests with invalid authentication tokens now fail safely with clear error messages. <!-- PRs: `https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+malformed+x-dbt-identity-header+JWT` -->

- **Cost Insights**
  - **Fixes Cost Insights date accuracy in charts and exports**: Date handling now correctly accounts for timezones, preventing off-by-one-day errors in charts and CSV exports. <!-- PRs: `https://github.com/dbt-labs/metadata-ui/pulls?q=is%3Apr+Cost+Insights+off-by-one+CSV+local+date` -->
  - **Cost Insights charts are more resilient**: Charts no longer error when grouping controls are temporarily unavailable. <!-- PRs: `https://github.com/dbt-labs/metadata-ui/pulls?q=is%3Apr+Cost+Insights+grouping+control+undefined` -->

- **Studio IDE**
  - **Command status is more reliable when Cloud CLI invocation data expires**: Commands that can't be fetched are now properly marked as failed instead of staying in a "running" state. <!-- PRs: `https://github.com/dbt-labs/ide-server/pulls?q=is%3Apr+invocation+404+mark+failed+command+status` -->
  - **More stable command history syncing**: Improved handling when multiple commands sync simultaneously, reducing potential conflicts. <!-- PRs: `https://github.com/dbt-labs/ide-server/pulls?q=is%3Apr+concurrent+sync+command+record+race` -->
  - **Improved IDE editor connection stability**: Better connection management reduces disconnection and error scenarios in the IDE. <!-- PRs: `https://github.com/dbt-labs/ide-server/pulls?q=is%3Apr+LSP+websocket+cancellation+stability` -->

- **Semantic Layer / MetricFlow**
  - **UTF-8 support for semantic manifest overrides**: Semantic Layer manifests now properly handle non-ASCII characters, preventing failures when using international characters. <!-- PRs: `https://github.com/dbt-labs/metricflow-server/pulls?q=is%3Apr+UTF-8+ASCII+semantic+manifest+override+checksum` -->

- **Runs / artifacts**
  - **More robust artifact packaging when symlinks exist**: Artifact packaging now properly handles symbolic links in your repository, reducing run failures. <!-- PRs: `https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+preserve+symlink+deferral+artifacts` -->

- **APIs**
  - **Jobs API deferral validation is stricter and clearer**: Job deferral settings are now validated to ensure the deferring job and environment exist within the same account, with improved error messages. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+Jobs+API+deferral+same+account+error+message` -->

### Behavior changes

- **dbt platform**
  - **⚠️ Cost Insights now requires explicit permissions**: Cost Insights is now visible only to users with the appropriate read permission, in addition to the feature being enabled for the account. <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+cost_insights_read+permission` -->
  - **Cross-project lineage is now generally available**: Cross-project lineage is now enabled for all applicable accounts. <!-- PRs: `https://github.com/dbt-labs/metadata-ui/pulls?q=is%3Apr+cross-project+lineage+feature+flag` -->
  - **Account Insights default page size changed to 5 rows**: Tables in Account Insights now display 5 rows per page by default (previously 10). <!-- PRs: `https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+Account+Insights+default+page+size+5` -->
  - **⚠️ IP restrictions now fail closed when client IP can't be determined**: When IP restrictions are configured, requests are now rejected if the source IP cannot be determined, improving security posture. <!-- PRs: `https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+IP+restrictions+fail+closed+remote_addr` -->

- **Webhooks**
  - **⚠️ Webhook timestamps are now consistently UTC RFC3339 with `Z`**: All webhook timestamp fields (`run_started_at`, `run_finished_at`, `timestamp`) now use UTC with `Z` suffix and higher precision. Missing/invalid timestamps emit `1970-01-01T00:00:00Z` instead of empty strings. Update webhook consumers if needed. <!-- PRs: `https://github.com/dbt-labs/notifications-system/pulls?q=is%3Apr+run_started_at+run_finished_at+RFC3339+Z+nanosecond` -->
  - **⚠️ Webhook `run_status` string changed from `Error` to `Errored`**: Update webhook consumers that parse this status value strictly. <!-- PRs: `https://github.com/dbt-labs/notifications-system/pulls?q=is%3Apr+run_status+Errored` -->

- **Runs / ingestion**
  - **⚠️ Very large exposure sets are now limited during ingestion**: Projects with more than 5,000 exposures will skip exposure ingestion to prevent performance issues. All other artifact ingestion continues normally. Contact support if you need to increase this limit. <!-- PRs: `https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+%225000%22+exposures+ingestion+guard` -->
  - **⚠️ Removed internal node-level run metrics**: The internal metrics `dbt_cloud.run.node.started` and `dbt_cloud.run.node.completed` have been removed. If you have custom monitoring dashboards using these metrics, please contact support for alternatives. <!-- PRs: `https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+dbt_cloud.run.node.started+dbt_cloud.run.node.completed+removed` -->


## January 14, 2026

### New

- **dbt platform**
  - **Fusion migration readiness endpoint**: Added an API endpoint to determine whether a project is eligible for Fusion migration.

### Enhancements

- **Copilot and AI**
  - **More resilient agent runs**: Agent tool execution errors now return structured responses instead of failing the entire run.
  - **Better project context retrieval**: Agent toolsets include additional retrieval and search capabilities for more relevant responses.
  - **Improved Azure OpenAI verification**: Azure OpenAI connection verification now uses GPT-5-compatible parameters for GPT-5 deployments.
  - **BYOK for Azure OpenAI**: Added support for Azure Foundry URLs with automatic endpoint parsing to reduce setup friction.

- **Insights and Catalog**
  - **Semantic Layer querying now generally available (GA)**: Build SQL queries against the Semantic Layer without writing SQL code.
  - **Improved search relevance**: Search scoring prioritizes exact and multi-term matches more strongly, with better highlighting and column-description matching.
  - **Catalog UX improvements**: Search labels are more consistent, and the embedded lineage view loads more responsively.

- **Studio IDE**
  - **Unified Studio IDE**: Studio now loads a single unified IDE package.
  - **Defer-to-production honors `defer-env-id` override**: Studio now respects `dbt-cloud.defer-env-id` settings when Cloud CLI runtime is supported.
  - **Improved log exporting**: Download and copy behavior for command logs is more consistent, including debug logs.
  - **Enhanced multi-edit support**: The IDE now supports multiple explicit edits in one request with safer validation.
  - **Clearer Cloud CLI session errors**: Session creation returns clearer error messages and guidance for setup issues.

- **dbt platform**
  - **Settings detail pages in resizable drawer**: Settings detail experiences now use an improved drawer-based UI.
  - **More resilient profile creation**: Profile creation now handles dependencies and failures more gracefully.
  - **Enhanced logging limits for in-progress runs**: Logs for in-progress runs are also limited by memory usage, in addition to the existing 1,000-line limit.

### Fixes

- **dbt platform**
  - **Profiles API clearing extended attributes**: The Profiles API now allows unsetting extended attributes by setting `extended_attributes_id` to null.
  - **Recently viewed more reliable**: Recently viewed entries now update atomically and retain the 5 most recent items.
  - **Run log tailing improvements**: Debug logs for completed runs now consistently fetch only the tail of the log.

- **Studio IDE**
  - **More reliable `show` and `compile`**: CLI flags to disable caching are now positioned correctly to avoid parsing issues.
  - **Canvas preview improvements**: Fixed argument ordering so `--no-defer` is interpreted consistently.


### Behavior changes

- **dbt platform**
  - **dbt v1.7 end-of-life**: dbt v1.7 is now labeled as end-of-life in version lifecycle messaging.


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
