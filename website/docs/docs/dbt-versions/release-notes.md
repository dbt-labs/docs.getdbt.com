---
title: "dbt Cloud release notes"
description: "dbt Cloud release notes"
id: "dbt-cloud-release-notes"
sidebar: "dbt Cloud release notes"
pagination_next: null
pagination_prev: null
---

dbt Cloud release notes for recent and historical changes. Release notes fall into one of the following categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by month. For customers using dbt Virtual Private Cloud (VPC), there is a tag for changes available in your versioned release environment.

## May 2024

- <expandable alt_header="New: Keep on latest version" > 

  The **Keep on latest version** setting is now Generally Available (previously Public Preview).

  When the new **Keep on latest version** setting is enabled, you always get the latest fixes and early access to new functionality for your dbt project. dbt Labs will handle upgrades behind-the-scenes, as part of testing and redeploying the dbt Cloud application &mdash; just like other dbt Cloud capabilities and other SaaS tools that you're using. No more manual upgrades and no more need for _a second sandbox project_ just to try out new features in development.

  To learn more about the new setting, refer to [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version) for details. 

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example of the Keep on latest version setting"/>

  </expandable>

- **Behavior change:** Introduced the `require_resource_names_without_spaces` flag, opt-in and disabled by default. If set to `True`, dbt will raise an exception if it finds a resource name containing a space in your project or an installed package. This will become the default in a future version of dbt. Read [No spaces in resource names](/reference/global-configs/legacy-behaviors#no-spaces-in-resource-names) for more information.

## April 2024

- <expandable alt_header="New: Merge jobs" > 

  <Lifecycle status="beta" />

  You can now set up a continuous deployment (CD) workflow for your projects natively in dbt Cloud. You can now access a beta release of [Merge jobs](/docs/deploy/merge-jobs), which is a new [job type](/docs/deploy/jobs), that enables you to trigger dbt job runs as soon as changes (via Git pull requests) merge into production.

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-create-merge-job.png" width="90%" title="Example of creating a merge job"/>

  </expandable>
  
- **Behavior change:** Introduced the `require_explicit_package_overrides_for_builtin_materializations` flag, opt-in and disabled by default. If set to `True`, dbt will only use built-in materializations defined in the root project or within dbt, rather than implementations in packages. This will become the default in May 2024 (dbt Core v1.8 and dbt Cloud "Keep on latest version"). Read [Package override for built-in materialization](/reference/global-configs/legacy-behaviors#package-override-for-built-in-materialization) for more information.

**dbt Semantic Layer**
- **New**: Use Saved selections to [save your query selections](/docs/use-dbt-semantic-layer/gsheets#using-saved-selections) within the [Google Sheets application](/docs/use-dbt-semantic-layer/gsheets). They can be made private or public and refresh upon loading.
- **New**: Metrics are now displayed by their labels as `metric_name`.
- **Enhancement**: [Metrics](/docs/build/metrics-overview) now supports the [`meta` option](/reference/resource-configs/meta) under the [config](/reference/resource-properties/config) property. Previously, we only supported the now deprecated `meta` tag.
- **Enhancement**: In the Google Sheets application, we added [support](/docs/use-dbt-semantic-layer/gsheets#using-saved-queries) to allow jumping off from or exploring MetricFlow-defined saved queries directly.
- **Enhancement**: In the Google Sheets application, we added support to query dimensions without metrics. Previously, you needed a dimension.
- **Enhancement**: In the Google Sheets application, we added support for time presets and complex time range filters such as "between", "after", and "before".
- **Enhancement**: In the Google Sheets application, we added supported to automatically populate dimension values when you select a "where" filter, removing the need to manually type them.  Previously, you needed to manually type the dimension values.
- **Enhancement**: In the Google Sheets application, we added support to directly query entities, expanding the flexibility of data requests.
- **Enhancement**: In the Google Sheets application, we added an option to exclude column headers, which is useful for populating templates with only the required data.
- **Deprecation**: For the Tableau integration, the [`METRICS_AND_DIMENSIONS` data source](/docs/use-dbt-semantic-layer/tableau#using-the-integration) has been deprecated for all accounts not actively using it. We encourage users to transition to the "ALL" data source for future integrations.

## March 2024

- **New:** The Semantic Layer services now support using Privatelink for customers who have it enabled.
- **New:** You can now develop against and test your Semantic Layer in the Cloud CLI if your developer credential uses SSO.
- **Enhancement:** You can select entities to Group By, Filter By, and Order By.
- **Fix:** `dbt parse` no longer shows an error when you use a list of filters (instead of just a string filter) on a metric.
- **Fix:** `join_to_timespine` now properly gets applied to conversion metric input measures.
- **Fix:** Fixed an issue where exports in Redshift were not always committing to the DWH, which also had the side-effect of leaving table locks open.
- **Behavior change:** Introduced the `source_freshness_run_project_hooks` flag, opt-in and disabled by default. If set to `True`, dbt will include `on-run-*` project hooks in the `source freshness` command. This will become the default in a future version of dbt. Read [Project hooks with source freshness](/reference/global-configs/legacy-behaviors#project-hooks-with-source-freshness) for more information.


## February 2024

- **New:** [Exports](/docs/use-dbt-semantic-layer/exports#define-exports) allow you to materialize a saved query as a table or view in your data platform. By using exports, you can unify metric definitions in your data platform and query them as you would any other table or view.
- **New:** You can access a list of your [exports](/docs/use-dbt-semantic-layer/exports) with the new list saved-queries command by adding `--show-exports`
- **New:** The dbt Semantic Layer and [Tableau Connector](/docs/use-dbt-semantic-layer/tableau) now supports relative date filters in Tableau.

- <expandable alt_header="New: Use exports to write saved queries">

  You can now use the [exports](/docs/use-dbt-semantic-layer/exports) feature with [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl), allowing you to query reliable metrics and fast data reporting. Exports enhance the saved queries feature, allowing you to write commonly used queries directly within your data platform using dbt Cloud's job scheduler.

  By exposing tables of metrics and dimensions, exports enable you to integrate with additional tools that don't natively connect with the dbt Semantic Layer, such as PowerBI.

  Exports are available for dbt Cloud multi-tenant [Team or Enterprise](https://www.getdbt.com/pricing/) plans on dbt versions 1.7 or newer. Refer to the [exports blog](https://www.getdbt.com/blog/announcing-exports-for-the-dbt-semantic-layer) for more details.

  <Lightbox src="/img/docs/dbt-cloud/semantic-layer/deploy_exports.jpg" width="90%" title="Add an environment variable to run exports in your production run." />

  </expandable>

- <expandable alt_header="New: Trigger on job completion ">

  <Lifecycle status="team,enterprise" />

  Now available for dbt Cloud Team and Enterprise plans is the ability to trigger deploy jobs when other deploy jobs are complete. You can enable this feature [in the UI](/docs/deploy/deploy-jobs) with the  **Run when another job finishes** option in the **Triggers** section of your job or with the [Create Job API endpoint](/dbt-cloud/api-v2#/operations/Create%20Job). 

  When enabled, your job will run after the specified upstream job completes. You can configure which run status(es) will trigger your job. It can be just on `Success` or on all statuses. If you have dependencies between your dbt projects, this allows you to _natively_ orchestrate your jobs within dbt Cloud &mdash; no need to set up a third-party tool.

  An example of the **Triggers** section when creating the job:  

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Example of Triggers on the Deploy Job page"/>

  </expandable>

- <expandable alt_header="New: Keep on latest version ">

  <Lifecycle status='beta' />

  _Now available in the dbt version dropdown in dbt Cloud &mdash; starting with select customers, rolling out to wider availability through February and March._

  When the new **Keep on latest version** setting is enabled, you always get the latest fixes and early access to new functionality for your dbt project. dbt Labs will handle upgrades behind-the-scenes, as part of testing and redeploying the dbt Cloud application &mdash; just like other dbt Cloud capabilities and other SaaS tools that you're using. No more manual upgrades and no more need for _a second sandbox project_ just to try out new features in development.

  To learn more about the new setting, refer to [Keep on latest version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#keep-on-latest-version) for details. 

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-environment-settings.png" width="90%" title="Example of the Keep on latest version setting"/>

  </expandable>


- <expandable alt_header="New: Override dbt version with new User development settings" >

  You can now [override the dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#override-dbt-version) that's configured for the development environment within your project and use a different version &mdash; affecting only your user account. This lets you test new dbt features without impacting other people working on the same project. And when you're satisfied with the test results, you can safely upgrade the dbt version for your project(s).  

  Use the **dbt version** dropdown to specify the version to override with. It's available on your project's credentials page in the **User development settings** section. For example:

  <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" width="60%" title="Example of overriding the dbt version on your user account"/>

  </expandable>

- <expandable alt_header="Enhancement: Edit in primary git branch in IDE">

  You can now edit, format, or lint files and execute dbt commands directly in your primary git branch in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).  This enhancement is available across various repositories, including native integrations, imported git URLs, and managed repos.

  This enhancement is currently available to all dbt Cloud multi-tenant regions and will soon be available to single-tenant accounts.

  The primary branch of the connected git repo has traditionally been _read-only_ in the IDE. This update changes the branch to _protected_ and allows direct edits. When a commit is made, dbt Cloud will prompt you to create a new branch. dbt Cloud will pre-populate the new branch name with the GIT_USERNAME-patch-#; however, you can edit the field with a custom branch name.

  Previously, the primary branch was displayed as read-only, but now the branch is displayed with a lock icon to identify it as protected:

  <DocCarousel slidesPerView={1}>

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/read-only.png" width="75%" title="Previous read-only experience"/>

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/protected.png" width="75%" title="New protected experience"/>

  </DocCarousel>

  When you make a commit while on the primary branch, a modal window will open prompting you to create a new branch and enter a commit message:

  <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/create-new-branch.png" width="75%" title="Create new branch window"/>

  </expandable>

- **Enhancement:**  The dbt Semantic Layer [Google Sheets integration](/docs/use-dbt-semantic-layer/gsheets) now exposes a note on the cell where the data was requested, indicating clearer data requests. The integration also now exposes a new **Time Range** option, which allows you to quickly select date ranges.
- **Enhancement:** The [GraphQL API](/docs/dbt-cloud-apis/sl-graphql) includes a `requiresMetricTime` parameter to better handle metrics that must be grouped by time. (Certain metrics defined in MetricFlow can't be looked at without a time dimension).
- **Enhancement:** Enable querying metrics with offset and cumulative metrics with the time dimension name, instead of `metric_time`. [Issue #1000](https://github.com/dbt-labs/metricflow/issues/1000)
  - Enable querying `metric_time` without metrics. [Issue #928](https://github.com/dbt-labs/metricflow/issues/928)
- **Enhancement:** Added support for consistent SQL query generation, which enables ID generation consistency between otherwise identical MF queries. Previously, the SQL generated by `MetricFlowEngine` was not completely consistent between identical queries. [Issue 1020](https://github.com/dbt-labs/metricflow/issues/1020)
- **Fix:** The Tableau Connector returns a date filter when filtering by dates. Previously it was erroneously returning a timestamp filter.
-  **Fix:** MetricFlow now validates if there are `metrics`, `group by`, or `saved_query` items in each query. Previously, there was no validation. [Issue 1002](https://github.com/dbt-labs/metricflow/issues/1002)
- **Fix:** Measures using `join_to_timespine` in MetricFlow now have filters applied correctly after time spine join.
- **Fix:** Querying multiple granularities with offset metrics:
  - If you query a time offset metric with multiple instances of `metric_time`/`agg_time_dimension`, only one of the instances will be offset. All of them should be.
  - If you query a time offset metric with one instance of `metric_time`/`agg_time_dimension` but filter by a different one, the query will fail.
- **Fix:** MetricFlow prioritizes a candidate join type over the default type when evaluating nodes to join. For example, the default join type for distinct values queries is `FULL OUTER JOIN`, however, time spine joins require `CROSS JOIN`, which is more appropriate.
- **Fix:** Fixed a bug that previously caused errors when entities were referenced in `where` filters.




## January 2024

- <expandable alt_header="January docs updates">

  Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! First, we’d like to thank the 10 new community contributors to docs.getdbt.com :pray: What a busy start to the year! We merged 110 PRs in January.

  Here's how we improved the [docs.getdbt.com](http://docs.getdbt.com/) experience:

  - Added new hover behavior for images
  - Added new expandables for FAQs
  - Pruned outdated notices and snippets as part of the docs site maintenance

  January saw some great new content:

  - New [dbt Mesh FAQs](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-4-faqs) page
  - Beta launch of [Explorer’s column-level lineage](https://docs.getdbt.com/docs/collaborate/column-level-lineage) feature
  - Developer blog posts:
    - [More time coding, less time waiting: Mastering defer in dbt](https://docs.getdbt.com/blog/defer-to-prod)
    - [Deprecation of dbt Server](https://docs.getdbt.com/blog/deprecation-of-dbt-server)
    - From the community: [Serverless, free-tier data stack with dlt + dbt core](https://docs.getdbt.com/blog/serverless-dlt-dbt-stack)
  - The Extrica team added docs for the [dbt-extrica community adapter](https://docs.getdbt.com/docs/core/connect-data-platform/extrica-setup)
  - Semantic Layer: New [conversion metrics docs](https://docs.getdbt.com/docs/build/conversion) and added the parameter `fill_nulls_with` to all metric types (launched the week of January 12, 2024)
  - New [dbt environment command](https://docs.getdbt.com/reference/commands/dbt-environment) and its flags for the dbt Cloud CLI

  January also saw some refreshed content, either aligning with new product features or requests from the community:

  - Native support for [partial parsing in dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud-environments#partial-parsing)
  - Updated guidance on using dots or underscores in the [Best practice guide for models](https://docs.getdbt.com/best-practices/how-we-style/1-how-we-style-our-dbt-models)
  - Updated [PrivateLink for VCS docs](https://docs.getdbt.com/docs/cloud/secure/vcs-privatelink)
  - Added a new `job_runner` role in our [Enterprise project role permissions docs](https://docs.getdbt.com/docs/cloud/manage-access/enterprise-permissions#project-role-permissions)
  - Added saved queries to [Metricflow commands](https://docs.getdbt.com/docs/build/metricflow-commands#list-saved-queries)
  - Removed [as_text docs](https://github.com/dbt-labs/docs.getdbt.com/pull/4726) that were wildly outdated

  </expandable>

- **New:** New metric type that allows you to measure conversion events. For example, users who viewed a web page and then filled out a form. For more details, refer to [Conversion metrics](/docs/build/conversion). 
- **New:** Instead of specifying the fully qualified dimension name (for example, `order__user__country`) in the group by or filter expression, you now only need to provide the primary entity and dimensions name, like `user__county`. 
- **New:** You can now query the [saved queries](/docs/build/saved-queries) you've defined in the dbt Semantic Layer using [Tableau](/docs/use-dbt-semantic-layer/tableau), [GraphQL API](/docs/dbt-cloud-apis/sl-graphql), [JDBC API](docs/dbt-cloud-apis/sl-jdbc), and the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). 

- <expandable alt_header="New: Native support for partial parsing" >

  By default, dbt parses all the files in your project at the beginning of every dbt invocation. Depending on the size of your project, this operation can take a long time to complete. With the new partial parsing feature in dbt Cloud, you can reduce the time it takes for dbt to parse your project. When enabled, dbt Cloud parses only the changed files in your project instead of parsing all the project files. As a result, your dbt invocations will take less time to run.

  To learn more, refer to [Partial parsing](/docs/deploy/deploy-environments#partial-parsing).

  <Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Partial parsing option" />

  </expandable>

- **Enhancement:** The YAML spec parameter `label` is now available for Semantic Layer metrics in [JDBC and GraphQL APIs](/docs/dbt-cloud-apis/sl-api-overview). This means you can conveniently use `label` as a display name for your metrics when exposing them.
- **Enhancement:** Added support for `create_metric: true` for a measure, which is a shorthand to quickly create metrics. This is useful in cases when metrics are only used to build other metrics.
- **Enhancement:** Added support for Tableau parameter filters. You can use the [Tableau connector](docs/use-dbt-semantic-layer/tableau) to create and use parameters with your dbt Semantic Layer data.
- **Enhancement:** Added support to expose `expr` and `agg` for [Measures](/docs/build/measures) in the [GraphQL API](/docs/dbt-cloud-apis/sl-graphql).
- **Enhancement:** You have improved error messages in the command line interface when querying a dimension that is not reachable for a given metric.
- **Enhancement:** You can now query entities using our Tableau integration (similar to querying dimensions). 
- **Enhancement:** A new data source is available in our Tableau integration called "ALL", which contains all semantic objects defined. This has the same information as "METRICS_AND_DIMENSIONS". In the future, we will deprecate "METRICS_AND_DIMENSIONS" in favor of "ALL" for clarity. 

- **Fix:** Support for numeric types with precision greater than 38 (like `BIGDECIMAL`) in BigQuery is now available. Previously, it was unsupported so would return an error.
- **Fix:** In some instances, large numeric dimensions were being interpreted by Tableau in scientific notation, making them hard to use. These should now be displayed as numbers as expected.
- **Fix:** We now preserve dimension values accurately instead of being inadvertently converted into strings. 
- **Fix:** Resolved issues with naming collisions in queries involving multiple derived metrics using the same metric input. Previously, this  could cause a naming collision. Input metrics are now deduplicated, ensuring each is referenced only once.
- **Fix:** Resolved warnings related to using two duplicate input measures in a derived metric. Previously, this would trigger a warning. Input measures are now deduplicated, enhancing query processing and clarity.
- **Fix:** Resolved an error where referencing an entity in a filter using the object syntax would fail. For example, `{{Entity('entity_name')}}` would fail to resolve.
