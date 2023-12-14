---
title: "About dbt projects"
id: "projects"
pagination_next: null
pagination_prev: null
---

A dbt project informs dbt about the context of your project and how to transform your data (build your data sets). By design, dbt enforces the top-level structure of a dbt project such as the `dbt_project.yml` file, the `models` directory, the `snapshots` directory, and so on. Within the directories of the top-level, you can organize your project in any way that meets the needs of your organization and data pipeline.

At a minimum, all a project needs is the `dbt_project.yml` project configuration file. dbt supports a number of different resources, so a project may also include:

| Resource  | Description  |
| :--- | :--- |
| [models](/docs/build/models) | Each model lives in a single file and contains logic that either transforms raw data into a dataset that is ready for analytics or, more often, is an intermediate step in such a transformation. |
| [snapshots](/docs/build/snapshots) | A way to capture the state of your mutable tables so you can refer to it later. |
| [seeds](/docs/build/seeds) | CSV files with static data that you can load into your data platform with dbt. |
| [data tests](/docs/build/data-tests) | SQL queries that you can write to test the models and resources in your project. |
| [macros](/docs/build/jinja-macros) | Blocks of code that you can reuse multiple times. |
| [docs](/docs/collaborate/documentation) | Docs for your project that you can build. |
| [sources](/docs/build/sources) | A way to name and describe the data loaded into your warehouse by your Extract and Load tools. |
| [exposures](/docs/build/exposures) | A way to define and describe a downstream use of your project. |
| [metrics](/docs/build/metrics) | A way for you to define metrics for your project. |
| [groups](/docs/build/groups) | Groups enable collaborative node organization in restricted collections. |
| [analysis](/docs/build/analyses) | A way to organize analytical SQL queries in your project such as the general ledger from your QuickBooks. |

When building out the structure of your project, you should consider these impacts on your organization's workflow:

* **How would people run dbt commands** &mdash; Selecting a path
* **How would people navigate within the project** &mdash; Whether as developers in the IDE or stakeholders from the docs
* **How would people configure the models** &mdash; Some bulk configurations are easier done at the directory level so people don’t have to remember to do everything in a config block with each new model

## Project configuration
Every dbt project includes a project configuration file called `dbt_project.yml`. It defines the directory of the dbt project and other project configurations.

Edit `dbt_project.yml` to set up common project configurations such as:

<div align="center">

| YAML key  | Value description  |
| :--- | :--- |
| [name](/reference/project-configs/name) | Your project’s name in [snake case](https://en.wikipedia.org/wiki/Snake_case) |
| [version](/reference/project-configs/version) | Version of your project |
| [require-dbt-version](/reference/project-configs/require-dbt-version) | Restrict your project to only work with a range of [dbt Core versions](/docs/dbt-versions/core) |
| [profile](/reference/project-configs/profile) | The profile dbt uses to connect to your data platform |
| [model-paths](/reference/project-configs/model-paths) | Directories to where your model and source files live  |
| [seed-paths](/reference/project-configs/seed-paths) | Directories to where your seed files live |
| [test-paths](/reference/project-configs/test-paths) | Directories to where your test files live |
| [analysis-paths](/reference/project-configs/analysis-paths) | Directories to where your analyses live |
| [macro-paths](/reference/project-configs/macro-paths) | Directories to where your macros live |
| [snapshot-paths](/reference/project-configs/snapshot-paths) | Directories to where your snapshots live |
| [docs-paths](/reference/project-configs/docs-paths) | Directories to where your docs blocks live |
| [vars](/docs/build/project-variables) | Project variables you want to use for data compilation |

</div>

For complete details on project configurations, see [dbt_project.yml](/reference/dbt_project.yml).

## Project subdirectories

You can use the Project subdirectory option in dbt Cloud to specify a subdirectory in your git repository that dbt should use as the root directory for your project. This is helpful when you have multiple dbt projects in one repository or when you want to organize your dbt project files into subdirectories for easier management.

To use the Project subdirectory option in dbt Cloud, follow these steps:

1. Click on the cog icon on the upper right side of the page and click on **Account Settings**.

2. Under **Projects**, select the project you want to configure as a project subdirectory.

3. Select **Edit** on the lower right-hand corner of the page.

4. In the **Project subdirectory** field, add the name of the subdirectory. For example, if your dbt project files are located in a subdirectory called `<repository>/finance`, you would enter `finance` as the subdirectory. 

    * You can also reference nested subdirectories. For example, if your dbt project files are located in `<repository>/teams/finance`, you would enter `teams/finance` as the subdirectory. **Note**: You do not need a leading or trailing `/` in the Project subdirectory field. 

5. Click **Save** when you've finished.

After configuring the Project subdirectory option, dbt Cloud will use it as the root directory for your dbt project. This means that dbt commands, such as `dbt run` or `dbt test`, will operate on files within the specified subdirectory. If there is no `dbt_project.yml` file in the Project subdirectory, you will be prompted to initialize the dbt project.

## New projects

You can create new projects and [share them](/docs/collaborate/git-version-control) with other people by making them available on a hosted git repository like GitHub, GitLab, and BitBucket.

After you set up a connection with your data platform, you can [initialize your new project in dbt Cloud](/guides) and start developing. Or, run [dbt init from the command line](/reference/commands/init) to set up your new project.

During project initialization, dbt creates sample model files in your project directory to help you start developing quickly.

## Sample projects

If you want to explore dbt projects more in-depth, you can clone dbt Lab’s [Jaffle shop](https://github.com/dbt-labs/jaffle_shop) on GitHub. It's a runnable project that contains sample configurations and helpful notes.

If you want to see what a mature, production project looks like, check out the [GitLab Data Team public repo](https://gitlab.com/gitlab-data/analytics/-/tree/master/transform/snowflake-dbt).


## Related docs
* [Best practices: How we structure our dbt projects](/best-practices/how-we-structure/1-guide-overview)
* [Quickstarts for dbt Cloud](/guides)
* [Quickstart for dbt Core](/guides/manual-install)
