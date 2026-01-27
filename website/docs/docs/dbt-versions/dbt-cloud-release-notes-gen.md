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


## January 28, 2026

## Output

I wrote the finalized single-tenant, customer-facing release notes to `release-notes/final-release-notes-2026-01-26.md`:

## Single-tenant release notes (2026-01-26)

## New

### Visual Editor

- **New two-step “upload source” API for more resilient uploads**: Use `POST /v1/workspaces/{workspace_id}/upload-source` to create an upload, then `PATCH /v1/workspaces/{workspace_id}/upload-source/{file_id}/process` to stream processing progress (SSE).  
  <!-- PRs: https://github.com/dbt-labs/visual-editor/pulls?q=is%3Apr+b9e8d1a64a279f3f93c5d9fbbe602a661e2b7596 -->

### AI & agents

- **New built-in `studio` agent for agent-run APIs** (configured as “Studio - DevAgent”).  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/675 -->

- **LangGraph agent supports client-provided tools**: agent requests can include client tool definitions to support client-side tool execution flows.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/660 -->

## Enhancements

### Cost Insights

- **More accurate Cost Insights baselines**: 7‑day averages and savings now account for all job runs in an environment (weighted by execution count), improving results for newly created or recently changed jobs.  
  <!-- PRs: https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+04fe0bec086b540d36cbcc4b587211c6579b6183 -->

- **Richer Cost Insights connection testing**: expanded tests (Snowflake, BigQuery, Databricks) return more actionable errors (for example, missing tables/columns).  
  <!-- PRs: https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+04fe0bec086b540d36cbcc4b587211c6579b6183 -->

- **dbt platform improvements for Cost Insights access and onboarding**:
  - Tabs and deep links now behave consistently when Cost Insights is disabled or the user lacks permission (including project-scoped permissions).
  - New in-product banners guide required enablement (Fusion, state-aware orchestration, Cost Insights, and permissions).  
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+e66be6e69a6429764427d1bcaffc3d6cd69a6848 -->

- **dbt platform shows Cost Insights connection test status and actionable errors**: when Cost Insights is enabled, connection settings trigger tests on credential changes and display status plus detailed error information.  
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+e66be6e69a6429764427d1bcaffc3d6cd69a6848 -->

- **Cost Insights connection tests: new APIs to trigger tests and check status**.  
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+4e7b64224cc49a23c3f4167676ec8d8c2c6349cd -->

- **Cost Insights: filter by resource type**: APIs now support filtering Cost Insights by resource type (defaults remain backward-compatible when omitted).  
  <!-- PRs: https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+CostInsightsFilter+resourceType -->

- **Support platform metadata credentials for Cost Insights (BigQuery v0, Redshift)**: adds schemas and profile-generation support for separate platform-metadata credentials used by cost and catalog workflows.  
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+4e7b64224cc49a23c3f4167676ec8d8c2c6349cd -->

- **Expanded Cost Insights permissions across standard roles**: `cost_insights_read` is available through more standard role sets, and `cost_insights_write` is available for account admins.  
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+4e7b64224cc49a23c3f4167676ec8d8c2c6349cd -->

- **Operational controls for Cost Insights backfills**: backfill tooling supports date-range overrides and targeting a single environment to simplify backfills and troubleshooting.  
  <!-- PRs: https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+04fe0bec086b540d36cbcc4b587211c6579b6183 -->

### Search

- **Improved search relevance and highlighting**: ranking now boosts results by modeling layer, and highlighting is more consistent (including support for multiple highlight snippets per field).  
  <!-- PRs: https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+highlightUtils https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+MODELING_LAYER_WEIGHTS -->

- **Elastic-backed dbt asset search (when enabled)**: the MCP `search` tool now uses Codex’s Elastic-backed search implementation.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/670 -->

- **MCP search resource-type filtering**: the MCP `search` tool accepts optional `resource_types` to narrow results (for example, models only).  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/673 -->

### Orchestration (Fusion / state-aware orchestration)

- **Support `dbt build --store-failures` through orchestration**: `--store-failures` is preserved when forwarding dbt build arguments.  
  <!-- PRs: https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+store-failures -->

- **Expose underlying dbt process exit code in execution metadata**: the dbt process return code is now recorded in execution core data, improving diagnostics and downstream handling.  
  <!-- PRs: https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+core_data.exit_code -->

- **Optional step-level OpenTelemetry artifact upload for Fusion runs** (when enabled): step telemetry artifacts are generated and uploaded as `telemetry-{step}-otel.parquet`.  
  <!-- PRs: https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+orc-3228-fusion-otel-artifact -->

- **Cleaner Fusion logs in run output**: reduces internal noise and improves how key errors (including compilation-style errors) are surfaced.  
  <!-- PRs: https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+RecordMessageStatus -->

### Networking & platform administration

- **Private endpoints details page**: dbt platform now includes a Private Endpoint details view with endpoint properties, connectivity status, and associated projects.  
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+e66be6e69a6429764427d1bcaffc3d6cd69a6848 -->

- **Fusion-aware default dbt version during setup**: connection setup and environment creation can now default to `latest-fusion` for eligible projects.  
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+e66be6e69a6429764427d1bcaffc3d6cd69a6848 -->

### Studio IDE

- **Search + Replace in Files (behind flags)**: adds a dedicated sidebar Search experience and common shortcuts (for example, Cmd/Ctrl+Shift+F).  
  <!-- PRs: https://github.com/dbt-labs/studio/pulls?q=is%3Apr+cc94a5db018aa847120630654a28c0127b89f4e4 -->

- **Autofix now includes package upgrades**: upgrade flows can proceed from fixing deprecations into package upgrades in the same guided run.  
  <!-- PRs: https://github.com/dbt-labs/studio/pulls?q=is%3Apr+cc94a5db018aa847120630654a28c0127b89f4e4 -->

- **Copilot chat UX improvements**: improved chat entry points and behavior, including a new alternate “agentic” chat UI behind a flag.  
  <!-- PRs: https://github.com/dbt-labs/studio/pulls?q=is%3Apr+cc94a5db018aa847120630654a28c0127b89f4e4 -->

- **Editor UI polish**: fixes multiple layout/styling issues for a more consistent editor experience.  
  <!-- PRs: https://github.com/dbt-labs/studio/pulls?q=is%3Apr+cc94a5db018aa847120630654a28c0127b89f4e4 -->

- **Copilot chat mode switching UI**: the chat mode switcher is now a dropdown with short descriptions, and “Agent” is labeled Beta when streaming agents are enabled.  
  <!-- PRs: https://github.com/dbt-labs/insights-ui/pulls?q=is%3Apr+6c52cc68e505ed3097abd9f2aff3fa5b2dad96c4 -->

## Fixes

### Webhooks & notifications

- **Webhook payload compatibility for errored runs**: webhook events for errored runs now use `runErroredAt` (instead of `runFinishedAt`) to reduce downstream parsing failures.  
  <!-- PRs: https://github.com/dbt-labs/notifications-system/pulls?q=is%3Apr+ef0444c1f5f9490fabaca2ffd240c56b0fd0c6e6 -->

- **Reduced PII exposure in logs**: email addresses are now masked in logged summaries of matched dispatch targets.  
  <!-- PRs: https://github.com/dbt-labs/notifications-system/pulls?q=is%3Apr+ef0444c1f5f9490fabaca2ffd240c56b0fd0c6e6 -->

### Data quality & correctness

- **Similar Models / Similar Sources are now properly account-scoped**: similarity APIs now scope embeddings/metadata by `account_id` (in addition to environment), improving correctness in multi-account single-tenant setups.  
  <!-- PRs: https://github.com/dbt-labs/cloud-artifacts-internal-api/pulls?q=is%3Apr+3b18f6ea1383949f971f58c286ff3c0d6f76caa8 -->

- **Correct `NOT_FOUND` responses for missing catalog run lookups**: catalog run lookups now return `NOT_FOUND` consistently when no record exists.  
  <!-- PRs: https://github.com/dbt-labs/cloud-artifacts-internal-api/pulls?q=is%3Apr+3b18f6ea1383949f971f58c286ff3c0d6f76caa8 -->

### Developer experience

- **dbt platform run logs render ANSI/structured output more reliably**: improved rendering and cleanup of escape sequences in step logs.  
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/pulls?q=is%3Apr+e66be6e69a6429764427d1bcaffc3d6cd69a6848 -->

- **CLI project sync no longer fails on broken symlinks**: sync skips missing symlink targets instead of failing the whole sync.  
  <!-- PR: https://github.com/dbt-labs/dbt-cloud-cli/pull/2012 -->

- **IDE abort is clearer when a command is missing**: aborting a command that no longer exists returns a specific “no-command-found” response.  
  <!-- PRs: https://github.com/dbt-labs/ide-server/pulls?q=is%3Apr+6fa03b9543e5a8922e18f30b194eac9275e9e5c2 -->

- **More robust inline command results**: malformed inline commands no longer break result processing; `show --inline` with an empty result returns an empty preview table.  
  <!-- PRs: https://github.com/dbt-labs/ide-server/pulls?q=is%3Apr+6fa03b9543e5a8922e18f30b194eac9275e9e5c2 -->

- **AI Codegen: invalid client-tool schemas now return 422 (not 500)**.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/662 -->

- **AI Codegen: safer SQL dialect fallback**: if an unknown adapter version is encountered, requests fall back to the `ansi` dialect instead of failing.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/663 -->

### Visual Editor

- **Clearer errors for duplicate uploaded-source names**: creating an uploaded-source model with a duplicate name now returns HTTP 409 with an actionable message.  
  <!-- PRs: https://github.com/dbt-labs/visual-editor/pulls?q=is%3Apr+b9e8d1a64a279f3f93c5d9fbbe602a661e2b7596 -->

- **Failed uploads are now visible via file state**: uploaded-source processing records failure state instead of deleting the file record, improving retry/resume workflows.  
  <!-- PRs: https://github.com/dbt-labs/visual-editor/pulls?q=is%3Apr+b9e8d1a64a279f3f93c5d9fbbe602a661e2b7596 -->

- **Invocation status streaming reliability**: the invocation status SSE endpoint now correctly awaits the status stream.  
  <!-- PRs: https://github.com/dbt-labs/visual-editor/pulls?q=is%3Apr+b9e8d1a64a279f3f93c5d9fbbe602a661e2b7596 -->

### Orchestration security

- **Redact auth tokens from URLs in logs**: embedded auth (for example, token-in-URL patterns) is scrubbed before being written to logs.  
  <!-- PRs: https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+x-token-auth -->

### Orchestration correctness

- **More correct source freshness status in multi-job environments**: freshness status is preserved when a run lacks freshness results but freshness remains configured.  
  <!-- PRs: https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+04fe0bec086b540d36cbcc4b587211c6579b6183 -->

- **More robust seed artifact ingestion**: ingestion now tolerates missing/null `schema` fields in the manifest to avoid failures.  
  <!-- PRs: https://github.com/dbt-labs/codex-workflows/pulls?q=is%3Apr+04fe0bec086b540d36cbcc4b587211c6579b6183 -->

### Search data isolation

- **Tighter account scoping for Codex-backed queries**: queries now more consistently scope by `account_id` when enabled, improving correctness and isolation.  
  <!-- PRs: https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+meta-5740-codex-api-cadi https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+META_5740_CODEX_API_CADI -->

## Behavior Changes

### AI Codegen / MCP (breaking changes & API contract updates)

- **Legacy MCP endpoints removed**: `GET /v1/mcp/tools/list` and `POST /v1/mcp/tools/call` now return 410; migrate to `/v1/mcp/*`.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/664 -->

- **Fusion → LSP toolset rename (and tool name changes)**: the toolset value `fusion_lsp` is now `lsp`, and Fusion-prefixed tool names are simplified (for example, `fusion.compile_sql` → `compile_sql`).  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/664 -->

- **MCP `search` tool is disabled by default**: it won’t appear in tool listings unless explicitly enabled (and requires `account_id` and `user_id`).  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/676 -->

- **Agent playground request shape updated**: the playground now runs via the LangGraph agent implementation and expects the updated message contract used by that agent.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/658 -->

### Search & APIs (deprecations and response-shape changes)

- **Search highlight fields deprecated and highlights shape expanded**:
  - `AccountSearchHit.highlight` and `AccountSearchHit.matchedField` are deprecated.
  - `AccountSearchHit.highlights` now supports multiple highlight snippets per field (arrays).  
  <!-- PRs: https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+highlightUtils https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+MODELING_LAYER_WEIGHTS -->

### Database migrations / operator action required

- **Required DB migration adds `account_id` to `dbt_catalog_applied_state_big`**: if the table is non-empty, plan a backfill so the new required column can be populated safely during migration.  
  <!-- PRs: https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+dbt_catalog_applied_state_big+account_id https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+resource_account_id+migration.sql -->

### Platform behavior changes & deprecations

- **Cost Insights connection test APIs now surface timeouts as HTTP 408**.  
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+4e7b64224cc49a23c3f4167676ec8d8c2c6349cd -->

- **Deprecations**:
  - The “Adaptive” job type is deprecated.
  - `last_checked_at` is deprecated and no longer populated in run responses.  
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/pulls?q=is%3Apr+4e7b64224cc49a23c3f4167676ec8d8c2c6349cd -->

- **Existing CSV upload SSE endpoint deprecated**: migrate to the new two-step “upload source” flow.  
  <!-- PRs: https://github.com/dbt-labs/visual-editor/pulls?q=is%3Apr+b9e8d1a64a279f3f93c5d9fbbe602a661e2b7596 -->

- **Helm default changed for Codex GraphQL URL**: `codexGqlUrl` now defaults to the internal Codex service name; single-tenant installs may need to override this to match the Codex GraphQL endpoint available in their cluster.  
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/666 -->

### Orchestration error classification

- **Fusion SAO “panic” failures are now classified as internal errors**: when using Fusion with state-aware orchestration, exit code `2` is now treated as an internal/system error (rather than a user dbt command failure).  
  <!-- PRs: https://github.com/dbt-labs/dbt-orc/pulls?q=is%3Apr+CODE_DBT_PANIC -->

### Runtime/container updates

- **Updated Node.js runtime and gateway WAF module**: Codex services update Node.js base images and the Signal Sciences NGINX module version; review if you extend images or rely on specific runtime/WAF behavior.  
  <!-- PRs: https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+nodejs+24.13.0 https://github.com/dbt-labs/codex-api/pulls?q=is%3Apr+SIGSCI_VERSION+1.3.3 -->
## January 21, 2026

### New

- **dbt platform**
  - **Favorites are now available in Catalog**: Add resources to favorites and organize your frequently accessed resources in the Catalog navigation.

- **Connectivity / private networking**
  - **New v3 API endpoint to fetch a specific PrivateLink endpoint**: You can now retrieve individual PrivateLink endpoints by ID, enabling better automation and troubleshooting workflows.

### Enhancements

- **dbt platform**
  - **Run artifacts are now searchable**: Find specific artifacts faster in run history with the new artifacts search box and improved empty states.
  - **Webhooks editor is more stable**: The webhook form no longer resets while job options are loading, and server-generated fields now display reliably after creation.
  - **Fusion onboarding completion card can be dismissed**: After completing the Fusion onboarding checklist, you can now dismiss the card and it will stay dismissed.
  - **Cross-project lineage is now generally available**: Cross-project lineage is now enabled for all applicable accounts.

- **Catalog & Search**

  - **Improved Catalog search relevance and performance**: Enhanced search scoring and matching provides more accurate results, with better column matching and highlighting for large catalogs.
  - **Search results are refreshed when column metadata changes**: Column name and description updates now automatically trigger re-indexing, ensuring search results stay current.
  - **Search typeahead includes "View all results"**: Quickly access full search results from the typeahead dropdown with the new footer link.
  - **Cleaner environment dropdown behavior**: The environment selector now only shows "Staging" when your account has projects with a staging environment configured.

- **Studio IDE**
  - **Clearer error messages when fetching dev credentials and defer state**: IDE-related endpoints now return more specific and helpful error messages for common configuration issues and timeouts.
  - **Studio console and command log viewer improvements**: Enhanced command log viewer with improved download capabilities and more consistent error log viewing.

### Fixes

- **AI-assisted workflows**
  - **Enhancement:** [dbt <Constant name="copilot" />](/docs/cloud/dbt-copilot) adds missing column descriptions more accurately. <Constant name="copilot" /> generated documentation now correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.

- **Catalog & lineage**
  - **Fixes missing auto-generated exposures in model lineage**: Auto-generated exposures now appear correctly in lineage views.
  - **Catalog search no longer errors when a warehouse connection name is missing**: Search now handles missing connection names gracefully without causing errors.
  - **Improved security: malformed identity headers are rejected cleanly**: Requests with invalid authentication tokens now fail safely with clear error messages.

- **Studio IDE**
  - **Command status is more reliable when Cloud CLI invocation data expires**: Commands that can't be fetched are now properly marked as failed instead of staying in a "running" state.

- **APIs**
  - **Jobs API deferral validation is stricter and clearer**: Job deferral settings are now validated to ensure the deferring job and environment exist within the same account, with improved error messages.

### Behavior changes

- **dbt platform**
  - **Account Insights default page size changed to 5 rows**: Tables in Account Insights now display 5 rows per page by default (previously 10).

- **Webhooks**
  - **Webhook timestamps are now consistently UTC RFC3339 with `Z`**: All webhook timestamp fields (`run_started_at`, `run_finished_at`, `timestamp`) now use UTC with `Z` suffix and higher precision. Missing/invalid timestamps emit `1970-01-01T00:00:00Z` instead of empty strings. Update webhook consumers if needed.
  - **Webhook `run_status` string changed from `Error` to `Errored`**: Update webhook consumers that parse this status value strictly.

- **Runs / ingestion**
  - **Very large exposure sets are now limited during ingestion**: Projects with more than 5,000 exposures will skip exposure ingestion to prevent performance issues. All other artifact ingestion continues normally. Contact support if you need to increase this limit.


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
