---
datatype: string
description: "Read this guide to understand the profile configuration in dbt."
---
<File name='dbt_project.yml'>

```yml
profile: string
```

</File>

## Definition
The profile your dbt project should use to connect to your <Term id="data-warehouse" />.
* If you are developing in dbt Cloud: This configuration is not applicable
* If you are developing locally: This configuration is required, unless a command-line option (i.e. `--profile`) is supplied.

## Related guides
* [Connecting to your warehouse using the command line](/docs/core/connect-data-platform/connection-profiles#connecting-to-your-warehouse-using-the-command-line)

## Recommendation
Often an organization has only one <Term id="data-warehouse" />, so it is sensible to use your organization's name as a profile name, in `snake_case`. For example:
* `profile: acme`
* `profile: jaffle_shop`

It is also reasonable to include the name of your warehouse technology in your profile name, particularly if you have multiple warehouses. For example:
* `profile: acme_snowflake`
* `profile: jaffle_shop_bigquery`
* `profile: jaffle_shop_redshift`
