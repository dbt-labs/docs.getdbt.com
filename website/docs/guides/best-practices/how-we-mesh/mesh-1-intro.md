---
title: "Intro to dbt Mesh"
description: Getting started with dbt Mesh patterns
hoverSnippet: Learn how to get started with dbt Mesh
---

## What is dbt Mesh?

Historically, building data teams has involved two extremes, building a centralized team or using embedded analysts. More recently, hub-and-spoke models have become popular as a way to balance the tradeoffs: using a centralized platform team _and_ embedded analysts, allowing embeds to develop domain expertise while the central team focuses on building a strong operational foundation. A major difficultly of this model though is managing the compplexity of dependencies, goverance, and workflows between all groups — creating friction in monorepos or complexity and silos in multi-repos. Ideally, you want to teams to be able to work independently, but also be able to collaborate; sharing data, code, and best practices. dbt Mesh provides the tooling for teams to finally achieve this.

dbt Mesh is not a product, but a pattern, enabled a convergence of several features in dbt Cloud. It’s inspired by dbt’s best practices and ideas from [data mesh](https://en.wikipedia.org/wiki/Data_mesh). These features include:

- **Cross-project references** - this is the core feature that enables a mesh structure. `ref`s now work across projects in dbt Cloud-enabled projects on Enterprise plans.
- **Governance** - dbt Cloud’s new governance features allow you to manage access and permissions across projects.
  - **Groups** - groups allow you to assign models to subsets of models within a project.
  - **Access** - access configs allow you to control who can view and reference models both within and across projects.
- **Versioning** - building a dbt Mesh involves treating your data models as stable APIs. To achieve this you need mechanisms to version your models and allow graceful adoption and deprecation of models as they evolve.
- **Contracts** - data contracts set strict expectations on the shape of the data to ensure data changes upstream of dbt or within a project's logic don't break downstream consumers.

## Who is dbt Mesh for?

dbt Mesh is not for every organization! If you're just starting your dbt journey, don't worry about building a dbt Mesh right away, it increases some meta-complexity around managing your projects that could distract from building initial value in dbt. However, if you're already using dbt and your project has started to experience any of the following, you're likely ready to start exploring a dbt Mesh:

- **The number of models** in your project is degrading performance and slowing down development.
- Teams have developed **separate workflows** and need to decouple development.
- **Security and governance** requirements are increasing and would benefit from increased isolation.

dbt Cloud is designed to coordinate the features above and simplify the meta-complexities (such as scoped CI and multi-project lineage) to solve for these problems.

## Learning goals

- Understand the **purpose and tradeoffs** of building a dbt Mesh.
- Develop an intuition for various **dbt Mesh patterns** and how to design a dbt Mesh for your organization.
- Establish recommended steps to **incrementally adopt** a dbt Mesh pattern in your dbt implementation.
- Offer **tooling** to help you more quickly and easily implement your dbt Mesh plan.
