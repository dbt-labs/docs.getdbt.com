Every dbt project needs a `dbt_project.yml` file — this is how dbt knows a directory is a dbt project. It also contains important information that tells dbt how to operate on your project.

The following is a list of all available configurations in the `dbt_project.yml` file.

<Alert type='info'>
    <h4>YAML syntax</h4>
    dbt uses YAML in a few different places. If you're new to YAML, it would be worth taking the time to learn how arrays, dictionaries and strings are represented in YAML.
</Alert>

<File name='dbt_project.yml'>

```yml
[name](name): string

[version](version-config): version

[profile](profile-config): profilename

[source-paths](source-paths): [directorypath]
[data-paths](data-paths): [directorypath]
[test-paths](test-paths): [directorypath]
[analysis-paths](analysis-paths): [directorypath]
[macro-paths](macro-paths): [directorypath]
[snapshot-paths](snapshot-paths): [directorypath]
[docs-paths](docs-paths): [directorypath]

[modules-path](modules-path): directorypath
[target-path](target-path): directorypath
[log-path](log-path): directorypath
[modules-path](modules-path): directorypath

[clean-targets](clean-targets): [directorypath]

[query-comment](query-comment): string

[require-dbt-version](require-dbt-version): version-range

[quoting](quoting):
  database: true | false
  schema: true | false
  identifier: true | false

models:
  [<model-configs>](model-configs)

seeds:
  [<seed-configs>](seed-configs)

snapshots:
  [<snapshot-configs>](snapshot-configs)

[on-run-start](on-run-start): sql-statement | [sql-statement]
[on-run-end](on-run-end): sql-statement | [sql-statement]

```

</File>
