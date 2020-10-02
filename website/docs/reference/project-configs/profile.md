---
datatype: string
---
<File name='dbt_project.yml'>

```yml
profile: string
```

</File>

## Definition
The profile your dbt project should use to connect to your data warehouse.
* If you are developing in dbt Cloud: This configuration is optional
* If you are developing locally: This configuration is required, unless a command-line option (i.e. `--profile`) is supplied.

## Related guides
* [Connecting to your warehouse](docs/dbt-cli/configure-your-profile.md)

## Recommendation
Often an organization has only one data warehouse, so it is sensible to use your organization's name as a profile name, in `snake_case`. For example:
* `profile: acme`
* `profile: jaffle_shop`
* `profile: evilcorp`

It is also reasonable to include the name of your warehouse technology in your profile name. For example:
* `profile: acme_snowflake`
* `profile: jaffle_shop_bigquery`
* `profile: evilcorp_redshift`

If you are working on more than one project, do not use `profile: default` as your profile name (as set by the `dbt init` [command](init)), as it will become hard to manage multiple profiles.
