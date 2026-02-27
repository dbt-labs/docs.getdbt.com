---
title: "About Hybrid projects"
sidebar_label: "About hybrid projects"
description: "Learn how to upload dbt Core artifacts into the dbt platform to create and set up hybrid projects."
pagination_next: "docs/deploy/hybrid-setup"
---

# About Hybrid projects <Lifecycle status='managed_plus'/>

<IntroText>
With Hybrid projects, your organization can adopt complementary <Constant name="core" /> and <Constant name="cloud" /> workflows (where some teams deploy projects in <Constant name="core" /> and others in <Constant name="cloud" />) and seamlessly integrate these workflows by automatically uploading <Constant name="core" /> [artifacts](/reference/artifacts/dbt-artifacts) into <Constant name="cloud" />.
</IntroText>

:::tip Available in public preview
Hybrid projects is available in public preview to [<Constant name="cloud" /> Enterprise accounts](https://www.getdbt.com/pricing).
:::

<Constant name="core" /> users can seamlessly upload [artifacts](/reference/artifacts/dbt-artifacts) like [run results.json](/reference/artifacts/run-results-json), [manifest.json](/reference/artifacts/manifest-json), [catalog.json](/reference/artifacts/catalog-json), [sources.json](/reference/artifacts/sources-json), and so on &mdash; into <Constant name="cloud" /> after executing a run in the <Constant name="core" /> command line interface (CLI), which helps:

- Collaborate with <Constant name="cloud" /> + <Constant name="core" /> users by enabling them to visualize and perform [cross-project references](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) to dbt models that live in Core projects.
- (Coming soon) New users interested in the [<Constant name="visual_editor" />](/docs/cloud/canvas) can build off of dbt models already created by a central data team in <Constant name="core" /> rather than having to start from scratch.
- <Constant name="core" /> and <Constant name="cloud" /> users can navigate to [<Constant name="explorer" />](/docs/explore/explore-projects) and view their models and assets. To view <Constant name="explorer" />, you must have a [read-only seat](/docs/cloud/manage-access/seats-and-users).

## Prerequisites

To upload artifacts, make sure you meet these prerequisites:

- Your organization is on a [<Constant name="cloud" /> Enterprise+ plan](https://www.getdbt.com/pricing)
- You're on [<Constant name="cloud" />'s release tracks](/docs/dbt-versions/cloud-release-tracks) and your <Constant name="core" /> project is on dbt v1.10 or higher
- [Configured](/docs/deploy/hybrid-setup#connect-project-in-dbt-cloud) a hybrid project in <Constant name="cloud" />.
- Updated your existing <Constant name="core" /> project with latest changes and [configured it with model access](/docs/deploy/hybrid-setup#make-dbt-core-models-public):
    - Ensure models that you want to share with other <Constant name="cloud" /> projects use `access: public` in their model configuration. This makes the models more discoverable and shareable
    - Learn more about [access modifier](/docs/mesh/govern/model-access#access-modifiers) and how to set the [`access` config](/reference/resource-configs/access)
- Update [<Constant name="cloud" /> permissions](/docs/cloud/manage-access/enterprise-permissions) to create a new project in <Constant name="cloud" />

**Note:** Uploading artifacts doesn't count against <Constant name="cloud" /> run slots.
