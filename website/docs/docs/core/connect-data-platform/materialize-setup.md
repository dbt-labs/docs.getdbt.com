---
title: "Materialize setup"
description: "Read this guide to learn about the Materialize warehouse setup in dbt."
id: "materialize-setup"
meta:
  maintained_by: Materialize  Inc.
  pypi_package: 'dbt-materialize'
  authors: 'Materialize team'
  github_repo: 'MaterializeInc/materialize/blob/main/misc/dbt-materialize'
  min_core_version: 'v0.18.1'
  min_supported_version: 'v0.28.0'
  cloud_support: Not Supported
  slack_channel_name: '#db-materialize'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01PWAH41A5'
  platform_name: 'Materialize'
  config_page: '/reference/resource-configs/materialize-configs'
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}></a></li>
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

<p>For {frontMatter.meta.platform_name}-specifc configuration, please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration.</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connecting to Materialize

Once you have set up a [Materialize account](https://materialize.com/register/), adapt your `profiles.yml` to connect to your instance using the following reference profile configuration:

<File name='~/.dbt/profiles.yml'>

```yaml
materialize:
  target: dev
  outputs:
    dev:
      type: materialize
      host: [host]
      port: [port]
      user: [user@domain.com]
      pass: [password]
      dbname: [database]
      cluster: [cluster] # default 'default'
      schema: [dbt schema]
      sslmode: require
      keepalives_idle: 0 # default: 0, indicating the system default
      connect_timeout: 10 # default: 10 seconds
      retries: 1 # default: 1, retry on error/timeout when opening connections
```

</File>

### Configurations

`cluster`: The default [cluster](https://materialize.com/docs/overview/key-concepts/#clusters) is used to maintain materialized views or indexes. A [`default` cluster](https://materialize.com/docs/sql/show-clusters/#default-cluster) is pre-installed in every environment, but we recommend creating dedicated clusters to isolate the workloads in your dbt project (for example, `staging` and `data_mart`).

`keepalives_idle`: The number of seconds before sending a ping to keep the Materialize connection active. If you are encountering `SSL SYSCALL error: EOF detected`, you may want to lower the [keepalives_idle](https://docs.getdbt.com/reference/warehouse-setups/postgres-setup#keepalives_idle) value to prevent the database from closing its connection.

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
`sink` | YES | Creates a [sink](https://materialize.com/docs/sql/create-sink/#main).
`ephemeral` | YES | Executes queries using <Term id="cte">CTEs</Term>.
`incremental` | NO | Use the `materializedview` <Term id="materialization" /> instead. Materialized views will always return up-to-date results without manual or configured refreshes. For more information, check out [Materialize documentation](https://materialize.com/docs/).

### Indexes

Materialized views (`materializedview`), views (`view`) and sources (`source`) may have a list of [`indexes`](/reference/resource-configs/materialize-configs#indexes) defined.

### Seeds

Running [`dbt seed`](/reference/commands/seed) will create a static materialized <Term id="view" /> from a CSV file. You will not be able to add to or update this view after it has been created.

### Tests

Running [`dbt test`](/reference/commands/test) with the optional `--store-failures` flag or [`store_failures` config](/reference/resource-configs/store_failures) will create a materialized view for each configured test that can keep track of failures over time.

## Resources

- [dbt and Materialize guide](https://materialize.com/docs/guides/dbt/)
