---
title: "Databricks Lakebase setup"
meta:
  maintained_by: dbt Labs
  authors: dbt Labs
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-postgres'
  min_core_version: 'v1.0.0'
  cloud_support: Supported
  min_supported_version: '?'
  slack_channel_name: '#db-postgres'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0172G2E273'
  platform_name: 'Lakebase'
  config_page: '/reference/resource-configs/postgres-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


## Profile Configuration

Databricks Lakebase targets are configured exactly the same as [Postgres targets](postgres-setup#profile-configuration).

Use these key parameters to connect to Databricks Lakebase:

- `host name`: Found in **Databricks** > **Compute** > **Database instances** > **Connect with PSQL** using the format `instance-123abcdef456.database.cloud.databricks.com`
- `database name`: Use `databricks_postgres` by default
- Authentication: dbt-postgres only supports username/password. You can generate a username/password by [enabling Native Postgres Role Login](https://docs.databricks.com/aws/en/oltp/oauth?language=UI#authenticate-with-databricks-identities) and use the role name as the username. To learn more about managing the Postgres roles and privileges, check out the [docs](https://docs.databricks.com/aws/en/oltp/pg-roles#create-postgres-roles-and-grant-privileges-for-databricks-identities).

Alternatively you can [generate an OAuth token](https://docs.databricks.com/aws/en/oltp/oauth?language=UI#authenticate-with-databricks-identities) that will need to be refreshed every hour to use with your Databricks username. 

