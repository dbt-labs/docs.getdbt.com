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

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Configure the Python driver mode

[python-oracledb](https://oracle.github.io/python-oracledb/) makes it optional to install the Oracle Client libraries.
This driver supports 2 modes

1. **Thin mode (preferred)**: Python process directly connects to the Oracle database. This mode does not need the Oracle Client libraries
2. **Thick mode**: Python process links with the Oracle Client libraries. Some advanced Oracle database functionalities (for example: Advanced Queuing, LDAP connections, Scrollable cursors) are currently available via Oracle Client libraries

You can configure the driver mode using the environment variable `ORA_PYTHON_DRIVER_TYPE`. Use the **thin** mode as it vastly simplifies installation.

| Driver Mode            | Oracle Client libraries required? | Configuration |
|------------------------|-----------------------------------| ------------- |
| Thin                   | No                                | `ORA_PYTHON_DRIVER_TYPE=thin`|
| Thick                  | Yes                               | `ORA_PYTHON_DRIVER_TYPE=thick` |

The default value of `ORA_PYTHON_DRIVER_TYPE` is `thin`


<Tabs
defaultValue="thin"
  values={[
    { label: 'Thin', value: 'thin'},
    { label: 'Thick', value: 'thick'}]
}>

<TabItem value="thin">

  ```bash
  export ORA_PYTHON_DRIVER_TYPE=thin # default
  ```

</TabItem>

<TabItem value="thick">

  ```bash
  export ORA_PYTHON_DRIVER_TYPE=thick
  ```

### Install Oracle Instant Client libraries

In thick mode, you will need the [Oracle Instant Client libraries](https://www.oracle.com/database/technologies/instant-client.html) installed. These provide the necessary network connectivity allowing dbt-oracle to access an Oracle Database instance.

Oracle Client versions 23, 21, 19, 18, 12 and 11.2 are supported. It is recommended to use the latest client possible: Oracle’s standard client-server version interoperability allows connection to both older and newer databases.

<Tabs
  defaultValue="linux"
  values={[
    { label: 'Linux', value: 'linux'},
    { label: 'Windows', value: 'windows'},
    { label: 'MacOS', value:'macos'}]
}>

<TabItem value="linux">

1. Download an Oracle 23, 21, 19, 18, 12, or 11.2 “Basic” or “Basic Light” zip file matching your Python 64-bit or 32-bit architecture:
   1. [x86-64 64-bit](https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html)
   2. [x86 32-bit](https://www.oracle.com/database/technologies/instant-client/linux-x86-32-downloads.html)
   3. [ARM (aarch64) 64-bit](https://www.oracle.com/database/technologies/instant-client/linux-arm-aarch64-downloads.html)

2. Unzip the package into a single directory that is accessible to your application. For example:
  ```bash
  mkdir -p /opt/oracle
  cd /opt/oracle
  unzip instantclient-basic-linux.x64-21.6.0.0.0.zip
  ```

3. Install the libaio package with sudo or as the root user. For example:
  ```bash
  sudo yum install libaio
  ```
  On some Linux distributions this package is called `libaio1` instead.



4. If there is no other Oracle software on the machine that will be impacted, permanently add Instant Client to the runtime link path. For example, with sudo or as the root user:

 ```bash
sudo sh -c "echo /opt/oracle/instantclient_21_6 > /etc/ld.so.conf.d/oracle-instantclient.conf"
sudo ldconfig
 ```

  Alternatively, set the environment variable `LD_LIBRARY_PATH`

  ```bash
  export LD_LIBRARY_PATH=/opt/oracle/instantclient_21_6:$LD_LIBRARY_PATH
  ```

5. If you use optional Oracle configuration files such as tnsnames.ora, sqlnet.ora, or oraaccess.xml with Instant Client, then put the files in an accessible directory and set the environment variable TNS_ADMIN to that directory name.

  ```bash
  export TNS_ADMIN=/opt/oracle/your_config_dir
  ```

</TabItem>

<TabItem value="windows">

1. Download an Oracle 21, 19, 18, 12, or 11.2 “Basic” or “Basic Light” zip file: [64-bit](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html) or [32-bit](https://www.oracle.com/database/technologies/instant-client/microsoft-windows-32-downloads.html), matching your Python architecture.

:::info Windows 7 users
Note that Oracle Client versions 21c and 19c are not supported on Windows 7.
:::

2. Unzip the package into a directory that is accessible to your application. For example, unzip `instantclient-basic-windows.x64-19.11.0.0.0dbru.zip` to `C:\oracle\instantclient_19_11`.

3. Oracle Instant Client libraries require a Visual Studio redistributable with a 64-bit or 32-bit architecture to match Instant Client’s architecture.
   1. For Instant Client 21 install [VS 2019](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170) or later
   2. For Instant Client 19 install [VS 2017](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170)
   3. For Instant Client 18 or 12.2 install [VS 2013](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2013-vc-120)
   4. For Instant Client 12.1 install [VS 2010](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2010-vc-100-sp1-no-longer-supported)
   5. For Instant Client 11.2 install [VS 2005 64-bit](https://docs.microsoft.com/en-US/cpp/windows/latest-supported-vc-redist?view=msvc-170#visual-studio-2005-vc-80-sp1-no-longer-supported)

4. Add the Oracle Instant Client directory to the `PATH` environment variable. The directory must occur in `PATH` before any other Oracle directories. Restart any open command prompt windows.

   ```bash
   SET PATH=C:\oracle\instantclient_19_9;%PATH%
   ```

</TabItem>

<TabItem value="macos">

Check the python-oracledb documentation for installation instructions on [MacOS ARM64](https://python-oracledb.readthedocs.io/en/latest/user_guide/installation.html#instant-client-scripted-installation-on-macos-arm64) or [MacOS Intel x84-64](https://python-oracledb.readthedocs.io/en/latest/user_guide/installation.html#instant-client-scripted-installation-on-macos-intel-x86-64)


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

For mutual TLS connections, a wallet needs to be downloaded from the OCI console and the Python driver needs to be configured to use it.

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
    { label: 'Thick', value: 'thick'}]
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

<TabItem value="thick">
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
export DBT_ORACLE_DATABASE=example_db2022adb
```

Use the following query to retrieve the database name:
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

The TNS alias `db2022adb_high` can be defined as an environment variable and referred to in `profiles.yml`

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

</TabItem>


</Tabs>

:::info Note
Starting with `dbt-oracle==1.0.2`, it is **optional** to set the `database` name in `profile.yml`

Starting with `dbt-oracle==1.8.0` database key in `profile.yml` is **still optional for all but one** of the dbt-oracle workflows.
if `database` is missing in `profile.yml` the generated catalog used for project documentation will be empty.

From `dbt-oracle==1.8`, we detect that `database` key is missing from `profile.yml` and issue a warning to add it for catalog generation. The warning message also shows the database name that dbt-oracle expects. That way users don't have to worry about "what" the database name is and "how" to get it.
:::

### Quoting configuration

The default quoting configuration used by dbt-oracle is shown below:

<File name='dbt_project.yaml'>

```yaml
quoting:
  database: false
  identifier: false
  schema: false
```
</File>

This is recommended and works for most cases.

### Approximate relation match error

Often users have complained about an approximate relation match as shown below:

```
Compilation Error in model <model>
19:09:40    When searching for a relation, dbt found an approximate match. Instead of guessing
19:09:40    which relation to use, dbt will move on. Please delete <model>, or rename it to be less ambiguous.
  Searched for: <model>
```

This is reported in multiple channels:

- [StackOverFlow Approximate relation Match Error](https://stackoverflow.com/questions/75892325/approximate-relation-match-with-dbt-on-oracle)

- [Github Issue #51](https://github.com/oracle/dbt-oracle/issues/51)

- [Github Issue #143](https://github.com/oracle/dbt-oracle/issues/143)

- [Github Issue #144](https://github.com/oracle/dbt-oracle/issues/144)

In all cases, the solution was to enable quoting only for the database.

To solve this issue of `approximate match` use the following quoting configuration

<File name='dbt_project.yaml'>

```yaml
quoting:
  database: true
```
</File>

## Python models using Oracle Autonomous Database (ADB-S)

Oracle's Autonomous Database Serverless (ADB-S) users can run dbt-py models using Oracle Machine Learning (OML4PY) which is available without any extra setup required.

### Features
- User Defined Python function is run in an ADB-S spawned Python 3.12.1 runtime
- Access to external Python packages available in the Python runtime. For e.g. `numpy`, `pandas`, `scikit_learn` etc
- Integration with Conda 24.x to create environments with custom Python packages
- Access to Database session in the Python function
- DataFrame read API to read `TABLES`, `VIEWS`, and ad-hoc `SELECT` queries as DataFrames
- DataFrame write API to write DataFrames as `TABLES`
- Supports both table and incremental materialization


### Setup

#### Required roles

- User must be non-ADMIN to execute the Python function
- User must be granted the `OML_DEVELOPER` role

#### OML Cloud Service URL

OML Cloud Service URL is of the following format:

```text
https://tenant1-dbt.adb.us-sanjose-1.oraclecloudapps.com
```

In this example:
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
         database: "{{ env_var('DBT_ORACLE_DATABASE') }}"
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
| Conda environment | String | `dbt.config(conda_env_name="dbt_py_env")` |

In async mode, dbt-oracle will schedule a Python job, poll the job's status, and wait for it to complete.
Without async mode, dbt-oracle will immediately invoke the Python job in a blocking manner.

:::warning Note
Use `dbt.config(async_flag=True)` for long-running Python jobs.
:::

### Python model examples

#### Refer other model

Use `dbt.ref(model_name)` to refer to either SQL or Python model

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

### Use Custom Conda environment

1. As ADMIN user, create a conda environment using [OML4PY Conda Notebook](https://docs.oracle.com/en/database/oracle/machine-learning/oml4py/1/mlpug/administrative-task-create-and-conda-environments.html):

```bash
conda create -n dbt_py_env -c conda-forge --override-channels --strict-channel-priority python=3.12.1 nltk gensim
```

2. Save this environment using the following command from the OML4PY Conda Notebook:

```bash
conda upload --overwrite dbt_py_env -t application OML4PY
```

3. Use the environment in dbt Python models:

```python
# Import custom packages from Conda environments
import nltk
import gensim

def model(dbt, session):
    dbt.config(materialized="table")
    dbt.config(conda_env_name="dbt_py_env")  # Refer the conda environment
    dbt.config(async_flag=True) # Use async mode for long running Python jobs
    dbt.config(timeout=900)
    # oml.core.DataFrame referencing a dbt-sql model
    promotion_cost = dbt.ref("direct_sales_channel_promo_cost")
    return promotion_cost
```

## Supported features

- Table materialization
- View materialization
- Materialized View
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
- Integration with Conda to use any Python packages from Anaconda's repository
- All dbt commands are supported

## Not supported features
- Ephemeral materialization
