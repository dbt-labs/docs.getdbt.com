---
title: "Introducing the dbt_project_evaluator: Automatically evaluate your dbt project for alignment with best practices "
description: "The dbt_project_evaluator is a dbt package created by the Professional Services team at dbt Labs to help analytics engineers automatically audit their dbt projects for bad practices. Goodbye auditing nightmares, hello beautiful DAG."
slug: align-with-dbt-project-evaluator

authors: [grace_goheen]

tags: [analytics craft]
hide_table_of_contents: false

date: 2022-11-30
is_featured: true
---

## Why we built this: A brief history of the dbt Labs Professional Services team

If you attended [Coalesce 2022](https://www.youtube.com/watch?v=smbRwmcM1Ok), you’ll know that the secret is out — the dbt Labs Professional Services team is not just [a group of experienced data consultants](https://www.getdbt.com/dbt-labs/services/); we’re also an intergalactic group of aliens traveling the Milky Way on a mission to enable analytics engineers to successfully adopt and manage dbt throughout the galaxy.

<!--truncate-->

Don’t believe me??? Here’s photographic proof.

<Lightbox src="/img/blog/2022-11-30-dbt-project-evaluator/proserv_aliens.png" title="Rare photographic evidence of the dbt Labs Professional Services team" />

Since the inception of dbt Labs, our team has been embedded with a variety of different data teams — from an over-stretched-data-team-of-one to a data-mesh-multiverse.

Throughout these engagements, we began to take note of the common issues many analytics engineers face when scaling their dbt projects:

- No alerts when data models produce incorrect outputs
- Long execution times when building or querying a model
- Duplicated code and differing metric definitions across teams
- Lack of knowledge of what a model or field represents
- Wasted developer time locating and reading through messy SQL files

Maybe your team is facing some of these issues right now 👀 And that’s okay! We know that building an effective, scalable dbt project takes a lot of effort and brain power. Maybe you’ve inherited a legacy dbt project with a mountain of tech debt. Maybe you’re starting from scratch. Either way it can be difficult to know the best way to set your team up for success. Don’t worry, you’re in the right place!

Through solving these problems over and over, the Professional Services team began to hone our best practices for working with dbt and how analytics engineers could improve their dbt project. We added “solutions reviews'' to our list of service offerings — client engagements in which we evaluate a given dbt project and provide specific recommendations to improve performance, save developer time, and prevent misuse of dbt’s features. And in an effort to share these best practices with the wider dbt community, we developed a *lot* of content. We wrote articles on the Developer Blog (see [1](https://docs.getdbt.com/blog/on-the-importance-of-naming), [2](https://discourse.getdbt.com/t/your-essential-dbt-project-checklist/1377), and [3](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview)), gave [Coalesce talks](https://www.getdbt.com/coalesce-2020/auditing-model-layers-and-modularity-with-your-dag/), and created [training courses](https://courses.getdbt.com/courses/refactoring-sql-for-modularity).

TIme and time again, we found that when teams are aligned with these best practices, their projects are more:

- **U**sable: Data outputs are reliable with proper alerting in place
- **F**ast: Jobs are more efficient without long-running model bottlenecks
- **O**rganized: Developers can quickly find, read, and understand the code they need to update
- **S**calable: No more "black holes", duplicated code is eliminated allowing your project to grow with ease

Even with all of these great resources, evaluating a dbt project still took considerable upfront development time to discover exactly where and how to apply these best practices.

**That’s when we came up with a space-altering idea: what if we could compress all of our ideas about best practices into a single, actionable tool to automate the process of discovering these misalignments, so that analytics engineers could immediately understand exactly where their projects deviated from our best practices and *be empowered to improve their projects on their own*.**

Flash forward through a six month long development process…

The [dbt_project_evaluator](https://github.com/dbt-labs/dbt-project-evaluator) was born: a dbt package that uses the shared language of SQL, models, and tests to identify and assert specific recommendations for a given dbt project.

## How the `dbt_project_evaluator` package works

When you install and run this package in your own dbt project, it will:

1. Convert the [graph](https://docs.getdbt.com/reference/dbt-jinja-functions/graph) object — which is a variable that contains information about the nodes in your dbt project — into a query-able table. This enables us to write SQL queries against a tabular representation of your <Term id = "dag" />.
2. Capture each misalignment of an established “best practice” in a dbt model.
3. Test these new models to alert you to the presence of misalignments in your dbt project.

Currently, the dbt_project_evaluator package covers five main categories:

| Category | Example Best Practices |
| --- | --- |
| Modeling | - Every [raw source](https://docs.getdbt.com/docs/build/sources) has a one-to-one relationship with a [staging model](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview) to centralize data cleanup. <br />- Every model can be traced back to a declared source in the dbt project (i.e. no "root" models). <br /> - End-of-DAG fanout remains under a specified threshold. |
| Testing | - Every model has a <Term id = "primary-key" /> that is appropriately tested. <br /> - The percentage of models that have minimum 1 test applied is greater than or equal to a specified threshold. |
| Documentation | - Every model has a [description](https://docs.getdbt.com/reference/resource-properties/description). <br /> - The percentage of models that have a description is greater than or equal to a specified threshold. |
| Structure | - All models are named with the appropriate prefix aligned according to their model types (e.g. staging models are prefixed with `stg_`).<br /> - The sql file for each model is in the subdirectory aligned with the model type (e.g. intermediate models are in an [intermediate subdirectory](https://docs.getdbt.com/best-practices/how-we-structure/3-intermediate)).<br /> - Each models subdirectory contains one .yml file that includes tests and documentation for all models within the given subdirectory. |
| Performance | - Every model that directly feeds into an [exposure](https://docs.getdbt.com/docs/build/exposures) is materialized as a <Term id="table" />.<br /> - No models are dependent on chains of "non-physically-materialized" models greater than a specified threshold. |

For the full up-to-date list of covered rules, check out the package’s [README](https://github.com/dbt-labs/dbt-project-evaluator#rules-1), which outlines for each misalignment of a best practice:

- Definition and clarifying example
- Reason for flagging the misalignment
- Any known exceptions to the rule
- How to remediate the issue

There might be specific situations where you need to depart from our best practices. *That’s actually okay*, as long as you’ve reviewed the misalignment and made the active choice to do something different. We built this tool with simple mechanisms to customize the package behavior, including:

- Disabling a package model to exclude a best practice from the entire evaluation process
- Overriding variables to adjust *how* a best practice is evaluated
- Documenting specific project exceptions to a best practice in a seed file

For instructions and code snippets for each customization method, check out the [README](https://github.com/dbt-labs/dbt-project-evaluator#customization-1).

## Try it out!

To try out the package in your own project:

1. **Install the package**: Check [dbt Hub](https://hub.getdbt.com/dbt-labs/dbt_project_evaluator/latest/) for the latest installation instructions, or read [the docs](https://docs.getdbt.com/docs/build/packages) for more information on installing packages.
2. **Run and test all of the models in the package**: Execute a `dbt build --select package:dbt_project_evaluator` command.
3. **Identify any warnings**: Each test warning indicates the presence of a type of misalignment.

For *each warning* that pops up:

1. Identify the model name.
2. Locate the related documentation in the package [README](https://github.com/dbt-labs/dbt-project-evaluator#rules-1).
3. Query the model to find the specific instances of the issue within your project.
4. Either fix the issue(s) or [customize](https://github.com/dbt-labs/dbt-project-evaluator#customization-1) the package to exclude the issue(s).

In order to automatically maintain project quality as your team expands, you can enforce alignment with dbt Lab’s best practices on all future code changes by [adding this package as a CI check](https://github.com/dbt-labs/dbt-project-evaluator#running-this-package-as-a-ci-check-1). Every time one of your team members (or yourself) opens a PR, the CI check will automatically ensure that new code changes don’t introduce new misalignments.

You can think of this as “linting” your dbt project to keep it aligned with our best practices — in the same way you might lint your SQL code to keep it aligned with your style guide.

To add this package as a CI check:

1. Override the severity of your tests using an [environment variable](https://docs.getdbt.com/docs/build/environment-variables).
2. Run this package as a step in your CI job.

To watch a full demo of using this package in greater detail, make sure to check out [my Coalesce talk below](https://youtu.be/smbRwmcM1Ok) [demo starts at 7:35].

<center>
    <YoutubeVideo id="smbRwmcM1Ok" />
</center>

<br /> 

If something isn’t working quite right or you have ideas for future functionality, [open an issue in the Github repository](https://github.com/dbt-labs/dbt-project-evaluator/issues) or even contribute code of your own!

Together, we can ensure that dbt projects across the galaxy are set up for success as they grow to infinity and beyond.

<Lightbox src="/img/blog/2022-11-30-dbt-project-evaluator/grace_at_coalesce.png" title="Alien Graceline beams back to dbt Labs’ mission control center…for now" />
