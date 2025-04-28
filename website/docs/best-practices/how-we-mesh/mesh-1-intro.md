---
title: "Intro to dbt Mesh"
description: Getting started with dbt Mesh patterns
hoverSnippet: Learn how to get started with dbt Mesh
---

## What is dbt Mesh?

import Mesh from '/snippets/_what-is-mesh.md';

<Mesh feature={'/snippets/_what-is-mesh.md'} />

## When is the right time to use dbt Mesh?

The multi-project architecture helps organizations with mature, complex transformation workflows in dbt increase the flexibility and performance of their dbt projects. If you're already using dbt and your project has started to experience any of the following, you're likely ready to start exploring this paradigm:

- The **number of models** in your project is degrading performance and slowing down development.
- Teams have developed **separate workflows** and need to decouple development from each other.
- Teams are experiencing **communication challenges**, and the reliability of some of your data products has started to deteriorate.
- **Security and governance** requirements are increasing and would benefit from increased isolation.

<Constant name="cloud" /> is designed to coordinate the features above and simplify the complexity to solve for these problems.

If you're just starting your dbt journey, don't worry about building a multi-project architecture right away. You can _incrementally_ adopt the features in this guide as you scale. The collection of features work effectively as independent tools. Familiarizing yourself with the tooling and features that make up a multi-project architecture, and how they can apply to your organization will help you make better decisions as you grow.

For additional information, refer to the [<Constant name="mesh" /> FAQs](/best-practices/how-we-mesh/mesh-5-faqs).

## Learning goals

- Understand the **purpose and tradeoffs** of building a multi-project architecture.
- Develop an intuition for various **<Constant name="mesh" /> patterns** and how to design a multi-project architecture for your organization.
- Establish recommended steps to **incrementally adopt** these patterns in your dbt implementation.
