---
title: "dbt Cloud - Changelog"
id: "cloud-changelog"
sidebar_label: Changelog
description: "Changelog for the dbt Cloud application"
---
## dbt Cloud v1.1.25 (April 28, 2021)

Exciting things coming down the pipe - ongoing enhancements to the command bar experience in the IDE, doing some work to ensure that more git providers are presented with a first class experience in Cloud, as well as assorted bug fixes - "I must have bug fixes, always and always" - that was Monet I think  

#### Enhancements

- Made a grip of visual updates to the new command bar work
- Moved to using the active model name instead of a placeholder in command bar work
- Added user ability to delete connections, remove association from a given project.
- Added verification of dbt version for command bar beta feature flag

#### Fixed

- Removed testing prop that keeps drawer open
- Added double encoding to handle Snowflake roles with spaces
- Fixed account switching in user notifications
- Handled invalid Azure SSO group responses
- Fixed error which only showed common actions when run drawer was closed
- Allowed unencrypted adapter fields to be edited
- Fixed bugs with file and folder renaming, alongside associated tab state

#### Internal

- Saved theoretical run start time to database to calculate run start delay.
- Processed GitLab webhooks on close events
- Refactored getting dequeued and running runs with cache
- Updated GitLab webhooks UI :fishing_pole_and_fish:
- Added auth to GitProvider endpoint, support Service Tokens too :the_horns:
- Used manifest.json client-side to identify model of focused editor
- Provisioned scribe as a headless service by default
- Added connection testing for Spark connections
- Added GitProviderView and register GitLab webhooks

## dbt Cloud v1.1.24 (April 14, 2021)

Phew! As our company grows, so too does our changelog! Look at all these! The big chunks you'll see here are related to some ongoing in-IDE work, focused on the command bar experience, as well as some partner & connection work (see the Gits, Databricks, and so forth), and of course ongoing longer-term bets around metadata! 

#### Enhancements

- Added onFocus and onBlur properties to populate and remove "dbt" in command bar
- Enabled executing command on enter if user's cursor is in the command bar
- Added Metadata API access button to account settings
- Added feature flag for displaying only recent actions
- Added dbt 0.19.1
- Added regex validation to Databrick's hostname web-form field
- Updated Connection Edit to allow adapter editing
- Enabled self-service Github and GitLab integration disconnection
- Added link to docs for license map & handle duplicate error gracefully
- Moved deferred job execution to execution settings.
- Recorded user command history
- Enabled new file creation flow

#### Fixed

- Added styling class to popup to ensure text is readable
- Fixed sourcemaps syntax for dev commands
- Added timeout and retry to dbt deps
- Updated databricks schema field type and add error handling to ConnectionSetup
- Fixed Bigquery private keys & convert text to textarea
- Fixed last used datetime in the service token UI
- Added missing token URI to Bigquery connection edit
- Prevent multiple develop sessions for one user
- Fixed SchemaForm validating non-displayed fields
- Fixed required fields for Bigquery connection JSON uploads
- Fixed self selection as deferred job
- Always create a Monaco model on tab open if no matching model exists
- Fixed tab dirty indicator on open tab
- Fixed password reset flow
- Fixed docs and sources links in dashboard page for read only users
- Fixed truncating first_name to 30 characters

#### Internal

- Bumped schema version of command drawer dismiss event to 1-0-1
- Attempted to prevent test-frontend from running out of memory
- Added successful sign in metric
- Defined RPC readiness probe
- Removed should_handle method from ScrubbingStreamHandler
- Added metadata read permission to account admin service token
- Fixed develop request timing monitoring, push data to Datadog
- Updated ide_command_drawer_dismiss event to schema version 1-0-0
- Tracked snowplow event when command drawer menu is dismissed
- Added metadata.cloud.getdbt.com to allowed hosts
- Tracked Snowplow event when items are selected from the command drawer
- Added Datadog Real User Monitoring to dbt-cloud
- Improved command drawer interactions
- Replaced legacy user feature flag admin with new
- Created basic command drawer experience with stubbed data

## dbt Cloud v1.1.23 (March 31, 2021)

Some backend work, some frontend work, some bug fixes: a nice mix for this release. A few user facing changes you may have noticed already are the persistence of dark/light mode settings across refresh (no more blinding IDE!), branches in the IDE being categorized by Active vs. Removed from Remote, and a tidier new file creation flow, with the file tree expanding to show the new file and opening a new tab to populate the said file! 

#### Enhancements

- Splitting Local-only and Remote branches into different sections of the dropdown selector
- Update Profile Integrations to include SSO info
- Upgrade to Tailwind 2.0 and FUI 0.0.5
- Allow users to create metadata tokens from the UI
- Support manually-managed group memberships
- SSO: resolve bug w/ first & last names acting up 
- Integrate Delighted for NPS surveys
- Add dbt 0.19.1rc1 to Cloud 
- Add an account-level setting to require users to re-authenticate via SSO
- Read-only metadata ServiceToken for Cloud 
- Persist IDE light mode / dark mode across refresh
- Categorize & order git branches
- Improve new file creation flow

#### Fixed

- Check for an empty repository before checking matching remote
- Increase wait if run was finished recently
- Support default branches through git when a custom branch is not specified
- Don't download logs for skipped steps
- API Gateway is no longer flooded with errors due to IDE blindly polling dead Develop pod
- Fix user license creation via admin interface
- Adjusted addition of global .gitignore

#### Internal

- Filter our ResourceWarning error from Datadog
- add log filter to wsgi.py
- Remove Rollbar from codebase
- Add UI Logs to Datadog
- Lower develop session timeout from 6 hours to 3 hours
- Upgrade to Webpack 5 and bundle Angularjs

## dbt Cloud v1.1.22 (March 17, 2021)

Rolling out a few long-term bets to ensure that our beloved dbt Cloud does not fall over for want of memory, as well as a grip of bug fixes and error messaging improvements (error messages should be helpful, not scolding or baffling, after all!)

#### Enhancements

- Release Scribe to 100% of multi-tenant accounts
- Update language for SQL drawer empty state
- Reduce Scribe memory usage

#### Fixed

- Fix NoSuchKey error
- Guarantee unique notification settings per account, user, and type
- Fix for account notification settings
- Dont show deleted projects on notifications page
- Fix unicode error while decoding last_chunk
- Show more relevant errors to customers
- Groups are now editable by non-sudo requests
- Normalize domain names across inputs/outputs
- Redirect auth failed errors back to appropriate page with error description

#### Internal

- Reducing Scribe memory request in production
- Don't clobber run logs across all dev environments
- Refactor license_type

## dbt Cloud v1.1.21 (March 3, 2021)

This changelog wraps up work on what we've been calling the SQL Drawer in the IDE - some design nudges, some interface adjustments, overall a cleaner and snappier experience. If you haven't dipped into the IDE in a while it's worth taking a look! Some back-end work as well, making SSO and role based admin easier and more broadly available for Enterprise level folks, along with your usual assortment of bug squashes and iterations. 


#### Enhancements

- Styling and copy adjustments in the Cloud IDE
- Open self-service role based access control to all Enterprise customers
- Update AuthProvider UI to enable SAML and Okta
- Add a SAML auth redirect URL

#### Fixed

- Add param to admin project mapper to included soft deleted projects
- Fix delaying logs when we are waiting for a model to finish executing
- Saving GSuite auth provider form triggers an authorize
- Scribe populates truncated debug logs when runs are executing
- Delay attempts for non-200 status codes
- Add logic to support select fields in adapter UI
- Undo clobbering groups

#### Internal

- Fix latest.sh script
- Remove scribe image version check
- Allow opt-in APM
- Allow updating user license from backend page
- Update production build workflow
- Filter only for log_archive_type of database

## dbt Cloud v1.1.20 (February 17, 2021)

Continued stability and quality of life improvements for folks with multiple accounts and projects - no longer will you have to remember the chronological order of birth of your accounts and projects, as they'll be ordered by the much easier to parse (for human brains anyway) alphabetical order. We're also shipping some experience improvements in the SQL Drawer at the bottom half of the IDE. 

#### Enhancements

- Deleted Info and Logs IDE Tabs, logs will now be displayed in Results Tab
- Removed service token feature flag
- List Jobs dropdown in alphabetical order
- List Account and Project dropdowns in alphabetica order
- Pre-join Job Definition results to speed up scheduler
- Combine scheduler queries to speedup runtime by about 30%

#### Fixed

- Fix issue with source freshness for 0.19.0

#### Internal

- Fix simultaneous builds
- Add copy_from argument to feature flag commands and refactor sampling into service
- Admin panel updates
- Ignore if cloud log is not available
- Add scribe enabled filter and some more summary cleanup
- Fix extra_data clobbering auth_provider_groups
- Fix account page in backend
- RPC -> API in the shell command link
- Improve job definition page performance in backend
- Speed up project admin
- Add management commands for percentage based feature flag operations
- Logging empty user groups in SSO
- Remove test prefix
- Tag develop resources with better labels in k8s
- Verification script without downloading logs in from_dbobj and having no such key stats
- Updates to verification script
- Add ddtrace to SchedulerCommand
- Freshness fix
- Only use scribe logs when feature flag is currently turned on for account

## dbt Cloud v1.1.19 (February 3, 2021)

The latest release of dbt (Oh Nineteen Oh) is now available for your enjoyment on dbt Cloud! We're also releasing some service token pieces here, though they're not quite ready for wide release yet. Moving forward, Oh Nineteen Oh will probably end up being the minimum version required to run the Metadata API & Metadata Toolkit, so, this is a big release! 

#### Enhancements

- Added dbt 0.19.0 :heart_eyes_cat:
- Allowed account-wide service tokens to create connections
- Added integration for service token UI and API
- Authorized requests that supply a service token

#### Fixed

- Added logic to show the entered service token name prior to the request completing
- Fixed endlessly running rpc queries with non-working cancel button on IDE refresh

#### Internal

- Added filters to Scribe verification script
- Set dd_agent_host host for run and develop pods.
- Adjusted dbt version constraint to use Metadata API
- Generated service tokens
- Added API endpoints for service tokens

## dbt Cloud v1.1.18 (January 20, 2021)

Most notable things here are around foundational work toward future feature releases, as well as strong assurances of future stability for dbt Cloud, and ensuring future sales tax compliance (which we understand turns out to be quite important!) - turns out to be a quite future-looking release!

#### Enhancements

- Add service tokens UI (stubbed) behind a feature flag
- Fixing and Upgrading social-auth
- Add dbt Spark 0.19.0rc1
- Adds the reconciliation of persisted file content and tab state when navigating into the IDE
- Adds the reconciliation of persisted file content and tab state between IDE sessions
- Read logs from scribe and stop logging to db
- Upgrade social auth 3.3.3
- Add warning logs for social auth failures
- Add dbt 0.19.0rc1

#### Fixed

- Prevent social-auth from updating first or last name
- Page through Stripe results when listing subscriptions
- Prevent enqueueing runs in deleted projects
- Fix IDE git actions causing open tab contents to be lost on IDE re-entry
- Add DBT_CLOUD_CONTEXT environment variable
- Add logic to hide IP whitelist message for on-prem customers
- fix 0.19.0rc1 run image dependencies

#### Internal

- Remove Mailchimp integration
- Use the generic get_handle method in the run service
- Clean up scribe services when finished jobs are cleaned up
- Downgrade social auth
- Adds an (albeit) scrappy django command to verify the content of scribe logs vs cloud
- Adjust existing customer taxation backfill method

## dbt Cloud v1.1.17 (January 7, 2021)

Tidying up this and that as we settle into 2021. No new user-facing functionality. Hope everyone had a safe and cozy New Year!

#### Internal

- Fix Stripe event syncer
- Take down the wreath
- Sweep up the confetti
- Backfill all Avalara metadata
- Bump psycopg2
- Fix Circle jobs
- Fix duplicated Circle jobs
- Migrate to Python 3.8
- Check the Scribe image version before each scheduler loop

## dbt Cloud v1.1.16 (December 23, 2020)

This release adds preview support for Databricks Spark in dbt Cloud
and adds two new permission sets for Enterprise acccounts.

#### Enhancements

- Added preview support for Databricks Spark support
- Added two new Enterprise permission sets: Account Viewer and Project Creator

#### Fixed

- Improve logging infrastructure for dbt run logs
- Fix for SSH tunnel logging errors

## dbt Cloud v1.1.15 (December 10, 2020)

Lots of great stuff to confer about this go-round: things really coalesced this week! Lots of excitement around adding Spark to the connection family, as well as knocking out some longstanding bugs. 

#### Enhancements

- Add Spark as an option for database setup

#### Fixed

- Fix this one hairy bug where one email could have multiple user accounts
- Fix setup-connection react-page routing
- Break out group selection logic from license types and group names
- Handle json errors in v1/v2 body parsing
- Handle AuthForbidden and AuthCancelled graciously - ie, not throw 500s
- Fix regression with IDE loading spinner

#### Internal

- Adding drf-spectacular
- Hubspot signup integration
- Add additional SSH logging
- Add Datadog traces to IDE filesystem interactions

## dbt Cloud v1.1.14 (November 25, 2020)

This release adds a few new pieces of connective tissue, notably OAuth for BigQuery and SparkAdapter work. There are also some quality of life improvements and investments for the future, focused on our beloved IDE users, and some improved piping for observability into log management and API usage. 

#### Enhancements

- Update IP allowlist
- User can OAuth for BigQuery in profile credentials
- Adding SparkAdapter backend models, mappers and services
- Added BigQuery OAuth integration
- Adding db index for owner_thread_id

#### Fixed

- Fix post /run error rate
- Fix bug where bad argument was passed to dbt runs
- Log out unhandled error in environment variable context manager
- Remove account settings permissions for user integrations

#### Internal

- Fix some cases of missing params
- Add a Datadog metric to count the number of log bytes written to the database
- Add feature flag for IDE work/code retention
- Logging API usage
- Add scribe to run pods

## dbt Cloud v1.1.13 (November 12, 2020)

This release adds support for triggering runs with overriden attributes via the
[triggerRun](https://docs.getdbt.com/dbt-cloud/api/#operation/triggerRun) API endpoint. Additionally,
a number of bugs have been squashed and performance improvements have been made.

#### Enhancements

- Improve error handling for long-running queries in the IDE
- Use S3 client caching to improve log download speed for scheduled runs
- Support triggering jobs [with overriden attributes from the API](https://docs.getdbt.com/dbt-cloud/api/#operation/triggerRun)
- Clarify "upgrade" copy on the billing page

#### Fixed

- GitLab groups endpoint now returns all groups and subgroups
- Support BigQuery retry configs with value 0
- Prevent web IDE from crashing after running an invalid dbt command
- Apply additional log scrubbing to filter short-lived git credentials
- Fix older migration to make auth_url field nullable
- Support paths in GitLab instance URL
- Fix for auth token request url in GitLab oauth flow

## dbt Cloud v1.1.12 (October 30, 2020)

This release adds dbt v.18.1 and 0.19.0b1 to dbt Cloud. Additionally, a number of bugs have been fixed.

#### Enhancements

- Update copy on billing page for picking a plan at the end of a trial
- Improved authorization for metadata API
- Add dbt 0.19.0b1
- Add dbt 0.18.1

#### Fixed

- Fixed an issue where groups from other logged-in accounts appeared in the RBAC UI
- Fixed requested GitLab scopes and an issue when encrypting deploy tokens for GitLab auth
- Fixed an issue where null characters in logs threw errors in scheduled runs


## dbt Cloud v1.1.11 (October 15, 2020)

Release v1.1.11 includes some quality-of-life enhancements, copy tweaks, and error resolutions. It also marks the last time we'll have the same digit four times in a row in a release until v2.2.22.

#### Enhancements

- Add InterfaceError exception handling for commands
- Rename My Account --> Profile
- Add project and connection to admin backend

#### Fixed

- Resolve errors from presence of null-characters in logs
- Email verifications backend
- Undo run.serialize
- Fix error while serialized run
- Fix logic error in connection setup
- Fix a bug with GitLab auth flow for unauthenticated users
- Fix bug where Native Okta SSO uses the wrong port

#### Internal

- Codex Exposure Tile Snippet Generation
- Remove embedded database storage class preflight check for on-premises
- Autogenerate Django secret key and remove from from config for on-premises

## dbt Cloud v1.1.10 (October 8, 2020)

This release adds support for repositories imported via GitLab (Enterprise)
and contains a number of bugfixes and improvements in the dbt Cloud IDE.

#### Enhancements

- Add Gitlab integration (Enterprise)
- Add GitLab repository setup to project setup flow (Enterprise)
- Add GitLab automated Deploy Token installation (Enterprise)
- Add dbt 0.18.1rc1

#### Fixed

- Fix bug where IDE gets stuck after changing project repository
- Fix race condition where connections can be added to the wrong project
- Fix revoking email invites
- Fix a bug in slim CI deferring run search where missing previous run caused the scheduler to raise an error
- Fix a source of IDE instability
- Gracefully clean up IDE backend on shutdown
- Always show SSO mappings on Group Details page

## dbt Cloud v1.1.9 (October 1, 2020)

This release adds the ability for admins on the Enterprise plan to configure
the Role Based Access Control permissions applied to Projects in their account.
Additionally, job execution deferral is now available behind a feature flag,
and a number of fixes and improvements were released as well.

#### Enhancements

- Add dbt Cloud version in the navigation sidebar
- Add RBAC Group Permission view, create, and modify UIs
- Add personal git auth for IDE error handling modals
- Add Develop Requests to backend views
- Implemented job execution deferral
- Add support for dbt v0.18.1b2

#### Fixed

- Fixed the scenario where interacting with the Refresh IDE button causes an index.lock file to remain in the IDE file system
- Validate PR URL for XSS attempts
- Address RBAC inconsistencies
- Fixed users not being able to update their dbt Cloud password in-app
- Fix for applying user permissions across multiple accounts after SSO auth
- Google API: default to common api endpoint but allow override
- Fix for missing email variable in GSuite debug logging
- Destroy IDE session when switching projects

#### Internal

- Use FQDN for routing internal develop requests
- S3: upping the retry limit

## dbt Cloud v1.1.8 (September 17, 2020)

This release adds native support for Okta SSO and dbt v0.18.0. It also adds
initial support for a GitLab integration and self-service RBAC configuration.

#### Enhancements
- Add dbt 0.18.0
- Add native Okta SSO support
- Add additional logging for Gsuite and Azure SSO
- Add git cloning support via GitLab deploy tokens for scheduled runs (coming soon)
- add RBAC Groups Detail Page and Groups List UIs

#### Fixed

- Allow `*_proxy` env vars in scheduled runs

#### Internal

- Update freeze.0.18.0.txt
- filter out pickle files
- error log consolidation, enable apm trace ids in logs
- add created_at range filter to RunService

## dbt Cloud v1.1.7 [September 3, 2020]

This release adds a Release Candidate for [dbt
v0.18.0](migration-guide/upgrading-to-0-18-0) and
includes bugfixes and improvements to the Cloud IDE
and job scheduler.

#### Enhancements
- Improve scheduler backoff behavior
- Add dbt 0.18.0rc1
- Add support for non-standard ssh ports in connection tunnels
- Add support for closing the IDE filesystem context menu by clicking outside the menu

#### Fixed
- Fix for joining threads in run triggers
- Fix thread caching for s3 uploads

#### Internal
- Disable thread session cache
- Adds ddtrace
- Enable botocore logging for credentials matching
- Increase protection against SSRF

## dbt Cloud v1.1.6 (August 20, 2020)

This release includes security enhancements and improvements across the entire
dbt Cloud application.

#### Enhancements
- Support for viewing development docs inside of the IDE ([docs](viewing-docs-in-the-ide))
- Change CI temporary schema names to be prefixed with `dbt_cloud` instead of `sinter`
- Change coloring and iconography to improve accessibility and UX across the application
- [Enterprise] Support the specification of multiple authorized domains in SSO configuration
- [On-premises] Upgrade boto3 to support KIAM authentication

#### Fixed
- [Enterprise] Fix for missing IdP group membership mappings when users belong to >100 Azure AD groups
- Disallow the creation of symlinks in the IDE
- [Internal] Improve reliability of background cleanup processes
- [Internal] Improve performance and reliability of artifact management and PR webhook processing

## dbt Cloud v1.1.5 (August 4, 2020)

This release adds a major new feature to the IDE: merge conflict resolution!

It also includes changes to the job scheduler that cut the time and resource utilization
significantly.

#### Enhancements

- Add dbt 0.17.2
- Add dbt 0.18.0 beta 2
- Add merge conflict resolution, a merge commit workflow, and merge abort workflow to the IDE
- Deprecate dbt versions prior to 0.13.0
- Refactor to cut job scheduler loop time
- Reduce extra database calls to account table in job scheduler loop
- [On-premises] Allow clients to disable authentication for SMTP
- [On-premises] Allow disabling of TLS for SMTP
- [On-premises] Making k8s access mode for IDE pods an environment variable
- [Security] Force session cookie to be secure
- [Internal] Make api and admin modules flake8 complaint

#### Fixed

- Fix incorrect usage of `region_name` in KMS client
- Fix a call to a deprecated Github API
- Remove extraneous billing API calls during job scheduler loop
- Fix error where refreshing the IDE would leave running dbt processes in a bad state

#### Internal

- Add logging around malformed task tags for IDE queries
- Preserve artifacts for each run step
- Add status message to run info in backend
- Add extra debug logs to dbt run

## dbt Cloud v1.1.4 (July 21, 2020)

This release dramatically speeds up the job scheduler. It adds a new
stable dbt version (0.17.1) and a new prerelease (0.17.2b1), and it
includes a number of bugfixes.

#### Enhancements

- Add dbt 0.17.2b1
- Add dbt 0.17.1 and set as default version
- Speed up job scheduler by 50%
- Added generate docs to rpc service and new view docs route
- Queue limiting by account for scheduled jobs

#### Fixed

- Fix enterprise SSO configuration when old Auth0 Azure AD is configured
- Do not schedule jobs for deleted job definitions or environments
- Fix permissions issues
- Fix a bug with metadata set in azure storage provider
- Fixed error when switching to developer plan from trial
- Fix authentication bug where we setup all accounts with same domain
- \[Security\] Disallow partial_parse.pickle files in repositories
- \[Security\] Add security check to prevent potentially malicious html files in dbt docs

#### Internal

- Log api v1/ calls to Datadog
- Add a scheduler loop time metric to Datadog
- Add a time to run metric to the scheduler
- Using type property along with feature flag to display verify tab
- Fix waffle profiler to update on db switch changes

## dbt Cloud v1.1.3 (July 7, 2020)

This release contains a number of IDE features and bugfixes, a new release candidate of dbt, and a brand new Enterprise Single-Sign On method: Azure Active Directory!

#### Enhancements

- Add dbt 0.17.1rc3
- Snowflake: Add support for `client_session_keep_alive` config
- Enterprise: Native Azure Oauth2 for Enterprise accounts
- IDE: Add custom command palette for finding files

#### Fixed

- Do not run CI builds for draft PRs in GitHub
- Remove race condition when syncing account with stripe billing events
- Enterprise: Fixed JIT provisioning bug impacting accounts with shared IdP domains
- IDE: Fix a regression with Github git clone method
- IDE: Fix a race condition where git clone didn't complete before user entered IDE
- IDE: Fix bug with checking out an environment custom branch on IDE refresh
- Bigquery: Fix PR schema dropping

#### Internal

- Add flake8 to CI
- Add profiler and enable configuration to any python method
- Add analytics event handling middleware for snowplow
- Move IDE startup modals from Angular to modern codebase
- Log user impersonation events for SOC2 compliance

## dbt Cloud v1.1.2 (June 23, 2020)

This branch includes an important security fix, two new versions of dbt, and some miscellaneous fixes.

#### Enhancements

- Add project names to the account settings notifications section
- Add dbt 0.17.1 release candidate
- Update development dbt version to Marian Anderson
- Add remember me to login page and expire user sessions at browser close
- Adding Auth Provider and enabling Gsuite SSO for enterprise customers

#### Fixed

- \[Security\] Fix intra-account API key leakage
- Support queries containing unicode characters in the IDE

#### Internal

- Remove all usage of outdated `environments_develop` permission
- Add profiling utility
- Replace cloudwatch client with datadog client
- Cleanup git service GitBranch code

## dbt Cloud v1.1.1 (June 9, 2020)

This release includes dbt 0.17.0 and a number of IDE quality of life improvements.

#### Enhancements

- Added dbt 0.17.0
- Added the ability to create a new folder in the IDE
- Added gitignore status to file system and display dbt artifacts, including directories dbt_modules, logs and target
- (Cloud only) Added rollbar and update some various error handling clean up
- (On-premises only) Admin site: allow Repository's Pull Request Template field to be blank
- (On-premises only) Added AWS KMS support

#### Fixed

- Expires old pending password reset codes when a new password reset is requested

#### Internal

- Clean up git service GitBranch code
- Upgrade node dependencies to support ECMAScript 2020 features

## dbt Cloud v1.1.0 (June 2, 2020)

This release adds some new admin backend functionality, as well as automatic seat usage reporting.

### On-Premises Only

#### Added

- Added automatic reporting of seat usage.

#### Changed

- Admins can now edit remote URLs for repository in the admin backend.
- Admins can now edit credentials in the admin backend.

---

## dbt Cloud v1.0.12 (May 27, 2020)

This release contains a few bugfixes for the IDE and email notifications, as well as the latest release candidate of 0.17.0.

### All versions

#### Added

- Use the correct starter project tag, based on dbt version, when initializing a new project in the IDE
- Added branch filtering to IDE git checkout UI.
- Added dbt 0.17.0-rc3.

#### Fixed

- Fixed source freshness report for dbt version v0.17.0
- Fixed issue with checking-out git branches
- Fixed issue of logs being omitted on long running queries in the IDE
- Fixed slack notifications failing to send if email notifications fail

### On-Premises Only

#### Added

- Added an Admin page for deleting credentials.

---

## dbt Cloud v1.0.11 (May 19, 2020)

This version adds some new permission sets, and a new release candidate of dbt.

### All versions

#### Added

- Added permission sets for Job Viewer, Job Admin and Analyst.
- Added dbt 0.17.0-rc1

---

## dbt Cloud v1.0.10 (May 11, 2020)

### All versions

#### Added

- Added dbt 0.17.0-b1.
- PR Url is now self serve configurable.
- Added more granular permissions around creating and deleting permissions. (Account Admin can create new projects by default while both Account Admin and Project Admin can delete the projects they have permissions for by default)
- Added an error message to display to users that do not have permissions set up for any projects on an account.

#### Fixed

- Removed .sql from csv download filename
- Fixed breaking JobDefinition API with new param custom_branch_only
- Fixed IDE query table column heading casing

---

## dbt Cloud v1.0.9 (May 5, 2020)

This release includes bugfixes around how permissions are applied to runs and run steps, fixes a bug where the scheduler would hang up, and improves performance of the IDE.

### All versions

#### Fixed

- Fixed permission checks around Runs and Run Steps, this should only affect Enterprise accounts with per-project permissions.
- Fixed receiving arbitrary remote_url when creating a git url repository.
- Fixed issue when handling non-resource specific errors from RPC server in IDE.
- Fixed a bug where the scheduler would stop if the database went away.
- Fixed IDE query results table not supporting horizontal scrolling.

#### Changed

- Improve IDE query results performance.
- Allow configuration on jobs to only run builds when environment target branch is env's custom branch.
- Allow configuration of GitHub installation IDs in the admin backend.

### On-Premises Only

#### Fixed

- Fixed logic error for installations with user/password auth enabled in an on-premises context

---

## dbt Cloud v1.0.8 (April 28, 2020)

This release adds a new version of dbt (0.16.1), fixes a number of IDE bugs, and fixes some dbt Cloud on-premises bugs.

### All versions

#### Added

- Add dbt 0.16.1

#### Fixed

- Fixed IDE filesystem loading to check for directories to ensure that load and write methods are only performed on files.
- Fixed a bug with generating private keys for connection SSH tunnels.
- Fixed issue preventing temporary PR schemas from being dropped when PR is closed.
- Fix issues with IDE tabs not updating query compile and run results.
- Fix issues with query runtime timer in IDE for compile and run query functions.
- Fixed what settings are displayed on the account settings page to allign with the user's permissions.
- Fixed bug with checking user's permissions in frontend when user belonged to more than one project.
- Fixed bug with access control around environments and file system/git interactions that occurred when using IDE.
- Fixed a bug with Environments too generously matching repository.

#### Changed

- Make the configured base branch in the IDE read-only.
- Support configuring groups using an account ID in the admin backend.
- Use gunicorn webserver in IDE.
- Allow any repository with a Github installation ID to use build-on-PR.
- Member and Owner Groups are now editable from admin UI.

### On-Premises Only

#### Fixed

- Fixed an issue where account license counts were not set correctly from onprem license file.
- Fixed an issue where docs would sometimes fail to load due to a server error.

---

## dbt Cloud v1.0.7 (April 13, 2020)

This release rolls out a major change to how permissions are applied in dbt Cloud's API. It also adds some minor bugfixes, and some tooling for improved future QA.

### All versions

#### Added

- Added support to permission connections on a per project basis.
- Added support to permission credentials on a per project basis.
- Added support to permission repositories on a per project basis.
- Smoke tests for account signup, user login and basic project setup
- Add dbt 0.16.1rc1
- Non-enterprise users can now add new accounts from the Accounts dropdown.

#### Fixed

- Fix missing migration for credentials.
- Fixed issue with testing connections with a non-default target name specified in the credentials.
- Fix issue where Bigquery connections could be created with invalid values for `location`.

---

## dbt Cloud v1.0.6 (March 30, 2020)

This release adds UIs to select group permissions in the project settings UI. It also contains bugfixes for the IDE, PR build schema dropping, and adds support for dissociating Github and Slack integrations via the Admin backend.

### All versions

#### Added

- (Enterprise only) Added ability to create group permissions for specific projects in the project settings UI.

#### Fixed

- Fix empty state for selecting github repositories
- Fixed an issue with the IDE failing to report an invalid project subdirectory for a dbt project
- Fix blank loading screen displayed when switching accounts while on account/profile settings page
- Fix issue preventing schemas from dropping during PR builds
- Fix issue where whitespace in user's name breaks default schema name
- Added webhook processing for when a user disassociates github access to their account.
- Added slack disassociation capability on user integrations page and on backend admin panel (for notifications).

#### Changed

- Declare application store using configureStore from redux-toolkit

---

## dbt Cloud v1.0.5 (March 23, 2020)

### All versions

#### Added

- Add support for authenticating Development and Deployment Snowflake credentials using keypair auth
- Add support for checking out tags, render git output in "clone" run step
- Add dbt 0.15.3
- Add dbt 0.16.0

#### Fixed

- Git provider urls now built with correct github account and repository directories.
- Invalid DateTime Start time in IDE Results Panel KPIs.
- Fix a race condition causing the Invite User UI to not work properly.
- Incorrect model build times in IDE.

#### Changed

- Git: ignore `logs/` and `target/` directories in the IDE.

---

## 1.0.4 (March 16, 2020)

This release adds two new versions of dbt, adds Snowflake SSO support for Enterprise accounts, and fixes a number of bugs.

### All versions

#### Added

- Added dbt 0.15.3rc1
- Added dbt 0.16.0rc2
- Add support for cloning private deps in the IDE when using deploy key auth.
- Log user that kicked off manual runs.
- Enterprise support for authenticating user Snowflake connections using Snowflake single sign-on

#### Fixed

- Fixed issue loading accounts for a user if they lack permissions for any subset of accounts they have a user license for.
- Fixed issue with showing blank page for user who is not associated with any accounts.
- Fixed issue where runs would continue to kick off on a deleted project.
- Fixed issue where accounts connected to GitHub integrations with SAML protection could not import repositories
- Improved error messages shown to the user if repos are unauthorized in a GitHub integration when importing a repo
- Fix colors of buttons in generated emails

### On-Premises

#### Added

- Added Admin backend UIs for managing user permissions.

---

## 1.0.3 (March 1, 2020)

This release contains the building blocks for RBAC, and a number of bugfixes and upgrades.

### All versions

#### Added

- Add support for a read replica for reading runs from the API.
- Added groups, group permissions, and user groups.
- Add email address to email verification screen.
- Add Enterprise Permissions.
- Allow account-level access to resources for groups with a permission statement of "all resources" for api backwards compatibility.
- Add dbt 0.16.0b3

#### Fixed

- Fix issue with loading projects after switching accounts.
- Fix broken links to connections from deployment environment settings.
- Fix a bug with inviting readonly users.
- Fix a bug where permissions were removed from Enterprise users upon login.

#### Changed

- Update Django version: 2.2.10
- Update Django admin panel version
- Update Social Auth version and the related Django component
- Update jobs from using account-based resource permissions to project-based resource permissions
- Update modal that shows when trials are expired; fix copy for past-due accounts in modal
- Replace formatted string logging with structured logging
- Move connection and repository settings from account settings to project settings
- Update project setup flow to be used for creating projects
- Update develop requests to have a foreign key on projects

### On-Premises

#### Added

- Accounts created from admin backend will come with a default set of groups

#### Changed

- Rename "Fishtown Analytics User" to "Superuser"

---

## dbt Cloud v1.0.2 (February 20, 2020)

This release contains a number of package upgrades, and a number of bugfixes.

### All versions

#### Added

- Add request context data to logs
- Comprehensive logging for git subprocesses

#### Fixed

- Fix an issue where the "Cancel Run" button does not work
- Fix warnings regarding mutable resource model defaults for jobs and job notifications
- Fix bug where users can create multiple connection user credentials through the project setup workflow
- Update auth for requests against Github's api from using query parameters to using an Authorization header
- Remove unused threads input from deployment environments
- Fix issue that prevented user from viewing documentation and data sources
- Fix issue rendering code editor panel in the IDE when using Safari
- Fix issue with log levels that caused dbt logs to be too chatty

#### Changed

- Update Django version: 2.2.10
- Update Django admin panel version
- Update Social Auth version and the related Django component
- Update jobs from using account-based resource permissions to project-based resource permissions
- Update modal that shows when trials are expired; fix copy for past-due accounts in modal
- Replace formatted string logging with structured logging
- Move connection and repository settings from account settings to project settings
- Update project setup flow to be used for creating projects

#### Removed

None.

---

## dbt Cloud v1.0.1 (February 4, 2020)

This release makes the IDE generally available, and adds two new versions of dbt (0.15.1, 0.15.2).

For on-premises customers, there is a new set of configurations in the configuration console:

SMTP: You can now configure dbt Cloud to send email notifications through your own SMTP server.

RSA Encryption: You can now provide your own RSA keypair for dbt Cloud to use for encryption.

These fields need to be specified for your instance of dbt Cloud to function properly.

### All versions

#### Added

- New Team List page
- New Team User Detail page
- New Invite User page
- New dashboard for Read Only users
- New dbt version: 0.15.1
- New dbt version: 0.15.2
- Ability to rename files in IDE
- New backend service for project-based resource permissions

#### Fixed

- Fix an issue where the user has to repeat steps in the onboarding flow
- Fix issue where user can get stuck in the onboarding flow
- Fix bug where email notifications could be sent to deleted users
- Fix UI bug not allowing user to check "Build on pull request?" when creating a job
- Fix UI bug in header of the Edit User page
- Fix issue that did not take into account pending invites and license seats when re-sending a user invite.
- Fix an issue when processing Github webhooks with unconfigured environments
- Fix console warning presented when updating React state from unmounted component
- Fix issue where closed tabs would continue to be shown, though the content was removed correctly
- Fix issue that prevented opening an adjacent tab when a tab was closed
- Fix issue creating BigQuery connections causing the the account connections list to not load correctly.
- Fix for locked accounts that have downgraded to the developer plan at trial end
- Fix for not properly showing server error messages on the user invite page

#### Changed

- Deployed a number of IDE visual improvements
- Batch logs up every 5 seconds instead of every second to improve database performance
- Make `retries` profile configuration for BigQuery connections optional
- Support `retries` profile configuration for BigQuery connections (new in dbt v0.15.1)
- Replace Gravatar images with generic person icons in the top navbar
- Remove deprecated account subscription models
- Remove external JS dependencies

#### Removed

- Remove the "read only" role (this is now a "read only" license type)
- Remove the "standard" license type
- Remove "beta" tag from dbt IDE
- Remove unused frontend code (team page/create repository page and related services)

### Self-Service

#### Fixed

- Fix for locked accounts that have downgraded to the developer plan at trial end

#### Added

- New Plans page
- Add a 14 day free trial
- Add the ability to provision a new repository via dbt Cloud
- New Invite Team step for project setup process for trial accounts

#### Changed

- The "Basic" and "Pro" plans are no longer available. The new "Developer" and "Team" plans are available.
- Prorations are now charged immediately, instead of applied to the next billing cycle.
- It is no longer possible to downgrade to a plan that does not support the current number of allocated seats.
- A "Team" plan that has been cancelled will be locked (closed) at the end of the subscription's period

### On-Premises

#### Added

- Support custom SMTP settings
- Support Azure Blob Storage for run logs + artifacts
- Optionally disable anonymous usage tracking

---

## dbt Cloud v0.5.0 (December 19, 2019)

This release preps dbt Cloud for the general IDE release in January. Beta IDE functionality can be turned on by checking "Develop file system" in the Accounts page in the dbt Cloud backend.

### All versions

#### Added

- New dbt version: 0.14.2
- New dbt version: 0.14.3
- New dbt version: 0.14.4
- New dbt version: 0.15.0
- New API endpoint: v3/projects
- New API endpoint: v3/credentials
- New API endpoint: v3/environments
- New API endpoint: v3/events
- IDE: Add git workflow UI
- IDE: Add filesystem management
- IDE: Hup the server when files change
- IDE: Display server status and task history
- Added development and deployment environments and credentials
- Support `--warn-error` flag in dbt runs

#### Fixed

- Fixed an issue where the run scheduler would hang up when deleting PR schemas
- Fixed an issue where the webhook processor would mark a webhook as processed without queuing a run
- Fix a bug where SSH tunnels were not created for the Develop IDE
- Fix Develop IDE scrolling in Firefox
- Fix a bug where requests were timed out too aggressively
- Require company name at signup
- Fix security issue where IP blacklist could be bypassed using shorthand
- Do a better job of handling git errors
- Allow users to delete projects

#### Changed

- Move account picker to sidebar
- Increase require.js timeout from 7s to 30s
- Migrate environments to projects
- Move some UIs into Account Settings
- Make cron scheduling available on the free tier
- Apply new styles to IDE
- Speed up develop
