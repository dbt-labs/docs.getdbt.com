---
title: "Teradata setup"
description: "Read this guide to learn about the Teradata warehouse setup in dbt."
id: "teradata-setup"
meta:
  maintained_by: Teradata
  authors: Doug Beatty and Adam Tworkiewicz
  github_repo: 'Teradata/dbt-teradata'
  pypi_package: 'dbt-teradata'
  min_core_version: 'v0.21.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-teradata'
  slack_channel_link: 'https://getdbt.slack.com/archives/C027B6BHMT3'
  platform_name: 'Teradata'
  config_page: '/reference/resource-configs/teradata-configs'
---

Some core functionality may be limited. If you're interested in contributing, check out the source code for the repository listed below.


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

<h2> Python compatibility </h2>

| Plugin version | Python 3.6  | Python 3.7  | Python 3.8  | Python 3.9  | Python 3.10 | Python 3.11  |
| -------------- | ----------- | ----------- | ----------- | ----------- | ----------- | ------------ |
| 0.19.0.x           | ✅          | ✅          | ✅          | ❌          | ❌          | ❌
| 0.20.0.x           | ✅          | ✅          | ✅          | ✅          | ❌          | ❌
| 0.21.1.x           | ✅          | ✅          | ✅          | ✅          | ❌          | ❌
| 1.0.0.x           | ❌           | ✅          | ✅          | ✅          | ❌          | ❌
|1.1.x.x            | ❌           | ✅          | ✅          | ✅          | ✅          | ❌
|1.2.x.x            | ❌           | ✅          | ✅          | ✅          | ✅          | ❌
|1.3.x.x            | ❌           | ✅          | ✅          | ✅          | ✅          | ❌
|1.4.x.x            | ❌           | ✅          | ✅          | ✅          | ✅          | ✅
|1.5.x              | ❌           | ✅          | ✅          | ✅          | ✅          | ✅
|1.6.x              | ❌           | ❌          | ✅          | ✅          | ✅          | ✅

<h2> Python compatibility </h2>

| dbt-teradta |  dbt-core  | dbt-teradata-util |  dbt-util      |
|-------------|------------|-------------------|----------------|
| 1.2.x       | 1.2.x      | 0.1.0             | 0.9.x or below |


<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


### Connecting to Teradata

To connect to Teradata Vantage from dbt, you'll need to add a [profile](https://docs.getdbt.com/docs/core/connection-profiles) to your `profiles.yml` file. A Teradata profile conforms to the following syntax:

<File name='profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: teradata
      user: <username>
      password: <password>
      schema: <database-name>
      tmode: ANSI
      threads: 1
      #optional fields
      <field-name: <field-value>
```

</File>

#### Description of Teradata Profile Fields

The following fields are required:

Parameter               | Default     | Type           | Description
----------------------- | ----------- | -------------- | ---
`user`                  |             | string         | Specifies the database username. Equivalent to the Teradata JDBC Driver `USER` connection parameter.
`password`              |             | string         | Specifies the database password. Equivalent to the Teradata JDBC Driver `PASSWORD` connection parameter.
`schema`              |             | string         | Specifies the initial database to use after logon, instead of the user's default database.
`tmode`                 | `"ANSI"` | string         | Specifies the transaction mode. Only `ANSI` mode is currently supported.


The plugin also supports the following optional connection parameters:

Parameter               | Default     | Type           | Description
----------------------- | ----------- | -------------- | ---
`account`               |             | string         | Specifies the database account. Equivalent to the Teradata JDBC Driver `ACCOUNT` connection parameter.
`browser`               |             | string         | Specifies the command to open the browser for Browser Authentication, when logmech is BROWSER. Browser Authentication is supported for Windows and macOS. Equivalent to the Teradata JDBC Driver BROWSER connection parameter.
`browser_tab_timeout`   |   `"5"`     | quoted integer | Specifies the number of seconds to wait before closing the browser tab after Browser Authentication is completed. The default is 5 seconds. The behavior is under the browser's control, and not all browsers support automatic closing of browser tabs.
`browser_timeout`       |   `"180"`   | quoted integer | Specifies the number of seconds that the driver will wait for Browser Authentication to complete. The default is 180 seconds (3 minutes).
`column_name`           | `"false"`   | quoted boolean | Controls the behavior of cursor `.description` sequence `name` items. Equivalent to the Teradata JDBC Driver `COLUMN_NAME` connection parameter. False specifies that a cursor `.description` sequence `name` item provides the AS-clause name if available, or the column name if available, or the column title. True specifies that a cursor `.description` sequence `name` item provides the column name if available, but has no effect when StatementInfo parcel support is unavailable.
`connect_failure_ttl`   | `"0"`       | quoted integer | Specifies the time-to-live in seconds to remember the most recent connection failure for each IP address/port combination. The driver subsequently skips connection attempts to that IP address/port for the duration of the time-to-live. The default value of zero disables this feature. The recommended value is half the database restart time. Equivalent to the Teradata JDBC Driver `CONNECT_FAILURE_TTL` connection parameter.
`connect_timeout`       |  `"10000"`  | quoted integer | Specifies the timeout in milliseconds for establishing a TCP socket connection. Specify 0 for no timeout. The default is 10 seconds (10000 milliseconds).
`cop`                   | `"true"`    | quoted boolean | Specifies whether COP Discovery is performed. Equivalent to the Teradata JDBC Driver `COP` connection parameter.
`coplast`               | `"false"`   | quoted boolean | Specifies how COP Discovery determines the last COP hostname. Equivalent to the Teradata JDBC Driver `COPLAST` connection parameter. When `coplast` is `false` or omitted, or COP Discovery is turned off, then no DNS lookup occurs for the coplast hostname. When `coplast` is `true`, and COP Discovery is turned on, then a DNS lookup occurs for a coplast hostname.
`port`                  | `"1025"`    | quoted integer | Specifies the database port number. Equivalent to the Teradata JDBC Driver `DBS_PORT` connection parameter.
`encryptdata`           | `"false"`   | quoted boolean | Controls encryption of data exchanged between the driver and the database. Equivalent to the Teradata JDBC Driver `ENCRYPTDATA` connection parameter.
`fake_result_sets`      | `"false"`   | quoted boolean | Controls whether a fake result set containing statement metadata precedes each real result set.
`field_quote`           | `"\""`      | string         | Specifies a single character string used to quote fields in a CSV file.
`field_sep`             | `","`       | string         | Specifies a single character string used to separate fields in a CSV file. Equivalent to the Teradata JDBC Driver `FIELD_SEP` connection parameter.
`host`                  |             | string         | Specifies the database hostname.
`https_port`            | `"443"`     | quoted integer | Specifies the database port number for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `HTTPS_PORT` connection parameter.
`lob_support`           | `"true"`    | quoted boolean | Controls LOB support. Equivalent to the Teradata JDBC Driver `LOB_SUPPORT` connection parameter.
`log`                   | `"0"`       | quoted integer | Controls debug logging. Somewhat equivalent to the Teradata JDBC Driver `LOG` connection parameter. This parameter's behavior is subject to change in the future. This parameter's value is currently defined as an integer in which the 1-bit governs function and method tracing, the 2-bit governs debug logging, the 4-bit governs transmit and receive message hex dumps, and the 8-bit governs timing. Compose the value by adding together 1, 2, 4, and/or 8.
`logdata`               |             | string         | Specifies extra data for the chosen logon authentication method. Equivalent to the Teradata JDBC Driver 
`LOGDATA` connection parameter.
`logon_timeout`         | `"0"`       | quoted integer | Specifies the logon timeout in seconds. Zero means no timeout.

`logmech`               | `"TD2"`     | string         | Specifies the logon authentication method. Equivalent to the Teradata JDBC Driver `LOGMECH` connection parameter. Possible values are `TD2` (the default), `JWT`, `LDAP`, `KRB5` for Kerberos, or `TDNEGO`.
`max_message_body`      | `"2097000"` | quoted integer | Specifies the maximum Response Message size in bytes. Equivalent to the Teradata JDBC Driver `MAX_MESSAGE_BODY` connection parameter.
`partition`             | `"DBC/SQL"` | string         | Specifies the database partition. Equivalent to the Teradata JDBC Driver `PARTITION` connection parameter.
`request_timeout`       |   `"0"`     | quoted integer | Specifies the timeout for executing each SQL request. Zero means no timeout.
`retries`               |   `0`       | integer        | Allows an adapter to automatically try again when the attempt to open a new connection on the database has a transient, infrequent error. This option can be set using the retries configuration. Default value is 0. The default wait period between connection attempts is one second. retry_timeout (seconds) option allows us to adjust this waiting period.
`runstartup`            |  "false"    | quoted boolean | Controls whether the user's STARTUP SQL request is executed after logon. For more information, refer to User STARTUP SQL Request. Equivalent to the Teradata JDBC Driver RUNSTARTUP connection parameter.

If retries is set to 3, the adapter will try to establish a new connection three times if an error occurs.
`sessions`              |             | quoted integer | Specifies the number of data transfer connections for FastLoad or FastExport. The default (recommended) lets the database choose the appropriate number of connections. Equivalent to the Teradata JDBC Driver SESSIONS connection parameter.

`sip_support`           | `"true"`    | quoted boolean | Controls whether StatementInfo parcel is used. Equivalent to the Teradata JDBC Driver `SIP_SUPPORT` connection parameter.
`sp_spl`                | `"true"`    | quoted boolean | Controls whether stored procedure source code is saved in the database when a SQL stored procedure is created. Equivalent to the Teradata JDBC Driver SP_SPL connection parameter.

`sslca`                 |             | string         | Specifies the file name of a PEM file that contains Certificate Authority (CA) certificates for use with 
`sslmode` values `VERIFY-CA` or `VERIFY-FULL`. Equivalent to the Teradata JDBC Driver `SSLCA` connection parameter.
`sslcrc`                | `"ALLOW"`   | string         | Equivalent to the Teradata JDBC Driver SSLCRC connection parameter. Values are case-insensitive.
• ALLOW provides "soft fail" behavior such that communication failures are ignored during certificate revocation checking.
• REQUIRE mandates that certificate revocation checking must succeed.
`sslcapath`             |             | string         | Specifies a directory of PEM files that contain Certificate Authority (CA) certificates for use with `sslmode` values `VERIFY-CA` or `VERIFY-FULL`. Only files with an extension of `.pem` are used. Other files in the specified directory are not used. Equivalent to the Teradata JDBC Driver `SSLCAPATH` connection parameter.
`sslcipher`             |             | string         | Specifies the TLS cipher for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `SSLCIPHER` connection parameter.
`sslmode`               | `"PREFER"`  | string         | Specifies the mode for connections to the database. Equivalent to the Teradata JDBC Driver `SSLMODE` connection parameter.<br/>&bull; `DISABLE` disables HTTPS/TLS connections and uses only non-TLS connections.<br/>&bull; `ALLOW` uses non-TLS connections unless the database requires HTTPS/TLS connections.<br/>&bull; `PREFER` uses HTTPS/TLS connections unless the database does not offer HTTPS/TLS connections.<br/>&bull; `REQUIRE` uses only HTTPS/TLS connections.<br/>&bull; `VERIFY-CA` uses only HTTPS/TLS connections and verifies that the server certificate is valid and trusted.<br/>&bull; `VERIFY-FULL` uses only HTTPS/TLS connections, verifies that the server certificate is valid and trusted, and verifies that the server certificate matches the database hostname.
`sslprotocol`           | `"TLSv1.2"` | string         | Specifies the TLS protocol for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `SSLPROTOCOL` connection parameter.
`teradata_values`       | `"true"`    | quoted boolean | Controls whether `str` or a more specific Python data type is used for certain result set column value types.

For the full description of the connection parameters see https://github.com/Teradata/python-driver#connection-parameters.

## Supported Features

### Materializations

* `view`
* `table`
* `ephemeral`
* `incremental`

#### Incremental Materialization
The following incremental materialization strategies are supported:
* `append` (default)
* `delete+insert`
* `merge`

To learn more about dbt incremental strategies please check [the dbt incremental strategy documentation](https://docs.getdbt.com/docs/build/incremental-models#about-incremental_strategy).

### Commands

All dbt commands are supported.

### Custom configurations

#### General

* *Enable view column types in docs* -  Teradata Vantage has a dbscontrol configuration flag called `DisableQVCI` (QVCI - Queryable View Column Index). This flag instructs the database to build `DBC.ColumnsJQV` with view column type definitions. 

    > :information_source: Existing customers, please see [KB0022230](https://support.teradata.com/knowledge?id=kb_article_view&sys_kb_id=d066248b1b0000187361c8415b4bcb48) for more information about enabling QVCI.

  To enable this functionality you need to:
  1. Enable QVCI mode in Vantage. Use `dbscontrol` utility and then restart Teradata. Run these commands as a privileged user on a Teradata node:
      ```bash
      # option 551 is DisableQVCI. Setting it to false enables QVCI.
      dbscontrol << EOF
      M internal 551=false
      W
      EOF

      # restart Teradata
      tpareset -y Enable QVCI
      ```
  2. Instruct `dbt` to use `QVCI` mode. Include the following variable in your `dbt_project.yml`:
      ```yaml
      vars:
        use_qvci: true
      ```
      For example configuration, see `test/catalog/with_qvci/dbt_project.yml`.

#### Models

##### Table

The following options apply to table, snapshots and seed materializations.

* `table_kind` - define the table kind. Legal values are `MULTISET` (default for ANSI transaction mode required by `dbt-teradata`) and `SET`, e.g.:
    * in sql materialization definition file:
      ```yaml
      {{
        config(
            materialized="table",
            table_kind="SET"
        )
      }}
      ```
    * in seed configuration:
      ```yaml
      seeds:
        <project-name>:
          table_kind: "SET"
      ```
  For details, see [CREATE TABLE documentation](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).
* `table_option` - define table options. Legal values are:
    ```ebnf
    { MAP = map_name [COLOCATE USING colocation_name] |
      [NO] FALLBACK [PROTECTION] |
      WITH JOURNAL TABLE = table_specification |
      [NO] LOG |
      [ NO | DUAL ] [BEFORE] JOURNAL |
      [ NO | DUAL | LOCAL | NOT LOCAL ] AFTER JOURNAL |
      CHECKSUM = { DEFAULT | ON | OFF } |
      FREESPACE = integer [PERCENT] |
      mergeblockratio |
      datablocksize |
      blockcompression |
      isolated_loading
    }
    ```
    where:
    * mergeblockratio:
      ```ebnf
      { DEFAULT MERGEBLOCKRATIO |
        MERGEBLOCKRATIO = integer [PERCENT] |
        NO MERGEBLOCKRATIO
      }
      ```
    * datablocksize:
      ```ebnf
      DATABLOCKSIZE = {
        data_block_size [ BYTES | KBYTES | KILOBYTES ] |
        { MINIMUM | MAXIMUM | DEFAULT } DATABLOCKSIZE
      }
      ```
    * blockcompression:
      ```ebnf
      BLOCKCOMPRESSION = { AUTOTEMP | MANUAL | ALWAYS | NEVER | DEFAULT }
        [, BLOCKCOMPRESSIONALGORITHM = { ZLIB | ELZS_H | DEFAULT } ]
        [, BLOCKCOMPRESSIONLEVEL = { value | DEFAULT } ]
      ```
    * isolated_loading:
      ```ebnf
      WITH [NO] [CONCURRENT] ISOLATED LOADING [ FOR { ALL | INSERT | NONE } ]
      ```

    Examples:
    * in sql materialization definition file:
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK, NO JOURNAL"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK, NO JOURNAL, CHECKSUM = ON,
              NO MERGEBLOCKRATIO,
              WITH CONCURRENT ISOLATED LOADING FOR ALL"
        )
      }}
      ```
    * in seed configuration:
      ```yaml
      seeds:
        <project-name>:
          table_option:"NO FALLBACK"
      ```
      ```yaml
      seeds:
        <project-name>:
          table_option:"NO FALLBACK, NO JOURNAL"
      ```
      ```yaml
      seeds:
        <project-name>:
          table_option: "NO FALLBACK, NO JOURNAL, CHECKSUM = ON,
            NO MERGEBLOCKRATIO,
            WITH CONCURRENT ISOLATED LOADING FOR ALL"
      ```

  For details, see [CREATE TABLE documentation](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).
* `with_statistics` - should statistics be copied from the base table, e.g.:
    ```yaml
    {{
      config(
          materialized="table",
          with_statistics="true"
      )
    }}
    ```
    This option is not available for seeds as seeds do not use `CREATE TABLE ... AS` syntax.

    For details, see [CREATE TABLE documentation](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).

* `index` - defines table indices:
    ```ebnf
    [UNIQUE] PRIMARY INDEX [index_name] ( index_column_name [,...] ) |
    NO PRIMARY INDEX |
    PRIMARY AMP [INDEX] [index_name] ( index_column_name [,...] ) |
    PARTITION BY { partitioning_level | ( partitioning_level [,...] ) } |
    UNIQUE INDEX [ index_name ] [ ( index_column_name [,...] ) ] [loading] |
    INDEX [index_name] [ALL] ( index_column_name [,...] ) [ordering] [loading]
    [,...]
    ```
    where:
    * partitioning_level:
      ```ebnf
      { partitioning_expression |
        COLUMN [ [NO] AUTO COMPRESS |
        COLUMN [ [NO] AUTO COMPRESS ] [ ALL BUT ] column_partition ]
      } [ ADD constant ]
      ```
    * ordering:
      ```ebnf
      ORDER BY [ VALUES | HASH ] [ ( order_column_name ) ]
      ```
    * loading:
      ```ebnf
      WITH [NO] LOAD IDENTITY
      ```
    e.g.:
    * in sql materialization definition file:
      ```yaml
      {{
        config(
            materialized="table",
            index="UNIQUE PRIMARY INDEX ( GlobalID )"
        )
      }}
      ```
      > :information_source: Note, unlike in `table_option`, there are no commas between index statements!
      ```yaml
      {{
        config(
            materialized="table",
            index="PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            index="PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)
            INDEX index_attrA (attrA) WITH LOAD IDENTITY"
        )
      }}
      ```
    * in seed configuration:
      ```yaml
      seeds:
        <project-name>:
          index: "UNIQUE PRIMARY INDEX ( GlobalID )"
      ```
      > :information_source: Note, unlike in `table_option`, there are no commas between index statements!
      ```yaml
      seeds:
        <project-name>:
          index: "PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)"
      ```
      ```yaml
      seeds:
        <project-name>:
          index: "PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)
            INDEX index_attrA (attrA) WITH LOAD IDENTITY"
      ```

#### Seeds

Seeds, in addition to the above materialization modifiers, have the following options:
* `use_fastload` - use [fastload](https://github.com/Teradata/python-driver#FastLoad) when handling `dbt seed` command. The option will likely speed up loading when your seed files have hundreds of thousands of rows. You can set this seed configuration option in your `project.yml` file, e.g.:
    ```yaml
    seeds:
      <project-name>:
        +use_fastload: true
    ```

#### Grants

Grants are supported in dbt-teradata adapter with release version 1.2.0 and above. You can use grants to manage access to the datasets you're producing with dbt. To implement these permissions, define grants as resource configs on each model, seed, or snapshot. Define the default grants that apply to the entire project in your `dbt_project.yml`, and define model-specific grants within each model's SQL or YAML file.

for e.g. :
  models/schema.yml
  ```yaml
  models:
    - name: model_name
      config:
        grants:
          select: ['user_a', 'user_b']
  ```

Another e.g. for adding multiple grants:

  ```yaml
  models:
  - name: model_name
    config:
      materialized: table
      grants:
        select: ["user_b"]
        insert: ["user_c"]
  ```
> :information_source: `copy_grants` is not supported in Teradata.

More on Grants can be found at https://docs.getdbt.com/reference/resource-configs/grants

### Cross DB macros
Starting with release 1.3, some macros were migrated from [teradata-dbt-utils](https://github.com/Teradata/dbt-teradata-utils) dbt package to the connector. See the table below for the macros supported from the connector.

For using cross DB macros, teradata-utils as a macro namespace will not be used, as cross DB macros have been migrated from teradata-utils to Dbt-Teradata.


#### Compatibility

|     Macro Group       |           Macro Name          |         Status        |                                 Comment                                |
|:---------------------:|:-----------------------------:|:---------------------:|:----------------------------------------------------------------------:|
| Cross-database macros | current_timestamp             | :white_check_mark:    | custom macro provided                                                  |
| Cross-database macros | dateadd                       | :white_check_mark:    | custom macro provided                                                  |
| Cross-database macros | datediff                      | :white_check_mark:    | custom macro provided, see [compatibility note](#datediff)             |
| Cross-database macros | split_part                    | :white_check_mark:    | custom macro provided                                                  |
| Cross-database macros | date_trunc                    | :white_check_mark:    | custom macro provided                                                  |
| Cross-database macros | hash                          | :white_check_mark:    | custom macro provided, see [compatibility note](#hash)                 |
| Cross-database macros | replace                       | :white_check_mark:    | custom macro provided                                                  |
| Cross-database macros | type_string                   | :white_check_mark:    | custom macro provided                                                  |
| Cross-database macros | last_day                      | :white_check_mark:    | no customization needed, see [compatibility note](#last_day)           |
| Cross-database macros | width_bucket                  | :white_check_mark:    | no customization


#### examples for cross DB macros
Replace:
{{ dbt.replace("string_text_column", "old_chars", "new_chars") }}
{{ replace('abcgef', 'g', 'd') }}

Date truncate:
{{ dbt.date_trunc("date_part", "date") }}
{{ dbt.date_trunc("DD", "'2018-01-05 12:00:00'") }}

#### <a name="datediff"></a>datediff
`datediff` macro in teradata supports difference between dates. Differece between timestamps is not supported.

#### <a name="hash"></a>hash

`Hash` macro needs an `md5` function implementation. Teradata doesn't support `md5` natively. You need to install a User Defined Function (UDF):
1. Download the md5 UDF implementation from Teradata (registration required): https://downloads.teradata.com/download/extensibility/md5-message-digest-udf.
1. Unzip the package and go to `src` directory.
1. Start up `bteq` and connect to your database.
1. Create database `GLOBAL_FUNCTIONS` that will host the UDF. You can't change the database name as it's hardcoded in the macro:
    ```sql
    CREATE DATABASE GLOBAL_FUNCTIONS AS PERMANENT = 60e6, SPOOL = 120e6;
    ```
1. Create the UDF. Replace `<CURRENT_USER>` with your current database user:
    ```sql
    GRANT CREATE FUNCTION ON GLOBAL_FUNCTIONS TO <CURRENT_USER>;
    DATABASE GLOBAL_FUNCTIONS;
    .run file = hash_md5.btq
    ```
1. Grant permissions to run the UDF with grant option.
    ```sql
    GRANT EXECUTE FUNCTION ON GLOBAL_FUNCTIONS TO PUBLIC WITH GRANT OPTION;
    ```
#### <a name="last_day"></a>last_day

`last_day` in `teradata_utils`, unlike the corresponding macro in `dbt_utils`, doesn't support `quarter` datepart.

## Common Teradata-specific tasks
* *collect statistics* - when a table is created or modified significantly, there might be a need to tell Teradata to collect statistics for the optimizer. It can be done using `COLLECT STATISTICS` command. You can perform this step using dbt's `post-hooks`, e.g.:
  ```yaml
  {{ config(
    post_hook=[
      "COLLECT STATISTICS ON  {{ this }} COLUMN (column_1,  column_2  ...);"
      ]
  )}}
  ```
  See [Collecting Statistics documentation](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/RAyUdGfvREwbO9J0DMNpLw) for more information.

## Support for model contracts
Model constracts are not yet supported with dbt-teradata.

## Support for `dbt-utils` package
`dbt-utils` package is supported through `teradata/teradata_utils` dbt package. The package provides a compatibility layer between `dbt_utils` and `dbt-teradata`. See [teradata_utils](https://hub.getdbt.com/teradata/teradata_utils/latest/) package for install instructions.

## Limitations

### Transaction mode
Only ANSI transaction mode is supported.

## Credits

The adapter was originally created by [Doug Beatty](https://github.com/dbeatty10). Teradata took over the adapter in January 2022. We are grateful to Doug for founding the project and accelerating the integration of dbt + Teradata.

## License

The adapter is published using Apache-2.0 License. Please see [the license](LICENSE) for terms and conditions, such as creating derivative work and the support model. 
