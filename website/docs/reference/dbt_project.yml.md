
<Alert type='warning'>
<h4>Heads up!</h4>
This is a work in progress document. It has only been completed for seeds.

</Alert>

Every dbt project needs a `dbt_project.yml` file — this is how dbt knows a directory is a dbt project. It also contains important information that tells dbt how to operate on your project.

The following is a list of all available configurations in the `dbt_project.yml` file.

<Alert type='info'>
    <h4>YAML syntax</h4>
    dbt uses YAML in a few different places. If you're new to YAML, it would be worth doing a tutorial to learn how arrays, dictionaries and strings are represented in YAML.
</Alert>

<File name='dbt_project.yml'>

```yml
name: string

version: string

profile: profilename

source-paths: [directorypath]
[data-paths](project-configs/data-paths): [directorypath]
test-paths: [directorypath]
analysis-paths: [directorypath]
macro-paths: [directorypath]
snapshot-paths: [directorypath]

target-path: directorypath
log-path: directorypath
modules-path: directorypath

clean-targets: [directorypath]

[query-comment](project-configs/query-comment): string

[require-dbt-version](project-configs/require-dbt-version): version-range

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

[on-run-start](project-configs/on-run-start): sql-statement | [sql-statement]
[on-run-end](project-configs/on-run-end): sql-statement | [sql-statement]

```

</File>
