---
title: "dbt Cloud - Changelog"
id: "cloud-changelog"
sidebar_label: Changelog
description: "Changelog for the dbt Cloud application"
---

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
