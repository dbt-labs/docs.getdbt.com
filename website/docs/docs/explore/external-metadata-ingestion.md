---
title: "External metadata ingestion"
sidebar_label: "External metadata ingestion"
description: "Connect directly to your data warehouse, giving you visibility into tables, views, and other resources that aren't defined in dbt with dbt Catalog." 
---

# External metadata ingestion <Lifecycle status="managed,managed_plus" /> <Lifecycle status="preview" />

<IntroText>

With external metadata ingestion, you can connect directly to your data warehouse, giving you visibility into tables, views, and other resources that aren't defined in dbt with <Constant name="explorer" />.

</IntroText>

:::info External metadata ingestion support
Currently, external metadata ingestion is supported for Snowflake only.
:::
  
External metadata credentials enable ingestion of metadata that exists *outside* your dbt runs like tables, views, or cost information; typically at a higher level than what dbt environments access. This is useful for enriching <Constant name="explorer" /> with warehouse-native insights (for example, Snowflake views or access patterns) and creating a unified discovery experience.

These credentials are configured separately from dbt environment credentials and are scoped at the account level, not the project level.

## Prerequisites

- Have a <Constant name="cloud" /> account on the [Enterprise or Enterprise+](https://www.getdbt.com/pricing) plan.
- You must be an [account admin with permission](/docs/cloud/manage-access/enterprise-permissions#account-admin) to edit connections.
    - The credentials must have [sufficient read-level access to fetch metadata](/docs/explore/external-metadata-ingestion#configuration-instructions).
- Have [**global navigation**](/docs/explore/explore-projects#catalog-overview) enabled.
- Use Snowflake as your data platform.
- Stayed tuned! Coming very soon, there’ll be support in future for other adapters!

## Configuration instructions

To enable external metadata ingestion:

1. Navigate to [account settings](/docs/cloud/account-settings)
2. Locate or create the warehouse connection you want to ingest metadata from
3. Click **Add Credential** and enter your global metadata credentials
    - These should have warehouse-level visibility across relevant databases and schemas
4. Enable the option for “external metadata ingestion”
    - This allows metadata from this connection to populate the <Constant name="explorer" />
    - *Optional*: Enable additional features such as **cost optimization**
5. Apply filters to restrict which metadata is ingested:
    - You can filter by **database**, **schema**, **table**, or **view**.
    - Strongly recommend you filter by certain schemas. See [Important considerations](/docs/explore/external-metadata-ingestion#important-considerations) for more information.
    - These fields accept CSV-formatted regular expressions:
        - Example: `DIM` matches `DIM_ORDERS` and `DIMENSION_TABLE` (basic "contains" match)
        - Wildcards are supported: `DIM*` matches `DIM_ORDERS`, `DIM_PRODUCTS`, etc.

## Required credentials

This section sets up the foundational access for dbt in Snowflake. It creates a role (`dbt_metadata_role`) with minimal permissions and a user (`dbt_metadata_user`) dedicated to dbt’s metadata access. This ensures a clear, controlled separation of access, so dbt can read metadata without broader permissions. This setup ensures dbt can read metadata for profiling, documentation, and lineage, without the ability to modify data or manage resources.

1. Create role:

```sql
CREATE OR REPLACE ROLE dbt_metadata_role;
```

2. Grant access to a warehouse to run queries to view metadata:

```sql
GRANT OPERATE, USAGE ON WAREHOUSE "<your-warehouse>" TO ROLE dbt_metadata_role;
```

If you do not already have a user, create a dbt-specific user for metadata access. Replace `<your-password>` with a strong password and `<your-warehouse>` with the warehouse name used above:

```sql
CREATE USER dbt_metadata_user
  DISPLAY_NAME = 'dbt Metadata Integration'
  PASSWORD = 'our-password>'
  DEFAULT_ROLE = dbt_metadata_role
  TYPE = 'LEGACY_SERVICE'
  DEFAULT_WAREHOUSE = '<your-warehouse>';
```

3. Grant the role to the user:

```sql
GRANT ROLE dbt_metadata_role TO USER dbt_metadata_user;
```

Note: Use read-only service accounts for least privilege and better auditing.

## Assign metadata access privileges

This section outlines the minimum necessary privileges to read metadata from each required Snowflake database. It provides access to schemas, tables, views, and lineage information, ensuring dbt can profile and document your data while preventing any modifications.

Replace `your-database` with the name of a Snowflake database to grant metadata access. Repeat this block for each relevant database:

```sql
SET db_var = '"<your-database>"';

-- Grant access to view the database and its schemas
GRANT USAGE ON DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT USAGE ON ALL SCHEMAS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT USAGE ON FUTURE SCHEMAS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Grant REFERENCES to enable lineage and dependency analysis
GRANT REFERENCES ON ALL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON ALL EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON ALL VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT REFERENCES ON FUTURE VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Recommended grant SELECT for privileges to enable metadata introspection and profiling
GRANT SELECT ON ALL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE EXTERNAL TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE VIEWS IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON ALL DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT SELECT ON FUTURE DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;

-- Grant MONITOR on dynamic tables (e.g., for freshness or status checks)
GRANT MONITOR ON ALL DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
GRANT MONITOR ON FUTURE DYNAMIC TABLES IN DATABASE IDENTIFIER($db_var) TO ROLE dbt_metadata_role;
```

## Grant access to Snowflake metadata

This step grants the dbt role (`dbt_metadata_role`) access to Snowflake’s system-level database, enabling it to read usage statistics, query histories, and lineage information required for comprehensive metadata insights.

Grant privileges to read usage stats and lineage from Snowflake’s system-level database:

```sql
GRANT IMPORTED PRIVILEGES ON DATABASE SNOWFLAKE TO ROLE dbt_metadata_role;
```

## Important considerations

The following are best practices for external metadata ingestion, designed to ensure consistent, reliable, and scalable integration of metadata from third-party systems.

- <Constant name="explorer" /> unifies the shared resources between dbt and Snowflake. For example, if there’s a Snowflake table that represents a dbt model, these are represented as a single resource in <Constant name="explorer" />. In order for proper unification to occur, the same connection must be used by both the [production environment](/docs/deploy/deploy-environments#set-as-production-environment) and the external metadata ingestion credential.
- Avoid duplicates: Use one metadata connection per platform if possible (for example, one for Snowflake, one for BigQuery).
    - Having multiple connections pointing to the same warehouse can cause duplicate metadata.
- Align with dbt environment: To unify asset lineage and metadata, ensure the same warehouse connection is used by both the dbt environment and the external metadata ingestion.
- Use filters to limit ingestion to relevant assets:
    - For example: restrict to production schemas only, or ignore transient/temp schemas.

Note that, external metadata ingestion runs once per day at 5 PM UTC.




