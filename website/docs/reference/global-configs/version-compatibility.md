---
title: "Checking version compatibility"
id: "version-compatibility"
sidebar: "Version compatibility"
---

<Snippet path="_config-dbt-version-check" />

### Legacy behavior

In older versions of dbt-core, if you run a project with an incompatible dbt version, dbt will raise an error.

You can use the `VERSION_CHECK` config to disable this check and suppress the error message:

```
dbt --no-version-check run
Running with dbt=1.0.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```
