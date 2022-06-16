---
title: "Oracle Profile"
---

## Overview of dbt-oracle

**Maintained by:** Oracle    
**Source:** [Github](https://github.com/oracle/dbt-oracle)    
**Core version:** v1.0.6     
**dbt Cloud:** Not Supported    
**dbt Slack channel** [#db-oracle](https://getdbt.slack.com/archives/C01PWH4TXLY)       

![dbt-oracle stars](https://img.shields.io/github/stars/oracle/dbt-oracle?style=for-the-badge)

## Installation

dbt-oracle can be installed via the Python Package Index (PyPI) using pip

    pip install dbt-oracle

You will need Oracle client driver installed. Check this [link](https://cx-oracle.readthedocs.io/en/latest/user_guide/installation.html) for the installation guide for your operating system

## Connecting to Oracle Database

Define the following mandatory parameters as environment variables and refer them in the connection profile using [env_var](https://docs.getdbt.com/reference/dbt-jinja-functions/env_var) jinja function. Optionally, you can also define these directly in the `profiles.yml` file, but this is not recommended

```bash
export DBT_ORACLE_USER=<username>
export DBT_ORACLE_PASSWORD=***
export DBT_ORACLE_DATABASE=ga01d78d2ecd5f1_db202112221108
export DBT_ORACLE_SCHEMA=<username>
```


An Oracle connection profile for dbt can be set using any one of the following methods

<Tabs
  defaultValue="database_hostname"
  values={[
    { label: 'Using Database hostname', value: 'database_hostname'},
    { label: 'Using TNS net service name', value: 'tns_net_service_name'},
    { label: 'Using Connect string', value:'connect_string'}]
}>

<TabItem value="database_hostname">

To connect using the database hostname or IP address, you need to specify the following
- host
- port (1521 or 1522)
- protocol (tcp or tcps)
- service

```bash
export DBT_ORACLE_HOST=adb.us-ashburn-1.oraclecloud.com
export DBT_ORACLE_SERVICE=ga01d78d2ecd5f1_db202112221108_high.adb.oraclecloud.com
```

<File name='~/.dbt/profiles.yml'>

```yaml
dbt_test:
   target: "{{ env_var('DBT_TARGET', 'dev') }}"
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         protocol: "tcps"
         host: "{{ env_var('DBT_ORACLE_HOST') }}"
         port: 1522
         service: "{{ env_var('DBT_ORACLE_SERVICE') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         threads: 4
```
</File>
</TabItem>

<TabItem value="tns_net_service_name">

The `tnsnames.ora` file is a configuration file that contains network service names mapped to connect descriptors.
The directory location of `tnsnames.ora` file can be specified using `TNS_ADMIN` environment variable

<File name="tnsnames.ora">

```text
net_service_name= 
 (DESCRIPTION=
    (ADDRESS=(PROTOCOL=TCP)(HOST=dbhost.example.com)(PORT=1521))
    (CONNECT_DATA=(SERVICE_NAME=orclpdb1)))
```

</File>

The `net_service_name` can be defined as environment variable and referred in `profiles.yml`

```bash
export DBT_ORACLE_TNS_NAME=net_service_name
```

<File name='~/.dbt/profiles.yml'>

```yaml
dbt_test:
   target: dev
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         tns_name: "{{ env_var('DBT_ORACLE_TNS_NAME') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         threads: 4
```
</File>
</TabItem>

<TabItem value="connect_string">

The connection string identifies which database service to connect to. It can be one of the following

- An [Oracle Easy Connect String](https://docs.oracle.com/en/database/oracle/oracle-database/21/netag/configuring-naming-methods.html#GUID-B0437826-43C1-49EC-A94D-B650B6A4A6EE)
- An Oracle Net Connect Descriptor String
- A Net Service Name mapping to a connect descriptor

```bash
export DBT_ORACLE_CONNECT_STRING="(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=dbhost.example.com)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=orclpdb1)))"
```

<File name='~/.dbt/profiles.yml'>

```yaml
dbt_test:
   target: "{{ env_var('DBT_TARGET', 'dev') }}"
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         connection_string: "{{ env_var('DBT_ORACLE_CONNECT_STRING') }}"
```

</File>
</TabItem>

</Tabs>

## Connecting to Oracle Autonomous Database in Cloud

To enable connection to Oracle Autonomous Database in Oracle Cloud, a wallet needs be downloaded from the cloud, and cx_Oracle needs to be configured to use it. The wallet gives mutual TLS which provides enhanced security for authentication and encryption. A database username and password is still required for your application connections.

### Install the Wallet and Network Configuration Files

From the Oracle Cloud console for the database, download the wallet zip file. It contains the wallet and network configuration files. Note: keep wallet files in a secure location and share them only with authorized users.

Unzip the wallet zip file. For cx_Oracle, only these files from the zip are needed:

- `tnsnames.ora` - Maps net service names used for application connection strings to your database services
- `sqlnet.ora` - Configures Oracle Network settings
- `cwallet.sso` - Enables SSL/TLS connections

After downloading the wallet, put the unzipped wallet files in a secure directory and set the TNS_ADMIN environment variable to that directory name. Next, edit the sqlnet.ora file to point to the wallet directory.

<File name='sqlnet.ora'>

```text
WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="/path/to/wallet/directory")))
SSL_SERVER_DN_MATCH=yes
```

</File>

:::info TLS v/s mTLS

If you have enabled TLS connections on your Database instance then dbt can connect using only database username, password and the Oracle Net connect name given in the unzipped tnsnames.ora file.

:::


## Supported Features

- Table materialization
- View materialization
- Incremental materialization
- Seeds
- Data sources
- Singular tests
- Generic tests; Not null, Unique, Accepted values and Relationships
- Operations
- Analyses
- Exposures
- Document generation
- Serve project documentation as a website
- All dbt commands are supported

## Not Supported features
- Ephemeral materialization

