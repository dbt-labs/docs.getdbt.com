---
title: "Semantic views"
sidebar_label: "Semantic views"
description: "Use the dbt_semantic_view package to define and manage Snowflake semantic views in your dbt project."
---

[Snowflake Semantic Views](https://docs.snowflake.com/en/user-guide/views-semantic/overview) provide a native schema-level object for centralizing metric definitions and reducing fragmented metric logic across BI and analytics tools.

Use the [`dbt_semantic_view` package](https://hub.getdbt.com/Snowflake-Labs/dbt_semantic_view/latest/) to define and manage Snowflake Semantic Views in your dbt project. This lets you keep Semantic View definitions in version control and apply your existing testing and CI/CD workflows to your <Constant name="semantic_layer" />.

### Install the package
:::note Prerequisite
- This package requires `dbt` version `>=1.0.0, <2.0.0`. For the latest compatibility details, refer to the [`dbt_semantic_view` package](https://hub.getdbt.com/Snowflake-Labs/dbt_semantic_view/latest/).
- Your Snowflake account supports Semantic Views.
- Your role has permission to create Semantic Views.
- You can write to a database and schema where you have create privileges.
:::

Add `dbt_semantic_view` to your `packages.yml` file:

```yaml
packages:
  - package: Snowflake-Labs/dbt_semantic_view
    version: 1.0.3
```

Run `dbt deps` to install package dependencies:

```shell
dbt deps
```

Verify the package was installed by confirming `dbt_semantic_view` is present in your `dbt_packages/` directory.

### Highlighted features

The `dbt_semantic_view` package includes the following features for defining and managing Snowflake Semantic Views in dbt projects.

#### Materialize models as Snowflake Semantic Views

Use the `semantic_view` materialization to define Snowflake Semantic Views in dbt, including tables, relationships, facts, dimensions, and metrics.

Semantic view models use Snowflake’s semantic view syntax (for example, `TABLES`, `DIMENSIONS`, and `METRICS`) rather than a standard `SELECT` query.

The example below is adapted from [Getting Started with Snowflake Semantic View](https://quickstarts.snowflake.com/guide/snowflake-semantic-view/index.html?index=..%2F..index#3).
```sql
{{ config(materialized='semantic_view') }}

tables (
    CUSTOMER as {{ SOURCE('<SOURCE_NAME>', 'CUSTOMER') }} primary key (C_CUSTOMER_SK),
    DATE as {{ SOURCE('<SOURCE_NAME>', 'DATE_DIM') }} primary key (D_DATE_SK),
    DEMO as {{ SOURCE('<SOURCE_NAME>', 'CUSTOMER_DEMOGRAPHICS') }} primary key (CD_DEMO_SK),
    ITEM as {{ SOURCE('<SOURCE_NAME>', 'ITEM') }} primary key (I_ITEM_SK),
    STORE as {{ SOURCE('<SOURCE_NAME>', 'STORE') }} primary key (S_STORE_SK),
    STORESALES as {{ SOURCE('<SOURCE_NAME>', 'STORESALES') }}
    primary key (SS_SOLD_DATE_SK,SS_CDEMO_SK,SS_ITEM_SK,SS_STORE_SK,SS_CUSTOMER_SK)
)
relationships (
    SALESTOCUSTOMER as STORESALES(SS_CUSTOMER_SK) references CUSTOMER(C_CUSTOMER_SK),
    SALESTODATE as STORESALES(SS_SOLD_DATE_SK) references DATE(D_DATE_SK),
    SALESTODEMO as STORESALES(SS_CDEMO_SK) references DEMO(CD_DEMO_SK),
    SALESTOITEM as STORESALES(SS_ITEM_SK) references ITEM(I_ITEM_SK),
    SALETOSTORE as STORESALES(SS_STORE_SK) references STORE(S_STORE_SK)
)
facts (
    ITEM.COST as i_wholesale_cost,
    ITEM.PRICE as i_current_price,
    STORE.TAX_RATE as S_TAX_PERCENTAGE,
    STORESALES.SALES_QUANTITY as SS_QUANTITY
)
dimensions (
    CUSTOMER.BIRTHYEAR as C_BIRTH_YEAR,
    CUSTOMER.COUNTRY as C_BIRTH_COUNTRY,
    CUSTOMER.C_CUSTOMER_SK as c_customer_sk,
    DATE.DATE as D_DATE,
    DATE.D_DATE_SK as d_date_sk,
    DATE.MONTH as D_MOY,
    DATE.WEEK as D_WEEK_SEQ,
    DATE.YEAR as D_YEAR,
    DEMO.CD_DEMO_SK as cd_demo_sk,
    DEMO.CREDIT_RATING as CD_CREDIT_RATING,
    DEMO.MARITAL_STATUS as CD_MARITAL_STATUS,
    ITEM.BRAND as I_BRAND,
    ITEM.CATEGORY as I_CATEGORY,
    ITEM.CLASS as I_CLASS,
    ITEM.I_ITEM_SK as i_item_sk,
    STORE.MARKET as S_MARKET_ID,
    STORE.SQUAREFOOTAGE as S_FLOOR_SPACE,
    STORE.STATE as S_STATE,
    STORE.STORECOUNTRY as S_COUNTRY,
    STORE.S_STORE_SK as s_store_sk,
    STORESALES.SS_CDEMO_SK as ss_cdemo_sk,
    STORESALES.SS_CUSTOMER_SK as ss_customer_sk,
    STORESALES.SS_ITEM_SK as ss_item_sk,
    STORESALES.SS_SOLD_DATE_SK as ss_sold_date_sk,
    STORESALES.SS_STORE_SK as ss_store_sk
)
metrics (
    STORESALES.TOTALCOST as SUM(item.cost),
    STORESALES.TOTALSALESPRICE as SUM(SS_SALES_PRICE),
    STORESALES.TOTALSALESQUANTITY as SUM(SS_QUANTITY)
        WITH SYNONYMS = ('total sales quantity', 'total sales amount')
)
```

When you run dbt, this model compiles to a Snowflake `CREATE SEMANTIC VIEW` statement.

#### Reference Semantic Views in other dbt models

Use `ref()` for Semantic Views defined in your dbt project, and use `source()` for existing external Semantic Views.

```sql
{{ config(materialized='view') }}

select * from semantic_view(
  {{ ref('<semantic_view_model_name>') }}
  METRICS ...
  DIMENSIONS ...
  WHERE ...
)
```

```sql
{{ config(materialized='table') }}

select * from semantic_view(
  {{ source('<source_name>', '<semantic_view>') }}
  METRICS ...
  DIMENSIONS ...
  WHERE ...
)
```
