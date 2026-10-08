**Account Admin group required:** Before enabling SCIM on your dbt account, you must create a dbt Account Admin group in your IdP, and a group with a matching name in your dbt account. Assign the dbt group the [Account Admin](/docs/platform/manage-access/enterprise-permissions#account-admin) permission set. 

Without this group, your users could be removed from the default dbt 'Owner' group once SCIM provisioning is enabled and would lose admin access to your dbt account. 
The names of these two groups can match your IdP group naming scheme, but the names for both the dbt and IdP group must be the same value.
