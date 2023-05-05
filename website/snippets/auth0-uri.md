## Auth0 Multi-tenant URIs

The URI used for SSO connections on multi-tenant dbt Cloud instances will vary based on your dbt location. Use your login URL to determin the correct Auth0 URI for your environment.

| Region | dbt Cloud Access URL | Auth0 SSO URI <YOUR_AUTH0_URI> | Auth0 Entity ID <YOUR_AUTH0_ENTITYID>  |
|--------|-----------------------|-------------------------------|----------------------------------------|
| US     | cloud.getdbt.com     | https://auth.cloud.getdbt.com/ | us-production-mt                       |
| EMEA   | emea.dbt.com         | https://auth.emea.dbt.com/     | emea-production-mt                     |
| APAC   | au.dbt.com           | https://auth.au.dbt.com/       | au-production-mt                       |
