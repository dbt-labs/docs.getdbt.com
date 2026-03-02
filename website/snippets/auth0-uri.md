The URI used for SSO connections will vary based on your <Constant name="cloud" /> hosted region. To find the Auth0 URI (also called the **Single sign-on URL**, **Authorization URL**, or **Callback URI**) for your environment:

1. Navigate to your **Account settings** and click **SSO & SCIM** on the left menu.
2. Click **Edit** or **Get started** in the **Single sign-on** pane.
3. Select the appropriate **Identity provider** from the **Provider type** dropdown.
4. The Auth0 URI is displayed under the **Identity provider values** section. The field label depends on the provider you selected:

   | Identity provider | Field label | Example URI |
   |---|---|---|
   | SAML 2.0 | **Single sign-on URL** | `https://YOUR_AUTH0_URI/login/callback` |
   | Okta | **Single sign-on URL** | `https://YOUR_AUTH0_URI/login/callback?connection=ACCOUNT_NAME` |
   | Google Workspace | **Authorized Redirect URI** | `https://YOUR_AUTH0_URI/login/callback` |
   | Microsoft Entra ID | **Callback URI** | `https://YOUR_AUTH0_URI/login/callback` |

   *Replace `YOUR_AUTH0_URI` and `ACCOUNT_NAME` with your account values.*

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-uri.png" width="80%" title="Example of the identity provider values for a SAML 2.0 provider" />

:::info Auth0 URI
The Auth0 URI should always use `YOUR_AUTH0_URI` (for example, `auth.cloud.getdbt.com`), not your account-specific prefix URL (such as `ks123.us1.dbt.com`). This is because <Constant name="cloud" /> uses Auth0 as a centralized authentication service. You don't need to replace this value with your cell-specific URL.
:::


