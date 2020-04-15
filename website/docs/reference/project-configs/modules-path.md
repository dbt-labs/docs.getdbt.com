---
datatype: directorypath
default_value: modules
---
## Definition
Optionally specify a custom directoriu where [packages](package-management) are installed when you run the `dbt deps` [command](deps). Note that this directory is usually git-ignored.

* Default: `modueles-path: dbt_modules`

## Examples
### Use a subdirectory named `packages` instead of `dbt_modules`

<File name='dbt_project.yml'>

```yml
module-path: packages
```

</File>
