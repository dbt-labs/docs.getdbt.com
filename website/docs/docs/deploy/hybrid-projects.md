---
title: "About hybrid projects"
sidebar_label: "About hybrid projects"
description: "Learn how to upload dbt artifacts into the dbt platform to create and set up hybrid projects."
pagination_next: "docs/deploy/hybrid-setup"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# About hybrid projects

<IntroText>
With hybrid projects, your organization can integrate local or externally deployed <Constant name="core" /> and <Constant name="fusion" /> workflows with the <Constant name="dbt_platform" /> by automatically uploading [artifacts](/reference/artifacts/dbt-artifacts) to the platform.
</IntroText>

:::tip Available in public preview
Hybrid projects are available in public preview to [<Constant name="dbt_platform" /> Enterprise+ accounts](https://www.getdbt.com/pricing).
:::

You can upload artifacts such as [run_results.json](/reference/artifacts/run-results-json), [manifest.json](/reference/artifacts/manifest-json), [catalog.json](/reference/artifacts/catalog-json), and [sources.json](/reference/artifacts/sources-json) to the <Constant name="dbt_platform" /> after executing a run locally or in an external environment. This helps you:

- Collaborate across projects by visualizing and using [cross-project references](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) to models in hybrid projects.
- View models and assets in [<Constant name="catalog" />](/docs/explore/explore-projects). To view <Constant name="catalog" />, you must have a [read-only seat](/docs/platform/manage-access/seats-and-users).

Hybrid projects can also upload [semantic_manifest.json](/reference/artifacts/sl-manifest). In <Constant name="fusion" />, hybrid projects upload the artifact when the run generates it using the [latest Semantic Layer specification](/docs/build/latest-metrics-spec). In <Constant name="core" />, you can upload the semantic manifest from versions 1.11.16 and later, 1.12.6 and later, and 1.13.0b1 and later.

## Prerequisites

To upload artifacts, make sure you meet these prerequisites:

- Your organization is on a [<Constant name="dbt_platform" /> Enterprise+ plan](https://www.getdbt.com/pricing).
- Your <Constant name="dbt_platform" /> account is on [release tracks](/docs/dbt-versions/dbt-release-tracks), and your project is configured for the [latest supported version](/docs/dbt-versions) of dbt.
- You have [configured](/docs/deploy/hybrid-setup#create-hybrid-project) a hybrid project in the <Constant name="dbt_platform" />.
- You have updated your existing <Constant name="dbt" /> project with the latest changes and [configured it with model access](/docs/deploy/hybrid-setup#make-dbt-models-public):
    - Ensure models that you want to share with other <Constant name="dbt_platform" /> projects use `access: public` in their model configuration. This makes the models more discoverable and shareable.
    - Learn more about [access modifiers](/docs/mesh/govern/model-access#access-modifiers) and how to set the [`access` config](/reference/resource-configs/access).
- You have updated your [<Constant name="dbt_platform" /> permissions](/docs/platform/manage-access/enterprise-permissions) to create a new project in the <Constant name="dbt_platform" />.

:::note
Uploading artifacts doesn't count against <Constant name="dbt_platform" /> run slots.
:::
