---
title: "Migrating from dbt-spark to dbt-databricks"
id: "migrating-from-spark-to-databricks"
---


## Pre-requisites

In order to migrate to dbt-databricks, you must first be using `dbt-spark>1.0.0` as `dbt-databricks` is only supported from `>1.0`.

## Why change to dbt-databricks?

Current users of dbt with Databricks are about to have some new experiences with respect to authentication as well as features available via the delta format.

### Authentication Simplification

The authentication information has now simplified greatly. Previously you would have to provide a `cluster` or `endpoint` id which was hard to parse out of the http_path provided in the Databricks UI. Now it is simple enough  changes are authentication method is now the same regardless if you are using a Cluster or a SQL endpoint

### Better defaults

With dbt-databricks, by default, you will make use of delta lake and the [photon engine](https://docs.databricks.com/runtime/photon.html). 
See [the caveats section of Databricks Profile Docs page](https://docs.getdbt.com/reference/warehouse-profiles/databricks-profile#choosing-between-dbt-databricks-and-dbt-spark) for more information.

### Pure Python (Core only)

A huge benefit to the new dbt-databricks adapter in Core, is that you no longer have to download an independent driver to interact with Databricks. The connection information is all embedded in pure-python library, `databricks-sql-connector`


## Migration
### dbt Cloud

#### Credentials

When you initially create a project in dbt Cloud and connect it to a data warehouse, it will ask you for credentials. In the case of Databricks, the credential is a Personal Access Token that is stored for each unique user for a given project. If, as an admin, you remove a data warehouse connection from a project, the users' credentials are not removed.  This makes migrating from dbt-spark to dbt-databricks simple as it only requires deleting the connection and re-adding the cluster/endpoint information. Both the admin and users of the project need not re-enter their personal access tokens.

#### Procedure

An admin of the Databricks-backed dbt project should do perform the following steps to migrate from using the generic Spark adapter to the Databricks-specfic adapter.

1. Go to the Projects pane of the Account Settings page.
2. Click the hyperlinked name of the Connection to the right of the name of the relevant project
3. Click the "Edit" button in the top right corner, then
4. Click "Delete Connection" at the bottom of the page.

    > :warning:, the only information that will be deleted is the cluster or endpoint host and id. Your credential will still be saved. See above note.
5. After being brought back to the project overview page, click "Configure a connection" to add a new project
6. Select the Databricks adapter that is not listed as "depecated", and enter:
    1. the `hostname`
    2. `http_path`, and
    3. number of desired threads
7. Click save

After the above steps have been performed, all users will have to refresh their IDE before being able to start working again. It should complete in less than a minute.





### dbt Core

In dbt Core, migrating to the dbt-databricks adapter from dbt-spark requires that you:
1. install the new adapter in your environment, and
2. modify your target in your `~/.dbt/profiles.yml`

This changes will be needed for all users of your project
#### Example

If you're using `dbt-spark` today to connect to a Databricks SQL Endpoint, the below examples show a good before and adter of how to authenticate. The cluster example is also effectively the same.

The steps are virtually the same if you're using a Spark cluster.


<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: my_databricks
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