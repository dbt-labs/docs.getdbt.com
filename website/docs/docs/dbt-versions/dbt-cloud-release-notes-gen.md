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


## February 4, 2026

## New

### Studio IDE

- **Studio IDE: AI Assistant entry point in console toolbar**: Adds an Artificial Intelligence (AI) button in the Studio Integrated Development Environment (IDE) console toolbar to open the assistant; when enabled, the assistant can read files and list directories for better context.
  <!-- PR: https://github.com/dbt-labs/studio/pulls?q=AIButton+clientTools+read_file_tool+list_directory_tool -->

- **Studio IDE: Copy repo-relative path command**: Adds a command to copy a file path relative to your dbt project subdirectory, making it easier to share paths in runbooks and support tickets.
  <!-- PR: https://github.com/dbt-labs/studio/pulls?q=studio.copyRepoRelativePath -->

## Enhancements

### dbt platform

- **dbt platform: Fusion Eligibility And Compatibility Indicators In Setup Flows**: Improves Fusion setup by showing “Fusion compatible” indicators during connection setup and using the Fusion eligibility status Application Programming Interface (API) for gating.
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...260303e1d271d66e5714fda91804bd740e44b159 -->

- **dbt platform: Compare Changes shows partial success warnings**: When Compare Changes subqueries fail, the experience now surfaces a Partial success state with expandable warning details to make troubleshooting faster.
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...260303e1d271d66e5714fda91804bd740e44b159 -->

- **dbt platform: In-progress run logs preserve text selection**: Improves log usability during in-progress runs by preserving text selection while logs auto-refresh and rerender.
  <!-- Reviewed by Bianca PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...260303e1d271d66e5714fda91804bd740e44b159 -->

- **dbt platform: Job completion trigger job picker search**: Adds server-side search and clearer loading and empty states to the job picker for job-completion triggers.
  <!-- Reviewed by Bianca PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...260303e1d271d66e5714fda91804bd740e44b159 -->

- **dbt platform: Private Endpoints list search and sorting**: Adds server-side name search and sorting, shows connection counts, and surfaces the Endpoint Identifier on details pages.
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...260303e1d271d66e5714fda91804bd740e44b159 -->

- **dbt platform: Platform Metadata Credentials expanded adapter support**: Expands Platform Metadata Credentials setup to additional adapters, including BigQuery v0 and Amazon Redshift.
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...260303e1d271d66e5714fda91804bd740e44b159 -->

- **dbt platform: Job artifacts content types and downloads**: Improves artifact handling for job documentation and run artifacts by strengthening HyperText Markup Language (HTML) detection, defaulting empty paths to `index.html`, and returning clearer `Content-Type` and download filenames.
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/compare/4e7b64224cc49a23c3f4167676ec8d8c2c6349cd...0a8f78d5a14ee2cdb2e7ac0f4d38197fea1bfffc -->

- **dbt platform: Private Endpoints API listing and pagination improvements**: Improves Private Endpoints Application Programming Interface (API) v3 list behavior with validated query parameters, filtering, limit and offset pagination, and `connection_count` in responses.
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/compare/4e7b64224cc49a23c3f4167676ec8d8c2c6349cd...0a8f78d5a14ee2cdb2e7ac0f4d38197fea1bfffc -->

### Studio IDE

- **Studio IDE: Format file more reliable in subdirectories**: Improves formatting reliability by consistently using the active editor content and a stable repo-relative path when invoking formatting.
  <!-- PR: https://github.com/dbt-labs/studio/pulls?q=useFormatFile+openTextDocument+getRelativePath -->

- **Studio IDE: Better stability for tabs and Git operations**: Reduces errors when working with non-file tabs and improves robustness around tab-close and Git checkout flows.
  <!-- PR: https://github.com/dbt-labs/studio/pulls?q=uri+%7C+null+getOpenTabs+forceCloseTab -->

- **Studio IDE: Sidebar layout improvements for embedded panels**: Improves embedded panel sizing to reduce clipping and scrolling issues in the sidebar.
  <!-- PR: https://github.com/dbt-labs/studio/pulls?q=SIDEBAR_PART+mb-%5B-34px%5D -->

- **Studio IDE: Fusion prompts reflect actual eligibility**: Improves Fusion banners and prompts by checking project eligibility via a Fusion status endpoint to reduce confusing prompts for ineligible projects.
  <!-- PR: https://github.com/dbt-labs/studio/pulls?q=useFusionStatus+fusion%2Fstatus+orc2609ShowFusionToggle -->

### Catalog and Discovery

- **Catalog: Search highlight rendering more compact**: Updates search highlights to display as compact badges with counts for easier scanning of results.
  <!-- PRs: https://github.com/dbt-labs/metadata-ui/compare/e998252b400d211c8523a90709fb322165491100...42355248ca93c97862a2a9bac317cfc960a7d1bf -->

- **Catalog: Improved cross-project lineage for dbt Mesh**: Improves cross-project lineage (“public ancestors”) computation to better match expected external lineage boundaries in dbt Mesh experiences.
  <!-- PRs: https://github.com/dbt-labs/codex-workflows/compare/04fe0bec086b540d36cbcc4b587211c6579b6183...fc3f3ffce5d885ddbbbf0f9d145ac78b6a879a74 -->

### Insights

- **Insights: Copilot Agent availability via release channel setting**: Improves Copilot Agent (Beta) enablement by supporting an external beta release-channel setting alongside feature flags, with a loading state to prevent incorrect redirects while access is being resolved. (Feature Flag: Required)
  <!-- Reviewed by Bianca PRs: https://github.com/dbt-labs/insights-ui/compare/6c52cc68e505ed3097abd9f2aff3fa5b2dad96c4...7fe0568c4e76c08c0b4c31872b44a02e3252b037 -->

- **Insights: More reliable Copilot Agent requests and context handoff**: Standardizes Copilot Agent requests on the v1 agent Application Programming Interface (API) and includes active tab content as context to improve reliability of agent runs and handoff.
  <!-- Reviewed by Bianca PRs: https://github.com/dbt-labs/insights-ui/compare/6c52cc68e505ed3097abd9f2aff3fa5b2dad96c4...7fe0568c4e76c08c0b4c31872b44a02e3252b037 -->

## Fixes

### dbt platform

- **dbt platform: Webhook form editing more resilient**: Improves webhook subscription editing reliability with asynchronous data and fixes a multiselect focus issue that could cause accidental option selection.
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...260303e1d271d66e5714fda91804bd740e44b159 -->

- **dbt platform: Run warning emails render correctly**: Fixes HyperText Markup Language (HTML) email markup that could break rendering for run warning notifications.
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/compare/4e7b64224cc49a23c3f4167676ec8d8c2c6349cd...0a8f78d5a14ee2cdb2e7ac0f4d38197fea1bfffc -->

- **dbt platform: Profiles URLs moved under project dashboard** Profile create and view routes now live under `/dashboard/:accountId/projects/:projectId/profiles/...`, which may affect bookmarks and direct links. <!-- PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...3651e52a842bf377661b303cbaf47851fc6ab2a2 -->

### Studio IDE

- **Studio IDE: Cleaner command history list**: Removes hidden background commands (such as listing and parsing commands) from command history to reduce noise for users.
  <!-- PRs: https://github.com/dbt-labs/ide-server/compare/6fa03b9543e5a8922e18f30b194eac9275e9e5c2...35877c93fb0b394b392095d04cea9a5d5fca5768 -->

- **Studio IDE: More reliable inline compile and show output**: Improves robustness of inline compile and show output attachment, including cases with tricky quoting and newlines, reducing missing results during interactive use.
  <!-- PRs: https://github.com/dbt-labs/ide-server/compare/6fa03b9543e5a8922e18f30b194eac9275e9e5c2...35877c93fb0b394b392095d04cea9a5d5fca5768 -->

- **Studio IDE: More reliable log downloads for dbt commands**: Fixes log download behavior so downloads correctly serve either the active `dbt.log` or the finalized compressed log.
  <!-- PRs: https://github.com/dbt-labs/ide-server/compare/6fa03b9543e5a8922e18f30b194eac9275e9e5c2...35877c93fb0b394b392095d04cea9a5d5fca5768 -->

- **Studio IDE: More reliable artifact uploads to Microsoft Azure Blob Storage**: Fixes edge cases where gzipped artifacts (such as manifests) could fail to upload due to upload stream handling, improving upload reliability.
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud-cli/compare/58f5839a2c22c56dd482f8d89d0f97075737c2e4...f879b17ee12e4dca35bc79108c206008a7488058 -->

- **Studio IDE: More stable Language Server Protocol sessions in workers**: Reduces noisy disconnect and cleanup errors when multiple websocket connections and processes map to the same invocation, improving session stability. (Language Server Protocol (LSP))
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud-cli/compare/58f5839a2c22c56dd482f8d89d0f97075737c2e4...f879b17ee12e4dca35bc79108c206008a7488058 -->

### Insights and Catalog

- **Catalog: Search highlighting displays correctly with multiple matches**: Fixes search result highlighting when the backend returns multiple highlights per field, improving readability of matches.
  <!-- PRs: https://github.com/dbt-labs/insights-ui/compare/6c52cc68e505ed3097abd9f2aff3fa5b2dad96c4...7fe0568c4e76c08c0b4c31872b44a02e3252b037 -->

- **Catalog: Environment filtering more accurate in search results**: Improves environment-scoped Catalog search filtering by using merged environment identifiers and preserving warehouse-only assets via a dedicated sentinel value.
  <!-- PRs: https://github.com/dbt-labs/codex-api/compare/43bcb19c27b1d05ad1424052836562fc49039356...2194c791f740b8e92c328b2826517662c743a6e7 -->

- **Catalog: Public models return empty list when none exist**: Improves behavior for environments with no public models by returning an empty list instead of falling into follow-on query logic.
  <!-- PRs: https://github.com/dbt-labs/codex-api/compare/43bcb19c27b1d05ad1424052836562fc49039356...2194c791f740b8e92c328b2826517662c743a6e7 -->

### Copilot and AI Assistant

- **Copilot: More reliable Model Context Protocol connections during long tool calls**: Improves keep-alive behavior so connections shut down cleanly when the client disconnects, reducing noisy failures. (Model Context Protocol (MCP))
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/707 -->

- **Copilot: Semantic Layer tools only offered when available**: Prevents failing tool calls by hiding Semantic Layer tools when the Semantic Layer is not available for the user or environment.
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/692 -->

- **Copilot: More accurate HyperText Transfer Protocol error responses**: Improves error reporting by walking wrapped exceptions and exception groups to return the most specific status code and detail available. (HyperText Transfer Protocol (HTTP))
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/687 -->

- **Copilot: Empty Tool Outputs No Longer Cause Failures**: Treats empty tool outputs as valid results (for example, “no matches”) to reduce unnecessary “tool call failed” errors.
  <!-- PR: https://github.com/dbt-labs/ai-codegen-api/pull/690 -->

## Behavior Changes

### dbt platform

- **dbt platform: Fusion default dbt version selection more restrictive**: During connection setup, the default dbt version now only defaults to `latest-fusion` when the selected adapter is Fusion-compatible and the project and account are eligible.
  <!-- PRs: https://github.com/dbt-labs/cloud-ui/compare/e66be6e69a6429764427d1bcaffc3d6cd69a6848...260303e1d271d66e5714fda91804bd740e44b159 -->

- **dbt platform: dbt version enforcement now project-aware**: dbt version “allowed version” checks now account for `project_id` across jobs and environments, including Application Programming Interface (API)-triggered runs, improving correctness for overrides and automatic mapping to allowed equivalents when possible.
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/compare/4e7b64224cc49a23c3f4167676ec8d8c2c6349cd...0a8f78d5a14ee2cdb2e7ac0f4d38197fea1bfffc -->

- **dbt platform: Connected app refresh tokens now last 7 days**: Refresh token expiration for connected app OAuth (Open Authorization (OAuth)) flows increased from 8 hours to 7 days, reducing re-authorization frequency.
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/compare/4e7b64224cc49a23c3f4167676ec8d8c2c6349cd...0a8f78d5a14ee2cdb2e7ac0f4d38197fea1bfffc -->

- **dbt platform: BigQuery Platform Metadata Credentials profile generation requirements updated**: BigQuery v1 Platform Metadata Credentials profile generation now requires an associated OAuth configuration and includes a token endpoint stanza for machine OAuth flows.
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/compare/4e7b64224cc49a23c3f4167676ec8d8c2c6349cd...0a8f78d5a14ee2cdb2e7ac0f4d38197fea1bfffc -->

- **dbt platform: Private Endpoints authorization failures return not found**: Authorization failures for Private Endpoints are intentionally returned as HyperText Transfer Protocol (HTTP) 404 (Not Found) to reduce endpoint enumeration risk.
  <!-- PRs: https://github.com/dbt-labs/dbt-cloud/compare/4e7b64224cc49a23c3f4167676ec8d8c2c6349cd...0a8f78d5a14ee2c7ac0f4d38197fea1bfffc -->

### Studio IDE

- **Studio IDE: File stat timestamps now milliseconds**: File stat responses now return modified time and created time as integer milliseconds since epoch instead of float seconds; integrations consuming these endpoints may need to adjust.
  <!-- PRs: https://github.com/dbt-labs/ide-server/compare/6fa03b9543e5a8922e18f30b194eac9275e9e5c2...35877c93fb0b394b392095d04cea9a5d5fca5768 -->

- **Studio IDE: Language Server Protocol deferral controls expanded**: The Language Server Protocol (LSP) websocket now supports `defer_env_id` to defer against a specific environment and `no_defer=true` to explicitly disable deferral.
  <!-- PRs: https://github.com/dbt-labs/ide-server/compare/6fa03b9543e5a8922e18f30b194eac9275e9e5c2...35877c93fb0b394b392095d04cea9a5d5fca5768 -->

- **Studio IDE: Deferral toggle applied more consistently to Language Server Protocol connections**: When “defer to production” is turned off, the Studio Integrated Development Environment (IDE) now passes `no_defer=true` to align editor intelligence with the selected deferral behavior. (Language Server Protocol (LSP))
  <!-- PR: https://github.com/dbt-labs/studio/pulls?q=no_defer%3Dtrue+useDeferToProductionToggle -->

### Catalog

- **Catalog: Source freshness outdated status removed**: The freshness status value `outdated` was removed; unconfigured freshness is now handled explicitly as `unconfigured`, and sources will no longer report `outdated`.
  <!-- PRs: https://github.com/dbt-labs/codex-workflows/compare/04fe0bec086b540d36cbcc4b587211c6579b6183...fc3f3ffce5d885ddbbbf0f9d145ac78b6a879a74 -->

- **Catalog: Rows per page selector removed from tables**: The rows-per-page selector was removed, and pagination now uses a fixed page size.
  <!-- PRs: https://github.com/dbt-labs/metadata-ui/commit/f3daebc -->

### Orchestration and Run Status

- **Orchestration: Cached and stale outcome status mapping updated**: Cached nodes are now consistently surfaced as Reused with clearer reasons, and stale outcomes are treated as errors, which can change the statuses operators see in run output and telemetry.
  <!-- Reviewed by Bianca PRs: https://github.com/dbt-labs/dbt-orc/compare/39e8c7ec29a86e202d85805f1eb2b795482535ce...89212ae519c0bcf274a390503751956f37615593 -->
  
## January 28, 2026

### New

- **Canvas**
  - **New two-step "upload source" API for more resilient uploads**: Use `POST /v1/workspaces/{workspace_id}/upload-source` to create an upload, then `PATCH /v1/workspaces/{workspace_id}/upload-source/{file_id}/process` to stream processing progress (SSE).  

### Enhancements

- **Catalog & Search**
  - **Improved search relevance and highlighting**: Ranking now boosts results by modeling layer, and highlighting is more consistent (including support for multiple highlight snippets per field).  
- **dbt platform**
  - **Private endpoints details page**: The dbt platform now includes a Private Endpoint details view with endpoint properties, connectivity status, and associated projects.  
  - **Fusion-aware default dbt version during setup**: Connection setup and environment creation can now default to `latest-fusion` for eligible projects.  
- **Studio IDE**
  - **Search and replace in files**: Adds a dedicated sidebar search experience. Please contact your account manager to enable.
  - **Autofix now includes package upgrades**: Upgrade flows can proceed from fixing deprecations into package upgrades in the same guided run.  
  - **Editor UI polish**: Fixed multiple layout/styling issues for a more consistent editor experience.  

### Fixes

- **dbt platform**
  - **Run logs render ANSI/structured output more reliably**: Improved rendering and cleanup of escape sequences in step logs.  
  - **More accurate source freshness status in multi-job environments**: Freshness status is preserved when a run lacks freshness results but freshness remains configured.  
  - **More robust seed artifact ingestion**: Ingestion now tolerates missing/null `schema` fields in the manifest to avoid failures.  

- **Studio IDE**
  - **CLI project sync no longer fails on broken symlinks**: Sync skips missing symlink targets instead of failing the whole sync.  
  - **IDE abort is clearer when a command is missing**: Aborting a command that no longer exists returns a specific "no-command-found" response.  
  - **More robust inline command results**: Malformed inline commands no longer break result processing; `show --inline` with an empty result returns an empty preview table.  

- **Canvas**
  - **Clearer errors for duplicate uploaded-source names**: Creating an uploaded-source model with a duplicate name now returns HTTP 409 with an actionable message.  
  - **Failed uploads are now visible via file state**: Uploaded-source processing records failure state instead of deleting the file record, improving retry/resume workflows.  
  - **Invocation status streaming reliability**: The invocation status SSE endpoint now correctly awaits the status stream.

### Behavior changes

- **Catalog & Search**
  - **Search highlight fields deprecated and highlights shape expanded**: `AccountSearchHit.highlight` and `AccountSearchHit.matchedField` are deprecated. `AccountSearchHit.highlights` now supports multiple highlight snippets per field (arrays).  

- **dbt platform**
  - **Deprecations**: The "Adaptive" job type is deprecated. `last_checked_at` is deprecated and no longer populated in run responses.  

- **Canvas**
  - **Existing CSV upload SSE endpoint deprecated**: Migrate to the new two-step [upload source](/docs/cloud/use-canvas#upload-data-to-canvas) flow.  

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
