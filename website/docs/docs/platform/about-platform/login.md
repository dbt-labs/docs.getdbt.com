---
title: "Log in to dbt platform"
id: "login"
description: "Use login.dbt.com to discover and access your dbt platform accounts."
pagination_next: null
pagination_prev: null
---

import UniversalLoginST from '/snippets/_universal-login-st.md';

[https://login.dbt.com](https://login.dbt.com) is the universal entry point for <Constant name="dbt_platform"/> accounts with a static access URL (for example, `abc123.us1.dbt.com`). It sits outside any specific account and maps your email to the accounts you can access across instances and regions.

You can also sign in directly with your account **Access URL** if you already know it, for example, `abc123.us1.dbt.com`. Refer to [Access, regions, and IP addresses](/docs/platform/about-platform/access-regions-ip-addresses) for the full list of access URLs by region.

<UniversalLoginST />

## How login works

1. Go to [https://login.dbt.com](https://login.dbt.com).
2. Enter your email and you will receive a verification code to log in if you have access to a dbt account. If you don't have a dbt account, you can create one on the same login page.
3. Check your email for the verification code, then enter it on `login.dbt.com` to confirm your identity. The code expires after 5 minutes or 3 attempts.
   - If you didn't receive a code, check your spam folder or request a new one. You may not receive a verification code if your email is not associated with a dbt account.
4. Once you verify, <Constant name="dbt_platform"/> looks up which accounts are associated with your email address:
    - If you have access to multiple accounts, you see a list of accounts including their region and tenancy. Select the one you want to open.
    - If you have access to only one account, you're redirected to that account directly.
5. Authenticate using the method configured for that account (password, SSO, or MFA).

:::note
If no accounts are found for your email, contact [dbt Support](mailto:support@getdbt.com) or your account admin. You can also sign in directly at your account [**Access URL**](/docs/platform/about-platform/access-regions-ip-addresses).
:::

<DocCarousel slidesPerView={1}>

<Lightbox src src="/img/docs/dbt-platform/login-email-page.png" width="85%" title="Login to dbt platform using the login.dbt.com page."/>

<Lightbox src src="/img/docs/dbt-platform/login-email-verify-code.png" width="85%" title="Verify code to login to dbt platform"/>

<Lightbox src src="/img/docs/dbt-platform/login-account-list.png" width="85%" title="Select account to login to dbt platform"/>
</DocCarousel>

## SSO behavior

After you select an account, <Constant name="dbt_platform"/> applies that account's authentication requirements. If SSO is enforced for the account, you'll be redirected to your identity provider (IdP) to complete authentication. Refer to [SSO overview](/docs/platform/manage-access/sso-overview) for more information about SSO configuration.

<!--
OAuth and external clients
External clients that integrate with <Constant name="dbt_platform"/> use OAuth to authenticate &mdash; like <Constant name="platform_cli"/> and the [dbt VS Code extension](/docs/about-dbt-extension?version=2.0), and [dbt MCP](/docs/dbt-ai/about-mcp) &mdash; use `login.dbt.com` as the consistent redirect entry point. This means you go through the same account discovery and authentication flow regardless of which client initiates the login.
-->

## Admin settings

Account administrators can control whether users can discover an account through `login.dbt.com`. 

1. In <Constant name="dbt_platform" />, account admins can go to [**Account settings**](/docs/platform/account-settings#enable-global-account-discovery) and scroll to **Settings**. 
2. Navigate to the bottom and check the **Enable global account discovery** option to allow users will be able to find the account by entering their email at `login.dbt.com`.   
- When an admin turns off the option, users must know their account **Access URL** to sign in and won't see the account in the discovery list.

To change this setting, go to **Account settings** and select or clear **Enable global account discovery**. For details, refer to [Account settings](/docs/platform/account-settings#enable-global-account-discovery).
