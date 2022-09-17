
---
title: "Starburst & Trino Profile"
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

## Overview of dbt-trino

**Maintained by:** Starburst Data, Inc.          
**Source:** [Github](https://github.com/starburstdata/dbt-trino)    
**Core version:** v0.20.0 and newer      
**dbt Cloud:** Not Supported      
**dbt Slack channel:** [Slack](https://getdbt.slack.com/archives/CNNPBQ24R)       

![dbt-trino stars](https://img.shields.io/github/stars/starburstdata/dbt-trino?style=for-the-badge)

## Installation and Distribution

dbt's Trino adapter is managed in its own repository, [dbt-trino](https://github.com/starburstdata/dbt-trino). To use the Trino adapter, you must install the `dbt-trino` plugin:

### Using pip
The following command will install the latest version of `dbt-trino` as well as the requisite version of `dbt-core`:

```
pip install dbt-trino
```


## Set up a Trino or Starburst Target

Trino or Starburst targets should be set up using the following configuration in your `profiles.yml` file.

See all possible profile configuration options [here](#configuration).

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: none  # optional, one of {none | ldap | kerberos | oauth | jwt | certificate}
      user: [user]
      password: [password]  # required if method is ldap or kerberos
      database: [database name]
      host: [hostname]
      port: [port number]
      schema: [your dbt schema]
      threads: [1 or more]
      retries: [1 or more] # default: 3
      http_scheme: [http or https]
      session_properties:
        [some_session_property]: [value] # run SHOW SESSION query to get current session properties
```

</File>

## Incremental models

Incremental strategies supported by the adapter are:

- append (default incremental strategy) - append only adds the new records based on the condition specified in the is_incremental() conditional block.
- delete+insert - Through the delete+insert incremental strategy, you can instruct dbt to use a two-step incremental approach. It will first delete the records detected through the configured is_incremental() block and re-insert them.
- merge - Through the merge incremental strategy, dbt-trino constructs a MERGE statement which inserts new and updates existing records based on the unique key (specified by unique_key).
If your unique_key is not actually unique, the delete+insert strategy can be used instead. Note that some connectors in Trino have limited or no support for MERGE.

## Configuration

A dbt-trino profile can be configured to run against Trino or Starburst using the following configuration:

| Option                         | Description                                                                                                  | Required?                                                                                                        | Example                          |
|--------------------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|----------------------------------|
| method                         | The Trino authentication method to use                                                                       | Optional (default is `none`, supported methods are `ldap`, `kerberos`, `jwt`, `oauth` or `certificate`)          | `none` or `kerberos`             |
| user                           | Username for authentication                                                                                  | Optional (required if `method` is `none`, `ldap` or `kerberos`)                                                  | `commander`                      |
| password                       | Password for authentication                                                                                  | Optional (required if `method` is `ldap`)                                                                        | `none` or `abc123`               |
| keytab                         | Path to keytab for kerberos authentication                                                                   | Optional (may be required if `method` is `kerberos`)                                                             | `/tmp/trino.keytab`              |
| krb5_config                    | Path to config for kerberos authentication                                                                   | Optional (may be required if `method` is `kerberos`)                                                             | `/tmp/krb5.conf`                 |
| principal                      | Principal for kerberos authentication                                                                        | Optional (may be required if `method` is `kerberos`)                                                             | `trino@EXAMPLE.COM`              |
| service_name                   | Service name for kerberos authentication                                                                     | Optional (default is `trino`)                                                                                    | `abc123`                         |
| jwt_token                      | JWT token for authentication                                                                                 | Optional (required if `method` is `jwt`)                                                                         | `none` or `abc123`               |
| client_certificate             | Path to client certificate to be used for certificate based authentication                                   | Optional (required if `method` is `certificate`)                                                                 | `/tmp/tls.crt`                   |
| client_private_key             | Path to client private key to be used for certificate based authentication                                   | Optional (required if `method` is `certificate`)                                                                 | `/tmp/tls.key`                   |
| http_headers                   | HTTP Headers to send alongside requests to Trino, specified as a yaml dictionary of (header, value) pairs.   | Optional                                                                                                         | `X-Trino-Client-Info: dbt-trino` |
| http_scheme                    | The HTTP scheme to use for requests to Trino                                                                 | Optional (default is `http`, or `https` for `method: kerberos`, `ldap` or `jwt`)                                 | `https` or `http`                |
| cert                           | The full path to a certificate file for authentication with trino                                            | Optional                                                                                                         |                                  |
| session_properties             | Sets Trino session properties used in the connection                                                         | Optional                                                                                                         | `query_max_run_time: 5d`         |
| database                       | Specify the database to build models into                                                                    | Required                                                                                                         | `analytics`                      |
| schema                         | Specify the schema to build models into. Note: it is not recommended to use upper or mixed case schema names | Required                                                                                                         | `public`                         |
| host                           | The hostname to connect to                                                                                   | Required                                                                                                         | `127.0.0.1`                      |
| port                           | The port to connect to the host on                                                                           | Required                                                                                                         | `8080`                           |
| threads                        | How many threads dbt should use                                                                              | Optional (default is `1`)                                                                                        | `8`                              |
| prepared_statements_enabled    | Enable usage of Trino prepared statements (used in `dbt seed` commands)                                      | Optional (default is `true`)                                                                                     | `true` or `false`                |
| retries                        | Configure how many times a database operation is retried when connection issues arise                        | Optional (default is `3`)
