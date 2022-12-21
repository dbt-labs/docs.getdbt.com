<Changelog>

- **v1.0.0:** The default config name for `data-paths` is now [`seed-paths`](seed-paths), `source-paths` is now [`model-paths`](model-paths) and `modules-path` is now [`packages-install-path`](packages-install-path).

</Changelog>

Every [dbt project](projects) needs a `dbt_project.yml` file — this is how dbt knows a directory is a dbt project. It also contains important information that tells dbt how to operate on your project.

The following is a list of all available configurations in the `dbt_project.yml` file.

:::info YAML syntax
dbt uses YAML in a few different places. If you're new to YAML, it would be worth taking the time to learn how arrays, dictionaries and strings are represented.
:::

<File name='dbt_project.yml'>

```yml
[name](project-configs/name): string

[config-version](project-configs/config-version): 2
[version](project-configs/version): version

[profile](project-configs/profile): profilename

[model-paths](project-configs/model-paths): [directorypath]
[seed-paths](project-configs/seed-paths): [directorypath]
[test-paths](project-configs/test-paths): [directorypath]
[analysis-paths](project-configs/analysis-paths): [directorypath]
[macro-paths](project-configs/macro-paths): [directorypath]
[snapshot-paths](project-configs/snapshot-paths): [directorypath]
[docs-paths](project-configs/docs-paths): [directorypath]
[asset-paths](project-configs/asset-paths): [directorypath]

[target-path](project-configs/target-path): directorypath
[log-path](project-configs/log-path): directorypath
[packages-install-path](project-configs/packages-install-path): directorypath

[clean-targets](project-configs/clean-targets): [directorypath]

[query-comment](project-configs/query-comment): string

[require-dbt-version](project-configs/require-dbt-version): version-range | [version-range]

[quoting](project-configs/quoting):
  database: true | false
  schema: true | false
  identifier: true | false

models:
  [<model-configs>](model-configs)

seeds:
  [<seed-configs>](seed-configs)

snapshots:
  [<snapshot-configs>](snapshot-configs)

sources:
  [<source-configs>](source-configs)
  
tests:
  [<test-configs>](test-configs)

vars:
  [<variables>](/docs/build/project-variables)

[on-run-start](project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]
[on-run-end](project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]

[dispatch](project-configs/dispatch-config):
  - macro_namespace: packagename
    search_order: [packagename]

```

</File>
