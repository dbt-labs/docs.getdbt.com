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

At the present time, the following versions of dbt are supported:

 - v0.19.x
 - v0.18.x
 - v0.17.x
 - v0.16.x
 - v0.15.x
 - v0.14.x
 - v0.13.x

Currently, you can ask dbt jobs to run versions of dbt Core prior to 0.14.x. Be aware that these versions may become unavailable in a future release. And because dbt Cloud leverages components of dbt Core, users running outdated or unsupported versions of Core may find certain features are buggy, disabled, or missing.
