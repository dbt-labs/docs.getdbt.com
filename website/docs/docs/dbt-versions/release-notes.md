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

<Lifecycle status="New" size="75" /> New products and features

<Lifecycle status="Enhancement" size="75" /> Performance improvements and feature enhancements

<Lifecycle status="Fix" size="75" /> Bug and security fixes

<Lifecycle status="Behavior change" size="75" /> A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC) environments.

For <Constant name="fusion_engine" /> updates, refer to the [dbt-fusion changelog](https://github.com/dbt-labs/dbt-fusion/blob/main/CHANGELOG.md).

## May 2026

<Lifecycle status="New" size="75" /> The Fusion + Snowflake connection experience is now generally available on the dbt platform, refer to [Fusion upgrade guides](/guides/prepare-fusion-upgrade?step=1) for more information.

## April 2026

### April 29, 2026

<Lifecycle status="Enhancement" size="75" /> The Studio IDE dev agent can now help you investigate and troubleshoot dbt job and run failures using the `troubleshooting-dbt-job-errors` skill, refer to [Debug job failures](/docs/dbt-ai/developer-agent?version=2.0#debug-job-failures) for more information.

<Lifecycle status="Enhancement" size="75" /> Semantic Layer requests through MCP are now capped at 10 MiB (previously unlimited) to improve infrastructure stability.

<Lifecycle status="Enhancement" size="75" /> The "Debug in Studio" and "Run once on Fusion" menu items are now independently disabled based on your permissions, with tooltips explaining why when unavailable.

<Lifecycle status="Enhancement" size="75" /> When you click "Debug in Studio," dbt platform now automatically sets your user-level `DBT_DEVELOP_CORE_VERSION` environment variable to `latest-fusion` before opening the Studio IDE.

<Lifecycle status="Enhancement" size="75" /> If the preparation step before opening the Studio IDE fails, the button temporarily shows "Debug failed" in a red state for 5 seconds before resetting.

<Lifecycle status="Enhancement" size="75" /> Projects with no jobs configured are now treated as eligible for Fusion, and the upgrade card shows "No jobs configured yet" under job eligibility.

<Lifecycle status="Enhancement" size="75" /> Clicking "Override eligibility status" on the run details page now opens a confirmation pop-up before applying the override.

<Lifecycle status="Enhancement" size="75" /> The review button on the jobs list for jobs with unknown Fusion eligibility is now shown to all users regardless of run write permissions.

<Lifecycle status="Enhancement" size="75" /> The orchestrator now publishes model execution events for grouped models and tests when running with dbt Fusion's OpenTelemetry (OTel) log format.

<Lifecycle status="Enhancement" size="75" /> The run ingestion pipeline now detects and signals when structured dbt logs are present for a step, so logs appear correctly in the dbt platform for runs ingested from external executors.

<Lifecycle status="Enhancement" size="75" /> The Cancel and Save buttons on the create private endpoint page now stick to the bottom of the viewport so they remain accessible when scrolling.

<Lifecycle status="Enhancement" size="75" /> The "Generate docs on run" deprecation notice is now only shown for jobs running on a Fusion dbt version.

<Lifecycle status="Fix" size="75" /> Fixed request errors when using BYOK OpenAI and Azure OpenAI reasoning model endpoints.

<Lifecycle status="Fix" size="75" /> Metric manifest fields `granularity` and `offset_to_grain` now accept arbitrary string values instead of only a fixed enum, so projects using custom granularities such as `fiscal_year` will no longer fail ingestion.

<Lifecycle status="Fix" size="75" /> Tags are now a searchable field in the advanced search panel, using OR logic to return assets matching any of the specified tags.

### April 22, 2026

<Lifecycle status="New" size="75" /> The catalog search sidebar now includes health and last run status filter sections for dbt resources.

<Lifecycle status="New" size="75" /> Tag is now a searchable field in the advanced search side panel with OR-logic filter matching.

<Lifecycle status="Enhancement" size="75" /> Added additional layers of theme preference fallbacks, including the user's OS theme preferences, to avoid incorrect theming when the user-preferences service is slow to respond.

<Lifecycle status="Enhancement" size="75" /> You can now navigate directly to a specific Studio IDE console tab using a `consoleTab` URL query parameter.

<Lifecycle status="Enhancement" size="75" /> After the deprecation autofix workflow completes in Fusion environments, a Compile button now appears in the autofix results panel.

<Lifecycle status="Enhancement" size="75" /> The Fusion eligibility dropdown filter on the jobs list has been replaced with a toggle and help icon that saves its state per-project in your browser.

<Lifecycle status="Enhancement" size="75" /> The single "Run once on Fusion" button has been replaced with a "Debug on Fusion" menu offering "Debug in Studio," "Run once on Fusion," and (when Copilot is enabled) "Debug in Studio with Copilot" options, refer to [Prepare to upgrade to Fusion](/guides/prepare-fusion-upgrade?step=7) for more information.

<Lifecycle status="Enhancement" size="75" /> The Fusion run error banner on run details now uses the same "Debug on Fusion" menu as the jobs page.

<Lifecycle status="Enhancement" size="75" /> Testing a webhook subscription now triggers a test event and polls for the delivery receipt, showing the actual HTTP status code and error from the endpoint response.

<Lifecycle status="Enhancement" size="75" /> The receipt endpoint for webhook events now returns a `404` response when a delivery record has not yet been written, rather than returning an incomplete record.

<Lifecycle status="Enhancement" size="75" /> Webhook delivery history records now show `504` as the HTTP status code when a delivery timed out (previously stored as `0`).

<Lifecycle status="Enhancement" size="75" /> The note that event history is limited to the past 7 days now appears on the webhook events history page unconditionally.

<Lifecycle status="Enhancement" size="75" /> A migration banner now appears on the Slack notification settings page when you have notification settings from a previous Slack integration that can be migrated in one click.

<Lifecycle status="Enhancement" size="75" /> The OAuth consent page now displays a "View account information" (`account:read`) scope option granting view-only access to account details.

<Lifecycle status="Enhancement" size="75" /> A new `pending` connectivity status is available for PrivateLink endpoints, in addition to the existing `success` and `failed` states.

<Lifecycle status="Enhancement" size="75" /> The member permission set now includes `fusion_readiness_read`, allowing members to view Fusion readiness information without requiring elevated permissions.

<Lifecycle status="Fix" size="75" /> Azure OpenAI deployments now correctly pass the deployment name as the `model` field when using the Responses API.

### April 15, 2026

<Lifecycle status="Enhancement" size="75" /> The `AccountSearchQueryFilter` input now accepts `health` and `runStatus` filter arrays with OR logic for multiple values within each filter.

<Lifecycle status="Enhancement" size="75" /> Healthy dbt resources now rank higher in search results than resources with unresolved issues when text relevance is otherwise equivalent.

<Lifecycle status="Enhancement" size="75" /> Press `Ctrl+\`` to open the Commands tab directly from the editor.

<Lifecycle status="Enhancement" size="75" /> Fusion eligibility reason messages are rewritten to be shorter and more actionable.

<Lifecycle status="Enhancement" size="75" /> Clicking "Run once on Fusion" on a job now opens a confirmation modal before triggering the run.

<Lifecycle status="Enhancement" size="75" /> Run steps that execute `dbt ls` or `dbt list` now show node results with a no-op status instead of "unknown."

<Lifecycle status="Enhancement" size="75" /> The account-level setting to enable Fusion readiness and upgrade features now has an updated label and a more detailed description.

<Lifecycle status="Enhancement" size="75" /> The "Debug on Fusion" button on failed Fusion run banners now sets your personal `DBT_DEVELOP_CORE_VERSION` override to `latest-fusion` before opening Studio IDE.

<Lifecycle status="Enhancement" size="75" /> The "Status" column in the private endpoints list is renamed to "Connectivity status" for clarity.

<Lifecycle status="Enhancement" size="75" /> When pasting Snowflake Private Link configuration output, the validation error now lists the specific required fields that are missing.

<Lifecycle status="Enhancement" size="75" /> Environment credential and connection forms that accept YAML Extended Attributes now correctly validate arrays as values.

<Lifecycle status="Enhancement" size="75" /> When creating a Snowflake PrivateLink connection, you can now supply an optional `interface_endpoint_id` to attach a new profile to an existing interface endpoint.

<Lifecycle status="Fix" size="75" /> Files inside a newly created folder are now listed individually in the Git Controls panel instead of as a single unexpanded entry.

<Lifecycle status="Fix" size="75" /> Files created inside a new folder now always display the parent folder name as a hint in the Git Controls panel.

### April 8, 2026

<Lifecycle status="New" size="75" /> The dbt MCP remote server now includes Admin API tools for listing, inspecting, triggering, canceling, and retrying dbt jobs and runs from connected AI assistants.

<Lifecycle status="New" size="75" /> A new OAuth consent page lets you authorize third-party applications to access your dbt platform account with selected permissions and projects.

<Lifecycle status="New" size="75" /> Test and snapshot detail pages now include a Performance tab showing cost insights data matching the existing model performance experience.

<Lifecycle status="Enhancement" size="75" /> The Studio DevAgent now selects the lightest appropriate validation check after each change instead of always running a full `dbt compile`.

<Lifecycle status="Enhancement" size="75" /> The simple defer-to-production toggle has been replaced with a popover that lets you choose between your development environment, dbt's default deferral behavior, or a specific custom environment.

<Lifecycle status="Enhancement" size="75" /> An "Edit / Revert" action has been added to the version override option in the environment popover.

<Lifecycle status="Enhancement" size="75" /> The active-file context pill has been moved to above the text input for greater visibility.

<Lifecycle status="Enhancement" size="75" /> State-Aware Orchestration (SAO) test runs that reuse prior results now display with a "reused" icon in the DAG test status lens.

<Lifecycle status="Enhancement" size="75" /> The `function` resource type is now recognized in dbt selectors and the resource node type map.

<Lifecycle status="Enhancement" size="75" /> A "Fusion status" column is now available in your account insights table showing each project's readiness and migration progress.

<Lifecycle status="Fix" size="75" /> In Fusion mode, the parse status badge no longer switches to an error state solely because diagnostic errors are present.

<Lifecycle status="Fix" size="75" /> "Remote rejected authentication" is now recognized as a non-retryable git authentication error, giving a clear failure message instead of a misleading retry loop.

<Lifecycle status="Fix" size="75" /> Models with a `last_run_status` of `reused` are no longer marked stale even when their last execution date exceeds 30 days.

<Lifecycle status="Fix" size="75" /> Fixed a bug where resource counts on the project landing page were not updated when switching environments.

### April 1, 2026

<Lifecycle status="New" size="75" /> Studio IDE now supports fuzzy file path search that finds files using partial name matching with glob patterns, result limits, and ordered results.

<Lifecycle status="New" size="75" /> A new `/oauth/consent` endpoint enables the Connected Auth OAuth flow supporting user consent decisions, project-level resource boundaries, and authorization code issuance.

<Lifecycle status="Enhancement" size="75" /> The Studio agent now remembers your last-used mode (Ask or Code) across browser sessions.

<Lifecycle status="Enhancement" size="75" /> File search now validates each result against the filesystem before returning matches, excluding deleted but unstaged files.

<Lifecycle status="Enhancement" size="75" /> Removed behavior where the IDE server automatically pulled changes from your primary branch during git status checks.

<Lifecycle status="Enhancement" size="75" /> Teradata has been added to the SQL dialect adapter map, enabling column-level lineage parsing for dbt projects using the Teradata adapter.

<Lifecycle status="Enhancement" size="75" /> Added fields indicating availability of readiness and migration features.

<Lifecycle status="Enhancement" size="75" /> Account feature flag changes now take effect within 60 seconds instead of up to one hour.

<Lifecycle status="Enhancement" size="75" /> Reduced the likelihood of delayed notifications (webhooks, email, Slack, and Teams) in certain third-party/system disruption scenarios.

<Lifecycle status="Fix" size="75" /> The GitHub webhook endpoint now correctly checks for a null webhook secret before attempting to validate the request signature.

<Lifecycle status="Fix" size="75" /> Repository fields for GitHub installation and webhook IDs have been promoted from 32-bit to 64-bit integers to accommodate IDs that exceed the 32-bit integer range.

<Lifecycle status="Behavior change" size="75" /> The Fusion migration checklist and related UI now use the `is_migration_available` field from the Fusion status API instead of the legacy feature flag, so Fusion migration UI is shown only when the backend marks the project as ready.

<Lifecycle status="New" size="75" /> A universal login URL is available at [https://login.dbt.com](https://login.dbt.com) for viewing accounts across instances, refer to [Log in to dbt platform](/docs/platform/about-platform/login) for more information.

<Lifecycle status="Fix" size="75" /> Refreshing the same browser tab now restores your active <Constant name="dev_agent" /> conversation instead of showing the empty state.

<Lifecycle status="Enhancement" size="75" /> The dbt VS Code extension's Get started panel has been redesigned and surfaces the exact next setup step, including a new agentic migration option, refer to [Getting started](/docs/install-dbt-extension#getting-started) for more information.

<Lifecycle status="Beta" size="75" /> [Model query history](/docs/explore/model-query-history) now also supports Databricks and Redshift, refer to [Credential permissions](/docs/explore/model-query-history#credential-permissions) for more information.

<Lifecycle status="Enhancement" size="75" /> [Slack notifications (account-level)](/docs/deploy/job-notifications#slack-notifications-account) and [Microsoft Teams notifications](/docs/deploy/job-notifications#microsoft-teams-notifications) are now generally available.

<Lifecycle status="Enhancement" size="75" /> When using the [dbt autofix](https://github.com/dbt-labs/dbt-autofix) tool in the <Constant name="studio_ide" />, you can now compile your project directly from the results panel after a successful `dbt parse`, refer to [Fix deprecation warnings](/docs/platform/studio-ide/autofix-deprecations) for more information.

<Lifecycle status="Beta" size="75" /> DuckDB is now supported in the <Constant name="fusion_engine" /> CLI for running local dbt projects without a warehouse account, refer to [Connect DuckDB](/docs/local/connect-data-platform/duckdb-setup) for more information.

<Lifecycle status="New" size="75" /> You can now configure Snowflake PrivateLink endpoints directly in <Constant name="dbt_platform" /> in private beta via Account settings → Integrations → Private endpoints, refer to [AWS PrivateLink for Snowflake](/docs/platform/secure/private-connectivity/aws/aws-snowflake?version=1.12) for more information.

<Lifecycle status="Enhancement" size="75" /> You can now use arrays as values for keys in the <Constant name="dbt_platform" /> extended attributes YAML editor, refer to [Extended attributes](/docs/dbt-cloud-environments#extended-attributes) for more information.

<Lifecycle status="Beta" size="75" /> The Redshift adapter now supports a `datasharing` profile credential on the <Constant name="dbt_platform" /> Latest release track enabling cross-database and cross-cluster access, refer to [Redshift setup](/docs/local/connect-data-platform/redshift-setup#datasharing) for more information.

<Lifecycle status="Enhancement" size="75" /> When a connection does not have platform metadata credentials configured yet, the credentials form now renders in edit mode immediately, refer to [Configure the warehouse connection](/docs/explore/external-metadata-ingestion#configure-the-warehouse-connection) for more information.

<Lifecycle status="New" size="75" /> The [dbt Remote dbt MCP server](/docs/dbt-ai/about-mcp?version=2.0) now supports Admin API calls for troubleshooting job-related errors in agents like Claude and Cursor.

<Lifecycle status="New" size="75" /> The [Developer agent](/docs/dbt-ai/developer-agent) is now in beta for writing or refactoring dbt models from natural language and generating documentation, tests, semantic models, and SQL code.

<Lifecycle status="Enhancement" size="75" /> The Studio IDE now validates dbt YAML using <Constant name="fusion" /> aligned JSON Schema from [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema) across all release tracks.

<Lifecycle status="Enhancement" size="75" /> The Studio IDE status bar now offers more control, more detailed information, and quicker access to settings for deferral, dbt version, and project status, refer to the [Studio IDE docs](/docs/platform/studio-ide/ide-user-interface#the-command-and-status-bar) for more information.

<Lifecycle status="Enhancement" size="75" /> In Snowflake Private endpoints, output validation errors now display inline beneath the text area and the Submit request button is disabled when output is invalid.

## March 2026

### March 25, 2026

<Lifecycle status="New" size="75" /> When a run using the dbt Fusion engine fails, a banner now appears on the run details page with options to debug the failure in Studio IDE or with Copilot.

<Lifecycle status="Enhancement" size="75" /> The bottom console pane now opens at a preferred size of 33% of the available space for a more consistent default layout.

<Lifecycle status="Enhancement" size="75" /> File search now reports results incrementally on a per-file basis rather than per-match line, reducing memory pressure.

<Lifecycle status="Enhancement" size="75" /> When Studio IDE applies multi-file edits, it now only updates editor models for files that are already open.

<Lifecycle status="Enhancement" size="75" /> You can now set `fusion_migration_enabled` on a project via the project update API.

<Lifecycle status="Enhancement" size="75" /> The jobs list endpoint now accepts an `is_fusion_ready` boolean query parameter and supports `fusion_readiness` in the `include_related` parameter.

<Lifecycle status="Enhancement" size="75" /> When adding platform metadata credentials for a connection, the credential form is now shown immediately instead of requiring you to click an "Add credentials" button first.

<Lifecycle status="Fix" size="75" /> Fixed a bug where resource counts in the navigation tree were not refreshed when switching environments.

<Lifecycle status="Fix" size="75" /> A new cleanup job detects runs and run steps that have exceeded the maximum allowed duration and marks them as `CANCELLED`.

<Lifecycle status="Fix" size="75" /> The Semantic Layer Gateway now retries the initial connection when a Snowflake warehouse is waking up from auto-suspend instead of failing immediately.

<Lifecycle status="Fix" size="75" /> Fixed an issue where group permission sync could miss updates for groups with many permissions.

<Lifecycle status="Behavior change" size="75" /> Studio IDE now enables Fusion OpenTelemetry (OTel) log rendering for all invocations running on a Fusion core version, removing the previous feature flag requirement.

### March 18, 2026

<Lifecycle status="Enhancement" size="75" /> Studio IDE now reuses its file-search index across searches, so repeated searches return results faster.

<Lifecycle status="Enhancement" size="75" /> Studio IDE debounces rapid file change events and avoids applying stale responses, so Git status badges update more reliably during bulk edits and saves.

<Lifecycle status="Enhancement" size="75" /> The server status popover uses a clearer grouped layout and action buttons to help you troubleshoot development credentials and server health.

<Lifecycle status="Enhancement" size="75" /> Copilot and agents can use a product documentation toolset to answer product and workflow questions more reliably.

<Lifecycle status="Enhancement" size="75" /> You can open Copilot in a dedicated full-screen view for a more focused chat and coding workflow.

<Lifecycle status="Enhancement" size="75" /> Copilot now references your active file by path instead of automatically attaching the file contents, reducing message size.

<Lifecycle status="Enhancement" size="75" /> Copilot can run `dbt-autofix` commands with confirmation and stream the output into chat.

<Lifecycle status="Enhancement" size="75" /> Catalog search now groups non-standard materializations under a single "Custom" filter.

<Lifecycle status="Enhancement" size="75" /> Insights can resolve missing Redshift query IDs from warehouse query history when artifacts do not include them.

<Lifecycle status="Enhancement" size="75" /> If dbt Copilot is temporarily locked for your account, you can still open Copilot from Insights to see lock details.

<Lifecycle status="Enhancement" size="75" /> Run details now include who triggered or canceled a run (user or service token) for auditing run activity.

<Lifecycle status="Enhancement" size="75" /> When an environment uses a custom branch, dbt platform now carries that branch through run triggers, retries, and reruns more consistently.

<Lifecycle status="Enhancement" size="75" /> You can now retrieve Fusion readiness signals for projects, environments, and jobs to support Fusion migration planning.

<Lifecycle status="Enhancement" size="75" /> Orchestration now reads the invocation name from `run_results.json` using `command` when `invocation_command` is missing.

<Lifecycle status="Enhancement" size="75" /> Run step history ingestion now drops invalid events and de-duplicates redundant step-start events before writing step data.

<Lifecycle status="Enhancement" size="75" /> You can now add project descriptions of up to 1,024 characters.

<Lifecycle status="Enhancement" size="75" /> You can now open a connection directly from the connection profile table in a new tab.

<Lifecycle status="Enhancement" size="75" /> You now get more consistent validation and clearer error messages for invalid YAML syntax when editing extended attributes.

<Lifecycle status="Enhancement" size="75" /> Cached query results can now be matched and reused more reliably when your query includes filters.

<Lifecycle status="Fix" size="75" /> Retries now only apply to transient errors during Cloud Config lookups, reducing intermittent failures without added delay for permission or authentication errors.

<Lifecycle status="Fix" size="75" /> If you are already authenticated and land on `/login` with `current_email`, dbt platform now redirects you to `/api/auth/auth-login/` so the email is forwarded during sign in.

<Lifecycle status="Fix" size="75" /> Turning IP restrictions on or off now updates form state correctly so your changes save as expected.

<Lifecycle status="Fix" size="75" /> The audit log date range defaults no longer shift during re-renders, so your filters stay stable while you review results.

<Lifecycle status="Fix" size="75" /> Domain updates during Single Sign-On (SSO) migration no longer rely on mutating existing provider data, improving save reliability.

<Lifecycle status="Fix" size="75" /> If your OpenAI credentials include invalid characters, you now get a clearer error message.

<Lifecycle status="Fix" size="75" /> Encrypted credential fields now stay optional when you edit credentials, reducing unexpected validation failures.

<Lifecycle status="Fix" size="75" /> You now see the correct connection details more consistently when you edit an environment that uses global connections and connection profiles.

<Lifecycle status="Fix" size="75" /> You can now open and review run steps for ingestion-triggered runs.

<Lifecycle status="Fix" size="75" /> Run results no longer populate an error string with `None` when dbt does not provide a message or failure count.

<Lifecycle status="Fix" size="75" /> When Orchestration cannot restore the repository cache because the dbt project is missing or malformed, it now returns an invalid project error.

<Lifecycle status="Fix" size="75" /> Snapshots selected but not executed in multi-step runs now appear with a skipped status.

<Lifecycle status="Fix" size="75" /> Insights now clears the Copilot chat loading state reliably after responses complete or error.

<Lifecycle status="Fix" size="75" /> When you arrive in Insights with a Copilot handoff message, Insights now starts the handoff once and clears stale handoff state when you navigate directly.

<Lifecycle status="Fix" size="75" /> Semantic Layer now derives explicit string conversions from returned result metadata, so categorical dimensions and entities are more consistently typed as strings in Tableau and Power BI queries.

<Lifecycle status="Fix" size="75" /> Cache invalidation no longer fails when an in-memory cache key is already missing.

<Lifecycle status="Fix" size="75" /> Semantic Layer now requests and caches run details scoped to your account, reducing incorrect run validation results.

<Lifecycle status="Fix" size="75" /> If you cancel a request while an agent is running tools, the agent now recovers cleanly instead of getting stuck on incomplete tool-call history.

<Lifecycle status="Fix" size="75" /> Studio IDE now removes the accept and reject overlay when you leave an AI diff view to prevent stale UI controls.

<Lifecycle status="Behavior change" size="75" /> Studio IDE now uses VS Code Quick Open for file search (`Cmd+P` or `Ctrl+P`) and the VS Code Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) instead of the legacy Studio dialogs.

<Lifecycle status="Behavior change" size="75" /> Tableau and Power BI queries can no longer request `MIN()` or `MAX()` for a metric or dimension (except time min-max queries), and you now receive a clear error if you attempt it.

### March 11, 2026

<Lifecycle status="New" size="75" /> You can request a new Snowflake private endpoint from account settings by pasting the output from `SELECT SYSTEM$GET_PRIVATELINK_CONFIG();` and track request status in the private endpoints table.

<Lifecycle status="Enhancement" size="75" /> You can now retry failed runs as long as your environment is on dbt Core version `1.6` or higher or dbt Fusion.

<Lifecycle status="Enhancement" size="75" /> Slack channel discovery and notifications now retry on Slack rate limits to reduce dropped messages during busy periods.

<Lifecycle status="Enhancement" size="75" /> OpenAPI schemas now mark 64-bit integer fields as `format: int64` to improve generated client types.

<Lifecycle status="Enhancement" size="75" /> Credentials OpenAPI docs now use a `type` discriminator to improve code generation and request validation.

<Lifecycle status="Fix" size="75" /> Searching jobs with numeric terms no longer triggers API validation errors.

<Lifecycle status="Fix" size="75" /> When dbt platform cannot fetch a publication artifact for an upstream project declared in `dependencies.yml`, you now see which project is missing an artifact and guidance to run the upstream environment.

<Lifecycle status="Fix" size="75" /> Microsoft Teams notifications now use the correct trigger event type for each notification.

<Lifecycle status="Fix" size="75" /> You now receive more accurate errors from permission checks, with underlying service errors surfacing instead of being reported as authorization failures.

<Lifecycle status="Fix" size="75" /> Creating a private endpoint now returns a `400` error with a clear message when `snowflake_output` is malformed or not valid JSON.

<Lifecycle status="Behavior change" size="75" /> You now see an informational notice instead of the Model timing chart for dbt Fusion runs because dbt Fusion handles threading differently.

<Lifecycle status="Behavior change" size="75" /> SCIM schema discovery now reports `id` fields as strings for users and groups.

### March 4, 2026

<Lifecycle status="Enhancement" size="75" /> Job settings now describe state-aware orchestration (SAO) as only building models when data or code changes are detected.

<Lifecycle status="Enhancement" size="75" /> Fusion cost optimization settings now link to account-level Cost Insights settings and setup documentation.

<Lifecycle status="Enhancement" size="75" /> When you enable manual updates for SCIM, dbt platform now asks you to confirm to avoid accidentally allowing changes outside your identity provider.

<Lifecycle status="Enhancement" size="75" /> When a SCIM-provisioned user with an expired invite is added to a SCIM-managed group, the invite is now automatically resent during group assignment.

<Lifecycle status="Enhancement" size="75" /> Projects with missing names now show as "Untitled Project," and you can save project descriptions as empty.

<Lifecycle status="Enhancement" size="75" /> Studio IDE no longer shows "Open Settings" buttons in editor notifications because Studio IDE does not expose VS Code settings.

<Lifecycle status="Fix" size="75" /> Catalog no longer gets stuck loading the file tree on initial page load.

<Lifecycle status="Fix" size="75" /> Trust signals now suppress less-severe upstream-source issues when a more severe issue is present.

<Lifecycle status="Fix" size="75" /> When dbt platform cannot decrypt a deploy key, you now get a clearer failure instead of a generic git credentials error.

<Lifecycle status="Fix" size="75" /> If authentication fails when you connect to the Language Server Protocol (LSP) WebSocket, the connection now closes cleanly instead of failing with an internal server error.

<Lifecycle status="Fix" size="75" /> Reduced environment setup timeouts and resolved intermittent authentication failures during busy periods.

<Lifecycle status="Fix" size="75" /> If your development connection credentials are invalid, you now see a clearer error message.

<Lifecycle status="Behavior change" size="75" /> dbt platform now treats `versionless` as deprecated and updates existing environments and jobs to use `latest`.

<Lifecycle status="Behavior change" size="75" /> If you send events that include a `run_id`, you must also provide an `account_identifier`; if `account_identifier` is missing, the event fails instead of falling back to a `run_id`-only lookup.

<Lifecycle status="Enhancement" size="75" /> The environment [Connection profiles](/docs/platform/about-profiles#environment-profiles-table) page has been updated with a clickable profile name button, connection column links, and a swap icon for changing assigned profiles, refer to [About profiles](/docs/platform/about-profiles) for more information.

<Lifecycle status="Beta" size="75" /> Apache Spark is now supported in the <Constant name="fusion_engine" /> CLI, refer to [Connect Apache Spark to Fusion](/docs/local/connect-data-platform/spark-setup) for more information.

<Lifecycle status="Enhancement" size="75" /> [Cost Insights](/docs/explore/cost-insights) charts now include an Assets filter (Models / Tests / All) on the Cost, Usage, Query run time, and Builds tabs, refer to [Explore cost data](/docs/explore/explore-cost-data) for more information.

<Lifecycle status="Enhancement" size="75" /> [Deferral](/reference/node-selection/defer) now supports [user-defined functions (UDFs)](/docs/build/udfs), allowing models that depend on UDFs to run without first building those UDFs in your current target.

<Lifecycle status="Fix" size="75" /> Status messages that exceed the 1024 character limit are now automatically truncated to prevent validation errors and run timeouts.

<Lifecycle status="Fix" size="75" /> Resolved an issue where [retrying failed runs](/docs/deploy/retry-jobs) triggered from Git tags would use the wrong commit instead of the original tagged commit.

<Lifecycle status="New" size="75" /> The [dbt MCP server](/docs/dbt-ai/about-mcp?version=2.0#product-docs) now includes product docs tools (`search_product_docs` and `get_product_doc_pages`) that let your AI assistant search and fetch pages from docs.getdbt.com in real time, refer to [the dbt MCP repo](https://github.com/dbt-labs/dbt-mcp?tab=readme-ov-file#product-docs) for more information.

<Lifecycle status="Enhancement" size="75" /> The Model Timing tab displays an informative banner for <Constant name="fusion_engine" /> runs instead of the timing chart explaining that model timing is not yet available for Fusion runs.

<Lifecycle status="Behavior change" size="75" /> [Snowflake plans to increase](https://docs.snowflake.com/en/release-notes/bcr-bundles/un-bundled/bcr-2118) the default column size for string and binary data types in May 2026, and `dbt-snowflake` versions below v1.10.6 may fail to build certain incremental models, refer to [Assess impact and required actions](/reference/resource-configs/snowflake-configs#assess-impact-and-required-actions) for more information.

<Lifecycle status="New" size="75" /> The new <Constant name="semantic_layer"/> YAML specification is now available on the <Constant name="dbt_platform" /> Latest release track, refer to [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec) for more information.

<Lifecycle status="Behavior change" size="75" /> New projects in trial, starter, or Enterprise accounts now default to Fusion Latest for all new environments with a supported adapter, refer to [environment settings](/docs/dbt-cloud-environments#change-environment-settings) for more information.

## February 2026

### February 25, 2026

<Lifecycle status="New" size="75" /> Saved query definitions (including tags, exports, parameters, and lineage relationships) are now captured during ingestion for Catalog lineage and governance workflows.

<Lifecycle status="Enhancement" size="75" /> Run step structured logs now show an indicator when system warnings or errors are present.

<Lifecycle status="Enhancement" size="75" /> Account Settings now shows the backend-provided region display name for clearer, more accurate region labeling.

<Lifecycle status="Enhancement" size="75" /> Changes to our UI to improve the experience of managing groups with SCIM enabled.

<Lifecycle status="Enhancement" size="75" /> After a user accepts an invite, the UI now explains that they must log in using SSO to fully redeem the invite.

<Lifecycle status="Enhancement" size="75" /> Studio IDE now catches unexpected render failures with a top-level error boundary and shows Not Found more reliably for unknown in-project routes.

<Lifecycle status="Enhancement" size="75" /> The main navigation trigger area is now a navigation element with improved focus and labeling.

<Lifecycle status="Enhancement" size="75" /> When VS Code search is enabled, Studio IDE avoids unregistering Quick Open and suppresses conflicting command palette shortcuts.

<Lifecycle status="Enhancement" size="75" /> Source freshness Outdated status can now be computed at query time, improving freshness status filtering consistency.

<Lifecycle status="Enhancement" size="75" /> Search results better support column-level navigation, with a clear validation error for very long queries and improved alignment in lineage visuals.

<Lifecycle status="Enhancement" size="75" /> Lineage graph building now includes cross-project dependencies and supports function nodes as first-class lineage entities.

<Lifecycle status="Enhancement" size="75" /> Projects APIs now explicitly support DELETE with stricter permission checks.

<Lifecycle status="Behavior change" size="75" /> Webhook payloads now include `runFinishedAt` only for completed events and `runErroredAt` only for errored events, with run status normalized from Cancelled to Canceled.

<Lifecycle status="Behavior change" size="75" /> Source freshness expiration windows can optionally derive from each source's freshness criteria rather than a fixed window.

<Lifecycle status="Behavior change" size="75" /> For very large `manifest.json` files, ingestion may strip sources above a configurable threshold to prevent out of memory failures.

<Lifecycle status="Behavior change" size="75" /> Deprecated settings `project_storage_bucket_name` and `project_storage_object_prefix` have been removed; migrate to `object_storage_bucket_name` and `object_storage_object_prefix`.

### February 18, 2026

<Lifecycle status="New" size="75" /> Cost Insights shows estimated warehouse compute costs and run times for your dbt projects and models in private beta, refer to your account manager to request access.

<Lifecycle status="Enhancement" size="75" /> Studio IDE can pause the Language Server Protocol (LSP) in background tabs and resume on return to improve stability when the editor is open in more than one tab.

<Lifecycle status="Enhancement" size="75" /> Added a VS Code-style header showing a dbt badge and current project name, with an option to hide surrounding chrome for more editor space.

<Lifecycle status="Enhancement" size="75" /> Surfaces more actionable filesystem errors (for example, name too long and file-is-a-directory) instead of generic failures.

<Lifecycle status="Enhancement" size="75" /> Added a Copy Relative Path action that respects `dbt_project_subdirectory` for quicker navigation and sharing.

<Lifecycle status="Enhancement" size="75" /> Improved user-facing errors for lineage failures including server errors and cases where upstream returns HTML instead of JSON.

<Lifecycle status="Enhancement" size="75" /> Improved private endpoint filtering by adapter type and updated Studio IDE to use the correct version 3 private endpoints endpoint.

<Lifecycle status="Enhancement" size="75" /> Improved CSV upload progress, resume behavior, and common error handling during Add Sources.

<Lifecycle status="Enhancement" size="75" /> Improved DAG performance by rendering only visible elements and improving layout for disconnected nodes.

<Lifecycle status="Enhancement" size="75" /> Improved keyboard and hover behavior in the search dropdown and avoids showing stale results while searches are loading.

<Lifecycle status="Enhancement" size="75" /> Clearer invite status (invitation sent and invitation accepted) now supports accepted, login pending for SSO.

<Lifecycle status="Enhancement" size="75" /> The unpaid billing banner is no longer feature-flagged and will display when applicable.

<Lifecycle status="Enhancement" size="75" /> Bug fixes and improvements related to managed invites for easier processing.

<Lifecycle status="Enhancement" size="75" /> Added Server-Sent Events (SSE) streaming control so clients can choose chunk streaming or message streaming.

<Lifecycle status="Enhancement" size="75" /> Improved responsiveness for AI Similar Models and Similar Sources requests by enforcing tighter embedding and database timeouts.

<Lifecycle status="Enhancement" size="75" /> Categorized OpenAI failures with BYOK awareness so BYOK failures return the expected 424-class behavior instead of generic 500-series errors.

<Lifecycle status="Enhancement" size="75" /> Updated dbt MCP tooling including adding `get_all_macros` and improving error categorization for more accurate responses.

<Lifecycle status="Fix" size="75" /> Ensures bulk edits stay in sync after server-side edits to prevent stale content from overwriting changes.

<Lifecycle status="Fix" size="75" /> Fixes preview and match highlighting assembly so match ranges align correctly in multi-line previews.

<Lifecycle status="Fix" size="75" /> Shows a proper error layout and notification on unrecoverable initialization failures.

<Lifecycle status="Fix" size="75" /> Prevents incorrect tab closing after uploads complete and avoids showing the floating node panel when not on a file tab.

<Lifecycle status="Fix" size="75" /> Fixes lineage resolution for public model parents when the producer model lives in a non-default environment.

<Lifecycle status="Fix" size="75" /> Fixes an OpenAI connection pool leak that could lead to out-of-memory (OOM) conditions under sustained load.

<Lifecycle status="Fix" size="75" /> Reduces intermittent failures when attaching related models by increasing internal timeouts for related-model fetching.

<Lifecycle status="Behavior change" size="75" /> Prevents rename and delete operations on the repository root and shows clearer warnings.

<Lifecycle status="Behavior change" size="75" /> Improves dbt command log streaming reliability by resuming from the last known CLI event offset.

<Lifecycle status="Behavior change" size="75" /> Job Admin now includes `profiles_write`, which can change what Job Admin users can do where Profiles are enabled.

<Lifecycle status="Behavior change" size="75" /> Version 3 Private Endpoints query parameter `name_search` is renamed to `search`, and search matches endpoint name and endpoint value.

<Lifecycle status="Behavior change" size="75" /> Postgres connection validation now requires a non-empty database name.

<Lifecycle status="Behavior change" size="75" /> Prevents associating the same active credentials object to multiple users, returning a conflict instead of silently duplicating associations.

<Lifecycle status="Behavior change" size="75" /> GitHub shared webhooks now accept repository URLs using https, git, and SSH formats.

<Lifecycle status="Behavior change" size="75" /> Slack linking and notification settings are more strictly gated by the relevant permissions.

<Lifecycle status="Behavior change" size="75" /> Slack integration listing now uses job notifications read permission, reducing incorrect permission-denied scenarios.

<Lifecycle status="Behavior change" size="75" /> Reduced default timeouts from 60 seconds to 5 seconds for Cloud Config and Cloud Artifact calls, causing requests to fail faster in high-latency environments unless overridden.

<Lifecycle status="Behavior change" size="75" /> Corrects the OTel log payload field name to `additional_message` (from the misspelled `addtional_message`), which may require updates to downstream parsing.

### February 11, 2026

<Lifecycle status="Enhancement" size="75" /> Improved model graph layout performance to reduce load time in larger projects.

<Lifecycle status="Enhancement" size="75" /> Similar Models lookup now uses an optimized vector search strategy to reduce timeouts on large projects.

<Lifecycle status="Enhancement" size="75" /> When your dbt project is in a subdirectory, the project root is highlighted in the Catalog file tree.

<Lifecycle status="Enhancement" size="75" /> Rename and delete actions now use native editor behaviors when using the Catalog file tree.

<Lifecycle status="Enhancement" size="75" /> Formatting updates now apply directly to the active editor buffer to reduce prompts and inconsistent results.

<Lifecycle status="Enhancement" size="75" /> Code generation no longer creates a temporary file in your repository during generation.

<Lifecycle status="Enhancement" size="75" /> Environment settings now prevent saving a Fusion dbt version with an incompatible connection and surface field level validation errors.

<Lifecycle status="Enhancement" size="75" /> When setting up a new connection, Fusion eligible adapters now default to the latest Fusion version to reduce misconfiguration.

<Lifecycle status="Enhancement" size="75" /> Private Endpoints can be sorted by status and connections, and endpoint details now show associated connections and environments.

<Lifecycle status="Enhancement" size="75" /> Invocation event streaming is more reliable for long running jobs by deriving totals from the latest stream event identifier.

<Lifecycle status="Enhancement" size="75" /> Log streaming now cleans up Redis keys after a stream completes, reducing stale keys and Redis memory pressure for high volume runs.

<Lifecycle status="Fix" size="75" /> When users hit the usage limit, dbt disables Copilot and shows a clear message including the reset date when available.

<Lifecycle status="Fix" size="75" /> Fixed duplicate Git status decorations in the file tree that could cause visual issues and performance impact.

<Lifecycle status="Fix" size="75" /> Studio IDE no longer runs an automatic pull on the primary branch to reduce unexpected changes during development.

<Lifecycle status="Fix" size="75" /> File operations now return structured validation errors and explicitly reject names that exceed operating system limits.

<Lifecycle status="Fix" size="75" /> Command logs for the dbt Cloud CLI are refreshed and finalized more reliably.

<Lifecycle status="Fix" size="75" /> Scheduler triggered runs now include account context, improving run attribution and preventing some downstream triggers from running without proper context.

<Lifecycle status="Fix" size="75" /> Exposure generated events now validate that account identifiers are numeric before triggering follow on automation.

<Lifecycle status="Fix" size="75" /> Webhook payloads now include consistent completion and error timestamps, and canceled runs include a canceled timestamp and normalized status.

<Lifecycle status="Fix" size="75" /> When both failure and completion triggers are configured, errored runs may generate two webhook deliveries to match legacy behavior.

<Lifecycle status="Fix" size="75" /> Ingestion now accepts the `functions` section to prevent parse failures on newer manifest schemas.

<Lifecycle status="Fix" size="75" /> Macro metadata persistence now uses more consistent UTC timestamps and improves argument comparison to reduce noisy or incorrect macro updates.

<Lifecycle status="Behavior change" size="75" /> Profiles API responses no longer include credential configuration and extended attributes; use the appropriate credentials and configuration endpoints instead.

<Lifecycle status="Behavior change" size="75" /> Account Connections list supports filtering by Private Endpoint identifier for easier management.

<Lifecycle status="Behavior change" size="75" /> Private Endpoints list now supports ordering by endpoint state and connection count.

<Lifecycle status="Behavior change" size="75" /> User licenses now include read access for Private Link resources, which may change who can view Private Link related settings.

<Lifecycle status="Behavior change" size="75" /> Generated metrics are now written directly into the active model file instead of using an accept and reject diff flow.

### February 4, 2026

<Lifecycle status="New" size="75" /> Added a link that opens Copilot from the console toolbar so you can use Copilot to read files and list directories for better context.

<Lifecycle status="New" size="75" /> Added a command to copy a file path relative to your dbt project subdirectory for easier sharing in runbooks and support tickets.

<Lifecycle status="Enhancement" size="75" /> Improved Fusion setup by showing "Fusion compatible" indicators during connection setup.

<Lifecycle status="Enhancement" size="75" /> When Compare Changes subqueries fail, the experience now surfaces a partial success state with expandable warning details.

<Lifecycle status="Enhancement" size="75" /> Improved log usability during in-progress runs by preserving text selection while logs auto-refresh and rerender.

<Lifecycle status="Enhancement" size="75" /> Added server-side search and clearer loading and empty states to the job picker for job-completion triggers.

<Lifecycle status="Enhancement" size="75" /> Improved artifact handling for job documentation and run artifacts by strengthening HTML detection and returning clearer `Content-Type` and download filenames.

<Lifecycle status="Enhancement" size="75" /> Improved Private Endpoints API v3 list behavior with validated query parameters, filtering, limit and offset pagination, and `connection_count` in responses.

<Lifecycle status="Enhancement" size="75" /> Improved formatting reliability by consistently using the active editor content and a stable repo-relative path when invoking formatting.

<Lifecycle status="Enhancement" size="75" /> Reduced errors when working with non-file tabs and improved robustness around tab-close and Git checkout flows.

<Lifecycle status="Enhancement" size="75" /> Improved embedded panel sizing to reduce clipping and scrolling issues in the sidebar.

<Lifecycle status="Enhancement" size="75" /> Improved Fusion banners and prompts by checking project eligibility via a Fusion status endpoint to reduce confusing prompts for ineligible projects.

<Lifecycle status="Enhancement" size="75" /> Improved cross-project lineage ("public ancestors") computation to better match expected external lineage boundaries in dbt Mesh experiences.

<Lifecycle status="Enhancement" size="75" /> Standardized Copilot Agent requests to the API and included active tab content as context to improve reliability of agent runs and handoff.

<Lifecycle status="Fix" size="75" /> Improved webhook subscription editing reliability with asynchronous data and fixed a multiselect focus issue that could cause accidental option selection.

<Lifecycle status="Fix" size="75" /> Fixed HTML email markup that could break rendering for run warning notifications.

<Lifecycle status="Fix" size="75" /> Profile create and view routes now live under `/dashboard/:accountId/projects/:projectId/profiles/...`, which may affect bookmarks and direct links.

<Lifecycle status="Fix" size="75" /> Removed hidden background commands from command history to reduce noise for users.

<Lifecycle status="Fix" size="75" /> Improved robustness of inline compile and show output attachment, including cases with tricky quoting and newlines.

<Lifecycle status="Fix" size="75" /> Fixed log download behavior so downloads correctly serve either the active `dbt.log` or the finalized compressed log.

<Lifecycle status="Fix" size="75" /> Fixed edge cases where gzipped artifacts could fail to upload due to upload stream handling.

<Lifecycle status="Fix" size="75" /> Reduced noisy disconnect and cleanup errors when multiple websocket connections and processes map to the same invocation.

<Lifecycle status="Fix" size="75" /> Fixed search result highlighting when the backend returns multiple highlights per field, with compact badges and counts for easier scanning.

<Lifecycle status="Fix" size="75" /> Improved environment-scoped Catalog search filtering by using merged environment identifiers.

<Lifecycle status="Fix" size="75" /> Improved behavior for environments with no public models by returning an empty list instead of falling into follow-on query logic.

<Lifecycle status="Fix" size="75" /> Improved keep-alive behavior so connections shut down cleanly when the client disconnects.

<Lifecycle status="Fix" size="75" /> Prevents failing tool calls by hiding Semantic Layer tools when the Semantic Layer is not available for the user or environment.

<Lifecycle status="Fix" size="75" /> Improved error reporting by walking wrapped exceptions to return the most specific status code and detail available.

<Lifecycle status="Fix" size="75" /> Treats empty tool outputs as valid results (for example, "no matches") to reduce unnecessary "tool call failed" errors.

<Lifecycle status="Behavior change" size="75" /> During connection setup, the default dbt version now only defaults to `latest-fusion` when the selected adapter is Fusion-compatible and the project and account are eligible.

<Lifecycle status="Behavior change" size="75" /> dbt version "allowed version" checks now account for `project_id` across jobs and environments, including API-triggered runs.

<Lifecycle status="Behavior change" size="75" /> Refresh token expiration for connected app OAuth flows increased from 8 hours to 7 days, reducing re-authorization frequency.

<Lifecycle status="Behavior change" size="75" /> File stat responses now return modified time and created time as integer milliseconds since epoch instead of float seconds.

<Lifecycle status="Behavior change" size="75" /> The LSP websocket now supports `defer_env_id` to defer against a specific environment and `no_defer=true` to explicitly disable deferral.

<Lifecycle status="Behavior change" size="75" /> When "defer to production" is turned off, the Studio IDE now passes `no_defer=true` to align editor intelligence with the selected deferral behavior.

<Lifecycle status="Behavior change" size="75" /> The freshness status value `outdated` was removed; unconfigured freshness is now handled explicitly as `unconfigured`.

<Lifecycle status="Behavior change" size="75" /> The rows-per-page selector was removed, and pagination now uses a fixed page size.

<Lifecycle status="Behavior change" size="75" /> Cached nodes are now consistently surfaced as Reused with clearer reasons, and stale outcomes are treated as errors.

<Lifecycle status="New" size="75" /> Advanced CI (dbt compare in orchestration) is now supported in the <Constant name="fusion_engine" />, refer to [Advanced CI](/docs/deploy/advanced-ci) for more information.

<Lifecycle status="Beta" size="75" /> The `dbt-salesforce` adapter available in the <Constant name="fusion_engine" /> CLI is now in beta, refer to [Salesforce Data 360 setup](/docs/fusion/connect-data-platform-fusion/salesforce-data-cloud-setup) for more information.

<Lifecycle status="Enhancement" size="75" /> The Analyst permission now has project-level access to read repositories, refer to [Project access for project permissions](/docs/platform/manage-access/enterprise-permissions#project-access-for-project-permissions) for more information.

<Lifecycle status="Enhancement" size="75" /> After a user accepts an email [invite](/docs/platform/manage-access/invite-users) to access an [SSO-protected](/docs/platform/manage-access/sso-overview) <Constant name="dbt_platform"/> account, the UI now prompts them to log in with SSO to complete the process.

<Lifecycle status="New" size="75" /> [Profiles](/docs/platform/about-profiles) let you define and manage connections, credentials, and attributes for deployment environments at the project level, with automatic creation for existing projects.

<Lifecycle status="New" size="75" /> [Python UDFs](/docs/build/udfs) are now supported and available in <Constant name="fusion_engine" /> when using Snowflake or BigQuery.

<Lifecycle status="Enhancement" size="75" /> Minor enhancements and UI updates to the <Constant name="studio_ide" /> file explorer that replicate the VS Code IDE experience.

<Lifecycle status="Enhancement" size="75" /> Profile creation now displays specific validation error messages instead of generic error text.

<Lifecycle status="Private beta" size="75" /> [Cost Insights](/docs/explore/cost-insights) shows estimated warehouse compute costs and run times for your dbt projects and models, refer to [Set up Cost Insights](/docs/explore/set-up-cost-insights) for more information.

<Lifecycle status="New" size="75" /> The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) now supports [Omni](https://docs.omni.co/integrations/dbt/semantic-layer) as a partner integration, refer to [Available integrations](/docs/platform-integrations/avail-sl-integrations) for more information.

<Lifecycle status="Enhancement" size="75" /> Clarified documentation for cumulative log size limits on run endpoints; when logs exceed the cumulative size limit, dbt omits them and displays a banner, refer to [Run visibility](/docs/deploy/run-visibility#log-size-limits) for more information.

<Lifecycle status="New" size="75" /> The `immutable_where` configuration is now supported for Snowflake dynamic tables, refer to [Snowflake configurations](/reference/resource-configs/snowflake-configs#immutable-where) for more information.

<Lifecycle status="Fix" size="75" /> The user invite details now show more information in invite status, giving admins visibility into users who accepted an invite to an SSO-protected account but haven't yet logged in via SSO.

<Lifecycle status="Enhancement" size="75" /> Improved performance on Runs endpoint for Admin V2 API and run details in dbt platform when connecting with GCP.

## January 2026

### January 28, 2026

<Lifecycle status="New" size="75" /> Use `POST /v1/workspaces/{workspace_id}/upload-source` to create an upload, then `PATCH /v1/workspaces/{workspace_id}/upload-source/{file_id}/process` to stream processing progress (SSE).

<Lifecycle status="Enhancement" size="75" /> Ranking now boosts results by modeling layer, and highlighting is more consistent including support for multiple highlight snippets per field.

<Lifecycle status="Enhancement" size="75" /> The dbt platform now includes a Private Endpoint details view with endpoint properties, connectivity status, and associated projects.

<Lifecycle status="Enhancement" size="75" /> Connection setup and environment creation can now default to `latest-fusion` for eligible projects.

<Lifecycle status="Enhancement" size="75" /> Added a dedicated sidebar search experience.

<Lifecycle status="Enhancement" size="75" /> Upgrade flows can proceed from fixing deprecations into package upgrades in the same guided run.

<Lifecycle status="Enhancement" size="75" /> Fixed multiple layout/styling issues for a more consistent editor experience.

<Lifecycle status="Fix" size="75" /> Improved rendering and cleanup of escape sequences in step logs.

<Lifecycle status="Fix" size="75" /> Freshness status is preserved when a run lacks freshness results but freshness remains configured.

<Lifecycle status="Fix" size="75" /> Ingestion now tolerates missing/null `schema` fields in the manifest to avoid failures.

<Lifecycle status="Fix" size="75" /> Sync skips missing symlink targets instead of failing the whole sync.

<Lifecycle status="Fix" size="75" /> Aborting a command that no longer exists returns a specific "no-command-found" response.

<Lifecycle status="Fix" size="75" /> Malformed inline commands no longer break result processing; `show --inline` with an empty result returns an empty preview table.

<Lifecycle status="Fix" size="75" /> Creating an uploaded-source model with a duplicate name now returns HTTP 409 with an actionable message.

<Lifecycle status="Fix" size="75" /> Uploaded-source processing records failure state instead of deleting the file record, improving retry/resume workflows.

<Lifecycle status="Fix" size="75" /> The invocation status SSE endpoint now correctly awaits the status stream.

<Lifecycle status="Behavior change" size="75" /> `AccountSearchHit.highlight` and `AccountSearchHit.matchedField` are deprecated; `AccountSearchHit.highlights` now supports multiple highlight snippets per field (arrays).

<Lifecycle status="Behavior change" size="75" /> The "Adaptive" job type is deprecated and `last_checked_at` is no longer populated in run responses.

<Lifecycle status="Behavior change" size="75" /> Migrate to the new two-step [upload source](/docs/platform/use-canvas#upload-data-to-canvas) flow.

### January 21, 2026

<Lifecycle status="New" size="75" /> Add resources to favorites and organize your frequently accessed resources in the Catalog navigation.

<Lifecycle status="New" size="75" /> You can now retrieve individual PrivateLink endpoints by ID, enabling better automation and troubleshooting workflows.

<Lifecycle status="Enhancement" size="75" /> Find specific artifacts faster in run history with the new artifacts search box and improved empty states.

<Lifecycle status="Enhancement" size="75" /> The webhook form no longer resets while job options are loading, and server-generated fields now display reliably after creation.

<Lifecycle status="Enhancement" size="75" /> After completing the Fusion onboarding checklist, you can now dismiss the card and it will stay dismissed.

<Lifecycle status="Enhancement" size="75" /> Cross-project lineage is now enabled for all applicable accounts.

<Lifecycle status="Enhancement" size="75" /> Enhanced search scoring and matching provides more accurate results, with better column matching and highlighting for large catalogs.

<Lifecycle status="Enhancement" size="75" /> Column name and description updates now automatically trigger re-indexing, ensuring search results stay current.

<Lifecycle status="Enhancement" size="75" /> Quickly access full search results from the typeahead dropdown with the new footer link.

<Lifecycle status="Enhancement" size="75" /> The environment selector now only shows "Staging" when your account has projects with a staging environment configured.

<Lifecycle status="Enhancement" size="75" /> IDE-related endpoints now return more specific and helpful error messages for common configuration issues and timeouts.

<Lifecycle status="Enhancement" size="75" /> Enhanced command log viewer with improved download capabilities and more consistent error log viewing.

<Lifecycle status="Fix" size="75" /> dbt Copilot generated documentation now correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.

<Lifecycle status="Fix" size="75" /> Auto-generated exposures now appear correctly in lineage views.

<Lifecycle status="Fix" size="75" /> Search now handles missing connection names gracefully without causing errors.

<Lifecycle status="Fix" size="75" /> Requests with invalid authentication tokens now fail safely with clear error messages.

<Lifecycle status="Fix" size="75" /> Commands that can't be fetched are now properly marked as failed instead of staying in a "running" state.

<Lifecycle status="Fix" size="75" /> Job deferral settings are now validated to ensure the deferring job and environment exist within the same account.

<Lifecycle status="Behavior change" size="75" /> Tables in Account Insights now display 5 rows per page by default (previously 10).

<Lifecycle status="Behavior change" size="75" /> All webhook timestamp fields now use UTC with `Z` suffix and higher precision; missing/invalid timestamps emit `1970-01-01T00:00:00Z` instead of empty strings.

<Lifecycle status="Behavior change" size="75" /> Update webhook consumers that parse status values strictly.

<Lifecycle status="Behavior change" size="75" /> Projects with more than 5,000 exposures will skip exposure ingestion to prevent performance issues.

### January 14, 2026

<Lifecycle status="New" size="75" /> Added an API endpoint to determine whether a project is eligible for Fusion migration.

<Lifecycle status="Enhancement" size="75" /> Agent tool execution errors now return structured responses instead of failing the entire run.

<Lifecycle status="Enhancement" size="75" /> Agent toolsets include additional retrieval and search capabilities for more relevant responses.

<Lifecycle status="Enhancement" size="75" /> Azure OpenAI connection verification now uses GPT-5-compatible parameters for GPT-5 deployments.

<Lifecycle status="Enhancement" size="75" /> Added support for Azure Foundry URLs with automatic endpoint parsing to reduce setup friction.

<Lifecycle status="Enhancement" size="75" /> Build SQL queries against the Semantic Layer without writing SQL code.

<Lifecycle status="Enhancement" size="75" /> Search scoring prioritizes exact and multi-term matches more strongly, with better highlighting and column-description matching.

<Lifecycle status="Enhancement" size="75" /> Search labels are more consistent, and the embedded lineage view loads more responsively.

<Lifecycle status="Enhancement" size="75" /> Studio now loads a single unified IDE package.

<Lifecycle status="Enhancement" size="75" /> Studio now respects `dbt-cloud.defer-env-id` settings when Cloud CLI runtime is supported.

<Lifecycle status="Enhancement" size="75" /> Download and copy behavior for command logs is more consistent, including debug logs.

<Lifecycle status="Enhancement" size="75" /> The IDE now supports multiple explicit edits in one request with safer validation.

<Lifecycle status="Enhancement" size="75" /> Session creation returns clearer error messages and guidance for setup issues.

<Lifecycle status="Enhancement" size="75" /> Settings detail experiences now use an improved drawer-based UI.

<Lifecycle status="Enhancement" size="75" /> Profile creation now handles dependencies and failures more gracefully.

<Lifecycle status="Enhancement" size="75" /> Logs for in-progress runs are also limited by memory usage, in addition to the existing 1,000-line limit.

<Lifecycle status="Fix" size="75" /> The Profiles API now allows unsetting extended attributes by setting `extended_attributes_id` to null.

<Lifecycle status="Fix" size="75" /> Recently viewed entries now update atomically and retain the 5 most recent items.

<Lifecycle status="Fix" size="75" /> Debug logs for completed runs now consistently fetch only the tail of the log.

<Lifecycle status="Fix" size="75" /> CLI flags to disable caching are now positioned correctly to avoid parsing issues.

<Lifecycle status="Fix" size="75" /> Fixed argument ordering so `--no-defer` is interpreted consistently.

<Lifecycle status="Behavior change" size="75" /> dbt v1.7 is now labeled as end-of-life in version lifecycle messaging.

### January 7, 2026

No changes of note this week.

<Lifecycle status="Enhancement" size="75" /> The `defer-env-id` setting for choosing which deployment environment to defer to is [now available](/docs/platform/about-cloud-develop-defer#defer-environment) in the <Constant name="studio_ide" />.

<Lifecycle status="Beta" size="75" /> The [Analyst agent](/docs/explore/navigate-dbt-insights#dbt-copilot) in dbt <Constant name="insights" /> is now in beta.

<Lifecycle status="Enhancement" size="75" /> The [Studio IDE](/docs/platform/studio-ide/ide-user-interface#search-your-project) now includes search and replace functionality and a command palette for quickly finding and replacing text, navigating files, and running IDE configuration commands.

<Lifecycle status="Enhancement" size="75" /> [State-aware orchestration](/docs/deploy/state-aware-about) now rebuilds models that fail a data test on subsequent runs and detects tables deleted from the warehouse, refer to [Handling deleted tables](/docs/deploy/state-aware-about#handling-deleted-tables) for more information.

<Lifecycle status="Enhancement" size="75" /> [dbt <Constant name="copilot" />](/docs/platform/dbt-copilot) correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.

<Lifecycle status="Enhancement" size="75" /> The <Constant name="fusion"/> CLI now automatically reads environment variables from a `.env` file in your current working directory, refer to [Install <Constant name="fusion"/> CLI](/docs/local/install-dbt?version=2#get-started#environment-variables) for more information.

<Lifecycle status="New" size="75" /> The new <Constant name="semantic_layer"/> YAML specification creates an open standard for defining metrics and dimensions, with semantic models now embedded within model YAML entries, refer to [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec) for more information.

<Lifecycle status="Fix" size="75" /> Debug logs in the Run summary tab are now properly truncated to improve performance, refer to [Run visibility](/docs/deploy/run-visibility#run-summary-tab) for more information.

<Lifecycle status="New" size="75" /> The [Semantic Layer querying](/docs/explore/navigate-dbt-insights#semantic-layer-querying) within dbt <Constant name="insights" /> is now generally available (GA).

<Lifecycle status="Enhancement" size="75" /> Eligible <Constant name="dbt_platform" /> accounts in the <Constant name="fusion" /> private preview can now use [Exposures](/docs/platform-integrations/downstream-exposures).

## December 2025

### December 24, 2025

<Lifecycle status="New" size="75" /> Analysts can now drop `@path` references in the bundled CLI to stream local files into `/private/v1/agents/run` as auto-rendered text for copilots.

<Lifecycle status="New" size="75" /> Copilot replies now carry inline "Did that answer your question?" buttons for rating answers without leaving Slack.

<Lifecycle status="New" size="75" /> A Databricks history provider and DBU-based cost query now surface daily model cost alongside Snowflake coverage for unified FinOps reporting.

<Lifecycle status="New" size="75" /> The CSV upload endpoint is now generally available.

<Lifecycle status="Enhancement" size="75" /> Attachment workflows now only recommend meaningfully related models.

<Lifecycle status="Enhancement" size="75" /> Settings consolidate SSO + SCIM, add an empty state for auto-generated slugs, and render read-only login URLs.

<Lifecycle status="Enhancement" size="75" /> Token tables gain fixed pagination, inline search, consistent iconography, and clearer deletion warnings.

<Lifecycle status="Enhancement" size="75" /> The v3 API/UI now allow up to 20 scoped environment variables before enforcing limits.

<Lifecycle status="Enhancement" size="75" /> SELECT * RENAME/EXCEPT support now respects each warehouse's syntax using schema metadata, keeping SQL previews and column metadata accurate across Snowflake, Databricks, BigQuery, and Redshift.

<Lifecycle status="Fix" size="75" /> Default values are cached after the first render and stop resetting once the user edits the form, eliminating accidental job-list clearing while tabbing through fields.

<Lifecycle status="Fix" size="75" /> `parentsModels` and `parentsSources` now derive from the manifest's `parents` list, so exposures with mixed upstreams display complete lineage in both the GraphQL API and UI.

<Lifecycle status="Behavior change" size="75" /> All cost management pages and hooks were removed, and platform metadata credentials now only expose catalog ingestion and Cost Insights toggles.

### December 17, 2025

<Lifecycle status="New" size="75" /> A new `/accounts/<id>/feature-licenses` endpoint issues short-lived JWTs that encode entitled features, with service/PAT authentication now checking for an active license before Fusion-enabled workflow runs.

<Lifecycle status="New" size="75" /> Databricks warehouses can register platform metadata credentials (token plus optional catalog) enabling catalog ingestion, metadata sharing, and Cost Insights pipelines.

<Lifecycle status="Enhancement" size="75" /> Settings Projects and Credentials now paginate after 25 rows with search boxes and skeleton states, keeping navigation responsive for large deployments.

<Lifecycle status="Enhancement" size="75" /> Model panels now show materialization type, lineage renders metadata strips only when content exists, and upstream public-model columns load automatically.

<Lifecycle status="Enhancement" size="75" /> Source tiles respect the `meta5161ExpiredUnconfiguredSources` flag and "Open in IDE" links now point directly into dbt Studio.

<Lifecycle status="Enhancement" size="75" /> The Copilot listener now hydrates builder tabs only when a semantic-layer payload arrives, preventing plain-SQL replies from overwriting editor state.

<Lifecycle status="Enhancement" size="75" /> File sync now anchors itself to the invocation directory for more predictable monorepo behavior, with nested `dependencies.yml` files correctly triggering dependency installs.

<Lifecycle status="Enhancement" size="75" /> Outbound calls now persist the exact JSON body in webhook history, making allowlisting and troubleshooting easier.

<Lifecycle status="Enhancement" size="75" /> The file tree now mirrors Cloud VCS statuses (including conflicts) and automatically invalidates caches after `dbt deps`/`dbt clean`.

<Lifecycle status="Enhancement" size="75" /> Command and interactive query logs adopt the new accordion-based viewer, and Autofix sessions in Fusion treat plain `parse` commands as the trigger for deprecation summaries.

<Lifecycle status="Fix" size="75" /> Editing one variable no longer backfills blank cells with previously edited values.

<Lifecycle status="Fix" size="75" /> Job pages once again display "Cost optimization features" whenever Fusion actually runs and gating conditions are met.

<Lifecycle status="Behavior change" size="75" /> Service/PAT calls without an active license now fail authentication, and SSO providers enforce auto-generated slugs.

<Lifecycle status="Behavior change" size="75" /> Every invocation lookup validates the caller's user ID, preventing admins from accidentally reading another developer's runs.

<Lifecycle status="Behavior change" size="75" /> Support impersonation sessions now restrict execution of `show`, `run`, `build`, and `test` commands, and artifacts generated by `dbt show` expire after 15 minutes.

<Lifecycle status="Behavior change" size="75" /> Fusion tracks now treat `dbt compare` as a supported command.

### December 10, 2025

<Lifecycle status="Enhancement" size="75" /> Streaming middleware enforces request-scoped instrumentation across every AI endpoint, offloads warehouse calls via threads, and exposes human-readable tool names.

<Lifecycle status="Enhancement" size="75" /> Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped.

<Lifecycle status="Enhancement" size="75" /> Slack Copilot mentions are now more reliable, with hardened workers, support for CSV attachments, and improved logging.

<Lifecycle status="Enhancement" size="75" /> Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync.

<Lifecycle status="Enhancement" size="75" /> Improved stability and performance for large projects.

<Lifecycle status="Enhancement" size="75" /> For dbt Fusion logging, node start and end times now properly display in command output.

<Lifecycle status="Enhancement" size="75" /> Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps.

<Lifecycle status="Enhancement" size="75" /> Tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking.

<Lifecycle status="Fix" size="75" /> Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier.

### December 3, 2025

<Lifecycle status="New" size="75" /> When deprecations are detected, you now see "Autofix deprecation warnings."

<Lifecycle status="New" size="75" /> After running Autofix, you see a results panel with upgraded packages (with links), packages left unchanged and why, and quick access to `packages.yml`.

<Lifecycle status="Enhancement" size="75" /> Clearer lint/format actions (SQLFluff, Prettier), better empty states, visible Config button when applicable, and simplified logs retrieval for SQL, JSON, YAML, and Markdown workflows.

<Lifecycle status="Enhancement" size="75" /> Upgraded editor for stability with improved container sizing/overflow and minor action-bar refinements.

<Lifecycle status="Fix" size="75" /> Reliability improved by aligning with updated IDE and VS Code command APIs, eliminating intermittent skips.

<Lifecycle status="Behavior change" size="75" /> dbt Core "versionless" renamed to "latest" for consistency across tenants.
