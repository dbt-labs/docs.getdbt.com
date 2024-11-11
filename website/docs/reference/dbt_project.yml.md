
Every [dbt project](/docs/build/projects) needs a `dbt_project.yml` file — this is how dbt knows a directory is a dbt project. It also contains important information that tells dbt how to operate your project.

- dbt uses [YAML](https://yaml.org/) in a few different places. If you're new to YAML, it would be worth learning how arrays, dictionaries, and strings are represented.

- By default, dbt looks for the `dbt_project.yml` in your current working directory and its parents, but you can set a different directory using the `--project-dir` flag or the `DBT_PROJECT_DIR` environment variable.

- Specify your dbt Cloud project ID in the `dbt_project.yml` file using `project-id` under the `dbt-cloud` config. Find your project ID in your dbt Cloud project URL: For example, in `https://YOUR_ACCESS_URL/11/projects/123456`, the project ID is `123456`.


- Note, you can't set up a "property" in the `dbt_project.yml` file if it's not a config (an example is [macros](/reference/macro-properties)). This applies to all types of resources. Refer to [Configs and properties](/reference/configs-and-properties) for more detail.

## Example

The following example is a list of all available configurations in the `dbt_project.yml` file:

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
  [<metric-configs>](/docs/build/metrics-overview)

models:
  [<model-configs>](/reference/model-configs)

seeds:
  [<seed-configs>](/reference/seed-configs)

semantic-models:
  [<semantic-model-configs>](/docs/build/semantic-models)

saved-queries:
  [<saved-queries-configs>](/docs/build/saved-queries)

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

## Naming convention

It's important to follow the correct YAML naming conventions for the configs in your `dbt_project.yml` file to ensure dbt can process them properly. This is especially true for resource types with more than one word.

- Use dashes (`-`) when configuring resource types with multiple words in your `dbt_project.yml` file. Here's an example for [saved queries](/docs/build/saved-queries#configure-saved-query):

    <File name="dbt_project.yml">

    ```yml
    saved-queries:  # Use dashes for resource types in the dbt_project.yml file.
      my_saved_query:
        +cache:
          enabled: true
    ```
    </File>

- Use underscore (`_`) when configuring resource types with multiple words for YAML files other than the `dbt_project.yml` file. For example, here's the same saved queries resource in the `semantic_models.yml` file:

    <File name="models/semantic_models.yml">

    ```yml
    saved_queries:  # Use underscores everywhere outside the dbt_project.yml file.
      - name: saved_query_name
        ... # Rest of the saved queries configuration.
        config:
          cache:
            enabled: true
    ```
    </File>
