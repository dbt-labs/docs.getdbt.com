---
datatype: [directorypath]
description: "Read this guide to understand the asset-paths configuration in dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
asset-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories to copy to the `target` directory as part of the `docs generate` command. This is useful for rendering images in your repository in your project documentation.


## Default

By default, dbt will not copy any additional files as part of docs generate. For example, `asset-paths: []`.

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="asset-paths"
absolute="/Users/username/project/assets"
/>

- ✅ **Do**
  - Use relative path:
    ```yml
    asset-paths: ["assets"]
    ```

- ❌ **Don't**
  - Avoid absolute paths:
    ```yml
    asset-paths: ["/Users/username/project/assets"]
    ```

## Examples
### Compile files in the `assets` subdirectory as part of `docs generate`

<File name='dbt_project.yml'>

```yml
asset-paths: ["assets"]
```

</File>

Any files included in this directory will be copied to the `target/` directory as part of `dbt docs generate`, making them accessible as images in your project documentation.

Check out the full writeup on including images in your descriptions [here](/reference/resource-properties/description/#include-an-image-from-your-repo-in-your-descriptions).
