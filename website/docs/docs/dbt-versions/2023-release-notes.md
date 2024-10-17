---
title: "2023 dbt Cloud release notes"
description: "dbt Cloud release notes for 2023"
id: "2023-release-notes"
sidebar: "2023 release notes"
pagination_next: null
pagination_prev: null
---

Archived release notes for dbt Cloud from 2023

## December 2023

- <Expandable alt_header='Semantic Layer updates'>

    The dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability for the dbt Semantic Layer. The following list explains the updates and fixes for December 2023 in more detail. 

    ## Bug fixes

    - Tableau integration &mdash; The dbt Semantic Layer integration with Tableau now supports queries that resolve to a "NOT IN" clause. This applies to using "exclude" in the filtering user interface. Previously it wasn’t supported.
    - `BIGINT` support &mdash; The dbt Semantic Layer can now support `BIGINT` values with precision greater than 18. Previously it would return an error.
    - Memory leak &mdash; Fixed a memory leak in the JDBC API that would previously lead to intermittent errors when querying it.
    - Data conversion support &mdash; Added support for converting various Redshift and Postgres-specific data types. Previously, the driver would throw an error when encountering columns with those types.

    ## Improvements

    - Deprecation &mdash; We deprecated dbt Metrics and the legacy dbt Semantic Layer, both supported on dbt version 1.5 or lower. This change came into effect on December 15th, 2023.
    - Improved dbt converter tool &mdash; The [dbt converter tool](https://github.com/dbt-labs/dbt-converter) can now help automate some of the work in converting from LookML (Looker's modeling language) for those who are migrating. Previously this wasn’t available. 

  </Expandable>

- <Expandable alt_header='External attributes'>

    The extended attributes feature in dbt Cloud is now GA! It allows for an environment level override on any YAML attribute that a dbt adapter accepts in its `profiles.yml`. You can provide a YAML snippet to add or replace any [profile](/docs/core/connect-data-platform/profiles.yml) value.

    To learn more, refer to [Extended attributes](/docs/dbt-cloud-environments#extended-attributes).

    The **Extended Atrributes** text box is available from your environment's settings page: 

    <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/extended-attributes.jpg" width="85%" title="Example of the Extended Attributes text box" />

  </Expandable>

- <Expandable alt_header='Legacy semantic layer'>

    dbt Labs has deprecated dbt Metrics and the legacy dbt Semantic Layer, both supported on dbt version 1.5 or lower. This change starts on December 15th, 2023.

    This deprecation means dbt Metrics and the legacy Semantic Layer are no longer supported. We also removed the feature from the dbt Cloud user interface and documentation site.

    ### Why this change?

    The [re-released dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), powered by MetricFlow, offers enhanced flexibility, performance, and user experience, marking a significant advancement for the dbt community.

    ### Key changes and impact

    - **Deprecation date** &mdash; The legacy Semantic Layer and dbt Metrics will be officially deprecated on December 15th, 2023.
    - **Replacement** &mdash; [MetricFlow](/docs/build/build-metrics-intro) replaces dbt Metrics for defining semantic logic. The `dbt_metrics` package will no longer be supported post-deprecation.
    - **New feature** &mdash; Exports replaces the materializing data with `metrics.calculate` functionality and will be available in dbt Cloud in December or January.

    ### Breaking changes and recommendations

    - For users on dbt version 1.5 and lower with dbt Metrics and Snowflake proxy:
    - **Impact**: Post-deprecation, queries using the proxy _will not_ run.
    - **Action required:** _Immediate_ migration is necessary. Refer to the [dbt Semantic Layer migration guide](/guides/sl-migration?step=1)

    - For users on dbt version 1.5 and lower using dbt Metrics without Snowflake proxy:
    - **Impact**: No immediate disruption, but the package will not receive updates or support after deprecation
    - **Recommendation**: Plan migration to the re-released Semantic Layer for compatibility with dbt version 1.6 and higher.

    ### Engage and support

    - Feedback and community support &mdash; Engage and share feedback with the dbt Labs team and dbt Community slack using channels like [#dbt-cloud-semantic-layer](https://getdbt.slack.com/archives/C046L0VTVR6) and [#dbt-metricflow](https://getdbt.slack.com/archives/C02CCBBBR1D). Or reach out to your dbt Cloud account representative.
    - Resources for upgrading &mdash; Refer to some additional info and resources to help you upgrade your dbt version:
    - [Upgrade version in dbt Cloud](/docs/dbt-versions/upgrade-dbt-version-in-cloud)
    - [Version migration guides](/docs/dbt-versions/core-upgrade)

  </Expandable>

## November 2023

- <Expandable alt_header='New features and UI changes to dbt Explorer'>

    There are new quality-of-life improvements in dbt Cloud for email and Slack notifications about your jobs: 

    - You can add external email addresses and send job notifications to them. External emails can be:
        - Addresses that are outside of your dbt Cloud account
        - Third-party integration addresses for configuring notifications to services like Microsoft Teams or PagerDuty 
    - You can configure notifications for multiple Slack channels. Previously, you could only configure one Slack channel. 
    - Any account admin can now edit slack notifications, not just the person who created them. 

    To learn more, check out [Job notifications](/docs/deploy/job-notifications).

  </Expandable>

- <Expandable alt_header='Job notifications'>

    There are new quality-of-life improvements in dbt Cloud for email and Slack notifications about your jobs: 

    - You can add external email addresses and send job notifications to them. External emails can be:
        - Addresses that are outside of your dbt Cloud account
        - Third-party integration addresses for configuring notifications to services like Microsoft Teams or PagerDuty 
    - You can configure notifications for multiple Slack channels. Previously, you could only configure one Slack channel. 
    - Any account admin can now edit slack notifications, not just the person who created them. 

    To learn more, check out [Job notifications](/docs/deploy/job-notifications).

  </Expandable>

- <Expandable alt_header='Repo caching'>

    Now available for dbt Cloud Enterprise plans is a new option to enable Git repository caching for your job runs. When enabled, dbt Cloud caches your dbt project's Git repository and uses the cached copy instead if there's an outage with the Git provider. This feature improves the reliability and stability of your job runs. 

    To learn more, refer to [Repo caching](/docs/cloud/account-settings#git-repository-caching).

    <Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Repository caching option" />

  </Expandable>

## October 2023

- <Expandable alt_header='dbt Cloud APIs'>

    Beginning December 1, 2023, the [Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) v2 and v3 will expect you to limit all "list" or `GET` API methods to 100 results per API request. This limit enhances the efficiency and stability of our services. If you need to handle more than 100 results, then use the `limit` and `offset` query parameters to paginate those results; otherwise, you will receive an error. 

    This maximum limit applies to [multi-tenant instances](/docs/cloud/about-cloud/access-regions-ip-addresses) only, and _does not_ apply to single tenant instances.

    Refer to the [API v3 Pagination](https://docs.getdbt.com/dbt-cloud/api-v3#/) or [API v2 Pagination](https://docs.getdbt.com/dbt-cloud/api-v2#/) sections for more information on how to paginate your API responses. 

  </Expandable>

- <Expandable alt_header='dbt Cloud CLI'>

    We are excited to announce the dbt Cloud CLI, **unified command line for dbt**, is available in public preview. It’s a local development experience, powered by dbt Cloud.  It’s easy to get started:  `pip3 install dbt` or `brew install dbt` and you’re ready to go.

    We will continue to invest in the dbt Cloud IDE as the easiest and most accessible way to get started using dbt, especially for data analysts who have never developed software using the command line before. We will keep improving the speed, stability, and feature richness of the IDE, as we have been [all year long](https://www.getdbt.com/blog/improvements-to-the-dbt-cloud-ide/).

    We also know that many people developing in dbt have a preference for local development, where they can use their favorite terminal, text editor, keybindings, color scheme, and so on. This includes people with data engineering backgrounds, as well as those analytics engineers who started writing code in the dbt Cloud IDE and have expanded their skills. 

    The new dbt Cloud CLI offers the best of both worlds, including: 

    - The power of developing against the dbt Cloud platform 
    - The flexibility of your own local setup

    Run whichever community-developed plugins, pre-commit hooks, or other arbitrary scripts you like.

    Some of the unique capabilities of this dbt Cloud CLI include:

    - Automatic deferral of build artifacts to your Cloud project's production environment
    - Secure credential storage in the dbt Cloud platform
    - Support for dbt Mesh ([cross-project `ref`](/docs/collaborate/govern/project-dependencies))
    - Development workflow for dbt Semantic Layer
    - Speedier, lower cost builds

    Refer to [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) to learn more.

  </Expandable>

- <Expandable alt_header='Custom branch fix'>

    If you don't set a [custom branch](/docs/dbt-cloud-environments#custom-branch-behavior) for your dbt Cloud environment, it now defaults to the default branch of your Git repository (for example, `main`). Previously, [CI jobs](/docs/deploy/ci-jobs) would run for pull requests (PRs) that were opened against _any branch_ or updated with new commits if the **Custom Branch** option wasn't set. 

    ## Azure DevOps 

    Your Git pull requests (PRs) might not trigger against your default branch if you're using Azure DevOps and the default branch isn't `main` or `master`. To resolve this, [set up a custom branch](/faqs/Environments/custom-branch-settings) with the branch you want to target.  

  </Expandable>

- <Expandable alt_header='dbt deps auto install'>

    The dbt Cloud IDE and dbt Cloud CLI now automatically installs `dbt deps` when your environment starts or when necessary. Previously, it would prompt you to run `dbt deps` during initialization. 

    This improved workflow is available to all multi-tenant dbt Cloud users (Single-tenant support coming next week) and applies to dbt versions.

    However, you should still run the `dbt deps` command in these situations:

    - When you make changes to the `packages.yml` or `dependencies.yml` file during a session
    - When you update the package version in the `packages.yml` or `dependencies.yml` file. 
    - If you edit the `dependencies.yml` file and the number of packages remains the same, run `dbt deps`. (Note that this is a known bug dbt Labs will fix in the future.)

  </Expandable>

- <Expandable alt_header='Native retry support'>

    Previously in dbt Cloud, you could only rerun an errored job from start but now you can also rerun it from its point of failure. 

    You can view which job failed to complete successully, which command failed in the run step, and choose how to rerun it. To learn more, refer to [Retry jobs](/docs/deploy/retry-jobs).

    <Lightbox src="/img/docs/deploy/native-retry.gif" width="70%" title="Example of the Rerun options in dbt Cloud"/>

  </Expandable>

- <Expandable alt_header='Product docs updates'>

    Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! First, we’d like to thank the 15 new community contributors to docs.getdbt.com. We merged [107 PRs](https://github.com/dbt-labs/docs.getdbt.com/pulls?q=is%3Apr+merged%3A2023-09-01..2023-09-31) in September.

    Here's what's new to [docs.getdbt.com](http://docs.getdbt.com/):

    * Migrated docs.getdbt.com from Netlify to Vercel.

    ## ☁ Cloud projects
    - Continuous integration jobs are now generally available and no longer in beta!
    - Added [Postgres PrivateLink set up page](/docs/cloud/secure/postgres-privatelink)
    - Published beta docs for [dbt Explorer](/docs/collaborate/explore-projects).
    - Added a new Semantic Layer [GraphQL API doc](/docs/dbt-cloud-apis/sl-graphql) and updated the [integration docs](/docs/cloud-integrations/avail-sl-integrations) to include Hex. Responded to dbt community feedback and clarified Metricflow use cases for dbt Core and dbt Cloud.
    - Added an [FAQ](/faqs/Git/git-migration) describing how to migrate from one git provider to another in dbt Cloud.
    - Clarified an example and added a [troubleshooting section](/docs/cloud/connect-data-platform/connect-snowflake#troubleshooting) to Snowflake connection docs to address common errors and provide solutions.

    ## 🎯 Core projects

    - Deprecated dbt Core v1.0 and v1.1 from the docs.
    - Added configuration instructions for the [AWS Glue](/docs/core/connect-data-platform/glue-setup) community plugin.
    - Revised the dbt Core quickstart, making it easier to follow. Divided this guide into steps that align with the [other guides](/guides/manual-install?step=1).

    ## New 📚 Guides, ✏️ blog posts, and FAQs

    Added a [style guide template](/best-practices/how-we-style/6-how-we-style-conclusion#style-guide-template) that you can copy & paste to make sure you adhere to best practices when styling dbt projects!

    ## Upcoming changes

    Stay tuned for a flurry of releases in October and a filterable guides section that will make guides easier to find!

  </Expandable>

- <Expandable alt_header='Semantic layer GA'>
  
    If you're using the legacy Semantic Layer, we _highly_ recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to dbt v1.6 or higher and [migrate](/guides/sl-migration) to the latest Semantic Layer.

    dbt Labs is thrilled to announce that the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) is now generally available. It offers consistent data organization, improved governance, reduced costs, enhanced efficiency, and accessible data for better decision-making and collaboration across organizations.

    It aims to bring the best of modeling and semantics to downstream applications by introducing:

    - Brand new [integrations](/docs/cloud-integrations/avail-sl-integrations) such as Tableau, Google Sheets, Hex, Mode, and Lightdash.
    - New [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) using GraphQL and JDBC to query metrics and build integrations.
    - dbt Cloud [multi-tenant regional](/docs/cloud/about-cloud/access-regions-ip-addresses) support for North America, EMEA, and APAC. Single-tenant support coming soon.
    - Coming soon &mdash; Schedule exports (a way to build tables in your data platform) as part of your dbt Cloud job. Use the APIs to call an export, then access them in your preferred BI tool.  

    <Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-architecture.jpg" width="80%" title="Use the universal dbt Semantic Layer to define and queried metrics in integration tools."/>

    The dbt Semantic Layer is available to [dbt Cloud Team or Enterprise](https://www.getdbt.com/) multi-tenant plans on dbt v1.6 or higher. 
    - Team and Enterprise customers can use 1,000 Queried Metrics per month for no additional cost on a limited trial basis, subject to reasonable use limitations. Refer to [Billing](/docs/cloud/billing#what-counts-as-a-queried-metric) for more information.
    - dbt Cloud Developer plans and dbt Core users can define metrics but won't be able to query them with integrated tools.

  </Expandable>

## September 2023

- <Expandable alt_header='CI updates'>

    dbt Cloud now has two distinct job types: [deploy jobs](/docs/deploy/deploy-jobs) for building production data assets, and [continuous integration (CI) jobs](/docs/deploy/ci-jobs) for checking code changes. These jobs perform fundamentally different tasks so dbt Labs improved the setup experience with better defaults for each. 

    With two types of jobs, instead of one generic type, we can better guide you through the setup flow. Best practices are built into the default settings so you can go from curious to being set up in seconds.

    <Lightbox src="/img/docs/release-notes/ci-job-setup.gif" width="60%" title="Example of setting up a CI job"/>

    And, we now have more efficient state comparisons on CI checks: never waste a build or test on code that hasn’t been changed. We now diff between the Git pull request (PR) code and what’s running in production more efficiently with the introduction of deferral to an environment versus a job. To learn more, refer to [Continuous integration in dbt Cloud](/docs/deploy/continuous-integration). 

    Below is a comparison table that describes how deploy jobs and CI jobs behave differently:

    |  | Deploy Jobs | CI Jobs |
    | --- | --- | --- |
    | Purpose | Builds production data assets. | Builds and tests new code before merging changes into production. |
    | Trigger types | Triggered by a schedule or by API. | Triggered by a commit to a PR or by API. |
    | Destination | Builds into a production database and schema. | Builds into a staging database and ephemeral schema, lived for the lifetime of the PR. |
    | Execution mode | Runs execute sequentially, so as to not have collisions on the underlying DAG. | Runs execute in parallel to promote team velocity. |
    | Efficiency run savings | Detects over-scheduled jobs and cancels unnecessary runs to avoid queue clog. | Cancels existing runs when a newer commit is pushed to avoid redundant work. |
    | State comparison | Only sometimes needs to detect state. | Almost always needs to compare state against the production environment to build on modified code and its dependents. |

    ## What you need to update

    - If you want to set up a CI environment for your jobs, dbt Labs recommends that you create your CI job in a dedicated [deployment environment](/docs/deploy/deploy-environments#create-a-deployment-environment) that's connected to a staging database. To learn more about these environment best practices, refer to the guide [Get started with continuous integration tests](/guides/set-up-ci).

    - If you had set up a CI job before October 2, 2023, the job might've been misclassified as a deploy job with this update. Below describes how to fix the job type:

    If you used the [Create Job](/dbt-cloud/api-v2#/operations/Create%20Job) API endpoint but didn't set `"triggers":triggers.git_provider_webhook`, the job was misclassified as a deploy job and you must re-create it as described in [Trigger a CI job with the API](/docs/deploy/ci-jobs#trigger-a-ci-job-with-the-api).

        If you used the dbt Cloud UI but didn't enable the **Run on Pull Requests** option that was in the **Continuous Integration** (CI) tab, the job was misclassified as a deploy job and you must re-create it as described in [Set up CI jobs](/docs/deploy/ci-jobs#set-up-ci-jobs).

        To check for the job type, review your CI jobs in dbt Cloud's [Run History](/docs/deploy/run-visibility#run-history) and check for the **CI Job** tag below the job name. If it doesn't have this tag, it was misclassified and you need to re-create the job.

        <Lightbox src="/img/docs/release-notes/ci-job-tag.png" width="60%" title="Example of a correct CI job type"/>

    **CI update phase 3 &mdash; Update: Improved automatic deletion of temporary schemas** 

    Temporary schemas are now being automatically deleted (dropped) for all adapters (like Databricks), PrivateLink connections, and environment variables in connection strings. 

    dbt Labs has rearchitected how schema deletion works for [continuous integration (CI)](/docs/deploy/continuous-integration) runs. We created a new service to delete any schema with a prefix of `dbt_cloud_pr_` that's been generated by a PR run.

    However, temporary schemas will not be automatically deleted if:

    - Your project overrides the [generate_schema_name macro](/docs/build/custom-schemas) but it doesn't contain the required prefix `dbt_cloud_pr_`. For details, refer to [Troubleshooting](/docs/deploy/ci-jobs#troubleshooting).
    - You're using a [non-native Git integration](/docs/deploy/ci-jobs#trigger-a-ci-job-with-the-api). This is because automatic deletion relies on incoming webhooks from Git providers, which is only available through the native integrations.

  </Expandable>

- <Expandable alt_header='Product docs updates'>

    Hello from dbt's Product Documentation team (the stewards of the docs.getdbt.com site): @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun. What a busy summer! We merged 256 PRs between July 1st and August 31. 

    We'd like to recognize all of the docs and support from our partner team, Developer Experience: @jasnonaz @gwenwindflower @dbeatty10 @dataders @joellabes @Jstein77 @dave-connors-3! 

    We'd also like to give a special thanks to the 22 community members who contributed to the [dbt Product docs](https://docs.getdbt.com) for the first time. :pray: Based on feedback from the dbt community, we made these changes:  

    - Added a [permissions table](/docs/cloud/manage-access/enterprise-permissions) for Enterprise accounts
    - Added a [browser session page](/docs/cloud/about-cloud/browsers#browser-sessions) that clarifies dbt Cloud’s browser session time and when it logs users off.
        
    You can provide feedback by opening a pull request or issue in [our repo](https://github.com/dbt-labs/docs.getdbt.com) or reaching out in the dbt community Slack channel [#dbt-product-docs](https://getdbt.slack.com/archives/C0441GSRU04)).

    ## :zap: General docs projects

    * Added the ability to collapse sections you’re not currently looking at. There were quite a few people who wanted this, and it bugged us too, so we were happy to get this shipped!
    * Introduced the idea of [“Trusted” adapters](/docs/supported-data-platforms#types-of-adapters).

    ## ☁ Cloud projects

    * The **What’s new?** product update widget is back in the dbt Cloud UI! The Docs team will begin updating the content to keep you informed about new features.
    * Launched the re-released [Semantic Layer beta docs](/docs/use-dbt-semantic-layer/dbt-sl), which introduces users to the new API, new guide to set up MetricFlow and the new Semantic Layer, as well as revamp the ‘Use the dbt Semantic Layer’ section for users.
    * Updated [Admin API v2 and v3](/docs/dbt-cloud-apis/admin-cloud-api) to help you understand the differences between them and which version includes the endpoints you use.
    * To improve discoverability, the docs team made changes to the [deploy dbt sidebar](/docs/deploy/deployments). We added cards and aligned better with the dbt Cloud UI and the way it’s used.
    * Deprecated legacy job schemas in the [Discovery API](/docs/dbt-cloud-apis/discovery-api).
    * Added a page to describe [experimental and beta features](/docs/dbt-versions/experimental-features) in dbt Cloud and what you need to know about them.
    * Added a section to introduce a new beta feature [**Extended Attributes**](/docs/dbt-cloud-environments#extended-attributes-beta), which allows users to set a flexible `profiles.yml` snippet in their dbt Cloud Environment settings.
    ## 🎯 Core projects

    * We released [dbt 1.6](/docs/dbt-versions/core-upgrade/upgrading-to-v1.6)! We added docs for the new commands `dbt retry` and `dbt clone`

    ## New 📚 Guides, ✏️ blog posts, and FAQs

    * Check out how these community members use the dbt community in the [Community spotlight](/community/spotlight). 
    * Blog posts published this summer include [Optimizing Materialized Views with dbt](/blog/announcing-materialized-views),  [Data Vault 2.0 with dbt Cloud](/blog/data-vault-with-dbt-cloud), and [Create dbt Documentation and Tests 10x faster with ChatGPT](/blog/create-dbt-documentation-10x-faster-with-ChatGPT) 
    - We now have two new best practice guides: [How we build our metrics](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) and [Set up Continuous Integration](/guides/set-up-ci).

  </Expandable>

- <Expandable alt_header='Removing prerelease versions'>

    Previously, when dbt Labs released a new [version](/docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning) in dbt Cloud, the older patch _prerelease_ version and the _latest_ version remained as options in the dropdown menu available in the **Environment settings**. Now, when the _latest_ version is released, the _prerelease_ version will be removed and all customers remaining on it will be migrated seamlessly. There will be no interruptions to service when this migration occurs. 

    To see which version you are currently using and to upgrade, select **Deploy** in the top navigation bar and select **Environments**. Choose the preferred environment and click **Settings**. Click **Edit** to make a change to the current dbt version. dbt Labs recommends always using the latest version whenever possible to take advantage of new features and functionality. 

    <Lightbox src="/img/docs/release-notes/dbt-cloud-versions.png" title="dbt Cloud versions dropdown"/>

  </Expandable>

## August 2023

- <Expandable alt_header='Deprecation of endpoints in the Discovery API'>

    dbt Labs has deprecated and will be deprecating certain query patterns and replacing them with new conventions to enhance the performance of the dbt Cloud [Discovery API](/docs/dbt-cloud-apis/discovery-api). 

    All these changes will be in effect on _September 7, 2023_. 

    We understand that these changes might require adjustments to your existing integration with the Discovery API. Please [contact us](mailto:support@getdbt.com) with any questions. We're here to help you during this transition period.

    ## Job-based queries

    Job-based queries that use the data type `Int` for IDs will be deprecated. They will be marked as deprecated in the [GraphQL explorer](https://metadata.cloud.getdbt.com/graphql). The new convention will be for you to use the data type `BigInt` instead. 

    This change will be in effect starting September 7, 2023. 

    Example of query before deprecation: 

    ```graphql

    query ($jobId: Int!) {
    models(jobId: $jobId){
        uniqueId
    }
    }

    ```

    Example of query after deprecation:

    ```graphql

    query ($jobId: BigInt!) {
    job(id: $jobId) {
        models {
        uniqueId
        }
    }
    }

    ```

    ## modelByEnvironment queries 

    The `modelByEnvironment` object has been renamed and moved into the `environment` object. This change is in effect and has been since August 15, 2023.

    Example of query before deprecation: 

    ```graphql

    query ($environmentId: Int!, $uniqueId: String) {
    modelByEnvironment(environmentId: $environmentId, uniqueId: $uniqueId) {
        uniqueId
        executionTime
        executeCompletedAt
    }
    }

    ```

    Example of query after deprecation: 

    ```graphql

    query ($environmentId: BigInt!, $uniqueId: String) {
    environment(id: $environmentId) {
        applied {
        modelHistoricalRuns(uniqueId: $uniqueId) {
            uniqueId
            executionTime
            executeCompletedAt
        }
        }
    }
    }

    ```

    ## Environment and account queries

    Environment and account queries that use `Int` as a data type for ID have been deprecated. IDs must now be in `BigInt`. This change is in effect and has been since August 15, 2023.

    Example of query before deprecation: 

    ```graphql

    query ($environmentId: Int!, $first: Int!) {
    environment(id: $environmentId) {
        applied {
        models(first: $first) {
            edges {
            node {
                uniqueId
                executionInfo {
                lastRunId
                }
            }
            }
        }
        }
    }
    }

    ```

    Example of query after deprecation: 

    ```graphql

    query ($environmentId: BigInt!, $first: Int!) {
    environment(id: $environmentId) {
        applied {
        models(first: $first) {
            edges {
            node {
                uniqueId
                executionInfo {
                lastRunId
                }
            }
            }
        }
        }
    }
    }

    ```

  </Expandable>

- <Expandable alt_header='dbt Cloud IDE v1.2'>

    We're excited to announce that we replaced the backend service that powers the Cloud IDE with a more reliable server -- dbt-server. Because this release contains foundational changes, IDE v1.2 requires dbt v1.6 or higher. This significant update follows the rebuild of the IDE frontend last year. We're committed to improving the IDE to provide you with a better experience.

    Previously, the Cloud IDE used dbt-rpc, an outdated service that was unable to stay up-to-date with changes from dbt-core. The dbt-rpc integration used legacy dbt-core entry points and logging systems, causing it to be sluggish, brittle, and poorly tested. The Core team had been working around this outdated technology to avoid breaking it, which prevented them from developing with velocity and confidence.

    ## New features

    - **Better dbt-core parity:** The Cloud IDE has better command parity with dbt-core, including support for commands like `dbt list` and improved treatment of flags like `--vars`, `--fail-fast`, etc.
    - **Improved maintainability:** With the new dbt-server, it's easier to fix bugs and improve the overall quality of the product. With dbt-rpc, fixing bugs was a time-consuming and challenging process that required extensive testing. With the new service, we can identify and fix bugs more quickly, resulting in a more stable and reliable IDE.
    - **A more reliable service:** Simplified architecture that's less prone to failure.

    ### Product refinements

    - Improved `Preview` capabilities with Core v1.6 + IDE v1.2. [This Loom](https://www.loom.com/share/12838feb77bf463c8585fc1fc6aa161b) provides more information.

    ### Bug fixes

    - Global page can become "inert" and stop handling clicks
    - Switching back and forth between files in the git diff view can cause overwrite
    - Browser gets stuck during markdown preview for doc with large table
    - Editor right click menu is offset
    - Unable to Cancel on the Save New File component when Closing All Files in the IDE
    - Mouse flicker in the modal's file tree makes it difficult to select a folder where you want to save a new file  
    - Snapshots not showing in Lineage when inside a subfolder and is mixed cased named
    - Tooltips do not work for Format and Save
    - When a dbt invocation is in progress or if parsing is ongoing, attempting to switch branches will cause the `Git Branch` dropdown to close automatically

    ### Known issues

    - `{{this}}` function does not display properly in preview/compile with dbt-server

  </Expandable>

## July 2023

- <Expandable alt_header='Faster runs and unlimited job concurrency for Enterprise account'>

    We’ve introduced significant improvements to the dbt Cloud Scheduler, offering improved performance, durability, and scalability. 

    Read more on how you can experience faster run start execution and how enterprise users can now run as many jobs concurrently as they want to.

    ## Faster run starts

    The Scheduler takes care of preparing each dbt Cloud job to run in your cloud data platform. This [prep](/docs/deploy/job-scheduler#scheduler-queue) involves readying a Kubernetes pod with the right version of dbt installed, setting environment variables, loading data platform credentials, and git provider authorization, amongst other environment-setting tasks. Only after the environment is set up, can dbt execution begin. We display this time to the user in dbt Cloud as “prep time”.

    <Lightbox src="/img/run-start.jpg" width="85%" title="The scheduler prepares a job for execution and displays it as 'prep time' in dbt Cloud."/>

    For all its strengths, Kubernetes has challenges, especially with pod management impacting run execution time. We’ve rebuilt our scheduler by ensuring faster job execution with a ready pool of pods to execute customers’ jobs. This means you won't experience long prep times at the top of the hour, and we’re determined to keep runs starting near instantaneously. Don’t just take our word, review the data yourself.

    <Lightbox src="/img/prep-start.jpg" width="85%" title="Job prep time data has seen a 75% speed improvement from Jan 2023 to July 2023. Prep time took 106 secs in Jan and now takes 27 secs as of July."/>

    Jobs scheduled at the top of the hour used to take over 106 seconds to prepare because of the volume of runs the scheduler has to process. Now, even with increased runs, we have reduced prep time to 27 secs (at a maximum) &mdash; a 75% speed improvement for runs at peak traffic times!

    ## Unlimited job concurrency for Enterprise accounts

    Our enhanced scheduler offers more durability and empowers users to run jobs effortlessly. 

    This means Enterprise, multi-tenant accounts can now enjoy the advantages of unlimited job concurrency. Previously limited to a fixed number of run slots, Enterprise accounts now have the freedom to operate without constraints. Single-tenant support will be coming soon.

    Something to note, each running job occupies a run slot for its duration, and if all slots are occupied, jobs will queue accordingly.

    For more feature details, refer to the [dbt Cloud pricing page](https://www.getdbt.com/pricing/).

    Note, Team accounts created after July 2023 benefit from unlimited job concurrency:
    - Legacy Team accounts have a fixed number of run slots.
    - Both Team and Developer plans are limited to one project each. For larger-scale needs, our [Enterprise plan](https://www.getdbt.com/pricing/) offers features such as audit logging, unlimited job concurrency and projects, and more.

  </Expandable>

## June 2023

- <Expandable alt_header='Lint format'>

    dbt Labs is excited to announce you can now lint and format your dbt code in the dbt Cloud IDE. This is an enhanced development workflow which empowers you to effortlessly prioritize code quality. 

    You can perform linting and formatting on five different file types: SQL, YAML, Markdown, Python, and JSON. 

    For SQL files, you can easily lint and format your code using [SQLFluff](https://sqlfluff.com/) and apply consistent formatting using [sqlfmt](http://sqlfmt.com/). Additionally, for other file types like YAML, Markdown, JSON, and Python, you can utilize the respective tools powered by [Prettier](https://prettier.io/) and [Black](https://black.readthedocs.io/en/latest/) to ensure clean and standardized code formatting.

    For more info, read [Lint and format your code](/docs/cloud/dbt-cloud-ide/lint-format).

    <DocCarousel slidesPerView={1}>

    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/sqlfluff.gif" width="100%" title="Use SQLFluff to lint/format your SQL code, and view code errors in the Code Quality tab."/>

    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/sqlfmt.gif" width="95%" title="Use sqlfmt to format your SQL code."/>

    <Lightbox src="/img/docs/dbt-cloud/cloud-ide/prettier.gif" width="95%" title="Format YAML, Markdown, and JSON files using Prettier."/>

    </DocCarousel>

  </Expandable>

- <Expandable alt_header='CI updates'>

    dbt Cloud CI is a critical part of the analytics engineering workflow. Large teams rely on process to ensure code quality is high, and they look to dbt Cloud CI to automate testing code changes in an efficient way, enabling speed while keep the bar high. With status checks directly posted to their dbt PRs, developers gain the confidence that their code changes will work as expected in production, and once you’ve grown accustomed to seeing that green status check in your PR, you won’t be able to work any other way.

    <Lightbox src="/img/docs/release-notes/ci-checks.png" width="75%" title="CI checks directly from within Git"/>

    What separates dbt Cloud CI from other CI providers is its ability to keep track of state of what’s running in your production environment, so that when you run a CI job, only the modified data assets in your pull request and their downstream dependencies get built and tested in a staging schema. dbt Cloud aims to make each CI check as efficient as possible, so as to not waste any data warehouse resources. As soon as the CI run completes, its status posts directly back to the PR in GitHub, GitLab, or Azure DevOps, depending on which Git provider you’re using. Teams can set up guardrails to let only PRs with successful CI checks be approved for merging, and the peer review process is greatly streamlined because dbt Cloud does the first testing pass. 

    We're excited to introduce a few critical capabilities to dbt Cloud CI that will improve productivity and collaboration in your team’s testing and integration workflow. As of this week, you can now:

    - **Run multiple CI checks in parallel**. If more than one contributor makes changes to the same dbt project in dbt Cloud in short succession, the later arriving CI check no longer has to wait for the first check to complete. Both checks will execute concurrently.

    - **Automatically cancel stale CI runs**. If you push multiple commits to the same PR, dbt Cloud will cancel older, now-out-of-date CI checks automatically. No resources wasted on checking stale code.

    - **Run CI checks without blocking production runs**. CI checks will no longer consume run slots, meaning you can have as many CI checks running as you want, without impeding your production jobs.

    To learn more, refer to [Continuous integration](/docs/deploy/continuous-integration) and [CI jobs](/docs/deploy/ci-jobs).

  </Expandable>

- <Expandable alt_header='Admin API'>

    dbt Labs updated the docs for the [dbt Cloud Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) and they are now available for both [v2](/dbt-cloud/api-v2#/) and [v3](/dbt-cloud/api-v3#/). 

    - Now using Spotlight for improved UI and UX.
    - All endpoints are now documented for v2 and v3. Added automation to the docs so they remain up to date.  
    - Documented many of the request and response bodies.
    - You can now test endpoints directly from within the API docs. And, you can choose which [regional server](/docs/cloud/about-cloud/access-regions-ip-addresses) to use (North America, APAC, or EMEA).
    - With the new UI, you can more easily generate code for any endpoint.

  </Expandable>

- <Expandable alt_header='Product docs updates'>
    
    Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! First, we’d like to thank the 17 new community contributors to docs.getdbt.com &mdash; ✨ @aaronbini, @sjaureguimodo, @aranke, @eiof, @tlochner95, @mani-dbt, @iamtodor, @monilondo, @vrfn, @raginjason, @AndrewRTsao, @MitchellBarker, @ajaythomas, @smitsrr, @leoguyaux, @GideonShils, @michaelmherrera!

    Here's what's new to [docs.getdbt.com](http://docs.getdbt.com/) in June:

    ## ☁ Cloud projects

    - We clarified the nuances of [CI and CI jobs](/docs/deploy/continuous-integration), updated the [Scheduler content](/docs/deploy/job-scheduler), added two new pages for the job settings and run visibility, moved the project state page to the [Syntax page](/reference/node-selection/syntax), and provided a landing page for [Deploying with Cloud](/docs/deploy/jobs) to help readers navigate the content better.
    - We reformatted the [Supported data platforms page](/docs/supported-data-platforms) by adding dbt Cloud to the page, splitting it into multiple pages, using cards to display verified adapters, and moving the [Warehouse setup pages](/docs/core/connect-data-platform/about-core-connections) to the Docs section. 
    - We launched a new [Lint and format page](/docs/cloud/dbt-cloud-ide/lint-format), which highlights the awesome new dbt Cloud IDE linting/formatting function.
    - We enabled a connection between [dbt Cloud release notes](/docs/dbt-versions/dbt-cloud-release-notes) and the dbt Slack community. This means new dbt Cloud release notes are automatically sent to the slack community [#dbt-cloud channel](https://getdbt.slack.com/archives/CMZ2V0X8V) via RSS feed, keeping users up to date with changes that may affect them. 
    - We’ve added two new docs links in the dbt Cloud Job settings user interface (UI). This will provide additional guidance and help users succeed when setting up a dbt Cloud job: [job commands](/docs/deploy/job-commands) and job triggers.    
    - We added information related to the newly created [IT license](/docs/cloud/manage-access/about-user-access#license-based-access-control), available for Team and Enterprise plans. 
    - We added a new [Supported browser page](/docs/cloud/about-cloud/browsers), which lists the recommended browsers for dbt Cloud.
    - We launched a new page informing users of [new Experimental features option](/docs/dbt-versions/experimental-features) in dbt Cloud.
    - We worked with dbt Engineering to help publish new beta versions of the dbt [dbt Cloud Administrative API docs](/docs/dbt-cloud-apis/admin-cloud-api). 

    ## 🎯 Core projects

    - We launched the new [MetricFlow docs](/docs/build/build-metrics-intro) on dbt Core v1.6 beta.
    - Split [Global configs](/reference/global-configs/about-global-configs) into individual pages, making it easier to find, especially using search. 

    ## New 📚 Guides, ✏️ blog posts, and FAQs

    - Add an Azure DevOps example in the [Customizing CI/CD with custom pipelines](/guides/custom-cicd-pipelines) guide.

  </Expandable>

## May 2023

- <Expandable alt_header='dbt Cloud IDE'>

    To continue improving your [Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) development experience, the dbt Labs team continues to work on adding new features, fixing bugs, and increasing reliability ✨.

    Stay up-to-date with [IDE-related changes](/tags/ide).

    ## New features 

    - Lint via SQL Fluff is now available in beta (GA over the next 2-3 weeks)
    - Format markdown files with prettier
    - Leverage developer experience shortcuts, including ``Ctrl + ` `` (toggle history drawer), `CMD + Option + /` (toggle block comment), `CMD + Shift + P` (open command palette), `Option + W` (close editor tab)
    - Display parent folder name for files with same name in Changes section
    - Navigate the new IDE features quickly using [the IDE User Interface](/docs/cloud/dbt-cloud-ide/ide-user-interface) help page
    - Use `top X` in SQL when previewing in the IDE
    - Opt into the new IDE backend layer over the past month (still with dbt-rpc). Ready for beta later in June!

    ## Product refinements 

    - Performance-related upgrades:
        - Reduced cold start time by 60+%
        - Improved render time of modals in the IDE by 98%
        - Improved IDE performance with dbt Core v1.5+ (faster and snappier – highly encourage you to [upgrade your dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud)!)
    - Upgraded sqlfmt (which powers the Format button) to 0.18.0
    - Updated Build button to change menu options based on file/model type (snapshot, macro, etc.)
    - Display message to disable adblocker for file contents error
    - Moved Format button to console bar
    - Made many security enhancements in the IDE

    ## Bug fixes

    - File icon sizes no longer get wonky in small screen
    - Toast notifications no longer take over command bar menu
    - Hover info inside the text editor no longer gets cut off
    - Transition between a file and a recently modified scratchpad no longer triggers a console error
    - dbt v1.5+ now can access the IDE
    - Confirm button on the Unsaved Changes modal now closes after clicking it
    - Long node names no longer overflow in the parsed logs section in history drawer
    - Status pill in history drawer no longer scales with longer command
    - Tooltip for tab name with a long file name is no longer cut off
    - Lint button should no longer available in main branch

  </Expandable>

- <Expandable alt_header='Run history improvements'>

    New usability and design improvements to the **Run History** dashboard in dbt Cloud are now available. These updates allow people to discover the information they need more easily by reducing the number of clicks, surfacing more relevant information, keeping people in flow state, and designing the look and feel to be more intuitive to use.   

    <Lightbox src="/img/docs/release-notes/run-history-improvements.gif" title="Improvements to Run History in dbt Cloud" />

    Highlights include:

    - Usability improvements for CI runs with hyperlinks to the branch, PR, and commit SHA, along with more discoverable temporary schema names
    - Preview of runs' error messages on hover
    - Hyperlinks to the environment
    - Better iconography on run status
    - Clearer run trigger cause (API, scheduled, pull request, triggered by user)
    - More details on the schedule time on hover
    - Run timeout visibility

    dbt Labs is making a change to the metadata retrieval policy for Run History in dbt Cloud. 

    **Beginning June 1, 2023,** developers on the dbt Cloud multi-tenant application will be able to self-serve access to their account’s run history through the dbt Cloud user interface (UI) and API for only 365 days, on a rolling basis. Older run history will be available for download by reaching out to Customer Support. We're seeking to minimize the amount of metadata we store while maximizing application performance. 

    Specifically, all `GET` requests to the dbt Cloud [Runs endpoint](https://docs.getdbt.com/dbt-cloud/api-v2#/operations/List%20Runs) will return information on runs, artifacts, logs, and run steps only for the past 365 days.  Additionally, the run history displayed in the dbt Cloud UI will only show runs for the past 365 days.  

    <Lightbox src="/img/docs/dbt-cloud/rn-run-history.jpg" width="100%" title="The dbt Cloud UI displaying a Run History"/>

    We will retain older run history in cold storage and can make it available to customers who reach out to our Support team. To request older run history info, contact the Support team at [support@getdbt.com](mailto:support@getdbt.com) or use the dbt Cloud application chat by clicking the `?` icon in the dbt Cloud UI. 

  </Expandable>
 
- <Expandable alt_header='Run details and log improvements'>

    New usability and design improvements to the run details and logs in dbt Cloud are now available. The ability to triage errors in logs is a big benefit of using dbt Cloud's job and scheduler functionality. The updates help make the process of finding the root cause much easier.
        
    Highlights include:
    - Surfacing a warn state on a run step
    - Search in logs
    - Easier discoverability of errors and warnings in logs
    - Lazy loading of logs, making the whole run details page load faster and feel more performant
    - Cleaner look and feel with iconography
    - Helpful tool tips

    <Lightbox src="/img/docs/release-notes/run-details-and-logs-improvements.gif" title="Improvements to run details and logs in dbt Cloud" />

  </Expandable>

- <Expandable alt_header='Product docs updates'>

    Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! First, we’d like to thank the 13 new community contributors to docs.getdbt.com!

    Here's what's new to [docs.getdbt.com](http://docs.getdbt.com/) in May:

    ## 🔎 Discoverability

    - We made sure everyone knows that Cloud-users don’t need a [profiles.yml file](/docs/core/connect-data-platform/profiles.yml) by adding a callout on several key pages.
    - Fleshed out the [model jinja variable page](/reference/dbt-jinja-functions/model), which originally lacked conceptual info and didn’t link to the schema page.
    - Added a new [Quickstarts landing page](/guides). This new format sets up for future iterations that will include filtering! But for now, we are excited you can step through quickstarts in a focused way.

    ## Cloud projects

    - We launched [dbt Cloud IDE user interface doc](/docs/cloud/dbt-cloud-ide/ide-user-interface), which provides a thorough walkthrough of the IDE UI elements and their definitions.
    - Launched a sparkling new [dbt Cloud Scheduler page](/docs/deploy/job-scheduler) ✨! We went from previously having little content around the scheduler to a subsection that breaks down the awesome scheduler features and how it works.
    - Updated the [dbt Cloud user license page](/docs/cloud/manage-access/seats-and-users#licenses) to clarify how to add or remove cloud users.
    - Shipped these Discovery API docs to coincide with the launch of the Discovery API:
      - [About the Discovery API](/docs/dbt-cloud-apis/discovery-api)
      - [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
      - [Query the Discovery API](/docs/dbt-cloud-apis/discovery-querying)

    ## 🎯 Core projects

    - See what’s coming up [in Core v 1.6](https://github.com/dbt-labs/docs.getdbt.com/issues?q=is%3Aissue+label%3A%22dbt-core+v1.6%22)!
    - We turned the `profiles.yml` [page](/docs/core/connect-data-platform/profiles.yml) into a landing page, added more context to profile.yml page, and moved the ‘About CLI’ higher up in the `Set up dbt` section.

    ## New 📚 Guides, ✏️ blog posts, and FAQs

    If you want to contribute to a blog post, we’re focusing on content

    - Published a blog post: [Accelerate your documentation workflow: Generate docs for whole folders at once](/blog/generating-dynamic-docs-dbt)
    - Published a blog post: [Data engineers + dbt v1.5: Evolving the craft for scale](/blog/evolving-data-engineer-craft)
    - Added an [FAQ](/faqs/Warehouse/db-connection-dbt-compile) to clarify the common question users have on *Why does dbt compile needs to connect to the database?*
    - Published a [discourse article](https://discourse.getdbt.com/t/how-to-configure-external-user-email-notifications-in-dbt-cloud/8393) about configuring job notifications for non-dbt Cloud users

  </Expandable>

## April 2023

- <Expandable alt_header='dbt Cloud IDE'>

    ## New features 

    * New warning message suggests you invoke `dbt deps` when it's needed (as informed by `dbt-score`).
    * New warning message appears when you select models but don't save them before clicking **Build** or invoking dbt (like, dbt build/run/test). 
    * Previews of Markdown and CSV files are now available in the IDE console.
    * The file tree menu now includes a Duplicate File option.
    * Display loading time when previewing a model

    ## Product refinements 

    * Enhance autocomplete experience which has performed slowly for people with large projects and who implement a limit to max `manifest.json` for this feature
    * Introduce pagination for invocation node summary view (displaying 100 nodes at a time)
    * Improve rendering for the Changes / Version Control section of the IDE
    * Update icons to be consistent in dbt Cloud
    * Add table support to the Markdown preview
    * Add the lineage tab back to seed resources in the IDE
    * Implement modal priority when there are multiple warning modals
    * Improve a complex command's description in the command palette

    ## Bug fixes

    * File tree no longer collapses on first click when there's a project subdirectory defined
    * **Revert all** button now works as expected
    * CSV preview no longer fails with only one column
    * Cursor and scroll bar location are now persistent with their positions
    * `git diff` view now shows just change diffs and no longer shows full diff (as if file is new) until page refreshes
    * ToggleMinimap Command no longer runs another Command at the same time
    * `git diff` view no longer shows infinite spins in specific scenarios (new file, etc.)
    * File contents no longer get mixed up when using diff view and one file has unsaved changes
    * YML lineage now renders model without tests (in dbt Core v1.5 and above)
    * Radio buttons for **Summary** and **Details** in the logs section now consistently update to show the accurate tab selection
    * IDE no longer throws the console error `Error: Illegal argument` and redirects to the `Something went wrong` page

  </Expandable>

- <Expandable alt_header='API updates'>

    Starting May 15, 2023, we will support only the following `order_by` functionality for the List Runs endpoint:

    - `id` and `-id`
    - `created_at` and `-created_at`
    - `finished_at` and `-finished_at`

    We recommend that you change your API requests to https://&lt;YOUR_ACCESS_URL&gt;/api/v2/accounts/\{accountId\}/runs/ to use a supported `order_by` before this date. 

    :::info Access URLs
 
    dbt Cloud is hosted in multiple regions around the world, and each region has a different access URL. Users on Enterprise plans can choose to have their account hosted in any one of these regions. For a complete list of available dbt Cloud access URLs, refer to [Regions & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).  

    :::

    For more info, refer to our [documentation](https://docs.getdbt.com/dbt-cloud/api-v2#/operations/List%20Runs).

  </Expandable>

- <Expandable alt_header='Scheduler optmization'>

    The dbt Cloud Scheduler now prevents queue clog by canceling unnecessary runs of over-scheduled jobs. 

    The duration of a job run tends to grow over time, usually caused by growing amounts of data in the warehouse. If the run duration becomes longer than the frequency of the job’s schedule, the queue will grow faster than the scheduler can process the job’s runs, leading to a runaway queue with runs that don’t need to be processed.

    Previously, when a job was in this over-scheduled state, the scheduler would stop queuing runs after 50 were already in the queue. This led to a poor user experience where the scheduler canceled runs indiscriminately. You’d have to log into dbt Cloud to manually cancel all the queued runs and change the job schedule to "unclog" the scheduler queue.

    Now, the dbt Cloud scheduler detects when a scheduled job is set to run too frequently and appropriately cancels runs that don’t need to be processed. Specifically, scheduled jobs can only ever have one run of the job in the queue, and if a more recent run gets queued, the early queued run will get canceled with a helpful error message. Users will still need to either refactor the job so it runs faster or change the job schedule to run less often if the job often gets into an over-scheduled state.

  </Expandable>

- <Expandable alt_header='Starburst adapter GA'>

    The Starburst (Trino compatible) connection is now generally available in dbt Cloud. This means you can now use dbt Cloud to connect with Starburst Galaxy, Starburst Enterprise, and self-hosted Trino. This feature is powered by the [`dbt-trino`](https://github.com/starburstdata/dbt-trino) adapter. To learn more, check out our Quickstart guide for [dbt Cloud and Starburst Galaxy](https://docs.getdbt.com/guides/starburst-galaxy).

  </Expandable>

- <Expandable alt_header='Product docs updates'>

    Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! We want to share some highlights introduced to docs.getdbt.com in the last month:

    ## 🔎 Discoverability

    - [API docs](/docs/dbt-cloud-apis/overview) now live in the left sidebar to improve discoverability.
    - [The deploy dbt jobs sidebar](/docs/deploy/deployments) has had a glow up 💅 that splits the ‘about deployment’ into two paths (deploy w dbt cloud and deploy w other tools), adds more info about the dbt cloud scheduler, its features, and how to create a job, adds ADF deployment guidance. We hope the changes improve the user experience and provide users with guidance when deploying with other tools.

    ## ☁ Cloud projects

    - Added Starburst/Trino adapter docs, including:
  * [dbt Cloud quickstart guide](/guides/starburst-galaxy), 
  * [connection page](/docs/cloud/connect-data-platform/connect-starburst-trino), 
  * [set up page](/docs/core/connect-data-platform/trino-setup), and [config page](/reference/resource-configs/trino-configs). 
    - Enhanced [dbt Cloud jobs page](/docs/deploy/jobs) and section to include conceptual info on the queue time, improvements made around it, and about failed jobs. 
    - Check out the April dbt [Cloud release notes](/docs/dbt-versions/dbt-cloud-release-notes)

    ## 🎯 Core projects 

    - Clearer descriptions in the [Jinja functions page](/reference/dbt-jinja-functions), that improve content for each card. 
    - [1.5 Docs](/docs/dbt-versions/core-upgrade/upgrading-to-v1.5) have been released as an RC! 
    - See the beautiful [work captured in Core v 1.5](https://github.com/dbt-labs/docs.getdbt.com/issues?q=is%3Aissue+label%3A%22dbt-core+v1.5%22+is%3Aclosed).

    ## New 📚 Guides and ✏️ blog posts

    - [Use Databricks workflows to run dbt Cloud jobs](/guides/how-to-use-databricks-workflows-to-run-dbt-cloud-jobs)
    - [Refresh Tableau workbook with extracts after a job finishes](/guides/zapier-refresh-tableau-workbook)
    - [dbt Python Snowpark workshop/tutorial](/guides/dbt-python-snowpark)
    - [How to optimize and troubleshoot dbt Models on Databricks](/guides/optimize-dbt-models-on-databricks)
    - [The missing guide to debug() in dbt](/blog/guide-to-jinja-debug)
    - [dbt Squared: Leveraging dbt Core and dbt Cloud together at scale](/blog/dbt-squared)
    - [Audit_helper in dbt: Bringing data auditing to a higher level](/blog/audit-helper-for-migration)

  </Expandable>

## March 2023

- <Expandable alt_header='dbt v1.0 deprecation'>

    dbt Cloud now requires dbt version 1.0 or later. As of March 1, 2023, we removed all instances of older dbt versions from dbt Cloud. 
    
    Any environments or jobs configured with a dbt version lower than 1.0 were automatically updated to dbt v1.4, which is the latest minor version available on dbt Cloud.

    For more info on dbt versions, releases, and dbt Cloud support timeline, refer to [About dbt Core versions](/docs/dbt-versions/core#latest-releases).

    Refer to some additional info and resources to help you upgrade your dbt version:

    - [How to upgrade dbt without fear](https://docs.getdbt.com/blog/upgrade-dbt-without-fear) 
    - [Upgrade Q&A on breaking changes](/docs/dbt-versions/upgrade-dbt-version-in-cloud#upgrading-legacy-versions-under-10)
    - [Version migration guides](/docs/dbt-versions/core-upgrade)

  </Expandable>

- <Expandable alt_header='dbt Cloud IDE'>

    To continue improving your [Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) development experience, the dbt Labs team continue to work on adding new features, fixing bugs, and increasing reliability ✨.

    Read more about the [upcoming improvements to the Cloud IDE](https://www.getdbt.com/blog/improvements-to-the-dbt-cloud-ide/) and stay up-to-date with [IDE-related changes](https://docs.getdbt.com/tags/ide).

    ## New features 

    - Commit and revert individual files under **Version Control**.
    - Use the [command palette](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud#cloud-ide-features) to invoke common complex dbt commands, such as resuming from the last failure.
    - Create PRs even when there are uncommitted changes (under the **git** dropdown).
    - The IDE will display more autocomplete suggestions when editing a YML file, powered by [dbt-jsonschema](https://github.com/dbt-labs/dbt-jsonschema).
    - The file tree now has additional options in the right-click menu, such as Copy model as ref or Copy file path.
    - The DAG view has been adjusted to a default of `2+model+2`.
    - A lineage selector has been implemented in the DAG/lineage sub-tab.
    - Edit directly in the git diff view located in the right pane.
    - A warning message will now appear when users press Command-W/Control-W when there are unsaved changes.
    - A new onboarding flow guide is now available.

    ## Product refinements 

    - The DAG selector now uses `name` instead of `file_uri` to build selectors.
    - The DAG is now vertically centered under the new Selector Input element 
    - sqlfmt has been upgraded to v0.17.0.
    - When the Format button fails, a toast notification will display a syntax error.
    - The editor now has the option to toggle minimap/word-wrap via right-click.
    - The history drawer displays elapsed time in real-time and s/m/h increments.
    - When deleting development environments, the delete modal will now warn users that any uncommitted changes will be lost.
    - The context for the Git button has been adjusted to show that it will link to an external site (such as GitHub or GitLab) when users create a pull request.

    ## Bug fixes

    - The IDE now displays an error message when the git repository is not reachable. Previously, it failed silently.
    - The kebab menu is now visible when the invocation history drawer is open. Previously, it wasn't showing.
    - DAGs are now updated/populated consistently. Previously, it occasionally failed.
    - The purple highlight for DAG selection is now consistent across files. Previously, it was inconsistent.
    - Users can now rename files back to their original name. Previously, this wasn't possible.
    - The link to the IDE from the project setup page has been corrected.
    - The IDE no longer has issues with single-space file names.
    - Adding invalid characters in the sub-directory config no longer causes the IDE to fail.
    - YML autocomplete triggers consistently now. Previously, it occasionally didn't trigger.
    - Reverting single files now reloads the file contents in the tab. Previously, it didn't reload.
    - The file tree no longer collapses on the first click when there is a project subdirectory defined.

  </Expandable>

- <Expandable alt_header='API updates'>

    To make the API more scalable and reliable, we've implemented a maximum limit of `100` for all API requests to our `list` endpoints. If API requests exceed the maximum limit parameter of `100`, a user will receive an API error message.

    This maximum limit applies to [multi-tenant instances](/docs/cloud/about-cloud/access-regions-ip-addresses) only, and _does not_ apply to single tenant instances.

    Refer to the [Pagination](https://docs.getdbt.com/dbt-cloud/api-v2#/) section of the overview for more information on this change. 

    </Expandable>

## Feb 2023

- <Expandable alt_header='Disable partial parsing in job commands'>

    You can now use the `--no-partial-parse` flag to disable partial parsing in your dbt Cloud job commands. 

    Previously, the [`--no-partial-parse` global config](/reference/global-configs/parsing) was only available in dbt Core. For more information, refer to [partial parsing](/reference/parsing#partial-parsing).

  </Expandable>

- <Expandable alt_header='dbt Cloud IDE'>

    To continue improving our [Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) experience, the dbt Labs team worked on fixing bugs, increasing reliability, and adding new features ✨.

    Learn more about the [February changes](https://getdbt.slack.com/archives/C03SAHKKG2Z/p1677605383451109). 

    ## New features 

    - Support for custom node colors in the IDE DAG visualization
    - Ref autocomplete includes models from seeds and snapshots
    - Prevent menus from getting cropped (git controls dropdown, file tree dropdown, build button, editor tab options)
    - Additional option to access the file menu by right-clicking on the files and folders in the file tree
    - Rename files by double-clicking on files in the file tree and the editor tabs
    - Right-clicking on file tabs has new options and will now open at your cursor instead of in the middle of the tab
    - The git branch name above **Version Control** links to the repo for specific git providers
      - Currently available for all [multi-tenant](/docs/cloud/about-cloud/access-regions-ip-addresses) instances using GitHub or GitLab providers 

    ## Product refinements 

    - Added an error modal for RPC parsing errors when users attempt to invoke dbt commands (preview, compile, or general dbt invocations) 
    - Enabled syntax highlighting for Jinja expression and statement delimiters
    - Clarified and renamed the options under the **Build** button 
    - Changed the term for RPC status from `Compiling` to `Parsing` to match dbt-core construct
    - Implemented a new File Tree component to improve render time by 60%
    - Disabled the Local Storage of File Tree to prevent users from running into max LocalStorage issue for large projects
    - Changed snapshot snippet template (`__snapshot`) to a select from source

    ## Bug fixes

    - You no longer have file contents carrying over when you switch to a different project that has the same file name
    - The preview max limit no longer allows you to override the maximum 
    - You no longer encounter node statuses failing to update in the history drawer for those on version 1.4 core. (This is a partial fix that may be fully addressed by core version 1.5)
    - You can now use the **Copy File Name** option to copy up to the last dot, rather than the first dot
    - You can now use the `--no-partial-parse` flag to disable partial parsing in your dbt Cloud job commands. 
    - Previously, the [`--no-partial-parse` global config](/reference/global-configs/parsing) was only available in dbt Core. For more information, refer to [partial parsing](/reference/parsing#partial-parsing).

  </Expandable>

## January 2023

- <Expandable alt_header='dbt Cloud IDE'>

    In the spirit of continuing to improve our [Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud) experience, the dbt Labs team worked on fixing bugs, increasing reliability, and adding new features ✨.

    Learn more about the [January changes](https://getdbt.slack.com/archives/C03SAHKKG2Z/p1675272600286119) and what's coming soon.

    ## New features 

    - Improved syntax highlighting within the IDE for better Jinja-SQL combination (double quotes now show proper syntax highlight!)
    - Adjusted the routing URL for the IDE page and removed the `next` from the URL
    - Added a *new* easter egg within the IDE 🐶🦆

    ## Product refinements 

    - Performance improvements and reduced IDE slowness. The IDE should feel faster and snappier.
    - Reliability improvements – Improved error handling that previously put IDE in a bad state
    - Corrected the list of dropdown options for the Build button
    - Adjusted startup page duration
    - Added code snippets for `unique` and `not_null` tests for yml files
    - Added code snippets for metrics based on environment dbt versions
    - Changed “commit and push” to “commit and sync” to better reflect the action
    - Improved error message when saving or renaming files to duplicate names

    ## Bug fixes

    - You no longer arbitrarily encounter an `RPC server got an unknown async ID` message
    - You can now see the build button dropdown, which had been hidden behind the placeholder DAG screen
    - You can now close toast notifications for command failure when the history drawer is open
    - You no longer encounter a `Something went wrong` message when previewing a model
    - You can now see repository status in the IDE, and the IDE finds the SSH folder
    - Scroll bars and download CSV no longer flicker within the preview pane

  </Expandable>
