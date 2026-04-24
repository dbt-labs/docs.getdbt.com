---
title: "Log in to dbt platform"
id: "login"
description: "Use login.dbt.com to discover and access your dbt platform accounts."
pagination_next: null
pagination_prev: null
---

The [https://login.dbt.com](https://login.dbt.com) URL is the universal entry point for <Constant name="dbt_platform"/>. It sits outside any specific account and maps your identity (email) to the accounts you can access across all instances and regions.

You can also sign in directly using your account [**Access URL**](/docs/cloud/about-cloud/access-regions-ip-addresses) if you already know it (like `abc123.us1.dbt.com`). Refer to [Access, Regions, & IP Addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for the full list of access URLs by region.

:::note
`login.dbt.com` is currently available for multi-tenant accounts with an account-specific domain (for example, `abc123.us1.dbt.com`). Support for single-tenant accounts is coming soon. In the meantime, single-tenant users can sign in directly using their account **Access URL** (like `abc123.us1.dbt.com`).

OAuth clients such as [<Constant name="platform_cli"/>](/docs/cloud/cloud-cli-installation), the [dbt VS Code extension](/docs/about-dbt-extension?version=2.0), and [dbt MCP](/docs/dbt-ai/about-mcp) have not yet been updated to use `login.dbt.com` and continue to authenticate through their account [**Access URL**](/docs/cloud/about-cloud/access-regions-ip-addresses).
:::

## How login works

1. Go to [https://login.dbt.com](https://login.dbt.com) and enter your email.
2. Enter you email and you will receive a verification code to log in if you have access to a dbt account. If you don't have a dbt account, you can create one on the same login page.
3. Check your email for the verification code and enter it in the login.dbt.com page to confirm you identity. The code expires in 5 minutes or after 3 attempts.
   - If you didn't receive a code, check your spam folder or request a new one. You may not receive a verification code if your email is not associated with a dbt account.
4. Once you verify, <Constant name="dbt_platform"/> looks up which accounts are associated with your email address:
    - If you have access to multiple accounts, you see a list of accounts including their region and tenancy. Select the one you want to open.
    - If you have access to only one account, you're redirected to that account directly.
5. Authenticate using the method configured for that account (password, SSO, or MFA).

:::note
If no accounts are found for your email, contact [dbt Support](mailto:support@getdbt.com) or your account admin. You can also sign in directly at your account [**Access URL**](/docs/cloud/about-cloud/access-regions-ip-addresses).
:::

<video width="100%" height="100%" playsinline muted controls>
  <source src="/img/docs/dbt-cloud/login.mp4" type="video/mp4" />
</video>

## SSO behavior

After you select an account, <Constant name="dbt_platform"/> applies that account's authentication requirements. If SSO is enforced for the account, you'll be redirected to your identity provider (IdP) to complete authentication. Refer to [SSO overview](/docs/cloud/manage-access/sso-overview) for more information about SSO configuration.

<!--
OAuth and external clients
External clients that integrate with <Constant name="dbt_platform"/> use OAuth to authenticate &mdash; like [<Constant name="platform_cli"/>](/docs/cloud/cloud-cli-installation) and the [dbt VS Code extension](/docs/about-dbt-extension?version=2.0), and [dbt MCP](/docs/dbt-ai/about-mcp) &mdash; use `login.dbt.com` as the consistent redirect entry point. This means you go through the same account discovery and authentication flow regardless of which client initiates the login.
-->

## Admin settings

Account administrators can control whether users can discover the account through `login.dbt.com`. 

- When account admins turn on the **Enable global account discovery** option in [Account settings](/docs/cloud/account-settings#enable-global-account-discovery) in <Constant name="dbt_platform" />, users will be able to find the account by entering their email at `login.dbt.com`. 
- When an admin turns off the option, users must know their account **Access URL** to sign in and won't see the account in the discovery list.

To change this setting, go to **Account settings** and select or clear **Enable global account discovery**. For details, refer to [Account settings](/docs/cloud/account-settings#enable-global-account-discovery).
