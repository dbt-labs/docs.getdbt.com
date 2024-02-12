---
title: "Checking version compatibility"
id: "version-compatibility"
sidebar: "Version compatibility"
---

In the first several years of dbt Core's development, breaking changes were more common. For this reason, we encouraged users to set [dbt version requirements](/reference/project-configs/require-dbt-version) for their projects or packages — especially if they use features that are newer, or which might break in future versions of dbt Core.

In December 2021, we released dbt Core v1.0, which promised stability for the code in dbt projects and packages, and backwards compatibility in all new versions of dbt-core.

Starting in 2024, if you select **Keep on latest version** <Lifecycle status='beta' />, dbt Cloud will ignore version checking. Instead of using this configuration, we recommend:
- **Writing defensive code.** If you developing dbt code that may be run in a variety of execution contexts (such as a package), and you depend on newer dbt functionality, you can add conditional logic that checks for the presence of other packages or macros.
- **Pinning packages.** If you are maintaining a dbt project that installs third-party packages, and you are concerned about the potential for breaking changes in those packages, you should pin the package to a specific revision or `version` boundary. Since v1.7, this is also the default dbt behavior, by "locking" the version/revision of Hub/git packages in development in order to guarantee predictable builds in production.

### Legacy behavior

In older versions of dbt-core, if you run a project with an incompatible dbt version, dbt will raise an error.

You can use the `VERSION_CHECK` config to disable this check and suppress the error message:

```
dbt --no-version-check run
Running with dbt=1.0.0
Found 13 models, 2 tests, 1 archives, 0 analyses, 204 macros, 2 operations....
```
