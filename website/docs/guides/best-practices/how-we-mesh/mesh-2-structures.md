---
title: "Deciding how to structure your mesh"
description: Getting started with dbt Mesh patterns
hoverSnippet: Learn how to get started with dbt Mesh
---

## Exploring mesh patterns

Building a mesh is not a one-size-fits-all process. In fact, it's the opposite, it's about customizing your project structure to fit _your_ team and _your_ data. Often we've had to fit the data team and project structure into our company's org chart, or manage everything in one project to handle the constraints of our data and warehouse. dbt Mesh allows us to mold our organizational knowledge graph to our organizational people graph, bringing people and data closer together rather than compromising one for the other.

## Vertical splits

Vertical splits are about separating out layers of transformation in the DAG order. For example, splitting up staging and mart layers. Often the vertical separation will be based around security and governance requirements, such as separating out PII data from non-PII data and restricting raw data access to a platform team that's responsible for landing and cleaning data.

## Horizontal splits

Horizonal splits are about splitting up the data based on source or domain. Often the horizontal separation will be based around team consumption patterns, such as splitting out marketing data and financial data. Another common vector of horizontal splitting is data from different sources, such as click event data and transactional ecommerce data. These splits are often based around the shape and size of the data and how it's used, rather than the security or governance requirements.

## Combining these divisions

- These are not either/or techniques, you can and should combine them in any way that makes sense for your organization.

- **DRY applies to underlying data not just code.** Regardless of your split, you should not be sourcing the same rows and columns into multiple meshes. Working within a mesh structure it becomes increasingly important that we don’t duplicate work, which creates surface error for conflicts and erodes the single source of truth we're trying to create in our dbt project.

## Monorepo vs multi-repo

- A dbt Mesh can exist as multiple projects in a single repo (monorepo) or as multiple projects in their own repositories (multi-repo).
- Monorepos are often easier to get started with, but can become unwieldy as the number of models and teams grow.
- If you're a smaller team looking primarily to speed up and simplify development, a monorepo is likely the right choice.
- If you're a larger team with multiple groups, and need to decouple projects for security and enablement of different development styles and rhythms, a multi-repo is your best bet.
