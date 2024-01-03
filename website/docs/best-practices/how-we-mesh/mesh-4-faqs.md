---
title: "dbt Mesh FAQs"
description: "Read some frequently asked questions about dbt Mesh."
hoverSnippet: "dbt Mesh FAQs"
sidebar_label: "Frequently asked dbt Mesh questions"
---

dbt Mesh is a new architecture enabled by dbt Cloud. It allows you to better manage complexity by deploying multiple interconnected dbt projects instead of a single large, monolithic project. It’s designed to accelerate development, without compromising governance.

The following frequently asked questions (FAQs) are categorized into the following topics:

- [Overview of Mesh](#overview-of-mesh)
- [How dbt Mesh works](#how-dbt-mesh-works)
- [Access and permissions](#access-and-permissions)
- [Compatibility with other features](#compatibility-with-other-features)
- [When and where dbt Mesh is available](#when-and-where-dbt-mesh-is-available)
- [Tips on implementing dbt Mesh](#tips-on-implementing-dbt-mesh)

## Overview of Mesh

<detailsToggle alt_header="What is dbt Mesh?">

dbt Mesh is a new architecture enabled by dbt Cloud. It allows you to better manage complexity by deploying multiple interconnected dbt projects instead of a single large, monolithic project. It’s designed to accelerate development, without compromising governance.
</detailsToggle>

<detailsToggle alt_header="How do I implement contracts for my models?">

In dbt, [model contracts](/docs/collaborate/govern/model-contracts) serve as a governance tool enabling the definition and enforcement of data structure standards in your dbt models. They allow you to specify and uphold data model guarantees, including column data types, allowing for the stability of dependent models. Should a model fail to adhere to its established contracts, it will not successfully build.

</detailsToggle>

<detailsToggle alt_header="What are model versions?">

dbt [model versions](https://docs.getdbt.com/docs/collaborate/govern/model-versions) are iterations of your dbt models made over time. In many cases, you may knowingly choose to change a model’s structure in a way that “breaks” the previous model contract — when you do so, you find it useful to create a new version of the model to signify this change.

You can use **model versions** to:

- Test "prerelease" changes (in production, in downstream systems)
- Bump the latest version, to be used as the canonical source of truth
- Offer a migration window off the "old" version

</detailsToggle>

<detailsToggle alt_header="What are model access modifiers?">

A [model access modifier](/docs/collaborate/govern/model-access) in dbt is a feature that defines the level of accessibility of a model to other parts of the dbt project, or to other dbt projects. It specifies who can reference a model using [the `ref` function](https://docs.getdbt.com/reference/dbt-jinja-functions/ref). There are three types of access modifiers:

1. **Private:** A model with a private access modifier is only referenceable by models within the same group. This is intended for models that are implementation details and are meant to be used only within a specific group of related models.
2. **Protected:** Models with a protected access modifier can be referenced by any other model within the same dbt project or when the project is installed as a package. This is the default setting for all models, ensuring backward compatibility, especially when groups are assigned to an existing set of models.
3. **Public:** A public model can be referenced across different groups, packages, or projects. This is suitable for stable and mature models that serve as interfaces for other teams or projects.

</detailsToggle>

<detailsToggle alt_header="What are model groups?">

A model group in dbt is a concept used to organize models under a common category or ownership. This categorization can be based on various criteria, such as the team responsible for the models or the specific data source they model, like GitHub data.

</detailsToggle>

<detailsToggle alt_header="What are the main benefits of implementing dbt Mesh?">

1. **Agility in Development**: With a more modular architecture, teams can make changes rapidly and independently in specific areas without impacting the entire system, leading to faster development cycles.
2. **Improved Collaboration**: Teams are able to share and build upon each other's work without duplicating efforts.
3. **Reduced Complexity**: By organizing transformation logic into distinct domains, dbt Mesh reduces the complexity inherent in large, monolithic projects, making them easier to manage and understand.
4. **Improved Data Trust.** Adopting a dbt Mesh can help ensure that changes in one domain's data models do not unexpectedly break dependencies in other domain areas, leading to a more secure and predictable data environment.

Most importantly, all this can be accomplished without the central data team losing the ability to see lineage across the entire organization, or compromising on governance mechanisms.

</detailsToggle>

<detailsToggle alt_header="What are some potential drawbacks of using a dbt Mesh?">

This is a new way of working, and the intentionality required to build, and then maintain, cross-project interfaces and dependencies may feel like a slowdown versus what some developers are used to. This way of working introduces intentional friction that makes it more difficult to change everything at once.

Orchestration across multiple projects is also likely to be slightly more challenging for many organizations, although we’re currently developing new functionality that will make this process simpler.

</detailsToggle>

## How dbt Mesh works

<detailsToggle alt_header="Integrations available between the dbt Cloud Discovery API and other tools for cross-project lineage?">

Yes. In addition to being viewable natively through [dbt Explorer](https://www.getdbt.com/product/dbt-explorer), it is possible to view cross-project lineage connect using partner integrations with data cataloging tools. For a list of available dbt Cloud integrations, refer to the [Integrations page](https://www.getdbt.com/product/integrations).

</detailsToggle>

<detailsToggle alt_header="How does dbt handle job run logs and can it feed them to standard monitoring tools, reports, etc.?">

Yes, all of this metadata is accessible via the [dbt Cloud Admin API](/docs/dbt-cloud-apis/admin-cloud-api). This metadata can be fed into a monitoring tool, or used to create reports and dashboards. 

We also expose some of this information in dbt Cloud itself in [jobs](/docs/deploy/jobs), [environments](https://docs.getdbt.com/docs/environments-in-dbt) and in [dbt Explorer](https://www.getdbt.com/product/dbt-explorer).

</detailsToggle>

<detailsToggle alt_header="Can dbt Mesh handle cyclic dependencies between projects?">

Like resource dependencies, project dependencies are acyclic, meaning they only move in one direction. This prevents `ref` cycles (or loops). For example, if project B depends on project A, a new model in project A could not import and use a public model from project B. Refer to [Project dependencies](/docs/collaborate/govern/project-dependencies#how-to-use-ref) for more information.

</detailsToggle>

<detailsToggle alt_header="Is it possible for multiple projects to directly reference a shared source?">

While it’s not currently possible to share sources across projects, it would be possible to have a shared foundational project, with staging models on top of those sources, exposed as “public” models to other teams/projects.

</detailsToggle>

<detailsToggle alt_header="What if a model I've already built on from another project later becomes protected?">

This would be a breaking change for downstream consumers of that model. If the maintainers of the upstream project wish to remove the model (or “downgrade” its access modifier, effectively the same thing), they should mark that model for deprecation (using [deprecation_date](/reference/resource-properties/deprecation_date)), which will deliver a warning to all downstream consumers of that model.

In the future, we plan for dbt Cloud to also be able to proactively flag this scenario in [continuous integration](/docs/deploy/continuous-integration) for the maintainers of the upstream public model.

</detailsToggle>

<detailsToggle alt_header="If I run `dbt build --select +model`, will this trigger a run of upstream models in other projects?">

No, unless downstream projects are installed as [packages](/docs/build/packages) (source code). In that case, the models in project installed as a project become “your” models, and you can select or run them. There are cases in which this can be desirable; see docs on [project dependencies](/docs/collaborate/govern/project-dependencies).

</detailsToggle>

<detailsToggle alt_header="If each project/domain has its own data warehouse, is it still possible to build models across them?">

Yes; as long as they’re in the same data platform (such as BigQuery, Databricks, Redshift, Snowflake, or Starburst) and you have configured permissions and sharing in that data platform provider to allow for this.

</detailsToggle>

<detailsToggle alt_header="Can I run tests that involve tables from multiple different projects?">

Yes, because the cross-project collaboration is done using the `{{ ref() }}` macro, you can use those models from other teams in singular tests. 

</detailsToggle>

<detailsToggle alt_header="Which team's data schema would dbt Mesh create?">

Each team defines their connection to the data warehouse, and the default schema names for dbt to use when materializing datasets.

By default, each project belonging to a team will create:

- One schema for production runs (for example, `finance`)
- One schema per developer (for example, `dev_jerco`)

Depending on each team’s needs, this can be customized with model-level [schema configurations](/docs/build/custom-schemas), including the ability to define different rules by environment.

</detailsToggle>

<detailsToggle alt_header="Is it possible to apply model contracts to source data?">

No, contracts can currently only be applied at the [model level](/docs/collaborate/govern/model-contracts). It is a recommended best practice to [define staging models](https://docs.getdbt.com/best-practices/how-we-structure/2-staging) on top of sources, and it is possible to define contracts on top of those staging models.

</detailsToggle>

<detailsToggle alt_header="Can contracts be partially enforced?">

No. A contract applies to an entire model, including all columns in the model’s output. This is the same set of columns that a consumer would see when viewing the model’s details in Explorer, or when querying the model in the data platform. 
- This means it's not possible to selectively enforce contracts on specific columns, such as ensuring certain columns exist and remain unchanged while allowing modifications to others.
- If you wish to contract only a subset of columns, you can create a separate model (materialized as a view) selecting only that subset. If you wish to limit which rows or columns a downstream consumer can see when they query the model’s data, depending on who they are, specific data platforms offer advanced capabilities around dynamic row-level access and column-level data masking.

</detailsToggle>

<detailsToggle alt_header="Can you have multiple owners in a group?">

No, a [group](/docs/collaborate/govern/model-access#groups) can currently only be assigned to have a single owner. Note however that the assigned can be a team, not just an individual.

</detailsToggle>

<detailsToggle alt_header="Can contracts be assigned individual owners?">

Not directly, but contracts are [assigned to models](/docs/collaborate/govern/model-contracts) and models can be assigned to individual owners. You can use meta fields for this purpose.

</detailsToggle>

<detailsToggle alt_header="Can I make a model “public” only for specific team(s) to use?">

This is not currently possible, but something we hope to enable in the near future. If you’re interested in this functionality, please reach out to your dbt Labs account team.

</detailsToggle>

<detailsToggle alt_header="Is it possible to orchestrate job runs across multiple different projects?">

dbt Cloud will soon offer a capability to trigger jobs on the completion of another job, including a job in a different project. This offers one mechanism for executing a pipeline from start to finish across projects.

</detailsToggle>

## Access and permissions

<detailsToggle alt_header="How do user access permissions work in a dbt Mesh? ">

The existence of projects that have at least one public model will be visible to everyone in the organization with read-only access. 

Private or protected models require a user to have read-only access on the specific project in order to see its existence.

</detailsToggle>

<detailsToggle alt_header="Is it possible to request access permissions from other teams?">

There is not currently! But this is something we may evaluate for the future.

</detailsToggle>

<detailsToggle alt_header="Can projects be hidden for confidentiality?">

The "multi-project" view in dbt Cloud Explorer (and the underlying Discovery API) will include any project that has defined at least one "public" model, including the list of public models. (Read more about [model access modifiers](/docs/collaborate/govern/model-access#access-modifiers).) If a user has additional permissions on that project (managed via dbt Cloud RBAC), including read-only permissions, they can explore further into that project and see details about all models (private, protected, and protected).

</detailsToggle>

<detailsToggle alt_header="As a central data team member, can I still maintain visibility on the entire organizational DAG?">

Yes! As long as a user has permissions (at least read-only access) on all projects in a dbt Cloud account, they can navigate across the entirety of the organization’s DAG in dbt Explorer, and see models at all levels of detail.

</detailsToggle>

<detailsToggle alt_header="TO DO -- How do these things interact: model-level access; role-based access in dbt Cloud; access to underlying data within the data platform?">

OUTSTANDING COPY

</detailsToggle>

<detailsToggle alt_header="TO DO -- How can I limit my developers from accessing production data when referencing from other projects?">

My production environments contain sensitive data. How can I limit my developers from accessing production data when referencing from other projects?

</detailsToggle>

## Compatibility with other features

<detailsToggle alt_header="How does the dbt Semantic Layer relate to and work with dbt Mesh?">

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and dbt Mesh are complementary mechanisms enabled by dbt Cloud that work together to enhance the management, usability, and governance of data in large-scale data environments.

The Semantic Layer in dbt Cloud allows teams to centrally define business metrics and dimensions. It ensures consistent and reliable metric definitions across various analytics tools and platforms.

dbt Mesh enables organizations to split their data architecture into multiple domain-specific projects, while retaining the ability to reference “public” models across projects. It is also possible to reference a “public” model from another project for the purpose of defining semantic models and metrics. In this way, your organization can have multiple dbt projects feed into a unified semantic layer, ensuring that metrics and dimensions are consistently defined and understood across these different domains.

</detailsToggle>

<detailsToggle alt_header="TO DO -- Can dbt Mesh help control permissions in the Semantic Layer? How does it work with semantic tokens?">

OUTSTANDING COPY

</detailsToggle>

<detailsToggle alt_header="How does dbt Explorer relate to and work with dbt Mesh?">

**[dbt Explorer](/docs/collaborate/explore-projects)** is a tool within dbt Cloud that serves as a knowledge base and lineage visualization platform. It provides a comprehensive view of your dbt assets, including models, tests, sources, and their interdependencies.

Used in conjunction with dbt Mesh, dbt Explorer becomes a powerful tool for visualizing and understanding the relationships and dependencies between models across multiple dbt projects.

</detailsToggle>

<detailsToggle alt_header="How does the dbt Cloud CLI relate to and work with dbt Mesh?">

The [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) allows users to develop and run dbt commands from their preferred development environments, like VS Code, Sublime Text, or terminal interfaces. This flexibility is particularly beneficial in a dbt Mesh setup, where managing multiple projects can be complex. Developers can work in their preferred tools while leveraging the centralized capabilities of dbt Cloud.

</detailsToggle>


## When and where dbt Mesh is available

<detailsToggle alt_header="Does dbt Mesh require me to be on a specific version of dbt?">

Yes — your account must be on at least dbt v1.6 to take advantage of [cross-project dependencies](/docs/collaborate/govern/project-dependencies), one of the most crucial underlying capabilities required to implement a dbt Mesh.

</detailsToggle>

<detailsToggle alt_header="Is there a way to leverage dbt Mesh capabilities in dbt Core?">

Not all of them. While dbt Core provides some of the foundational elements for dbt Mesh, dbt Cloud offers an enhanced experience that leverages these elements for scaled collaboration across multiple teams. 

Many of the key components that underpin dbt Mesh functionality, such as model contracts, versions, and access modifier levels (public and private), are available in dbt Core. To enable cross-project dependencies, users can also leverage [packages](/docs/build/packages). This enables users to import models from an upstream project, which allows the resolution of cross-project references.

The major distinction comes with dbt Cloud's metadata service, which is unique to the dbt Cloud platform and allows for the resolution of references to only the public models in a project. This service enables users to take dependencies on resources from upstream projects without needing to load the full complexity of those upstream projects into their local development environment.

</detailsToggle>

<detailsToggle alt_header="Does dbt Mesh require a specific dbt Cloud plan?">

Yes, a [dbt Cloud Enterprise](https://www.getdbt.com/pricing) plan is required to set up multiple projects and reference models across them.

</detailsToggle>

## Tips on implementing dbt Mesh

<detailsToggle alt_header="Is there a recommended migration or implementation process?">

Refer to our developer guide on [How we structure our dbt Mesh projects](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-1-intro). You may also be interested in watching the recording of this talk from Coalesce 2023: [Unlocking model governance and multi-project deployments with dbt-meshify](https://www.youtube.com/watch?v=FAsY0Qx8EyU).

</detailsToggle>

<detailsToggle alt_header="Are there tools available to help me migrate to a dbt Mesh?">

`dbt-meshify` is a [CLI tool](https://github.com/dbt-labs/dbt-meshify) that automates the creation of model governance and cross-project lineage features introduced in dbt-core v1.5 and v1.6. This package will leverage your dbt project metadata to create and/or edit the files in your project to properly configure the models in your project with these features.
</detailsToggle>

<detailsToggle alt_header="TO DO -- What aspects of dbt Mesh are relevant to me?">

 My team isn’t structured in a way that would require multiple projects today (though that may change in the future). What aspects of dbt Mesh are relevant to me?
</detailsToggle>
