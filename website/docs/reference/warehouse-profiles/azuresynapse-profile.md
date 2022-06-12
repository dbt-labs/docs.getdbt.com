---
title: "Microsoft Azure Synapse DWH Profile"
---

:::info Community plugin

Some core functionality may be limited. If you're interested in contributing, check out the source code for each repository listed below.

:::

## Overview of dbt-synapse

**Maintained by:** Community  
**Author:** [dbt-msft community](https://github.com/dbt-msft)   
**Source:** [GitHub](https://github.com/dbt-msft/dbt-synapse)  
**Core version:** v0.18.0 and newer      
**dbt Cloud:** Not Supported     
**dbt Slack channel:** [Link to channel](https://getdbt.slack.com/archives/C01DRQ178LQ)

![dbt-synapse stars](https://img.shields.io/github/stars/dbt-msft/dbt-synapse?style=for-the-badge)
![latest version on PyPI](https://img.shields.io/pypi/v/dbt-synapse?style=for-the-badge)

The package can be installed from PyPI with:

```python
pip install dbt-synapse
```

:::info Dedicated SQL only

Azure Synapse offers both Dedicated SQL Pools and Serverless SQL Pools.
**Only Dedicated SQL Pools are supported by this adapter. If you really insist on using serverless pools, check out the neglected, experimental project: [dbt-synapse-serverless](https://github.com/dbt-msft/dbt-synapse-serverless)** 

:::

### Prerequisites

On Ubuntu make sure you have the ODBC header files before installing

    sudo apt install unixodbc-dev

Download and install the [Microsoft ODBC Driver 17 for SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15)

### Authentication methods

This adapter is based on the adapter for Microsoft SQL Server.
Therefor, the same authentication methods are supported.

The configuration is the same except for 1 major difference:
instead of specifying `type: sqlserver`, you specify `type: synapse`.

Example:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: dev
  outputs:
    dev:
      type: synapse
      driver: 'ODBC Driver 17 for SQL Server' # (The ODBC Driver installed on your system)
      server: workspacename.sql.azuresynapse.net # (Dedicated SQL endpoint of your workspace here)
      port: 1433
      schema: schema_name
      user: username
      password: password
```

</File>

You can find all the available options and the documentation and how to configure them on [the documentation page for the dbt-sqlserver adapter](mssql-profile#connecting-to-azure-sql-server-with-dbt-sqlserver).
