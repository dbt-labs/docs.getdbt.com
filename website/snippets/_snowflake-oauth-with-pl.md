:::note Snowflake OAuth with PrivateLink
Users connecting to Snowflake using [Snowflake OAuth](/docs/platform/manage-access/set-up-snowflake-oauth) over an AWS PrivateLink connection from <Constant name="dbt" /> will also require access to a PrivateLink endpoint from their local workstation. Where possible, use [Snowflake External OAuth](/docs/platform/manage-access/snowflake-external-oauth) instead to bypass this limitation.

From the [Snowflake](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-overview#label-sso-private-connectivity) docs:
>Currently, for any given Snowflake account, SSO works with only one account URL at a time: either the public account URL or the URL associated with the private connectivity service

:::