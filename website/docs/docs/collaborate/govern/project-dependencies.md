---
title: "Project dependencies"
id: project-dependencies
sidebar_label: "Project dependencies"
description: "Reference public models across dbt projects"
---

:::info
"Project" dependencies and cross-project `ref` are features of dbt Cloud Enterprise, currently available in closed beta. Please reach out to your account team!
:::

For a long time, dbt has supported code reuse and extension by installing other projects as [packages](/docs/build/packages). When you install another project as a package, you are pulling in its full source code, and adding it to your own. This enables you to call macros and run models defined in that other project.

While this is a great way to reuse code, share utility macros, and establish a starting point for common transformations, it's not a great way to enable collaboration across teams and at scale, especially at larger organizations.

This year, dbt Labs is introducing an expanded notion of `dependencies` across multiple dbt projects:
- **Packages** are the familiar & preexisting type of dependency. You take this dependency by installing the package's full source code (like a software library).
- **Projects** are a new way to take a dependency on another project. Using a metadata service that runs behind the scenes, dbt Cloud resolves references on-the-fly to public models defined in other projects. Since you don't need to parse or run those upstream models yourself, your dependency on those models is as an API that returns a dataset. It's the responsibility of that public model's maintainer to guarantee its quality and stability.

Say I work on the Marketing team at the Jaffle Shop. The name of my project is `jaffle_marketing`:

<File name="dbt_project.yml">

```yml
name: jaffle_marketing
```

</File>

I want to take a dependency on two other projects:
- `dbt_utils`: public & open source, maintained by dbt Labs, a collection of utility macros
- `jaffle_finance`: data models about the Jaffle Shop's revenue, maintained by our colleagues on the Finance team

<File name="dependencies.yml">

```yml
packages:
  - package: dbt-labs/dbt_utils
    version: 1.1.1

projects:
  - name: jaffle_finance  # matches the 'name' in their 'dbt_project.yml'
```

</File>

The first is familiar: I want to use some of the macros that are already defined in `dbt_utils`. I pull down its full contents (100+ macros) as source code, and add them to my environment. I can then call any macro from the package, just as I can call macros that I define in my own project.

The second is new. Unlike installing a package, the models in the `jaffle_finance` project will not be pulled down as source code, and parsed into my project. Instead, dbt Cloud provides a metadata service that resolves references to [**public models**](/docs/collaborate/govern/model-access) defined in the `jaffle_finance` project.

Resolving the references in this way has several advantages:
- I'm using an intentional interface, designated by the model's maintainer with `access: public`.
- I'm keeping the scope of my project narrow. I'm not adding any unneeded resources or complexity. This is faster for me, and faster for dbt.
- I don't need to mirror any conditional configuration of the upstream project: `vars`, environment variables, `target.name`, etc. Wherever the Finance team is building their models in production, that's where I'll be referencing them. The Finance team could re-alias their model, change the name of its schema, or [bump its version](model-versions), and my `ref` would still resolve successfully.
- I'm not at risk of accidentally building those models with `dbt run` or `dbt build`. While I can select those models, I cannot actually build them. This avoids the risk of unexpected warehouse costs and permissions issues, and it enables proper ownership and cost allocation for each team's models.

Models referenced from a `project`-type dependency must use [two-argument `ref`](/reference/dbt-jinja-functions/ref#two-argument-variant), including the project name:

<File name="models/marts/roi_by_channel.sql">

```sql
with monthly_revenue as (
  
    select * from {{ ref('jaffle_finance', 'monthly_revenue') }}

),

...

```

</File>

If I were to instead install the `jaffle_finance` project as a `package` dependency, this would pull down its full source code. Meaning:
- dbt needs to parse and resolve more inputs (which is slower)
- dbt expects me to configure these models as if they were my own (with `vars`, env vars, etc)
- dbt will run these models as my own, unless I explicitly `--exclude` them
- I could be using the project's models in a way that their maintainer (the Finance team) hasn't intended

Installing another internal project as a package can be a useful pattern for:
- "Unified deployments" in production environments. If the central data platform team of Jaffle Shop wanted to schedule the deployment of models across both `jaffle_finance` and `jaffle_marketing`, using dbt's selection syntax, they could create a new "passthrough" project that installed both projects as packages.
- Making a coordinated change across multiple projects in development. If I wanted to test the effects of a change to a public model in an upstream project (`jaffle_finance.monthly_revenue`), and see how it impacts a downstream model (`jaffle_marketing.roi_by_channel`), before pushing the changes into a staging or production environment, I could install `jaffle_finance` as a package inside `jaffle_marketing`, pointing to a specific git branch. (If I find I regularly need to do end-to-end testing of changes across both projects, I should reexamine if this really represents a stable interface boundary.)

These are the exceptions, rather than the rule. Installing another team's project as a package adds complexity, latency, and risk of unnecessary costs. By defining clear interface boundaries across teams, by serving one team's public models as "APIs" to another, and by enabling practitioners to develop with a more narrowly-defined scope, we can enable more people to contribute, with more confidence, while requiring less context upfront.
