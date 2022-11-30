---
datatype: [directorypath]
default_value: []
---

<File name='dbt_project.yml'>

```yml
asset-paths: [directorypath]
```

</File>

## Definition
Optionally specify a custom list of directories to copy to the `target` directory as part of the `docs generate` command. This is useful for rendering images in your repository in your project documentation.

<Changelog>

* `v0.18.0`: This configuration was introduced — see the [migration guide](/guides/migration/versions) for more details.

</Changelog>

## Default
By default, dbt will not compile any additional files as part of `docs generate`, i.e. `analysis-paths: []`

## Examples
### Compile files in the `assets` subdirectory as part of `docs generate`

<File name='dbt_project.yml'>

```yml
asset-paths: ["assets"]
```

</File>

Any files included in this directory will be copied to the `target/` directory as part of `dbt docs generate`, making them accessible as images in your project documentation.

Check out the full writeup on including images in your descriptions [here](/reference/resource-properties/description/#include-an-image-from-your-repo-in-your-descriptions).
