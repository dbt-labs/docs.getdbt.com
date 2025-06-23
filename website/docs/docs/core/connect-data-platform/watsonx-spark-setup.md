---
title: "IBM watsonx.data Spark setup"
description: "Read this guide to learn about the IBM watsonx.data Spark setup in dbt."
id: "watsonx-spark-setup"
meta:
  maintained_by: IBM
  authors: Bayan Albunayan, Reema Alzaid, Manjot Sidhu 
  github_repo: 'IBM/dbt-watsonx-spark'
  pypi_package: 'dbt-watsonx-spark'
  min_core_version: v0.0.8
  cloud_support: 'Not Supported'
  min_supported_version: 'n/a'
  slack_channel_name: 
  slack_channel_link: 
  platform_name: IBM watsonx.data
  config_page: /reference/resource-configs/watsonx-Spark-config
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>

The `dbt-watsonx-spark` adapter allows you to use dbt to transform and manage data on IBM watsonx.data Spark, leveraging its distributed SQL query engine capabilities.

Before proceeding, ensure you have the following:
- An active IBM watsonx.data, For [IBM Cloud (SaaS)](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-getting-started). For [Software](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=installing-watsonxdata-developer-version)
- Provision **Native Spark engine** in watsonx.data, For [IBM Cloud (SaaS)](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-prov_nspark). For [Software](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=spark-native-engine)
- An active **Spark query server** in your **Native Spark engine** 

Read the official documentation for using **watsonx.data** with `dbt-watsonx-spark`

- [Documentation for IBM Cloud and SaaS offerings](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-dbt_watsonx_spark_inst)
- [Documentation for IBM watsonx.data software](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=integration-data-build-tool-adapter-spark)

## Installing dbt-watsonx-spark
Note: Installing an adapter doesn't install '<Constant name="core" />' automatically. This is because adapters and <Constant name="core" /> versions are decoupled to avoid overwriting <Constant name="core" /> installations. Use the following command for installation:

```sh
python -m pip install <Constant name="core" /> dbt-watsonx-spark
```

## Configuring `dbt-watsonx-spark`
For IBM watsonx.data-specific configuration, refer to [IBM watsonx.data configs.](/reference/resource-configs/watsonx-spark-config)

## Connecting to IBM watsonx.data Spark

To connect dbt with watsonx.data Spark, configure a profile in your `profiles.yml` file located in the `.dbt/` directory of your home folder. The following is an example configuration for connecting to IBM watsonx.data SaaS and Software instances:

<File name='~/.dbt/profiles.yml'>

```yaml
project_name:
  target: "dev"
  outputs:
    dev:
      type: watsonx_spark
      method: http
      schema: [schema name]
      host: [hostname]
      uri: [uri]
      catalog: [catalog name]
      use_ssl: false
      auth:
        instance: [Watsonx.data Instance ID]
        user: [username]
        apikey: [apikey]
```

</File>

## Host parameters

The following profile fields are required to configure watsonx.data Spark connections. For IBM watsonx.data SaaS or Software instances, To get the 'profile' details, click 'View connect details' when the 'query server' is in RUNNING status in watsonx.data (In watsonx.data (both SaaS or Software). The Connection details page opens with the profile configuration.
Copy and paste the connection details in the profiles.yml file that is located in .dbt of your home directory

The following profile fields are required to configure watsonx.data Spark connections:

| Option     | Required/Optional             |  <div style={{width:'200px'}}>Description</div>                           | <div style={{width:'300px'}}>Example</div>         |
| ---------- | ----------------------------- | ------------------------------------------------------------------------- | ----------------- |
| `method`   | Required |    Specifies the connection method to the spark query server. Use `http`.    | `http`            |
| `schema`   | Required|    To choose an existing schema within spark engine or create a new schema.  | `spark_schema`    |
| `host`     | Required |    Hostname of the watsonx.data console. For more information, see [Getting connection information](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=references-getting-connection-information#connection_info__conn_info_).| `https://dataplatform.cloud.ibm.com`       |
| `uri`      | Required| URI of your query server that is running on watsonx.data. For more information, see [Getting connection information](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x?topic=references-getting-connection-information#connection_info__conn_info_). | `/lakehouse/api/v2/spark_engines/<sparkID>/query_servers/<queryID>/connect/cliservice`|
| `catalog`  | Required                      | The catalog that is associated with the Spark engine.                     | `my_catalog`      |
| `use_ssl`  | Optional (default: **false**) | Specifies whether to use SSL.                                             | `true` or `false` |
| `instance` | Required                      | For **SaaS** set it as CRN of watsonx.data. As for **Software**, set it as instance ID of watsonx.data| `1726574045872688`|
| `user`     | Required                      | Username for the watsonx.data instance. for [Saas] use email as username                                  | `username` or `user@example.com`|
| `apikey`   | Required                      | Your API key. For more info on [SaaS](https://www.ibm.com/docs/en/software-hub/5.1.x?topic=started-generating-api-keys), For [Software](https://cloud.ibm.com/docs/account?topic=account-userapikey&interface=ui#manage-user-keys)                                                       | `API key`        |

### Schemas and catalogs

When selecting the catalog, ensure the user has read and write access. This selection does not limit your ability to query into the schema spcified/created but also serves as the default location for materialized `tables`, `views`, and `incremental`.

### SSL verification

- If the Spark instance uses an unsecured HTTP connection, set `use_ssl` to `false`.
- If the instance uses `HTTPS`, set it `true`.

## Additional parameters

The following profile fields are optional. You can configure the instance session and dbt for the connection.

| Profile field            | Description                                                  | Example                           |
| ------------------------ | ------------------------------------------------------------ | --------------------------------- |
| `threads`                | How many threads dbt should use (default is `1`)             | `8`                               |
| `retry_all`              | Enables automatic retries for transient connection failures. | `true`                            |
| `connect_timeout`        | Timeout for establishing a connection (in seconds).          | `5`                               |
| `connect_retries`        | Number of retry attempts for connection failures.            | `3`                               |

## Limitations and considerations

- **Supports only HTTP**: No support for ODBC, Thrift, or session-based connections.
- **Limited <Constant name="cloud" /> Support**: Not fully compatible with <Constant name="cloud" />.
- **Metadata Persistence**: Some dbt features, such as column descriptions, may not persist in all table formats.
