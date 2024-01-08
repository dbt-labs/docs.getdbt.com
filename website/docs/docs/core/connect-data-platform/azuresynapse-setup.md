---
title: "Microsoft Azure Synapse DWH setup"
description: "Read this guide to learn about the Mircosoft Azure Synapse warehouse setup in dbt."
meta:
  maintained_by: Microsoft
  authors: 'Microsoft (https://github.com/Microsoft)'
  github_repo: 'Microsoft/dbt-synapse'
  pypi_package: 'dbt-synapse'
  min_core_version: 'v0.18.0'
  cloud_support: Not Supported
  min_supported_version: 'Azure Synapse 10'
  slack_channel_name: '#db-synapse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Synapse'
  config_page: '/reference/resource-configs/azuresynapse-configs'
---

:::info

The following is a guide to using Azure Synapse Analytics Dedicated SQL Pools, formerly SQL DW. For more info, refer to [What is dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics?](https://learn.microsoft.com/en-us/azure/synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is) for more info.

Refer to [Microsoft Fabric Synapse Data Warehouse](/docs/core/connect-data-platform/fabric-setup) to set it up with dbt.


:::

<!--The following code uses a component and the built-in docusaurus markdown partials file, which contains reusable content assigned in the meta frontmatter. For this page, the partial file is _setup-pages-intro.md. You have to include the 'import' code and then assign the component as needed.  -->

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

:::info Dedicated SQL only

Azure Synapse offers both Dedicated SQL Pools and Serverless SQL Pools.
**Only Dedicated SQL Pools are supported by this adapter. 

:::

### Prerequisites

On Debian/Ubuntu make sure you have the ODBC header files before installing

```bash
sudo apt install unixodbc-dev
```

Download and install the [Microsoft ODBC Driver 18 for SQL Server](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server?view=sql-server-ver15).
If you already have ODBC Driver 17 installed, then that one will work as well.

:::tip Default settings change in dbt-synapse v1.2 / ODBC Driver 18
Microsoft made several changes related to connection encryption. Read more about the changes [here](/docs/core/connect-data-platform/mssql-setup).
:::

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
      database: exampledb
      schema: schema_name
      user: username
      password: password
```

</File>

You can find all the available options and the documentation and how to configure them on [the documentation page for the dbt-sqlserver adapter](/docs/core/connect-data-platform/mssql-setup).
