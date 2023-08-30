---
title: "Migrating from dbt-spark to dbt-databricks"
id: "migrating-from-spark-to-databricks"
---

You can [migrate your projects](#migrate-your-dbt-projects) from using the `dbt-spark` adapter to using the [dbt-databricks adapter](https://github.com/databricks/dbt-databricks). In collaboration with dbt Labs, Databricks built this adapter using dbt-spark as the foundation and added some critical improvements. With it, you get an easier set up &mdash; requiring only three inputs for authentication &mdash; and more features such as support for [Unity Catalog](https://www.databricks.com/product/unity-catalog).

## Simpler authentication

Previously, you had to provide a `cluster` or `endpoint` ID which was hard to parse from the `http_path` that you were given. Now, it doesn't matter if you're using a cluster or an SQL endpoint because the [dbt-databricks setup](/docs/core/connect-data-platform/databricks-setup) requires the _same_ inputs for both. All you need to provide is:
- hostname of the Databricks workspace
- HTTP path of the Databricks SQL warehouse or cluster
- appropriate credentials

## Better defaults

The `dbt-databricks` adapter provides better defaults than `dbt-spark` does. The defaults help optimize your workflow so you can get the fast performance and cost-effectiveness of Databricks. They are:

- The dbt models use the [Delta](https://docs.databricks.com/delta/index.html) table format. You can remove any declared configurations of `file_format = 'delta'` since they're now redundant.
- Accelerate your expensive queries with the [Photon engine](https://docs.databricks.com/runtime/photon.html).
- The `incremental_strategy` config is set to `merge`.

With dbt-spark, however, the default for `incremental_strategy` is `append`. If you want to continue using `incremental_strategy=append`, you must set this config specifically on your incremental models. If you already specified `incremental_strategy=merge` on your incremental models, you don't need to change anything when moving to dbt-databricks; but, you can keep your models clean (tidy) by removing the config since it's redundant. Read [About incremental_strategy](/docs/build/incremental-models#about-incremental_strategy) to learn more.

For more information on defaults, see [Caveats](/docs/core/connect-data-platform/databricks-setup#caveats).

## Pure Python

If you use dbt Core, you no longer have to download an independent driver to interact with Databricks. The connection information is all embedded in a pure-Python library called `databricks-sql-connector`.


## Migrate your dbt projects

In both dbt Core and dbt Cloud, you can migrate your projects to the Databricks-specific adapter from the generic Apache Spark adapter.

### Prerequisites

- Your project must be compatible with dbt 1.0 or greater. Refer to [Upgrading to v1.0](/guides/migration/versions/upgrading-to-v1.0) for details. For the latest version of dbt, refer to [Upgrading to v1.3](/guides/migration/versions/upgrading-to-v1.3).
- For dbt Cloud, you need administrative (admin) privileges to migrate dbt projects.

<!-- tabs for dbt Cloud and dbt Core -->
<Tabs>

<TabItem value="cloud" label="dbt Cloud">

The migration to the `dbt-databricks` adapter from `dbt-spark` shouldn't cause any downtime for production jobs. dbt Labs recommends that you schedule the connection change when usage of the IDE is light to avoid disrupting your team.

To update your Databricks connection in dbt Cloud:

1. Select **Account Settings** in the main navigation bar.
2. On the **Projects** tab, find the project you want to migrate to the dbt-databricks adapter.
3. Click the hyperlinked Connection for the project.
4. Click **Edit** in the top right corner.
5. Select **Databricks** for the warehouse
6. Select **Databricks (dbt-databricks)** for the adapter and enter the:
    1. `hostname`
    2. `http_path`
    3. (optional) catalog name
7. Click **Save**.

Everyone in your organization who uses dbt Cloud must refresh the IDE before starting work again. It should refresh in less than a minute.

#### About your credentials

When you update the Databricks connection in dbt Cloud, your team will not lose their credentials. This makes migrating easier since it only requires you to delete the Databricks connection and re-add the cluster or endpoint information.

These credentials will not get lost when there's a successful connection to Databricks using the `dbt-spark` ODBC method:

- The credentials you supplied to dbt Cloud to connect to your Databricks workspace.
- The personal access tokens your team added in their dbt Cloud profile so they can develop in the IDE for a given project.
- The access token you added for each deployment environment so dbt Cloud can connect to Databricks during production jobs.

</TabItem>

<TabItem value="core" label="dbt Core">

To migrate your dbt Core projects to the `dbt-databricks` adapter from `dbt-spark`, you:
1. Install the [dbt-databricks adapter](https://github.com/databricks/dbt-databricks) in your environment
1. Update your Databricks connection by modifying your `target` in your `~/.dbt/profiles.yml` file

Anyone who's using your project must also make these changes in their environment.

</TabItem>

</Tabs>

<!-- End tabs for dbt Cloud and dbt Core -->

### Examples

You can use the following examples of the `profiles.yml` file to see the authentication setup with `dbt-spark` compared to the simpler setup with `dbt-databricks` when connecting to an SQL endpoint. A cluster example would look similar.


An example of what authentication looks like with `dbt-spark`:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: odbc
      driver: '/opt/simba/spark/lib/64/libsparkodbc_sb64.so'
      schema: my_schema
      host: dbc-l33t-nwb.cloud.databricks.com
      endpoint: 8657cad335ae63e3
      token: [my_secret_token]

```

</File>

An example of how much simpler authentication is with `dbt-databricks`:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: databricks
      schema: my_schema
      host:  dbc-l33t-nwb.cloud.databricks.com
      http_path: /sql/1.0/endpoints/8657cad335ae63e3
      token: [my_secret_token]
```

</File>
