---
title: "Project flags"
id: "project-flags"
sidebar: "Project flags"
---

<File name='dbt_project.yml.yml'>

```yaml

flags:
  <global_config>: <value>

```

</File>

<VersionBlock lastVersion="1.7">

:::warning Deprecated functionality
In older versions of dbt, custom default values of flags (global configs) were set in `profiles.yml`. Starting in v1.8, these configs should be set in `dbt_project.yml` instead.
:::

For most global configurations, you can set "user profile" configurations in the `config:` block of `profiles.yml`. This style of configuration sets default values for all projects using this profile directory—usually, all projects running on your local machine.

<File name='profiles.yml'>

```yaml

config:
  <THIS-CONFIG>: true

```

</File>

</VersionBlock>

<VersionBlock firstVersion="1.2" lastVersion="1.7">

The exception: Some global configurations are actually set in `dbt_project.yml`, instead of `profiles.yml`, because they control where dbt places logs and artifacts. Those file paths are always relative to the location of `dbt_project.yml`. For more details, refer to [Log and target paths](/reference/global-configs/logs#log-and-target-paths).

</VersionBlock>
