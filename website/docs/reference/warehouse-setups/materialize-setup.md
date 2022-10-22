---
title: "Materialize setup"
id: "materialize-setup"
meta:
  maintained_by: Materialize  Inc.
  authors: 'Materialize team'
  github_repo: 'MaterializeInc/materialize/blob/main/misc/dbt-materialize'
  min_core_version: 'v0.18.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-materialize'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01PWAH41A5'
  platform_name: 'Materialize'
  config_page: 'no-configs'
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connecting to Materialize

Once you have Materialize [installed and running](https://materialize.com/docs/install/), adapt your `profiles.yml` to connect to your instance using the following reference profile configuration:

<File name='~/.dbt/profiles.yml'>

```yaml
dbt-materialize:
  target: dev
  outputs:
    dev:
      type: materialize
      threads: 1
      host: [host]
      port: [port]
      user: [user]
      pass: [password]
      dbname: [database]
      schema: [name of your dbt schema]
```

</File>

To test the connection to Materialize, run:

```
dbt debug
```

If the output reads "All checks passed!", you’re good to go! Check the [dbt and Materialize guide](https://materialize.com/docs/guides/dbt/) to learn more and get started.

## Supported Features

### Materializations

Because Materialize is optimized for transformations on streaming data and the core of dbt is built around batch, the `dbt-materialize` adapter implements a few custom materialization types:

Type | Supported? | Details
-----|------------|----------------
`source` | YES | Creates a [source](https://materialize.com/docs/sql/create-source/).
`view` | YES | Creates a [view](https://materialize.com/docs/sql/create-view/#main).
`materializedview` | YES | Creates a [materialized view](https://materialize.com/docs/sql/create-materialized-view/#main).
`table` | YES | Creates a [materialized view](https://materialize.com/docs/sql/create-materialized-view/#main). (Actual table support pending [#5266](https://github.com/MaterializeInc/materialize/issues/5266))
`index` | YES | (Deprecated) Creates an index. Use the [`indexes` config](materialize-configs#indexes) to create indexes on `materializedview`, `view` or `source` relations instead.
`sink` | YES | Creates a [sink](https://materialize.com/docs/sql/create-sink/#main).
`ephemeral` | YES | Executes queries using <Term id="cte">CTEs</Term>.
`incremental` | NO | Use the `materializedview` <Term id="materialization" /> instead. Materialized views will always return up-to-date results without manual or configured refreshes. For more information, check out [Materialize documentation](https://materialize.com/docs/).

### Seeds

Running [`dbt seed`](commands/seed) will create a static materialized <Term id="view" /> from a CSV file. You will not be able to add to or update this view after it has been created. If you want to rerun `dbt seed`, you must first drop existing views manually with `drop view`.

### Tests

Running [`dbt test`](commands/test) with the optional `--store-failures` flag or [`store_failures` config](resource-configs/store_failures) will create a materialized view for each test you've chosen to store. This view is a continuously updating representation of failures.

## Resources

- [dbt and Materialize guide](https://materialize.com/docs/guides/dbt/)
- [Get started](https://github.com/MaterializeInc/demos/tree/main/dbt-get-started) using dbt and Materialize together
