---
title: "dbt Cloud - Changelog"
id: "cloud-changelog"
sidebar_label: Changelog
description: "Changelog for the dbt Cloud application"
---

## dbt Cloud v1.1.46 (March 2nd, 2022)

dbt Cloud now shows "waiting time" and "prep time" for a run, which used to be expressed in aggregate as "queue time". Waiting time captures the time dbt Cloud waits to run your job if there isn't an available run slot or if a previous run of the same job is still running. Prep time represents the time it takes dbt Cloud to ready your job to run in your cloud data warehouse.

<Lightbox src="/img/docs/dbt-cloud/v1.1.46releasenotes_img1.png" title="New prep time and waiting time"/>

## dbt Cloud v1.1.45 (February 16, 2022)

Service tokens can now be assigned granular permissions to enforce least privilege access. If you're on Enterprise, you can assign any enterprise permission set to newly issued service tokens. If you're on Teams, you can assign the Job Admin permission set to newly issued service tokens. We highly recommend you re-issue service tokens with these new permissions to increase your security posture! See docs [here](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens#permissions-for-service-account-tokens).

#### New products and features

- We are joining the [GitHub secret scanning partner program](https://docs.github.com/en/developers/overview/secret-scanning-partner-program) to better secure your token against accidental public exposure and potential fraudulent usage. 

#### Bug fixes
- Credentials are no longer accidentally deleted when a user updates an environment setting.


## dbt Cloud v1.1.44 (February 2nd, 2022)
Love the DAG in the IDE as much as we do? Now when you click on a node in the DAG, the <Term id="model" /> or config file will open as a new tab in the IDE, so you can directly view or edit the code. We'll continue to ship better developer ergonomic functionality throughout the year.

#### Performance improvements and enhancements

* Updated recommended dbt commands in the IDE to include dbt Core v1.0 commands, such as "build" and the "--select" argument.  


## dbt Cloud v1.1.43 (January 19th, 2022)

Some noteworthy improvements include autocomplete snippets for sql and yaml files in the IDE, which are available for use now! We also added a [new metric layer page](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-metrics-layer) to docs.getdbt.com to help you begin thinking about the metrics layer in dbt Cloud.

#### Performance improvements and enhancements

* Branch names now default to "main" instead of "master" in new managed and unmanaged Git repositories.
* Update IDE autocomplete snippets.


## dbt Cloud v1.1.42 (January 5th, 2022)

#### New products and features

We started the new year with a gift! Multi-tenant Team and Enterprise accounts can now use the new [Model timing](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-model-timing-tab) tab in dbt Cloud. You can use this tab to further explore long-running models to see if they need refactoring or rescheduling.

#### Performance improvements and enhancements

* We added client-side naming validation for file or folder creation.

## dbt Cloud v1.1.41 (December 8, 2021)

It's one of the best weeks of the year - it's [Coalesce](https://coalesce.getdbt.com/)! We'll have some exciting product announcements to share! Did somebody say [metrics](https://coalesce.getdbt.com/talks/keynote-metric-system/) and [dbt Core v1.0](https://coalesce.getdbt.com/talks/dbt-v10-reveal/)?!

#### New products and features

- dbt v1.0 is now available in dbt Cloud... nbd.


#### Performance improvements and enhancements

- Now whenever you log back into dbt Cloud, you'll return to the acccount and project that you most recently were working in!


## dbt Cloud v1.1.39 (November 10, 2021)
We shipped environment variables in dbt Cloud. Environment variables create a way to separate code from configuration - allowing you to set config based on context and keep secrets like git tokens securely stored.

#### New products and features
- You can now add environment variables to your dbt Cloud project. Why does this matter? Environment variables are a fundamental building block of a dbt project, which until now, we only enabled in dbt Core. They power many use cases such as cloning private packages, limiting the amount of data that is processed in development environments, changing your data sources depending on the environment, and more. Read about environment variables in our [blog post](https://blog.getdbt.com/introducing-environment-variables-in-dbt-cloud/) or [docs](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-environment-variables). 


## dbt Cloud v1.1.38 (October 27, 2021)
Have you used the [Metadata API](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) yet? The Metadata API is available to customers on the Team and Enterprise plans, and with it, you can learn tons about your dbt project, if it's running dbt v0.19.0 or later. You can now query information about _any_ run, not just the last run of a job. Mo' data, mo' fun!


## dbt Cloud v1.1.37 (October 13, 2021)
dbt v0.21 is now available in dbt Cloud. The big change with this release is it introduces the `dbt build` command. `dbt build` logically does everything you'd want to do in your DAG. It runs your models, tests your tests, snapshots your snapshots, and seeds your seeds. It does this, resource by resource, from left to right across your DAG. dbt build is an opinionated task. It’s the culmination of all we’ve built- running models with resilient materializations, prioritizing data quality with tests, updating fixtures with seeds, capturing slowly changing dimensions with snapshot. Give it a try!

#### New products and features
- We have a new beta feature, which we're calling Model Bottlenecks. It allows you to visually see how long it takes to build models in each run, so you can see clearly which models are taking the longest. If you're interested in learning more, check out #beta-feedback-model-bottlenecks in the dbt community Slack, and we can add you to the beta.

## dbt Cloud v1.1.36 (September 29, 2021)
Check out the release candidate for `dbt v0.21.0`! Also tab switching in the dbt Cloud IDE now keeps track of your scroll position - at last!

#### Bug fixes
- Some Redshift customers were experiencing timeouts on runs. We've since fixed this bug by keeping the session alive longer.

#### Performance improvements and enhancements
- You won't lose track of the code snippets you were looking at when you switch back and forth between tabs in the dbt Cloud IDE, as we now keep track of your scroll position.

## dbt Cloud v1.1.35 (September 15, 2021)
Have you ever been working in the IDE, taken a several hour break from developing, and when you returned to your work, the IDE started behaving in unexpected ways? Your develop session became inactive, without any notification. Well, that silent failure won’t happen anymore! dbt Cloud now will let you know when you have to refresh your IDE so you can continue to pick up work where you last left off.

#### New products and features
- dbt v0.20.2 is released in dbt Cloud.

#### Performance improvements and enhancements
- Set default threads to 4 for new jobs and in development creds.

#### Bug fixes
- The user is now prompted to refresh the page when in a disconnected IDE state.
- dbt tasks that fail or error are now correctly ordered in the run drawer history.


## dbt Cloud v1.1.34 (September 1, 2021)
We just launched our beta for supporting environment variables in dbt Cloud. Environment variables are exciting because they allow you to clone private packages. If you’re interested in joining the beta, check out the #beta-feedback-for-env-vars channel in dbt Slack for more information.

#### Performance improvements and enhancements
Our IDE SQL drawer got a fresh new look, and it now has improved accessibility.


## dbt Cloud v1.1.33 (August 18, 2021)
We added a DAG in the IDE, so that you can see your model dependencies as you develop! If you haven’t seen the DAG visualization yet, take a moment to spin up the IDE, navigate to the Lineage tab, and click-click-click around in there — it is legitimately a brand new modality for developing dbt projects, and it’s something worth being excited about!

#### New products and features
- [Dashboard Status Tiles](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-dashboard-status-tiles) can now be embedded on dashboards (or anywhere you can embed an iFrame) to give immediate insight into data freshness and quality. This helps dbt project maintainers build trust internally about the data that end users are seeing.
- We shipped DAG in the IDE to GA!
- Support for `dbt v0.20.1` in Cloud.

#### Bug fixes
- Databricks users will now be able to see and update the token/schema for deployment environments.
- Some Github users were experiencing a broken profile image in dbt Cloud. This should be fixed if users disconnect and reconnect their Github accounts.


## dbt Cloud v1.1.32 (August 4, 2021)
The Metadata API is now in GA! When dbt Cloud invokes certain commands like run, test, seed, etc, dbt generates metadata in the form of [artifacts](https://docs.getdbt.com/reference/artifacts/dbt-artifacts). These artifacts give you tons of information about project set up, run times, test details, compiled SQL, and so much more. Now dbt Cloud serves a GraphQL API which supports arbitrary queries over these artifacts, so you can retrieve the metadata you want almost instantaneously.

#### New products and features
- The Metadata API is the start of our metadata product suite. Learn more about how to use the Metadata API [here](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview).
- dbt Enterprise customers using GitHub now get better fine grained access control in their dbt projects. dbt will enforce git permissions for every developer to ensure that read / write policies in GitHub carry through to the IDE.


## dbt Cloud v1.1.31 (July 21, 2021)
We’ve improved the tabbing experience in the IDE. Tabs now work much more intuitively, and you don’t have to worry about losing your work anymore!

#### New products and features
- We are working to release a DAG directly in the IDE, so that when you’re developing, you have a clear idea of where the model you’re working on sits in the dependency graph. If you’re interested in testing out the feature early, head over to the `#beta-feedback-for-ide-dag` channel in the dbt Slack, and we’ll get the new product feature-flagged on your account!
- Added dbt 0.20.0 to Cloud

#### Bug fixes
- Users will now be able to initialize any project that doesn't contain a `dbt_project.yml` file, regardless of whether or not there are pre-existing files and/or commits to that repo.

#### Performance improvements and enhancements
- We've been working on some nice improvements to tabs in our IDE. We’ve fixed deficiencies with tabs that caused users to lose work if they didn’t hit save regularly enough. Additionally, opening, closing, and the order of the tabs work much more smoothly.
- You may have noticed that there is now a source freshness checkbox in your execution settings when you configure a job on dbt Cloud. Selecting this checkbox will run `dbt source freshness` as the first step in your job, but it will not break subsequent steps if it fails. Updated source freshness documentation available [here](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-snapshotting-source-freshness).
- Added a new endpoint to allow API key rotation via `POST https://cloud.getdbt.com/api/v2/users/{user-id}/apiKey`


## dbt Cloud v1.1.30 (July 7, 2021)
We shipped a resizable folder pane in the IDE, and we're hearing great things! "My quality of life has greatly increased with this little update!" Hope this helps everyone else enjoy the IDE a little more too.

#### New products and features
- Resizable folder pane in the IDE: Have you ever developed in the IDE and not been able to see the full name of your model because you couldn’t adjust the width of the file pane? Yeah, us too. Now you’ll be able to adjust your project’s file tree width to be as wide or as narrow as you’d like. It’s these small things that make developing in the IDE so much easier.

#### Bug fixes
- Made some changes to GitLab webhooks so that the status of the dbt run gets properly updated in GitLab.
- Resolved an issue where users saw a blank screen rather than the SSO reauthentication page.

#### Performance improvements and enhancements
- Refreshed the design of the repository import page.


## dbt Cloud v1.1.29 (June 23, 2021)
We're heads down working on a handful of new features that we're going to share at the end of this month. The finish line is in sight. In the meantime, check out our latest release candidates for dbt Core. The biggest changes are better tests, providing consistency, configurability, and persistence. Additionally, we've refactored partial parsing and introduced an experimental parser; both are set to off by default.

#### New products and features
- Add support for latest Core release candidates to dbt Cloud: v0.19.2-rc2 and v0.20.0-rc1

#### Bug fixes
- Add a safeguard for the SSO reauth page to avoid 401 interceptors

#### Performance improvements and enhancements
- Ensure navigation bar is in dark mode when IDE is set to dark mode


## dbt Cloud v1.1.28 (June 9, 2021)
We shipped a far better experience for GitLab users. Be sure to check out new CI features that are now available for customers using GitLab. Additionally, all developers should test out Slim CI which will speed up their <Term id="model" /> builds.

#### New products and features

- `Slim CI`: We’ve made Slim CI available for all our cloud customers! With Slim CI, you don't have to rebuild and test all your models; you can instruct dbt Cloud to run jobs on only modified or new resources. If you are a GitHub or GitLab user, try creating a new job that runs on pull requests and you can signal to dbt to run only on these modified resources by including the `state:modified+` argument. Read more about Slim CI [here](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration-with-github#slim-ci).

- Native GitLab authentication for dbt Cloud Developer and Team Tiers: We’ve shipped native GitLab auth into GA. You can now import new GitLab repos with a couple clicks, trigger CI builds when Merge Requests are opened in GitLab, and carry GitLab permissions through to dbt Cloud IDE's git actions. Read how to set up native GitLab auth [here](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-gitlab).

#### Bug fixes
- Allow users to select artifacts from a job that runs source freshness on jobs with the source freshness execution settings set to `ON`.
- Resolve `RUN ONLY ON CUSTOM BRANCH?` button to toggle on and off properly.
- Retain information in a `Statement` tab when the page is refreshed.
- Unsaved changes in the IDE are now saved when committing work.
- Drop temporary schemas in the data warehouse for closed or merged GitLab merge requests.

#### Performance improvements and enhancements
- Behind the scenes, we’ve been moving off of Angular and onto React. We’ve started the process of migrating the central pieces of our UI over - the first of which is the main navigation. We think this will have a big impact on our ability to reduce UI bugs and improve user experience.
- Added support for dbt 0.19.2rc2 + 0.20.0rc1 in dbt Cloud.


## dbt Cloud v1.1.27 (May 26, 2021)

A lot of improvements coming for GitLab webhooks and native auth. We also fixed a number of bugs in the IDE. Our goal is for you to never see an infinite spinner again!

#### Enhancements

- Add dbt v0.19.2rc1 and v0.20.0b1
- Add an open/closable overlay for the DAG
- Disable department dropdown
- Add DAG flags, button, and tab context
- Add run source freshness option to jobs
- Implement conditional redirecting after GitLab app integration
- Add Develop Pod Support for Rook and Ceph file storage
- Show all common actions for valid top level commands

#### Fixed

- Fix link to documentation
- Disable the "Restart IDE" Button while the IDE is loading
- Continue canceling runs when we run into deleted accounts
- Fix SSO re-auth page
- Fix blank verify email page
- Resolve git refresh regression
- Fix missing "Run on Merge" button in Job creation/edit form- 
- Warn users they have unsaved changes
- Updates test command suggestions and regex for common action suggestions
- Updates order of stylesheet import to fix missing border bug
- Fix GitLab PR link for Run Page
- Fix infinite spinner for missing environment or development credentials
- Fix infinite spinner when user is missing dev credentials
- Do not try to push if awaiting a merge
- Fix deleting schemas
- Fix favicon reference

## dbt Cloud v1.1.26 (May 12, 2021)

If you haven't seen it yet, spin up the IDE: the command bar now has recent actions (you can up-arrow like on the command line) as well as some hardcoded suggestions that will auto-populate your active model, if there is one. Check it out! Other fixes and adjustments as well, as we all get ready for Staging this Thursday - exciting week for the Product org over at ol' Fishtown!

#### Enhancements

- Made dbt default version on env 0.19.1
- Rolled out new command line experience to all customers
- Post webhook triggered run status back to gitlab
- Temporary tabs can also populate the model from manifest
- Check command line content is minimally valid
- Allow user to restart server when develop pod crashes
- Prevent overflow of menu items

#### Fixed

- Handle validation error for improper remote URLs in the Scheduler
- Refactor exception logging out of GitRepo and into exception handlers
- Required tags returning null from core no longer causing infinite spinner
- Removed deleted repos while fetching repository for sending commit statuses
- Refactor git provider service
- Resolve files with special characters becoming forever dirty
- Disable input when RPC command running & add button when command bar is empty
- Updating button for the Cancel/Enter button on commandline
- Fix connection setup to always use the project referenced in the route
- Fix "View data sources" URL in environment page
- Add support for clicking on previously run commands and updating the text inside of the commandline
- Fix sources URL in environments page
- Fix metadata token not allowed API response

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
- Improve reliability of background cleanup processes
- Improve performance and reliability of artifact management and PR webhook processing


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
- Make api and admin modules flake8 complaint

#### Fixed

- Fix incorrect usage of `region_name` in KMS client
- Fix a call to a deprecated Github API
- Remove extraneous billing API calls during job scheduler loop
- Fix error where refreshing the IDE would leave running dbt processes in a bad state


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
- \[Security\] Add security check to prevent potentially malicious html files in dbt docs


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
- Remove deprecated account subscription <Term id="model">models</Term>
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
