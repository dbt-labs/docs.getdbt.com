---
title: "dbt release notes"
description: "dbt release notes"
id: "dbt-cloud-release-notes"
sidebar: "dbt release notes"
hide_table_of_contents: true
pagination_next: null
pagination_prev: null
---

<Constant name="dbt" /> release notes for recent and historical changes. Release notes fall into one of the following categories:

<Lifecycle status="New" size="70" /> New products and features <br />
<Lifecycle status="Enhancement" size="70" /> Performance improvements and feature enhancements <br />
<Lifecycle status="Fix" size="70" /> Bug and security fixes <br />
<Lifecycle status="Behavior change" size="70" /> A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC) environments.

For <Constant name="fusion_engine" /> updates, refer to the [dbt-fusion changelog](https://github.com/dbt-labs/dbt-fusion/blob/main/CHANGELOG.md).

## May 2026

<Lifecycle status="New" size="70" /> The Fusion + Snowflake connection experience is now generally available on the dbt platform, refer to [Fusion upgrade guides](/guides/prepare-fusion-upgrade?step=1) for more information.
<Lifecycle status="Enhancement" size="70" /> Delete individual [<Constant name="copilot" /> chat conversations](/docs/dbt-ai/developer-agent#availability-and-considerations) from the conversation list (three dots → **Delete**). Deleting the open conversation clears the panel.

## April 2026

### April 29, 2026

<Lifecycle status="Enhancement" size="70" /> The Studio IDE dev agent can now help you investigate and troubleshoot dbt job and run failures using the `troubleshooting-dbt-job-errors` skill, refer to [Debug job failures](/docs/dbt-ai/developer-agent?version=2.0#debug-job-failures) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> Semantic Layer requests through MCP are now capped at 10 MiB (previously unlimited) to improve infrastructure stability. <br />
<Lifecycle status="Enhancement" size="70" /> The "Debug in Studio" and "Run once on Fusion" menu items are now independently disabled based on your permissions, with tooltips explaining why when unavailable. <br />
<Lifecycle status="Enhancement" size="70" /> When you click "Debug in Studio," dbt platform now automatically sets your user-level `DBT_DEVELOP_CORE_VERSION` environment variable to `latest-fusion` before opening the Studio IDE. <br />
<Lifecycle status="Enhancement" size="70" /> If the preparation step before opening the Studio IDE fails, the button temporarily shows "Debug failed" in a red state for 5 seconds before resetting. <br />
<Lifecycle status="Enhancement" size="70" /> Projects with no jobs configured are now treated as eligible for Fusion, and the upgrade card shows "No jobs configured yet" under job eligibility. <br />
<Lifecycle status="Enhancement" size="70" /> Clicking "Override eligibility status" on the run details page now opens a confirmation pop-up before applying the override. <br />
<Lifecycle status="Enhancement" size="70" /> The review button on the jobs list for jobs with unknown Fusion eligibility is now shown to all users regardless of run write permissions. <br />
<Lifecycle status="Enhancement" size="70" /> The orchestrator now publishes model execution events for grouped models and tests when running with dbt Fusion's OpenTelemetry (OTel) log format. <br />
<Lifecycle status="Enhancement" size="70" /> The run ingestion pipeline now detects and signals when structured dbt logs are present for a step, so logs appear correctly in the dbt platform for runs ingested from external executors. <br />
<Lifecycle status="Enhancement" size="70" /> The Cancel and Save buttons on the create private endpoint page now stick to the bottom of the viewport so they remain accessible when scrolling. <br />
<Lifecycle status="Enhancement" size="70" /> The "Generate docs on run" deprecation notice is now only shown for jobs running on a Fusion dbt version. <br />
<Lifecycle status="Fix" size="70" /> Fixed request errors when using BYOK OpenAI and Azure OpenAI reasoning model endpoints. <br />
<Lifecycle status="Fix" size="70" /> Metric manifest fields `granularity` and `offset_to_grain` now accept arbitrary string values instead of only a fixed enum, so projects using custom granularities such as `fiscal_year` will no longer fail ingestion. <br />
<Lifecycle status="Fix" size="70" /> Tags are now a searchable field in the advanced search panel, using OR logic to return assets matching any of the specified tags.

### April 22, 2026

<Lifecycle status="New" size="70" /> The catalog search sidebar now includes health and last run status filter sections for dbt resources. <br />
<Lifecycle status="New" size="70" /> Tag is now a searchable field in the advanced search side panel with OR-logic filter matching. <br />
<Lifecycle status="Enhancement" size="70" /> Added additional layers of theme preference fallbacks, including the user's OS theme preferences, to avoid incorrect theming when the user-preferences service is slow to respond. <br />
<Lifecycle status="Enhancement" size="70" /> You can now navigate directly to a specific Studio IDE console tab using a `consoleTab` URL query parameter. <br />
<Lifecycle status="Enhancement" size="70" /> After the deprecation autofix workflow completes in Fusion environments, a Compile button now appears in the autofix results panel. <br />
<Lifecycle status="Enhancement" size="70" /> The Fusion eligibility dropdown filter on the jobs list has been replaced with a toggle and help icon that saves its state per-project in your browser. <br />
<Lifecycle status="Enhancement" size="70" /> The single "Run once on Fusion" button has been replaced with a "Debug on Fusion" menu offering "Debug in Studio," "Run once on Fusion," and (when Copilot is enabled) "Debug in Studio with Copilot" options, refer to [Prepare to upgrade to Fusion](/guides/prepare-fusion-upgrade?step=7) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> The Fusion run error banner on run details now uses the same "Debug on Fusion" menu as the jobs page. <br />
<Lifecycle status="Enhancement" size="70" /> Testing a webhook subscription now triggers a test event and polls for the delivery receipt, showing the actual HTTP status code and error from the endpoint response. <br />
<Lifecycle status="Enhancement" size="70" /> The receipt endpoint for webhook events now returns a `404` response when a delivery record has not yet been written, rather than returning an incomplete record. <br />
<Lifecycle status="Enhancement" size="70" /> Webhook delivery history records now show `504` as the HTTP status code when a delivery timed out (previously stored as `0`). <br />
<Lifecycle status="Enhancement" size="70" /> The note that event history is limited to the past 7 days now appears on the webhook events history page unconditionally. <br />
<Lifecycle status="Enhancement" size="70" /> A migration banner now appears on the Slack notification settings page when you have notification settings from a previous Slack integration that can be migrated in one click. <br />
<Lifecycle status="Enhancement" size="70" /> The OAuth consent page now displays a "View account information" (`account:read`) scope option granting view-only access to account details. <br />
<Lifecycle status="Enhancement" size="70" /> A new `pending` connectivity status is available for PrivateLink endpoints, in addition to the existing `success` and `failed` states. <br />
<Lifecycle status="Enhancement" size="70" /> The member permission set now includes `fusion_readiness_read`, allowing members to view Fusion readiness information without requiring elevated permissions. <br />
<Lifecycle status="Fix" size="70" /> Azure OpenAI deployments now correctly pass the deployment name as the `model` field when using the Responses API.

### April 15, 2026

<Lifecycle status="Enhancement" size="70" /> The `AccountSearchQueryFilter` input now accepts `health` and `runStatus` filter arrays with OR logic for multiple values within each filter. <br />
<Lifecycle status="Enhancement" size="70" /> Healthy dbt resources now rank higher in search results than resources with unresolved issues when text relevance is otherwise equivalent. <br />
<Lifecycle status="Enhancement" size="70" /> Press `Ctrl+\` to open the Commands tab directly from the editor. <br />
<Lifecycle status="Enhancement" size="70" /> Fusion eligibility reason messages are rewritten to be shorter and more actionable. <br />
<Lifecycle status="Enhancement" size="70" /> Clicking "Run once on Fusion" on a job now opens a confirmation modal before triggering the run. <br />
<Lifecycle status="Enhancement" size="70" /> Run steps that execute `dbt ls` or `dbt list` now show node results with a no-op status instead of "unknown." <br />
<Lifecycle status="Enhancement" size="70" /> The account-level setting to enable Fusion readiness and upgrade features now has an updated label and a more detailed description. <br />
<Lifecycle status="Enhancement" size="70" /> The "Debug on Fusion" button on failed Fusion run banners now sets your personal `DBT_DEVELOP_CORE_VERSION` override to `latest-fusion` before opening Studio IDE. <br />
<Lifecycle status="Enhancement" size="70" /> The "Status" column in the private endpoints list is renamed to "Connectivity status" for clarity. <br />
<Lifecycle status="Enhancement" size="70" /> When pasting Snowflake Private Link configuration output, the validation error now lists the specific required fields that are missing. <br />
<Lifecycle status="Enhancement" size="70" /> Environment credential and connection forms that accept YAML Extended Attributes now correctly validate arrays as values. <br />
<Lifecycle status="Enhancement" size="70" /> When creating a Snowflake PrivateLink connection, you can now supply an optional `interface_endpoint_id` to attach a new profile to an existing interface endpoint. <br />
<Lifecycle status="Fix" size="70" /> Files inside a newly created folder are now listed individually in the Git Controls panel instead of as a single unexpanded entry. <br />
<Lifecycle status="Fix" size="70" /> Files created inside a new folder now always display the parent folder name as a hint in the Git Controls panel.

### April 8, 2026

<Lifecycle status="New" size="70" /> The dbt MCP remote server now includes Admin API tools for listing, inspecting, triggering, canceling, and retrying dbt jobs and runs from connected AI assistants. <br />
<Lifecycle status="New" size="70" /> A new OAuth consent page lets you authorize third-party applications to access your dbt platform account with selected permissions and projects. <br />
<Lifecycle status="New" size="70" /> Test and snapshot detail pages now include a Performance tab showing cost insights data matching the existing model performance experience. <br />
<Lifecycle status="Enhancement" size="70" /> The Studio DevAgent now selects the lightest appropriate validation check after each change instead of always running a full `dbt compile`. <br />
<Lifecycle status="Enhancement" size="70" /> The simple defer-to-production toggle has been replaced with a popover that lets you choose between your development environment, dbt's default deferral behavior, or a specific custom environment. <br />
<Lifecycle status="Enhancement" size="70" /> An "Edit / Revert" action has been added to the version override option in the environment popover. <br />
<Lifecycle status="Enhancement" size="70" /> The active-file context pill has been moved to above the text input for greater visibility. <br />
<Lifecycle status="Enhancement" size="70" /> State-Aware Orchestration (SAO) test runs that reuse prior results now display with a "reused" icon in the DAG test status lens. <br />
<Lifecycle status="Enhancement" size="70" /> The `function` resource type is now recognized in dbt selectors and the resource node type map. <br />
<Lifecycle status="Enhancement" size="70" /> A "Fusion status" column is now available in your account insights table showing each project's readiness and migration progress. <br />
<Lifecycle status="Fix" size="70" /> In Fusion mode, the parse status badge no longer switches to an error state solely because diagnostic errors are present. <br />
<Lifecycle status="Fix" size="70" /> "Remote rejected authentication" is now recognized as a non-retryable git authentication error, giving a clear failure message instead of a misleading retry loop. <br />
<Lifecycle status="Fix" size="70" /> Models with a `last_run_status` of `reused` are no longer marked stale even when their last execution date exceeds 30 days. <br />
<Lifecycle status="Fix" size="70" /> Fixed a bug where resource counts on the project landing page were not updated when switching environments.

### April 1, 2026

<Lifecycle status="New" size="70" /> Studio IDE now supports fuzzy file path search that finds files using partial name matching with glob patterns, result limits, and ordered results. <br />
<Lifecycle status="New" size="70" /> A new `/oauth/consent` endpoint enables the Connected Auth OAuth flow supporting user consent decisions, project-level resource boundaries, and authorization code issuance. <br />
<Lifecycle status="Enhancement" size="70" /> The Studio agent now remembers your last-used mode (Ask or Code) across browser sessions. <br />
<Lifecycle status="Enhancement" size="70" /> File search now validates each result against the filesystem before returning matches, excluding deleted but unstaged files. <br />
<Lifecycle status="Enhancement" size="70" /> Removed behavior where the IDE server automatically pulled changes from your primary branch during git status checks. <br />
<Lifecycle status="Enhancement" size="70" /> Teradata has been added to the SQL dialect adapter map, enabling column-level lineage parsing for dbt projects using the Teradata adapter. <br />
<Lifecycle status="Enhancement" size="70" /> Added fields indicating availability of readiness and migration features. <br />
<Lifecycle status="Enhancement" size="70" /> Account feature flag changes now take effect within 60 seconds instead of up to one hour. <br />
<Lifecycle status="Enhancement" size="70" /> Reduced the likelihood of delayed notifications (webhooks, email, Slack, and Teams) in certain third-party/system disruption scenarios. <br />
<Lifecycle status="Fix" size="70" /> The GitHub webhook endpoint now correctly checks for a null webhook secret before attempting to validate the request signature. <br />
<Lifecycle status="Fix" size="70" /> Repository fields for GitHub installation and webhook IDs have been promoted from 32-bit to 64-bit integers to accommodate IDs that exceed the 32-bit integer range. <br />
<Lifecycle status="Behavior change" size="70" /> The Fusion migration checklist and related UI now use the `is_migration_available` field from the Fusion status API instead of the legacy feature flag, so Fusion migration UI is shown only when the backend marks the project as ready. <br />
<Lifecycle status="New" size="70" /> A universal login URL is available at [https://login.dbt.com](https://login.dbt.com) for viewing accounts across instances, refer to [Log in to dbt platform](/docs/platform/about-platform/login) for more information. <br />
<Lifecycle status="Fix" size="70" /> Refreshing the same browser tab now restores your active <Constant name="dev_agent" /> conversation instead of showing the empty state. <br />
<Lifecycle status="Enhancement" size="70" /> The dbt VS Code extension's Get started panel has been redesigned and surfaces the exact next setup step, including a new agentic migration option, refer to [Getting started](/docs/install-dbt-extension#getting-started) for more information. <br />
<Lifecycle status="Beta" size="70" /> [Model query history](/docs/explore/model-query-history) now also supports Databricks and Redshift, refer to [Credential permissions](/docs/explore/model-query-history#credential-permissions) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> [Slack notifications (account-level)](/docs/deploy/job-notifications#slack-notifications-account) and [Microsoft Teams notifications](/docs/deploy/job-notifications#microsoft-teams-notifications) are now generally available. <br />
<Lifecycle status="Enhancement" size="70" /> When using the [dbt autofix](https://github.com/dbt-labs/dbt-autofix) tool in the <Constant name="studio_ide" />, you can now compile your project directly from the results panel after a successful `dbt parse`, refer to [Fix deprecation warnings](/docs/platform/studio-ide/autofix-deprecations) for more information. <br />
<Lifecycle status="Beta" size="70" /> DuckDB is now supported in the <Constant name="fusion_engine" /> CLI for running local dbt projects without a warehouse account, refer to [Connect DuckDB](/docs/local/connect-data-platform/duckdb-setup) for more information. <br />
<Lifecycle status="New" size="70" /> You can now configure Snowflake PrivateLink endpoints directly in <Constant name="dbt_platform" /> in private beta via Account settings → Integrations → Private endpoints, refer to [AWS PrivateLink for Snowflake](/docs/platform/secure/private-connectivity/aws/aws-snowflake?version=1.12) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> You can now use arrays as values for keys in the <Constant name="dbt_platform" /> extended attributes YAML editor, refer to [Extended attributes](/docs/dbt-cloud-environments#extended-attributes) for more information. <br />
<Lifecycle status="Beta" size="70" /> The Redshift adapter now supports a `datasharing` profile credential on the <Constant name="dbt_platform" /> Latest release track enabling cross-database and cross-cluster access, refer to [Redshift setup](/docs/local/connect-data-platform/redshift-setup#datasharing) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> When a connection does not have platform metadata credentials configured yet, the credentials form now renders in edit mode immediately, refer to [Configure the warehouse connection](/docs/explore/external-metadata-ingestion#configure-the-warehouse-connection) for more information. <br />
<Lifecycle status="New" size="70" /> The [dbt Remote dbt MCP server](/docs/dbt-ai/about-mcp?version=2.0) now supports Admin API calls for troubleshooting job-related errors in agents like Claude and Cursor. <br />
<Lifecycle status="New" size="70" /> The [Developer agent](/docs/dbt-ai/developer-agent) is now in beta for writing or refactoring dbt models from natural language and generating documentation, tests, semantic models, and SQL code. <br />
<Lifecycle status="Enhancement" size="70" /> The Studio IDE now validates dbt YAML using <Constant name="fusion" /> aligned JSON Schema from [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema) across all release tracks. <br />
<Lifecycle status="Enhancement" size="70" /> The Studio IDE status bar now offers more control, more detailed information, and quicker access to settings for deferral, dbt version, and project status, refer to the [Studio IDE docs](/docs/platform/studio-ide/ide-user-interface#the-command-and-status-bar) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> In Snowflake Private endpoints, output validation errors now display inline beneath the text area and the Submit request button is disabled when output is invalid.

## March 2026

### March 25, 2026

<Lifecycle status="New" size="70" /> When a run using the dbt Fusion engine fails, a banner now appears on the run details page with options to debug the failure in Studio IDE or with Copilot. <br />
<Lifecycle status="Enhancement" size="70" /> The bottom console pane now opens at a preferred size of 33% of the available space for a more consistent default layout. <br />
<Lifecycle status="Enhancement" size="70" /> File search now reports results incrementally on a per-file basis rather than per-match line, reducing memory pressure. <br />
<Lifecycle status="Enhancement" size="70" /> When Studio IDE applies multi-file edits, it now only updates editor models for files that are already open. <br />
<Lifecycle status="Enhancement" size="70" /> You can now set `fusion_migration_enabled` on a project via the project update API. <br />
<Lifecycle status="Enhancement" size="70" /> The jobs list endpoint now accepts an `is_fusion_ready` boolean query parameter and supports `fusion_readiness` in the `include_related` parameter. <br />
<Lifecycle status="Enhancement" size="70" /> When adding platform metadata credentials for a connection, the credential form is now shown immediately instead of requiring you to click an "Add credentials" button first. <br />
<Lifecycle status="Fix" size="70" /> Fixed a bug where resource counts in the navigation tree were not refreshed when switching environments. <br />
<Lifecycle status="Fix" size="70" /> A new cleanup job detects runs and run steps that have exceeded the maximum allowed duration and marks them as `CANCELLED`. <br />
<Lifecycle status="Fix" size="70" /> The Semantic Layer Gateway now retries the initial connection when a Snowflake warehouse is waking up from auto-suspend instead of failing immediately. <br />
<Lifecycle status="Fix" size="70" /> Fixed an issue where group permission sync could miss updates for groups with many permissions. <br />
<Lifecycle status="Behavior change" size="70" /> Studio IDE now enables Fusion OpenTelemetry (OTel) log rendering for all invocations running on a Fusion core version, removing the previous feature flag requirement.

### March 18, 2026

<Lifecycle status="Enhancement" size="70" /> Studio IDE now reuses its file-search index across searches, so repeated searches return results faster. <br />
<Lifecycle status="Enhancement" size="70" /> Studio IDE debounces rapid file change events and avoids applying stale responses, so Git status badges update more reliably during bulk edits and saves. <br />
<Lifecycle status="Enhancement" size="70" /> The server status popover uses a clearer grouped layout and action buttons to help you troubleshoot development credentials and server health. <br />
<Lifecycle status="Enhancement" size="70" /> Copilot and agents can use a product documentation toolset to answer product and workflow questions more reliably. <br />
<Lifecycle status="Enhancement" size="70" /> You can open Copilot in a dedicated full-screen view for a more focused chat and coding workflow. <br />
<Lifecycle status="Enhancement" size="70" /> Copilot now references your active file by path instead of automatically attaching the file contents, reducing message size. <br />
<Lifecycle status="Enhancement" size="70" /> Copilot can run `dbt-autofix` commands with confirmation and stream the output into chat. <br />
<Lifecycle status="Enhancement" size="70" /> Catalog search now groups non-standard materializations under a single "Custom" filter. <br />
<Lifecycle status="Enhancement" size="70" /> Insights can resolve missing Redshift query IDs from warehouse query history when artifacts do not include them. <br />
<Lifecycle status="Enhancement" size="70" /> If dbt Copilot is temporarily locked for your account, you can still open Copilot from Insights to see lock details. <br />
<Lifecycle status="Enhancement" size="70" /> Run details now include who triggered or canceled a run (user or service token) for auditing run activity. <br />
<Lifecycle status="Enhancement" size="70" /> When an environment uses a custom branch, dbt platform now carries that branch through run triggers, retries, and reruns more consistently. <br />
<Lifecycle status="Enhancement" size="70" /> You can now retrieve Fusion readiness signals for projects, environments, and jobs to support Fusion migration planning. <br />
<Lifecycle status="Enhancement" size="70" /> Orchestration now reads the invocation name from `run_results.json` using `command` when `invocation_command` is missing. <br />
<Lifecycle status="Enhancement" size="70" /> Run step history ingestion now drops invalid events and de-duplicates redundant step-start events before writing step data. <br />
<Lifecycle status="Enhancement" size="70" /> You can now add project descriptions of up to 1,024 characters. <br />
<Lifecycle status="Enhancement" size="70" /> You can now open a connection directly from the connection profile table in a new tab. <br />
<Lifecycle status="Enhancement" size="70" /> You now get more consistent validation and clearer error messages for invalid YAML syntax when editing extended attributes. <br />
<Lifecycle status="Enhancement" size="70" /> Cached query results can now be matched and reused more reliably when your query includes filters. <br />
<Lifecycle status="Fix" size="70" /> Retries now only apply to transient errors during Cloud Config lookups, reducing intermittent failures without added delay for permission or authentication errors. <br />
<Lifecycle status="Fix" size="70" /> If you are already authenticated and land on `/login` with `current_email`, dbt platform now redirects you to `/api/auth/auth-login/` so the email is forwarded during sign in. <br />
<Lifecycle status="Fix" size="70" /> Turning IP restrictions on or off now updates form state correctly so your changes save as expected. <br />
<Lifecycle status="Fix" size="70" /> The audit log date range defaults no longer shift during re-renders, so your filters stay stable while you review results. <br />
<Lifecycle status="Fix" size="70" /> Domain updates during Single Sign-On (SSO) migration no longer rely on mutating existing provider data, improving save reliability. <br />
<Lifecycle status="Fix" size="70" /> If your OpenAI credentials include invalid characters, you now get a clearer error message. <br />
<Lifecycle status="Fix" size="70" /> Encrypted credential fields now stay optional when you edit credentials, reducing unexpected validation failures. <br />
<Lifecycle status="Fix" size="70" /> You now see the correct connection details more consistently when you edit an environment that uses global connections and connection profiles. <br />
<Lifecycle status="Fix" size="70" /> You can now open and review run steps for ingestion-triggered runs. <br />
<Lifecycle status="Fix" size="70" /> Run results no longer populate an error string with `None` when dbt does not provide a message or failure count. <br />
<Lifecycle status="Fix" size="70" /> When Orchestration cannot restore the repository cache because the dbt project is missing or malformed, it now returns an invalid project error. <br />
<Lifecycle status="Fix" size="70" /> Snapshots selected but not executed in multi-step runs now appear with a skipped status. <br />
<Lifecycle status="Fix" size="70" /> Insights now clears the Copilot chat loading state reliably after responses complete or error. <br />
<Lifecycle status="Fix" size="70" /> When you arrive in Insights with a Copilot handoff message, Insights now starts the handoff once and clears stale handoff state when you navigate directly. <br />
<Lifecycle status="Fix" size="70" /> Semantic Layer now derives explicit string conversions from returned result metadata, so categorical dimensions and entities are more consistently typed as strings in Tableau and Power BI queries. <br />
<Lifecycle status="Fix" size="70" /> Cache invalidation no longer fails when an in-memory cache key is already missing. <br />
<Lifecycle status="Fix" size="70" /> Semantic Layer now requests and caches run details scoped to your account, reducing incorrect run validation results. <br />
<Lifecycle status="Fix" size="70" /> If you cancel a request while an agent is running tools, the agent now recovers cleanly instead of getting stuck on incomplete tool-call history. <br />
<Lifecycle status="Fix" size="70" /> Studio IDE now removes the accept and reject overlay when you leave an AI diff view to prevent stale UI controls. <br />
<Lifecycle status="Behavior change" size="70" /> Studio IDE now uses VS Code Quick Open for file search (`Cmd+P` or `Ctrl+P`) and the VS Code Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) instead of the legacy Studio dialogs. <br />
<Lifecycle status="Behavior change" size="70" /> Tableau and Power BI queries can no longer request `MIN()` or `MAX()` for a metric or dimension (except time min-max queries), and you now receive a clear error if you attempt it.

### March 11, 2026

<Lifecycle status="New" size="70" /> You can request a new Snowflake private endpoint from account settings by pasting the output from `SELECT SYSTEM$GET_PRIVATELINK_CONFIG();` and track request status in the private endpoints table. <br />
<Lifecycle status="Enhancement" size="70" /> You can now retry failed runs as long as your environment is on dbt Core version `1.6` or higher or dbt Fusion. <br />
<Lifecycle status="Enhancement" size="70" /> Slack channel discovery and notifications now retry on Slack rate limits to reduce dropped messages during busy periods. <br />
<Lifecycle status="Enhancement" size="70" /> OpenAPI schemas now mark 64-bit integer fields as `format: int64` to improve generated client types. <br />
<Lifecycle status="Enhancement" size="70" /> Credentials OpenAPI docs now use a `type` discriminator to improve code generation and request validation. <br />
<Lifecycle status="Fix" size="70" /> Searching jobs with numeric terms no longer triggers API validation errors. <br />
<Lifecycle status="Fix" size="70" /> When dbt platform cannot fetch a publication artifact for an upstream project declared in `dependencies.yml`, you now see which project is missing an artifact and guidance to run the upstream environment. <br />
<Lifecycle status="Fix" size="70" /> Microsoft Teams notifications now use the correct trigger event type for each notification. <br />
<Lifecycle status="Fix" size="70" /> You now receive more accurate errors from permission checks, with underlying service errors surfacing instead of being reported as authorization failures. <br />
<Lifecycle status="Fix" size="70" /> Creating a private endpoint now returns a `400` error with a clear message when `snowflake_output` is malformed or not valid JSON. <br />
<Lifecycle status="Behavior change" size="70" /> You now see an informational notice instead of the Model timing chart for dbt Fusion runs because dbt Fusion handles threading differently. <br />
<Lifecycle status="Behavior change" size="70" /> SCIM schema discovery now reports `id` fields as strings for users and groups.

### March 4, 2026

<Lifecycle status="Enhancement" size="70" /> Job settings now describe state-aware orchestration (SAO) as only building models when data or code changes are detected. <br />
<Lifecycle status="Enhancement" size="70" /> Fusion cost optimization settings now link to account-level Cost Insights settings and setup documentation. <br />
<Lifecycle status="Enhancement" size="70" /> When you enable manual updates for SCIM, dbt platform now asks you to confirm to avoid accidentally allowing changes outside your identity provider. <br />
<Lifecycle status="Enhancement" size="70" /> When a SCIM-provisioned user with an expired invite is added to a SCIM-managed group, the invite is now automatically resent during group assignment. <br />
<Lifecycle status="Enhancement" size="70" /> Projects with missing names now show as "Untitled Project," and you can save project descriptions as empty. <br />
<Lifecycle status="Enhancement" size="70" /> Studio IDE no longer shows "Open Settings" buttons in editor notifications because Studio IDE does not expose VS Code settings. <br />
<Lifecycle status="Fix" size="70" /> Catalog no longer gets stuck loading the file tree on initial page load. <br />
<Lifecycle status="Fix" size="70" /> Trust signals now suppress less-severe upstream-source issues when a more severe issue is present. <br />
<Lifecycle status="Fix" size="70" /> When dbt platform cannot decrypt a deploy key, you now get a clearer failure instead of a generic git credentials error. <br />
<Lifecycle status="Fix" size="70" /> If authentication fails when you connect to the Language Server Protocol (LSP) WebSocket, the connection now closes cleanly instead of failing with an internal server error. <br />
<Lifecycle status="Fix" size="70" /> Reduced environment setup timeouts and resolved intermittent authentication failures during busy periods. <br />
<Lifecycle status="Fix" size="70" /> If your development connection credentials are invalid, you now see a clearer error message. <br />
<Lifecycle status="Behavior change" size="70" /> dbt platform now treats `versionless` as deprecated and updates existing environments and jobs to use `latest`. <br />
<Lifecycle status="Behavior change" size="70" /> If you send events that include a `run_id`, you must also provide an `account_identifier`; if `account_identifier` is missing, the event fails instead of falling back to a `run_id`-only lookup. <br />
<Lifecycle status="Enhancement" size="70" /> The environment [Connection profiles](/docs/platform/about-profiles#environment-profiles-table) page has been updated with a clickable profile name button, connection column links, and a swap icon for changing assigned profiles, refer to [About profiles](/docs/platform/about-profiles) for more information. <br />
<Lifecycle status="Beta" size="70" /> Apache Spark is now supported in the <Constant name="fusion_engine" /> CLI, refer to [Connect Apache Spark to Fusion](/docs/local/connect-data-platform/spark-setup) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> [Cost Insights](/docs/explore/cost-insights) charts now include an Assets filter (Models / Tests / All) on the Cost, Usage, Query run time, and Builds tabs, refer to [Explore cost data](/docs/explore/explore-cost-data) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> [Deferral](/reference/node-selection/defer) now supports [user-defined functions (UDFs)](/docs/build/udfs), allowing models that depend on UDFs to run without first building those UDFs in your current target. <br />
<Lifecycle status="Fix" size="70" /> Status messages that exceed the 1024 character limit are now automatically truncated to prevent validation errors and run timeouts. <br />
<Lifecycle status="Fix" size="70" /> Resolved an issue where [retrying failed runs](/docs/deploy/retry-jobs) triggered from Git tags would use the wrong commit instead of the original tagged commit. <br />
<Lifecycle status="New" size="70" /> The [dbt MCP server](/docs/dbt-ai/about-mcp?version=2.0#product-docs) now includes product docs tools (`search_product_docs` and `get_product_doc_pages`) that let your AI assistant search and fetch pages from docs.getdbt.com in real time, refer to [the dbt MCP repo](https://github.com/dbt-labs/dbt-mcp?tab=readme-ov-file#product-docs) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> The Model Timing tab displays an informative banner for <Constant name="fusion_engine" /> runs instead of the timing chart explaining that model timing is not yet available for Fusion runs. <br />
<Lifecycle status="Behavior change" size="70" /> [Snowflake plans to increase](https://docs.snowflake.com/en/release-notes/bcr-bundles/un-bundled/bcr-2118) the default column size for string and binary data types in May 2026, and `dbt-snowflake` versions below v1.10.6 may fail to build certain incremental models, refer to [Assess impact and required actions](/reference/resource-configs/snowflake-configs#assess-impact-and-required-actions) for more information. <br />
<Lifecycle status="New" size="70" /> The new <Constant name="semantic_layer"/> YAML specification is now available on the <Constant name="dbt_platform" /> Latest release track, refer to [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec) for more information. <br />
<Lifecycle status="Behavior change" size="70" /> New projects in trial, starter, or Enterprise accounts now default to Fusion Latest for all new environments with a supported adapter, refer to [environment settings](/docs/dbt-cloud-environments#change-environment-settings) for more information.

## February 2026

### February 25, 2026

<Lifecycle status="New" size="70" /> Saved query definitions (including tags, exports, parameters, and lineage relationships) are now captured during ingestion for Catalog lineage and governance workflows. <br />
<Lifecycle status="Enhancement" size="70" /> Run step structured logs now show an indicator when system warnings or errors are present. <br />
<Lifecycle status="Enhancement" size="70" /> Account Settings now shows the backend-provided region display name for clearer, more accurate region labeling. <br />
<Lifecycle status="Enhancement" size="70" /> Changes to our UI to improve the experience of managing groups with SCIM enabled. <br />
<Lifecycle status="Enhancement" size="70" /> After a user accepts an invite, the UI now explains that they must log in using SSO to fully redeem the invite. <br />
<Lifecycle status="Enhancement" size="70" /> Studio IDE now catches unexpected render failures with a top-level error boundary and shows Not Found more reliably for unknown in-project routes. <br />
<Lifecycle status="Enhancement" size="70" /> The main navigation trigger area is now a navigation element with improved focus and labeling. <br />
<Lifecycle status="Enhancement" size="70" /> When VS Code search is enabled, Studio IDE avoids unregistering Quick Open and suppresses conflicting command palette shortcuts. <br />
<Lifecycle status="Enhancement" size="70" /> Source freshness Outdated status can now be computed at query time, improving freshness status filtering consistency. <br />
<Lifecycle status="Enhancement" size="70" /> Search results better support column-level navigation, with a clear validation error for very long queries and improved alignment in lineage visuals. <br />
<Lifecycle status="Enhancement" size="70" /> Lineage graph building now includes cross-project dependencies and supports function nodes as first-class lineage entities. <br />
<Lifecycle status="Enhancement" size="70" /> Projects APIs now explicitly support DELETE with stricter permission checks. <br />
<Lifecycle status="Behavior change" size="70" /> Webhook payloads now include `runFinishedAt` only for completed events and `runErroredAt` only for errored events, with run status normalized from Cancelled to Canceled. <br />
<Lifecycle status="Behavior change" size="70" /> Source freshness expiration windows can optionally derive from each source's freshness criteria rather than a fixed window. <br />
<Lifecycle status="Behavior change" size="70" /> For very large `manifest.json` files, ingestion may strip sources above a configurable threshold to prevent out of memory failures. <br />
<Lifecycle status="Behavior change" size="70" /> Deprecated settings `project_storage_bucket_name` and `project_storage_object_prefix` have been removed; migrate to `object_storage_bucket_name` and `object_storage_object_prefix`.

### February 18, 2026

<Lifecycle status="New" size="70" /> Cost Insights shows estimated warehouse compute costs and run times for your dbt projects and models in private beta, refer to your account manager to request access. <br />
<Lifecycle status="Enhancement" size="70" /> Studio IDE can pause the Language Server Protocol (LSP) in background tabs and resume on return to improve stability when the editor is open in more than one tab. <br />
<Lifecycle status="Enhancement" size="70" /> Added a VS Code-style header showing a dbt badge and current project name, with an option to hide surrounding chrome for more editor space. <br />
<Lifecycle status="Enhancement" size="70" /> Surfaces more actionable filesystem errors (for example, name too long and file-is-a-directory) instead of generic failures. <br />
<Lifecycle status="Enhancement" size="70" /> Added a Copy Relative Path action that respects `dbt_project_subdirectory` for quicker navigation and sharing. <br />
<Lifecycle status="Enhancement" size="70" /> Improved user-facing errors for lineage failures including server errors and cases where upstream returns HTML instead of JSON. <br />
<Lifecycle status="Enhancement" size="70" /> Improved private endpoint filtering by adapter type and updated Studio IDE to use the correct version 3 private endpoints endpoint. <br />
<Lifecycle status="Enhancement" size="70" /> Improved CSV upload progress, resume behavior, and common error handling during Add Sources. <br />
<Lifecycle status="Enhancement" size="70" /> Improved DAG performance by rendering only visible elements and improving layout for disconnected nodes. <br />
<Lifecycle status="Enhancement" size="70" /> Improved keyboard and hover behavior in the search dropdown and avoids showing stale results while searches are loading. <br />
<Lifecycle status="Enhancement" size="70" /> Clearer invite status (invitation sent and invitation accepted) now supports accepted, login pending for SSO. <br />
<Lifecycle status="Enhancement" size="70" /> The unpaid billing banner is no longer feature-flagged and will display when applicable. <br />
<Lifecycle status="Enhancement" size="70" /> Bug fixes and improvements related to managed invites for easier processing. <br />
<Lifecycle status="Enhancement" size="70" /> Added Server-Sent Events (SSE) streaming control so clients can choose chunk streaming or message streaming. <br />
<Lifecycle status="Enhancement" size="70" /> Improved responsiveness for AI Similar Models and Similar Sources requests by enforcing tighter embedding and database timeouts. <br />
<Lifecycle status="Enhancement" size="70" /> Categorized OpenAI failures with BYOK awareness so BYOK failures return the expected 424-class behavior instead of generic 500-series errors. <br />
<Lifecycle status="Enhancement" size="70" /> Updated dbt MCP tooling including adding `get_all_macros` and improving error categorization for more accurate responses. <br />
<Lifecycle status="Fix" size="70" /> Ensures bulk edits stay in sync after server-side edits to prevent stale content from overwriting changes. <br />
<Lifecycle status="Fix" size="70" /> Fixes preview and match highlighting assembly so match ranges align correctly in multi-line previews. <br />
<Lifecycle status="Fix" size="70" /> Shows a proper error layout and notification on unrecoverable initialization failures. <br />
<Lifecycle status="Fix" size="70" /> Prevents incorrect tab closing after uploads complete and avoids showing the floating node panel when not on a file tab. <br />
<Lifecycle status="Fix" size="70" /> Fixes lineage resolution for public model parents when the producer model lives in a non-default environment. <br />
<Lifecycle status="Fix" size="70" /> Fixes an OpenAI connection pool leak that could lead to out-of-memory (OOM) conditions under sustained load. <br />
<Lifecycle status="Fix" size="70" /> Reduces intermittent failures when attaching related models by increasing internal timeouts for related-model fetching. <br />
<Lifecycle status="Behavior change" size="70" /> Prevents rename and delete operations on the repository root and shows clearer warnings. <br />
<Lifecycle status="Behavior change" size="70" /> Improves dbt command log streaming reliability by resuming from the last known CLI event offset. <br />
<Lifecycle status="Behavior change" size="70" /> Job Admin now includes `profiles_write`, which can change what Job Admin users can do where Profiles are enabled. <br />
<Lifecycle status="Behavior change" size="70" /> Version 3 Private Endpoints query parameter `name_search` is renamed to `search`, and search matches endpoint name and endpoint value. <br />
<Lifecycle status="Behavior change" size="70" /> Postgres connection validation now requires a non-empty database name. <br />
<Lifecycle status="Behavior change" size="70" /> Prevents associating the same active credentials object to multiple users, returning a conflict instead of silently duplicating associations. <br />
<Lifecycle status="Behavior change" size="70" /> GitHub shared webhooks now accept repository URLs using https, git, and SSH formats. <br />
<Lifecycle status="Behavior change" size="70" /> Slack linking and notification settings are more strictly gated by the relevant permissions. <br />
<Lifecycle status="Behavior change" size="70" /> Slack integration listing now uses job notifications read permission, reducing incorrect permission-denied scenarios. <br />
<Lifecycle status="Behavior change" size="70" /> Reduced default timeouts from 60 seconds to 5 seconds for Cloud Config and Cloud Artifact calls, causing requests to fail faster in high-latency environments unless overridden. <br />
<Lifecycle status="Behavior change" size="70" /> Corrects the OTel log payload field name to `additional_message` (from the misspelled `addtional_message`), which may require updates to downstream parsing.

### February 11, 2026

<Lifecycle status="Enhancement" size="70" /> Improved model graph layout performance to reduce load time in larger projects. <br />
<Lifecycle status="Enhancement" size="70" /> Similar Models lookup now uses an optimized vector search strategy to reduce timeouts on large projects. <br />
<Lifecycle status="Enhancement" size="70" /> When your dbt project is in a subdirectory, the project root is highlighted in the Catalog file tree. <br />
<Lifecycle status="Enhancement" size="70" /> Rename and delete actions now use native editor behaviors when using the Catalog file tree. <br />
<Lifecycle status="Enhancement" size="70" /> Formatting updates now apply directly to the active editor buffer to reduce prompts and inconsistent results. <br />
<Lifecycle status="Enhancement" size="70" /> Code generation no longer creates a temporary file in your repository during generation. <br />
<Lifecycle status="Enhancement" size="70" /> Environment settings now prevent saving a Fusion dbt version with an incompatible connection and surface field level validation errors. <br />
<Lifecycle status="Enhancement" size="70" /> When setting up a new connection, Fusion eligible adapters now default to the latest Fusion version to reduce misconfiguration. <br />
<Lifecycle status="Enhancement" size="70" /> Private Endpoints can be sorted by status and connections, and endpoint details now show associated connections and environments. <br />
<Lifecycle status="Enhancement" size="70" /> Invocation event streaming is more reliable for long running jobs by deriving totals from the latest stream event identifier. <br />
<Lifecycle status="Enhancement" size="70" /> Log streaming now cleans up Redis keys after a stream completes, reducing stale keys and Redis memory pressure for high volume runs. <br />
<Lifecycle status="Fix" size="70" /> When users hit the usage limit, dbt disables Copilot and shows a clear message including the reset date when available. <br />
<Lifecycle status="Fix" size="70" /> Fixed duplicate Git status decorations in the file tree that could cause visual issues and performance impact. <br />
<Lifecycle status="Fix" size="70" /> Studio IDE no longer runs an automatic pull on the primary branch to reduce unexpected changes during development. <br />
<Lifecycle status="Fix" size="70" /> File operations now return structured validation errors and explicitly reject names that exceed operating system limits. <br />
<Lifecycle status="Fix" size="70" /> Command logs for the dbt Cloud CLI are refreshed and finalized more reliably. <br />
<Lifecycle status="Fix" size="70" /> Scheduler triggered runs now include account context, improving run attribution and preventing some downstream triggers from running without proper context. <br />
<Lifecycle status="Fix" size="70" /> Exposure generated events now validate that account identifiers are numeric before triggering follow on automation. <br />
<Lifecycle status="Fix" size="70" /> Webhook payloads now include consistent completion and error timestamps, and canceled runs include a canceled timestamp and normalized status. <br />
<Lifecycle status="Fix" size="70" /> When both failure and completion triggers are configured, errored runs may generate two webhook deliveries to match legacy behavior. <br />
<Lifecycle status="Fix" size="70" /> Ingestion now accepts the `functions` section to prevent parse failures on newer manifest schemas. <br />
<Lifecycle status="Fix" size="70" /> Macro metadata persistence now uses more consistent UTC timestamps and improves argument comparison to reduce noisy or incorrect macro updates. <br />
<Lifecycle status="Behavior change" size="70" /> Profiles API responses no longer include credential configuration and extended attributes; use the appropriate credentials and configuration endpoints instead. <br />
<Lifecycle status="Behavior change" size="70" /> Account Connections list supports filtering by Private Endpoint identifier for easier management. <br />
<Lifecycle status="Behavior change" size="70" /> Private Endpoints list now supports ordering by endpoint state and connection count. <br />
<Lifecycle status="Behavior change" size="70" /> User licenses now include read access for Private Link resources, which may change who can view Private Link related settings. <br />
<Lifecycle status="Behavior change" size="70" /> Generated metrics are now written directly into the active model file instead of using an accept and reject diff flow.

### February 4, 2026

<Lifecycle status="New" size="70" /> Added a link that opens Copilot from the console toolbar so you can use Copilot to read files and list directories for better context. <br />
<Lifecycle status="New" size="70" /> Added a command to copy a file path relative to your dbt project subdirectory for easier sharing in runbooks and support tickets. <br />
<Lifecycle status="Enhancement" size="70" /> Improved Fusion setup by showing "Fusion compatible" indicators during connection setup. <br />
<Lifecycle status="Enhancement" size="70" /> When Compare Changes subqueries fail, the experience now surfaces a partial success state with expandable warning details. <br />
<Lifecycle status="Enhancement" size="70" /> Improved log usability during in-progress runs by preserving text selection while logs auto-refresh and rerender. <br />
<Lifecycle status="Enhancement" size="70" /> Added server-side search and clearer loading and empty states to the job picker for job-completion triggers. <br />
<Lifecycle status="Enhancement" size="70" /> Improved artifact handling for job documentation and run artifacts by strengthening HTML detection and returning clearer `Content-Type` and download filenames. <br />
<Lifecycle status="Enhancement" size="70" /> Improved Private Endpoints API v3 list behavior with validated query parameters, filtering, limit and offset pagination, and `connection_count` in responses. <br />
<Lifecycle status="Enhancement" size="70" /> Improved formatting reliability by consistently using the active editor content and a stable repo-relative path when invoking formatting. <br />
<Lifecycle status="Enhancement" size="70" /> Reduced errors when working with non-file tabs and improved robustness around tab-close and Git checkout flows. <br />
<Lifecycle status="Enhancement" size="70" /> Improved embedded panel sizing to reduce clipping and scrolling issues in the sidebar. <br />
<Lifecycle status="Enhancement" size="70" /> Improved Fusion banners and prompts by checking project eligibility via a Fusion status endpoint to reduce confusing prompts for ineligible projects. <br />
<Lifecycle status="Enhancement" size="70" /> Improved cross-project lineage ("public ancestors") computation to better match expected external lineage boundaries in dbt Mesh experiences. <br />
<Lifecycle status="Enhancement" size="70" /> Standardized Copilot Agent requests to the API and included active tab content as context to improve reliability of agent runs and handoff. <br />
<Lifecycle status="Fix" size="70" /> Improved webhook subscription editing reliability with asynchronous data and fixed a multiselect focus issue that could cause accidental option selection. <br />
<Lifecycle status="Fix" size="70" /> Fixed HTML email markup that could break rendering for run warning notifications. <br />
<Lifecycle status="Fix" size="70" /> Profile create and view routes now live under `/dashboard/:accountId/projects/:projectId/profiles/...`, which may affect bookmarks and direct links. <br />
<Lifecycle status="Fix" size="70" /> Removed hidden background commands from command history to reduce noise for users. <br />
<Lifecycle status="Fix" size="70" /> Improved robustness of inline compile and show output attachment, including cases with tricky quoting and newlines. <br />
<Lifecycle status="Fix" size="70" /> Fixed log download behavior so downloads correctly serve either the active `dbt.log` or the finalized compressed log. <br />
<Lifecycle status="Fix" size="70" /> Fixed edge cases where gzipped artifacts could fail to upload due to upload stream handling. <br />
<Lifecycle status="Fix" size="70" /> Reduced noisy disconnect and cleanup errors when multiple websocket connections and processes map to the same invocation. <br />
<Lifecycle status="Fix" size="70" /> Fixed search result highlighting when the backend returns multiple highlights per field, with compact badges and counts for easier scanning. <br />
<Lifecycle status="Fix" size="70" /> Improved environment-scoped Catalog search filtering by using merged environment identifiers. <br />
<Lifecycle status="Fix" size="70" /> Improved behavior for environments with no public models by returning an empty list instead of falling into follow-on query logic. <br />
<Lifecycle status="Fix" size="70" /> Improved keep-alive behavior so connections shut down cleanly when the client disconnects. <br />
<Lifecycle status="Fix" size="70" /> Prevents failing tool calls by hiding Semantic Layer tools when the Semantic Layer is not available for the user or environment. <br />
<Lifecycle status="Fix" size="70" /> Improved error reporting by walking wrapped exceptions to return the most specific status code and detail available. <br />
<Lifecycle status="Fix" size="70" /> Treats empty tool outputs as valid results (for example, "no matches") to reduce unnecessary "tool call failed" errors. <br />
<Lifecycle status="Behavior change" size="70" /> During connection setup, the default dbt version now only defaults to `latest-fusion` when the selected adapter is Fusion-compatible and the project and account are eligible. <br />
<Lifecycle status="Behavior change" size="70" /> dbt version "allowed version" checks now account for `project_id` across jobs and environments, including API-triggered runs. <br />
<Lifecycle status="Behavior change" size="70" /> Refresh token expiration for connected app OAuth flows increased from 8 hours to 7 days, reducing re-authorization frequency. <br />
<Lifecycle status="Behavior change" size="70" /> File stat responses now return modified time and created time as integer milliseconds since epoch instead of float seconds. <br />
<Lifecycle status="Behavior change" size="70" /> The LSP websocket now supports `defer_env_id` to defer against a specific environment and `no_defer=true` to explicitly disable deferral. <br />
<Lifecycle status="Behavior change" size="70" /> When "defer to production" is turned off, the Studio IDE now passes `no_defer=true` to align editor intelligence with the selected deferral behavior. <br />
<Lifecycle status="Behavior change" size="70" /> The freshness status value `outdated` was removed; unconfigured freshness is now handled explicitly as `unconfigured`. <br />
<Lifecycle status="Behavior change" size="70" /> The rows-per-page selector was removed, and pagination now uses a fixed page size. <br />
<Lifecycle status="Behavior change" size="70" /> Cached nodes are now consistently surfaced as Reused with clearer reasons, and stale outcomes are treated as errors. <br />
<Lifecycle status="New" size="70" /> Advanced CI (dbt compare in orchestration) is now supported in the <Constant name="fusion_engine" />, refer to [Advanced CI](/docs/deploy/advanced-ci) for more information. <br />
<Lifecycle status="Beta" size="70" /> The `dbt-salesforce` adapter available in the <Constant name="fusion_engine" /> CLI is now in beta, refer to [Salesforce Data 360 setup](/docs/fusion/connect-data-platform-fusion/salesforce-data-cloud-setup) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> The Analyst permission now has project-level access to read repositories, refer to [Project access for project permissions](/docs/platform/manage-access/enterprise-permissions#project-access-for-project-permissions) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> After a user accepts an email [invite](/docs/platform/manage-access/invite-users) to access an [SSO-protected](/docs/platform/manage-access/sso-overview) <Constant name="dbt_platform"/> account, the UI now prompts them to log in with SSO to complete the process. <br />
<Lifecycle status="New" size="70" /> [Profiles](/docs/platform/about-profiles) let you define and manage connections, credentials, and attributes for deployment environments at the project level, with automatic creation for existing projects. <br />
<Lifecycle status="New" size="70" /> [Python UDFs](/docs/build/udfs) are now supported and available in <Constant name="fusion_engine" /> when using Snowflake or BigQuery. <br />
<Lifecycle status="Enhancement" size="70" /> Minor enhancements and UI updates to the <Constant name="studio_ide" /> file explorer that replicate the VS Code IDE experience. <br />
<Lifecycle status="Enhancement" size="70" /> Profile creation now displays specific validation error messages instead of generic error text. <br />
<Lifecycle status="Private beta" size="70" /> [Cost Insights](/docs/explore/cost-insights) shows estimated warehouse compute costs and run times for your dbt projects and models, refer to [Set up Cost Insights](/docs/explore/set-up-cost-insights) for more information. <br />
<Lifecycle status="New" size="70" /> The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) now supports [Omni](https://docs.omni.co/integrations/dbt/semantic-layer) as a partner integration, refer to [Available integrations](/docs/platform-integrations/avail-sl-integrations) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> Clarified documentation for cumulative log size limits on run endpoints; when logs exceed the cumulative size limit, dbt omits them and displays a banner, refer to [Run visibility](/docs/deploy/run-visibility#log-size-limits) for more information. <br />
<Lifecycle status="New" size="70" /> The `immutable_where` configuration is now supported for Snowflake dynamic tables, refer to [Snowflake configurations](/reference/resource-configs/snowflake-configs#immutable-where) for more information. <br />
<Lifecycle status="Fix" size="70" /> The user invite details now show more information in invite status, giving admins visibility into users who accepted an invite to an SSO-protected account but haven't yet logged in via SSO. <br />
<Lifecycle status="Enhancement" size="70" /> Improved performance on Runs endpoint for Admin V2 API and run details in dbt platform when connecting with GCP.

## January 2026

### January 28, 2026

<Lifecycle status="New" size="70" /> Use `POST /v1/workspaces/{workspace_id}/upload-source` to create an upload, then `PATCH /v1/workspaces/{workspace_id}/upload-source/{file_id}/process` to stream processing progress (SSE). <br />
<Lifecycle status="Enhancement" size="70" /> Ranking now boosts results by modeling layer, and highlighting is more consistent including support for multiple highlight snippets per field. <br />
<Lifecycle status="Enhancement" size="70" /> The dbt platform now includes a Private Endpoint details view with endpoint properties, connectivity status, and associated projects. <br />
<Lifecycle status="Enhancement" size="70" /> Connection setup and environment creation can now default to `latest-fusion` for eligible projects. <br />
<Lifecycle status="Enhancement" size="70" /> Added a dedicated sidebar search experience. <br />
<Lifecycle status="Enhancement" size="70" /> Upgrade flows can proceed from fixing deprecations into package upgrades in the same guided run. <br />
<Lifecycle status="Enhancement" size="70" /> Fixed multiple layout/styling issues for a more consistent editor experience. <br />
<Lifecycle status="Fix" size="70" /> Improved rendering and cleanup of escape sequences in step logs. <br />
<Lifecycle status="Fix" size="70" /> Freshness status is preserved when a run lacks freshness results but freshness remains configured. <br />
<Lifecycle status="Fix" size="70" /> Ingestion now tolerates missing/null `schema` fields in the manifest to avoid failures. <br />
<Lifecycle status="Fix" size="70" /> Sync skips missing symlink targets instead of failing the whole sync. <br />
<Lifecycle status="Fix" size="70" /> Aborting a command that no longer exists returns a specific "no-command-found" response. <br />
<Lifecycle status="Fix" size="70" /> Malformed inline commands no longer break result processing; `show --inline` with an empty result returns an empty preview table. <br />
<Lifecycle status="Fix" size="70" /> Creating an uploaded-source model with a duplicate name now returns HTTP 409 with an actionable message. <br />
<Lifecycle status="Fix" size="70" /> Uploaded-source processing records failure state instead of deleting the file record, improving retry/resume workflows. <br />
<Lifecycle status="Fix" size="70" /> The invocation status SSE endpoint now correctly awaits the status stream. <br />
<Lifecycle status="Behavior change" size="70" /> `AccountSearchHit.highlight` and `AccountSearchHit.matchedField` are deprecated; `AccountSearchHit.highlights` now supports multiple highlight snippets per field (arrays). <br />
<Lifecycle status="Behavior change" size="70" /> The "Adaptive" job type is deprecated and `last_checked_at` is no longer populated in run responses. <br />
<Lifecycle status="Behavior change" size="70" /> Migrate to the new two-step [upload source](/docs/platform/use-canvas#upload-data-to-canvas) flow.

### January 21, 2026

<Lifecycle status="New" size="70" /> Add resources to favorites and organize your frequently accessed resources in the Catalog navigation. <br />
<Lifecycle status="New" size="70" /> You can now retrieve individual PrivateLink endpoints by ID, enabling better automation and troubleshooting workflows. <br />
<Lifecycle status="Enhancement" size="70" /> Find specific artifacts faster in run history with the new artifacts search box and improved empty states. <br />
<Lifecycle status="Enhancement" size="70" /> The webhook form no longer resets while job options are loading, and server-generated fields now display reliably after creation. <br />
<Lifecycle status="Enhancement" size="70" /> After completing the Fusion onboarding checklist, you can now dismiss the card and it will stay dismissed. <br />
<Lifecycle status="Enhancement" size="70" /> Cross-project lineage is now enabled for all applicable accounts. <br />
<Lifecycle status="Enhancement" size="70" /> Enhanced search scoring and matching provides more accurate results, with better column matching and highlighting for large catalogs. <br />
<Lifecycle status="Enhancement" size="70" /> Column name and description updates now automatically trigger re-indexing, ensuring search results stay current. <br />
<Lifecycle status="Enhancement" size="70" /> Quickly access full search results from the typeahead dropdown with the new footer link. <br />
<Lifecycle status="Enhancement" size="70" /> The environment selector now only shows "Staging" when your account has projects with a staging environment configured. <br />
<Lifecycle status="Enhancement" size="70" /> IDE-related endpoints now return more specific and helpful error messages for common configuration issues and timeouts. <br />
<Lifecycle status="Enhancement" size="70" /> Enhanced command log viewer with improved download capabilities and more consistent error log viewing. <br />
<Lifecycle status="Fix" size="70" /> dbt Copilot generated documentation now correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones. <br />
<Lifecycle status="Fix" size="70" /> Auto-generated exposures now appear correctly in lineage views. <br />
<Lifecycle status="Fix" size="70" /> Search now handles missing connection names gracefully without causing errors. <br />
<Lifecycle status="Fix" size="70" /> Requests with invalid authentication tokens now fail safely with clear error messages. <br />
<Lifecycle status="Fix" size="70" /> Commands that can't be fetched are now properly marked as failed instead of staying in a "running" state. <br />
<Lifecycle status="Fix" size="70" /> Job deferral settings are now validated to ensure the deferring job and environment exist within the same account. <br />
<Lifecycle status="Behavior change" size="70" /> Tables in Account Insights now display 5 rows per page by default (previously 10). <br />
<Lifecycle status="Behavior change" size="70" /> All webhook timestamp fields now use UTC with `Z` suffix and higher precision; missing/invalid timestamps emit `1970-01-01T00:00:00Z` instead of empty strings. <br />
<Lifecycle status="Behavior change" size="70" /> Update webhook consumers that parse status values strictly. <br />
<Lifecycle status="Behavior change" size="70" /> Projects with more than 5,000 exposures will skip exposure ingestion to prevent performance issues.

### January 14, 2026

<Lifecycle status="New" size="70" /> Added an API endpoint to determine whether a project is eligible for Fusion migration. <br />
<Lifecycle status="Enhancement" size="70" /> Agent tool execution errors now return structured responses instead of failing the entire run. <br />
<Lifecycle status="Enhancement" size="70" /> Agent toolsets include additional retrieval and search capabilities for more relevant responses. <br />
<Lifecycle status="Enhancement" size="70" /> Azure OpenAI connection verification now uses GPT-5-compatible parameters for GPT-5 deployments. <br />
<Lifecycle status="Enhancement" size="70" /> Added support for Azure Foundry URLs with automatic endpoint parsing to reduce setup friction. <br />
<Lifecycle status="Enhancement" size="70" /> Build SQL queries against the Semantic Layer without writing SQL code. <br />
<Lifecycle status="Enhancement" size="70" /> Search scoring prioritizes exact and multi-term matches more strongly, with better highlighting and column-description matching. <br />
<Lifecycle status="Enhancement" size="70" /> Search labels are more consistent, and the embedded lineage view loads more responsively. <br />
<Lifecycle status="Enhancement" size="70" /> Studio now loads a single unified IDE package. <br />
<Lifecycle status="Enhancement" size="70" /> Studio now respects `dbt-cloud.defer-env-id` settings when Cloud CLI runtime is supported. <br />
<Lifecycle status="Enhancement" size="70" /> Download and copy behavior for command logs is more consistent, including debug logs. <br />
<Lifecycle status="Enhancement" size="70" /> The IDE now supports multiple explicit edits in one request with safer validation. <br />
<Lifecycle status="Enhancement" size="70" /> Session creation returns clearer error messages and guidance for setup issues. <br />
<Lifecycle status="Enhancement" size="70" /> Settings detail experiences now use an improved drawer-based UI. <br />
<Lifecycle status="Enhancement" size="70" /> Profile creation now handles dependencies and failures more gracefully. <br />
<Lifecycle status="Enhancement" size="70" /> Logs for in-progress runs are also limited by memory usage, in addition to the existing 1,000-line limit. <br />
<Lifecycle status="Fix" size="70" /> The Profiles API now allows unsetting extended attributes by setting `extended_attributes_id` to null. <br />
<Lifecycle status="Fix" size="70" /> Recently viewed entries now update atomically and retain the 5 most recent items. <br />
<Lifecycle status="Fix" size="70" /> Debug logs for completed runs now consistently fetch only the tail of the log. <br />
<Lifecycle status="Fix" size="70" /> CLI flags to disable caching are now positioned correctly to avoid parsing issues. <br />
<Lifecycle status="Fix" size="70" /> Fixed argument ordering so `--no-defer` is interpreted consistently. <br />
<Lifecycle status="Behavior change" size="70" /> dbt v1.7 is now labeled as end-of-life in version lifecycle messaging.

### January 7, 2026

No changes of note this week.

<Lifecycle status="Enhancement" size="70" /> The `defer-env-id` setting for choosing which deployment environment to defer to is [now available](/docs/platform/about-cloud-develop-defer#defer-environment) in the <Constant name="studio_ide" />. <br />
<Lifecycle status="Beta" size="70" /> The [Analyst agent](/docs/explore/navigate-dbt-insights#dbt-copilot) in dbt <Constant name="insights" /> is now in beta. <br />
<Lifecycle status="Enhancement" size="70" /> The [Studio IDE](/docs/platform/studio-ide/ide-user-interface#search-your-project) now includes search and replace functionality and a command palette for quickly finding and replacing text, navigating files, and running IDE configuration commands. <br />
<Lifecycle status="Enhancement" size="70" /> [State-aware orchestration](/docs/deploy/state-aware-about) now rebuilds models that fail a data test on subsequent runs and detects tables deleted from the warehouse, refer to [Handling deleted tables](/docs/deploy/state-aware-about#handling-deleted-tables) for more information. <br />
<Lifecycle status="Enhancement" size="70" /> [dbt <Constant name="copilot" />](/docs/platform/dbt-copilot) correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones. <br />
<Lifecycle status="Enhancement" size="70" /> The <Constant name="fusion"/> CLI now automatically reads environment variables from a `.env` file in your current working directory, refer to [Install <Constant name="fusion"/> CLI](/docs/local/install-dbt?version=2#get-started#environment-variables) for more information. <br />
<Lifecycle status="New" size="70" /> The new <Constant name="semantic_layer"/> YAML specification creates an open standard for defining metrics and dimensions, with semantic models now embedded within model YAML entries, refer to [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec) for more information. <br />
<Lifecycle status="Fix" size="70" /> Debug logs in the Run summary tab are now properly truncated to improve performance, refer to [Run visibility](/docs/deploy/run-visibility#run-summary-tab) for more information. <br />
<Lifecycle status="New" size="70" /> The [Semantic Layer querying](/docs/explore/navigate-dbt-insights#semantic-layer-querying) within dbt <Constant name="insights" /> is now generally available (GA). <br />
<Lifecycle status="Enhancement" size="70" /> Eligible <Constant name="dbt_platform" /> accounts in the <Constant name="fusion" /> private preview can now use [Exposures](/docs/platform-integrations/downstream-exposures).

## December 2025

### December 24, 2025

<Lifecycle status="New" size="70" /> Analysts can now drop `@path` references in the bundled CLI to stream local files into `/private/v1/agents/run` as auto-rendered text for copilots. <br />
<Lifecycle status="New" size="70" /> Copilot replies now carry inline "Did that answer your question?" buttons for rating answers without leaving Slack. <br />
<Lifecycle status="New" size="70" /> A Databricks history provider and DBU-based cost query now surface daily model cost alongside Snowflake coverage for unified FinOps reporting. <br />
<Lifecycle status="New" size="70" /> The CSV upload endpoint is now generally available. <br />
<Lifecycle status="Enhancement" size="70" /> Attachment workflows now only recommend meaningfully related models. <br />
<Lifecycle status="Enhancement" size="70" /> Settings consolidate SSO + SCIM, add an empty state for auto-generated slugs, and render read-only login URLs. <br />
<Lifecycle status="Enhancement" size="70" /> Token tables gain fixed pagination, inline search, consistent iconography, and clearer deletion warnings. <br />
<Lifecycle status="Enhancement" size="70" /> The v3 API/UI now allow up to 20 scoped environment variables before enforcing limits. <br />
<Lifecycle status="Enhancement" size="70" /> SELECT * RENAME/EXCEPT support now respects each warehouse's syntax using schema metadata, keeping SQL previews and column metadata accurate across Snowflake, Databricks, BigQuery, and Redshift. <br />
<Lifecycle status="Fix" size="70" /> Default values are cached after the first render and stop resetting once the user edits the form, eliminating accidental job-list clearing while tabbing through fields. <br />
<Lifecycle status="Fix" size="70" /> `parentsModels` and `parentsSources` now derive from the manifest's `parents` list, so exposures with mixed upstreams display complete lineage in both the GraphQL API and UI. <br />
<Lifecycle status="Behavior change" size="70" /> All cost management pages and hooks were removed, and platform metadata credentials now only expose catalog ingestion and Cost Insights toggles.

### December 17, 2025

<Lifecycle status="New" size="70" /> A new `/accounts/<id>/feature-licenses` endpoint issues short-lived JWTs that encode entitled features, with service/PAT authentication now checking for an active license before Fusion-enabled workflow runs. <br />
<Lifecycle status="New" size="70" /> Databricks warehouses can register platform metadata credentials (token plus optional catalog) enabling catalog ingestion, metadata sharing, and Cost Insights pipelines. <br />
<Lifecycle status="Enhancement" size="70" /> Settings Projects and Credentials now paginate after 25 rows with search boxes and skeleton states, keeping navigation responsive for large deployments. <br />
<Lifecycle status="Enhancement" size="70" /> Model panels now show materialization type, lineage renders metadata strips only when content exists, and upstream public-model columns load automatically. <br />
<Lifecycle status="Enhancement" size="70" /> Source tiles respect the `meta5161ExpiredUnconfiguredSources` flag and "Open in IDE" links now point directly into dbt Studio. <br />
<Lifecycle status="Enhancement" size="70" /> The Copilot listener now hydrates builder tabs only when a semantic-layer payload arrives, preventing plain-SQL replies from overwriting editor state. <br />
<Lifecycle status="Enhancement" size="70" /> File sync now anchors itself to the invocation directory for more predictable monorepo behavior, with nested `dependencies.yml` files correctly triggering dependency installs. <br />
<Lifecycle status="Enhancement" size="70" /> Outbound calls now persist the exact JSON body in webhook history, making allowlisting and troubleshooting easier. <br />
<Lifecycle status="Enhancement" size="70" /> The file tree now mirrors Cloud VCS statuses (including conflicts) and automatically invalidates caches after `dbt deps`/`dbt clean`. <br />
<Lifecycle status="Enhancement" size="70" /> Command and interactive query logs adopt the new accordion-based viewer, and Autofix sessions in Fusion treat plain `parse` commands as the trigger for deprecation summaries. <br />
<Lifecycle status="Fix" size="70" /> Editing one variable no longer backfills blank cells with previously edited values. <br />
<Lifecycle status="Fix" size="70" /> Job pages once again display "Cost optimization features" whenever Fusion actually runs and gating conditions are met. <br />
<Lifecycle status="Behavior change" size="70" /> Service/PAT calls without an active license now fail authentication, and SSO providers enforce auto-generated slugs. <br />
<Lifecycle status="Behavior change" size="70" /> Every invocation lookup validates the caller's user ID, preventing admins from accidentally reading another developer's runs. <br />
<Lifecycle status="Behavior change" size="70" /> Support impersonation sessions now restrict execution of `show`, `run`, `build`, and `test` commands, and artifacts generated by `dbt show` expire after 15 minutes. <br />
<Lifecycle status="Behavior change" size="70" /> Fusion tracks now treat `dbt compare` as a supported command.

### December 10, 2025

<Lifecycle status="Enhancement" size="70" /> Streaming middleware enforces request-scoped instrumentation across every AI endpoint, offloads warehouse calls via threads, and exposes human-readable tool names. <br />
<Lifecycle status="Enhancement" size="70" /> Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped. <br />
<Lifecycle status="Enhancement" size="70" /> Slack Copilot mentions are now more reliable, with hardened workers, support for CSV attachments, and improved logging. <br />
<Lifecycle status="Enhancement" size="70" /> Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync. <br />
<Lifecycle status="Enhancement" size="70" /> Improved stability and performance for large projects. <br />
<Lifecycle status="Enhancement" size="70" /> For dbt Fusion logging, node start and end times now properly display in command output. <br />
<Lifecycle status="Enhancement" size="70" /> Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps. <br />
<Lifecycle status="Enhancement" size="70" /> Tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking. <br />
<Lifecycle status="Fix" size="70" /> Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier.

### December 3, 2025

<Lifecycle status="New" size="70" /> When deprecations are detected, you now see "Autofix deprecation warnings." <br />
<Lifecycle status="New" size="70" /> After running Autofix, you see a results panel with upgraded packages (with links), packages left unchanged and why, and quick access to `packages.yml`. <br />
<Lifecycle status="Enhancement" size="70" /> Clearer lint/format actions (SQLFluff, Prettier), better empty states, visible Config button when applicable, and simplified logs retrieval for SQL, JSON, YAML, and Markdown workflows. <br />
<Lifecycle status="Enhancement" size="70" /> Upgraded editor for stability with improved container sizing/overflow and minor action-bar refinements. <br />
<Lifecycle status="Fix" size="70" /> Reliability improved by aligning with updated IDE and VS Code command APIs, eliminating intermittent skips. <br />
<Lifecycle status="Behavior change" size="70" /> dbt Core "versionless" renamed to "latest" for consistency across tenants.
