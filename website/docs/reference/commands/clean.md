---
title: "clean"
id: "clean"
---

<Changelog>

- **v1.0.0:** `dbt_modules` has been replaced by `dbt_packages` by default for the [clean-target](clean-targets) for packages.

</Changelog>

`dbt clean` is a utility function that deletes all folders specified in the `clean-targets` list specified in `dbt_project.yml`. You can use this to delete the `dbt_packages` and `target` directories.