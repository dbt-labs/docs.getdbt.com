---
title: "Choosing a dbt version"
id: "cloud-choosing-a-dbt-version"
---

In dbt Cloud, both jobs and environments are configured to use some version of dbt Core. This can be altered at any time.

### Environments

Navigate to the settings page of an environment, then click **edit**. Click the 'dbt version' dropdown bar and make your selection. From this list, you can select an available version of Core to associate with this environment.

<Lightbox src="/img/dbt-cloud-environment-parameters.png" title="settings of a dbt Cloud Environment"/>

Be sure to save your changes before navigating away.

### Jobs

Each job in dbt Cloud can be configured to inherit parameters from the environment it belongs to.

<Lightbox src="/img/dbt-cloud-job-parameters.png" title="settings of a dbt Cloud Job"/>

The example job seen in the screenshot above belongs to the environment "Redshift - Maintenance." It inherits the dbt version of its environment using the `inherit from <environment name>` option. You may also manually override the dbt version of a specific job to be any of the current Core releases supported by Cloud.

## Supported Versions
:::info DEPRECATION WARNING

Starting November 15, 2021, dbt Cloud will no longer run jobs that use dbt versions older than v0.19.2. See our [migration guides](/docs/guides/migration-guide/upgrading-to-0-20-0) to learn about breaking changes between minor versions of dbt.
:::


Starting November 15, 2021, the following versions of dbt will be supported:

 - v0.20.x
 - v0.19.x

Upgrading from a patch version (ex. v0.20.0 to v0.20.1) will not create any breaking changes, so can and should be done when a new patch is available without much effort from our users.

Upgrading to more recent versions of dbt Core will enable better performance and more features in dbt Cloud. Below is a compatability matrix between dbt versions and dbt Cloud features. Hopefully this provides more motivation to always update your jobs to run the latest version of dbt.


| Cloud Feature | v0.17.x | v0.18.x| v0.19.x| v0.20.x| v0.21.x|
| ------------- | -------------- | --------------- | --------------- | --------------- | --------------- |
| [Environment variable secret scrubbing](/docs/dbt-cloud/using-dbt-cloud/cloud-environment-variables#handling-secrets)| No | No| No | No | Yes |
| DAG in the IDE | No | No| No | Yes | Yes |
| [Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview.md) | No | No| Yes | Yes | Yes |
| [Dashboard status tiles](/docs/dbt-cloud/using-dbt-cloud/cloud-dashboard-status-tiles) | No | No| Yes | Yes | Yes |
| [Slim CI](/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration-with-github#slim-ci) | No | Yes | Yes | Yes | Yes |