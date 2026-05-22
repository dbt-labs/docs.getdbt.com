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

<ReleaseNote status="New">New products and features</ReleaseNote>
<ReleaseNote status="Enhancement">Performance improvements and feature enhancements</ReleaseNote>
<ReleaseNote status="Fix">Bug and security fixes</ReleaseNote>
<ReleaseNote status="Behavior change">A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings</ReleaseNote>

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC) environments.

For <Constant name="fusion_engine" /> updates, refer to the [dbt-fusion changelog](https://github.com/dbt-labs/dbt-fusion/blob/main/CHANGELOG.md).

## May 2026

<ReleaseNote status="New">The Fusion + Snowflake connection experience is now generally available on the dbt platform, refer to [Fusion upgrade guides](/guides/prepare-fusion-upgrade?step=1) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">Delete individual [<Constant name="copilot" /> chat conversations](/docs/dbt-ai/developer-agent#availability-and-considerations) from the conversation list (three dots → **Delete**). Deleting the open conversation clears the panel.</ReleaseNote>
- **Preview**: The [Developer agent](/docs/dbt-ai/developer-agent) is now in preview. Use natural language prompts to build or refactor models, and generate SQL, tests, documentation, and semantic models from scratch. For more information, refer to the [Developer agent](/docs/dbt-ai/developer-agent).
- **Behavior change:** When you set up single sign-on (SSO) in the <Constant name="dbt_platform" />, the SSO slug is now system-generated and read-only. Existing SSO configurations remain valid, but you can’t change the slug. If you delete and recreate your SSO configuration, the new configuration uses a new, system-generated slug. Refer to [Single sign-on overview](/docs/platform/manage-access/sso-overview) for more information.
- **Enhancement:** The [dbt VS Code extension](/docs/install-dbt-extension?version=2.0) now supports account creation. If you sign in with an existing dbt user that doesn't have an associated <Constant name="dbt_platform"/> account, the registration flow prompts you to create one instead of requiring a separate workflow.
- **Enhancement:** Delete individual [<Constant name="copilot" /> chat conversations](/docs/dbt-ai/developer-agent#availability-and-considerations) from the conversation list (three dots → **Delete**). Deleting the open conversation clears the panel.
- **New:** The Fusion + Snowflake connection experience is now generally available on the dbt platform. See our [Fusion upgrade guides](/guides/prepare-fusion-upgrade?step=1) for information on enabling the upgrade workflows for your environments today!

## April 2026

### April 29, 2026

<ReleaseNote status="Enhancement">The Studio IDE dev agent can now help you investigate and troubleshoot dbt job and run failures using the `troubleshooting-dbt-job-errors` skill, refer to [Debug job failures](/docs/dbt-ai/developer-agent?version=2.0#debug-job-failures) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">Semantic Layer requests through MCP are now capped at 10 MiB (previously unlimited) to improve infrastructure stability.</ReleaseNote>
<ReleaseNote status="Enhancement">The "Debug in Studio" and "Run once on Fusion" menu items are now independently disabled based on your permissions, with tooltips explaining why when unavailable.</ReleaseNote>
<ReleaseNote status="Enhancement">When you click "Debug in Studio," dbt platform now automatically sets your user-level `DBT_DEVELOP_CORE_VERSION` environment variable to `latest-fusion` before opening the Studio IDE.</ReleaseNote>
<ReleaseNote status="Enhancement">If the preparation step before opening the Studio IDE fails, the button temporarily shows "Debug failed" in a red state for 5 seconds before resetting.</ReleaseNote>
<ReleaseNote status="Enhancement">Projects with no jobs configured are now treated as eligible for Fusion, and the upgrade card shows "No jobs configured yet" under job eligibility.</ReleaseNote>
<ReleaseNote status="Enhancement">Clicking "Override eligibility status" on the run details page now opens a confirmation pop-up before applying the override.</ReleaseNote>
<ReleaseNote status="Enhancement">The review button on the jobs list for jobs with unknown Fusion eligibility is now shown to all users regardless of run write permissions.</ReleaseNote>
<ReleaseNote status="Enhancement">The orchestrator now publishes model execution events for grouped models and tests when running with dbt Fusion's OpenTelemetry (OTel) log format.</ReleaseNote>
<ReleaseNote status="Enhancement">The run ingestion pipeline now detects and signals when structured dbt logs are present for a step, so logs appear correctly in the dbt platform for runs ingested from external executors.</ReleaseNote>
<ReleaseNote status="Enhancement">The Cancel and Save buttons on the create private endpoint page now stick to the bottom of the viewport so they remain accessible when scrolling.</ReleaseNote>
<ReleaseNote status="Enhancement">The "Generate docs on run" deprecation notice is now only shown for jobs running on a Fusion dbt version.</ReleaseNote>
<ReleaseNote status="Fix">Fixed request errors when using BYOK OpenAI and Azure OpenAI reasoning model endpoints.</ReleaseNote>
<ReleaseNote status="Fix">Metric manifest fields `granularity` and `offset_to_grain` now accept arbitrary string values instead of only a fixed enum, so projects using custom granularities such as `fiscal_year` will no longer fail ingestion.</ReleaseNote>
<ReleaseNote status="Fix">Tags are now a searchable field in the advanced search panel, using OR logic to return assets matching any of the specified tags.</ReleaseNote>

### April 22, 2026

<ReleaseNote status="New">The catalog search sidebar now includes health and last run status filter sections for dbt resources.</ReleaseNote>
<ReleaseNote status="New">Tag is now a searchable field in the advanced search side panel with OR-logic filter matching.</ReleaseNote>
<ReleaseNote status="Enhancement">Added additional layers of theme preference fallbacks, including the user's OS theme preferences, to avoid incorrect theming when the user-preferences service is slow to respond.</ReleaseNote>
<ReleaseNote status="Enhancement">You can now navigate directly to a specific Studio IDE console tab using a `consoleTab` URL query parameter.</ReleaseNote>
<ReleaseNote status="Enhancement">After the deprecation autofix workflow completes in Fusion environments, a Compile button now appears in the autofix results panel.</ReleaseNote>
<ReleaseNote status="Enhancement">The Fusion eligibility dropdown filter on the jobs list has been replaced with a toggle and help icon that saves its state per-project in your browser.</ReleaseNote>
<ReleaseNote status="Enhancement">The single "Run once on Fusion" button has been replaced with a "Debug on Fusion" menu offering "Debug in Studio," "Run once on Fusion," and (when Copilot is enabled) "Debug in Studio with Copilot" options, refer to [Prepare to upgrade to Fusion](/guides/prepare-fusion-upgrade?step=7) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">The Fusion run error banner on run details now uses the same "Debug on Fusion" menu as the jobs page.</ReleaseNote>
<ReleaseNote status="Enhancement">Testing a webhook subscription now triggers a test event and polls for the delivery receipt, showing the actual HTTP status code and error from the endpoint response.</ReleaseNote>
<ReleaseNote status="Enhancement">The receipt endpoint for webhook events now returns a `404` response when a delivery record has not yet been written, rather than returning an incomplete record.</ReleaseNote>
<ReleaseNote status="Enhancement">Webhook delivery history records now show `504` as the HTTP status code when a delivery timed out (previously stored as `0`).</ReleaseNote>
<ReleaseNote status="Enhancement">The note that event history is limited to the past 7 days now appears on the webhook events history page unconditionally.</ReleaseNote>
<ReleaseNote status="Enhancement">A migration banner now appears on the Slack notification settings page when you have notification settings from a previous Slack integration that can be migrated in one click.</ReleaseNote>
<ReleaseNote status="Enhancement">The OAuth consent page now displays a "View account information" (`account:read`) scope option granting view-only access to account details.</ReleaseNote>
<ReleaseNote status="Enhancement">A new `pending` connectivity status is available for PrivateLink endpoints, in addition to the existing `success` and `failed` states.</ReleaseNote>
<ReleaseNote status="Enhancement">The member permission set now includes `fusion_readiness_read`, allowing members to view Fusion readiness information without requiring elevated permissions.</ReleaseNote>
<ReleaseNote status="Fix">Azure OpenAI deployments now correctly pass the deployment name as the `model` field when using the Responses API.</ReleaseNote>

### April 15, 2026

<ReleaseNote status="Enhancement">The `AccountSearchQueryFilter` input now accepts `health` and `runStatus` filter arrays with OR logic for multiple values within each filter.</ReleaseNote>
<ReleaseNote status="Enhancement">Healthy dbt resources now rank higher in search results than resources with unresolved issues when text relevance is otherwise equivalent.</ReleaseNote>
<ReleaseNote status="Enhancement">Press `Ctrl+\` to open the Commands tab directly from the editor.</ReleaseNote>
<ReleaseNote status="Enhancement">Fusion eligibility reason messages are rewritten to be shorter and more actionable.</ReleaseNote>
<ReleaseNote status="Enhancement">Clicking "Run once on Fusion" on a job now opens a confirmation modal before triggering the run.</ReleaseNote>
<ReleaseNote status="Enhancement">Run steps that execute `dbt ls` or `dbt list` now show node results with a no-op status instead of "unknown."</ReleaseNote>
<ReleaseNote status="Enhancement">The account-level setting to enable Fusion readiness and upgrade features now has an updated label and a more detailed description.</ReleaseNote>
<ReleaseNote status="Enhancement">The "Debug on Fusion" button on failed Fusion run banners now sets your personal `DBT_DEVELOP_CORE_VERSION` override to `latest-fusion` before opening Studio IDE.</ReleaseNote>
<ReleaseNote status="Enhancement">The "Status" column in the private endpoints list is renamed to "Connectivity status" for clarity.</ReleaseNote>
<ReleaseNote status="Enhancement">When pasting Snowflake Private Link configuration output, the validation error now lists the specific required fields that are missing.</ReleaseNote>
<ReleaseNote status="Enhancement">Environment credential and connection forms that accept YAML Extended Attributes now correctly validate arrays as values.</ReleaseNote>
<ReleaseNote status="Enhancement">When creating a Snowflake PrivateLink connection, you can now supply an optional `interface_endpoint_id` to attach a new profile to an existing interface endpoint.</ReleaseNote>
<ReleaseNote status="Fix">Files inside a newly created folder are now listed individually in the Git Controls panel instead of as a single unexpanded entry.</ReleaseNote>
<ReleaseNote status="Fix">Files created inside a new folder now always display the parent folder name as a hint in the Git Controls panel.</ReleaseNote>

### April 8, 2026

<ReleaseNote status="New">The dbt MCP remote server now includes Admin API tools for listing, inspecting, triggering, canceling, and retrying dbt jobs and runs from connected AI assistants.</ReleaseNote>
<ReleaseNote status="New">A new OAuth consent page lets you authorize third-party applications to access your dbt platform account with selected permissions and projects.</ReleaseNote>
<ReleaseNote status="New">Test and snapshot detail pages now include a Performance tab showing cost insights data matching the existing model performance experience.</ReleaseNote>
<ReleaseNote status="Enhancement">The Studio DevAgent now selects the lightest appropriate validation check after each change instead of always running a full `dbt compile`.</ReleaseNote>
<ReleaseNote status="Enhancement">The simple defer-to-production toggle has been replaced with a popover that lets you choose between your development environment, dbt's default deferral behavior, or a specific custom environment.</ReleaseNote>
<ReleaseNote status="Enhancement">An "Edit / Revert" action has been added to the version override option in the environment popover.</ReleaseNote>
<ReleaseNote status="Enhancement">The active-file context pill has been moved to above the text input for greater visibility.</ReleaseNote>
<ReleaseNote status="Enhancement">State-Aware Orchestration (SAO) test runs that reuse prior results now display with a "reused" icon in the DAG test status lens.</ReleaseNote>
<ReleaseNote status="Enhancement">The `function` resource type is now recognized in dbt selectors and the resource node type map.</ReleaseNote>
<ReleaseNote status="Enhancement">A "Fusion status" column is now available in your account insights table showing each project's readiness and migration progress.</ReleaseNote>
<ReleaseNote status="Fix">In Fusion mode, the parse status badge no longer switches to an error state solely because diagnostic errors are present.</ReleaseNote>
<ReleaseNote status="Fix">"Remote rejected authentication" is now recognized as a non-retryable git authentication error, giving a clear failure message instead of a misleading retry loop.</ReleaseNote>
<ReleaseNote status="Fix">Models with a `last_run_status` of `reused` are no longer marked stale even when their last execution date exceeds 30 days.</ReleaseNote>
<ReleaseNote status="Fix">Fixed a bug where resource counts on the project landing page were not updated when switching environments.</ReleaseNote>

### April 1, 2026

<ReleaseNote status="New">Studio IDE now supports fuzzy file path search that finds files using partial name matching with glob patterns, result limits, and ordered results.</ReleaseNote>
<ReleaseNote status="New">A new `/oauth/consent` endpoint enables the Connected Auth OAuth flow supporting user consent decisions, project-level resource boundaries, and authorization code issuance.</ReleaseNote>
<ReleaseNote status="Enhancement">The Studio agent now remembers your last-used mode (Ask or Code) across browser sessions.</ReleaseNote>
<ReleaseNote status="Enhancement">File search now validates each result against the filesystem before returning matches, excluding deleted but unstaged files.</ReleaseNote>
<ReleaseNote status="Enhancement">Removed behavior where the IDE server automatically pulled changes from your primary branch during git status checks.</ReleaseNote>
<ReleaseNote status="Enhancement">Teradata has been added to the SQL dialect adapter map, enabling column-level lineage parsing for dbt projects using the Teradata adapter.</ReleaseNote>
<ReleaseNote status="Enhancement">Added fields indicating availability of readiness and migration features.</ReleaseNote>
<ReleaseNote status="Enhancement">Account feature flag changes now take effect within 60 seconds instead of up to one hour.</ReleaseNote>
<ReleaseNote status="Enhancement">Reduced the likelihood of delayed notifications (webhooks, email, Slack, and Teams) in certain third-party/system disruption scenarios.</ReleaseNote>
<ReleaseNote status="Fix">The GitHub webhook endpoint now correctly checks for a null webhook secret before attempting to validate the request signature.</ReleaseNote>
<ReleaseNote status="Fix">Repository fields for GitHub installation and webhook IDs have been promoted from 32-bit to 64-bit integers to accommodate IDs that exceed the 32-bit integer range.</ReleaseNote>
<ReleaseNote status="Behavior change">The Fusion migration checklist and related UI now use the `is_migration_available` field from the Fusion status API instead of the legacy feature flag, so Fusion migration UI is shown only when the backend marks the project as ready.</ReleaseNote>
<ReleaseNote status="New">A universal login URL is available at [https://login.dbt.com](https://login.dbt.com) for viewing accounts across instances, refer to [Log in to dbt platform](/docs/platform/about-platform/login) for more information.</ReleaseNote>
<ReleaseNote status="Fix">Refreshing the same browser tab now restores your active <Constant name="dev_agent" /> conversation instead of showing the empty state.</ReleaseNote>
<ReleaseNote status="Enhancement">The dbt VS Code extension's Get started panel has been redesigned and surfaces the exact next setup step, including a new agentic migration option, refer to [Getting started](/docs/install-dbt-extension#getting-started) for more information.</ReleaseNote>
<ReleaseNote status="Beta">[Model query history](/docs/explore/model-query-history) now also supports Databricks and Redshift, refer to [Credential permissions](/docs/explore/model-query-history#credential-permissions) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">[Slack notifications (account-level)](/docs/deploy/job-notifications#slack-notifications-account) and [Microsoft Teams notifications](/docs/deploy/job-notifications#microsoft-teams-notifications) are now generally available.</ReleaseNote>
<ReleaseNote status="Enhancement">When using the [dbt autofix](https://github.com/dbt-labs/dbt-autofix) tool in the <Constant name="studio_ide" />, you can now compile your project directly from the results panel after a successful `dbt parse`, refer to [Fix deprecation warnings](/docs/platform/studio-ide/autofix-deprecations) for more information.</ReleaseNote>
<ReleaseNote status="Beta">DuckDB is now supported in the <Constant name="fusion_engine" /> CLI for running local dbt projects without a warehouse account, refer to [Connect DuckDB](/docs/local/connect-data-platform/duckdb-setup) for more information.</ReleaseNote>
<ReleaseNote status="New">You can now configure Snowflake PrivateLink endpoints directly in <Constant name="dbt_platform" /> in private beta via Account settings → Integrations → Private endpoints, refer to [AWS PrivateLink for Snowflake](/docs/platform/secure/private-connectivity/aws/aws-snowflake?version=1.12) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">You can now use arrays as values for keys in the <Constant name="dbt_platform" /> extended attributes YAML editor, refer to [Extended attributes](/docs/dbt-cloud-environments#extended-attributes) for more information.</ReleaseNote>
<ReleaseNote status="Beta">The Redshift adapter now supports a `datasharing` profile credential on the <Constant name="dbt_platform" /> Latest release track enabling cross-database and cross-cluster access, refer to [Redshift setup](/docs/local/connect-data-platform/redshift-setup#datasharing) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">When a connection does not have platform metadata credentials configured yet, the credentials form now renders in edit mode immediately, refer to [Configure the warehouse connection](/docs/explore/external-metadata-ingestion#configure-the-warehouse-connection) for more information.</ReleaseNote>
<ReleaseNote status="New">The [dbt Remote dbt MCP server](/docs/dbt-ai/about-mcp?version=2.0) now supports Admin API calls for troubleshooting job-related errors in agents like Claude and Cursor.</ReleaseNote>
<ReleaseNote status="New">The [Developer agent](/docs/dbt-ai/developer-agent) is now in beta for writing or refactoring dbt models from natural language and generating documentation, tests, semantic models, and SQL code.</ReleaseNote>
<ReleaseNote status="Enhancement">The Studio IDE now validates dbt YAML using <Constant name="fusion" /> aligned JSON Schema from [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema) across all release tracks.</ReleaseNote>
<ReleaseNote status="Enhancement">The Studio IDE status bar now offers more control, more detailed information, and quicker access to settings for deferral, dbt version, and project status, refer to the [Studio IDE docs](/docs/platform/studio-ide/ide-user-interface#the-command-and-status-bar) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">In Snowflake Private endpoints, output validation errors now display inline beneath the text area and the Submit request button is disabled when output is invalid.</ReleaseNote>

## March 2026

### March 25, 2026

<ReleaseNote status="New">When a run using the dbt Fusion engine fails, a banner now appears on the run details page with options to debug the failure in Studio IDE or with Copilot.</ReleaseNote>
<ReleaseNote status="Enhancement">The bottom console pane now opens at a preferred size of 33% of the available space for a more consistent default layout.</ReleaseNote>
<ReleaseNote status="Enhancement">File search now reports results incrementally on a per-file basis rather than per-match line, reducing memory pressure.</ReleaseNote>
<ReleaseNote status="Enhancement">When Studio IDE applies multi-file edits, it now only updates editor models for files that are already open.</ReleaseNote>
<ReleaseNote status="Enhancement">You can now set `fusion_migration_enabled` on a project via the project update API.</ReleaseNote>
<ReleaseNote status="Enhancement">The jobs list endpoint now accepts an `is_fusion_ready` boolean query parameter and supports `fusion_readiness` in the `include_related` parameter.</ReleaseNote>
<ReleaseNote status="Enhancement">When adding platform metadata credentials for a connection, the credential form is now shown immediately instead of requiring you to click an "Add credentials" button first.</ReleaseNote>
<ReleaseNote status="Fix">Fixed a bug where resource counts in the navigation tree were not refreshed when switching environments.</ReleaseNote>
<ReleaseNote status="Fix">A new cleanup job detects runs and run steps that have exceeded the maximum allowed duration and marks them as `CANCELLED`.</ReleaseNote>
<ReleaseNote status="Fix">The Semantic Layer Gateway now retries the initial connection when a Snowflake warehouse is waking up from auto-suspend instead of failing immediately.</ReleaseNote>
<ReleaseNote status="Fix">Fixed an issue where group permission sync could miss updates for groups with many permissions.</ReleaseNote>
<ReleaseNote status="Behavior change">Studio IDE now enables Fusion OpenTelemetry (OTel) log rendering for all invocations running on a Fusion core version, removing the previous feature flag requirement.</ReleaseNote>

### March 18, 2026

<ReleaseNote status="Enhancement">Studio IDE now reuses its file-search index across searches, so repeated searches return results faster.</ReleaseNote>
<ReleaseNote status="Enhancement">Studio IDE debounces rapid file change events and avoids applying stale responses, so Git status badges update more reliably during bulk edits and saves.</ReleaseNote>
<ReleaseNote status="Enhancement">The server status popover uses a clearer grouped layout and action buttons to help you troubleshoot development credentials and server health.</ReleaseNote>
<ReleaseNote status="Enhancement">Copilot and agents can use a product documentation toolset to answer product and workflow questions more reliably.</ReleaseNote>
<ReleaseNote status="Enhancement">You can open Copilot in a dedicated full-screen view for a more focused chat and coding workflow.</ReleaseNote>
<ReleaseNote status="Enhancement">Copilot now references your active file by path instead of automatically attaching the file contents, reducing message size.</ReleaseNote>
<ReleaseNote status="Enhancement">Copilot can run `dbt-autofix` commands with confirmation and stream the output into chat.</ReleaseNote>
<ReleaseNote status="Enhancement">Catalog search now groups non-standard materializations under a single "Custom" filter.</ReleaseNote>
<ReleaseNote status="Enhancement">Insights can resolve missing Redshift query IDs from warehouse query history when artifacts do not include them.</ReleaseNote>
<ReleaseNote status="Enhancement">If dbt Copilot is temporarily locked for your account, you can still open Copilot from Insights to see lock details.</ReleaseNote>
<ReleaseNote status="Enhancement">Run details now include who triggered or canceled a run (user or service token) for auditing run activity.</ReleaseNote>
<ReleaseNote status="Enhancement">When an environment uses a custom branch, dbt platform now carries that branch through run triggers, retries, and reruns more consistently.</ReleaseNote>
<ReleaseNote status="Enhancement">You can now retrieve Fusion readiness signals for projects, environments, and jobs to support Fusion migration planning.</ReleaseNote>
<ReleaseNote status="Enhancement">Orchestration now reads the invocation name from `run_results.json` using `command` when `invocation_command` is missing.</ReleaseNote>
<ReleaseNote status="Enhancement">Run step history ingestion now drops invalid events and de-duplicates redundant step-start events before writing step data.</ReleaseNote>
<ReleaseNote status="Enhancement">You can now add project descriptions of up to 1,024 characters.</ReleaseNote>
<ReleaseNote status="Enhancement">You can now open a connection directly from the connection profile table in a new tab.</ReleaseNote>
<ReleaseNote status="Enhancement">You now get more consistent validation and clearer error messages for invalid YAML syntax when editing extended attributes.</ReleaseNote>
<ReleaseNote status="Enhancement">Cached query results can now be matched and reused more reliably when your query includes filters.</ReleaseNote>
<ReleaseNote status="Fix">Retries now only apply to transient errors during Cloud Config lookups, reducing intermittent failures without added delay for permission or authentication errors.</ReleaseNote>
<ReleaseNote status="Fix">If you are already authenticated and land on `/login` with `current_email`, dbt platform now redirects you to `/api/auth/auth-login/` so the email is forwarded during sign in.</ReleaseNote>
<ReleaseNote status="Fix">Turning IP restrictions on or off now updates form state correctly so your changes save as expected.</ReleaseNote>
<ReleaseNote status="Fix">The audit log date range defaults no longer shift during re-renders, so your filters stay stable while you review results.</ReleaseNote>
<ReleaseNote status="Fix">Domain updates during Single Sign-On (SSO) migration no longer rely on mutating existing provider data, improving save reliability.</ReleaseNote>
<ReleaseNote status="Fix">If your OpenAI credentials include invalid characters, you now get a clearer error message.</ReleaseNote>
<ReleaseNote status="Fix">Encrypted credential fields now stay optional when you edit credentials, reducing unexpected validation failures.</ReleaseNote>
<ReleaseNote status="Fix">You now see the correct connection details more consistently when you edit an environment that uses global connections and connection profiles.</ReleaseNote>
<ReleaseNote status="Fix">You can now open and review run steps for ingestion-triggered runs.</ReleaseNote>
<ReleaseNote status="Fix">Run results no longer populate an error string with `None` when dbt does not provide a message or failure count.</ReleaseNote>
<ReleaseNote status="Fix">When Orchestration cannot restore the repository cache because the dbt project is missing or malformed, it now returns an invalid project error.</ReleaseNote>
<ReleaseNote status="Fix">Snapshots selected but not executed in multi-step runs now appear with a skipped status.</ReleaseNote>
<ReleaseNote status="Fix">Insights now clears the Copilot chat loading state reliably after responses complete or error.</ReleaseNote>
<ReleaseNote status="Fix">When you arrive in Insights with a Copilot handoff message, Insights now starts the handoff once and clears stale handoff state when you navigate directly.</ReleaseNote>
<ReleaseNote status="Fix">Semantic Layer now derives explicit string conversions from returned result metadata, so categorical dimensions and entities are more consistently typed as strings in Tableau and Power BI queries.</ReleaseNote>
<ReleaseNote status="Fix">Cache invalidation no longer fails when an in-memory cache key is already missing.</ReleaseNote>
<ReleaseNote status="Fix">Semantic Layer now requests and caches run details scoped to your account, reducing incorrect run validation results.</ReleaseNote>
<ReleaseNote status="Fix">If you cancel a request while an agent is running tools, the agent now recovers cleanly instead of getting stuck on incomplete tool-call history.</ReleaseNote>
<ReleaseNote status="Fix">Studio IDE now removes the accept and reject overlay when you leave an AI diff view to prevent stale UI controls.</ReleaseNote>
<ReleaseNote status="Behavior change">Studio IDE now uses VS Code Quick Open for file search (`Cmd+P` or `Ctrl+P`) and the VS Code Command Palette (`Cmd+Shift+P` or `Ctrl+Shift+P`) instead of the legacy Studio dialogs.</ReleaseNote>
<ReleaseNote status="Behavior change">Tableau and Power BI queries can no longer request `MIN()` or `MAX()` for a metric or dimension (except time min-max queries), and you now receive a clear error if you attempt it.</ReleaseNote>

### March 11, 2026

<ReleaseNote status="New">You can request a new Snowflake private endpoint from account settings by pasting the output from `SELECT SYSTEM$GET_PRIVATELINK_CONFIG();` and track request status in the private endpoints table.</ReleaseNote>
<ReleaseNote status="Enhancement">You can now retry failed runs as long as your environment is on dbt Core version `1.6` or higher or dbt Fusion.</ReleaseNote>
<ReleaseNote status="Enhancement">Slack channel discovery and notifications now retry on Slack rate limits to reduce dropped messages during busy periods.</ReleaseNote>
<ReleaseNote status="Enhancement">OpenAPI schemas now mark 64-bit integer fields as `format: int64` to improve generated client types.</ReleaseNote>
<ReleaseNote status="Enhancement">Credentials OpenAPI docs now use a `type` discriminator to improve code generation and request validation.</ReleaseNote>
<ReleaseNote status="Fix">Searching jobs with numeric terms no longer triggers API validation errors.</ReleaseNote>
<ReleaseNote status="Fix">When dbt platform cannot fetch a publication artifact for an upstream project declared in `dependencies.yml`, you now see which project is missing an artifact and guidance to run the upstream environment.</ReleaseNote>
<ReleaseNote status="Fix">Microsoft Teams notifications now use the correct trigger event type for each notification.</ReleaseNote>
<ReleaseNote status="Fix">You now receive more accurate errors from permission checks, with underlying service errors surfacing instead of being reported as authorization failures.</ReleaseNote>
<ReleaseNote status="Fix">Creating a private endpoint now returns a `400` error with a clear message when `snowflake_output` is malformed or not valid JSON.</ReleaseNote>
<ReleaseNote status="Behavior change">You now see an informational notice instead of the Model timing chart for dbt Fusion runs because dbt Fusion handles threading differently.</ReleaseNote>
<ReleaseNote status="Behavior change">SCIM schema discovery now reports `id` fields as strings for users and groups.</ReleaseNote>

### March 4, 2026

<ReleaseNote status="Enhancement">Job settings now describe state-aware orchestration (SAO) as only building models when data or code changes are detected.</ReleaseNote>
<ReleaseNote status="Enhancement">Fusion cost optimization settings now link to account-level Cost Insights settings and setup documentation.</ReleaseNote>
<ReleaseNote status="Enhancement">When you enable manual updates for SCIM, dbt platform now asks you to confirm to avoid accidentally allowing changes outside your identity provider.</ReleaseNote>
<ReleaseNote status="Enhancement">When a SCIM-provisioned user with an expired invite is added to a SCIM-managed group, the invite is now automatically resent during group assignment.</ReleaseNote>
<ReleaseNote status="Enhancement">Projects with missing names now show as "Untitled Project," and you can save project descriptions as empty.</ReleaseNote>
<ReleaseNote status="Enhancement">Studio IDE no longer shows "Open Settings" buttons in editor notifications because Studio IDE does not expose VS Code settings.</ReleaseNote>
<ReleaseNote status="Fix">Catalog no longer gets stuck loading the file tree on initial page load.</ReleaseNote>
<ReleaseNote status="Fix">Trust signals now suppress less-severe upstream-source issues when a more severe issue is present.</ReleaseNote>
<ReleaseNote status="Fix">When dbt platform cannot decrypt a deploy key, you now get a clearer failure instead of a generic git credentials error.</ReleaseNote>
<ReleaseNote status="Fix">If authentication fails when you connect to the Language Server Protocol (LSP) WebSocket, the connection now closes cleanly instead of failing with an internal server error.</ReleaseNote>
<ReleaseNote status="Fix">Reduced environment setup timeouts and resolved intermittent authentication failures during busy periods.</ReleaseNote>
<ReleaseNote status="Fix">If your development connection credentials are invalid, you now see a clearer error message.</ReleaseNote>
<ReleaseNote status="Behavior change">dbt platform now treats `versionless` as deprecated and updates existing environments and jobs to use `latest`.</ReleaseNote>
<ReleaseNote status="Behavior change">If you send events that include a `run_id`, you must also provide an `account_identifier`; if `account_identifier` is missing, the event fails instead of falling back to a `run_id`-only lookup.</ReleaseNote>
<ReleaseNote status="Enhancement">The environment [Connection profiles](/docs/platform/about-profiles#environment-profiles-table) page has been updated with a clickable profile name button, connection column links, and a swap icon for changing assigned profiles, refer to [About profiles](/docs/platform/about-profiles) for more information.</ReleaseNote>
<ReleaseNote status="Beta">Apache Spark is now supported in the <Constant name="fusion_engine" /> CLI, refer to [Connect Apache Spark to Fusion](/docs/local/connect-data-platform/spark-setup) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">[Cost Insights](/docs/explore/cost-insights) charts now include an Assets filter (Models / Tests / All) on the Cost, Usage, Query run time, and Builds tabs, refer to [Explore cost data](/docs/explore/explore-cost-data) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">[Deferral](/reference/node-selection/defer) now supports [user-defined functions (UDFs)](/docs/build/udfs), allowing models that depend on UDFs to run without first building those UDFs in your current target.</ReleaseNote>
<ReleaseNote status="Fix">Status messages that exceed the 1024 character limit are now automatically truncated to prevent validation errors and run timeouts.</ReleaseNote>
<ReleaseNote status="Fix">Resolved an issue where [retrying failed runs](/docs/deploy/retry-jobs) triggered from Git tags would use the wrong commit instead of the original tagged commit.</ReleaseNote>
<ReleaseNote status="New">The [dbt MCP server](/docs/dbt-ai/about-mcp?version=2.0#product-docs) now includes product docs tools (`search_product_docs` and `get_product_doc_pages`) that let your AI assistant search and fetch pages from docs.getdbt.com in real time, refer to [the dbt MCP repo](https://github.com/dbt-labs/dbt-mcp?tab=readme-ov-file#product-docs) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">The Model Timing tab displays an informative banner for <Constant name="fusion_engine" /> runs instead of the timing chart explaining that model timing is not yet available for Fusion runs.</ReleaseNote>
<ReleaseNote status="Behavior change">[Snowflake plans to increase](https://docs.snowflake.com/en/release-notes/bcr-bundles/un-bundled/bcr-2118) the default column size for string and binary data types in May 2026, and `dbt-snowflake` versions below v1.10.6 may fail to build certain incremental models, refer to [Assess impact and required actions](/reference/resource-configs/snowflake-configs#assess-impact-and-required-actions) for more information.</ReleaseNote>
<ReleaseNote status="New">The new <Constant name="semantic_layer"/> YAML specification is now available on the <Constant name="dbt_platform" /> Latest release track, refer to [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec) for more information.</ReleaseNote>
<ReleaseNote status="Behavior change">New projects in trial, starter, or Enterprise accounts now default to Fusion Latest for all new environments with a supported adapter, refer to [environment settings](/docs/dbt-cloud-environments#change-environment-settings) for more information.</ReleaseNote>

## February 2026

### February 25, 2026

<ReleaseNote status="New">Saved query definitions (including tags, exports, parameters, and lineage relationships) are now captured during ingestion for Catalog lineage and governance workflows.</ReleaseNote>
<ReleaseNote status="Enhancement">Run step structured logs now show an indicator when system warnings or errors are present.</ReleaseNote>
<ReleaseNote status="Enhancement">Account Settings now shows the backend-provided region display name for clearer, more accurate region labeling.</ReleaseNote>
<ReleaseNote status="Enhancement">Changes to our UI to improve the experience of managing groups with SCIM enabled.</ReleaseNote>
<ReleaseNote status="Enhancement">After a user accepts an invite, the UI now explains that they must log in using SSO to fully redeem the invite.</ReleaseNote>
<ReleaseNote status="Enhancement">Studio IDE now catches unexpected render failures with a top-level error boundary and shows Not Found more reliably for unknown in-project routes.</ReleaseNote>
<ReleaseNote status="Enhancement">The main navigation trigger area is now a navigation element with improved focus and labeling.</ReleaseNote>
<ReleaseNote status="Enhancement">When VS Code search is enabled, Studio IDE avoids unregistering Quick Open and suppresses conflicting command palette shortcuts.</ReleaseNote>
<ReleaseNote status="Enhancement">Source freshness Outdated status can now be computed at query time, improving freshness status filtering consistency.</ReleaseNote>
<ReleaseNote status="Enhancement">Search results better support column-level navigation, with a clear validation error for very long queries and improved alignment in lineage visuals.</ReleaseNote>
<ReleaseNote status="Enhancement">Lineage graph building now includes cross-project dependencies and supports function nodes as first-class lineage entities.</ReleaseNote>
<ReleaseNote status="Enhancement">Projects APIs now explicitly support DELETE with stricter permission checks.</ReleaseNote>
<ReleaseNote status="Behavior change">Webhook payloads now include `runFinishedAt` only for completed events and `runErroredAt` only for errored events, with run status normalized from Cancelled to Canceled.</ReleaseNote>
<ReleaseNote status="Behavior change">Source freshness expiration windows can optionally derive from each source's freshness criteria rather than a fixed window.</ReleaseNote>
<ReleaseNote status="Behavior change">For very large `manifest.json` files, ingestion may strip sources above a configurable threshold to prevent out of memory failures.</ReleaseNote>
<ReleaseNote status="Behavior change">Deprecated settings `project_storage_bucket_name` and `project_storage_object_prefix` have been removed; migrate to `object_storage_bucket_name` and `object_storage_object_prefix`.</ReleaseNote>

### February 18, 2026

<ReleaseNote status="New">Cost Insights shows estimated warehouse compute costs and run times for your dbt projects and models in private beta, refer to your account manager to request access.</ReleaseNote>
<ReleaseNote status="Enhancement">Studio IDE can pause the Language Server Protocol (LSP) in background tabs and resume on return to improve stability when the editor is open in more than one tab.</ReleaseNote>
<ReleaseNote status="Enhancement">Added a VS Code-style header showing a dbt badge and current project name, with an option to hide surrounding chrome for more editor space.</ReleaseNote>
<ReleaseNote status="Enhancement">Surfaces more actionable filesystem errors (for example, name too long and file-is-a-directory) instead of generic failures.</ReleaseNote>
<ReleaseNote status="Enhancement">Added a Copy Relative Path action that respects `dbt_project_subdirectory` for quicker navigation and sharing.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved user-facing errors for lineage failures including server errors and cases where upstream returns HTML instead of JSON.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved private endpoint filtering by adapter type and updated Studio IDE to use the correct version 3 private endpoints endpoint.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved CSV upload progress, resume behavior, and common error handling during Add Sources.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved DAG performance by rendering only visible elements and improving layout for disconnected nodes.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved keyboard and hover behavior in the search dropdown and avoids showing stale results while searches are loading.</ReleaseNote>
<ReleaseNote status="Enhancement">Clearer invite status (invitation sent and invitation accepted) now supports accepted, login pending for SSO.</ReleaseNote>
<ReleaseNote status="Enhancement">The unpaid billing banner is no longer feature-flagged and will display when applicable.</ReleaseNote>
<ReleaseNote status="Enhancement">Bug fixes and improvements related to managed invites for easier processing.</ReleaseNote>
<ReleaseNote status="Enhancement">Added Server-Sent Events (SSE) streaming control so clients can choose chunk streaming or message streaming.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved responsiveness for AI Similar Models and Similar Sources requests by enforcing tighter embedding and database timeouts.</ReleaseNote>
<ReleaseNote status="Enhancement">Categorized OpenAI failures with BYOK awareness so BYOK failures return the expected 424-class behavior instead of generic 500-series errors.</ReleaseNote>
<ReleaseNote status="Enhancement">Updated dbt MCP tooling including adding `get_all_macros` and improving error categorization for more accurate responses.</ReleaseNote>
<ReleaseNote status="Fix">Ensures bulk edits stay in sync after server-side edits to prevent stale content from overwriting changes.</ReleaseNote>
<ReleaseNote status="Fix">Fixes preview and match highlighting assembly so match ranges align correctly in multi-line previews.</ReleaseNote>
<ReleaseNote status="Fix">Shows a proper error layout and notification on unrecoverable initialization failures.</ReleaseNote>
<ReleaseNote status="Fix">Prevents incorrect tab closing after uploads complete and avoids showing the floating node panel when not on a file tab.</ReleaseNote>
<ReleaseNote status="Fix">Fixes lineage resolution for public model parents when the producer model lives in a non-default environment.</ReleaseNote>
<ReleaseNote status="Fix">Fixes an OpenAI connection pool leak that could lead to out-of-memory (OOM) conditions under sustained load.</ReleaseNote>
<ReleaseNote status="Fix">Reduces intermittent failures when attaching related models by increasing internal timeouts for related-model fetching.</ReleaseNote>
<ReleaseNote status="Behavior change">Prevents rename and delete operations on the repository root and shows clearer warnings.</ReleaseNote>
<ReleaseNote status="Behavior change">Improves dbt command log streaming reliability by resuming from the last known CLI event offset.</ReleaseNote>
<ReleaseNote status="Behavior change">Job Admin now includes `profiles_write`, which can change what Job Admin users can do where Profiles are enabled.</ReleaseNote>
<ReleaseNote status="Behavior change">Version 3 Private Endpoints query parameter `name_search` is renamed to `search`, and search matches endpoint name and endpoint value.</ReleaseNote>
<ReleaseNote status="Behavior change">Postgres connection validation now requires a non-empty database name.</ReleaseNote>
<ReleaseNote status="Behavior change">Prevents associating the same active credentials object to multiple users, returning a conflict instead of silently duplicating associations.</ReleaseNote>
<ReleaseNote status="Behavior change">GitHub shared webhooks now accept repository URLs using https, git, and SSH formats.</ReleaseNote>
<ReleaseNote status="Behavior change">Slack linking and notification settings are more strictly gated by the relevant permissions.</ReleaseNote>
<ReleaseNote status="Behavior change">Slack integration listing now uses job notifications read permission, reducing incorrect permission-denied scenarios.</ReleaseNote>
<ReleaseNote status="Behavior change">Reduced default timeouts from 60 seconds to 5 seconds for Cloud Config and Cloud Artifact calls, causing requests to fail faster in high-latency environments unless overridden.</ReleaseNote>
<ReleaseNote status="Behavior change">Corrects the OTel log payload field name to `additional_message` (from the misspelled `addtional_message`), which may require updates to downstream parsing.</ReleaseNote>

### February 11, 2026

<ReleaseNote status="Enhancement">Improved model graph layout performance to reduce load time in larger projects.</ReleaseNote>
<ReleaseNote status="Enhancement">Similar Models lookup now uses an optimized vector search strategy to reduce timeouts on large projects.</ReleaseNote>
<ReleaseNote status="Enhancement">When your dbt project is in a subdirectory, the project root is highlighted in the Catalog file tree.</ReleaseNote>
<ReleaseNote status="Enhancement">Rename and delete actions now use native editor behaviors when using the Catalog file tree.</ReleaseNote>
<ReleaseNote status="Enhancement">Formatting updates now apply directly to the active editor buffer to reduce prompts and inconsistent results.</ReleaseNote>
<ReleaseNote status="Enhancement">Code generation no longer creates a temporary file in your repository during generation.</ReleaseNote>
<ReleaseNote status="Enhancement">Environment settings now prevent saving a Fusion dbt version with an incompatible connection and surface field level validation errors.</ReleaseNote>
<ReleaseNote status="Enhancement">When setting up a new connection, Fusion eligible adapters now default to the latest Fusion version to reduce misconfiguration.</ReleaseNote>
<ReleaseNote status="Enhancement">Private Endpoints can be sorted by status and connections, and endpoint details now show associated connections and environments.</ReleaseNote>
<ReleaseNote status="Enhancement">Invocation event streaming is more reliable for long running jobs by deriving totals from the latest stream event identifier.</ReleaseNote>
<ReleaseNote status="Enhancement">Log streaming now cleans up Redis keys after a stream completes, reducing stale keys and Redis memory pressure for high volume runs.</ReleaseNote>
<ReleaseNote status="Fix">When users hit the usage limit, dbt disables Copilot and shows a clear message including the reset date when available.</ReleaseNote>
<ReleaseNote status="Fix">Fixed duplicate Git status decorations in the file tree that could cause visual issues and performance impact.</ReleaseNote>
<ReleaseNote status="Fix">Studio IDE no longer runs an automatic pull on the primary branch to reduce unexpected changes during development.</ReleaseNote>
<ReleaseNote status="Fix">File operations now return structured validation errors and explicitly reject names that exceed operating system limits.</ReleaseNote>
<ReleaseNote status="Fix">Command logs for the dbt Cloud CLI are refreshed and finalized more reliably.</ReleaseNote>
<ReleaseNote status="Fix">Scheduler triggered runs now include account context, improving run attribution and preventing some downstream triggers from running without proper context.</ReleaseNote>
<ReleaseNote status="Fix">Exposure generated events now validate that account identifiers are numeric before triggering follow on automation.</ReleaseNote>
<ReleaseNote status="Fix">Webhook payloads now include consistent completion and error timestamps, and canceled runs include a canceled timestamp and normalized status.</ReleaseNote>
<ReleaseNote status="Fix">When both failure and completion triggers are configured, errored runs may generate two webhook deliveries to match legacy behavior.</ReleaseNote>
<ReleaseNote status="Fix">Ingestion now accepts the `functions` section to prevent parse failures on newer manifest schemas.</ReleaseNote>
<ReleaseNote status="Fix">Macro metadata persistence now uses more consistent UTC timestamps and improves argument comparison to reduce noisy or incorrect macro updates.</ReleaseNote>
<ReleaseNote status="Behavior change">Profiles API responses no longer include credential configuration and extended attributes; use the appropriate credentials and configuration endpoints instead.</ReleaseNote>
<ReleaseNote status="Behavior change">Account Connections list supports filtering by Private Endpoint identifier for easier management.</ReleaseNote>
<ReleaseNote status="Behavior change">Private Endpoints list now supports ordering by endpoint state and connection count.</ReleaseNote>
<ReleaseNote status="Behavior change">User licenses now include read access for Private Link resources, which may change who can view Private Link related settings.</ReleaseNote>
<ReleaseNote status="Behavior change">Generated metrics are now written directly into the active model file instead of using an accept and reject diff flow.</ReleaseNote>

### February 4, 2026

<ReleaseNote status="New">Added a link that opens Copilot from the console toolbar so you can use Copilot to read files and list directories for better context.</ReleaseNote>
<ReleaseNote status="New">Added a command to copy a file path relative to your dbt project subdirectory for easier sharing in runbooks and support tickets.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved Fusion setup by showing "Fusion compatible" indicators during connection setup.</ReleaseNote>
<ReleaseNote status="Enhancement">When Compare Changes subqueries fail, the experience now surfaces a partial success state with expandable warning details.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved log usability during in-progress runs by preserving text selection while logs auto-refresh and rerender.</ReleaseNote>
<ReleaseNote status="Enhancement">Added server-side search and clearer loading and empty states to the job picker for job-completion triggers.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved artifact handling for job documentation and run artifacts by strengthening HTML detection and returning clearer `Content-Type` and download filenames.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved Private Endpoints API v3 list behavior with validated query parameters, filtering, limit and offset pagination, and `connection_count` in responses.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved formatting reliability by consistently using the active editor content and a stable repo-relative path when invoking formatting.</ReleaseNote>
<ReleaseNote status="Enhancement">Reduced errors when working with non-file tabs and improved robustness around tab-close and Git checkout flows.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved embedded panel sizing to reduce clipping and scrolling issues in the sidebar.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved Fusion banners and prompts by checking project eligibility via a Fusion status endpoint to reduce confusing prompts for ineligible projects.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved cross-project lineage ("public ancestors") computation to better match expected external lineage boundaries in dbt Mesh experiences.</ReleaseNote>
<ReleaseNote status="Enhancement">Standardized Copilot Agent requests to the API and included active tab content as context to improve reliability of agent runs and handoff.</ReleaseNote>
<ReleaseNote status="Fix">Improved webhook subscription editing reliability with asynchronous data and fixed a multiselect focus issue that could cause accidental option selection.</ReleaseNote>
<ReleaseNote status="Fix">Fixed HTML email markup that could break rendering for run warning notifications.</ReleaseNote>
<ReleaseNote status="Fix">Profile create and view routes now live under `/dashboard/:accountId/projects/:projectId/profiles/...`, which may affect bookmarks and direct links.</ReleaseNote>
<ReleaseNote status="Fix">Removed hidden background commands from command history to reduce noise for users.</ReleaseNote>
<ReleaseNote status="Fix">Improved robustness of inline compile and show output attachment, including cases with tricky quoting and newlines.</ReleaseNote>
<ReleaseNote status="Fix">Fixed log download behavior so downloads correctly serve either the active `dbt.log` or the finalized compressed log.</ReleaseNote>
<ReleaseNote status="Fix">Fixed edge cases where gzipped artifacts could fail to upload due to upload stream handling.</ReleaseNote>
<ReleaseNote status="Fix">Reduced noisy disconnect and cleanup errors when multiple websocket connections and processes map to the same invocation.</ReleaseNote>
<ReleaseNote status="Fix">Fixed search result highlighting when the backend returns multiple highlights per field, with compact badges and counts for easier scanning.</ReleaseNote>
<ReleaseNote status="Fix">Improved environment-scoped Catalog search filtering by using merged environment identifiers.</ReleaseNote>
<ReleaseNote status="Fix">Improved behavior for environments with no public models by returning an empty list instead of falling into follow-on query logic.</ReleaseNote>
<ReleaseNote status="Fix">Improved keep-alive behavior so connections shut down cleanly when the client disconnects.</ReleaseNote>
<ReleaseNote status="Fix">Prevents failing tool calls by hiding Semantic Layer tools when the Semantic Layer is not available for the user or environment.</ReleaseNote>
<ReleaseNote status="Fix">Improved error reporting by walking wrapped exceptions to return the most specific status code and detail available.</ReleaseNote>
<ReleaseNote status="Fix">Treats empty tool outputs as valid results (for example, "no matches") to reduce unnecessary "tool call failed" errors.</ReleaseNote>
<ReleaseNote status="Behavior change">During connection setup, the default dbt version now only defaults to `latest-fusion` when the selected adapter is Fusion-compatible and the project and account are eligible.</ReleaseNote>
<ReleaseNote status="Behavior change">dbt version "allowed version" checks now account for `project_id` across jobs and environments, including API-triggered runs.</ReleaseNote>
<ReleaseNote status="Behavior change">Refresh token expiration for connected app OAuth flows increased from 8 hours to 7 days, reducing re-authorization frequency.</ReleaseNote>
<ReleaseNote status="Behavior change">File stat responses now return modified time and created time as integer milliseconds since epoch instead of float seconds.</ReleaseNote>
<ReleaseNote status="Behavior change">The LSP websocket now supports `defer_env_id` to defer against a specific environment and `no_defer=true` to explicitly disable deferral.</ReleaseNote>
<ReleaseNote status="Behavior change">When "defer to production" is turned off, the Studio IDE now passes `no_defer=true` to align editor intelligence with the selected deferral behavior.</ReleaseNote>
<ReleaseNote status="Behavior change">The freshness status value `outdated` was removed; unconfigured freshness is now handled explicitly as `unconfigured`.</ReleaseNote>
<ReleaseNote status="Behavior change">The rows-per-page selector was removed, and pagination now uses a fixed page size.</ReleaseNote>
<ReleaseNote status="Behavior change">Cached nodes are now consistently surfaced as Reused with clearer reasons, and stale outcomes are treated as errors.</ReleaseNote>
<ReleaseNote status="New">Advanced CI (dbt compare in orchestration) is now supported in the <Constant name="fusion_engine" />, refer to [Advanced CI](/docs/deploy/advanced-ci) for more information.</ReleaseNote>
<ReleaseNote status="Beta">The `dbt-salesforce` adapter available in the <Constant name="fusion_engine" /> CLI is now in beta, refer to [Salesforce Data 360 setup](/docs/fusion/connect-data-platform-fusion/salesforce-data-cloud-setup) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">The Analyst permission now has project-level access to read repositories, refer to [Project access for project permissions](/docs/platform/manage-access/enterprise-permissions#project-access-for-project-permissions) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">After a user accepts an email [invite](/docs/platform/manage-access/invite-users) to access an [SSO-protected](/docs/platform/manage-access/sso-overview) <Constant name="dbt_platform"/> account, the UI now prompts them to log in with SSO to complete the process.</ReleaseNote>
<ReleaseNote status="New">[Profiles](/docs/platform/about-profiles) let you define and manage connections, credentials, and attributes for deployment environments at the project level, with automatic creation for existing projects.</ReleaseNote>
<ReleaseNote status="New">[Python UDFs](/docs/build/udfs) are now supported and available in <Constant name="fusion_engine" /> when using Snowflake or BigQuery.</ReleaseNote>
<ReleaseNote status="Enhancement">Minor enhancements and UI updates to the <Constant name="studio_ide" /> file explorer that replicate the VS Code IDE experience.</ReleaseNote>
<ReleaseNote status="Enhancement">Profile creation now displays specific validation error messages instead of generic error text.</ReleaseNote>
<ReleaseNote status="Private beta">[Cost Insights](/docs/explore/cost-insights) shows estimated warehouse compute costs and run times for your dbt projects and models, refer to [Set up Cost Insights](/docs/explore/set-up-cost-insights) for more information.</ReleaseNote>
<ReleaseNote status="New">The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) now supports [Omni](https://docs.omni.co/integrations/dbt/semantic-layer) as a partner integration, refer to [Available integrations](/docs/platform-integrations/avail-sl-integrations) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">Clarified documentation for cumulative log size limits on run endpoints; when logs exceed the cumulative size limit, dbt omits them and displays a banner, refer to [Run visibility](/docs/deploy/run-visibility#log-size-limits) for more information.</ReleaseNote>
<ReleaseNote status="New">The `immutable_where` configuration is now supported for Snowflake dynamic tables, refer to [Snowflake configurations](/reference/resource-configs/snowflake-configs#immutable-where) for more information.</ReleaseNote>
<ReleaseNote status="Fix">The user invite details now show more information in invite status, giving admins visibility into users who accepted an invite to an SSO-protected account but haven't yet logged in via SSO.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved performance on Runs endpoint for Admin V2 API and run details in dbt platform when connecting with GCP.</ReleaseNote>

## January 2026

### January 28, 2026

<ReleaseNote status="New">Use `POST /v1/workspaces/{workspace_id}/upload-source` to create an upload, then `PATCH /v1/workspaces/{workspace_id}/upload-source/{file_id}/process` to stream processing progress (SSE).</ReleaseNote>
<ReleaseNote status="Enhancement">Ranking now boosts results by modeling layer, and highlighting is more consistent including support for multiple highlight snippets per field.</ReleaseNote>
<ReleaseNote status="Enhancement">The dbt platform now includes a Private Endpoint details view with endpoint properties, connectivity status, and associated projects.</ReleaseNote>
<ReleaseNote status="Enhancement">Connection setup and environment creation can now default to `latest-fusion` for eligible projects.</ReleaseNote>
<ReleaseNote status="Enhancement">Added a dedicated sidebar search experience.</ReleaseNote>
<ReleaseNote status="Enhancement">Upgrade flows can proceed from fixing deprecations into package upgrades in the same guided run.</ReleaseNote>
<ReleaseNote status="Enhancement">Fixed multiple layout/styling issues for a more consistent editor experience.</ReleaseNote>
<ReleaseNote status="Fix">Improved rendering and cleanup of escape sequences in step logs.</ReleaseNote>
<ReleaseNote status="Fix">Freshness status is preserved when a run lacks freshness results but freshness remains configured.</ReleaseNote>
<ReleaseNote status="Fix">Ingestion now tolerates missing/null `schema` fields in the manifest to avoid failures.</ReleaseNote>
<ReleaseNote status="Fix">Sync skips missing symlink targets instead of failing the whole sync.</ReleaseNote>
<ReleaseNote status="Fix">Aborting a command that no longer exists returns a specific "no-command-found" response.</ReleaseNote>
<ReleaseNote status="Fix">Malformed inline commands no longer break result processing; `show --inline` with an empty result returns an empty preview table.</ReleaseNote>
<ReleaseNote status="Fix">Creating an uploaded-source model with a duplicate name now returns HTTP 409 with an actionable message.</ReleaseNote>
<ReleaseNote status="Fix">Uploaded-source processing records failure state instead of deleting the file record, improving retry/resume workflows.</ReleaseNote>
<ReleaseNote status="Fix">The invocation status SSE endpoint now correctly awaits the status stream.</ReleaseNote>
<ReleaseNote status="Behavior change">`AccountSearchHit.highlight` and `AccountSearchHit.matchedField` are deprecated; `AccountSearchHit.highlights` now supports multiple highlight snippets per field (arrays).</ReleaseNote>
<ReleaseNote status="Behavior change">The "Adaptive" job type is deprecated and `last_checked_at` is no longer populated in run responses.</ReleaseNote>
<ReleaseNote status="Behavior change">Migrate to the new two-step [upload source](/docs/platform/use-canvas#upload-data-to-canvas) flow.</ReleaseNote>

### January 21, 2026

<ReleaseNote status="New">Add resources to favorites and organize your frequently accessed resources in the Catalog navigation.</ReleaseNote>
<ReleaseNote status="New">You can now retrieve individual PrivateLink endpoints by ID, enabling better automation and troubleshooting workflows.</ReleaseNote>
<ReleaseNote status="Enhancement">Find specific artifacts faster in run history with the new artifacts search box and improved empty states.</ReleaseNote>
<ReleaseNote status="Enhancement">The webhook form no longer resets while job options are loading, and server-generated fields now display reliably after creation.</ReleaseNote>
<ReleaseNote status="Enhancement">After completing the Fusion onboarding checklist, you can now dismiss the card and it will stay dismissed.</ReleaseNote>
<ReleaseNote status="Enhancement">Cross-project lineage is now enabled for all applicable accounts.</ReleaseNote>
<ReleaseNote status="Enhancement">Enhanced search scoring and matching provides more accurate results, with better column matching and highlighting for large catalogs.</ReleaseNote>
<ReleaseNote status="Enhancement">Column name and description updates now automatically trigger re-indexing, ensuring search results stay current.</ReleaseNote>
<ReleaseNote status="Enhancement">Quickly access full search results from the typeahead dropdown with the new footer link.</ReleaseNote>
<ReleaseNote status="Enhancement">The environment selector now only shows "Staging" when your account has projects with a staging environment configured.</ReleaseNote>
<ReleaseNote status="Enhancement">IDE-related endpoints now return more specific and helpful error messages for common configuration issues and timeouts.</ReleaseNote>
<ReleaseNote status="Enhancement">Enhanced command log viewer with improved download capabilities and more consistent error log viewing.</ReleaseNote>
<ReleaseNote status="Fix">dbt Copilot generated documentation now correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.</ReleaseNote>
<ReleaseNote status="Fix">Auto-generated exposures now appear correctly in lineage views.</ReleaseNote>
<ReleaseNote status="Fix">Search now handles missing connection names gracefully without causing errors.</ReleaseNote>
<ReleaseNote status="Fix">Requests with invalid authentication tokens now fail safely with clear error messages.</ReleaseNote>
<ReleaseNote status="Fix">Commands that can't be fetched are now properly marked as failed instead of staying in a "running" state.</ReleaseNote>
<ReleaseNote status="Fix">Job deferral settings are now validated to ensure the deferring job and environment exist within the same account.</ReleaseNote>
<ReleaseNote status="Behavior change">Tables in Account Insights now display 5 rows per page by default (previously 10).</ReleaseNote>
<ReleaseNote status="Behavior change">All webhook timestamp fields now use UTC with `Z` suffix and higher precision; missing/invalid timestamps emit `1970-01-01T00:00:00Z` instead of empty strings.</ReleaseNote>
<ReleaseNote status="Behavior change">Update webhook consumers that parse status values strictly.</ReleaseNote>
<ReleaseNote status="Behavior change">Projects with more than 5,000 exposures will skip exposure ingestion to prevent performance issues.</ReleaseNote>

### January 14, 2026

<ReleaseNote status="New">Added an API endpoint to determine whether a project is eligible for Fusion migration.</ReleaseNote>
<ReleaseNote status="Enhancement">Agent tool execution errors now return structured responses instead of failing the entire run.</ReleaseNote>
<ReleaseNote status="Enhancement">Agent toolsets include additional retrieval and search capabilities for more relevant responses.</ReleaseNote>
<ReleaseNote status="Enhancement">Azure OpenAI connection verification now uses GPT-5-compatible parameters for GPT-5 deployments.</ReleaseNote>
<ReleaseNote status="Enhancement">Added support for Azure Foundry URLs with automatic endpoint parsing to reduce setup friction.</ReleaseNote>
<ReleaseNote status="Enhancement">Build SQL queries against the Semantic Layer without writing SQL code.</ReleaseNote>
<ReleaseNote status="Enhancement">Search scoring prioritizes exact and multi-term matches more strongly, with better highlighting and column-description matching.</ReleaseNote>
<ReleaseNote status="Enhancement">Search labels are more consistent, and the embedded lineage view loads more responsively.</ReleaseNote>
<ReleaseNote status="Enhancement">Studio now loads a single unified IDE package.</ReleaseNote>
<ReleaseNote status="Enhancement">Studio now respects `dbt-cloud.defer-env-id` settings when Cloud CLI runtime is supported.</ReleaseNote>
<ReleaseNote status="Enhancement">Download and copy behavior for command logs is more consistent, including debug logs.</ReleaseNote>
<ReleaseNote status="Enhancement">The IDE now supports multiple explicit edits in one request with safer validation.</ReleaseNote>
<ReleaseNote status="Enhancement">Session creation returns clearer error messages and guidance for setup issues.</ReleaseNote>
<ReleaseNote status="Enhancement">Settings detail experiences now use an improved drawer-based UI.</ReleaseNote>
<ReleaseNote status="Enhancement">Profile creation now handles dependencies and failures more gracefully.</ReleaseNote>
<ReleaseNote status="Enhancement">Logs for in-progress runs are also limited by memory usage, in addition to the existing 1,000-line limit.</ReleaseNote>
<ReleaseNote status="Fix">The Profiles API now allows unsetting extended attributes by setting `extended_attributes_id` to null.</ReleaseNote>
<ReleaseNote status="Fix">Recently viewed entries now update atomically and retain the 5 most recent items.</ReleaseNote>
<ReleaseNote status="Fix">Debug logs for completed runs now consistently fetch only the tail of the log.</ReleaseNote>
<ReleaseNote status="Fix">CLI flags to disable caching are now positioned correctly to avoid parsing issues.</ReleaseNote>
<ReleaseNote status="Fix">Fixed argument ordering so `--no-defer` is interpreted consistently.</ReleaseNote>
<ReleaseNote status="Behavior change">dbt v1.7 is now labeled as end-of-life in version lifecycle messaging.</ReleaseNote>

### January 7, 2026

No changes of note this week.

<ReleaseNote status="Enhancement">The `defer-env-id` setting for choosing which deployment environment to defer to is [now available](/docs/platform/about-cloud-develop-defer#defer-environment) in the <Constant name="studio_ide" />.</ReleaseNote>
<ReleaseNote status="Beta">The [Analyst agent](/docs/explore/navigate-dbt-insights#dbt-copilot) in dbt <Constant name="insights" /> is now in beta.</ReleaseNote>
<ReleaseNote status="Enhancement">The [Studio IDE](/docs/platform/studio-ide/ide-user-interface#search-your-project) now includes search and replace functionality and a command palette for quickly finding and replacing text, navigating files, and running IDE configuration commands.</ReleaseNote>
<ReleaseNote status="Enhancement">[State-aware orchestration](/docs/deploy/state-aware-about) now rebuilds models that fail a data test on subsequent runs and detects tables deleted from the warehouse, refer to [Handling deleted tables](/docs/deploy/state-aware-about#handling-deleted-tables) for more information.</ReleaseNote>
<ReleaseNote status="Enhancement">[dbt <Constant name="copilot" />](/docs/platform/dbt-copilot) correctly detects column names across various `schema.yml` files, adds only missing descriptions, and preserves existing ones.</ReleaseNote>
<ReleaseNote status="Enhancement">The <Constant name="fusion"/> CLI now automatically reads environment variables from a `.env` file in your current working directory, refer to [Install <Constant name="fusion"/> CLI](/docs/local/install-dbt?version=2#get-started#environment-variables) for more information.</ReleaseNote>
<ReleaseNote status="New">The new <Constant name="semantic_layer"/> YAML specification creates an open standard for defining metrics and dimensions, with semantic models now embedded within model YAML entries, refer to [Migrate to the latest YAML spec](/docs/build/latest-metrics-spec) for more information.</ReleaseNote>
<ReleaseNote status="Fix">Debug logs in the Run summary tab are now properly truncated to improve performance, refer to [Run visibility](/docs/deploy/run-visibility#run-summary-tab) for more information.</ReleaseNote>
<ReleaseNote status="New">The [Semantic Layer querying](/docs/explore/navigate-dbt-insights#semantic-layer-querying) within dbt <Constant name="insights" /> is now generally available (GA).</ReleaseNote>
<ReleaseNote status="Enhancement">Eligible <Constant name="dbt_platform" /> accounts in the <Constant name="fusion" /> private preview can now use [Exposures](/docs/platform-integrations/downstream-exposures).</ReleaseNote>

## December 2025

### December 24, 2025

<ReleaseNote status="New">Analysts can now drop `@path` references in the bundled CLI to stream local files into `/private/v1/agents/run` as auto-rendered text for copilots.</ReleaseNote>
<ReleaseNote status="New">Copilot replies now carry inline "Did that answer your question?" buttons for rating answers without leaving Slack.</ReleaseNote>
<ReleaseNote status="New">A Databricks history provider and DBU-based cost query now surface daily model cost alongside Snowflake coverage for unified FinOps reporting.</ReleaseNote>
<ReleaseNote status="New">The CSV upload endpoint is now generally available.</ReleaseNote>
<ReleaseNote status="Enhancement">Attachment workflows now only recommend meaningfully related models.</ReleaseNote>
<ReleaseNote status="Enhancement">Settings consolidate SSO + SCIM, add an empty state for auto-generated slugs, and render read-only login URLs.</ReleaseNote>
<ReleaseNote status="Enhancement">Token tables gain fixed pagination, inline search, consistent iconography, and clearer deletion warnings.</ReleaseNote>
<ReleaseNote status="Enhancement">The v3 API/UI now allow up to 20 scoped environment variables before enforcing limits.</ReleaseNote>
<ReleaseNote status="Enhancement">SELECT * RENAME/EXCEPT support now respects each warehouse's syntax using schema metadata, keeping SQL previews and column metadata accurate across Snowflake, Databricks, BigQuery, and Redshift.</ReleaseNote>
<ReleaseNote status="Fix">Default values are cached after the first render and stop resetting once the user edits the form, eliminating accidental job-list clearing while tabbing through fields.</ReleaseNote>
<ReleaseNote status="Fix">`parentsModels` and `parentsSources` now derive from the manifest's `parents` list, so exposures with mixed upstreams display complete lineage in both the GraphQL API and UI.</ReleaseNote>
<ReleaseNote status="Behavior change">All cost management pages and hooks were removed, and platform metadata credentials now only expose catalog ingestion and Cost Insights toggles.</ReleaseNote>

### December 17, 2025

<ReleaseNote status="New">A new `/accounts/<id>/feature-licenses` endpoint issues short-lived JWTs that encode entitled features, with service/PAT authentication now checking for an active license before Fusion-enabled workflow runs.</ReleaseNote>
<ReleaseNote status="New">Databricks warehouses can register platform metadata credentials (token plus optional catalog) enabling catalog ingestion, metadata sharing, and Cost Insights pipelines.</ReleaseNote>
<ReleaseNote status="Enhancement">Settings Projects and Credentials now paginate after 25 rows with search boxes and skeleton states, keeping navigation responsive for large deployments.</ReleaseNote>
<ReleaseNote status="Enhancement">Model panels now show materialization type, lineage renders metadata strips only when content exists, and upstream public-model columns load automatically.</ReleaseNote>
<ReleaseNote status="Enhancement">Source tiles respect the `meta5161ExpiredUnconfiguredSources` flag and "Open in IDE" links now point directly into dbt Studio.</ReleaseNote>
<ReleaseNote status="Enhancement">The Copilot listener now hydrates builder tabs only when a semantic-layer payload arrives, preventing plain-SQL replies from overwriting editor state.</ReleaseNote>
<ReleaseNote status="Enhancement">File sync now anchors itself to the invocation directory for more predictable monorepo behavior, with nested `dependencies.yml` files correctly triggering dependency installs.</ReleaseNote>
<ReleaseNote status="Enhancement">Outbound calls now persist the exact JSON body in webhook history, making allowlisting and troubleshooting easier.</ReleaseNote>
<ReleaseNote status="Enhancement">The file tree now mirrors Cloud VCS statuses (including conflicts) and automatically invalidates caches after `dbt deps`/`dbt clean`.</ReleaseNote>
<ReleaseNote status="Enhancement">Command and interactive query logs adopt the new accordion-based viewer, and Autofix sessions in Fusion treat plain `parse` commands as the trigger for deprecation summaries.</ReleaseNote>
<ReleaseNote status="Fix">Editing one variable no longer backfills blank cells with previously edited values.</ReleaseNote>
<ReleaseNote status="Fix">Job pages once again display "Cost optimization features" whenever Fusion actually runs and gating conditions are met.</ReleaseNote>
<ReleaseNote status="Behavior change">Service/PAT calls without an active license now fail authentication, and SSO providers enforce auto-generated slugs.</ReleaseNote>
<ReleaseNote status="Behavior change">Every invocation lookup validates the caller's user ID, preventing admins from accidentally reading another developer's runs.</ReleaseNote>
<ReleaseNote status="Behavior change">Support impersonation sessions now restrict execution of `show`, `run`, `build`, and `test` commands, and artifacts generated by `dbt show` expire after 15 minutes.</ReleaseNote>
<ReleaseNote status="Behavior change">Fusion tracks now treat `dbt compare` as a supported command.</ReleaseNote>

### December 10, 2025

<ReleaseNote status="Enhancement">Streaming middleware enforces request-scoped instrumentation across every AI endpoint, offloads warehouse calls via threads, and exposes human-readable tool names.</ReleaseNote>
<ReleaseNote status="Enhancement">Environment profile drawers link directly to connection settings and treat Snowflake fields as optional, while Compare Changes and run-step drawers now explain whether steps failed or were skipped.</ReleaseNote>
<ReleaseNote status="Enhancement">Slack Copilot mentions are now more reliable, with hardened workers, support for CSV attachments, and improved logging.</ReleaseNote>
<ReleaseNote status="Enhancement">Environment APIs accept `secondary_profile_ids`, run acquisition favors profile-backed credentials, and whoami/auth metrics are scrubbed so cross-platform profiles stay in sync.</ReleaseNote>
<ReleaseNote status="Enhancement">Improved stability and performance for large projects.</ReleaseNote>
<ReleaseNote status="Enhancement">For dbt Fusion logging, node start and end times now properly display in command output.</ReleaseNote>
<ReleaseNote status="Enhancement">Copilot Chat automatically appears anywhere AI entitlements exist, preview runs auto-cancel when nodes change, and keyboard shortcuts respect native keymaps.</ReleaseNote>
<ReleaseNote status="Enhancement">Tab view, console pane, and command drawer have been redesigned to enhance efficiency and multitasking.</ReleaseNote>
<ReleaseNote status="Fix">Branch creation now returns explicit feedback for bad branch names/SHAs and detects unauthorized Git errors earlier.</ReleaseNote>

### December 3, 2025

<ReleaseNote status="New">When deprecations are detected, you now see "Autofix deprecation warnings."</ReleaseNote>
<ReleaseNote status="New">After running Autofix, you see a results panel with upgraded packages (with links), packages left unchanged and why, and quick access to `packages.yml`.</ReleaseNote>
<ReleaseNote status="Enhancement">Clearer lint/format actions (SQLFluff, Prettier), better empty states, visible Config button when applicable, and simplified logs retrieval for SQL, JSON, YAML, and Markdown workflows.</ReleaseNote>
<ReleaseNote status="Enhancement">Upgraded editor for stability with improved container sizing/overflow and minor action-bar refinements.</ReleaseNote>
<ReleaseNote status="Fix">Reliability improved by aligning with updated IDE and VS Code command APIs, eliminating intermittent skips.</ReleaseNote>
<ReleaseNote status="Behavior change">dbt Core "versionless" renamed to "latest" for consistency across tenants.</ReleaseNote>
