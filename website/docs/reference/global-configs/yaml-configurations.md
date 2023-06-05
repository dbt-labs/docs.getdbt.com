---
title: "YAML configurations"
id: "yaml-configurations"
sidebar: "YAML configurations"
---

For most global configurations, you can set "user profile" configurations in the `config:` block of `profiles.yml`. This style of configuration sets default values for all projects using this profile directory—usually, all projects running on your local machine.

<File name='profiles.yml'>

```yaml

config:
  <THIS-CONFIG>: true

```

</File>

<VersionBlock firstVersion="1.2">

The exception: Some global configurations are actually set in `dbt_project.yml`, instead of `profiles.yml`, because they control where dbt places logs and artifacts. Those file paths are always relative to the location of `dbt_project.yml`. For more details, see ["Log and target paths"](#log-and-target-paths) below.

</VersionBlock>