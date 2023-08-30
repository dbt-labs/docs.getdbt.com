
The URI used for SSO connections on multi-tenant dbt Cloud instances will vary based on your dbt Cloud hosted region. Use your login URL (also referred to as your Access URL) to determine the correct Auth0 URI for your environment.

| Region | dbt Cloud Access URL | Auth0 SSO URI <YOUR_AUTH0_URI> | Auth0 Entity ID <YOUR_AUTH0_ENTITYID>* |
|--------|-----------------------|-------------------------------|----------------------------------------|
| US     | cloud.getdbt.com     | auth.cloud.getdbt.com | us-production-mt                       |
| EMEA   | emea.dbt.com         | auth.emea.dbt.com     | emea-production-mt                     |
| APAC   | au.dbt.com           | auth.au.dbt.com       | au-production-mt                       |

*Only applicable to SAML and Okta configurations.
