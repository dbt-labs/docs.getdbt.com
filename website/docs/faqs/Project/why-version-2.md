---
title: "Why do model and source YAML files always start with `version: 2`?"
description: ".yml file structure more extensible with version 2."
sidebar_label: 'Why does YAML file start with version 2'
id: why-version-2

---

Once upon a time, the structure of these `.yml` files was very different (s/o to anyone who was using dbt back then!). Adding `version: 2` allowed us to make this structure more extensible.

Starting in [dbt Core v1.5](/docs/dbt-versions/core-upgrade/Older%20versions/upgrading-to-v1.5#quick-hits), the top-level `version:` key is optional in all resource YAML files. If present, only `version: 2` is supported.

Also optional from v1.5, in `dbt_project.yml`, both [`config-version: 2`](/reference/project-configs/config-version) and the top-level `version:` key are now optional.

### Why keep `version:` at all?
While no longer required, including `version: 2` remains harmless and can make intent explicit—especially in projects that mix historical files or third-party packages. If we ever evolve the file structure, an explicit version makes migration clearer.

### Example (valid without `version:`)
```yml
models:
  - name: orders
    description: "Order facts"
    columns:
      - name: order_id
        tests: [unique, not_null]



---

Resource YAML files do not currently require this config. We only support `version: 2` if it's specified. Although we do not expect to update YAML files to `version: 3` soon, having this config will make it easier for us to introduce new structures in the future

