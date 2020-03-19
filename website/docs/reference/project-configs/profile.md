---
datatype: string
required: True
---
<!---
How do we get this to render differently to our profiles.yml reference? Perhaps we should do a callout here?

--->

## Definition
The profile this dbt project should use to connect to a data warehouse.
* If you are developing in dbt Cloud: This configuration is optional
* If you are developing locally: This configuration is required, unless a command-line option (i.e. `--profile`) is supplied.

## Related documentation
* [Connecting to your warehouse](docs/running-a-dbt-project/using-the-command-line-interface/configure-your-profile.md)

## Recommendation
Often an organization has only one data warehouse, so it is sensible to name a project with your organization's name, in `kebab_case`. For example:
* `name: acme`
* `name: jaffle_shop`
* `name: evilcorp`

It is also sensible to include the name of your warehouse technology in your profile name. For example:
* `name: acme_snowflake`
* `name: jaffle_shop_bigquery`
* `name: evilcorp_redshift`

If you are working on more than one project, do not use `profile: default` as your profile name (as set by the `dbt init` [command](/docs/running-a-dbt-project/command-line-interface/init.md))
