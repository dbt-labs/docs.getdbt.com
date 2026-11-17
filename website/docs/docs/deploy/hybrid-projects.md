---
title: "About Hybrid projects"
sidebar_label: "About hybrid projects"
description: "Learn how to upload dbt artifacts into the dbt platform to create and set up hybrid projects."
pagination_next: "docs/deploy/hybrid-setup"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# About Hybrid projects

<IntroText>
With hybrid projects, your organization can integrate local or externally deployed <Constant name="core" /> and <Constant name="fusion" /> workflows with the <Constant name="dbt_platform" /> by automatically uploading [artifacts](/reference/artifacts/dbt-artifacts) to the platform.
</IntroText>

:::tip Available in public preview
Hybrid projects is available in public preview to [<Constant name="dbt" /> Enterprise accounts](https://www.getdbt.com/pricing).
:::

You can upload artifacts such as [run_results.json](/reference/artifacts/run-results-json), [manifest.json](/reference/artifacts/manifest-json), [catalog.json](/reference/artifacts/catalog-json), and [sources.json](/reference/artifacts/sources-json) to the <Constant name="dbt_platform" /> after executing a run in the <Constant name="dbt" /> command line interface (CLI). This helps you:

- Collaborate across projects by visualizing and using [cross-project references](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) to models in hybrid projects.
- View models and assets in [<Constant name="catalog" />](/docs/explore/explore-projects). To view <Constant name="catalog" />, you must have a [read-only seat](/docs/platform/manage-access/seats-and-users).

Hybrid projects can also upload [semantic_manifest.json](/reference/artifacts/sl-manifest). In <Constant name="fusion" />, the artifact is included when the current run generates it using the [latest Semantic Layer specification](/docs/build/latest-metrics-spec). In <Constant name="core" />, semantic manifest upload is supported in v1.11.16 and later, v1.12.6 and later, and v1.13.0b1 and later.

## Prerequisites

To upload artifacts, make sure you meet these prerequisites:

- Your organization is on a [<Constant name="dbt" /> Enterprise+ plan](https://www.getdbt.com/pricing)
- Your dbt platform account is on [release tracks](/docs/dbt-versions/dbt-release-tracks) and your project is configured for the [latest supported version](/docs/dbt-versions) dbt.
- [Configured](/docs/deploy/hybrid-setup#connect-project-in-dbt-cloud) a hybrid project in <Constant name="dbt" />.
- Updated your existing <Constant name="dbt" /> project with the latest changes and [configured it with model access](/docs/deploy/hybrid-setup#make-dbt-models-public):
    - Ensure models that you want to share with other <Constant name="dbt" /> projects use `access: public` in their model configuration. This makes the models more discoverable and shareable
    - Learn more about [access modifier](/docs/mesh/govern/model-access#access-modifiers) and how to set the [`access` config](/reference/resource-configs/access)
- Update [<Constant name="dbt" /> permissions](/docs/platform/manage-access/enterprise-permissions) to create a new project in <Constant name="dbt" />

**Note:** Uploading artifacts doesn't count against <Constant name="dbt" /> run slots.
