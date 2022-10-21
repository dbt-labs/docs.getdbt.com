---
title: "Choosing a dbt version"
id: "cloud-choosing-a-dbt-version"
---

In dbt Cloud, both jobs and environments are configured to use a specific version of dbt Core. The version can be upgraded at any time.

### Environments

Navigate to the settings page of an environment, then click **edit**. Click the **dbt Version** dropdown bar and make your selection. From this list, you can select an available version of Core to associate with this environment.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/Environment-settings.png" title="Settings of a dbt Cloud environment"/>

Be sure to save your changes before navigating away.

### Jobs

Each job in dbt Cloud can be configured to inherit parameters from the environment it belongs to.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/job-settings.png" title="Settings of a dbt Cloud job"/>

The example job seen in the screenshot above belongs to the environment "Prod". It inherits the dbt version of its environment as shown by the **Inherited from ENVIRONMENT_NAME (DBT_VERSION)** selection. You may also manually override the dbt version of a specific job to be any of the current Core releases supported by Cloud by selecting another option from the dropdown.

## Supported Versions

We have always encouraged our customers to upgrade dbt Core versions whenever a new minor version is released. We released our first major version of dbt - `dbt 1.0` - in December 2021. Alongside this release, we updated our policy on which versions of dbt Core we will support in dbt Cloud.


 > **Starting with v1.0, any subsequent minor versions will be supported in dbt Cloud for 1 year post release. At the end of the 1 year window, accounts must upgrade to a supported version of dbt or risk service disruption.**

We will continue to update this table so that customers know when we plan to stop supporting different versions of Core in dbt Cloud.

<Snippet src="core-versions-table" />


:::warning ⚠️ v0.X Non-Supported Period
 Accounts had until the end of June 2022 to upgrade to dbt 1.0 or later. Pre-dbt 1.0 versions will no longer receive patch fixes, and our support team will no longer assist with dbt version specific help on non-supported versions of dbt. Additionally, jobs running dbt versions prior to 1.0 may experience service disruptions before the end of the year and may be removed from the dbt Cloud context by year end. You will receive additional notification before any planned disruption to your production jobs.
:::

Starting in v1.0, dbt Cloud will ensure that you're always using the latest compatible patch release of `dbt-core` and plugins, including all the latest fixes. You may also choose to try prereleases of those patch releases before they are generally available.

<!--- TODO: Include language to reflect:
  - notifying users when new minor versions are available
  - notifying users when using a minor version that is nearing the end of its critical support period
  - auto-upgrading users to the subsequent minor version when critical support ends
--->

For more on version support and future releases, see [Understanding dbt Core versions](core-versions).

#### What will actually happen on the end of support date?

1 year post a minor version release of v1.X, we will try to run our users' projects on the latest release of dbt if they have not already upgraded their projects themselves. In a post dbt v1.0 world, there won't be breaking changes between minor versions of dbt, so we might be reasonably successful at upgrading our users' versions for them. However, our strong preference is for accounts to try to manage the upgrade process themselves which is a more cautious way to prevent failures to their production pipelines. We will give accounts consistent communication that they're hitting the end of their supported window, so they can plan accordingly.

#### What should you be doing today?

You should **upgrade to v1.0 as soon as you can** - and we recommend that you proceed **slowly and steadily**.

Why? Because attempting to upgrade 6 minor versions at one time (v0.15.0 —> v0.21.0) implies 6x the potential for breaking changes, versus upgrading a single minor version.

Refactoring code is much easier when you're updating a well-defined, constrained surface area. Doing things incrementally is the way to go.

Additionally upgrading to more recent versions of dbt Core will enable better performance and more features in dbt Cloud. Below is a compatability matrix between dbt versions and dbt Cloud features. Hopefully this provides more motivation to always update your environments and jobs to run the latest version of dbt.

| dbt Cloud Feature | dbt Core Version Needed |
| ------------- | -------------- |
| [Environment variable secret scrubbing](/docs/build/environment-variables#handling-secrets)| v1.0+ |
| DAG in the IDE | v0.20.0+|
| [Metadata API](/docs/dbt-cloud-apis/metadata-api) |v0.19.0+|
| [Dashboard status tiles](/docs/deploy/dashboard-status-tiles) | v0.19.0+ |
| [Slim CI](/docs/deploy/cloud-ci-job) | v0.18.0+ |

#### Need help upgrading?

If you want more advice on how to upgrade your dbt projects, check out our [migration guides](/guides/migration/versions/) and our [upgrading Q&A page](/docs/dbt-versions/upgrade-core-in-cloud).
