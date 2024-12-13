---
datatype: [directorypath]
default_value: [models]
---

<File name='dbt_project.yml'>

```yml
model-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories where [models](/docs/build/models), [sources](/docs/build/sources), and [unit tests](/docs/build/unit-tests) are located.

## Default
By default, dbt will search for models and sources in the `models` directory. For example, `model-paths: ["models"]`. 

import RelativePath from '/snippets/_relative-path.md';

<RelativePath 
path="model-paths"
absolute="/Users/username/project/models"
/>

- ✅ **Do**
  - Use relative path:
    ```yml
    model-paths: ["models"]
    ```

- ❌ **Don't:**
  - Avoid absolute paths:
    ```yml
    model-paths: ["/Users/username/project/models"]
    ```

## Examples
### Use a subdirectory named `transformations` instead of `models`

<File name='dbt_project.yml'>

```yml
model-paths: ["transformations"]
```

</File>
