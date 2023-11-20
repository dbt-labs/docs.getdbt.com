---
title: "Apache Hive setup"
description: "Read this guide to learn about the Apache Hive warehouse setup in dbt."
id: "hive-setup"
meta:
  maintained_by: Cloudera
  authors: 'Cloudera'
  github_repo: 'cloudera/dbt-hive'
  pypi_package: 'dbt-hive'
  min_core_version: 'v1.1.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-hive'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0401DTNSKW'
  platform_name: 'Hive'
  config_page: '/reference/resource-configs/hive-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />



## Connection Methods

dbt-hive can connect to Apache Hive and Cloudera Data Platform clusters. The [Impyla](https://github.com/cloudera/impyla/) library is used to establish connections to Hive.

dbt-hive supports two transport mechanisms:
- binary
- HTTP(S)

The default mechanism is `binary`. To use HTTP transport, use the boolean option `use_http_transport: [true / false]`.

## Authentication Methods

dbt-hive supports two authentication mechanisms:
- [`insecure`](#Insecure) No authentication is used, only recommended for testing.
- [`ldap`](#ldap) Authentication via LDAP

### Insecure

This method is only recommended if you have a local install of Hive and want to test out the dbt-hive adapter. 

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: hive
      host: localhost
      port: [port] # default value: 10000
      schema: [schema name]
      
```

</File>

### LDAP

LDAP allows you to authenticate with a username and password when Hive is [configured with LDAP Auth](https://cwiki.apache.org/confluence/display/Hive/Setting+Up+HiveServer2). LDAP is supported over Binary & HTTP connection mechanisms.

This is the recommended authentication mechanism to use with Cloudera Data Platform (CDP).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
     type: hive
     host: [host name]
     http_path: [optional, http path to Hive] # default value: None
     port: [port] # default value: 10000
     auth_type: ldap
     use_http_transport: [true / false] # default value: true
     use_ssl: [true / false] # TLS should always be used with LDAP to ensure secure transmission of credentials, default value: true
     username: [username]
     password: [password]
     schema: [schema name]
```

</File>

Note: When creating workload user in CDP, make sure the user has CREATE, SELECT, ALTER, INSERT, UPDATE, DROP, INDEX, READ and WRITE permissions. If you need the user to execute GRANT statements, you should also configure the appropriate GRANT permissions for them. When using Apache Ranger, permissions for allowing GRANT are typically set using "Delegate Admin" option. For more information, see [`grants`](/reference/resource-configs/grants) and [on-run-start & on-run-end](/reference/project-configs/on-run-start-on-run-end).

### Kerberos

The Kerberos authentication mechanism uses GSSAPI to share Kerberos credentials when Hive is [configured with Kerberos Auth](https://ambari.apache.org/1.2.5/installing-hadoop-using-ambari/content/ambari-kerb-2-3-3.html).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: hive
      host: [hostname]
      port: [port] # default value: 10000
      auth_type: [GSSAPI]
      kerberos_service_name: [kerberos service name] # default value: None
      use_http_transport: true # default value: true
      use_ssl: true # TLS should always be used to ensure secure transmission of credentials, default value: true
      schema: [schema name] 

```

</File>

Note: A typical setup of Cloudera Private Cloud will involve the following steps to setup Kerberos before one can execute dbt commands:
- Get the correct realm config file for your installation (krb5.conf)
- Set environment variable to point to the config file (export KRB5_CONFIG=/path/to/krb5.conf)
- Set correct permissions for config file (sudo chmod 644 /path/to/krb5.conf)
- Obtain keytab using kinit (kinit username@YOUR_REALM.YOUR_DOMAIN)
- The keytab is valid for certain period after which you will need to run kinit again to renew validity of the keytab.
- User will need CREATE, DROP, INSERT permissions on the schema provided in profiles.yml

### Instrumentation
By default, the adapter will collect instrumentation events to help improve functionality and understand bugs. If you want to specifically switch this off, for instance, in a production environment, you can explicitly set the flag `usage_tracking: false` in your `profiles.yml` file. 

## Installation and Distribution

dbt's adapter for Apache Hive is managed in its own repository, [dbt-hive](https://github.com/cloudera/dbt-hive). To use it, 
you must install the `dbt-hive` plugin.

### Using pip
The following commands will install the latest version of `dbt-hive` as well as the requisite version of `dbt-core` and `impyla` driver used for connections.

```
pip install dbt-hive
```

### Supported Functionality

| Name | Supported |
|------|-----------|
|Materialization: Table|Yes|
|Materialization: View|Yes|
|Materialization: Incremental - Append|Yes|
|Materialization: Incremental - Insert+Overwrite|Yes|
|Materialization: Incremental - Merge|No|
|Materialization: Ephemeral|No|
|Seeds|Yes|
|Tests|Yes|
|Snapshots|No|
|Documentation|Yes|
|Authentication: LDAP|Yes|
|Authentication: Kerberos|Yes|
