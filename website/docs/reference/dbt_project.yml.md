Every [dbt project](projects) needs a `dbt_project.yml` file — this is how dbt knows a directory is a dbt project. It also contains important information that tells dbt how to operate on your project.

The following is a list of all available configurations in the `dbt_project.yml` file.

<Alert type='info'>
    <h4>YAML syntax</h4>
    dbt uses YAML in a few different places. If you're new to YAML, it would be worth taking the time to learn how arrays, dictionaries and strings are represented in YAML.
</Alert>

<File name='dbt_project.yml'>

```yml
[name](project-configs/name.md): string

[version](project-configs/version.md): version

[profile](project-configs/profile.md): profilename

[source-paths](project-configs/source-paths.md): [directorypath]
[data-paths](project-configs/data-paths.md): [directorypath]
[test-paths](project-configs/test-paths.md): [directorypath]
[analysis-paths](project-configs/analysis-paths.md): [directorypath]
[macro-paths](project-configs/macro-paths.md): [directorypath]
[snapshot-paths](project-configs/snapshot-paths.md): [directorypath]
[docs-paths](project-configs/docs-paths.md): [directorypath]

[modules-path](project-configs/modules-paths.md): directorypath
[target-path](project-configs/target-path.md): directorypath
[log-path](project-configs/log-path.md): directorypath
[modules-path](project-configs/modules-path.md): directorypath

[clean-targets](project-configs/clean-targets.md): [directorypath]

[query-comment](project-configs/query-comment.md): string

[require-dbt-version](project-configs/require-dbt-version.md): version-range

[quoting](project-configs/quoting.md):
  database: true | false
  schema: true | false
  identifier: true | false

models:
  [<model-configs>](model-configs.md)

seeds:
  [<seed-configs>](seed-configs.md)

snapshots:
  [<snapshot-configs>](snapshot-configs.md)

[on-run-start](project-configs/on-run-start.md): sql-statement | [sql-statement]
[on-run-end](project-configs/on-run-end.md): sql-statement | [sql-statement]

```

</File>
