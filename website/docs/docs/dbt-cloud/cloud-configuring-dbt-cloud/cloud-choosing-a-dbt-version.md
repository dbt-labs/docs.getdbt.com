---
title: "Choosing a dbt version"
id: "cloud-choosing-a-dbt-version"
---

In dbt Cloud, both jobs and environments are configured to use a specific version of dbt Core. The version can be upgraded at any time.

### Environments

Navigate to the settings page of an environment, then click **edit**. Click the 'dbt version' dropdown bar and make your selection. From this list, you can select an available version of Core to associate with this environment.

<Lightbox src="/img/dbt-cloud-environment-parameters.png" title="settings of a dbt Cloud Environment"/>

Be sure to save your changes before navigating away.

### Jobs

Each job in dbt Cloud can be configured to inherit parameters from the environment it belongs to.

<Lightbox src="/img/dbt-cloud-job-parameters.png" title="settings of a dbt Cloud Job"/>

The example job seen in the screenshot above belongs to the environment "Redshift - Maintenance." It inherits the dbt version of its environment using the `inherit from <environment name>` option. You may also manually override the dbt version of a specific job to be any of the current Core releases supported by Cloud.

## Supported Versions
We have always encouraged our customers to upgrade dbt Core versions whenever a new minor version is released. We are releasing our first major version of dbt - `dbt v1.0.0` - in December 2021. Alongside this release, we are updating our policy on which versions of dbt Core we will support running in dbt Cloud.

 > **By June 30, 2022, all dbt projects in Cloud must be running v1.0 or later. Starting with v1.0, any subsequent minor versions will be allowed to run in Cloud for 1 year post release.**

We will continue to update this table so that customers know when we plan to stop running different versions of Core in Cloud.

| dbt Version | Release Date | Deprecation Date |
| ------------- | -------------- | ------------- | 
| v0.X.X (major version 0 ) | Various Dates | June 30, 2022 |
| v1.0.0 | December 2021 | December 2022 |


#### What will actually happen on the deprecation date?
- On July 1, 2022, we will only run jobs that are on dbt v1.0 or later. Customers must upgrade their projects to be compatible with dbt v1.0 or later.
- 1 year post a minor version release of v1.X, we will try to run our customers' projects on the latest release of dbt if they have not already upgraded their projects themselves. In a post dbt v1.0 world, there won't be breaking changes between minor versions of dbt, so we might be reasonably successful at upgrading our customers' versions automatically. However, our strong preference is for customers to try to manage the upgrade process themselves which is a more cautious way to prevent failures to their production pipelines. 

We will give customers consistent communication that they're hitting the end of their supported window, so they can plan accordingly. 

#### What should you be doing today?
Your migration to v1.0.0 will progress much smoother if you **begin transitioning to more recent versions of dbt as soon as possible.**

Why? Because attempting to upgrade 6 minor versions at one time (v0.15.0 —> v.0.21.0) implies 6x the potential for breaking changes vs. upgrading a single minor version. 

Refactoring code is much easier when you're updating a well-defined, constrained surface area. Doing things incrementally is the way to go.

Additionally upgrading to more recent versions of dbt Core will enable better performance and more features in dbt Cloud. Below is a compatability matrix between dbt versions and dbt Cloud features. Hopefully this provides more motivation to always update your environments and jobs to run the latest version of dbt.



| dbt Cloud Feature | dbt Core Version Needed |
| ------------- | -------------- |
| [Environment variable secret scrubbing](/docs/dbt-cloud/using-dbt-cloud/cloud-environment-variables#handling-secrets)| v0.21.0+ |
| DAG in the IDE | v0.20.0+|
| [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview.md) |v0.19.0+|
| [Dashboard status tiles](/docs/dbt-cloud/using-dbt-cloud/cloud-dashboard-status-tiles) | v0.19.0+ |
| [Slim CI](/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration-with-github#slim-ci) | v0.18.0+ |

#### Need help upgrading?

If you want more advice on how to upgrade your dbt projects, check out our [migration guides](docs/guides/migration-guide/upgrading-to-0-21-0) and our [upgrading Q&A page](docs/dbt-cloud/cloud-configuring-dbt-cloud/cloud-upgrading-dbt-versions).
