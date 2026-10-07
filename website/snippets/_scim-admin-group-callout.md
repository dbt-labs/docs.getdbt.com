:::caution Create an Account Admin group before enabling SCIM

When you enable SCIM, <Constant name="dbt_platform" /> stops adding users to default groups and turns off SSO group mappings. If no SCIM group has the [Account Admin](/docs/platform/manage-access/enterprise-permissions#account-admin) permission set, you can lose admin access to your account.

Before you enable provisioning:

1. Create a group in your IdP for your account admins and add yourself and at least one other admin.
2. Provision it so it syncs to <Constant name="dbt_platform" />.
3. In **Account settings** &rarr; **Groups & Licenses**, open the synced group and [assign the Account Admin permission set](/docs/platform/manage-access/scim-okta#assign-permission-sets-to-scim-groups).

:::
