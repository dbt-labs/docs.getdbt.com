---
title: "dbt Mesh FAQs"
description: "Read the FAQs to learn more about dbt Mesh, how it works, compatibility, and more."
hoverSnippet: "dbt Mesh FAQs"
sidebar_label: "dbt Mesh FAQs"
---

dbt Mesh is a new architecture enabled by dbt Cloud. It allows you to better manage complexity by deploying multiple interconnected dbt projects instead of a single large, monolithic project. It’s designed to accelerate development, without compromising governance.

## Overview of Mesh

<DetailsToggle alt_header="What are the main benefits of implementing dbt Mesh?">
  
Here are some benefits of implementing dbt Mesh:

* **Ship data products faster**: With a more modular architecture, teams can make changes rapidly and independently in specific areas without impacting the entire system, leading to faster development cycles.
* **Improve trust in data:** Adopting dbt Mesh helps ensure that changes in one domain's data models do not unexpectedly break dependencies in other domain areas, leading to a more secure and predictable data environment.
* **Reduce complexity**: By organizing transformation logic into distinct domains, dbt Mesh reduces the complexity inherent in large, monolithic projects, making them easier to manage and understand.
* **Improve collaboration**: Teams are able to share and build upon each other's work without duplicating efforts.

Most importantly, all this can be accomplished without the central data team losing the ability to see lineage across the entire organization, or compromising on governance mechanisms.

</DetailsToggle>

<DetailsToggle alt_header="What are model contracts?">

dbt [model contracts](/docs/collaborate/govern/model-contracts) serve as a governance tool enabling the definition and enforcement of data structure standards in your dbt models. They allow you to specify and uphold data model guarantees, including column data types, allowing for the stability of dependent models. Should a model fail to adhere to its established contracts, it will not build successfully.

</DetailsToggle>

<DetailsToggle alt_header="What are model versions?">

dbt [model versions](https://docs.getdbt.com/docs/collaborate/govern/model-versions) are iterations of your dbt models made over time. In many cases, you might knowingly choose to change a model’s structure in a way that “breaks” the previous model contract, and may break downstream queries depending on that model’s structure. When you do so, creating a new version of the model is useful to signify this change.

You can use model versions to:

- Test "prerelease" changes (in production, in downstream systems).
- Bump the latest version, to be used as the canonical "source of truth."
- Offer a migration window off the "old" version.

</DetailsToggle>

<DetailsToggle alt_header="What are model access modifiers?">

A [model access modifier](/docs/collaborate/govern/model-access) in dbt determines if a model is accessible as an input to other dbt models and projects. It specifies where a model can be referenced using [the `ref` function](/reference/dbt-jinja-functions/ref). There are three types of access modifiers:

* **Private:** A model with a private access modifier is only referenceable by models within the same group. This is intended for models that are implementation details and are meant to be used only within a specific group of related models.
* **Protected:** Models with a protected access modifier can be referenced by any other model within the same dbt project or when the project is installed as a package. This is the default setting for all models, ensuring backward compatibility, especially when groups are assigned to an existing set of models.
* **Public:** A public model can be referenced across different groups, packages, or projects. This is suitable for stable and mature models that serve as interfaces for other teams or projects.

</DetailsToggle>

<DetailsToggle alt_header="What are model groups?">

A [model group](/docs/collaborate/govern/model-access#groups) in dbt is a concept used to organize models under a common category or ownership. This categorization can be based on various criteria, such as the team responsible for the models or the specific data source they model.

</DetailsToggle>

<DetailsToggle alt_header="What are some potential challenges when using dbt Mesh?">

This is a new way of working, and the intentionality required to build, and then maintain, cross-project interfaces and dependencies may feel like a slowdown versus what some developers are used to. The intentional friction introduced promotes thoughtful changes, fostering a mindset that values stability and systematic adjustments over rapid transformations.

Orchestration across multiple projects is also likely to be slightly more challenging for many organizations, although we’re currently developing new functionality that will make this process simpler.

</DetailsToggle>

<DetailsToggle alt_header="How does this relate to the concept of data mesh?">

dbt Mesh allows you to better _operationalize_ data mesh by enabling decentralized, domain-specific data ownership and collaboration.

In data mesh, each business domain is responsible for its data as a product. This is the same goal that dbt Mesh facilitates by enabling organizations to break down large, monolithic data projects into smaller, domain-specific dbt projects. Each team or domain can independently develop, maintain, and share its data models, fostering a decentralized data environment.

dbt Mesh also enhances the interoperability and reusability of data across different domains, a key aspect of the data mesh philosophy. By allowing cross-project references and shared governance through model contracts and access controls, dbt Mesh ensures that while data ownership is decentralized, there is still a governed structure to the overall data architecture.

</DetailsToggle>

## How dbt Mesh works

<DetailsToggle alt_header="Can dbt Mesh handle cyclic dependencies between projects?">

import CycleDetection from '/snippets/_mesh-cycle-detection.md';

<CycleDetection />


</DetailsToggle>

<DetailsToggle alt_header="Is it possible for multiple projects to directly reference a shared source?">

While it’s not currently possible to share sources across projects, it would be possible to have a shared foundational project, with staging models on top of those sources, exposed as “public” models to other teams/projects.

</DetailsToggle>

<DetailsToggle alt_header="What if a model I've already built on from another project later becomes protected?">

This would be a breaking change for downstream consumers of that model. If the maintainers of the upstream project wish to remove the model (or “downgrade” its access modifier, effectively the same thing), they should mark that model for deprecation (using [deprecation_date](/reference/resource-properties/deprecation_date)), which will deliver a warning to all downstream consumers of that model.

In the future, we plan for dbt Cloud to also be able to proactively flag this scenario in [continuous integration](/docs/deploy/continuous-integration) for the maintainers of the upstream public model.

</DetailsToggle>

<DetailsToggle alt_header="If I run `dbt build --select +model`, will this trigger a run of upstream models in other projects?">

No, unless upstream projects are installed as [packages](/docs/build/packages) (source code). In that case, the models in project installed as a project become “your” models, and you can select or run them. There are cases in which this can be desirable; see docs on [project dependencies](/docs/collaborate/govern/project-dependencies).

</DetailsToggle>

<DetailsToggle alt_header="If each project/domain has its own data warehouse, is it still possible to build models across them?">

Yes, as long as they’re in the same data platform (BigQuery, Databricks, Redshift, Snowflake, etc.) and you have configured permissions and sharing in that data platform provider to allow this.

</DetailsToggle>

<DetailsToggle alt_header="Can I run tests that involve tables from multiple different projects?">

Yes, because the cross-project collaboration is done using the `{{ ref() }}` macro, you can use those models from other teams in [singular tests](/docs/build/data-tests#singular-data-tests). 

</DetailsToggle>

<DetailsToggle alt_header="Which team's data schema would dbt Mesh create?">

Each team defines their connection to the data warehouse, and the default schema names for dbt to use when materializing datasets.

By default, each project belonging to a team will create:

- One schema for production runs (for example, `finance`).
- One schema per developer (for example, `dev_jerco`).

Depending on each team’s needs, this can be customized with model-level [schema configurations](/docs/build/custom-schemas), including the ability to define different rules by environment.

</DetailsToggle>

<DetailsToggle alt_header="Is it possible to apply model contracts to source data?">

No, contracts can only be applied at the [model level](/docs/collaborate/govern/model-contracts). It is a recommended best practice to [define staging models](/best-practices/how-we-structure/2-staging) on top of sources, and it is possible to define contracts on top of those staging models.

</DetailsToggle>

<DetailsToggle alt_header="Can contracts be partially enforced?">

No. A contract applies to an entire model, including all columns in the model’s output. This is the same set of columns that a consumer would see when viewing the model’s details in Explorer, or when querying the model in the data platform. 

- If you wish to contract only a subset of columns, you can create a separate model (materialized as a view) selecting only that subset. 
- If you wish to limit which rows or columns a downstream consumer can see when they query the model’s data, depending on who they are, some data platforms offer advanced capabilities around dynamic row-level access and column-level data masking.

</DetailsToggle>

<DetailsToggle alt_header="Can I have multiple owners in a group?">

No, a [group](/docs/collaborate/govern/model-access#groups) can only be assigned to a single owner.  However, the assigned owner can be a _team_, rather than an individual.

</DetailsToggle>

<DetailsToggle alt_header="Can contracts be assigned individual owners?">

Not directly, but contracts are [assigned to models](/docs/collaborate/govern/model-contracts) and models can be assigned to individual owners. You can use meta fields for this purpose.

</DetailsToggle>

<DetailsToggle alt_header="Can I make a model “public” only for specific team(s) to use?">

This is not currently possible, but something we hope to enable in the near future. If you’re interested in this functionality, please reach out to your dbt Labs account team.

</DetailsToggle>

<DetailsToggle alt_header="Is it possible to orchestrate job runs across multiple different projects?">

dbt Cloud will soon offer the capability to trigger jobs on the completion of another job, including a job in a different project. This offers one mechanism for executing a pipeline from start to finish across projects.

</DetailsToggle>

<DetailsToggle alt_header="Integrations available between the dbt Cloud Discovery API and other tools for cross-project lineage?">

Yes. In addition to being viewable natively through [dbt Explorer](https://www.getdbt.com/product/dbt-explorer), it is possible to view cross-project lineage connect using partner integrations with data cataloging tools. For a list of available dbt Cloud integrations, refer to the [Integrations page](https://www.getdbt.com/product/integrations).

</DetailsToggle>

<DetailsToggle alt_header="How does data restatement work in dbt Mesh, particularly when fixing a data set bug?">

Tests and model contracts in dbt help eliminate the need to restate data in the first place. With these tools, you can incorporate checks at the source and output layers of your dbt projects to assess data quality in the most critical places. When there are changes in transformation logic (for example, the definition of a particular column is changed), restating the data is as easy as merging the updated code and running a dbt Cloud job.

If a data quality issue does slip through, you also have the option of simply rolling back the git commit, and then re-running the dbt Cloud job with the old code.

</DetailsToggle>

<DetailsToggle alt_header="How does dbt handle job run logs and can it feed them to standard monitoring tools, reports, etc.?">

Yes, all of this metadata is accessible via the [dbt Cloud Admin API](/docs/dbt-cloud-apis/admin-cloud-api). This metadata can be fed into a monitoring tool, or used to create reports and dashboards. 

We also expose some of this information in dbt Cloud itself in [jobs](/docs/deploy/jobs), [environments](/docs/environments-in-dbt) and in [dbt Explorer](https://www.getdbt.com/product/dbt-explorer).

</DetailsToggle>

<DetailsToggle alt_header="Can dbt Mesh reference models in other accounts within the same data platform?">

You can reference models in other accounts within the same data platform by leveraging the data-sharing capabilities of that platform, as long as the database identifier of the public model is consistent across the producer and consumer. 

For example, [Snowflake cross-account data shares](https://docs.snowflake.com/en/user-guide/data-sharing-intro), [Databricks Unity Catalog across workspaces](https://docs.databricks.com/en/data-governance/unity-catalog/index.html), or multiple BigQuery projects. 

</DetailsToggle>

## Permissions and access

<DetailsToggle alt_header="How do user access permissions work in dbt Mesh? ">

The existence of projects that have at least one public model will be visible to everyone in the organization with [read-only access](/docs/cloud/manage-access/seats-and-users). 

Private or protected models require a user to have read-only access to the specific project to see its existence.

</DetailsToggle>

<DetailsToggle alt_header="How do all the different types of “access” interact?">

There’s model-level access within dbt, role-based access for users and groups in dbt Cloud, and access to the underlying data within the data platform.

First things first: access to underlying data is always defined and enforced by the underlying data platform (for example, BigQuery, Databricks, Redshift, Snowflake, Starburst, etc.) This access is managed by executing “DCL statements” (namely `grant`). dbt makes it easy to [configure `grants` on models](/reference/resource-configs/grants), which provision data access for other roles/users/groups in the data warehouse. However, dbt does _not_ automatically define or coordinate those grants unless they are configured explicitly. Refer to your organization's system for managing data warehouse permissions.

[dbt Cloud Enterprise plans](https://www.getdbt.com/pricing) support [role-based access control (RBAC)](/docs/cloud/manage-access/about-user-access#role-based-access-control-) that manages granular permissions for users and user groups. You can control which users can see or edit all aspects of a dbt Cloud project. A user’s access to dbt Cloud projects also determines whether they can “explore” that project in detail. Roles, users, and groups are defined within the dbt Cloud application via the UI or by integrating with an identity provider.

[Model access](/docs/collaborate/govern/model-access) defines where models can be referenced. It also informs the discoverability of those projects within dbt Explorer. Model `access` is defined in code, just like any other model configuration (`materialized`, `tags`, etc).

* **Public:** Models with `public` access can be referenced everywhere. These are the “data products” of your organization.

* **Protected:** Models with `protected` access can only be referenced within the same project. This is the default level of model access. 
We are discussing a future extension to `protected` models to allow for their reference in _specific_ downstream projects. Please read [the GitHub issue](https://github.com/dbt-labs/dbt-core/issues/9340), and upvote/comment if you’re interested in this use case.

* **Private:** Model `groups` enable more-granular control over where `private` models can be referenced. By defining a group, and configuring models to belong to that group, you can restrict other models (not in the same group) from referencing any `private` models the group contains. Groups also provide a standard mechanism for defining the `owner` of all resources it contains.

Within dbt Explorer, `public` models are discoverable for every user in the dbt Cloud account — every public model is listed in the “multi-project” view. By contrast, `protected` and `private` models in a project are visible only to users who have access to that project (including read-only access).

Because dbt does not implicitly coordinate data warehouse `grants` with model-level `access`, it is possible for there to be a mismatch between them. For example, a `public` model’s metadata is viewable to all dbt Cloud users, anyone can write a `ref` to that model, but when they actually run or preview, they realize they do not have access to the underlying data in the data warehouse. **This is intentional.** In this way, your organization can retain least-privileged access to underlying data, while providing visibility and discoverability for the wider organization. Armed with the knowledge of which other “data products” (public models) exist — their descriptions, their ownership, which columns they contain — an analyst on another team can prepare a well-informed request for access to the underlying data.

</DetailsToggle>

<DetailsToggle alt_header="Is it possible to request access permissions from other teams within dbt Cloud?">

Not currently! But this is something we may evaluate in the future.

</DetailsToggle>

<DetailsToggle alt_header="As a central data team member, can I still maintain visibility on the entire organizational DAG?">

Yes! As long as a user has permissions (at least read-only access) on all projects in a dbt Cloud account, they can navigate across the entirety of the organization’s DAG in dbt Explorer, and see models at all levels of detail.

</DetailsToggle>

<DetailsToggle alt_header="How can I limit my developers from accessing sensitive production data when referencing from other projects?">

By default, cross-project references resolve to the “Production” deployment environment of the upstream project. If your organization has genuinely different data in production versus non-production environments, this poses an issue.

For this reason, we rolled out canonical type of deployment environment: “[Staging](/docs/deploy/deploy-environments#staging-environment).” If a project defines both a “Production” environment and a “Staging” environment, then cross-project references from development and “Staging” environments will resolve to “Staging,” whereas only references coming from “Production” environments will resolve to “Production.” In this way, you are guaranteed separation of data environments, without needing to duplicate project configurations.

</DetailsToggle>

<DetailsToggle alt_header="Does dbt Mesh work if projects are 'duplicated' (dev project <> prod project)?">

The short answer is "no." Cross-project references require that each project `name` be unique in your dbt Cloud account.

Historical limitations required customers to "duplicate" projects so that one actual dbt project (codebase) would map to more than one dbt Cloud project. To that end, we are working to remove the historical limitations that required customers to "duplicate" projects in dbt Cloud — Staging environments for data isolation, environment-level permissions, and environment-level data warehouse connections (coming soon). Once those pieces are in place, it should no longer be necessary to define separate dbt Cloud projects to isolate data environments or permissions.

</DetailsToggle>

## Compatibility with other features

<DetailsToggle alt_header="How does the dbt Semantic Layer relate to and work with dbt Mesh?">

import SLMeshFAQs from '/snippets/_sl-dbt-mesh-faq.md';

The [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) and dbt Mesh are complementary mechanisms enabled by dbt Cloud that work together to enhance the management, usability, and governance of data in large-scale data environments.

The Semantic Layer in dbt Cloud allows teams to centrally define business metrics and dimensions. It ensures consistent and reliable metric definitions across various analytics tools and platforms.

dbt Mesh enables organizations to split their data architecture into multiple domain-specific projects, while retaining the ability to reference “public” models across projects. It is also possible to reference a “public” model from another project for the purpose of defining semantic models and metrics. Your organization can have multiple dbt projects feed into a unified semantic layer, ensuring that metrics and dimensions are consistently defined and understood across these domains.

<SLMeshFAQs/>

</DetailsToggle>

<DetailsToggle alt_header="How does dbt Explorer relate to and work with dbt Mesh?">

**[dbt Explorer](/docs/collaborate/explore-projects)** is a tool within dbt Cloud that serves as a knowledge base and lineage visualization platform. It provides a comprehensive view of your dbt assets, including models, tests, sources, and their interdependencies.

Used in conjunction with dbt Mesh, dbt Explorer becomes a powerful tool for visualizing and understanding the relationships and dependencies between models across multiple dbt projects.

</DetailsToggle>

<DetailsToggle alt_header="How does the dbt Cloud CLI relate to and work with dbt Mesh?">

The [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) allows users to develop and run dbt commands from their preferred development environments, like VS Code, Sublime Text, or terminal interfaces. This flexibility is particularly beneficial in a dbt Mesh setup, where managing multiple projects can be complex. Developers can work in their preferred tools while leveraging the centralized capabilities of dbt Cloud.

</DetailsToggle>

## Availability

<DetailsToggle alt_header="Does dbt Mesh require me to be on a specific version of dbt?">

Yes, your account must be on [at least dbt v1.6](/docs/dbt-versions/upgrade-dbt-version-in-cloud) to take advantage of [cross-project dependencies](/docs/collaborate/govern/project-dependencies), one of the most crucial underlying capabilities required to implement a dbt Mesh.

</DetailsToggle>

<DetailsToggle alt_header="Is there a way to leverage dbt Mesh capabilities in dbt Core?">

While dbt Core defines several of the foundational elements for dbt Mesh, dbt Cloud offers an enhanced experience that leverages these elements for scaled collaboration across multiple teams, facilitated by multi-project discovery in dbt Explorer that’s tailored to each user’s access.

Several key components that underpin the dbt Mesh pattern, including model contracts, versions, and access modifiers, are defined and implemented in dbt Core. We believe these are components of the core language, which is why their implementations are open source. We want to define a standard pattern that analytics engineers everywhere can adopt, extend, and help us improve.

To reference models defined in another project, users can also leverage [packages](/docs/build/packages), a longstanding feature of dbt Core. By importing an upstream project as a package, dbt will import all models defined in that project, which enables the resolution of cross-project references to those models. They can be [optionally restricted](/docs/collaborate/govern/model-access#how-do-i-restrict-access-to-models-defined-in-a-package) to just the models with `public` access.

The major distinction comes with dbt Cloud's metadata service, which is unique to the dbt Cloud platform and allows for the resolution of references to only the public models in a project. This service enables users to take dependencies on upstream projects, and reference just their `public` models, *without* needing to load the full complexity of those upstream projects into their local development environment.

</DetailsToggle>

<DetailsToggle alt_header="Does dbt Mesh require a specific dbt Cloud plan?">

Yes, a [dbt Cloud Enterprise](https://www.getdbt.com/pricing) plan is required to set up multiple projects and reference models across them.

</DetailsToggle>

## Tips on implementing dbt Mesh

<DetailsToggle alt_header="Is there a recommended migration or implementation process?">

Refer to our developer guide on [How we structure our dbt Mesh projects](https://docs.getdbt.com/best-practices/how-we-mesh/mesh-1-intro). You may also be interested in watching the recording of this talk from Coalesce 2023: [Unlocking model governance and multi-project deployments with dbt-meshify](https://www.youtube.com/watch?v=FAsY0Qx8EyU).

You can also learn how to implement dbt Mesh by following our [Quickstart dbt Mesh](/guides/mesh-qs) guide.

</DetailsToggle>

<DetailsToggle alt_header="Are there tools available to help me migrate to a dbt Mesh?">

`dbt-meshify` is a [CLI tool](https://github.com/dbt-labs/dbt-meshify) that automates the creation of model governance and cross-project lineage features introduced in dbt-core v1.5 and v1.6. This package will leverage your dbt project metadata to create and/or edit the files in your project to properly configure the models in your project with these features.
</DetailsToggle>

<DetailsToggle alt_header="My team isn’t structured to require multiple projects today. What aspects of dbt Mesh are relevant to me?">

Let’s say your organization has fewer than 500 models and fewer than a dozen regular contributors to dbt. You're operating at a scale well served by the monolith (a single project), and the larger pattern of dbt Mesh probably won't provide any immediate benefits.

It’s never too early to think about how you’re organizing models _within_ that project. Use model `groups` to define clear ownership boundaries and `private` access to restrict purpose-built models from becoming load-bearing blocks in an unrelated section of the DAG. Your future selves will thank you for defining these interfaces, especially if you reach a scale where it makes sense to “graduate” the interfaces between `groups` into boundaries between projects.

</DetailsToggle>
