---
title: "Weekly dbt single-tenant release notes"
description: "Release notes for weekly single-tenant updates."
id: "dbt-cloud-release-notes-gen"
sidebar: "dbt single-tenant release notes"
pagination_next: null
pagination_prev: null
unlisted: true
---

<Constant name="dbt" /> Single-tenant release notes for weekly updates. Release notes fall into one of these categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by date for single-tenant environments.

## May 6, 2026

## New

### dbt Copilot and agents

- **Project instruction files in agent system prompt**: dbt Copilot now reads `AGENTS.md` and `CLAUDE.md` files at the root of your dbt project and injects their contents into the agent system prompt on every turn. Combined content must not exceed 64 KB.

- **Subdirectory instruction file discovery**: The agent now surfaces a manifest of `AGENTS.md` and `CLAUDE.md` files found in project subdirectories and reads them on demand when working in the relevant subtree, keeping context loading efficient for large projects.

### dbt platform

- **Create account for unlicensed users**: Users with zero accounts can now create a new account directly from the regional account switcher. When enabled and a `create_account_url` is available, a "Create account" button appears on the account switcher for users with no accounts. Contact your account manager to enable.

## Enhancements

### Packages

- **New:** [Native private packages](/docs/build/packages#native-private-packages) are now generally available (GA).

### dbt Copilot and agents

- **Preview**: The [Developer agent](/docs/dbt-ai/developer-agent) is now in preview. Use natural language prompts to build or refactor models, and generate SQL, tests, documentation, and semantic models from scratch. For more information, refer to the [Developer agent](/docs/dbt-ai/developer-agent).
- **Enhancement:** Delete individual [<Constant name="copilot" /> chat conversations](/docs/dbt-ai/developer-agent#availability-and-considerations) from the conversation list (**More actions** menu (three dots) > **Delete**). Deleting the open conversation clears the panel.
- **Enhancement:** Commands run by <Constant name="copilot" /> and the [<Constant name="dev_agent" />](/docs/dbt-ai/developer-agent) now appear in the <Constant name="studio_ide" /> **Commands** tab with a <Constant name="copilot" /> icon and **Run by Copilot** tooltip, so you can tell agent-run commands apart from manually run ones.

### dbt platform

- **Clearer message when account creation is disabled**: The `/accounts/new` page now renders an inline "Account creation is disabled" message instead of silently redirecting to the home page, preventing a redirect loop for users with zero accounts.

- **Account feature changes emit audit log events**: When an account feature opt-in is toggled (for example, enabling catalog ingestion or advanced CI), an audit log event is now published recording the previous and new values.

### APIs, Identity, and Administration

- **Credentials page access with `user_credential_write` permission**: Users with the `user_credential_write` permission on any project can now access the Credentials settings page and edit their development credentials, even without a Developer-tier license or `develop_access`.

## Fixes

### dbt Copilot and agents

- **Correct handling of `tool_call_chunk` content blocks**: Fixed a bug in single tenant environments that would occasionally block conversations from being able to be continued.

## Behavior Changes

### APIs, Identity, and Administration

- **Single Sign-On configuration uses auto-generated slugs only**: The Single Sign-On (SSO) settings card now always uses server-assigned slugs. The manual slug input has been removed. All SSO configurations are created as drafts with an auto-generated slug before you fill in connection details.

### Deployment and Configuration

- **Fusion version detection uses strict catalog membership**: `isFusionDbtVersion` now only returns `true` for version strings that are explicit members of the known Fusion versions catalog (`latest-fusion`, `fusion-stable`, and so on). Previously, any string containing the word "fusion" was treated as a Fusion version. Custom or unknown version strings that happen to include "fusion" are no longer treated as Fusion versions.

## April 29, 2026

## Enhancements

### dbt Copilot and agents

- **Job investigation support in Studio agent**: The Studio IDE dev agent can now help you investigate and troubleshoot dbt job and run failures using the `troubleshooting-dbt-job-errors` skill. The agent notes when your local project state may differ from the job (for example, a different branch or uncommitted changes). This feature is currently in beta. Refer to [Debug job failures](/docs/dbt-ai/developer-agent?version=2.0#debug-job-failures) for more information.

### Semantic Layer

- **Semantic Layer MCP request size limit**: Semantic Layer requests through MCP are now capped at 10 MiB (previously unlimited) to improve infrastructure stability.

### Orchestration and run status

- **Finer-grained permissions on the Debug on Fusion menu**: The "Debug in Studio" and "Run once on Fusion" menu items are now independently disabled based on your permissions. If you lack the required permission for an action, that item shows a tooltip explaining why, while the other item remains available.

- **Automatic dbt version override before "Debug in Studio"**: When you click "Debug in Studio," dbt platform now automatically sets your user-level `DBT_DEVELOP_CORE_VERSION` environment variable to `latest-fusion` before opening the Studio IDE, so you no longer need to configure this manually.

- **Clearer failure state for "Debug in Studio"**: If the preparation step before opening the Studio IDE fails, the button temporarily shows "Debug failed" in a red state for 5 seconds before resetting, so you know to try again rather than seeing a silent failure.

- **Fusion upgrade eligibility for projects with no jobs**: Projects with no jobs configured are now treated as eligible for Fusion. The upgrade card no longer requires a successful job run for such projects and instead shows "No jobs configured yet" under job eligibility.

- **Confirmation pop-up before overriding Fusion eligibility**: Clicking "Override eligibility status" on the run details page now opens a confirmation pop-up before applying the override, preventing accidental changes.

- **Fusion eligibility review button visible to all users**: The review button on the jobs list for jobs with unknown Fusion eligibility is now shown to all users regardless of run write permissions, so anyone can view the eligibility details modal.

- **Model execution notifications for dbt Fusion runs**: The orchestrator now publishes model execution events for grouped models and tests when running with dbt Fusion's OpenTelemetry (OTel) log format, extending model notification support to Fusion-based runs.

- **Structured logs available for externally ingested runs**: The run ingestion pipeline now detects and signals when structured dbt logs are present for a step, so logs appear correctly in the dbt platform for runs ingested from external executors.

### Deployment and configuration

- **Sticky submit bar on the create private endpoint form**: The Cancel and Save buttons on the create private endpoint page now stick to the bottom of the viewport so they remain accessible when scrolling through the form.

- **Docs generation deprecation scoped to Fusion jobs only**: The "Generate docs on run" deprecation notice is now only shown for jobs running on a Fusion dbt version. Non-Fusion jobs continue to show the standard checkbox.

## Fixes

### dbt Copilot and agents

- **Fixed errors with BYOK deployments that use OpenAI reasoning models**: Fixed request errors when using BYOK OpenAI and Azure OpenAI reasoning model endpoints.

### Semantic Layer

- **Custom metric granularities no longer rejected**: Metric manifest fields `granularity` and `offset_to_grain` now accept arbitrary string values instead of only a fixed enum. Projects using custom granularities such as `fiscal_year` will no longer fail ingestion.

### Catalog

- **Tag search field**: Tags are now a searchable field in the advanced search panel. You can filter results by tag matches. Filtering uses OR logic, returning assets that match any of the specified tags rather than requiring all tags to be present.

## April 22, 2026

## New

### Catalog

- **Health and run status filters in catalog search**: The catalog search sidebar now includes health and last run status filter sections. You can filter dbt resources (models, sources, and exposures) by health status (healthy, caution, degraded, unknown) and by last run status (`success`, `error`, `skipped`, `reused`).

- **Tag search field**: Tag is now a searchable field in the advanced search side panel. You can filter results by tag matches.

## Enhancements

### Studio IDE

- **More reliable dark mode on initial load**: Added additional layers of theme preference fallbacks, including the user's OS theme preferences, to avoid incorrect theming when the user-preferences service is slow to respond.

- **Deep-linking to console tabs**: You can now navigate directly to a specific Studio IDE console tab (for example, commands or lineage) using a `consoleTab` URL query parameter. Invalid tab identifiers are removed from the URL automatically.

- **Compile button after deprecation autofix in Fusion**: After the deprecation autofix workflow completes in Fusion environments, a **Compile** button now appears in the autofix results panel so you can immediately verify the updated project without manually triggering a compile.

### Orchestration and run status

- **Fusion eligibility toggle replaces dropdown filter**: The Fusion eligibility dropdown filter on the jobs list has been replaced with a toggle and help icon. When enabled, each job displays its current Fusion eligibility badge, and a persistent info banner explains how eligibility is recalculated. The toggle state is saved per-project in your browser.

- **Debug on Fusion menu**: The single **Run once on Fusion** button on the job details page and job list has been replaced with a **Debug on Fusion** menu that offers **Debug in Studio**, **Run once on Fusion**, and (when dbt Copilot is enabled) **Debug in Studio with Copilot** options. Refer to [Prepare to upgrade to <Constant name="fusion"/>](/guides/prepare-fusion-upgrade?step=7) for more information.

- **Simplified Fusion run error banner**: The Fusion run error banner on run details now uses the same **Debug on Fusion** menu as the jobs page. The banner no longer requires setting a personal dbt version override before navigating to Studio.

### Webhooks

- **Webhook test flow uses receipt polling**: Testing a webhook subscription now triggers a test event and polls for the delivery receipt, showing the actual HTTP status code and error from the endpoint response. A 60-second timeout is applied, with a clear timeout message if the endpoint does not respond in time.

- **Webhook receipt endpoint returns 404 for pending events**: The receipt endpoint for webhook events now returns a `404` response when a delivery record has not yet been written (for example, when the notification system has not yet processed the event), rather than returning an incomplete record.

- **Corrected status code for timed-out webhook deliveries**: Webhook delivery history records now show `504` as the HTTP status code when a delivery timed out (previously stored as `0`), improving accuracy in the delivery history view.

- **Webhook event history note always visible**: The note that event history is limited to the past 7 days now appears on the webhook events history page unconditionally.

### Integrations

- **Slack notification settings migration banner**: A migration banner now appears on the Slack notification settings page when you have notification settings from a previous Slack integration. You can migrate them to the new Slack app in one click or dismiss the banner. After migration, you are shown which private channels need the dbt platform app invited for notifications to be delivered. Contact your account manager to enable.

### dbt platform

- **View account information scope on OAuth consent page**: The OAuth consent page now displays a "View account information" (`account:read`) scope option, which grants view-only access to account details including project and environment information.

- **PrivateLink endpoint pending status**: A new `pending` connectivity status is available for PrivateLink endpoints, in addition to the existing `success` and `failed` states.

- **Permission added to member role**: The member permission set now includes `fusion_readiness_read`, allowing members to view Fusion readiness information for projects without requiring elevated permissions.

## Fixes

### dbt Copilot and agents

- **Correct model routing for Azure OpenAI Responses API (BYOK customers)**: Azure OpenAI deployments now correctly pass the deployment name as the `model` field when using the Responses API, preventing misrouted requests when the deployment name differs from the model name.

## April 15, 2026

## Enhancements

### Catalog

- **Health and run status search filters**: The `AccountSearchQueryFilter` input now accepts `health` and `runStatus` filter arrays. Use `health` to narrow results by health status (`healthy`, `caution`, `degraded`, or `unknown`) and `runStatus` to filter by last run outcome (`success`, `error`, `skipped`, or `reused`). Multiple values within each filter are combined with `OR` logic.

- **Health-aware search ranking**: Healthy dbt resources (those with no detected issues) now rank higher in search results than resources with unresolved issues when text relevance is otherwise equivalent.

### Studio IDE

- **Keyboard shortcut to open Commands tab**: Press `Ctrl+\`` to open the Commands tab directly from the editor.

### Orchestration and run status

- **Clearer Fusion job eligibility messages**: Fusion eligibility reason messages are rewritten to be shorter and more actionable. For example, unsupported adapters now read "This job uses an adapter that's not currently available on the Fusion engine" and jobs not on Latest now read "This job uses a dbt version that's not tested for Fusion eligibility."

- **Fusion eligibility confirmation modal**: Clicking "Run once on Fusion" on a job now opens a confirmation modal before triggering the run, showing the environment name and a warning that job commands will execute in that environment.

- **Improved `dbt ls` and `dbt list` run log status (dbt Fusion engine only):**: Run steps that execute `dbt ls` or `dbt list` now show node results with a no-op status instead of "unknown," reducing confusion in run logs for list operations.

### dbt platform

- **More descriptive Fusion readiness toggle**: The account-level setting to enable Fusion readiness and upgrade features now has an updated label ("Enable Fusion readiness & upgrade features") and a more detailed description explaining what the setting allows administrators and developers to do.

- **Debug on Fusion navigates with version override**: The "Debug on Fusion" button (previously "Debug manually") on failed Fusion run banners now sets your personal `DBT_DEVELOP_CORE_VERSION` override to `latest-fusion` before opening Studio IDE, ensuring you open the IDE on the Fusion engine. A loading state is shown while the override saves, and an inline error is displayed if the save fails.

### Deployment and configuration

- **Private endpoint connectivity status column renamed**: The "Status" column in the private endpoints list is renamed to "Connectivity status" for clarity.

- **Snowflake private endpoint validation shows specific missing fields**: When pasting Snowflake Private Link configuration output, the validation error now lists the specific required fields that are missing (for example, `privatelink-account-url`) rather than a generic message. Valid output now also shows a success indicator.

- **YAML credential fields now accept array values**: Environment credential and connection forms that accept YAML Extended Attributes (for example, Redshift `db_groups`) now correctly validate arrays as values. Previously, array values were incorrectly rejected during client-side validation.

### Integrations

- **Snowflake PrivateLink supports reusing existing interface endpoints**: When creating a Snowflake PrivateLink connection, you can now supply an optional `interface_endpoint_id` to attach a new profile to an existing interface endpoint rather than always creating a new one. The endpoint must be in `Available` status; a `409 Conflict` is returned otherwise. Contact your account manager to enable.

## Fixes

### Studio IDE

- **New folders in Git Controls now expand correctly**: Files inside a newly created folder are now listed individually in the Git Controls panel. Previously, a new folder appeared as a single unexpanded entry rather than showing the files it contained.

-  **Parent folder hint shown for all new files**: Files created inside a new folder now always display the parent folder name as a hint in the Git Controls panel, even when the file name is unique across all changed files.

## April 8, 2026

## New

### dbt Copilot and agents

- **Admin API tools for MCP remote server**: The dbt MCP remote server now includes Admin API tools, including `list_jobs`, `list_projects`, `get_job_details`, `trigger_job_run`, `cancel_job_run`, `retry_job_run`, `get_job_run_details`, `get_job_run_error`, `list_job_run_artifacts`, and `get_job_run_artifact`. These tools let MCP clients list, inspect, trigger, cancel, and retry dbt jobs and runs directly from connected AI assistants. Contact your account manager to enable.

### dbt platform

- **OAuth consent page**: A new OAuth consent page lets you authorize third-party applications (for example, dbt MCP) to access your dbt platform account. You can select which permissions and projects to grant, then approve or deny the request.

### Catalog

- **Performance tab on test and snapshot detail pages**: Test and snapshot detail pages now include a Performance tab showing cost insights data — including cost, usage, build time, and build count charts — matching the existing model performance experience.

### Orchestration and run status


## Enhancements

### dbt Copilot and agents

- **Smarter validation after file edits**: The Studio DevAgent now selects the lightest appropriate validation check after each change — for example, skipping compilation for description-only edits and running `dbt parse` for project config changes — instead of always running a full `dbt compile`. This reduces unnecessary round-trips and keeps iteration faster.

### Studio IDE

- **Deferral environment selector**: Replaces the simple defer-to-production toggle with a popover that lets you choose between your development environment, dbt's default deferral behavior (staging if available, otherwise production), or a specific custom environment. A badge in the command bar shows your current deferral target at a glance.

- **Revert personal dbt version override**: Adds an "Edit / Revert" action to the version override option in the environment popover. Clicking "Revert" opens a confirmation modal that removes your personal dbt version override and restarts the session.



- **Improved file context pill in dbt Copilot**: Moves the active-file context pill to above the text input for greater visibility. When you remove the file context, a "Use current file as context" affordance appears so you can restore it without switching tabs.

### Catalog

- **Reused test status in DAG lens**: State-Aware Orchestration (SAO) test runs that reuse prior results now display with a "reused" icon in the DAG test status lens, matching the existing model run status behavior.


- **Function resource type support in selectors**: The `function` resource type is now recognized in dbt selectors and the resource node type map, enabling correct filtering and navigation for function resources in Catalog.

### Insights

- **Fusion status column in account insights table**: Look for a "Fusion status" column in your account insights table when the Fusion readiness flow is available for your account. You'll see one of four states: On Fusion, Start upgrade, Partial-Fusion, or Non-Fusion — based on each project's readiness and migration progress. Projects that are ready to upgrade show a "Start upgrade" button that navigates directly to the project home page. Contact your account manager to enable.

## Fixes

### Studio IDE

- **Parse status no longer shows error badge during Fusion compilation**: In Fusion mode, the parse status badge no longer switches to an error state solely because diagnostic errors are present. The badge now correctly reflects compilation progress and completion independent of diagnostic counts.

- **Clearer authentication errors for rejected git connections**: Adds "remote rejected authentication" as a recognized, non-retryable git authentication error. You will now see a clear authentication failure message instead of a misleading retry loop when your git provider rejects your credentials.

### Catalog

- **Reused models no longer flagged as stale**: Models with a `last_run_status` of `reused` are no longer marked stale even when their last execution date exceeds 30 days. This prevents false health issue warnings for models that were intentionally reused rather than re-executed.

- **Resource counts refresh on environment switch**: Fixes a bug where resource counts on the project landing page were not updated when switching environments.



## April 1, 2026

## New

### Studio IDE

- **Fuzzy file path search**: Studio IDE now supports fuzzy file path search that finds files in your project using partial name matching. You can filter by glob patterns, set a result limit, and receive ordered results with a total match count, making it faster to navigate large projects.

### dbt platform

- **OAuth consent endpoint for Connected Auth**: A new `/oauth/consent` endpoint enables the Connected Auth OAuth flow, supporting user consent decisions (approve and deny), project-level resource boundaries, and authorization code issuance. This feature is in private beta. To request access, contact your account manager.

## Enhancements

### dbt Copilot and agents

- **Persistent agent mode across sessions**: The Studio agent now remembers your last-used mode (Ask or Code) across browser sessions, so you no longer need to reselect it each time you open the IDE.

### Studio IDE

- **More accurate file search results**: File search now validates each result against the filesystem before returning matches. Files that have been deleted locally but not yet staged are no longer included in search results.

- **No unexpected git pulls on the primary branch**: Removes behavior where the IDE server automatically pulled changes from your primary branch during git status checks, which could cause unintended overwrites for projects using trunk-based development.

### Orchestration and run status

- **Teradata column-level lineage support**: Adds Teradata to the SQL dialect adapter map, enabling column-level lineage parsing for dbt projects using the Teradata adapter.

### APIs, Identity, and Administration

- **Fusion status includes readiness and migration availability**: Adds fields indicating availability of readiness and migration features.

- **Faster account feature flag propagation**: Account feature flag changes now take effect within 60 seconds instead of up to one hour. You should see feature toggles apply more promptly across your account.

### Webhooks

- **Notification delivery reliability improvements**: Reduced the likelihood of delayed notifications (webhooks, email, Slack, and Teams) in certain third-party/system disruption scenarios.

## Fixes

### APIs, Identity, and Administration

- **GitHub webhook secret null check before signature validation**: The GitHub webhook endpoint now correctly checks for a null webhook secret before attempting to validate the request signature, preventing a crash when a repository's webhook secret is not set.

- **`github_installation_id` and `github_webhook_id` support large values**: These repository fields have been promoted from 32-bit to 64-bit integers (`BigIntegerField`) to accommodate GitHub installation and webhook IDs that exceed the 32-bit integer range.

## Behavior changes

### APIs, Identity, and Administration

- **Fusion migration gated by API availability**: The Fusion migration checklist, the Enable Fusion Environments page, and the "Enable Fusion" button in Studio IDE now use the `is_migration_available` field from the Fusion status API instead of the legacy `orc2609ShowFusionToggle` feature flag. Fusion migration UI is shown only when the backend has marked the project as ready for migration.

## March 25, 2026

## New

### Orchestration and Run Status

- **Fusion run error banner**: When a run using the dbt Fusion engine fails, a banner now appears on the run details page with options to debug the failure in Studio IDE. If dbt Copilot is enabled, you can also open a guided fix-with-Copilot workflow directly from the banner. Contact your account manager to enable.

## Enhancements

### Studio IDE

- **Consistent console pane default size**: The bottom console pane now opens at a preferred size of 33% of the available space, providing a more consistent default layout.

- **Faster text search results**: File search now reports results incrementally on a per-file basis rather than per-match line, reducing memory pressure and improving perceived responsiveness during large searches.

- **Smarter bulk-edit file handling**: When Studio IDE applies multi-file edits (for example, from dbt Copilot agent tasks), it now only updates editor models for files that are already open. Previously, every edited file was opened in a new tab, which cluttered the editor.

### Deployment and Configuration

- **Fusion migration enablement via project API**: You can now set `fusion_migration_enabled` on a project via the project update API. Enabling it requires the `fusion_readiness_write` permission, and the project must meet all readiness prerequisites (supported adapter, supported dbt version, a successful run, and eligible jobs).

- **Filter jobs by Fusion readiness**: The jobs list endpoint (`GET /api/v2/accounts/{account_id}/jobs/`) now accepts an `is_fusion_ready` boolean query parameter. When `true`, it returns only conformant or override-ready jobs; when `false`, it returns only non-ready jobs. You can also include `fusion_readiness` in the `include_related` parameter to surface Fusion readiness details alongside the job response.

- **Platform metadata credentials form opens immediately**: When adding platform metadata credentials for a connection, the credential form is now shown immediately instead of requiring you to click an "Add credentials" button first.

## Fixes

### Catalog

- **Accurate resource counts on environment switch**: Fixes a bug where resource counts in the navigation tree were not refreshed when switching environments. You should now see up-to-date counts after changing the active environment.

### Orchestration and Run Status

- **Stuck runs are now cancelled**: A new cleanup job detects runs and run steps that have exceeded the maximum allowed duration and marks them as `CANCELLED`, preventing stale in-progress states from accumulating

### Semantic Layer

- **More reliable Snowflake connections after warehouse auto-resume**: The Semantic Layer Gateway now retries the initial connection when a Snowflake warehouse is waking up from auto-suspend, instead of failing immediately. You should see fewer connection errors when querying the Semantic Layer after a period of inactivity.

### APIs, Identity, and Administration

- **Large group permission sync no longer silently truncated**: Fixed an issue where group permission sync could miss updates for groups with many permissions.

## Behavior Changes

### Studio IDE

- **Fusion OpenTelemetry log rendering always enabled**: Studio IDE now enables Fusion OpenTelemetry (OTel) log rendering for all invocations running on a Fusion core version, removing the previous feature flag requirement. If you are running a Fusion core version, you automatically receive OTel-based log output without any additional configuration.

## March 18, 2026

## Enhancements

### Studio IDE

- **Faster file search:** Studio IDE now reuses its file-search index across searches, so repeated searches return results faster.

- **More responsive Git status decorations:** Studio IDE debounces rapid file change events and avoids applying stale responses, so Git status badges update more reliably during bulk edits and saves.

- **Clearer server status details:** The server status popover uses a clearer grouped layout and action buttons to help you troubleshoot development credentials and server health. Please contact your account manager to enable.

### dbt Copilot and agents

- **More accurate product guidance:** Copilot and agents can use a product documentation toolset to answer product and workflow questions more reliably.

- **Full-screen Copilot view:** You can open Copilot in a dedicated full-screen view for a more focused chat and coding workflow. Please contact your account manager to enable.

- **Lighter default file context:** Copilot now references your active file by path instead of automatically attaching the file contents, which reduces message size and improves chat reliability.

- **Run `dbt-autofix` from Copilot and agents:** Copilot can run `dbt-autofix` commands (with confirmation) and stream the output into chat, and Studio IDE agents can run `dbt-autofix` using `run_autofix` for bulk deprecation fixes and migrations.

### Catalog

- **Custom materialization filter:** Catalog search now groups non-standard materializations under a single “Custom” filter, so you can narrow results without picking each materialization type.

### Insights

- **More complete Redshift query attribution:** Insights can resolve missing Redshift query IDs from warehouse query history when artifacts do not include them, improving cost coverage for runs with executions.

- **Copilot entry stays available during lockouts:** If dbt Copilot is temporarily locked for your account, you can still open Copilot from Insights to see lock details.

### Orchestration and Run Status

- **Run metadata includes triggering and canceling actors:** Run details now include who triggered or canceled a run (user or service token), which helps you audit run activity.

- **Custom branch preserved for runs and reruns:** When an environment uses a custom branch, dbt platform now carries that branch through run triggers, retries, and reruns more consistently.

- **Fusion readiness metadata for jobs and environments:** You can now retrieve Fusion readiness signals for projects, environments, and jobs to support Fusion migration planning. Please contact your account manager to enable.

- **More accurate command names for dbt Fusion runs:** Orchestration now reads the invocation name from `run_results.json` using `command` when `invocation_command` is missing, so you see the correct dbt command in run details.

### Run Logs

- **More resilient run step history ingestion:** Run step history ingestion now drops invalid events and de-duplicates redundant step-start events before writing step data, improving step-level accuracy. Please contact your account manager to enable.

### Deployment and Configuration

- **Longer project descriptions:** You can now add project descriptions of up to 1,024 characters.

- **Connection links in profiles:** You can now open a connection directly from the connection profile table in a new tab.

- **Clearer YAML validation for extended attributes:** You now get more consistent validation and clearer error messages for invalid YAML syntax, null values, and non-object YAML content when you edit extended attributes.

### Semantic Layer

- **Improved filtered-query cache matching:** Cached query results can now be matched and reused more reliably when your query includes filters, which can reduce repeated compilation and improve response times.

## Fixes

### APIs, Identity, and Administration

- **Fewer transient Cloud Config failures:** Retries now only apply to transient errors during Cloud Config lookups, so you should see fewer intermittent failures without added delay for permission, authentication, or not-found responses.

- **More reliable sign in redirects from `current_email`:** If you are already authenticated and land on `/login` with `current_email`, dbt platform now redirects you to `/api/auth/auth-login/` so the email is forwarded during sign in.

- **IP restrictions toggle saves reliably:** Turning IP restrictions on or off now updates form state correctly, so your changes save as expected.

- **More consistent audit log date filtering:** The audit log date range defaults no longer shift during re-renders, so your filters stay stable while you review results.

- **More reliable Single Sign-On (SSO) migration domain updates:** Domain updates during Single Sign-On (SSO) migration no longer rely on mutating existing provider data, which improves save reliability.

### Deployment and Configuration

- **Clearer Bring Your Own Key (BYOK) credential errors:** If your OpenAI credentials include invalid characters, you now get a clearer error message so you can correct the configuration.

- **More reliable credential edits:** Encrypted credential fields now stay optional when you edit credentials, which reduces unexpected validation failures.

- **Correct connection details while editing environments:** You now see the correct connection details more consistently when you edit an environment that uses global connections and connection profiles.

### Orchestration and Run Status

- **Run steps are available for ingestion runs:** You can now open and review run steps for ingestion-triggered runs.

- **Cleaner run error fields:** Run results no longer populate an error string with `None` when dbt does not provide a message or failure count, so you see clearer run error details.

- **Clearer errors for invalid dbt projects:** When Orchestration cannot restore the repository cache because the dbt project is missing or malformed, it now returns an invalid project error so you get a more actionable message in run results.

### Catalog

- **Skipped snapshots show as skipped:** Snapshots selected but not executed in multi-step runs now appear with a skipped status instead of missing run status fields.

### Insights

- **Copilot chat no longer gets stuck loading:** Insights now clears the Copilot chat loading state reliably after responses complete or error, so you can keep chatting without refreshing the page.

- **More reliable Copilot handoff starts:** When you arrive in Insights with a Copilot handoff message, Insights now starts the handoff once and clears stale handoff state when you navigate directly.

### Integrations

- **More consistent JDBC typing for Tableau and Power BI:** Semantic Layer now derives explicit string conversions from returned result metadata, so categorical dimensions and entities are more consistently typed as strings in Tableau and Power BI queries.

### Semantic Layer

- **More reliable cache key deletion:** Cache invalidation no longer fails when an in-memory cache key is already missing, which reduces intermittent errors during cache cleanup.

- **More accurate run ID validation:** Semantic Layer now requests and caches run details scoped to your account, which reduces incorrect run validation results.

### dbt Copilot and agents

- **More reliable cancellations during tool use:** If you cancel a request while an agent is running tools, the agent now recovers cleanly instead of getting stuck on incomplete tool-call history.

- **Cleaner AI diff overlays:** Studio IDE now removes the accept and reject overlay when you leave an artificial intelligence (AI) diff view to prevent stale UI controls.

## Behavior Changes

### Studio IDE

- **Updated file search and command shortcuts:** Studio IDE now uses VS Code Quick Open for file search (`Cmd+P` or `Ctrl+P`) and the VS Code Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) instead of the legacy Studio dialogs.

### Integrations

- **Disallowed `MIN()` and `MAX()` for metrics and dimensions:** Tableau and Power BI queries can no longer request `MIN()` or `MAX()` for a metric or dimension (except time min-max queries), and you now receive a clear error if you attempt it.

## March 11, 2026

## New

### Deployment and Configuration

- **Self-serve Snowflake private endpoint requests:** You can request a new Snowflake private endpoint from account settings by pasting the output from `SELECT SYSTEM$GET_PRIVATELINK_CONFIG();`, then track request status in the private endpoints table. This is available for Enterprise Business Critical accounts only, and please contact your account manager to enable. For other connection types, contact support@dbtlabs.com.

## Enhancements

### Orchestration and Run Status

- **Run retries support dbt Fusion runs:** You can now retry failed runs as long as your environment is on dbt Core version `1.6` or higher or dbt Fusion.

### Integrations

- **More reliable Slack notifications:** Slack channel discovery and notifications now retry on Slack rate limits to reduce dropped messages during busy periods.

### APIs, Identity, and Administration

- **Improved OpenAPI typing for large integers:** OpenAPI schemas now mark 64-bit integer fields as `format: int64` to improve generated client types.

- **Clearer credentials schemas:** Credentials OpenAPI docs now use a `type` discriminator (`postgres`, `redshift`, `snowflake`, `bigquery`, and `adapter`) to improve code generation and request validation.

## Fixes

### Orchestration and Run Status

- **More reliable job search:** Searching jobs with numeric terms (for example, `12`) no longer triggers API validation errors, so you can load job lists reliably.

- **Clearer cross-project publication errors:** When dbt platform cannot fetch a publication artifact for an upstream project declared in `dependencies.yml`, you now see which project is missing an artifact and guidance to run the upstream environment at least once.

### Integrations

- **More accurate Microsoft Teams notification triggers:** Microsoft Teams notifications now use the correct trigger event type for each notification, so you see the expected run outcome context in the message.

### APIs, Identity, and Administration

- **More accurate error responses during permission checks:** You now receive more accurate errors from permission checks, and underlying service errors surface instead of being reported as authorization failures.

### Deployment and Configuration

- **Clearer private endpoint validation errors:** Creating a private endpoint now returns a `400` error with a clear message when `snowflake_output` is malformed or not valid JSON.

## Behavior Changes

### Orchestration and Run Status

- **Model timing unavailable for dbt Fusion runs:** You now see an informational notice instead of the Model timing chart for dbt Fusion runs because dbt Fusion handles threading differently.

### APIs, Identity, and Administration

- **System for Cross-domain Identity Management (SCIM) `id` fields are now strings:** SCIM schema discovery now reports `id` fields as strings for users and groups.

## March 4, 2026

## Enhancements

### Orchestration and Run Status

- **Clearer SAO description**: Job settings now describe state-aware orchestration (SAO) as only building models when data or code changes are detected.
- **Direct links for cost optimization setup**: Fusion cost optimization settings now link to account-level Cost Insights settings and setup documentation so you can validate cost data and savings.

### APIs, Identity, and Administration

- **Confirmation when enabling manual SCIM updates**: When you enable manual updates for System for Cross-domain Identity Management (SCIM), dbt platform now asks you to confirm so you do not accidentally allow changes outside your identity provider.
- **More reliable SCIM group provisioning**: SCIM has been updated so that when a SCIM-provisioned user with an expired invite is added to a SCIM-managed group through a SCIM request, the invite is automatically resent during group assignment. This helps prevent errors caused by unaccepted invites.

### dbt platform

- **Project names and descriptions handle empty values better**: Projects with missing names now show as “Untitled Project,” and you can save project descriptions as empty.

### Studio IDE

- **Removed non-functional “Open Settings” actions**: Studio IDE no longer shows “Open Settings” buttons in editor notifications because Studio IDE does not expose VS Code settings, and the action would not help you resolve issues.

## Fixes

### Catalog

- **More reliable file tree loading**: Catalog no longer gets stuck loading the file tree on initial page load.
- **Clearer trust signals**: Trust signals now suppress less-severe upstream-source issues when a more severe issue is present, so badges and messages are easier to interpret.

### Integrations

- **Clearer deploy key decryption errors**: When dbt platform cannot decrypt a deploy key, you now get a clearer failure instead of a generic git credentials error.

### Studio IDE

- **Cleaner LSP disconnects**: If authentication fails when you connect to the Language Server Protocol (LSP) WebSocket, the connection now closes cleanly instead of failing with an internal server error, so you should see fewer unexpected disconnects.
- **Improved timeout handling and authentication stability**: Reduced environment setup timeouts and resolved intermittent authentication failures during busy periods.
- **Clearer invalid credentials error**: If your development connection credentials are invalid, you now see a clearer error message to help you diagnose the issue faster.

## Behavior Changes

### Orchestration and Run Status

- **`versionless` dbt version is no longer accepted**: dbt platform now treats `versionless` as deprecated and updates existing environments and jobs to use `latest`. If you set `dbt_version` in an API integration or automation, update it to send `latest` instead.

### Webhooks

- **Account identifier required for run-based notifications**: If you send events that include a `run_id`, you must also provide an `account_identifier` so the service can validate and resolve the correct account before dispatch. If `account_identifier` is missing, the event fails instead of falling back to a `run_id`-only lookup.

## February 25, 2026

## New

### Catalog

- **Saved queries now ingested for lineage and governance**: Saved query definitions (including tags, exports, parameters, and lineage relationships) are now captured during ingestion so they can participate in Catalog lineage and governance workflows.

## Enhancements

### dbt platform

- **System logs now surface warnings and errors**: Run step structured logs now show an indicator when system warnings or errors are present, making issues easier to spot during run triage.

- **Region labels now use backend display names**: Account Settings now shows the backend-provided region display name for clearer, more accurate region labeling.

- **SCIM create group UI change**: Changes to our UI to improve the experience of managing groups with SCIM enabled.

- **Updated the post-invite message for SSO accounts**:  After a user accepts an invite, the UI now explains that they must log in using SSO to fully redeem the invite and access the account. This replaces the previous "Joined successfully" message and helps avoid confusion when users accept an invite but do not complete the SSO login flow.

### Studio IDE and Copilot

- **Improved crash recovery and not-found routing**: Studio IDE now catches unexpected render failures with a top-level error boundary and shows Not Found more reliably for unknown in-project routes.

- **Improved navigation accessibility and semantics in Studio IDE**: The main navigation trigger area is now a navigation element with improved focus and labeling.

- **Reduced shortcut conflicts with VS Code search**: When Visual Studio Code (VS Code) search is enabled, Studio IDE avoids unregistering Quick Open and suppresses conflicting command palette shortcuts.

### Catalog and Insights Data

- **More accurate source freshness outdated status in Catalog**: Source freshness Outdated status can now be computed at query time, improving freshness status filtering consistency.

- **Improved search and lineage usability in Catalog**: Search results better support column-level navigation and very long queries show a clear validation error, and lineage visuals have improved alignment and reduced edge clutter.

- **Improved cross-project lineage and function awareness in Catalog**: Lineage graph building now includes cross-project dependencies and supports function nodes as first-class lineage entities.

### APIs, Identity, and Administration

- **Project deletion now supported in Admin v2 and v3 Projects APIs**: Projects APIs now explicitly support DELETE with stricter permission checks.

## Behavior Changes

### Webhooks

- **Updated job run event field presence and status normalization**: Webhook payloads now include `runFinishedAt` only for completed events and `runErroredAt` only for errored events; canceled runs no longer include `runCanceledAt`, and run status is normalized from Cancelled to Canceled. Also note that enabling JSON preserve order can change key ordering, so consumers should parse JSON rather than string-compare payloads.

### Insights APIs

- **Optional source freshness expiration windows**: Source freshness expiration windows can optionally derive from each source’s freshness criteria rather than a fixed window. You must enable in your deployment.

### Deployment and Configuration

- **Source ingestion may skip sources for extremely large manifests in Catalog**: For very large `manifest.json` files, ingestion may strip sources above a configurable threshold to prevent out of memory failures. Set `SOURCE_INGESTION_THRESHOLD=0` if you must always ingest sources regardless of size.

- **Removed deprecated object storage settings in Studio IDE**: Deprecated settings `project_storage_bucket_name` and `project_storage_object_prefix` have been removed. Migrate to `object_storage_bucket_name` and `object_storage_object_prefix`.


## February 18, 2026

## New

### Cost Insights

- **Estimated warehouse compute costs**: Cost Insights shows estimated warehouse compute costs and run times for your dbt projects and models, directly in the dbt platform. It highlights cost reductions and efficiency gains from optimizations like state-aware orchestration across your project dashboard, model pages, and job details. This feature is in private beta. To request access, contact your account manager.

## Enhancements

### Studio IDE

- **Reduced conflicts across multiple tabs**: Studio IDE can pause the Language Server Protocol (LSP) in background tabs and resume on return to improve stability when the editor is open in more than one tab.

- **More informative header and more editor space**: Adds a Visual Studio Code-style header showing a dbt badge and current project name, with an option to hide surrounding chrome for more editor space. Please contact your account manager to enable.

- **Clearer file and folder creation errors**: Surfaces more actionable filesystem errors (for example, name too long and file-is-a-directory) instead of generic failures.

- **Copy relative path**: Adds a Copy Relative Path action that respects `dbt_project_subdirectory` for quicker navigation and sharing.

- **Friendlier lineage error messages**: Improves user-facing errors for lineage failures (including server errors and cases where upstream returns HTML instead of JSON).

- **More reliable private connectivity selection**: Improves private endpoint filtering by adapter type and updates Studio IDE to use the correct version 3 private endpoints endpoint.

### Canvas

- **More reliable Add Sources CSV uploads**: Improves Comma-Separated Values (CSV) upload progress, resume behavior, and common error handling during Add Sources.


### Catalog

- **Faster and more usable lineage for large projects**: Improves directed acyclic graph (DAG) performance by rendering only visible elements and improving layout for disconnected nodes.

- **Safer search result interactions**: Improves keyboard and hover behavior in the search dropdown and avoids showing stale results while searches are loading.

### dbt platform

- **More informative user invite statuses**: This change shows clearer invite status (invitation sent and invitation accepted) and supports accepted, login pending for Single Sign-On (SSO).

- **Unpaid billing banner enabled by default**: The unpaid billing banner is no longer feature-flagged and will display when applicable, while billing link visibility remains permission-based.

- **System for cross-domain identity management (SCIM)**: Bug fixes and improvements related to managed invites for easier processing.

### dbt Copilot and agents

- **Streaming control for server-sent events**: Adds Server-Sent Events (SSE) streaming control so clients can choose chunk streaming or message streaming. This enables more responsive Copilot experiences in environments that support streaming.

- **More reliable similar models requests**: Improves responsiveness for AI Similar Models and Similar Sources requests by enforcing tighter embedding and database timeouts aligned to request deadlines.  Users should see faster, more consistent results when exploring related models.

- **dbt Copilot: Improved bring your own key error handling**: Categorizes OpenAI failures with Bring Your Own Key (BYOK) awareness so BYOK failures return the expected 424-class behavior instead of generic 500-series errors.  This makes it easier to diagnose and resolve key or configuration issues.

- **Expanded dbt Model Context Protocol tooling**: Updates dbt Model Context Protocol (MCP) tooling, including adding `get_all_macros` and improving error categorization, enabling more accurate responses.


## Fixes

### Studio IDE and Catalog

- **More reliable search and replace**: Ensures bulk edits stay in sync after server-side edits to prevent stale content from overwriting changes.

- **Correct search preview highlighting**: Fixes preview and match highlighting assembly so match ranges align correctly in multi-line previews.

- **Improved startup failure experience**: Shows a proper error layout and notification on unrecoverable initialization failures.

### Canvas

- **Fewer Add Sources UI interruptions**: Prevents incorrect tab closing after uploads complete and avoids showing the floating node panel when not on a file tab.


### Catalog

- **Public model lineage across environments**: Fixes lineage resolution for public model parents when the producer model lives in a non-default environment.

### dbt Copilot And Agents

- **Reduced resource growth under load**: Fixes an OpenAI connection pool leak that could lead to out-of-memory (OOM) conditions under sustained load. Users should see fewer slowdowns during high-traffic periods.

- **Fewer related models timeouts**: Reduces intermittent failures when attaching related models by increasing internal timeouts for related-model fetching. Users should experience fewer timeout errors when working with related models.

## Behavior Changes

### Studio IDE

- **Prevent destructive root operations**: Prevents rename and delete operations on the repository root and shows clearer warnings.

- **Resumable dbt command log streaming**: Improves dbt command log streaming reliability by resuming from the last known Command Line Interface (CLI) event offset. Contact your account manager to enable.

### Admin And APIs

- **Job Admin gains write access in Profiles API**: Job Admin now includes `profiles_write`, which can change what Job Admin users can do where Profiles are enabled.

- **Search parameter renamed**: Version 3 Private Endpoints query parameter `name_search` is renamed to `search`, and search matches endpoint name and endpoint value.

- **Connections: Postgres database name required**: Postgres connection validation now requires a non-empty database name.

- **User credentials: Prevent sharing credentials across users**: Prevents associating the same active credentials object to multiple users, returning a conflict instead of silently duplicating associations.

### Integrations

- **GitHub: More flexible repository URL schemes**: GitHub shared webhooks now accept repository URLs using https, git, and Secure Shell (SSH) formats.

- **Slack: Tighter permission gating for settings**: Slack linking and notification settings are more strictly gated by the relevant permissions.

- **Slack: Permission check aligned to job notification access**: Slack integration listing now uses job notifications read permission, reducing incorrect permission-denied scenarios.

### CLI Runtime

- **Shorter default request timeouts**: Reduces default timeouts from 60 seconds to 5 seconds for Cloud Config and Cloud Artifact calls, causing requests to fail faster in high-latency environments unless overridden.

- **OpenTelemetry logs: Corrected JSON field name**: Corrects the OpenTelemetry (OTel) log payload field name to `additional_message` (from the misspelled `addtional_message`), which may require updates to downstream parsing.

## February 11, 2026

## Enhancements

### Catalog

- **Faster model graph rendering for large projects**: Improved model graph layout performance to reduce load time in larger projects.

- **Faster similar models results**: Similar Models lookup now uses an optimized vector search strategy to reduce timeouts on large projects.

### Studio IDE

- **Clearer project root in Catalog file tree**: When your dbt project is in a subdirectory, the project root is highlighted in the Catalog file tree.

- **More native rename and delete in Catalog file tree**: Rename and delete actions now use native editor behaviors when using the Catalog file tree.

- **More reliable in-browser formatting**: Formatting updates now apply directly to the active editor buffer to reduce prompts and inconsistent results.

- **Cleaner code generation workflow**: Code generation no longer creates a temporary file in your repository during generation.

### dbt platform

- **Fusion compatibility validation on environments**: Environment settings now prevent saving a Fusion dbt version with an incompatible connection and surface field level validation errors.

- **Smarter Fusion defaults during connection setup**: When setting up a new connection, Fusion eligible adapters now default to the latest Fusion version to reduce misconfiguration during setup.

- **Improved Private Link endpoint management**: Private Endpoints can be sorted by status and connections, and endpoint details now show associated connections and environments.


### Run Logs

- **More reliable invocation event streaming**: Invocation event streaming is more reliable for long running jobs by deriving totals from the latest stream event identifier.

- **Reduced Redis usage after log streams complete**: Log streaming now cleans up Redis keys after a stream completes, reducing stale keys and Redis memory pressure for high volume runs.

## Fixes

### dbt Copilot

- **Consistent usage limit messaging in Insights and Studio IDE**: When users hit the usage limit, dbt disables Copilot and shows a clear message, including the reset date when available.

### Studio IDE

- **Git status decorations registered once**: Fixed duplicate Git status decorations in the file tree that could cause visual issues and performance impact.

- **Avoid automatic pull on primary branch**: Studio IDE no longer runs an automatic pull on the primary branch to reduce unexpected changes during development.

- **Clearer file operation validation errors**: File operations now return structured validation errors and explicitly reject names that exceed operating system limits.

- **More reliable command log refresh and finalization**: Command logs for the dbt Cloud Command Line Interface (CLI) are refreshed and finalized more reliably.

### Run Automation

- **Correct account attribution for automatically triggered runs**: Scheduler triggered runs now include account context, improving run attribution and preventing some downstream triggers from running without proper context.

- **Reject malformed account identifiers for exposure events**: Exposure generated events now validate that account identifiers are numeric before triggering follow on automation.

### Webhooks

- **More compatible run completion payload for canceled and errored runs**: Webhook payloads now include consistent completion and error timestamps, and canceled runs include a canceled timestamp and normalized status.

- **Restored dual dispatch for some failure and completion triggers**: When both failure and completion triggers are configured, errored runs may generate two webhook deliveries to match legacy behavior.

### dbt Project Metadata

- **Manifest Ingestion: Accept functions section in manifest.json**: Ingestion now accepts the `functions` section (for example, Snowflake user defined functions (UDF)) to prevent parse failures on newer manifest schemas.

- **Macro Metadata: More consistent timestamps and argument comparison**: Macro metadata persistence now uses more consistent Coordinated Universal Time (UTC) timestamps and improves argument comparison to reduce noisy or incorrect macro updates.

## Behavior Changes

### dbt platform APIs

- **Removed credential configuration fields from responses**: Profiles API responses no longer include credential configuration and extended attributes; use the appropriate credentials and configuration endpoints instead.

- **Filter connections by Private Endpoint**: Account Connections list supports filtering by Private Endpoint identifier for easier management.

- **Additional ordering options**: Private Endpoints list now supports ordering by endpoint state and connection count.

- **Private Link: Updated license permission defaults**: User licenses now include read access for Private Link resources, which may change who can view Private Link related settings.

### Studio IDE

- **Metric generation writes directly to active file**: Generated metrics are now written directly into the active model file instead of using an accept and reject diff flow.

## February 4, 2026

## New

### Studio IDE

- **Studio IDE: Copilot link in console toolbar**: Adds a link that opens Copilot from the console toolbar. You can use Copilot to read files and list directories for better context.

- **Studio IDE: Copy repo-relative path command**: Adds a command to copy a file path relative to your dbt project subdirectory, making it easier to share paths in runbooks and support tickets.

## Enhancements

### dbt platform

- **dbt platform: Fusion eligibility and compatibility indicators in setup flows**: Improves Fusion setup by showing “Fusion compatible” indicators during connection setup.

- **dbt platform: Compare Changes shows partial success warnings**: When Compare Changes subqueries fail, the experience now surfaces a partial success state with expandable warning details to make troubleshooting faster.

- **dbt platform: In-progress run logs preserve text selection**: Improves log usability during in-progress runs by preserving text selection while logs auto-refresh and rerender.

- **dbt platform: Job completion trigger job picker search**: Adds server-side search and clearer loading and empty states to the job picker for job-completion triggers.

- **dbt platform: Job artifacts content types and downloads**: Improves artifact handling for job documentation and run artifacts by strengthening HTML detection, defaulting empty paths to `index.html`, and returning clearer `Content-Type` and download filenames.

- **dbt platform: Private Endpoints API listing and pagination improvements**: Improves Private Endpoints API v3 list behavior with validated query parameters, filtering, limit and offset pagination, and `connection_count` in responses.

### Studio IDE

- **Studio IDE: Format file more reliable in subdirectories**: Improves formatting reliability by consistently using the active editor content and a stable repo-relative path when invoking formatting.

- **Studio IDE: Better stability for tabs and Git operations**: Reduces errors when working with non-file tabs and improves robustness around tab-close and Git checkout flows.

- **Studio IDE: Sidebar layout improvements for embedded panels**: Improves embedded panel sizing to reduce clipping and scrolling issues in the sidebar.

- **Studio IDE: Fusion prompts reflect actual eligibility**: Improves Fusion banners and prompts by checking project eligibility via a Fusion status endpoint to reduce confusing prompts for ineligible projects.

### Catalog and Discovery

- **Catalog: Improved cross-project lineage for dbt Mesh**: Improves cross-project lineage (“public ancestors”) computation to better match expected external lineage boundaries in dbt Mesh experiences.

### Insights

- **Insights: More reliable Copilot Agent requests and context handoff**: Standardizes Copilot Agent requests to the API and includes active tab content as context to improve reliability of agent runs and handoff.

## Fixes

### dbt platform

- **dbt platform: Webhook form editing more resilient**: Improves webhook subscription editing reliability with asynchronous data and fixes a multiselect focus issue that could cause accidental option selection.

- **dbt platform: Run warning emails render correctly**: Fixes HTML email markup that could break rendering for run warning notifications.

- **dbt platform: Profiles URLs moved under project dashboard** Profile create and view routes now live under `/dashboard/:accountId/projects/:projectId/profiles/...`, which may affect bookmarks and direct links.

### Studio IDE

- **Studio IDE: Cleaner command history list**: Removes hidden background commands (such as listing and parsing commands) from command history to reduce noise for users.

- **Studio IDE: More reliable inline compile and show output**: Improves robustness of inline compile and show output attachment, including cases with tricky quoting and newlines, reducing missing results during interactive use.

- **Studio IDE: More reliable log downloads for dbt commands**: Fixes log download behavior so downloads correctly serve either the active `dbt.log` or the finalized compressed log.

- **Studio IDE: More reliable artifact uploads to Microsoft Azure Blob Storage**: Fixes edge cases where gzipped artifacts (such as manifests) could fail to upload due to upload stream handling, improving upload reliability.

- **Studio IDE: More stable language server protocol (LSP) sessions in workers**: Reduces noisy disconnect and cleanup errors when multiple websocket connections and processes map to the same invocation, improving session stability.

### Catalog

- **Catalog: Search highlighting displays correctly with multiple matches**: Fixes search result highlighting when the backend returns multiple highlights per field, improving readability of matches. Updates search highlights to display as compact badges with counts for easier scanning of results.

- **Catalog: Environment filtering more accurate in search results**: Improves environment-scoped Catalog search filtering by using merged environment identifiers and preserving warehouse-only assets via a dedicated sentinel value.

- **Catalog: Public models return empty list when none exist**: Improves behavior for environments with no public models by returning an empty list instead of falling into follow-on query logic.

### Copilot

- **Copilot: More reliable model context protocol (MCP) connections during long tool calls**: Improves keep-alive behavior so connections shut down cleanly when the client disconnects, reducing noisy failures.

- **Copilot: Semantic Layer tools only offered when available**: Prevents failing tool calls by hiding Semantic Layer tools when the Semantic Layer is not available for the user or environment.

- **Copilot: More accurate HTTP error responses**: Improves error reporting by walking wrapped exceptions and exception groups to return the most specific status code and detail available.

- **Copilot: Empty Tool Outputs No Longer Cause Failures**: Treats empty tool outputs as valid results (for example, “no matches”) to reduce unnecessary “tool call failed” errors.

## Behavior Changes

### dbt platform

- **dbt platform: Fusion default dbt version selection more restrictive**: During connection setup, the default dbt version now only defaults to `latest-fusion` when the selected adapter is Fusion-compatible and the project and account are eligible.

- **dbt platform: dbt version enforcement now project-aware**: dbt version “allowed version” checks now account for `project_id` across jobs and environments, including Application Programming Interface (API)-triggered runs, improving correctness for overrides and automatic mapping to allowed equivalents when possible.

- **dbt platform: Connected app refresh tokens now last 7 days**: Refresh token expiration for connected app OAuth flows increased from 8 hours to 7 days, reducing re-authorization frequency.

### Studio IDE

- **Studio IDE: File stat timestamps now milliseconds**: File stat responses now return modified time and created time as integer milliseconds since epoch instead of float seconds; integrations consuming these endpoints may need to adjust.

- **Studio IDE: Language Server Protocol deferral controls expanded**: The Language Server Protocol (LSP) websocket now supports `defer_env_id` to defer against a specific environment and `no_defer=true` to explicitly disable deferral.

- **Studio IDE: Deferral toggle applied more consistently to Language Server Protocol connections**: When “defer to production” is turned off, the Studio Integrated Development Environment (IDE) now passes `no_defer=true` to align editor intelligence with the selected deferral behavior. (Language Server Protocol (LSP))

### Catalog

- **Catalog: Source freshness outdated status removed**: The freshness status value `outdated` was removed; unconfigured freshness is now handled explicitly as `unconfigured`, and sources will no longer report `outdated`.

- **Catalog: Rows per page selector removed from tables**: The rows-per-page selector was removed, and pagination now uses a fixed page size.

### Orchestration and Run Status

- **Orchestration: Cached and stale outcome status mapping updated**: Cached nodes are now consistently surfaced as Reused with clearer reasons, and stale outcomes are treated as errors, which can change the statuses operators see in run output and telemetry.

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
  - **Existing CSV upload SSE endpoint deprecated**: Migrate to the new two-step [upload source](/docs/platform/use-canvas#upload-data-to-canvas) flow.

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
  - **Enhancement:** [dbt <Constant name="copilot" />](/docs/platform/dbt-copilot) adds missing column descriptions more accurately. <Constant name="copilot" /> generated documentation now correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.

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
