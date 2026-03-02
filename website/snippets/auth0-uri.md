The URI used for SSO connections will vary based on your <Constant name="cloud" /> hosted region. To find the Auth0 URI (also called the **Single sign-on URL**, **Authorization URL**, or **Callback URI**) for your environment:

1. Navigate to your **Account settings** and click **SSO & SCIM** on the left menu.
2. Click **Edit** or **Get started** in the **Single sign-on** pane.
3. Select the appropriate **Identity provider** from the **Provider type** dropdown.
4. The Auth0 URI is displayed under the **Identity provider values** section. The field label depends on the provider you selected:

   | Identity provider | Field label | Example URI |
   |---|---|---|
   | SAML 2.0 | **Single sign-on URL** | `https://auth.cloud.getdbt.com/login/callback?connection=account_name-random_characters` |
   | Okta | **Single sign-on URL** | `https://auth.cloud.getdbt.com/login/callback?connection=account_name-random_characters` |
   | Google Workspace | **Authorized Redirect URI** | `https://auth.cloud.getdbt.com/login/callback` |
   | Microsoft Entra ID | **Callback URI** | `https://auth.cloud.getdbt.com/login/callback` |

   *Where `account_name-random_characters` is specific to your account.*

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-uri.png" width="80%" title="Example of the identity provider values for a SAML 2.0 provider" />

:::info The Auth0 URI uses `auth.cloud.getdbt.com` for all accounts
The Auth0 URI always contains `auth.cloud.getdbt.com`, not your account prefix URL (such as `ks123.us1.dbt.com`). This is because <Constant name="cloud" /> uses Auth0 as a centralized authentication service. You do _not_ need to replace this with your cell-specific URL.
:::


