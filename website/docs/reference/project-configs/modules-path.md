---
datatype: directorypath
default_value: modules
---
<File name='dbt_project.yml'>

```yml
modules-path: directorypath
```

</File>

## Definition
Optionally specify a custom directory where [packages](package-management) are installed when you run the `dbt deps` [command](deps). Note that this directory is usually git-ignored.

## Default
By default, dbt will install packages in the `dbt_modules` directory, i.e. `modules-path: dbt_modules`

## Examples
### Install packages in a subdirectory named `packages` instead of `dbt_modules`

<File name='dbt_project.yml'>

```yml
module-path: packages
```

</File>
