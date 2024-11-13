---
title: "Project dependencies"
id: project-dependencies
sidebar_label: "Project dependencies"
description: "Reference public models across dbt projects"
pagination_next: null
keyword: dbt mesh, project dependencies, ref, cross project ref, project dependencies
---


For a long time, dbt has supported code reuse and extension by installing other projects as [packages](/docs/build/packages). When you install another project as a package, you are pulling in its full source code, and adding it to your own. This enables you to call macros and run models defined in that other project.

While this is a great way to reuse code, share utility macros, and establish a starting point for common transformations, it's not a great way to enable collaboration across teams and at scale, especially in larger organizations.

This year, dbt Labs is introducing an expanded notion of `dependencies` across multiple dbt projects:
- **Packages** &mdash; Familiar and pre-existing type of dependency. You take this dependency by installing the package's full source code (like a software library).
- **Projects** &mdash; A _new_ way to take a dependency on another project. Using a metadata service that runs behind the scenes, dbt Cloud resolves references on-the-fly to public models defined in other projects. You don't need to parse or run those upstream models yourself. Instead, you treat your dependency on those models as an API that returns a dataset. The maintainer of the public model is responsible for guaranteeing its quality and stability.

## Prerequisites
- Available in [dbt Cloud Enterprise](https://www.getdbt.com/pricing). If you have an Enterprise account, you can unlock these features by designating a [public model](/docs/collaborate/govern/model-access) and adding a [cross-project ref](#how-to-write-cross-project-ref). <Lifecycle status="enterprise"/>
- Use a supported version of dbt (v1.6 or newer or go versionless with "[Versionless](/docs/dbt-versions/upgrade-dbt-version-in-cloud#versionless)") for both the upstream ("producer") project and the downstream ("consumer") project.
- Define models in an upstream ("producer") project that are configured with [`access: public`](/reference/resource-configs/access). You need at least one successful job run after defining their `access`.
- Define a deployment environment in the upstream ("producer") project [that is set to be your Production environment](/docs/deploy/deploy-environments#set-as-production-environment), and ensure it has at least one successful job run in that environment.
- If the upstream project has a Staging environment, run a job in that Staging environment to ensure the downstream cross-project ref resolves.
- Each project `name` must be unique in your dbt Cloud account. For example, if you have a dbt project (codebase) for the `jaffle_marketing` team, you should not create separate projects for `Jaffle Marketing - Dev` and `Jaffle Marketing - Prod`. That isolation should instead be handled at the environment level.
  - We are adding support for environment-level permissions and data warehouse connections; please contact your dbt Labs account team for beta access.
- The `dbt_project.yml` file is case-sensitive, which means the project name must exactly match the name in your `dependencies.yml`.  For example, if your project name is `jaffle_marketing`, you should use `jaffle_marketing` (not `JAFFLE_MARKETING`) in all related files.


import UseCaseInfo from '/snippets/_packages_or_dependencies.md';

<UseCaseInfo/>

## Example

As an example, let's say you work on the Marketing team at the Jaffle Shop. The name of your team's project is `jaffle_marketing`:

<File name="dbt_project.yml">

```yml
name: jaffle_marketing
```

</File>

As part of your modeling of marketing data, you need to take a dependency on two other projects:
- `dbt_utils` as a [package](#packages-use-case): A collection of utility macros you can use while writing the SQL for your own models. This package is open-source public and maintained by dbt Labs.
- `jaffle_finance` as a [project use-case](#projects-use-case): Data models about the Jaffle Shop's revenue. This project is private and maintained by your colleagues on the Finance team. You want to select from some of this project's final models, as a starting point for your own work.

<File name="dependencies.yml">

```yml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1

projects:
  - name: jaffle_finance  # case sensitive and matches the 'name' in the 'dbt_project.yml'
```

</File>

What's happening here?

The `dbt_utils` package &mdash; When you run `dbt deps`, dbt will pull down this package's full contents (100+ macros) as source code and add them to your environment. You can then call any macro from the package, just as you can call macros defined in your own project.

The `jaffle_finance` projects &mdash; This is a new scenario. Unlike installing a package, the models in the `jaffle_finance` project will _not_ be pulled down as source code and parsed into your project. Instead, dbt Cloud provides a metadata service that resolves references to [**public models**](/docs/collaborate/govern/model-access) defined in the `jaffle_finance` project.

### Advantages

When you're building on top of another team's work, resolving the references in this way has several advantages:
- You're using an intentional interface designated by the model's maintainer with `access: public`.
- You're keeping the scope of your project narrow, and avoiding unnecessary resources and complexity. This is faster for you and faster for dbt.
- You don't need to mirror any conditional configuration of the upstream project such as `vars`, environment variables, or `target.name`. You can reference them directly wherever the Finance team is building their models in production. Even if the Finance team makes changes like renaming the model, changing the name of its schema, or [bumping its version](/docs/collaborate/govern/model-versions), your `ref` would still resolve successfully.
- You eliminate the risk of accidentally building those models with `dbt run` or `dbt build`. While you can select those models, you can't actually build them. This prevents unexpected warehouse costs and permissions issues. This also ensures proper ownership and cost allocation for each team's models.

### How to write cross-project ref

**Writing `ref`:** Models referenced from a `project`-type dependency must use [two-argument `ref`](/reference/dbt-jinja-functions/ref#ref-project-specific-models), including the project name:

<File name="models/marts/roi_by_channel.sql">

```sql
with monthly_revenue as (
  
    select * from {{ ref('jaffle_finance', 'monthly_revenue') }}

),

...

```

</File>

#### Cycle detection

import CycleDetection from '/snippets/_mesh-cycle-detection.md';

<CycleDetection />

For more guidance on how to use dbt Mesh, refer to the dedicated [dbt Mesh guide](/best-practices/how-we-mesh/mesh-1-intro) and also our freely available [dbt Mesh learning course](https://learn.getdbt.com/courses/dbt-mesh). 

### Safeguarding production data with staging environments

When working in a Development environment, cross-project `ref`s normally resolve to the Production environment of the project. However, to protect production data, set up a [Staging deployment environment](/docs/deploy/deploy-environments#staging-environment) within your projects. 

With a staging environment integrated into the project, dbt Mesh automatically fetches public model information from the producer’s staging environment if the consumer is also in staging. Similarly, dbt Mesh fetches from the producer’s production environment if the consumer is in production. This ensures consistency between environments and adds a layer of security by preventing access to production data during development workflows.

Read [Why use a staging environment](/docs/deploy/deploy-environments#why-use-a-staging-environment) for more information about the benefits. 

#### Staging with downstream dependencies

dbt Cloud begins using the Staging environment to resolve cross-project references from downstream projects as soon as it exists in a project without "fail-over" to Production. This means that dbt Cloud will consistently use metadata from the Staging environment to resolve references in downstream projects, even if there haven't been any successful runs in the configured Staging environment. 

To avoid causing downtime for downstream developers, you should define and trigger a job before marking the environment as Staging:

1. Create a new environment, but do NOT mark it as **Staging**.
2. Define a job in that environment.
3. Trigger the job to run, and ensure it completes successfully.
4. Update the environment to mark it as **Staging**.

### Comparison

If you were to instead install the `jaffle_finance` project as a `package` dependency, you would instead be pulling down its full source code and adding it to your runtime environment. This means:
- dbt needs to parse and resolve more inputs (which is slower)
- dbt expects you to configure these models as if they were your own (with `vars`, env vars, etc)
- dbt will run these models as your own unless you explicitly `--exclude` them
- You could be using the project's models in a way that their maintainer (the Finance team) hasn't intended

There are a few cases where installing another internal project as a package can be a useful pattern:
- Unified deployments &mdash; In a production environment, if the central data platform team of Jaffle Shop wanted to schedule the deployment of models across both `jaffle_finance` and `jaffle_marketing`,  they could use dbt's [selection syntax](/reference/node-selection/syntax) to create a new "passthrough" project that installed both projects as packages.
- Coordinated changes &mdash; In development, if you wanted to test the effects of a change to a public model in an upstream project (`jaffle_finance.monthly_revenue`) on a downstream model (`jaffle_marketing.roi_by_channel`) _before_ introducing changes to a staging or production environment, you can install the `jaffle_finance` package as a package within `jaffle_marketing`.  The installation can point to a specific git branch, however, if you find yourself frequently needing to perform end-to-end testing across both projects, we recommend you re-examine if this represents a stable interface boundary. 

These are the exceptions, rather than the rule. Installing another team's project as a package adds complexity, latency, and risk of unnecessary costs. By defining clear interface boundaries across teams, by serving one team's public models as "APIs" to another, and by enabling practitioners to develop with a more narrowly defined scope, we can enable more people to contribute, with more confidence, while requiring less context upfront.

## FAQs

<details>
<summary>Can I define private packages in the <code>dependencies.yml</code> file?</summary>

If you're using private packages with the [git token method](/docs/build/packages#git-token-method), you must define them in the `packages.yml` file instead of the `dependencies.yml` file. This is because conditional rendering (like Jinja-in-yaml) is not supported.
</details>


## Related docs
- Refer to the [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) guide for more guidance on how to use dbt Mesh.
- [Quickstart with dbt Mesh](/guides/mesh-qs)
