The URI used for SSO connections will vary based on your <Constant name="cloud" /> hosted region. To find the Auth0 URI (also called the **Single sign-on URL**, **Authorization URL**, or **Callback URI**) for your environment:

1. Navigate to your **Account settings** and click **SSO & SCIM** on the left menu.
2. Click **Edit** or **Get started** in the **Single sign-on** pane.
3. Select the appropriate **Identity provider** from the **Provider type** dropdown.
4. The Auth0 URI should be displayed under the **Identity provider values** section. This is your Auth0 URI and the label will depend on the identity provider you selected.
   - SAML 2.0 providers will show the **Single sign-on URL**
   - Okta providers will show the **Single sign-on URL**
   - Google Workspace providers will show the **Authorized Redirect URI**
   - Microsoft Entra ID providers will show the **Callback URI**

For example, for a Microsoft Entra ID provider, the Callback URI would look like: `https://auth.cloud.getdbt.com/login/callback`.

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-uri.png" width="90%" title="Example of the identity provider values for a SAML 2.0 provider" />

:::info The Auth0 URI uses `auth.cloud.getdbt.com` for all accounts
The Auth0 URI always uses `auth.cloud.getdbt.com`, even if your account uses a cell-based login URL (such as `ks123.us1.dbt.com`). This is because <Constant name="cloud" /> uses Auth0 as a centralized authentication service. You do _not_ need to replace this with your cell-specific URL.
:::


