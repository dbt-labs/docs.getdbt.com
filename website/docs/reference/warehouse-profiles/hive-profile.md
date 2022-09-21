---
title: "Apache Hive Profile"
id: "hive-profile"
meta:
  maintained_by: Cloudera
  authors: 'Cloudera'
  github_repo: 'cloudera/dbt-impala'
  min_core_version: 'v1.1.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-hive'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0401DTNSKW'
---

## Overview of dbt-hive

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

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
      port: [port]
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
     http_path: [optional, http path to Hive]
     port: [port]
     auth_type: ldap
     use_http_transport: [true / false]
     use_ssl: [true / false] # TLS should always be used with LDAP to ensure secure transmission of credentials
     username: [username]
     password: [password]
     schema: [schema name]
```

</File>

Note: When creating workload user in CDP, make sure the user has CREATE, SELECT, ALTER, INSERT, UPDATE, DROP, INDEX, READ and WRITE permissions. If you need the user to execute GRANT statements, you should also configure the appropriate GRANT permissions for them. When using Apache Ranger, permissions for allowing GRANT are typically set using "Delegate Admin" option. For more information, see [`grants`](/reference/resource-configs/grants) and [on-run-start & on-run-end](/reference/project-configs/on-run-start-on-run-en).

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
|Authentication: Kerberos|No|
