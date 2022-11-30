---
title: "Migrating from dbt-spark to dbt-databricks"
id: "migrating-from-spark-to-databricks"
---


## Pre-requisites

In order to migrate to dbt-databricks, your project must be compatible with `dbt 1.0` or greater as dbt-databricks is not supported pre `dbt 1.0`. [This guide](https://docs.getdbt.com/guides/migration/versions/upgrading-to-v1.0) will help you upgrade your project if necessary.

## Why change to dbt-databricks?

The Databricks team, in collaboration with dbt Labs, built on top of the foundation that the dbt Labs’ dbt-spark adapter provided, and they added some critical improvements. The dbt-databricks adapter offers an easier set up, as it only requires three inputs for authentication, and it also has more features available via the Delta file format.

### Authentication Simplification

Previously users had to provide a `cluster` or `endpoint` ID which was hard to parse out of the http_path provided in the Databricks UI. Now the [dbt-databricks profile](https://docs.getdbt.com/reference/warehouse-setups/databricks-setup) requires the same inputs regardless if you are using a Cluster or a SQL endpoint. All you need to provide is:
- the hostname of the Databricks workspace
- the HTTP path of the Databricks SQL warehouse or cluster
- an appropriate credential


### Better defaults

With dbt-databricks, by default, dbt models will use the Delta format and expensive queries will be accelerated with the [Photon engine](https://docs.databricks.com/runtime/photon.html). See [the caveats section of Databricks Profile documentation](https://docs.getdbt.com/reference/warehouse-profiles/databricks-profile#choosing-between-dbt-databricks-and-dbt-spark) for more information. Any declared configurations of `file_format = 'delta'` are now redundant and can be removed.

Additionally, dbt-databricks's default `incremental_strategy` is now `merge`. The default `incremental_strategy` with dbt-spark is `append`.
If you have been using the default `incremental_strategy=append` with dbt-spark, and would like to continue doing so, you'll have to set this config specifically on your incremental models. Read more [about `incremental_strategy` in dbt](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/configuring-incremental-models#about-incremental_strategy).
If you already specified `incremental_strategy=merge` on your incremental models, you do not need to change anything when moving to dbt-databricks, though you could remove the param as it is now the default.

### Pure Python (Core only)

A huge benefit to Core only users is that with the new dbt-databricks adapter, you no longer have to download an independent driver to interact with Databricks. The connection information is all embedded in a pure-Python library, `databricks-sql-connector`.


## Migration
### dbt Cloud

#### Credentials
If you are already successfully connected to Databricks using the dbt-spark ODBC method in dbt Cloud, then you have already supplied credentials in dbt Cloud to connect to your Databricks workspace. Each user will have added their Personal Access Token in their dbt Cloud profile for the given dbt project, which allows them to connect to Databricks in the dbt Cloud IDE, and additionally, an admin will have added an access token for each deployment environment, allowing for dbt Cloud to connect to Databricks during production jobs.

When an admin changes the dbt Cloud's connection to use the dbt-databricks adapter instead of the dbt-spark adapter, your team will not lose their credentials. This makes migrating from dbt-spark to dbt-databricks straightforward as it only requires deleting the connection and re-adding the cluster/endpoint information. Both the admin and users of the project need not re-enter personal access tokens.

#### Procedure

An admin of the dbt Cloud project running on Databricks should take the following steps to migrate from using the generic Spark adapter to the Databricks-specfic adapter. This should not cause any downtime for production jobs, but we recommend that you schedule the connection change when there is not heavy IDE usage for your team to avoid disruption.

1. Select **Account Settings** in the main navigation bar.
2. On the Projects tab, scroll until you find the project you'd like to migrate to the new dbt-databricks adapter.
3. Click the hyperlinked Connection for the project.
4. Click the "Edit" button in the top right corner.
5. Select Databricks for the warehouse
6. Select Databricks (dbt-databricks) for the adapter and enter:
    1. the `hostname`
    2. the `http_path`
    3. optionally the catalog name
7. Click save.

After the above steps have been performed, all users will have to refresh their IDE before being able to start working again. It should complete in less than a minute. 





### dbt Core

In dbt Core, migrating to the dbt-databricks adapter from dbt-spark requires that you:
1. install the new adapter in your environment, and
2. modify your target in your `~/.dbt/profiles.yml`

These changes will be needed for all users of your project.

#### Example

If you're using `dbt-spark` today to connect to a Databricks SQL Endpoint, the below examples show a good before and after of how to authenticate. The cluster example is also effectively the same.


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