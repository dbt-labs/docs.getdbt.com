---
datatype: [directorypath]
description: "Read this guide to understand the docs-paths configuration in dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
docs-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [docs blocks](/docs/build/documentation#docs-blocks) are located.


## Default

<VersionBlock firstVersion="1.9">

By default, dbt will search in all resource paths for docs blocks (for example, the combined list of [model-paths](/reference/project-configs/model-paths), [seed-paths](/reference/project-configs/seed-paths), [analysis-paths](/reference/project-configs/analysis-paths), [test-paths](/reference/project-configs/test-paths), [macro-paths](/reference/project-configs/macro-paths), and [snapshot-paths](/reference/project-configs/snapshot-paths)). If this option is configured, dbt will _only_ look in the specified directory for docs blocks.

</VersionBlock>

<VersionBlock lastVersion="1.8">

By default, dbt will search in all resource paths for docs blocks (i.e. the combined list of [model-paths](/reference/project-configs/model-paths), [seed-paths](/reference/project-configs/seed-paths), [analysis-paths](/reference/project-configs/analysis-paths), [macro-paths](/reference/project-configs/macro-paths), and [snapshot-paths](/reference/project-configs/snapshot-paths)). If this option is configured, dbt will _only_ look in the specified directory for docs blocks.

</VersionBlock>

## Example

Use a subdirectory named `docs` for docs blocks:

<File name='dbt_project.yml'>

```yml
docs-paths: ["docs"]
```

</File>

**Note:** We typically omit this configuration as we prefer dbt's default behavior.
