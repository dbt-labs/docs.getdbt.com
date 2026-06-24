:::info SCIM license mapping is only available for Okta

SCIM-native license mapping — assigning licenses via a SCIM attribute — is only supported for **Okta**. The behavior differs by identity provider:

- **Okta:** Enable **Manage user licenses with SCIM** in **Account settings > SSO & SCIM** and follow the [Okta license management guide](/docs/platform/manage-access/scim-manage-user-licenses).
- **Entra ID:** Keep the **Manage user licenses with SCIM** toggle _disabled_. Use [SSO-based Active Directory group → license mapping](/docs/platform/manage-access/seats-and-users#mapped-configuration) instead — it works alongside an active Entra ID SCIM setup. Enabling the toggle removes license mapping entirely for Entra ID users.

For more details, refer to [Does SCIM support automatic license assignment?](/docs/platform/manage-access/scim-faq#does-scim-support-automatic-license-assignment) in the SCIM FAQ.
:::
