
Every [dbt project](/docs/build/projects) needs a `dbt_project.yml` file — this is how dbt knows a directory is a dbt project. It also contains important information that tells dbt how to operate your project.

dbt uses [YAML](https://yaml.org/) in a few different places. If you're new to YAML, it would be worth learning how arrays, dictionaries, and strings are represented.

<VersionBlock lastVersion="1.4">

By default, dbt will look for `dbt_project.yml` in your current working directory and its parents, but you can set a different directory using the `--project-dir` flag.

</VersionBlock>

<VersionBlock firstVersion="1.5">

By default, dbt will look for `dbt_project.yml` in your current working directory and its parents, but you can set a different directory using the `--project-dir` flag or the `DBT_PROJECT_DIR` environment variable.

Starting from dbt v1.5 and higher, you can specify your dbt Cloud project ID in the `dbt_project.yml` file using `project-id` under the `dbt-cloud` config. To find your project ID, check your dbt Cloud project URL, such as `https://cloud.getdbt.com/11/projects/123456`, where the project ID is `123456`.

</VersionBlock>

Something to note, you can't set up a "property" in the `dbt_project.yml` file if it's not a config (an example is [macros](/reference/macro-properties)). This applies to all types of resources. Refer to [Configs and properties](/reference/configs-and-properties) for more detail.

The following example is a list of all available configurations in the `dbt_project.yml` file:

<VersionBlock firstVersion="1.7">

<File name='dbt_project.yml'>

```yml
[name](/reference/project-configs/name): string

[config-version](/reference/project-configs/config-version): 2
[version](/reference/project-configs/version): version

[profile](/reference/project-configs/profile): profilename

[model-paths](/reference/project-configs/model-paths): [directorypath]
[seed-paths](/reference/project-configs/seed-paths): [directorypath]
[test-paths](/reference/project-configs/test-paths): [directorypath]
[analysis-paths](/reference/project-configs/analysis-paths): [directorypath]
[macro-paths](/reference/project-configs/macro-paths): [directorypath]
[snapshot-paths](/reference/project-configs/snapshot-paths): [directorypath]
[docs-paths](/reference/project-configs/docs-paths): [directorypath]
[asset-paths](/reference/project-configs/asset-paths): [directorypath]

[target-path](/reference/global-configs/json-artifacts): directorypath
[log-path](/reference/global-configs/logs): directorypath
[packages-install-path](/reference/project-configs/packages-install-path): directorypath

[clean-targets](/reference/project-configs/clean-targets): [directorypath]

[query-comment](/reference/project-configs/query-comment): string

[require-dbt-version](/reference/project-configs/require-dbt-version): version-range | [version-range]

[flags](/reference/global-configs/project-flags):
  [<global-configs>](/reference/global-configs/project-flags)

[dbt-cloud](/docs/cloud/cloud-cli-installation):
  [project-id](/docs/cloud/configure-cloud-cli#configure-the-dbt-cloud-cli): project_id # Required
  [defer-env-id](/docs/cloud/about-cloud-develop-defer#defer-in-dbt-cloud-cli): environment_id # Optional

[quoting](/reference/project-configs/quoting):
  database: true | false
  schema: true | false
  identifier: true | false

metrics:
  <metric-configs>

models:
  [<model-configs>](/reference/model-configs)

seeds:
  [<seed-configs>](/reference/seed-configs)

semantic-models:
  <semantic-model-configs>

snapshots:
  [<snapshot-configs>](/reference/snapshot-configs)

sources:
  [<source-configs>](source-configs)
  
tests:
  [<test-configs>](/reference/data-test-configs)

vars:
  [<variables>](/docs/build/project-variables)

[on-run-start](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]
[on-run-end](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]

[dispatch](/reference/project-configs/dispatch-config):
  - macro_namespace: packagename
    search_order: [packagename]

[restrict-access](/docs/collaborate/govern/model-access): true | false

```

</File>
</VersionBlock>

<VersionBlock firstVersion="1.6" lastVersion="1.6">

<File name='dbt_project.yml'>

```yml
[name](/reference/project-configs/name): string

[config-version](/reference/project-configs/config-version): 2
[version](/reference/project-configs/version): version

[profile](/reference/project-configs/profile): profilename

[model-paths](/reference/project-configs/model-paths): [directorypath]
[seed-paths](/reference/project-configs/seed-paths): [directorypath]
[test-paths](/reference/project-configs/test-paths): [directorypath]
[analysis-paths](/reference/project-configs/analysis-paths): [directorypath]
[macro-paths](/reference/project-configs/macro-paths): [directorypath]
[snapshot-paths](/reference/project-configs/snapshot-paths): [directorypath]
[docs-paths](/reference/project-configs/docs-paths): [directorypath]
[asset-paths](/reference/project-configs/asset-paths): [directorypath]

[target-path](/reference/global-configs/json-artifacts): directorypath
[log-path](/reference/global-configs/logs): directorypath
[packages-install-path](/reference/project-configs/packages-install-path): directorypath

[clean-targets](/reference/project-configs/clean-targets): [directorypath]

[query-comment](/reference/project-configs/query-comment): string

[require-dbt-version](/reference/project-configs/require-dbt-version): version-range | [version-range]

[dbt-cloud](/docs/cloud/cloud-cli-installation):
  [project-id](/docs/cloud/configure-cloud-cli#configure-the-dbt-cloud-cli): project_id # Required
  [defer-env-id](/docs/cloud/about-cloud-develop-defer#defer-in-dbt-cloud-cli): environment_id # Optional

[quoting](/reference/project-configs/quoting):
  database: true | false
  schema: true | false
  identifier: true | false

models:
  [<model-configs>](/reference/model-configs)

seeds:
  [<seed-configs>](/reference/seed-configs)

snapshots:
  [<snapshot-configs>](/reference/snapshot-configs)

sources:
  [<source-configs>](source-configs)
  
tests:
  [<test-configs>](/reference/data-test-configs)

vars:
  [<variables>](/docs/build/project-variables)

[on-run-start](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]
[on-run-end](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]

[dispatch](/reference/project-configs/dispatch-config):
  - macro_namespace: packagename
    search_order: [packagename]

[restrict-access](/docs/collaborate/govern/model-access): true | false

```

</File>
</VersionBlock>

<VersionBlock lastVersion="1.5">


<File name='dbt_project.yml'>

```yml
[name](/reference/project-configs/name): string

[config-version](/reference/project-configs/config-version): 2
[version](/reference/project-configs/version): version

[profile](/reference/project-configs/profile): profilename

[model-paths](/reference/project-configs/model-paths): [directorypath]
[seed-paths](/reference/project-configs/seed-paths): [directorypath]
[test-paths](/reference/project-configs/test-paths): [directorypath]
[analysis-paths](/reference/project-configs/analysis-paths): [directorypath]
[macro-paths](/reference/project-configs/macro-paths): [directorypath]
[snapshot-paths](/reference/project-configs/snapshot-paths): [directorypath]
[docs-paths](/reference/project-configs/docs-paths): [directorypath]
[asset-paths](/reference/project-configs/asset-paths): [directorypath]

[target-path](/reference/global-configs/json-artifacts): directorypath
[log-path](/reference/global-configs/logs): directorypath
[packages-install-path](/reference/project-configs/packages-install-path): directorypath

[clean-targets](/reference/project-configs/clean-targets): [directorypath]

[query-comment](/reference/project-configs/query-comment): string

[require-dbt-version](/reference/project-configs/require-dbt-version): version-range | [version-range]

[quoting](/reference/project-configs/quoting):
  database: true | false
  schema: true | false
  identifier: true | false

models:
  [<model-configs>](/reference/model-configs)

seeds:
  [<seed-configs>](/reference/seed-configs)

snapshots:
  [<snapshot-configs>](/reference/snapshot-configs)

sources:
  [<source-configs>](source-configs)
  
tests:
  [<test-configs>](/reference/data-test-configs)

vars:
  [<variables>](/docs/build/project-variables)

[on-run-start](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]
[on-run-end](/reference/project-configs/on-run-start-on-run-end): sql-statement | [sql-statement]

[dispatch](/reference/project-configs/dispatch-config):
  - macro_namespace: packagename
    search_order: [packagename]

[restrict-access](/docs/collaborate/govern/model-access): true | false

```

</File>

</VersionBlock>
