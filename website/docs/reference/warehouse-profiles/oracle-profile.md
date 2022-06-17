---
title: "Oracle Profile"
---

## Overview of dbt-oracle

**Maintained by:** Oracle    
**Source:** [Github](https://github.com/oracle/dbt-oracle)    
**Core version:** v1.0.7     
**dbt Cloud:** Not Supported    
**dbt Slack channel** [#db-oracle](https://getdbt.slack.com/archives/C01PWH4TXLY)       

![dbt-oracle stars](https://img.shields.io/github/stars/oracle/dbt-oracle?style=for-the-badge)

## Installation

dbt-oracle can be installed via the Python Package Index (PyPI) using pip

    pip install dbt-oracle

### Install Oracle Instant Client libraries

To use dbt-oracle, you will need the [Oracle Instant Client libraries](https://www.oracle.com/database/technologies/instant-client.html) installed. These provide the necessary network connectivity allowing dbt-oracle to access an Oracle Database instance.

Oracle client libraries versions 21, 19, 18, 12, and 11.2 are supported where available on Linux, Windows and macOS (Intel x86). It is recommended to use the latest client possible: Oracle’s standard client-server version interoperability allows connection to both older and newer databases.

<Tabs
  defaultValue="linux"
  values={[
    { label: 'Linux', value: 'linux'},
    { label: 'Windows', value: 'windows'},
    { label: 'MacOS', value:'macos'}]
}>

<TabItem value="linux">

1. Download an Oracle 21, 19, 18, 12, or 11.2 “Basic” or “Basic Light” zip file matching your Python 64-bit or 32-bit architecture:
   1. [x86-64 64-bit](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html)
   2. [x86 32-bit](https://www.oracle.com/database/technologies/instant-client/linux-x86-32-downloads.html)
   3. [ARM (aarch64) 64-bit](https://www.oracle.com/database/technologies/instant-client/linux-arm-aarch64-downloads.html)

2. Unzip the package into a single directory that is accessible to your application. For example:
  ```bash
  mkdir -p /opt/oracle
  cd /opt/oracle
  unzip instantclient-basic-linux.x64-21.1.0.0.0.zip
  ```

3. Install the libaio package with sudo or as the root user. For example:
  ```bash
  sudo yum install libaio
  ```
  On some Linux distributions this package is called `libaio1` instead.



4. if there is no other Oracle software on the machine that will be impacted, permanently add Instant Client to the runtime link path. For example, with sudo or as the root user:
 
 ```bash
  sudo sh -c "echo /opt/oracle/instantclient_21_1 > /etc/ld.so.conf.d/oracle-instantclient.conf"
  sudo ldconfig
 ```

  Alternatively, set the environment variable `LD_LIBRARY_PATH`

  ```bash
  export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_1:$LD_LIBRARY_PATH
  ```

</TabItem>

<TabItem value="windows">

1. Download an Oracle 21, 19, 18, 12, or 11.2 “Basic” or “Basic Light” zip file: [64-bit](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html) or [32-bit](https://www.oracle.com/database/technologies/instant-client/microsoft-windows-32-downloads.html), matching your Python architecture.

:::info Windows 7 users
Note that Oracle Client versions 21c and 19c are not supported on Windows 7.
::: 

2. Unzip the package into a directory that is accessible to your application. For example unzip `instantclient-basic-windows.x64-19.11.0.0.0dbru.zip` to `C:\oracle\instantclient_19_11`.

3. Oracle Instant Client libraries require a Visual Studio redistributable with a 64-bit or 32-bit architecture to match Instant Client’s architecture.
   1. For Instant Client 21 install [VS 2019](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170) or later
   2. For Instant Client 19 install [VS 2017](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170)
   3. For Instant Client 18 or 12.2 install [VS 2013](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2013-vc-120)
   4. For Instant Client 12.1 install [VS 2010](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2010-vc-100-sp1-no-longer-supported)
   5. For Instant Client 11.2 install [VS 2005 64-bit](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2005-vc-80-sp1-no-longer-supported)

4. Add the Oracle Instant Client directory to the `PATH` environment variable.The directory must occur in `PATH` before any other Oracle directories. Restart any open command prompt windows.
   
   ```bash
   SET PATH=C:\oracle\instantclient_19_9;%PATH%
   ```

</TabItem>

<TabItem value="macos">

1. Download the instant client DMG package 
  
  ```bash
  cd $HOME/Downloads
  curl -O https://download.oracle.com/otn_software/mac/instantclient/198000/instantclient-basic-macos.x64-19.8.0.0.0dbru.dmg
  ```

2. Mount the instant client DMG package
   
   ```bash
   hdiutil mount instantclient-basic-macos.x64-19.8.0.0.0dbru.dmg

   ```

3. Run the install script in the mounted package
  
  ```bash
  /Volumes/instantclient-basic-macos.x64-19.8.0.0.0dbru/install_ic.sh
  ```

4. Unmount the package
   
   ```bash
   hdiutil unmount /Volumes/instantclient-basic-macos.x64-19.8.0.0.0dbru
   ```
   
5. The Instant Client directory will be `$HOME/Downloads/instantclient_19_8`. You could move it to some place convenient.

6. Add links to `~/lib` or `/usr/local/lib` to enable dbt to find the libraries.
   
   ```bash
   mkdir ~/lib
   ln -s ~/instantclient_19_8/libclntsh.dylib ~/lib/
   ```

</TabItem>


</Tabs>

## Connecting to Oracle Database

Define the following mandatory parameters as environment variables and refer them in the connection profile using [env_var](https://docs.getdbt.com/reference/dbt-jinja-functions/env_var) jinja function. Optionally, you can also define these directly in the `profiles.yml` file, but this is not recommended

```bash
export DBT_ORACLE_USER=<username>
export DBT_ORACLE_PASSWORD=***
export DBT_ORACLE_SCHEMA=<username>
```

Starting with `dbt-oracle==1.0.2`, it is **optional** to set the database name

```bash
export DBT_ORACLE_DATABASE=ga01d78d2ecd5f1_db202112221108
```

If database name is not set, adapter will retrieve it using the following query. 

```sql
SELECT SYS_CONTEXT('userenv', 'DB_NAME') FROM DUAL
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

