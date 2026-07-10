:::info License mapping with SCIM

<Constant name="dbt_platform"/> supports automatic license assignment with SCIM, with these different identity provider options:


<Expandable alt_header="Toggle options per identity provider">

- **Okta:** Enable the **Ignore dbt license mapping** toggle in **Account settings > SSO & SCIM** and follow the [Okta license management doc](/docs/platform/manage-access/scim-manage-user-licenses).
- **Entra ID:** Use [SSO-based Active Directory group → license mapping](/docs/platform/manage-access/seats-and-users#mapped-configuration). It works alongside an active Entra ID SCIM setup. Keep the **Ignore dbt license mapping** toggle _disabled_ as enabling it removes license mapping for Entra ID users.

</Expandable>

For more details, refer to the [Does SCIM support automatic license assignment?](/docs/platform/manage-access/scim-faq#does-scim-support-automatic-license-assignment) FAQ.
:::
