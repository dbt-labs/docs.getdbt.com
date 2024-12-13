---
datatype: [directorypath]
description: "Read this guide to understand the analysis-paths configuration in dbt."
default_value: []
---

<File name='dbt_project.yml'>

```yml
analysis-paths: [directorypath]
```

</File>

## Definition
Specify a custom list of directories where [analyses](/docs/build/analyses) are located. 

## Default
Without specifying this config, dbt will not compile any `.sql` files as analyses.

However, the [`dbt init` command](/reference/commands/init) populates this value as `analyses` ([source](https://github.com/dbt-labs/dbt-starter-project/blob/HEAD/dbt_project.yml#L15)).

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="analysis-paths"
absolute="/Users/username/project/analyses"
/>

- ✅ **Do** 
  - Use relative path:
    ```yml
    analysis-paths: ["analyses"]
    ```

- ❌ **Don't** 
  - Avoid absolute paths:
    ```yml
    analysis-paths: ["/Users/username/project/analyses"]
    ```

## Examples
### Use a subdirectory named `analyses`
This is the value populated by the [`dbt init` command](/reference/commands/init).

<File name='dbt_project.yml'>

```yml
analysis-paths: ["analyses"]
```

</File>

### Use a subdirectory named `custom_analyses`

<File name='dbt_project.yml'>

```yml
analysis-paths: ["custom_analyses"]
```

</File>
