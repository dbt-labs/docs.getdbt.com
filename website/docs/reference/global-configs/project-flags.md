---
title: "Project flags"
id: "project-flags"
sidebar: "Project flags"
---

<File name='dbt_project.yml'>

```yaml

flags:
  <global_config>: <value>

```

</File>

Reference the [table of all flags](/reference/global-configs/about-global-configs#available-flags) to see which global configs are available for setting in [`dbt_project.yml`](/reference/dbt_project.yml).

The `flags` dictionary is the _only_ place you can opt out of [behavior changes](/reference/global-configs/behavior-changes), while the legacy behavior is still supported.