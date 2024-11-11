---
title: "Teradata setup"
description: "Read this guide to learn about the Teradata warehouse setup in dbt."
id: "teradata-setup"
meta:
  maintained_by: Teradata
  authors: Teradata
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

Some core functionality may be limited. If you're interested in contributing, check out the source code in the repository listed in the next section.


import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Python compatibility

| Plugin version | Python 3.9  | Python 3.10 | Python 3.11  |
| -------------- | ----------- | ----------- | ------------ |
|1.0.0.x         | ✅          | ❌          | ❌
|1.1.x.x         | ✅          | ✅          | ❌
|1.2.x.x         | ✅          | ✅          | ❌
|1.3.x.x         | ✅          | ✅          | ❌
|1.4.x.x         | ✅          | ✅          | ✅
|1.5.x           | ✅          | ✅          | ✅
|1.6.x           | ✅          | ✅          | ✅
|1.7.x           | ✅          | ✅          | ✅
|1.8.x           | ✅          | ✅          | ✅

## dbt dependent packages version compatibility

| dbt-teradata |  dbt-core  | dbt-teradata-util |  dbt-util      |
|--------------|------------|-------------------|----------------|
| 1.2.x        | 1.2.x      | 0.1.0             | 0.9.x or below |
| 1.6.7        | 1.6.7      | 1.1.1             | 1.1.1          |
| 1.7.x        | 1.7.x      | 1.1.1             | 1.1.1          |
| 1.8.x        | 1.8.x      | 1.1.1             | 1.1.1          |


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
      threads: [optional, 1 or more]
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
`logdata`               |             | string         | Specifies extra data for the chosen logon authentication method. Equivalent to the Teradata JDBC Driver `LOGDATA` connection parameter.
`logon_timeout`         | `"0"`       | quoted integer | Specifies the logon timeout in seconds. Zero means no timeout.
`logmech`               | `"TD2"`     | string         | Specifies the logon authentication method. Equivalent to the Teradata JDBC Driver `LOGMECH` connection parameter. Possible values are `TD2` (the default), `JWT`, `LDAP`, `KRB5` for Kerberos, or `TDNEGO`.
`max_message_body`      | `"2097000"` | quoted integer | Specifies the maximum Response Message size in bytes. Equivalent to the Teradata JDBC Driver `MAX_MESSAGE_BODY` connection parameter.
`partition`             | `"DBC/SQL"` | string         | Specifies the database partition. Equivalent to the Teradata JDBC Driver `PARTITION` connection parameter.
`request_timeout`       |   `"0"`     | quoted integer | Specifies the timeout for executing each SQL request. Zero means no timeout.
`retries`               |   `0`       | integer        | Allows an adapter to automatically try again when the attempt to open a new connection on the database has a transient, infrequent error. This option can be set using the retries configuration. Default value is 0. The default wait period between connection attempts is one second. retry_timeout (seconds) option allows us to adjust this waiting period.
`runstartup`            |  "false"    | quoted boolean | Controls whether the user's STARTUP SQL request is executed after logon. For more information, refer to User STARTUP SQL Request. Equivalent to the Teradata JDBC Driver RUNSTARTUP connection parameter. If retries is set to 3, the adapter will try to establish a new connection three times if an error occurs.
`sessions`              |             | quoted integer | Specifies the number of data transfer connections for FastLoad or FastExport. The default (recommended) lets the database choose the appropriate number of connections. Equivalent to the Teradata JDBC Driver SESSIONS connection parameter.
`sip_support`           | `"true"`    | quoted boolean | Controls whether StatementInfo parcel is used. Equivalent to the Teradata JDBC Driver `SIP_SUPPORT` connection parameter.
`sp_spl`                | `"true"`    | quoted boolean | Controls whether stored procedure source code is saved in the database when a SQL stored procedure is created. Equivalent to the Teradata JDBC Driver SP_SPL connection parameter.
`sslca`                 |             | string         | Specifies the file name of a PEM file that contains Certificate Authority (CA) certificates for use with `sslmode` values `VERIFY-CA` or `VERIFY-FULL`. Equivalent to the Teradata JDBC Driver `SSLCA` connection parameter.
`sslcrc`                | `"ALLOW"`   | string         | Equivalent to the Teradata JDBC Driver SSLCRC connection parameter. Values are case-insensitive.<br/>&bull; ALLOW provides "soft fail" behavior such that communication failures are ignored during certificate revocation checking. <br/>&bull; REQUIRE mandates that certificate revocation checking must succeed.
`sslcapath`             |             | string         | Specifies a directory of PEM files that contain Certificate Authority (CA) certificates for use with `sslmode` values `VERIFY-CA` or `VERIFY-FULL`. Only files with an extension of `.pem` are used. Other files in the specified directory are not used. Equivalent to the Teradata JDBC Driver `SSLCAPATH` connection parameter.
`sslcipher`             |             | string         | Specifies the TLS cipher for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `SSLCIPHER` connection parameter.
`sslmode`               | `"PREFER"`  | string         | Specifies the mode for connections to the database. Equivalent to the Teradata JDBC Driver `SSLMODE` connection parameter.<br/>&bull; `DISABLE` disables HTTPS/TLS connections and uses only non-TLS connections.<br/>&bull; `ALLOW` uses non-TLS connections unless the database requires HTTPS/TLS connections.<br/>&bull; `PREFER` uses HTTPS/TLS connections unless the database does not offer HTTPS/TLS connections.<br/>&bull; `REQUIRE` uses only HTTPS/TLS connections.<br/>&bull; `VERIFY-CA` uses only HTTPS/TLS connections and verifies that the server certificate is valid and trusted.<br/>&bull; `VERIFY-FULL` uses only HTTPS/TLS connections, verifies that the server certificate is valid and trusted, and verifies that the server certificate matches the database hostname.
`sslprotocol`           | `"TLSv1.2"` | string         | Specifies the TLS protocol for HTTPS/TLS connections. Equivalent to the Teradata JDBC Driver `SSLPROTOCOL` connection parameter.
`teradata_values`       | `"true"`    | quoted boolean | Controls whether `str` or a more specific Python data type is used for certain result set column value types.
`query_band`            | `"org=teradata-internal-telem;appname=dbt;"`    | string | Specifies the Query Band string to be set for each SQL request.

Refer to [connection parameters](https://github.com/Teradata/python-driver#connection-parameters) for the full description of the connection parameters.

## Supported features

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
* `valid_history` (early access)

:::info
- To learn more about dbt incremental strategies, refer to [the dbt incremental strategy documentation](/docs/build/incremental-strategy).
- To learn more about `valid_history` incremental strategy, refer to [Teradata configs](/reference/resource-configs/teradata-configs).
:::

### Commands

All dbt commands are supported.

## Support for model contracts
Model contracts are supported with dbt-teradata v1.7.1 and onwards.
Constraint support and enforcement in dbt-teradata:

| Constraint type |	Support	Platform | enforcement |
|-----------------|------------------|-------------|
| not_null	      | ✅ Supported	 | ✅ Enforced |
| primary_key	  | ✅ Supported	 | ✅ Enforced |
| foreign_key	  | ✅ Supported	 | ✅ Enforced |
| unique	      | ✅ Supported	 | ✅ Enforced |
| check	          | ✅ Supported	 | ✅ Enforced |

Refer to [Model contracts](/docs/collaborate/govern/model-contracts) for more info.

## Support for `dbt-utils` package
`dbt-utils` package is supported through `teradata/teradata_utils` dbt package. The package provides a compatibility layer between `dbt_utils` and `dbt-teradata`. See [teradata_utils](https://hub.getdbt.com/teradata/teradata_utils/latest/) package for install instructions.

### Cross DB macros
Starting with release 1.3, some macros were migrated from [teradata-dbt-utils](https://github.com/Teradata/dbt-teradata-utils) dbt package to the connector. Refer the following table for the macros supported by the connector.

For using cross-DB macros, teradata-utils as a macro namespace will not be used, as cross-DB macros have been migrated from teradata-utils to Dbt-Teradata.


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
| Cross-database macros | generate_series               | :white_check_mark:    | custom macro provided
| Cross-database macros | date_spine                    | :white_check_mark:    | no customization


#### examples for cross DB macros
  ##### <a name="replace"></a>replace
  \{\{ dbt.replace("string_text_column", "old_chars", "new_chars") \}\}
  \{\{ replace('abcgef', 'g', 'd') \}\}

  ##### <a name="date_trunc"></a>date_trunc
  \{\{ dbt.date_trunc("date_part", "date") \}\}
  \{\{ dbt.date_trunc("DD", "'2018-01-05 12:00:00'") \}\}

  ##### <a name="datediff"></a>datediff
  `datediff` macro in teradata supports difference between dates. Differece between timestamps is not supported.

  ##### <a name="hash"></a>hash

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
  ##### <a name="last_day"></a>last_day

  `last_day` in `teradata_utils`, unlike the corresponding macro in `dbt_utils`, doesn't support `quarter` datepart.

<VersionBlock firstVersion="1.8">

dbt-teradata 1.8.0 and later versions support unit tests, enabling you to validate SQL models and logic with a small set of static inputs before going to production. This feature enhances test-driven development and boosts developer efficiency and code reliability. Learn more about dbt unit tests [here](/docs/build/unit-tests).


</VersionBlock>

## Limitations

### Transaction mode
Both ANSI and TERA modes are now supported in dbt-teradata. TERA mode's support is introduced with dbt-teradata 1.7.1, it is an initial implementation.

:::info TERA transaction mode
This is an initial implementation of the TERA transaction mode and may not support some use cases. We highly recommend validating all records or transformations using this mode to avoid unexpected issues or errors.
:::

## Credits

The adapter was originally created by [Doug Beatty](https://github.com/dbeatty10). Teradata took over the adapter in January 2022. We are grateful to Doug for founding the project and accelerating the integration of dbt + Teradata.

## License

The adapter is published using Apache-2.0 License. Refer to the [terms and conditions](https://github.com/dbt-labs/dbt-core/blob/main/License.md) to understand items such as creating derivative work and the support model. 
