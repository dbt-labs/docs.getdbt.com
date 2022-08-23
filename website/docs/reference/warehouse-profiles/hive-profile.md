---
title: "Apache Hive Profile"
id: "hive-profile"
---

## Overview of dbt-hive

**Maintained by:** Cloudera    
**Author:** Cloudera    
**Source:** [Github](https://github.com/cloudera/dbt-hive)    
**dbt Cloud:** Currently un-supported    
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/)     


![dbt-hive stars](https://img.shields.io/github/stars/cloudera/dbt-hive?style=for-the-badge)

## Connection Methods

dbt-hive can connect to Apache Hive and Cloudera Data Platform clusters.

The [Impyla](https://github.com/cloudera/impyla/) library is used to establish connections to Hive.

Two transport mechanisms are supported:
- binary
- HTTP(S)

The default mechanism is `binary`. To use HTTP transport, use the boolean option `use_http_transport: [true / false]`.

## Authentication Methods

dbt-hive supports three authentication mechanisms:
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

Note: When creating workload user in CDP ensure that the user has CREATE, SELECT, ALTER, INSERT, UPDATE, DROP, INDEX, READ and WRITE permissions. If the user is required to execute GRANT statements, see for instance (https://docs.getdbt.com/reference/resource-configs/grants) or (https://docs.getdbt.com/reference/project-configs/on-run-start-on-run-end) appropriate GRANT permissions should be configured. When using Apache Ranger, permissions for allowing GRANT are typically set using "Delegate Admin" option. 

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
