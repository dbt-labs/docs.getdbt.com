---
datatype: [directorypath]
description: "Read this guide to understand the snapshot-paths configuration in dbt."
default_value: [snapshots]
---
<File name='dbt_project.yml'>

```yml
snapshot-paths: [directorypath]
```

</File>

## Definition

Optionally specify a custom list of directories where [snapshots](/docs/build/snapshots) are located. 

<VersionBlock firstVersion="1.9">
In dbt Core v1.9+, you can co-locate your snapshots with models if they are [defined using the latest YAML syntax](/docs/build/snapshots). 
</VersionBlock>

<VersionBlock lastVersion="1.8">
Note that you cannot co-locate models and snapshots. However, in dbt Core v1.9+, you can co-locate your snapshots with models if they are [defined using the latest YAML syntax](/docs/build/snapshots).
</VersionBlock>

## Default
By default, dbt will search for snapshots in the `snapshots` directory. For example, `snapshot-paths: ["snapshots"]`. 


import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="snapshot-paths"
absolute="/Users/username/project/snapshots"
/>

- ✅ **Do**
  - Use relative path:
    ```yml
    snapshot-paths: ["snapshots"]
    ```

- ❌ **Don't:**
  - Avoid absolute paths:
    ```yml
    snapshot-paths: ["/Users/username/project/snapshots"]
    ```

## Examples
### Use a subdirectory named `archives` instead of `snapshots`

<File name='dbt_project.yml'>

```yml
snapshot-paths: ["archives"]
```

</File>
