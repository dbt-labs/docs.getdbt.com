---
title: "Oracle setup"
description: "Read this guide to learn about the Oracle warehouse setup in dbt."
id: "oracle-setup"
meta:
  maintained_by: Oracle
  authors: 'Oracle'
  github_repo: 'oracle/dbt-oracle'
  pypi_package: 'dbt-oracle'
  min_core_version: 'v1.2.1'
  cloud_support: Not Supported
  min_supported_version: 'Oracle 12c and higher'
  slack_channel_name: '#db-oracle'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01PWH4TXLY'
  platform_name: 'Oracle'
  config_page: '/reference/resource-configs/oracle-configs'
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

## Installation


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


### Configure the Python driver mode

:::info
[python-oracledb](https://oracle.github.io/python-oracledb/) is the renamed, major release of Oracle's popular cx_Oracle interface
:::

[python-oracledb](https://oracle.github.io/python-oracledb/) makes it optional to install the Oracle Client libraries.
This driver supports 2 modes

1. **Thin mode (preferred) ** : Python process directly connects to the Oracle database. This mode does not need the Oracle Client libraries
2. **Thick mode** : Python process links with the Oracle Client libraries. Some advanced Oracle database functionalities (for e.g. Advanced Queuing and Scrollable cursors) are currently available via Oracle Client libraries

You can configure the driver mode using the environment variable `ORA_PYTHON_DRIVER_TYPE`. Use the **thin** mode as it vastly simplifies installation.

| Driver Mode            | Oracle Client libraries required? | Configuration |
|------------------------|-----------------------------------| ------------- |
| Thin                   | No                                | `ORA_PYTHON_DRIVER_TYPE=thin`|
| Thick                  | Yes                               | `ORA_PYTHON_DRIVER_TYPE=thick` |
| cx_oracle (old driver) | Yes                               | `ORA_PYTHON_DRIVER_TYPE=cx` |

The default value of `ORA_PYTHON_DRIVER_TYPE` is `cx`

:::warning Deprecation Warning
Default value of `ORA_PYTHON_DRIVER_TYPE` will change to `thin` in future release of dbt-oracle because `cx_oracle` is deprecated
:::

<Tabs
defaultValue="thin"
  values={[
    { label: 'Thin', value: 'thin'},
    { label: 'Thick', value: 'thick_or_cx'}]
}>

<TabItem value="thin">

  ```bash
  export ORA_PYTHON_DRIVER_TYPE=thin
  ```

</TabItem>

<TabItem value="thick_or_cx">

  ```bash
  export ORA_PYTHON_DRIVER_TYPE=thick
  # or
  export ORA_PYTHON_DRIVER_TYPE=cx # default
  ```

### Install Oracle Instant Client libraries

In thick mode or the old cx_oracle mode, you will need the [Oracle Instant Client libraries](https://www.oracle.com/database/technologies/instant-client.html) installed. These provide the necessary network connectivity allowing dbt-oracle to access an Oracle Database instance.

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
</TabItem>
</Tabs>

## Configure wallet for Oracle Autonomous Database (ADB-S) in Cloud

dbt can connect to Oracle Autonomous Database (ADB-S) in Oracle Cloud using either TLS (Transport Layer Security) or mutual TLS (mTLS). TLS and mTLS provide enhanced security for authentication and encryption.
A database username and password is still required for dbt connections which can be configured as explained in the next section [Connecting to Oracle Database](#connecting-to-oracle-database).

<Tabs
  defaultValue="tls"
  values={[
    { label: 'TLS', value: 'tls'},
    { label: 'Mutual TLS', value: 'm-tls'}]
}>

<TabItem value="tls">

With TLS, dbt can connect to Oracle ADB without using a wallet. Both Thin and Thick modes of the python-oracledb driver support TLS.

:::info
In Thick mode, dbt can connect through TLS only when using Oracle Client library versions 19.14 (or later) or 21.5 (or later).
:::

Refer to Oracle documentation to [connect to an ADB instance using TLS authentication](https://docs.oracle.com/en/cloud/paas/autonomous-database/adbsa/connecting-nodejs-tls.html#GUID-B3809B88-D2FB-4E08-8F9B-65A550F93A07) and the blog post [Easy wallet-less connections to Oracle Autonomous Databases in Python](https://blogs.oracle.com/opal/post/easy-way-to-connect-python-applications-to-oracle-autonomous-databases) to enable TLS for your Oracle ADB instance.
</TabItem>

<TabItem value="m-tls">

For mutual TLS connections, a wallet needs be downloaded from the OCI console and the python driver needs to be configured to use it.

#### Install the Wallet and Network Configuration Files

From the Oracle Cloud console for the database, download the wallet zip file using the `DB Connection` button. The zip contains the wallet and network configuration files.

:::warning Note
Keep wallet files in a secure location and share them only with authorized users.
:::

Unzip the wallet zip file.

<Tabs
defaultValue="thin"
  values={[
    { label: 'Thin', value: 'thin'},
    { label: 'Thick', value: 'thick_or_cx'}]
}>

<TabItem value="thin">
In Thin mode, only two files from the zip are needed:

- `tnsnames.ora` - Maps net service names used for application connection strings to your database services

- `ewallet.pem` - Enables SSL/TLS connections in Thin mode. Keep this file secure

After unzipping the files in a secure directory, set the **TNS_ADMIN** and **WALLET_LOCATION** environment variables to the directory name.

```bash
export WALLET_LOCATION=/path/to/directory_containing_ewallet.pem
export WALLET_PASSWORD=***
export TNS_ADMIN=/path/to/directory_containing_tnsnames.ora
```
Optionally, if `ewallet.pem` file is encrypted using a wallet password, specify the password using environment variable **WALLET_PASSWORD**

</TabItem>

<TabItem value="thick_or_cx">
In Thick mode, the following files from the zip are needed:

- `tnsnames.ora` - Maps net service names used for application connection strings to your database services
- `sqlnet.ora` - Configures Oracle Network settings
- `cwallet.sso` - Enables SSL/TLS connections

After unzipping the files in a secure directory, set the **TNS_ADMIN** environment variable to that directory name.

```bash
export TNS_ADMIN=/path/to/directory_containing_tnsnames.ora
```

Next, edit the `sqlnet.ora` file to point to the wallet directory.

<File name='sqlnet.ora'>

```text
WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="/path/to/wallet/directory")))
SSL_SERVER_DN_MATCH=yes
```

</File>

</TabItem>
</Tabs>

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
export DBT_ORACLE_DATABASE=example_db2022adb
```

If database name is not set, adapter will retrieve it using the following query.

```sql
SELECT SYS_CONTEXT('userenv', 'DB_NAME') FROM DUAL
```

An Oracle connection profile for dbt can be set using any one of the following methods

<Tabs
  defaultValue="tns_net_service_name"
  values={[
    { label: 'Using TNS alias', value: 'tns_net_service_name'},
    { label: 'Using Connect string', value:'connect_string'},
    { label: 'Using Database hostname', value: 'database_hostname'}]
}>

<TabItem value="tns_net_service_name">

The `tnsnames.ora` file is a configuration file that contains network service names mapped to connect descriptors.
The directory location of `tnsnames.ora` file can be specified using `TNS_ADMIN` environment variable

<File name="tnsnames.ora">

```text
db2022adb_high = (description =
                 (retry_count=20)(retry_delay=3)
                 (address=(protocol=tcps)
                 (port=1522)
                 (host=adb.example.oraclecloud.com))
                 (connect_data=(service_name=example_high.adb.oraclecloud.com))
                 (security=(ssl_server_cert_dn="CN=adb.example.oraclecloud.com,
                 OU=Oracle BMCS US,O=Oracle Corporation,L=Redwood City,ST=California,C=US")))
```

</File>

The TNS alias `db2022adb_high` can be defined as environment variable and referred in `profiles.yml`

```bash
export DBT_ORACLE_TNS_NAME=db2022adb_high
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
export DBT_ORACLE_CONNECT_STRING="(description=(retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)
                                  (host=adb.example.oraclecloud.com))(connect_data=(service_name=example_high.adb.oraclecloud.com))
                                  (security=(ssl_server_cert_dn=\"CN=adb.example.oraclecloud.com,
                                  OU=Oracle BMCS US,O=Oracle Corporation,L=Redwood City,ST=California,C=US\")))"
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

<TabItem value="database_hostname">

To connect using the database hostname or IP address, you need to specify the following
- host
- port (1521 or 1522)
- protocol (tcp or tcps)
- service

```bash
export DBT_ORACLE_HOST=adb.example.oraclecloud.com
export DBT_ORACLE_SERVICE=example_high.adb.oraclecloud.com
```

<VersionBlock firstVersion="1.2">
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
         retry_count: 1
         retry_delay: 3
         threads: 4
```
</File>
</VersionBlock>

<VersionBlock lastVersion="1.1">
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
</VersionBlock>
</TabItem>


</Tabs>

<VersionBlock firstVersion="1.5.1">

## Python Models using Oracle Autonomous Database (ADB-S)

Oracle's Autonomous Database Serverless (ADB-S) users can run dbt-py models using Oracle Machine Learning (OML4PY) which is available without any extra setup required.

### Features
- User Defined Python function is run in an ADB-S spawned Python 3.10 runtime
- Import [3rd party Python packages](https://docs.oracle.com/en/database/oracle/machine-learning/oml-notebooks/omlug/oml4py-notebook.html#GUID-78225241-CD6B-4588-AD4B-799079FA1784) installed in the default Python runtime
- Access to Database session in the Python function
- DataFrame read API to read `TABLES`, `VIEWS` and ad-hoc `SELECT` queries as DataFrames
- DataFrame write API to write DataFrames as `TABLES`
- Supports both table and incremental materialization
- Integration with conda (Coming Soon)

### Setup

#### Required roles

- User must be non-ADMIN to execute the Python function
- User must be granted the `OML_DEVELOPER` role

#### OML Cloud Service URL

OML Cloud Service URL is of the following format
```text
https://tenant1-dbt.adb.us-sanjose-1.oraclecloudapps.com
```
In this example, 
  - `tenant1` is the tenancy ID 
  - `dbt` is the database name 
  - `us-sanjose-1` is the datacenter region 
  - `oraclecloudapps.com` is the root domain

Add `oml_cloud_service_url` to your existing `~/.dbt/profiles.yml`

<File name='~/.dbt/profiles.yml'>

```yaml
dbt_test:
   target: dev
   outputs:
      dev:
         type: oracle
         user: "{{ env_var('DBT_ORACLE_USER') }}"
         pass: "{{ env_var('DBT_ORACLE_PASSWORD') }}"
         tns_name: "{{ env_var('DBT_ORACLE_TNS_NAME') }}"
         schema: "{{ env_var('DBT_ORACLE_SCHEMA') }}"
         oml_cloud_service_url: "https://tenant1-dbt.adb.us-sanjose-1.oraclecloudapps.com"
```
</File>

### Python model configurations

| Configuration | Datatype | Examples                                                                                      |
|--|--------|-----------------------------------------------------------------------------------------------|
| Materialization | String | `dbt.config(materialized="incremental")` or `dbt.config(materialized="table")`                |
| Service | String | `dbt.config(service="HIGH")` or `dbt.config(service="MEDIUM")` or `dbt.config(service="LOW")` |
| Async Mode | Boolean    | `dbt.config(async_flag=True)`  
| Timeout in seconds only to be used with **_async_** mode (`min: 1800` and `max: 43200`) | Integer    | `dbt.config(timeout=1800)`  |

In async mode, dbt-oracle will schedule a Python job, poll the job's status and wait for it to complete.
Without async mode, dbt-oracle will immediately invoke the Python job in a blocking manner. Use async mode for long-running Python jobs.

### Python model examples

#### Refer other model

Use `dbt.ref(model_name)` to refer either SQL or Python model

```python
def model(dbt, session):
    # Must be either table or incremental (view is not currently supported)
    dbt.config(materialized="table")
    # returns oml.core.DataFrame referring a dbt model
    s_df = dbt.ref("sales_cost")
    return s_df
```

#### Refer a source

Use `dbt.source(source_schema, table_name)`

```python
def model(dbt, session):
    # Must be either table or incremental (view is not currently supported)
    dbt.config(materialized="table")
    # oml.core.DataFrame representing a datasource
    s_df = dbt.source("sh_database", "channels")
    return s_df

```

#### Incremental materialization

```python
def model(dbt, session):
    # Must be either table or incremental
    dbt.config(materialized="incremental")
    # oml.DataFrame representing a datasource
    sales_cost_df = dbt.ref("sales_cost")

    if dbt.is_incremental:
        cr = session.cursor()
        result = cr.execute(f"select max(cost_timestamp) from {dbt.this.identifier}")
        max_timestamp = result.fetchone()[0]
        # filter new rows
        sales_cost_df = sales_cost_df[sales_cost_df["COST_TIMESTAMP"] > max_timestamp]

    return sales_cost_df
```

#### Concatenate a new column in Dataframe

```python

def model(dbt, session):
    dbt.config(materialized="table")
    dbt.config(async_flag=True)
    dbt.config(timeout=1800)

    sql = f"""SELECT customer.cust_first_name,
       customer.cust_last_name,
       customer.cust_gender,
       customer.cust_marital_status,
       customer.cust_street_address,
       customer.cust_email,
       customer.cust_credit_limit,
       customer.cust_income_level
    FROM sh.customers customer, sh.countries country
    WHERE country.country_iso_code = ''US''
    AND customer.country_id = country.country_id"""

    # session.sync(query) will run the sql query and returns a oml.core.DataFrame
    us_potential_customers = session.sync(query=sql)

    # Compute an ad-hoc anomaly score on the credit limit
    median_credit_limit = us_potential_customers["CUST_CREDIT_LIMIT"].median()
    mean_credit_limit = us_potential_customers["CUST_CREDIT_LIMIT"].mean()
    anomaly_score = (us_potential_customers["CUST_CREDIT_LIMIT"] - median_credit_limit)/(median_credit_limit - mean_credit_limit)

    # Add a new column "CUST_CREDIT_ANOMALY_SCORE"
    us_potential_customers = us_potential_customers.concat({"CUST_CREDIT_ANOMALY_SCORE": anomaly_score.round(3)})

    # Return potential customers dataset as a oml.core.DataFrame
    return us_potential_customers

```

</VersionBlock>


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
- Python Models (from dbt-oracle version 1.5.1)
- All dbt commands are supported

## Not Supported features
- Ephemeral materialization
