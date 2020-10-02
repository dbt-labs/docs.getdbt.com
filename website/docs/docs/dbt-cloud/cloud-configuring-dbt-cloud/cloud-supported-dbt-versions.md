---
title: "Configuring dbt version"
id: "cloud-configuring-dbt-version"
---

In addition to name and type, every environment in dbt Cloud has a 'dbt version' parameter. To set this, clicking the **edit** button on the environment's settings page, then the 'dbt version' drop-down bar.

<img src="/static/img/dbt-cloud-environment-parameters.png" title="General settings of an environment"/>

From this list, you can select an available version of Core to associate with this environment.

Each job in dbt Cloud draws configuration parameters from an environment. This is also selected with a drop-down menu in the Environment section of a job's settings.

<img src="/static/img/dbt-cloud-job-parameters.png" title="General settings of a job"/>

Jobs also have a 'dbt version' parameter as well, which can either be any of the currently available Core versions, or a special 'inherit from environment' option, which is visible in the example screenshot above.

## Supported Versions

At the present time, the following versions of dbt are supported:

 - v0.18.x
 - v0.17.x
 - v0.16.x
 - v0.15.x
 - v0.14.x
 - v0.13.x

While you can currently schedule dbt jobs to run on versions of dbt released prior to 0.14.x, these versions may become unavailable in a future release. Because dbt Cloud leverages functionality built into dbt Core, some functionality in the dbt Cloud application may be unavailable to users running outdated or unsupported versions of dbt Core.
