---
title: "dbt release notes"
description: "dbt release notes"
id: "dbt-cloud-release-notes"
sidebar: "dbt release notes"
pagination_next: null
pagination_prev: null
---

<Constant name="dbt" /> release notes for recent and historical changes. Release notes fall into one of the following categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC) environments.

For <Constant name="fusion_engine" /> updates, refer to the [dbt-fusion changelog](https://github.com/dbt-labs/dbt-fusion/blob/main/CHANGELOG.md).

## May 2026

- **New:** The Fusion + Snowflake connection experience is now generally available on the dbt platform. See our [Fusion upgrade guides](/guides/prepare-fusion-upgrade?step=1) for information on enabling the upgrade workflows for your environments today!

## April 2026

### April 29, 2026

- **Enhancement:** The Studio IDE dev agent can now help you investigate and troubleshoot dbt job and run failures using the `troubleshooting-dbt-job-errors` skill. The agent notes when your local project state may differ from the job (for example, a different branch or uncommitted changes). This feature is currently in beta. Refer to [Debug job failures](/docs/dbt-ai/developer-agent?version=2.0#debug-job-failures) for more information.
- **Enhancement:** Semantic Layer requests through MCP are now capped at 10 MiB (previously unlimited) to improve infrastructure stability.
- **Enhancement:** The "Debug in Studio" and "Run once on Fusion" menu items are now independently disabled based on your permissions. If you lack the required permission for an action, that item shows a tooltip explaining why, while the other item remains available.
- **Enhancement:** When you click "Debug in Studio," dbt platform now automatically sets your user-level `DBT_DEVELOP_CORE_VERSION` environment variable to `latest-fusion` before opening the Studio IDE, so you no longer need to configure this manually.
- **Enhancement:** If the preparation step before opening the Studio IDE fails, the button temporarily shows "Debug failed" in a red state for 5 seconds before resetting, so you know to try again rather than seeing a silent failure.
- **Enhancement:** Projects with no jobs configured are now treated as eligible for Fusion. The upgrade card no longer requires a successful job run for such projects and instead shows "No jobs configured yet" under job eligibility.
- **Enhancement:** Clicking "Override eligibility status" on the run details page now opens a confirmation pop-up before applying the override, preventing accidental changes.
- **Enhancement:** The review button on the jobs list for jobs with unknown Fusion eligibility is now shown to all users regardless of run write permissions, so anyone can view the eligibility details modal.
- **Enhancement:** The orchestrator now publishes model execution events for grouped models and tests when running with dbt Fusion's OpenTelemetry (OTel) log format, extending model notification support to Fusion-based runs.
- **Enhancement:** The run ingestion pipeline now detects and signals when structured dbt logs are present for a step, so logs appear correctly in the dbt platform for runs ingested from external executors.
- **Enhancement:** The Cancel and Save buttons on the create private endpoint page now stick to the bottom of the viewport so they remain accessible when scrolling through the form.
- **Enhancement:** The "Generate docs on run" deprecation notice is now only shown for jobs running on a Fusion dbt version. Non-Fusion jobs continue to show the standard checkbox.
- **Fix:** Fixed request errors when using BYOK OpenAI and Azure OpenAI reasoning model endpoints.
- **Fix:** Metric manifest fields `granularity` and `offset_to_grain` now accept arbitrary string values instead of only a fixed enum. Projects using custom granularities such as `fiscal_year` will no longer fail ingestion.
- **Fix:** Tags are now a searchable field in the advanced search panel. You can filter results by tag matches. Filtering uses OR logic, returning assets that match any of the specified tags rather than requiring all tags to be present.

### April 22, 2026

- **New:** The catalog search sidebar now includes health and last run status filter sections. You can filter dbt resources (models, sources, and exposures) by health status (healthy, caution, degraded, unknown) and by last run status (`success`, `error`, `skipped`, `reused`).
- **New:** Tag is now a searchable field in the advanced search side panel. You can filter results by tag matches.
- **Enhancement:** Added additional layers of theme preference fallbacks, including the user's OS theme preferences, to avoid incorrect theming when the user-preferences service is slow to respond.
- **Enhancement:** You can now navigate directly to a specific Studio IDE console tab (for example, commands or lineage) using a `consoleTab` URL query parameter. Invalid tab identifiers are removed from the URL automatically.
- **Enhancement:** After the deprecation autofix workflow completes in Fusion environments, a **Compile** button now appears in the autofix results panel so you can immediately verify the updated project without manually triggering a compile.
- **Enhancement:** The Fusion eligibility dropdown filter on the jobs list has been replaced with a toggle and help icon. When enabled, each job displays its current Fusion eligibility badge, and a persistent info banner explains how eligibility is recalculated. The toggle state is saved per-project in your browser.
- **Enhancement:** The single **Run once on Fusion** button on the job details page and job list has been replaced with a **Debug on Fusion** menu that offers **Debug in Studio**, **Run once on Fusion**, and (when dbt Copilot is enabled) **Debug in Studio with Copilot** options. Refer to [Prepare to upgrade to <Constant name="fusion"/>](/guides/prepare-fusion-upgrade?step=7) for more information.
- **Enhancement:** The Fusion run error banner on run details now uses the same **Debug on Fusion** menu as the jobs page. The banner no longer requires setting a personal dbt version override before navigating to Studio.
- **Enhancement:** Testing a webhook subscription now triggers a test event and polls for the delivery receipt, showing the actual HTTP status code and error from the endpoint response. A 60-second timeout is applied, with a clear timeout message if the endpoint does not respond in time.
- **Enhancement:** The receipt endpoint for webhook events now returns a `404` response when a delivery record has not yet been written (for example, when the notification system has not yet processed the event), rather than returning an incomplete record.
- **Enhancement:** Webhook delivery history records now show `504` as the HTTP status code when a delivery timed out (previously stored as `0`), improving accuracy in the delivery history view.
- **Enhancement:** The note that event history is limited to the past 7 days now appears on the webhook events history page unconditionally.
- **Enhancement:** A migration banner now appears on the Slack notification settings page when you have notification settings from a previous Slack integration. You can migrate them to the new Slack app in one click or dismiss the banner. After migration, you are shown which private channels need the dbt platform app invited for notifications to be delivered. Contact your account manager to enable.
- **Enhancement:** The OAuth consent page now displays a "View account information" (`account:read`) scope option, which grants view-only access to account details including project and environment information.
- **Enhancement:** A new `pending` connectivity status is available for PrivateLink endpoints, in addition to the existing `success` and `failed` states.
- **Enhancement:** The member permission set now includes `fusion_readiness_read`, allowing members to view Fusion readiness information for projects without requiring elevated permissions.
- **Fix:** Azure OpenAI deployments now correctly pass the deployment name as the `model` field when using the Responses API, preventing misrouted requests when the deployment name differs from the model name.

### April 15, 2026

- **Enhancement:** The `AccountSearchQueryFilter` input now accepts `health` and `runStatus` filter arrays. Use `health` to narrow results by health status (`healthy`, `caution`, `degraded`, or `unknown`) and `runStatus` to filter by last run outcome (`success`, `error`, `skipped`, or `reused`). Multiple values within each filter are combined with `OR` logic.
- **Enhancement:** Healthy dbt resources (those with no detected issues) now rank higher in search results than resources with unresolved issues when text relevance is otherwise equivalent.
- **Enhancement:** Press `Ctrl+\`` to open the Commands tab directly from the editor.
- **Enhancement:** Fusion eligibility reason messages are rewritten to be shorter and more actionable. For example, unsupported adapters now read "This job uses an adapter that's not currently available on the Fusion engine" and jobs not on Latest now read "This job uses a dbt version that's not tested for Fusion eligibility."
- **Enhancement:** Clicking "Run once on Fusion" on a job now opens a confirmation modal before triggering the run, showing the environment name and a warning that job commands will execute in that environment.
- **Enhancement:** Run steps that execute `dbt ls` or `dbt list` now show node results with a no-op status instead of "unknown," reducing confusion in run logs for list operations.
- **Enhancement:** The account-level setting to enable Fusion readiness and upgrade features now has an updated label ("Enable Fusion readiness & upgrade features") and a more detailed description explaining what the setting allows administrators and developers to do.
- **Enhancement:** The "Debug on Fusion" button (previously "Debug manually") on failed Fusion run banners now sets your personal `DBT_DEVELOP_CORE_VERSION` override to `latest-fusion` before opening Studio IDE, ensuring you open the IDE on the Fusion engine. A loading state is shown while the override saves, and an inline error is displayed if the save fails.
- **Enhancement:** The "Status" column in the private endpoints list is renamed to "Connectivity status" for clarity.
- **Enhancement:** When pasting Snowflake Private Link configuration output, the validation error now lists the specific required fields that are missing (for example, `privatelink-account-url`) rather than a generic message. Valid output now also shows a success indicator.
- **Enhancement:** Environment credential and connection forms that accept YAML Extended Attributes (for example, Redshift `db_groups`) now correctly validate arrays as values. Previously, array values were incorrectly rejected during client-side validation.
- **Enhancement:** When creating a Snowflake PrivateLink connection, you can now supply an optional `interface_endpoint_id` to attach a new profile to an existing interface endpoint rather than always creating a new one. The endpoint must be in `Available` status; a `409 Conflict` is returned otherwise. Contact your account manager to enable.
- **Fix:** Files inside a newly created folder are now listed individually in the Git Controls panel. Previously, a new folder appeared as a single unexpanded entry rather than showing the files it contained.
- **Fix:** Files created inside a new folder now always display the parent folder name as a hint in the Git Controls panel, even when the file name is unique across all changed files.

### April 8, 2026

- **New:** The dbt MCP remote server now includes Admin API tools, including `list_jobs`, `list_projects`, `get_job_details`, `trigger_job_run`, `cancel_job_run`, `retry_job_run`, `get_job_run_details`, `get_job_run_error`, `list_job_run_artifacts`, and `get_job_run_artifact`. These tools let MCP clients list, inspect, trigger, cancel, and retry dbt jobs and runs directly from connected AI assistants. Contact your account manager to enable.
- **New:** A new OAuth consent page lets you authorize third-party applications (for example, dbt MCP) to access your dbt platform account. You can select which permissions and projects to grant, then approve or deny the request.
- **New:** Test and snapshot detail pages now include a Performance tab showing cost insights data — including cost, usage, build time, and build count charts — matching the existing model performance experience.
- **Enhancement:** The Studio DevAgent now selects the lightest appropriate validation check after each change — for example, skipping compilation for description-only edits and running `dbt parse` for project config changes — instead of always running a full `dbt compile`. This reduces unnecessary round-trips and keeps iteration faster.
- **Enhancement:** Replaces the simple defer-to-production toggle with a popover that lets you choose between your development environment, dbt's default deferral behavior (staging if available, otherwise production), or a specific custom environment. A badge in the command bar shows your current deferral target at a glance.
- **Enhancement:** Adds an "Edit / Revert" action to the version override option in the environment popover. Clicking "Revert" opens a confirmation modal that removes your personal dbt version override and restarts the session.
- **Enhancement:** Moves the active-file context pill to above the text input for greater visibility. When you remove the file context, a "Use current file as context" affordance appears so you can restore it without switching tabs.
- **Enhancement:** State-Aware Orchestration (SAO) test runs that reuse prior results now display with a "reused" icon in the DAG test status lens, matching the existing model run status behavior.
- **Enhancement:** The `function` resource type is now recognized in dbt selectors and the resource node type map, enabling correct filtering and navigation for function resources in Catalog.
- **Enhancement:** Look for a "Fusion status" column in your account insights table when the Fusion readiness flow is available for your account. You'll see one of four states: On Fusion, Start upgrade, Partial-Fusion, or Non-Fusion — based on each project's readiness and migration progress. Projects that are ready to upgrade show a "Start upgrade" button that navigates directly to the project home page. Contact your account manager to enable.
- **Fix:** In Fusion mode, the parse status badge no longer switches to an error state solely because diagnostic errors are present. The badge now correctly reflects compilation progress and completion independent of diagnostic counts.
- **Fix:** Adds "remote rejected authentication" as a recognized, non-retryable git authentication error. You will now see a clear authentication failure message instead of a misleading retry loop when your git provider rejects your credentials.
- **Fix:** Models with a `last_run_status` of `reused` are no longer marked stale even when their last execution date exceeds 30 days. This prevents false health issue warnings for models that were intentionally reused rather than re-executed.
- **Fix:** Fixes a bug where resource counts on the project landing page were not updated when switching environments.

### April 1, 2026

- **New:** Studio IDE now supports fuzzy file path search that finds files in your project using partial name matching. You can filter by glob patterns, set a result limit, and receive ordered results with a total match count, making it faster to navigate large projects.
- **New:** A new `/oauth/consent` endpoint enables the Connected Auth OAuth flow, supporting user consent decisions (approve and deny), project-level resource boundaries, and authorization code issuance. This feature is in private beta. To request access, contact your account manager.
- **Enhancement:** The Studio agent now remembers your last-used mode (Ask or Code) across browser sessions, so you no longer need to reselect it each time you open the IDE.
- **Enhancement:** File search now validates each result against the filesystem before returning matches. Files that have been deleted locally but not yet staged are no longer included in search results.
- **Enhancement:** Removes behavior where the IDE server automatically pulled changes from your primary branch during git status checks, which could cause unintended overwrites for projects using trunk-based development.
- **Enhancement:** Adds Teradata to the SQL dialect adapter map, enabling column-level lineage parsing for dbt projects using the Teradata adapter.
- **Enhancement:** Adds fields indicating availability of readiness and migration features.
- **Enhancement:** Account feature flag changes now take effect within 60 seconds instead of up to one hour. You should see feature toggles apply more promptly across your account.
- **Enhancement:** Reduced the likelihood of delayed notifications (webhooks, email, Slack, and Teams) in certain third-party/system disruption scenarios.
- **Fix:** The GitHub webhook endpoint now correctly checks for a null webhook secret before attempting to validate the request signature, preventing a crash when a repository's webhook secret is not set.
- **Fix:** These repository fields have been promoted from 32-bit to 64-bit integers (`BigIntegerField`) to accommodate GitHub installation and webhook IDs that exceed the 32-bit integer range.
- **Behavior change:** The Fusion migration checklist, the Enable Fusion Environments page, and the "Enable Fusion" button in Studio IDE now use the `is_migration_available` field from the Fusion status API instead of the legacy `orc2609ShowFusionToggle` feature flag. Fusion migration UI is shown only when the backend has marked the project as ready for migration.

- **New:** A universal login URL is available at [https://login.dbt.com](https://login.dbt.com), making it easier for you to view accounts you have access to across instances (regions and tenancies). This is currently available for multi-tenant accounts with an account-specific domain, and support for single-tenant accounts is coming soon. For more information, refer to [Log in to dbt platform](/docs/platform/about-platform/login).
- **Fix:** Refreshing the same browser tab now restores your active <Constant name="dev_agent" /> conversation instead of showing the empty state. Opening a new tab, or returning after closing the tab, still starts in the empty state. The <Constant name="dev_agent" /> is currently in beta.
- **Enhancement:** The dbt VS Code extension's **Get started** panel has been redesigned and surfaces the exact next setup step you need to install the extension and <Constant name="fusion"/>. The new panel also supports a new **agentic migration** option that helps you upgrade your project to <Constant name="fusion"/>  automatically in Copilot or Cursor. For more info, see [Getting started](/docs/install-dbt-extension#getting-started).
- **Beta**: [Model query history](/docs/explore/model-query-history) now also supports Databricks and Redshift. Refer to [Credential permissions](/docs/explore/model-query-history#credential-permissions) for more information.
- **Enhancement:** [Slack notifications (account-level)](/docs/deploy/job-notifications#slack-notifications-account) and [Microsoft Teams notifications](/docs/deploy/job-notifications#microsoft-teams-notifications) are now generally available, enabling you to send job notifications directly to Slack channels configured at the account level, and to Teams channels.
- **Enhancement:** When using the [dbt autofix](https://github.com/dbt-labs/dbt-autofix) tool in the <Constant name="studio_ide" />, you can now compile your project directly from the results panel after a successful `dbt parse`. Click **Compile** next to the **Successfully resolved** result to kick off a compile. For more information, refer to [Fix deprecation warnings](/docs/platform/studio-ide/autofix-deprecations).
- **Beta**: DuckDB is now supported in the <Constant name="fusion_engine" /> CLI, which lets you run local dbt projects without a warehouse account. For more information, refer to [Connect DuckDB](/docs/local/connect-data-platform/duckdb-setup).
- **New**: You can now configure Snowflake PrivateLink endpoints directly in <Constant name="dbt_platform" /> without contacting dbt Support, available in private beta. Go to **Account settings → Integrations → Private endpoints** to request and manage Snowflake PrivateLink endpoints on AWS. This feature is available for Snowflake on AWS only. For more information, refer to [AWS PrivateLink for Snowflake](/docs/platform/secure/private-connectivity/aws/aws-snowflake?version=1.12).
- **Enhancement:** You can now use arrays as values for keys in the <Constant name="dbt_platform" /> extended attributes YAML editor. For example, `db_groups: [db_editor, db_viewer]` is now valid. Previously, array values were only supported using the API. For more information, refer to [Extended attributes](/docs/dbt-cloud-environments#extended-attributes).
- **Beta**: The Redshift adapter now supports a `datasharing` profile credential on the <Constant name="dbt_platform" /> **Latest** release track. When set to `true`, dbt uses Redshift's native `SHOW` commands (for example, `SHOW TABLES`, `SHOW COLUMNS`, `SHOW SCHEMAS`) for metadata queries instead of PostgreSQL catalog tables, enabling cross-database and cross-cluster access with [Redshift Datasharing](https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html). For more information, refer to [Redshift setup](/docs/local/connect-data-platform/redshift-setup#datasharing).
- **Enhancement:** When a connection does not have platform metadata credentials configured yet, the credentials form now renders in edit mode immediately &mdash; you no longer need to click **Add credentials** first. If you cancel, the **Add credentials** button appears so you can return to the form. Existing connections with configured platform metadata credentials are unaffected. Refer to [Configure the warehouse connection](/docs/explore/external-metadata-ingestion#configure-the-warehouse-connection) for more information.
- **New**: The [dbt Remote dbt MCP server](/docs/dbt-ai/about-mcp?version=2.0) now supports Admin API calls! This allows users to troubleshoot job-related errors in agents like Claude and Cursor.
- **New**: The [Developer agent](/docs/dbt-ai/developer-agent) is now in beta. Use the Developer agent to write or refactor dbt models from natural language, generate documentation, tests, semantic models, and SQL code from scratch, giving you the flexibility to modify or fix generated code. For more information, refer to the [Developer agent](/docs/dbt-ai/developer-agent).
- **Enhancement:** The Studio IDE now validates dbt YAML using <Constant name="fusion" /> aligned JSON Schema from [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema) across [dbt platform release tracks](/docs/dbt-versions/cloud-release-tracks), including for development environments on <Constant name="core" />. This improves autocomplete and structural feedback in the editor. Diagnostics can occasionally disagree with what your environment accepts; use dbt runs and previews as the source of truth. For context, review [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec) and [dbt YAML validation in Studio](/docs/platform/studio-ide/develop-in-studio#dbt-yaml-validation). This will be a phased rollout starting the week of April 6th.
- **Enhancement:** The Studio IDE status bar now offers more control, more detailed information, and quicker access to settings for deferral, dbt version, and project status. For more information, refer to the [Studio IDE docs](/docs/platform/studio-ide/ide-user-interface#the-command-and-status-bar). These updates roll out in phases to existing accounts starting April 6.
- **Enhancement:** In Snowflake **Private endpoints**, output validation errors now display inline beneath the text area (instead of as a page-level banner). The **Submit request** button is also disabled when the output is invalid (for example, empty, malformed JSON, or missing required fields).

## March 2026

### March 25, 2026

- **New:** When a run using the dbt Fusion engine fails, a banner now appears on the run details page with options to debug the failure in Studio IDE. If dbt Copilot is enabled, you can also open a guided fix-with-Copilot workflow directly from the banner. Contact your account manager to enable.
- **Enhancement:** The bottom console pane now opens at a preferred size of 33% of the available space, providing a more consistent default layout.
- **Enhancement:** File search now reports results incrementally on a per-file basis rather than per-match line, reducing memory pressure and improving perceived responsiveness during large searches.
- **Enhancement:** When Studio IDE applies multi-file edits (for example, from dbt Copilot agent tasks), it now only updates editor models for files that are already open. Previously, every edited file was opened in a new tab, which cluttered the editor.
- **Enhancement:** You can now set `fusion_migration_enabled` on a project via the project update API. Enabling it requires the `fusion_readiness_write` permission, and the project must meet all readiness prerequisites (supported adapter, supported dbt version, a successful run, and eligible jobs).
- **Enhancement:** The jobs list endpoint (`GET /api/v2/accounts/{account_id}/jobs/`) now accepts an `is_fusion_ready` boolean query parameter. When `true`, it returns only conformant or override-ready jobs; when `false`, it returns only non-ready jobs. You can also include `fusion_readiness` in the `include_related` parameter to surface Fusion readiness details alongside the job response.
- **Enhancement:** When adding platform metadata credentials for a connection, the credential form is now shown immediately instead of requiring you to click an "Add credentials" button first.
- **Fix:** Fixes a bug where resource counts in the navigation tree were not refreshed when switching environments. You should now see up-to-date counts after changing the active environment.
- **Fix:** A new cleanup job detects runs and run steps that have exceeded the maximum allowed duration and marks them as `CANCELLED`, preventing stale in-progress states from accumulating.
- **Fix:** The Semantic Layer Gateway now retries the initial connection when a Snowflake warehouse is waking up from auto-suspend, instead of failing immediately. You should see fewer connection errors when querying the Semantic Layer after a period of inactivity.
- **Fix:** Fixed an issue where group permission sync could miss updates for groups with many permissions.
- **Behavior change:** Studio IDE now enables Fusion OpenTelemetry (OTel) log rendering for all invocations running on a Fusion core version, removing the previous feature flag requirement. If you are running a Fusion core version, you automatically receive OTel-based log output without any additional configuration.

### March 18, 2026

- **Enhancement:** Studio IDE now reuses its file-search index across searches, so repeated searches return results faster.
- **Enhancement:** Studio IDE debounces rapid file change events and avoids applying stale responses, so Git status badges update more reliably during bulk edits and saves.
- **Enhancement:** The server status popover uses a clearer grouped layout and action buttons to help you troubleshoot development credentials and server health. Please contact your account manager to enable.
- **Enhancement:** Copilot and agents can use a product documentation toolset to answer product and workflow questions more reliably.
- **Enhancement:** You can open Copilot in a dedicated full-screen view for a more focused chat and coding workflow. Please contact your account manager to enable.
- **Enhancement:** Copilot now references your active file by path instead of automatically attaching the file contents, which reduces message size and improves chat reliability.
- **Enhancement:** Copilot can run `dbt-autofix` commands (with confirmation) and stream the output into chat, and Studio IDE agents can run `dbt-autofix` using `run_autofix` for bulk deprecation fixes and migrations.
- **Enhancement:** Catalog search now groups non-standard materializations under a single "Custom" filter, so you can narrow results without picking each materialization type.
- **Enhancement:** Insights can resolve missing Redshift query IDs from warehouse query history when artifacts do not include them, improving cost coverage for runs with executions.
- **Enhancement:** If dbt Copilot is temporarily locked for your account, you can still open Copilot from Insights to see lock details.
- **Enhancement:** Run details now include who triggered or canceled a run (user or service token), which helps you audit run activity.
- **Enhancement:** When an environment uses a custom branch, dbt platform now carries that branch through run triggers, retries, and reruns more consistently.
- **Enhancement:** You can now retrieve Fusion readiness signals for projects, environments, and jobs to support Fusion migration planning. Please contact your account manager to enable.
- **Enhancement:** Orchestration now reads the invocation name from `run_results.json` using `command` when `invocation_command` is missing, so you see the correct dbt command in run details.
- **Enhancement:** Run step history ingestion now drops invalid events and de-duplicates redundant step-start events before writing step data, improving step-level accuracy. Please contact your account manager to enable.
- **Enhancement:** You can now add project descriptions of up to 1,024 characters.
- **Enhancement:** You can now open a connection directly from the connection profile table in a new tab.
- **Enhancement:** You now get more consistent validation and clearer error messages for invalid YAML syntax, null values, and non-object YAML content when you edit extended attributes.
- **Enhancement:** Cached query results can now be matched and reused more reliably when your query includes filters, which can reduce repeated compilation and improve response times.
- **Fix:** Retries now only apply to transient errors during Cloud Config lookups, so you should see fewer intermittent failures without added delay for permission, authentication, or not-found responses.
- **Fix:** If you are already authenticated and land on `/login` with `current_email`, dbt platform now redirects you to `/api/auth/auth-login/` so the email is forwarded during sign in.
- **Fix:** Turning IP restrictions on or off now updates form state correctly, so your changes save as expected.
- **Fix:** The audit log date range defaults no longer shift during re-renders, so your filters stay stable while you review results.
- **Fix:** Domain updates during Single Sign-On (SSO) migration no longer rely on mutating existing provider data, which improves save reliability.
- **Fix:** If your OpenAI credentials include invalid characters, you now get a clearer error message so you can correct the configuration.
- **Fix:** Encrypted credential fields now stay optional when you edit credentials, which reduces unexpected validation failures.
- **Fix:** You now see the correct connection details more consistently when you edit an environment that uses global connections and connection profiles.
- **Fix:** You can now open and review run steps for ingestion-triggered runs.
- **Fix:** Run results no longer populate an error string with `None` when dbt does not provide a message or failure count, so you see clearer run error details.
- **Fix:** When Orchestration cannot restore the repository cache because the dbt project is missing or malformed, it now returns an invalid project error so you get a more actionable message in run results.
- **Fix:** Snapshots selected but not executed in multi-step runs now appear with a skipped status instead of missing run status fields.
- **Fix:** Insights now clears the Copilot chat loading state reliably after responses complete or error, so you can keep chatting without refreshing the page.
- **Fix:** When you arrive in Insights with a Copilot handoff message, Insights now starts the handoff once and clears stale handoff state when you navigate directly.
- **Fix:** Semantic Layer now derives explicit string conversions from returned result metadata, so categorical dimensions and entities are more consistently typed as strings in Tableau and Power BI queries.
- **Fix:** Cache invalidation no longer fails when an in-memory cache key is already missing, which reduces intermittent errors during cache cleanup.
- **Fix:** Semantic Layer now requests and caches run details scoped to your account, which reduces incorrect run validation results.
- **Fix:** If you cancel a request while an agent is running tools, the agent now recovers cleanly instead of getting stuck on incomplete tool-call history.
- **Fix:** Studio IDE now removes the accept and reject overlay when you leave an artificial intelligence (AI) diff view to prevent stale UI controls.
- **Behavior change:** Studio IDE now uses VS Code Quick Open for file search (`Cmd+P` or `Ctrl+P`) and the VS Code Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) instead of the legacy Studio dialogs.
- **Behavior change:** Tableau and Power BI queries can no longer request `MIN()` or `MAX()` for a metric or dimension (except time min-max queries), and you now receive a clear error if you attempt it.

### March 11, 2026

- **New:** You can request a new Snowflake private endpoint from account settings by pasting the output from `SELECT SYSTEM$GET_PRIVATELINK_CONFIG();`, then track request status in the private endpoints table. This is available for Enterprise Business Critical accounts only, and please contact your account manager to enable. For other connection types, contact support@dbtlabs.com.
- **Enhancement:** You can now retry failed runs as long as your environment is on dbt Core version `1.6` or higher or dbt Fusion.
- **Enhancement:** Slack channel discovery and notifications now retry on Slack rate limits to reduce dropped messages during busy periods.
- **Enhancement:** OpenAPI schemas now mark 64-bit integer fields as `format: int64` to improve generated client types.
- **Enhancement:** Credentials OpenAPI docs now use a `type` discriminator (`postgres`, `redshift`, `snowflake`, `bigquery`, and `adapter`) to improve code generation and request validation.
- **Fix:** Searching jobs with numeric terms (for example, `12`) no longer triggers API validation errors, so you can load job lists reliably.
- **Fix:** When dbt platform cannot fetch a publication artifact for an upstream project declared in `dependencies.yml`, you now see which project is missing an artifact and guidance to run the upstream environment at least once.
- **Fix:** Microsoft Teams notifications now use the correct trigger event type for each notification, so you see the expected run outcome context in the message.
- **Fix:** You now receive more accurate errors from permission checks, and underlying service errors surface instead of being reported as authorization failures.
- **Fix:** Creating a private endpoint now returns a `400` error with a clear message when `snowflake_output` is malformed or not valid JSON.
- **Behavior change:** You now see an informational notice instead of the Model timing chart for dbt Fusion runs because dbt Fusion handles threading differently.
- **Behavior change:** SCIM schema discovery now reports `id` fields as strings for users and groups.

### March 4, 2026

- **Enhancement:** Job settings now describe state-aware orchestration (SAO) as only building models when data or code changes are detected.
- **Enhancement:** Fusion cost optimization settings now link to account-level Cost Insights settings and setup documentation so you can validate cost data and savings.
- **Enhancement:** When you enable manual updates for System for Cross-domain Identity Management (SCIM), dbt platform now asks you to confirm so you do not accidentally allow changes outside your identity provider.
- **Enhancement:** SCIM has been updated so that when a SCIM-provisioned user with an expired invite is added to a SCIM-managed group through a SCIM request, the invite is automatically resent during group assignment. This helps prevent errors caused by unaccepted invites.
- **Enhancement:** Projects with missing names now show as "Untitled Project," and you can save project descriptions as empty.
- **Enhancement:** Studio IDE no longer shows "Open Settings" buttons in editor notifications because Studio IDE does not expose VS Code settings, and the action would not help you resolve issues.
- **Fix:** Catalog no longer gets stuck loading the file tree on initial page load.
- **Fix:** Trust signals now suppress less-severe upstream-source issues when a more severe issue is present, so badges and messages are easier to interpret.
- **Fix:** When dbt platform cannot decrypt a deploy key, you now get a clearer failure instead of a generic git credentials error.
- **Fix:** If authentication fails when you connect to the Language Server Protocol (LSP) WebSocket, the connection now closes cleanly instead of failing with an internal server error, so you should see fewer unexpected disconnects.
- **Fix:** Reduced environment setup timeouts and resolved intermittent authentication failures during busy periods.
- **Fix:** If your development connection credentials are invalid, you now see a clearer error message to help you diagnose the issue faster.
- **Behavior change:** dbt platform now treats `versionless` as deprecated and updates existing environments and jobs to use `latest`. If you set `dbt_version` in an API integration or automation, update it to send `latest` instead.
- **Behavior change:** If you send events that include a `run_id`, you must also provide an `account_identifier` so the service can validate and resolve the correct account before dispatch. If `account_identifier` is missing, the event fails instead of falling back to a `run_id`-only lookup.

- **Enhancement:** The environment [Connection profiles](/docs/platform/about-profiles#environment-profiles-table) page has been updated. The profile name is now a clickable button that opens the view/edit drawer, the Connection column links to the connection details page in a new tab, and in edit mode a **swap icon** button lets you change the assigned profile. The previous ellipsis menu has been removed. For details, refer to [About profiles](/docs/platform/about-profiles).
-  **Beta:** Apache Spark is now supported in the <Constant name="fusion_engine" /> CLI, enabling faster compilation and execution for Spark-based dbt projects. <Constant name="fusion" /> currently supports only Apache Spark 3.0. For more information, refer to [Connect Apache Spark to Fusion](/docs/local/connect-data-platform/spark-setup).
- **Enhancement:** [Cost Insights](/docs/explore/cost-insights) charts now include an **Assets** filter (**Models** / **Tests** / **All**) on the **Cost**, **Usage**, **Query run time**, and **Builds** tabs. Use the dropdown on each chart to filter the data you want to view; your selection is stored per tab. The former **Model builds** tab is now labeled **Builds**. For more information, refer to [Explore cost data](/docs/explore/explore-cost-data).
- **Enhancement:** [Deferral](/reference/node-selection/defer) now supports [user-defined functions (UDFs)](/docs/build/udfs). When you run a dbt command with `--defer` and `--state`, dbt resolves `function()` calls from the state manifest. This lets you run models that depend on UDFs without first building those UDFs in your current target.
- **Fix**: Status messages that exceed the 1024 character limit are now automatically truncated to prevent validation errors and run timeouts. Previously, long status messages could cause runs to fail with unhandled exceptions or result in lost status information. The system now logs when truncation occurs to help identify and optimize verbose status messages.
- **Fix:** Resolved an issue where [retrying failed runs](/docs/deploy/retry-jobs) that were triggered from Git tags would use the wrong commit. Previously, when runs were triggered from Git tags instead of branches, the system would enter a detached HEAD state, causing retries to use the latest commit on HEAD rather than the original tagged commit. The fix now correctly preserves and uses the original Git tag reference when retrying runs, ensuring consistency between the initial run and any retries.
- **New**: The [dbt MCP server](/docs/dbt-ai/about-mcp?version=2.0#product-docs) now includes product docs tools (`search_product_docs` and `get_product_doc_pages`) that let your AI assistant search and fetch pages from docs.getdbt.com in real time. Get responses grounded in the latest official dbt documentation rather than relying on training data or web searches, so you can stay in your development flow and trust the answers.  This allows you to stay in your development flow and trust. These tools are enabled by default with no additional configuration. Restart your MCP server if you don't see the product docs tools in your MCP config. For more information, refer to [the dbt MCP repo](https://github.com/dbt-labs/dbt-mcp?tab=readme-ov-file#product-docs).
- **Enhancement**: The Model Timing tab displays an informative banner for <Constant name="fusion_engine" /> runs instead of the timing chart. The banner explains "Model timing is not yet available for Fusion runs" and provides context about threading differences. Non-Fusion runs continue to show the timing chart normally.
- **Behavior change**: [Snowflake plans to increase](https://docs.snowflake.com/en/release-notes/bcr-bundles/un-bundled/bcr-2118) the default column size for string and binary data types in May 2026. `dbt-snowflake` versions below v1.10.6 may fail to build certain incremental models when this change is deployed. [Assess impact and take any required actions](/reference/resource-configs/snowflake-configs#assess-impact-and-required-actions).
- **New**: The new <Constant name="semantic_layer"/> YAML specification is now available on the <Constant name="dbt_platform" /> **Latest** release track. For an overview of the changes and steps how to migrate to the latest YAML spec, refer to [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec).
- **Behavior change:** New projects in trial, starter, or Enterprise accounts now default to **Fusion Latest** for all new environments with a supported adapter (Redshift, Snowflake, BigQuery, and Databricks). You can revert to another version by changing the dbt version in your [environment settings](/docs/dbt-cloud-environments#change-environment-settings).

## February 2026

### February 25, 2026

- **New:** Saved query definitions (including tags, exports, parameters, and lineage relationships) are now captured during ingestion so they can participate in Catalog lineage and governance workflows.
- **Enhancement:** Run step structured logs now show an indicator when system warnings or errors are present, making issues easier to spot during run triage.
- **Enhancement:** Account Settings now shows the backend-provided region display name for clearer, more accurate region labeling.
- **Enhancement:** Changes to our UI to improve the experience of managing groups with SCIM enabled.
- **Enhancement:** After a user accepts an invite, the UI now explains that they must log in using SSO to fully redeem the invite and access the account. This replaces the previous "Joined successfully" message and helps avoid confusion when users accept an invite but do not complete the SSO login flow.
- **Enhancement:** Studio IDE now catches unexpected render failures with a top-level error boundary and shows Not Found more reliably for unknown in-project routes.
- **Enhancement:** The main navigation trigger area is now a navigation element with improved focus and labeling.
- **Enhancement:** When Visual Studio Code (VS Code) search is enabled, Studio IDE avoids unregistering Quick Open and suppresses conflicting command palette shortcuts.
- **Enhancement:** Source freshness Outdated status can now be computed at query time, improving freshness status filtering consistency.
- **Enhancement:** Search results better support column-level navigation and very long queries show a clear validation error, and lineage visuals have improved alignment and reduced edge clutter.
- **Enhancement:** Lineage graph building now includes cross-project dependencies and supports function nodes as first-class lineage entities.
- **Enhancement:** Projects APIs now explicitly support DELETE with stricter permission checks.
- **Behavior change:** Webhook payloads now include `runFinishedAt` only for completed events and `runErroredAt` only for errored events; canceled runs no longer include `runCanceledAt`, and run status is normalized from Cancelled to Canceled. Also note that enabling JSON preserve order can change key ordering, so consumers should parse JSON rather than string-compare payloads.
- **Behavior change:** Source freshness expiration windows can optionally derive from each source's freshness criteria rather than a fixed window. You must enable in your deployment.
- **Behavior change:** For very large `manifest.json` files, ingestion may strip sources above a configurable threshold to prevent out of memory failures. Set `SOURCE_INGESTION_THRESHOLD=0` if you must always ingest sources regardless of size.
- **Behavior change:** Deprecated settings `project_storage_bucket_name` and `project_storage_object_prefix` have been removed. Migrate to `object_storage_bucket_name` and `object_storage_object_prefix`.

### February 18, 2026

- **New:** Cost Insights shows estimated warehouse compute costs and run times for your dbt projects and models, directly in the dbt platform. It highlights cost reductions and efficiency gains from optimizations like state-aware orchestration across your project dashboard, model pages, and job details. This feature is in private beta. To request access, contact your account manager.
- **Enhancement:** Studio IDE can pause the Language Server Protocol (LSP) in background tabs and resume on return to improve stability when the editor is open in more than one tab.
- **Enhancement:** Adds a Visual Studio Code-style header showing a dbt badge and current project name, with an option to hide surrounding chrome for more editor space. Please contact your account manager to enable.
- **Enhancement:** Surfaces more actionable filesystem errors (for example, name too long and file-is-a-directory) instead of generic failures.
- **Enhancement:** Adds a Copy Relative Path action that respects `dbt_project_subdirectory` for quicker navigation and sharing.
- **Enhancement:** Improves user-facing errors for lineage failures (including server errors and cases where upstream returns HTML instead of JSON).
- **Enhancement:** Improves private endpoint filtering by adapter type and updates Studio IDE to use the correct version 3 private endpoints endpoint.
- **Enhancement:** Improves Comma-Separated Values (CSV) upload progress, resume behavior, and common error handling during Add Sources.
- **Enhancement:** Improves directed acyclic graph (DAG) performance by rendering only visible elements and improving layout for disconnected nodes.
- **Enhancement:** Improves keyboard and hover behavior in the search dropdown and avoids showing stale results while searches are loading.
- **Enhancement:** This change shows clearer invite status (invitation sent and invitation accepted) and supports accepted, login pending for Single Sign-On (SSO).
- **Enhancement:** The unpaid billing banner is no longer feature-flagged and will display when applicable, while billing link visibility remains permission-based.
- **Enhancement:** Bug fixes and improvements related to managed invites for easier processing.
- **Enhancement:** Adds Server-Sent Events (SSE) streaming control so clients can choose chunk streaming or message streaming. This enables more responsive Copilot experiences in environments that support streaming.
- **Enhancement:** Improves responsiveness for AI Similar Models and Similar Sources requests by enforcing tighter embedding and database timeouts aligned to request deadlines. Users should see faster, more consistent results when exploring related models.
- **Enhancement:** Categorizes OpenAI failures with Bring Your Own Key (BYOK) awareness so BYOK failures return the expected 424-class behavior instead of generic 500-series errors. This makes it easier to diagnose and resolve key or configuration issues.
- **Enhancement:** Updates dbt Model Context Protocol (MCP) tooling, including adding `get_all_macros` and improving error categorization, enabling more accurate responses.
- **Fix:** Ensures bulk edits stay in sync after server-side edits to prevent stale content from overwriting changes.
- **Fix:** Fixes preview and match highlighting assembly so match ranges align correctly in multi-line previews.
- **Fix:** Shows a proper error layout and notification on unrecoverable initialization failures.
- **Fix:** Prevents incorrect tab closing after uploads complete and avoids showing the floating node panel when not on a file tab.
- **Fix:** Fixes lineage resolution for public model parents when the producer model lives in a non-default environment.
- **Fix:** Fixes an OpenAI connection pool leak that could lead to out-of-memory (OOM) conditions under sustained load. Users should see fewer slowdowns during high-traffic periods.
- **Fix:** Reduces intermittent failures when attaching related models by increasing internal timeouts for related-model fetching. Users should experience fewer timeout errors when working with related models.
- **Behavior change:** Prevents rename and delete operations on the repository root and shows clearer warnings.
- **Behavior change:** Improves dbt command log streaming reliability by resuming from the last known Command Line Interface (CLI) event offset. Contact your account manager to enable.
- **Behavior change:** Job Admin now includes `profiles_write`, which can change what Job Admin users can do where Profiles are enabled.
- **Behavior change:** Version 3 Private Endpoints query parameter `name_search` is renamed to `search`, and search matches endpoint name and endpoint value.
- **Behavior change:** Postgres connection validation now requires a non-empty database name.
- **Behavior change:** Prevents associating the same active credentials object to multiple users, returning a conflict instead of silently duplicating associations.
- **Behavior change:** GitHub shared webhooks now accept repository URLs using https, git, and Secure Shell (SSH) formats.
- **Behavior change:** Slack linking and notification settings are more strictly gated by the relevant permissions.
- **Behavior change:** Slack integration listing now uses job notifications read permission, reducing incorrect permission-denied scenarios.
- **Behavior change:** Reduces default timeouts from 60 seconds to 5 seconds for Cloud Config and Cloud Artifact calls, causing requests to fail faster in high-latency environments unless overridden.
- **Behavior change:** Corrects the OpenTelemetry (OTel) log payload field name to `additional_message` (from the misspelled `addtional_message`), which may require updates to downstream parsing.

### February 11, 2026

- **Enhancement:** Improved model graph layout performance to reduce load time in larger projects.
- **Enhancement:** Similar Models lookup now uses an optimized vector search strategy to reduce timeouts on large projects.
- **Enhancement:** When your dbt project is in a subdirectory, the project root is highlighted in the Catalog file tree.
- **Enhancement:** Rename and delete actions now use native editor behaviors when using the Catalog file tree.
- **Enhancement:** Formatting updates now apply directly to the active editor buffer to reduce prompts and inconsistent results.
- **Enhancement:** Code generation no longer creates a temporary file in your repository during generation.
- **Enhancement:** Environment settings now prevent saving a Fusion dbt version with an incompatible connection and surface field level validation errors.
- **Enhancement:** When setting up a new connection, Fusion eligible adapters now default to the latest Fusion version to reduce misconfiguration during setup.
- **Enhancement:** Private Endpoints can be sorted by status and connections, and endpoint details now show associated connections and environments.
- **Enhancement:** Invocation event streaming is more reliable for long running jobs by deriving totals from the latest stream event identifier.
- **Enhancement:** Log streaming now cleans up Redis keys after a stream completes, reducing stale keys and Redis memory pressure for high volume runs.
- **Fix:** When users hit the usage limit, dbt disables Copilot and shows a clear message, including the reset date when available.
- **Fix:** Fixed duplicate Git status decorations in the file tree that could cause visual issues and performance impact.
- **Fix:** Studio IDE no longer runs an automatic pull on the primary branch to reduce unexpected changes during development.
- **Fix:** File operations now return structured validation errors and explicitly reject names that exceed operating system limits.
- **Fix:** Command logs for the dbt Cloud Command Line Interface (CLI) are refreshed and finalized more reliably.
- **Fix:** Scheduler triggered runs now include account context, improving run attribution and preventing some downstream triggers from running without proper context.
- **Fix:** Exposure generated events now validate that account identifiers are numeric before triggering follow on automation.
- **Fix:** Webhook payloads now include consistent completion and error timestamps, and canceled runs include a canceled timestamp and normalized status.
- **Fix:** When both failure and completion triggers are configured, errored runs may generate two webhook deliveries to match legacy behavior.
- **Fix:** Ingestion now accepts the `functions` section (for example, Snowflake user defined functions (UDF)) to prevent parse failures on newer manifest schemas.
- **Fix:** Macro metadata persistence now uses more consistent Coordinated Universal Time (UTC) timestamps and improves argument comparison to reduce noisy or incorrect macro updates.
- **Behavior change:** Profiles API responses no longer include credential configuration and extended attributes; use the appropriate credentials and configuration endpoints instead.
- **Behavior change:** Account Connections list supports filtering by Private Endpoint identifier for easier management.
- **Behavior change:** Private Endpoints list now supports ordering by endpoint state and connection count.
- **Behavior change:** User licenses now include read access for Private Link resources, which may change who can view Private Link related settings.
- **Behavior change:** Generated metrics are now written directly into the active model file instead of using an accept and reject diff flow.

### February 4, 2026

- **New:** Adds a link that opens Copilot from the console toolbar. You can use Copilot to read files and list directories for better context.
- **New:** Adds a command to copy a file path relative to your dbt project subdirectory, making it easier to share paths in runbooks and support tickets.
- **Enhancement:** Improves Fusion setup by showing "Fusion compatible" indicators during connection setup.
- **Enhancement:** When Compare Changes subqueries fail, the experience now surfaces a partial success state with expandable warning details to make troubleshooting faster.
- **Enhancement:** Improves log usability during in-progress runs by preserving text selection while logs auto-refresh and rerender.
- **Enhancement:** Adds server-side search and clearer loading and empty states to the job picker for job-completion triggers.
- **Enhancement:** Improves artifact handling for job documentation and run artifacts by strengthening HTML detection, defaulting empty paths to `index.html`, and returning clearer `Content-Type` and download filenames.
- **Enhancement:** Improves Private Endpoints API v3 list behavior with validated query parameters, filtering, limit and offset pagination, and `connection_count` in responses.
- **Enhancement:** Improves formatting reliability by consistently using the active editor content and a stable repo-relative path when invoking formatting.
- **Enhancement:** Reduces errors when working with non-file tabs and improves robustness around tab-close and Git checkout flows.
- **Enhancement:** Improves embedded panel sizing to reduce clipping and scrolling issues in the sidebar.
- **Enhancement:** Improves Fusion banners and prompts by checking project eligibility via a Fusion status endpoint to reduce confusing prompts for ineligible projects.
- **Enhancement:** Improves cross-project lineage ("public ancestors") computation to better match expected external lineage boundaries in dbt Mesh experiences.
- **Enhancement:** Standardizes Copilot Agent requests to the API and includes active tab content as context to improve reliability of agent runs and handoff.
- **Fix:** Improves webhook subscription editing reliability with asynchronous data and fixes a multiselect focus issue that could cause accidental option selection.
- **Fix:** Fixes HTML email markup that could break rendering for run warning notifications.
- **Fix:** Profile create and view routes now live under `/dashboard/:accountId/projects/:projectId/profiles/...`, which may affect bookmarks and direct links.
- **Fix:** Removes hidden background commands (such as listing and parsing commands) from command history to reduce noise for users.
- **Fix:** Improves robustness of inline compile and show output attachment, including cases with tricky quoting and newlines, reducing missing results during interactive use.
- **Fix:** Fixes log download behavior so downloads correctly serve either the active `dbt.log` or the finalized compressed log.
- **Fix:** Fixes edge cases where gzipped artifacts (such as manifests) could fail to upload due to upload stream handling, improving upload reliability.
- **Fix:** Reduces noisy disconnect and cleanup errors when multiple websocket connections and processes map to the same invocation, improving session stability.
- **Fix:** Fixes search result highlighting when the backend returns multiple highlights per field, improving readability of matches. Updates search highlights to display as compact badges with counts for easier scanning of results.
- **Fix:** Improves environment-scoped Catalog search filtering by using merged environment identifiers and preserving warehouse-only assets via a dedicated sentinel value.
- **Fix:** Improves behavior for environments with no public models by returning an empty list instead of falling into follow-on query logic.
- **Fix:** Improves keep-alive behavior so connections shut down cleanly when the client disconnects, reducing noisy failures.
- **Fix:** Prevents failing tool calls by hiding Semantic Layer tools when the Semantic Layer is not available for the user or environment.
- **Fix:** Improves error reporting by walking wrapped exceptions and exception groups to return the most specific status code and detail available.
- **Fix:** Treats empty tool outputs as valid results (for example, "no matches") to reduce unnecessary "tool call failed" errors.
- **Behavior change:** During connection setup, the default dbt version now only defaults to `latest-fusion` when the selected adapter is Fusion-compatible and the project and account are eligible.
- **Behavior change:** dbt version "allowed version" checks now account for `project_id` across jobs and environments, including Application Programming Interface (API)-triggered runs, improving correctness for overrides and automatic mapping to allowed equivalents when possible.
- **Behavior change:** Refresh token expiration for connected app OAuth flows increased from 8 hours to 7 days, reducing re-authorization frequency.
- **Behavior change:** File stat responses now return modified time and created time as integer milliseconds since epoch instead of float seconds; integrations consuming these endpoints may need to adjust.
- **Behavior change:** The Language Server Protocol (LSP) websocket now supports `defer_env_id` to defer against a specific environment and `no_defer=true` to explicitly disable deferral.
- **Behavior change:** When "defer to production" is turned off, the Studio Integrated Development Environment (IDE) now passes `no_defer=true` to align editor intelligence with the selected deferral behavior. (Language Server Protocol (LSP))
- **Behavior change:** The freshness status value `outdated` was removed; unconfigured freshness is now handled explicitly as `unconfigured`, and sources will no longer report `outdated`.
- **Behavior change:** The rows-per-page selector was removed, and pagination now uses a fixed page size.
- **Behavior change:** Cached nodes are now consistently surfaced as Reused with clearer reasons, and stale outcomes are treated as errors, which can change the statuses operators see in run output and telemetry.

- **New**: Advanced CI (dbt compare in orchestration) is now supported in the <Constant name="fusion_engine" />. For more information, review [Advanced CI](/docs/deploy/advanced-ci).
- **Beta**: The `dbt-salesforce` adapter available in the <Constant name="fusion_engine" /> CLI is now in beta. For more information, refer to [Salesforce Data 360 setup](/docs/fusion/connect-data-platform-fusion/salesforce-data-cloud-setup).
- **Enhancement:** The Analyst permission now has the project-level access to read repositories. Review [Project access for project permissions](/docs/platform/manage-access/enterprise-permissions#project-access-for-project-permissions) for more information.
- **Enhancement:** After a user accepts an email [invite](/docs/platform/manage-access/invite-users) to access an [SSO-protected](/docs/platform/manage-access/sso-overview) <Constant name="dbt_platform"/> account, the UI now prompts them to log in with SSO to complete the process. This replaces the previous "Joined successfully" message, helping avoid confusion when users accept an invite but do not complete the SSO login flow.
- **New:** [Profiles](/docs/platform/about-profiles) let you define and manage connections, credentials, and attributes for deployment environments at the project level. dbt automatically creates profiles for existing projects and environments based on the current configurations, so you don't need to take any action. This is being rolled out in phases during the coming weeks.
- **New**: [Python UDFs](/docs/build/udfs) are now supported and available in <Constant name="fusion_engine" /> when using Snowflake or BigQuery.
- **Enhancement:** Minor enhancements and UI updates to the <Constant name="studio_ide" />, file explorer that replicate the VS Code IDE experience.
- **Enhancement:** Profile creation now displays specific validation error messages (such as "Profile keys cannot contain spaces or special characters") instead of generic error text, making it easier to identify and fix configuration issues.
- **Private beta**: [Cost Insights](/docs/explore/cost-insights) shows estimated warehouse compute costs and run times for your dbt projects and models, directly in the <Constant name="dbt_platform" />. It highlights cost reductions and efficiency gains from optimizations like [state-aware orchestration](/docs/deploy/state-aware-about) across your project dashboard, model pages, and job details. Refer to [Set up Cost Insights](/docs/explore/set-up-cost-insights) and [Explore cost data](/docs/explore/explore-cost-data) to learn more.
- **New**: The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) now supports [Omni](https://docs.omni.co/integrations/dbt/semantic-layer) as a partner integration. For more information, refer to [Available integrations](/docs/platform-integrations/avail-sl-integrations).
- **Enhancement**: We clarified documentation for cumulative log size limits on run endpoints, originally introduced in [October 2025](/docs/dbt-versions/2025-release-notes#october-2025). When logs exceed the cumulative size limit, dbt omits them and displays a banner. No functional changes were made in February 2026. For more information, review [Run visibility](/docs/deploy/run-visibility#log-size-limits).
- **New**: The `immutable_where` configuration is now supported for Snowflake dynamic tables. For more information, refer to [Snowflake configurations](/reference/resource-configs/snowflake-configs#immutable-where).
- **Fix**: The user invite details now show more information in invite status, giving admins visibility into users who accepted an invite to an SSO-protected account but haven't yet logged in via SSO. Previously, these invites were hidden, making it appear as if the user hadn't been invited. 
The Invites endpoints of the dbt platform Admin v2 API now include these additional statuses:
  - `4` (PENDINGEMAIL_VERIFICATION)
  - `5` (EMAIL_VERIFIED_SSO).
- **Enhancement**: Improved performance on Runs endpoint for Admin V2 API and run details in dbt platform when connecting with GCP.

## January 2026

### January 28, 2026

- **New:** Use `POST /v1/workspaces/{workspace_id}/upload-source` to create an upload, then `PATCH /v1/workspaces/{workspace_id}/upload-source/{file_id}/process` to stream processing progress (SSE).
- **Enhancement:** Ranking now boosts results by modeling layer, and highlighting is more consistent (including support for multiple highlight snippets per field).
- **Enhancement:** The dbt platform now includes a Private Endpoint details view with endpoint properties, connectivity status, and associated projects.
- **Enhancement:** Connection setup and environment creation can now default to `latest-fusion` for eligible projects.
- **Enhancement:** Adds a dedicated sidebar search experience. Please contact your account manager to enable.
- **Enhancement:** Upgrade flows can proceed from fixing deprecations into package upgrades in the same guided run.
- **Enhancement:** Fixed multiple layout/styling issues for a more consistent editor experience.
- **Fix:** Improved rendering and cleanup of escape sequences in step logs.
- **Fix:** Freshness status is preserved when a run lacks freshness results but freshness remains configured.
- **Fix:** Ingestion now tolerates missing/null `schema` fields in the manifest to avoid failures.
- **Fix:** Sync skips missing symlink targets instead of failing the whole sync.
- **Fix:** Aborting a command that no longer exists returns a specific "no-command-found" response.
- **Fix:** Malformed inline commands no longer break result processing; `show --inline` with an empty result returns an empty preview table.
- **Fix:** Creating an uploaded-source model with a duplicate name now returns HTTP 409 with an actionable message.
- **Fix:** Uploaded-source processing records failure state instead of deleting the file record, improving retry/resume workflows.
- **Fix:** The invocation status SSE endpoint now correctly awaits the status stream.
- **Behavior change:** `AccountSearchHit.highlight` and `AccountSearchHit.matchedField` are deprecated. `AccountSearchHit.highlights` now supports multiple highlight snippets per field (arrays).
- **Behavior change:** The "Adaptive" job type is deprecated. `last_checked_at` is deprecated and no longer populated in run responses.
- **Behavior change:** Migrate to the new two-step [upload source](/docs/platform/use-canvas#upload-data-to-canvas) flow.

### January 21, 2026

- **New:** Add resources to favorites and organize your frequently accessed resources in the Catalog navigation.
- **New:** You can now retrieve individual PrivateLink endpoints by ID, enabling better automation and troubleshooting workflows.
- **Enhancement:** Find specific artifacts faster in run history with the new artifacts search box and improved empty states.
- **Enhancement:** The webhook form no longer resets while job options are loading, and server-generated fields now display reliably after creation.
- **Enhancement:** After completing the Fusion onboarding checklist, you can now dismiss the card and it will stay dismissed.
- **Enhancement:** Cross-project lineage is now enabled for all applicable accounts.
- **Enhancement:** Enhanced search scoring and matching provides more accurate results, with better column matching and highlighting for large catalogs.
- **Enhancement:** Column name and description updates now automatically trigger re-indexing, ensuring search results stay current.
- **Enhancement:** Quickly access full search results from the typeahead dropdown with the new footer link.
- **Enhancement:** The environment selector now only shows "Staging" when your account has projects with a staging environment configured.
- **Enhancement:** IDE-related endpoints now return more specific and helpful error messages for common configuration issues and timeouts.
- **Enhancement:** Enhanced command log viewer with improved download capabilities and more consistent error log viewing.
- **Fix:** dbt Copilot generated documentation now correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.
- **Fix:** Auto-generated exposures now appear correctly in lineage views.
- **Fix:** Search now handles missing connection names gracefully without causing errors.
- **Fix:** Requests with invalid authentication tokens now fail safely with clear error messages.
- **Fix:** Commands that can't be fetched are now properly marked as failed instead of staying in a "running" state.
- **Fix:** Job deferral settings are now validated to ensure the deferring job and environment exist within the same account, with improved error messages.
- **Behavior change:** Tables in Account Insights now display 5 rows per page by default (previously 10).
- **Behavior change:** All webhook timestamp fields (`run_started_at`, `run_finished_at`, `timestamp`) now use UTC with `Z` suffix and higher precision. Missing/invalid timestamps emit `1970-01-01T00:00:00Z` instead of empty strings. Update webhook consumers if needed.
- **Behavior change:** Update webhook consumers that parse this status value strictly.
- **Behavior change:** Projects with more than 5,000 exposures will skip exposure ingestion to prevent performance issues. All other artifact ingestion continues normally. Contact support if you need to increase this limit.

### January 14, 2026

- **New:** Added an API endpoint to determine whether a project is eligible for Fusion migration.
- **Enhancement:** Agent tool execution errors now return structured responses instead of failing the entire run.
- **Enhancement:** Agent toolsets include additional retrieval and search capabilities for more relevant responses.
- **Enhancement:** Azure OpenAI connection verification now uses GPT-5-compatible parameters for GPT-5 deployments.
- **Enhancement:** Added support for Azure Foundry URLs with automatic endpoint parsing to reduce setup friction.
- **Enhancement:** Build SQL queries against the Semantic Layer without writing SQL code.
- **Enhancement:** Search scoring prioritizes exact and multi-term matches more strongly, with better highlighting and column-description matching.
- **Enhancement:** Search labels are more consistent, and the embedded lineage view loads more responsively.
- **Enhancement:** Studio now loads a single unified IDE package.
- **Enhancement:** Studio now respects `dbt-cloud.defer-env-id` settings when Cloud CLI runtime is supported.
- **Enhancement:** Download and copy behavior for command logs is more consistent, including debug logs.
- **Enhancement:** The IDE now supports multiple explicit edits in one request with safer validation.
- **Enhancement:** Session creation returns clearer error messages and guidance for setup issues.
- **Enhancement:** Settings detail experiences now use an improved drawer-based UI.
- **Enhancement:** Profile creation now handles dependencies and failures more gracefully.
- **Enhancement:** Logs for in-progress runs are also limited by memory usage, in addition to the existing 1,000-line limit.
- **Fix:** The Profiles API now allows unsetting extended attributes by setting `extended_attributes_id` to null.
- **Fix:** Recently viewed entries now update atomically and retain the 5 most recent items.
- **Fix:** Debug logs for completed runs now consistently fetch only the tail of the log.
- **Fix:** CLI flags to disable caching are now positioned correctly to avoid parsing issues.
- **Fix:** Fixed argument ordering so `--no-defer` is interpreted consistently.
- **Behavior change:** dbt v1.7 is now labeled as end-of-life in version lifecycle messaging.

### January 7, 2026

No changes of note this week.

- **Enhancement:** The `defer-env-id` setting for choosing which deployment environment to defer to is [now available](/docs/platform/about-cloud-develop-defer#defer-environment) in the <Constant name="studio_ide" />. Previously, this configuration only worked for the <Constant name="platform_cli" />
- **Beta:** The [Analyst agent](/docs/explore/navigate-dbt-insights#dbt-copilot) in dbt <Constant name="insights" /> is now in beta. 
  - dbt <Constant name="copilot" />'s AI assistant in <Constant name="insights" /> now uses a dropdown menu to select between **Agent** and **Generate SQL**, replacing the previous tab interface.
- **Enhancement:** The [Studio IDE](/docs/platform/studio-ide/ide-user-interface#search-your-project) now includes search and replace functionality and a command palette, enabling you to quickly find and replace text across your project, navigate files, jump to symbols, and run IDE configuration commands. This feature is being rolled out in phases and will become available to all <Constant name="dbt_platform" /> accounts by mid-February. 
- **Enhancement:** [State-aware orchestration](/docs/deploy/state-aware-about) improvements:
  - When a model fails a data test, state-aware orchestration rebuilds it on subsequent runs instead of reusing it from prior state to ensure dbt reevaluates data quality issues.
  - State-aware orchestration now detects and rebuilds models whose tables are deleted from the warehouse, even when there are no code or data changes. Previously, tables deleted externally were not detected, and therefore not rebuilt, unless code or data had changed. For more information, review [Handling deleted tables](/docs/deploy/state-aware-about#handling-deleted-tables). 

  State-aware orchestration is in private preview. refer to the [prerequisites for using the feature](/docs/deploy/state-aware-setup#prerequisites).
- **Enhancement:** [dbt <Constant name="copilot" />](/docs/platform/dbt-copilot) correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.
- **Enhancement**: The <Constant name="fusion"/> CLI now automatically reads environment variables from a `.env` file in your current working directory (the folder you `cd` into and run dbt commands from in your terminal), if one exists. This provides a simple way to manage credentials and configuration without hardcoding them in your `profiles.yml`. The [dbt VS Code extension](/docs/about-dbt-extension) also supports `.env` files as well as <Term id="lsp" />-powered features. For more information, refer to [Install <Constant name="fusion"/> CLI](/docs/local/install-dbt?version=2#get-started#environment-variables). 
- **New**: The new <Constant name="semantic_layer"/>  YAML specification creates an open standard for defining metrics and dimensions that works across multiple platforms. The new spec is now live in the <Constant name="fusion_engine" />.
  
  Key changes:
  - Semantic models are now embedded within model YAML entries. This removes the need to manage YAML entries across multiple files.
  - Measures are now simple metrics. 
  - Frequently used options are now top-level keys, reducing YAML nesting depth.

  For an overview of the changes and steps how to migrate to the latest YAML spec, check [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec).
- **Fix:** Debug logs in the **Run summary** tab are now properly truncated to improve performance and user interface responsiveness. Previously, debug logs were not truncated correctly, causing slower page loads. You can access the full debug logs by clicking **Download > Download all debug logs**. For more information, review [Run visibility](/docs/deploy/run-visibility#run-summary-tab).
- **New:** The [Semantic Layer querying](/docs/explore/navigate-dbt-insights#semantic-layer-querying) within dbt <Constant name="insights" /> is now generally available (GA), enabling you to build SQL queries against the Semantic Layer without writing SQL code.
- **Enhancement**: Eligible <Constant name="dbt_platform" /> accounts in the <Constant name="fusion" /> private preview can now use [Exposures](/docs/platform-integrations/downstream-exposures). 

## December 2025

### December 24, 2025

- **New:** Analysts can now drop `@path` references in the bundled CLI to stream local files into `/private/v1/agents/run`, which are auto-rendered as text inside the run so copilots have the exact config or SQL snippet you referenced.
- **New:** Copilot replies now carry inline "Did that answer your question?" buttons, so you can rate answers without leaving Slack.
- **New:** A Databricks history provider and DBU-based cost query now surface daily model cost alongside Snowflake coverage, so Databricks tenants get unified FinOps reporting.
- **New:** The CSV upload endpoint is now generally available.
- **Enhancement:** Attachment workflows now only recommend meaningfully related models.
- **Enhancement:** Settings consolidate SSO + SCIM, add an empty state for auto-generated slugs, and render read-only login URLs so admins can start configuration without touching slug fields.
- **Enhancement:** Token tables gain fixed pagination, inline search, consistent iconography, and clearer deletion warnings to avoid accidental cuts to live integrations.
- **Enhancement:** The v3 API/UI now allow up to 20 scoped environment variables before enforcing limits, giving larger projects more room for secrets.
- **Enhancement:** SELECT * RENAME/EXCEPT support now respects each warehouse's syntax using schema metadata, so SQL previews and column metadata stay accurate across Snowflake, Databricks, BigQuery, and Redshift.
- **Fix:** Default values are cached after the first render and stop resetting once the user edits the form, eliminating accidental job-list clearing while tabbing through fields.
- **Fix:** `parentsModels` and `parentsSources` now derive from the manifest's `parents` list, so exposures with mixed upstreams display complete lineage in both the GraphQL API and UI.
- **Behavior change:** All cost management pages and hooks were removed, and platform metadata credentials now only expose catalog ingestion and Cost Insights toggles, eliminating dead-end controls.

### December 17, 2025

- **New:** A new `/accounts/<id>/feature-licenses` endpoint issues short-lived JWTs that encode entitled features, and service/PAT authentication now checks that a caller holds an active license on the target account before any Fusion-enabled workflow runs.
- **New:** Databricks warehouses can register platform metadata credentials (token plus optional catalog), enabling catalog ingestion, metadata sharing, and Cost Insights pipelines without custom adapters.
- **Enhancement:** Settings's Projects and Credentials now paginate after 25 rows (with search boxes and skeleton states), keeping navigation responsive for large deployments.
- **Enhancement:** Model panels now show materialization type, lineage renders metadata strips only when content exists, and upstream public-model columns load automatically for better cross-project visibility.
- **Enhancement:** Source tiles respect the `meta5161ExpiredUnconfiguredSources` flag (showing warn/error thresholds) and "Open in IDE" links now point at `/studio/{accountId}/projects/{projectId}` to drop users directly into dbt Studio.
- **Enhancement:** The Copilot listener now hydrates builder tabs only when a semantic-layer payload arrives, preventing plain-SQL replies from overwriting editor state.
- **Enhancement:** File sync now anchors itself to the invocation directory, making monorepo structures behave more predictably. Nested `dependencies.yml` files correctly trigger dependency installs. The IDE's LSP and file sync now recognize dbt subdirectories properly. Exclusion lists remain accurate even in multi-project repositories.
- **Enhancement:** Outbound calls now persist the exact JSON body in webhook history, making allowlisting and troubleshooting easier.
- **Enhancement:** The file tree now mirrors Cloud VCS statuses (including conflicts) and automatically invalidates caches after `dbt deps`/`dbt clean`, so new or removed files appear without a reload.
- **Enhancement:** Command and interactive query logs adopt the new accordion-based viewer, and Autofix sessions in Fusion treat plain `parse` commands as the trigger for deprecation summaries, keeping remediation flows consistent.
- **Fix:** Editing one variable no longer backfills blank cells with previously edited values, preventing accidental overrides.
- **Fix:** Job pages once again display "Cost optimization features" whenever Fusion actually runs (and gating conditions are met), so users see the right coverage status regardless of feature-flag permutations.
- **Behavior change:** Service/PAT calls without an active license now fail authentication, Slack Copilot sessions build a scoped identity JWT for the invoking user, and SSO providers enforce auto-generated slugs (draft configs can't be targeted), reducing misconfiguration risk.
- **Behavior change:** Every invocation lookup validates the caller's user ID, preventing admins from accidentally reading another developer's runs when multiple accounts share a CLI server.
- **Behavior change:** Support impersonation sessions now restrict the execution of `show`, `run`, `build`, and `test` commands. Artifacts generated by `dbt show` are also short-lived and will automatically expire after 15 minutes to limit unintended data retention.
- **Behavior change:** Fusion tracks now treat `dbt compare` as a supported command (no more target-path hacks).

### December 10, 2025

- **Enhancement:** Streaming middleware enforces request-scoped instrumentation across every AI endpoint, offload warehouse calls via threads, and expose human-readable tool names while gating keyword search behind feature flag for approved tenants.
- **Enhancement:** Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped so troubleshooting is faster.
- **Enhancement:** Slack Copilot mentions are now more reliable, with hardened workers, support for CSV attachments, and improved logging. Webhook channels now accept longer URLs, handle "warning-only" subscriptions correctly, and automatically clean up corrupted job IDs.
- **Enhancement:** Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync.
- **Enhancement:** Improved stability and performance for large projects.
- **Enhancement:** For dbt Fusion logging, node start and end times will now properly be displayed in command output.
- **Enhancement:** Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps with clear UI labels.
- **Enhancement:** Tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking.
- **Fix:** Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier, making automation failures actionable.

### December 3, 2025

- **New:** When deprecations are detected, you now see "Autofix deprecation warnings."
- **New:** After running Autofix, you see a results panel with upgraded packages (with links), packages left unchanged and why, and quick access to `packages.yml` to help assess Fusion readiness and next steps.
- **Enhancement:** Clearer lint/format actions (SQLFluff, Prettier), better empty states, visible Config button when applicable, and simplified logs retrieval. Applies to SQL, JSON, YAML, and Markdown workflows.
- **Enhancement:** Upgraded editor for stability. Improved container sizing/overflow. "Save" overlay only appears when tabs are open. Minor action-bar refinements.
- **Fix:** Reliability improved by aligning with updated IDE and VS Code command APIs; eliminates intermittent skips.
- **Behavior change:** dbt Core "versionless" renamed to "latest" so it's consistent and clear across tenants.
