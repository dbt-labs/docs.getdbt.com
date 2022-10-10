---
title: "About dbt projects"
id: "projects"
---

A dbt project is a directory of `.sql` and `.yml` files that dbt uses to transform your data. At a minimum, a dbt project must contain:

- A project file — A `dbt_project.yml` file tells dbt that a particular directory is a dbt project, and also contains configurations for your project.
- [Models] (**get link from mattshaver**) — A model is a single `.sql` file. Each model contains a single select statement that either transforms raw data into a dataset that is ready for analytics, or, more often, is an intermediate step in such a transformation.

A dbt project may also contain a number of other resources such as:

| Resource  | Description  |
| :--- | :--- |
| [sources](/docs/build/sources) | A way to name and describe the data loaded into your warehouse by your Extract and Load tools. |
| [tests](/docs/build/tests) | SQL queries that you can write to test the models and resources in your project. |
| [documentation](/docs/collaborate/documentation) | Docs for your project that you can build. |
| [snapshots](/docs/build/snapshots) | A way to capture the state of your mutable tables so you can refer to it later. |
| [seeds](/docs/build/seeds) | CSV files with static data that you can load into your data platform with dbt. |
| [macros](/docs/build/jinja-macros) | Blocks of code that you can reuse multiple times. |
| [exposures](/docs/build/exposures) | A way to define and describe a downstream use of your project. |
| [metrics](/docs/build/metrics) | A way for you to define metrics for your project. |
| [analysis](/docs/build/analyses) | A way to organize analytical SQL queries in your project such as the general ledger from your QuickBooks. |

## Project configuration
Every dbt project includes a `dbt_project.yml` file. This is where you can set up common project configurations such as:

- project [name](https://docs.getdbt.com/reference/project-configs/name) — Your project’s name in [snake case](https://en.wikipedia.org/wiki/Snake_case).
- [profile](https://docs.getdbt.com/reference/project-configs/profile) — The profile dbt uses to connect to your data platform.
- Any other *common or popular* configs we should put here?

For more details on project configurations, see [dbt_project.yml](https://docs.getdbt.com/reference/dbt_project.yml) .

## New projects

You can create new projects. And, you can [share these projects] (**get link for new overview page**) with other people by making them available on a hosted git repository like GitHub, GitLab, or BitBucket.

After you set up a connection with your data platform, you can [initialize your new project](https://docs.getdbt.com/guides/getting-started/getting-set-up/setting-up-bigquery#initialize-your-dbt-project) and start developing. If you are working from the command line, you can run [`dbt init`](/reference/commands/init) to set up your new project.

With project initialization, dbt creates sample model files in your project to help you start developing quickly.

## Existing projects

You can work on projects that you’ve created or someone else has created. The project must be checked in to a hosted git repository that you have access to.

If your organization has a [dbt Cloud](https://www.getdbt.com/product/dbt-cloud-enterprise/) account, ask your admin to add you as a **Developer** so you can start developing with it. If you don’t have access to dbt Cloud, you can clone the repository to your computer and start developing from the command line.

## Sample project

You can `checkout` dbt Lab’s [Jaffle shop repo](https://github.com/dbt-labs/jaffle_shop_duckdb) on GitHub if you want to explore dbt more. It contains default configurations as well as helpful notes.

## Related docs

- [Best practices for dbt projects](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview)
- [Get started with dbt Cloud](https://docs.getdbt.com/guides/getting-started)
- [Get started with dbt Core](https://docs.getdbt.com/guides/getting-started/learning-more/getting-started-dbt-core)

## FAQs

<FAQ src="Project/project-name" />
<FAQ src="Project/structure-a-project" />
