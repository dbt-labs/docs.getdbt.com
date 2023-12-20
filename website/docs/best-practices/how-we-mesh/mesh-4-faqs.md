---
title: "dbt Mesh FAQs"
description: "Read some frequently asked questions about dbt Mesh."
hoverSnippet: "dbt Mesh FAQs"
sidebar_label: "Frequently asked dbt Mesh questions"
---

dbt Mesh is a new architecture enabled by dbt Cloud. It allows you to better manage complexity by deploying multiple interconnected dbt projects instead of a single large, monolithic project. It’s designed to accelerate development, without compromising governance.

The following frequently asked questions (FAQs) are categorized into the following topics:

- Overview of dbt Mesh
- How dbt Mesh works
- Access and permissions
- Compatibility with other features
- When and where dbt Mesh is available
- Tips on implementing dbt Mesh

## Overview of Mesh

<detailsToggle alt_header="How do I implement contracts for my models?">

In dbt, [model contracts](https://docs.getdbt.com/docs/collaborate/govern/model-contracts) serve as a governance tool enabling the definition and enforcement of data structure standards in your dbt models. They allow you to specify and uphold data model guarantees, including column data types, allowing for stability of dependent models. Should a model fail to adhere to its established contracts, it will not successfully build.

</detailsToggle>

<detailsToggle alt_header="What are model versions?">

dbt [model versions](https://docs.getdbt.com/docs/collaborate/govern/model-versions) are iterations of your dbt models made over time. In many cases, you may knowingly choose to change a model’s structure in a way that “breaks” the previous model contract — when you do so, you find it useful to create a new version of the model to signify this change.

You can use use **model versions** to:

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

<detailsToggle alt_header="What are some potential drawbacks of using a dbt Mesh?">

This is a new way of working, and the intentionality required to build, and then maintain, cross-project interfaces and dependencies may feel like a slowdown versus what some developers are used to. This way of working introduces intentional friction that makes it more difficult to change everything at once.

Orchestration across multiple projects is also likely to be slightly more challenging for many organizations, although we’re currently developing new functionality that will make this process simpler.

</detailsToggle>
