---
title: "Apache Impala Profile"
id: "impala-profile"
---

## Overview of dbt-impala

**Maintained by:** Cloudera    
**Author:** Cloudera    
**Source:** [Github](https://github.com/cloudera/dbt-impala)    
**dbt Cloud:** Currently un-supported    
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/C03K2PTHHTP)     


![dbt-impala stars](https://img.shields.io/github/stars/cloudera/dbt-impala?style=for-the-badge)

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
      host: localhost
      port: 21050
      dbname: [db name]  # this should be same as schema name provided below
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
     port: [port]
     auth_type: ldap
     use_http_transport: [true / false]
     use_ssl: [true / false] # TLS should always be used with LDAP to ensure secure transmission of credentials
     username: [username]
     password: [password]
     dbname: [db name]  # this should be same as schema name provided below, starting with 1.1.2 this parameter is optional
     schema: [schema name]
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
      port: [port]
      auth_type: [GSSAPI]
      kerberos_service_name: [kerberos service name]
      use_http_transport: true
      use_ssl: true # TLS should always be used with LDAP to ensure secure transmission of credentials
      dbname: [db name]  # this should be same as schema name provided below, starting with 1.1.2 this parameter is optional
      schema: [schema name]

```

</File>

Note: A typical setup of Cloudera EDH will involve the following steps to setup Kerberos before one can execute dbt commands:
- Get the correct realm config file for your installation (krb5.conf)
- Set environment variable to point to the config file (export KRB5_CONFIG=/path/to/krb5.conf)
- Set correct permissions for config file (sudo chmod 644 /path/to/krb5.conf)
- Obtain keytab using kinit (kinit username@YOUR_REALM.YOUR_DOMAIN)
- The keytab is valid for certain period after which you will need to run kinit again to renew validity of the keytab.

## Installation and Distribution

dbt's adapter for Apache Impala is managed in its own repository, [dbt-impala](https://github.com/cloudera/dbt-impala). To use it, 
you must install the `dbt-impala` plugin.

### Using pip
The following commands will install the latest version of `dbt-impala` as well as the requisite version of `dbt-core` and `impyla` driver used for connections.

```
pip install dbt-impala
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
|Snapshots|Yes|
|Documentation|Yes|
|Authentication: LDAP|Yes|
|Authentication: Kerberos|Yes|
