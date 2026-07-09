---
title: "Setting row access policies"
sidebar_label: "Row access policies"
description: "Use the row_access_policy config to apply existing Snowflake row access policies to tables, views, and dynamic tables."
---

<VersionBlock firstVersion="1.10">

Configure [row access policies](https://docs.snowflake.com/en/user-guide/security-row-intro) on tables, views, and dynamic tables by using the `row_access_policy` config for models. The policy must already exist in Snowflake before you apply it to the model.

<File name='models/<modelname>.sql'>

```sql
{{ config(
    row_access_policy = 'my_database.my_schema.my_row_access_policy_name on (id)'
) }}

select ...

```
</File>

</VersionBlock>
