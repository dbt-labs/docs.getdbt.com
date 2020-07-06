---
title: "init"
id: "init"
---

`dbt init [project_name]` performs several actions necessary to create a new dbt project:

- creates a `~/.dbt/profiles.yml` file if one does not already exist
- creates a new folder called `[project_name]`
- generates directories and sample files necessary to get started with dbt