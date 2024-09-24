Use [Extended Attributes](/docs/dbt-cloud-environments#extended-attributes) and [Environment Variables](/docs/build/environment-variables) when connecting to the Semantic Layer. If you set a value directly in the Semantic Layer Credentials, it will have a higher priority than Extended Attributes. When using environment variables, the default value for the environment will be used.

For example, set the warehouse by using `{{env_var('DBT_WAREHOUSE')}}` in your Semantic Layer credentials.

Similarly, if you set the account value using `{{env_var('DBT_ACCOUNT')}}` in Extended Attributes, dbt will check both the Extended Attributes and the environment variable.
