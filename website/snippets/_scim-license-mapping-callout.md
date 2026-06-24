:::info License mapping with SCIM

dbt platform supports automatic license assignment via SCIM, with different options depending on your identity provider:

- **Okta:** Enable **Manage user licenses with SCIM** in **Account settings > SSO & SCIM** and follow the [Okta license management guide](/docs/platform/manage-access/scim-manage-user-licenses).
- **Entra ID:** Use [SSO-based Active Directory group → license mapping](/docs/platform/manage-access/seats-and-users#mapped-configuration) — it works alongside an active Entra ID SCIM setup. Keep the **Manage user licenses with SCIM** toggle _disabled_; enabling it removes license mapping for Entra ID users.

For more details, refer to [Does SCIM support automatic license assignment?](/docs/platform/manage-access/scim-faq#does-scim-support-automatic-license-assignment) in the SCIM FAQ.
:::
