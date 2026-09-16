## Assign permission sets to SCIM groups

SCIM syncs groups and memberships into <Constant name="dbt_platform" />, but it does not assign [permission sets](/docs/platform/manage-access/enterprise-permissions). Without a permission set, group members will not have access to features beyond their user profile.

1. After the sync, go to **Account settings** &rarr; **Groups & Licenses**, where the SCIM group appears automatically.
2. Open the SCIM-synced group. Don't create another group for the same IdP group, as this creates a duplicate.
3. Under **Access & permissions**, click **Add permission**.
4. Select a [permission set](/docs/platform/manage-access/enterprise-permissions), the projects it should apply to, and [environment-level access](/docs/platform/manage-access/environment-permissions) if applicable.
5. Click **Save**.

Repeat for each SCIM-synced group that needs access.
