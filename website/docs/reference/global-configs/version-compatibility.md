---
title: "Checking version compatibility"
id: "version-compatibility"
sidebar: "Version compatibility"
---

For the first several years of dbt Core's development, breaking changes were more common. For this reason, we encouraged setting [dbt version requirements](/reference/project-configs/require-dbt-version) &mdash; especially if they use features that are newer or which may break in future versions of dbt Core. By default, if you run a project with an incompatible dbt version, dbt will raise an error.

You can use the `VERSION_CHECK` config to disable this check and suppress the error message:

```
dbt --no-version-check run
Running with dbt=1.0.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```

:::note dbt Cloud release tracks
<Snippet path="_config-dbt-version-check" />

:::
