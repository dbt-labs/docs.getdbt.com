---
datatype: directorypath
default_value: dbt_packages
---

<Changelog>

- **v1.0.0:** The default config has changed from `modules-path` to `packages-install-path` with a new default value of `dbt_packages`.

</Changelog>



## Definition
Optionally specify a custom directory where [packages](package-management) are installed when you run the `dbt deps` [command](deps). Note that this directory is usually git-ignored.

## Default
By default, dbt will install packages in the `dbt_packages` directory, i.e. `packages-install-path: dbt_packages`

## Examples
### Install packages in a subdirectory named `packages` instead of `dbt_packages`

<File name='dbt_project.yml'>

```yml
packages-install-path: packages
```

</File>
