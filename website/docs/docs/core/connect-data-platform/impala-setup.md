---
title: "Apache Impala setup"
description: "Read this guide to learn about the Apache Impala warehouse setup in dbt."
id: "impala-setup"
meta:
  maintained_by: Cloudera
  authors: 'Cloudera'
  github_repo: 'cloudera/dbt-impala'
  pypi_package: 'dbt-impala'
  min_core_version: 'v1.1.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-impala'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01PWAH41A5'
  platform_name: 'Impala'
  config_page: '/reference/resource-configs/impala-configs'
---

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

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


## Connection Methods

dbt-impala can connect to Apache Impala and Cloudera Data Platform clusters.

The [Impyla](https://github.com/cloudera/impyla/) library is used to establish connections to Impala.

Two transport mechanisms are supported:
- binary
- HTTP(S)

The default mechanism is `binary`. To use HTTP transport, use the boolean option `use_http_transport: [true / false]`.

## Authentication Methods

dbt-impala supports three authentication mechanisms:
- [`insecure`](#Insecure) No authentication is used, only recommended for testing.
- [`ldap`](#ldap) Authentication via LDAP
- [`kerbros`](#kerbros) Authentication via Kerberos (GSSAPI)

### Insecure

This method is only recommended if you have a local install of Impala and want to test out the dbt-impala adapter. 

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: impala
      host: [host] # default value: localhost
      port: [port] # default value: 21050
      dbname: [db name]  # this should be same as schema name provided below, starting with 1.1.2 this parameter is optional
      schema: [schema name]
      
```

</File>

### LDAP

LDAP allows you to authenticate with a username & password when Impala is [configured with LDAP Auth](https://impala.apache.org/docs/build/html/topics/impala_ldap.html). LDAP is supported over Binary & HTTP connection mechanisms.

This is the recommended authentication mechanism to use with Cloudera Data Platform (CDP).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
     type: impala
     host: [host name]
     http_path: [optional, http path to Impala]
     port: [port] # default value: 21050
     auth_type: ldap
     use_http_transport: [true / false] # default value: true
     use_ssl: [true / false] # TLS should always be used with LDAP to ensure secure transmission of credentials, default value: true
     username: [username]
     password: [password]
     dbname: [db name]  # this should be same as schema name provided below, starting with 1.1.2 this parameter is optional
     schema: [schema name]
     retries: [retries] # number of times impyla attempts retry conneciton to warehouse, default value: 3
  
```

</File>

Note: When creating workload user in CDP ensure that the user has CREATE, SELECT, ALTER, INSERT, UPDATE, DROP, INDEX, READ and WRITE permissions. If the user is required to execute GRANT statements, see for instance (https://docs.getdbt.com/reference/resource-configs/grants) or (https://docs.getdbt.com/reference/project-configs/on-run-start-on-run-end) appropriate GRANT permissions should be configured. When using Apache Ranger, permissions for allowing GRANT are typically set using "Delegate Admin" option. 

### Kerberos

The Kerberos authentication mechanism uses GSSAPI to share Kerberos credentials when Impala is [configured with Kerberos Auth](https://impala.apache.org/docs/build/html/topics/impala_kerberos.html).

<File name='~/.dbt/profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: impala
      host: [hostname]
      port: [port] # default value: 21050
      auth_type: [GSSAPI]
      kerberos_service_name: [kerberos service name] # default value: None
      use_http_transport: true # default value: true
      use_ssl: true # TLS should always be used with LDAP to ensure secure transmission of credentials, default value: true
      dbname: [db name]  # this should be same as schema name provided below, starting with 1.1.2 this parameter is optional
      schema: [schema name]
      retries: [retries] # number of times impyla attempts retry conneciton to warehouse, default value: 3
  
```

</File>

Note: A typical setup of Cloudera EDH will involve the following steps to setup Kerberos before one can execute dbt commands:
- Get the correct realm config file for your installation (krb5.conf)
- Set environment variable to point to the config file (export KRB5_CONFIG=/path/to/krb5.conf)
- Set correct permissions for config file (sudo chmod 644 /path/to/krb5.conf)
- Obtain keytab using kinit (kinit username@YOUR_REALM.YOUR_DOMAIN)
- The keytab is valid for certain period after which you will need to run kinit again to renew validity of the keytab.

### Instrumentation

By default, the adapter will send instrumentation events to Cloudera to help improve functionality and understand bugs. If you want to specifically switch this off, for instance, in a production environment, you can explicitly set the flag `usage_tracking: false` in your `profiles.yml` file.

Relatedly, if you'd like to turn off dbt Lab's anonymous usage tracking, see [YAML Configurations: Send anonymous usage stats](https://docs.getdbt.com/reference/global-configs#send-anonymous-usage-stats) for more info

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
|Snapshots|Yes|
|Documentation|Yes|
|Authentication: LDAP|Yes|
|Authentication: Kerberos|Yes|
