---
title: "Intro to dbt Mesh"
description: Getting started with dbt Mesh patterns
hoverSnippet: Learn how to get started with dbt Mesh
---

## What is dbt Mesh?

Organizations of all sizes rely upon dbt to manage their data transformations, from small startups to large enterprises. At scale, it can be challenging to coordinate all the organizational and technical requirements demanded by your stakeholders within the scope of a single dbt project. To date, there also hasn't been a first-class way to effectively manage the dependencies, governance, and workflows between multiple dbt projects.

Regardless of your organization's size and complexity, dbt should empower data teams to work independently and collaboratively; sharing data, code, and best practices without sacrificing security or autonomy. dbt Mesh provides the tooling for teams to finally achieve this.

dbt Mesh is not a single product: it is a pattern enabled by a convergence of several features in dbt:

- **[Cross-project references](/docs/collaborate/govern/project-dependencies#usage)** - this is the foundational feature that enables the multi-project deployments. `{{ ref() }}`s now work across dbt Cloud projects on Enterprise plans.
- **[dbt Explorer](/docs/collaborate/explore-projects)** - dbt Cloud's metadata-powered documentation platform, complete with full, cross-project lineage.
- **Governance** - dbt's new governance features allow you to manage access to your dbt models both within and across projects.
  - **[Groups](/docs/build/groups)** - groups allow you to assign models to subsets of models within a project.
  - **[Access](/docs/collaborate/govern/model-access)** - access configs allow you to control who can reference models.
- **[Model Versions](/docs/collaborate/govern/model-versions)** - When coordinating across projects and teams, we recommend treating your data models as stable APIs. Model versioning is the mechanism to allow graceful adoption and deprecation of models as they evolve.
- **[Model Contracts](/docs/collaborate/govern/model-contracts)** - data contracts set explicit expectations on the shape of the data to ensure data changes upstream of dbt or within a project's logic don't break downstream comsumers' data products.

## Who is dbt Mesh for?

The multi-project architecture is for organizations with mature, complex transformation workflows in dbt who want to increase the flexibilty and performance of their dbt projects. If you're already using dbt and your project has started to experience any of the following, you're likely ready to start exploring this paradigm:

- **The number of models** in your project is degrading performance and slowing down development.
- Teams have developed **separate workflows** and need to decouple development from each other.
- **Security and governance** requirements are increasing and would benefit from increased isolation.

dbt Cloud is designed to coordinate the features above and simplify the complexity to solve for these problems.

If you're just starting your dbt journey, don't worry about building a multi-project architecture right away. You can _incrementally_ adopt the features in this guide as you scale. The collection of features work effectively as independent tools. Familiarizing yourself with the tooling and features that make up a multi-project architecture, and how they can apply to your organization will help you make better decisions as you grow.

## Learning goals

- Understand the **purpose and tradeoffs** of building a multi-project architecture.
- Develop an intuition for various **dbt Mesh patterns** and how to design a multi-project architecture for your organization.
- Establish recommended steps to **incrementally adopt** these patterns in your dbt implementation.
