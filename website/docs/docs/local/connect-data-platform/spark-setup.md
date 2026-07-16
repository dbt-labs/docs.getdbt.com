---
title: "Apache Spark setup"
sidebar_label: "Apache Spark"
description: "Read this guide to learn about the Apache Spark warehouse setup in dbt."
id: "spark-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-spark'
  min_core_version: 'v0.15.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: 'db-databricks-and-spark'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNGCW8HKL'
  platform_name: 'Spark'
  config_page: '/reference/resource-configs/spark-configs'
---

<VersionBlock firstVersion="2.0">

# Connect Apache Spark to Fusion <Lifecycle status="beta" />

The <Constant name="fusion_engine" /> supports Apache Spark, enabling faster compilation and execution for your Spark-based dbt projects. Currently, <Constant name="fusion" /> only supports Apache Spark 3.0.

## Fusion and Spark

<Constant name="fusion" /> uses the Databricks SQL dialect for [static analysis](/docs/fusion/new-concepts#principles-of-static-analysis) when working with Spark. Databricks SQL is a superset of Spark SQL, so your SQL is validated with Databricks semantics. This provides comprehensive error checking and SQL comprehension features. A dedicated Spark SQL dialect for static analysis is planned for a future release.


## Authentication

The Spark adapter in <Constant name="fusion" /> supports:

- Thrift
  - Simple Authentication and Security Layer (SASL) PLAIN
  - No SASL (NOSASL) 
- Livy
  - Basic authentication (username and password)
  - When deployed on Amazon Web Services (AWS): AWS Signature Version 4
    - Supports authentication using single sign-on, service accounts, or user tokens

## Configure Fusion

Configure your Spark connection in `profiles.yml`:

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: CONNECTION_METHOD # thrift, http, or livy
      port: PORT_NUMBER
      auth: AUTH_METHOD
      schema: SCHEMA_NAME
      host: HOSTNAME
      platform_hint: PLATFORM_HINT # optional; aws_emr_serverless or aws_emr_eks
      server_side_parameters: # optional; required keys depend on platform_hint
        livy.server.session.ttl: SESSION_TTL_SECONDS # optional when using method: livy
```

</File>

| Profile field | Required | Description | Example |
| --- | --- | --- | --- |
| `method` | Yes | Connection method. Accepted values: `thrift`, `http`, or `livy`. | `thrift` |
| `port` | Yes | Port number for the connection. | `443` |
| `auth` | Yes | Authentication method. | `SASL PLAIN`, `NOSASL`, `AWS_SIGV4`  |
| `schema` | Yes | The database or schema name where dbt will create and query objects. | `analytics` |
| `host` | Yes | Hostname of the Spark cluster or Databricks workspace. | `yourorg.sparkhost.com` |
| `platform_hint` | No | Hints to <Constant name="fusion" /> which Spark platform you use. <Constant name="fusion" /> uses this to validate required `server_side_parameters`. Accepted values: `aws_emr_serverless`, `aws_emr_eks`. If omitted, <Constant name="fusion" /> assumes a generic Spark cluster. | `aws_emr_serverless` |
| `server_side_parameters` | No | Spark session parameters passed to the cluster. <br/><br/>Required keys when using `platform_hint`:<br/>- For `aws_emr_serverless`, use `emr-serverless.session.executionRoleArn`.<br/>- For `aws_emr_eks`, use `spark.kubernetes.namespace`.<br/><br/>When using `method: livy`, you can set `livy.server.session.ttl` to configure how long a session can remain idle before it is terminated. | Refer to [example profiles](#example-profiles). |

### Example profiles

<Tabs>

<TabItem value="thrift-binary" label="Thrift (binary)">

<File name='~/.dbt/profiles.yml'>

```yaml
spark-local-thrift-binary:
  target: spark
  outputs:
    spark:
      type: spark
      method: thrift
      port: 10000
      auth: NOSASL
      host: localhost
      schema: my_schema
```

</File>

</TabItem>

<TabItem value="thrift-http" label="Thrift (HTTP)">

<File name='~/.dbt/profiles.yml'>

```yaml
spark-local-thrift-http:
  target: spark
  outputs:
    spark:
      type: spark
      method: http
      port: 443
      auth: NOSASL
      # Omit the protocol scheme to use HTTPS. For HTTP, use a host like http://localhost
      host: localhost
      schema: my_schema
```

</File>

</TabItem>

<TabItem value="emr-serverless" label="AWS EMR Serverless">

<File name='~/.dbt/profiles.yml'>

```yaml
spark-emr-serverless:
  target: spark
  outputs:
    spark:
      type: spark
      method: livy
      auth: AWS_SIGV4
      port: 443
      host: "YOUR_APPLICATION_ID.livy.emr-serverless-services.us-east-1.amazonaws.com"
      schema: my_schema
      platform_hint: aws_emr_serverless
      server_side_parameters:
        "spark.driver.memory": "1g"
        "spark.driver.cores": 1
        "spark.executor.memory": "1g"
        "spark.executor.cores": 1
        # Required by EMR Serverless when using platform_hint: aws_emr_serverless
        "emr-serverless.session.executionRoleArn": "arn:aws:iam::YOUR_AWS_ACCOUNT:role/YOUR_ROLE"
```

</File>

</TabItem>

<TabItem value="emr-eks" label="AWS EMR on EKS">

<File name='~/.dbt/profiles.yml'>

```yaml
spark-emr-eks:
  target: spark
  outputs:
    spark:
      type: spark
      method: livy
      auth: AWS_SIGV4
      port: 443
      host: "https://my-spark-cluster.com"
      schema: my_schema
      platform_hint: aws_emr_eks
      server_side_parameters:
        # Required by EMR on EKS when using platform_hint: aws_emr_eks
        "spark.kubernetes.namespace": "emr-jobs"
        "spark.driver.memory": "1g"
        "spark.driver.cores": 1
        "spark.executor.memory": "8g"
        "spark.executor.cores": 4
```

</File>

</TabItem>

</Tabs>

For detailed configuration options, refer to the [Spark configuration](/reference/resource-configs/spark-configs) page.

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Connect Apache Spark to dbt Core

<ProductCard text="Fusion compatible" url="/docs/local/connect-data-platform/spark-setup?version=2" /> connection also available.

<Snippet path="warehouse-setups-cloud-callout" />
<Snippet path="dbt-databricks-for-databricks" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


If connecting to Databricks via ODBC driver, it requires `pyodbc`. Depending on your system, you can install it separately or via pip. See the [`pyodbc` wiki](https://github.com/mkleehammer/pyodbc/wiki/Install) for OS-specific installation details.

If connecting to a Spark cluster via the generic thrift or http methods, it requires `PyHive`.

```zsh
# odbc connections
$ python -m pip install "dbt-spark[ODBC]"

# thrift or http connections
$ python -m pip install "dbt-spark[PyHive]"
```

```zsh
# session connections
$ python -m pip install "dbt-spark[session]"
```

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specific configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connection methods

dbt-spark can connect to Spark clusters by four different methods:

- [`odbc`](#odbc) is the preferred method when connecting to Databricks. It supports connecting to a SQL Endpoint or an all-purpose interactive cluster.
- [`thrift`](#thrift) connects directly to the lead node of a cluster, either locally hosted / on premise or in the cloud (for example, Amazon EMR).
- [`http`](#http) is a more generic method for connecting to a managed service that provides an HTTP endpoint. Currently, this includes connections to a Databricks interactive cluster.


- [`session`](#session) connects to a pySpark session, running locally or on a remote machine.

:::info Advanced functionality
The `session` connection method is intended for advanced users and experimental dbt development. This connection method is not supported by <Constant name="dbt" />.
:::


### ODBC

Use the `odbc` connection method if you are connecting to a Databricks SQL endpoint or interactive cluster via ODBC driver. (Download the latest version of the official driver [here](https://databricks.com/spark/odbc-driver-download).)

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: odbc
      driver: [path/to/driver]
      schema: [database/schema name]
      host: [yourorg.sparkhost.com]
      organization: [org id]    # Azure Databricks only
      token: [abc123]
      
      # one of:
      endpoint: [endpoint id]
      cluster: [cluster id]
      
      # optional
      port: [port]              # default 443
      user: [user]
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

### Thrift

Use the `thrift` connection method if you are connecting to a Thrift server sitting in front of a Spark cluster, for example, a cluster running locally or on Amazon EMR.

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: thrift
      schema: [database/schema name]
      host: [hostname]
      
      # optional
      port: [port]              # default 10001
      user: [user]
      auth: [for example, KERBEROS]
      kerberos_service_name: [for example, hive]
      use_ssl: [true|false]   # value of hive.server2.use.SSL, default false
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

### HTTP

Use the `http` method if your Spark provider supports generic connections over HTTP (for example, Databricks interactive cluster).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: http
      schema: [database/schema name]
      host: [yourorg.sparkhost.com]
      organization: [org id]    # Azure Databricks only
      token: [abc123]
      cluster: [cluster id]
      
      # optional
      port: [port]              # default: 443
      user: [user]
      connect_timeout: 60       # default 10
      connect_retries: 5        # default 0
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

Databricks interactive clusters can take several minutes to start up. You may
include the optional profile configs `connect_timeout` and `connect_retries`,
and dbt will periodically retry the connection.

### Session

Use the `session` method if you want to run `dbt` against a pySpark session. 

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: spark
      method: session
      schema: [database/schema name]
      host: NA                           # not used, but required by `dbt-core`
      server_side_parameters:
        "spark.driver.memory": "4g" 
```

</File>

## Optional configurations

### Retries

Intermittent errors can crop up unexpectedly while running queries against Apache Spark. If `retry_all` is enabled, dbt-spark will naively retry any query that fails, based on the configuration supplied by `connect_timeout` and `connect_retries`. It does not attempt to determine if the query failure was transient or likely to succeed on retry. This configuration is recommended in production environments, where queries ought to be succeeding.

For instance, this will instruct dbt to retry all failed queries up to 3 times, with a 5 second delay between each retry:

<File name='~/.dbt/profiles.yml'>

```yaml
retry_all: true
connect_timeout: 5
connect_retries: 3
```

</File>

### Server side configuration

Spark can be customized using [Application Properties](https://spark.apache.org/docs/latest/configuration.html). Using these properties the execution can be customized, for example, to allocate more memory to the driver process. Also, the Spark SQL runtime can be set through these properties. For example, this allows the user to [set a Spark catalogs](https://spark.apache.org/docs/latest/configuration.html#spark-sql).

## Caveats

When facing difficulties, run `poetry run dbt debug --log-level=debug`. The logs are saved at `logs/dbt.log`.

### Usage with EMR
To connect to Apache Spark running on an Amazon EMR cluster, you will need to run `sudo /usr/lib/spark/sbin/start-thriftserver.sh` on the master node of the cluster to start the Thrift server (see [the docs](https://aws.amazon.com/premiumsupport/knowledge-center/jdbc-connection-emr/) for more information). You will also need to connect to port 10001, which will connect to the Spark backend Thrift server; port 10000 will instead connect to a Hive backend, which will not work correctly with dbt.

### Supported functionality

Most <Constant name="core" /> functionality is supported, but some features are only available
on Delta Lake (Databricks).

Delta-only features:
1. Incremental model updates by `unique_key` instead of `partition_by` (see [`merge` strategy](/reference/resource-configs/spark-configs#the-merge-strategy))
2. [Snapshots](/docs/build/snapshots)
3. [Persisting](/reference/resource-configs/persist_docs) column-level descriptions as database comments

### Default namespace with Thrift connection method

To run metadata queries in dbt, you need to have a namespace named `default` in Spark when connecting with Thrift. You can check available namespaces by using Spark's `pyspark` and running `spark.sql("SHOW NAMESPACES").show()`. If the default namespace doesn't exist, create it by running `spark.sql("CREATE NAMESPACE default").show()`.

If there's a network connection issue, your logs will display an error like `Could not connect to any of [('127.0.0.1', 10000)]` (or something similar).

</VersionBlock>

