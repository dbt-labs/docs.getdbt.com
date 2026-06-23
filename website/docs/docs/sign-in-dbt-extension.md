---
title: Sign in or register the dbt VS Code extension
id: sign-in-dbt-extension
description: "Sign in or register to unlock advanced features in the dbt VS Code extension."
sidebar_label: "Sign in or register"
---

import FusionTroubleshooting from '/snippets/_fusion-troubleshooting.md';
import AboutFusion from '/snippets/_about-fusion.md';
import AuthorizeAdditionalAccess from '/snippets/_vsce-authorize-additional-access.md';

# Sign in or register <Lifecycle status="preview" />

The dbt VS Code extension comes with a suite of features that are available to all users for 14 days. After the 14-day trial, sign in or register for a <Constant name="dbt_platform" /> account to keep using all features, including advanced features such as [live preview for models and CTEs](/docs/dbt-extension-features#live-preview-for-models-and-ctes), [column-level lineage](/docs/dbt-extension-features#rich-lineage-in-context), and more.

Refer to [VS Code extension features](/docs/fusion/fusion-availability?version=1.13#dbt-vs-code-extension-features) for the full list of features and their availability.

Most features remain available without signing in &mdash; only advanced features prompt you to sign in after the trial ends.

<VersionBlock firstVersion="2.0">

To continue using all the features, register or login using [`dbt login`](/reference/commands/login), available from dbt Core v1.12 and later, from the command line. Your login state can be shared across dbt features, including the dbt VS Code extension and dbt State.

</VersionBlock>

Run [`dbt login status`](/reference/commands/login#dbt-login-status) to view your currently authenticated status.

## Key points

- The extension is free for organizations for up to 15 users. Refer to the [acceptable use policy](https://www.getdbt.com/dbt-assets/vscode-plugin-aup).
- Registration links your editor to your registered <Constant name="dbt_platform" /> account so you can keep using gated features after the 14-day trial.
- You can authenticate with `dbt login` or register from inside the extension. If you don't have a <Constant name="dbt_platform" /> account, you can create a free account during authentication to unlock advanced features.
- If a valid [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file exists on your machine, the extension can use it automatically.

If you've registered before, you won't need to authenticate again unless your session expired.

## Session expiry and re-authorization

Your sign-in session stays active across editor restarts. dbt automatically renews your session while you're using the extension or the CLI. You may need to re-authorize in a few specific cases:

- **Session expired after 7 days of inactivity.** The extension shows the message: "Your dbt extension session expired. Sign in again to continue using the extension." Click the prompt or run **dbt: Register dbt extension** from the command palette to sign in again.
- **A feature needs broader access than your initial sign-in granted.** [`dbt login`](/reference/commands/login) and the dbt VS Code extension may request different sets of permissions. If you signed in via `dbt login` and later use an extension feature that needs more access (for example, the catalog tab or running a job), the extension prompts you to re-authorize. You'll re-authorize with the same <Constant name="dbt_platform" /> account &mdash; you don't need a second account.
- **You authenticated with `dbt_cloud.yml` instead of OAuth.** File-based credentials don't expire on the 7-day inactivity rule. You only re-authenticate if you regenerate the file or it's removed.

When re-authorizing, the **Authorize dbt login** consent screen lists the access being requested. Click **Allow access** to continue.

## Choose a sign-in path

There are a couple of different ways to sign in or register for a <Constant name="dbt_platform" /> account. Choose the best path for you:

<SimpleTable>
| If you... | Use this path |
| --- | --- |
| Starting authentication from the terminal | [`dbt login`](?registration-path=dbt-login#choose-a-sign-in-path) from the command line. |
| Are new to dbt and don't have a <Constant name="dbt_platform" /> account | [First-time registration](?registration-path=first-time#choose-a-sign-in-path) from the dbt VS Code extension. |
| Can't sign in or need to reset access | [Recover your login](?registration-path=recover-login#choose-a-sign-in-path) from the dbt VS Code extension. |
| Prefer file-based authentication to remove need for re-authenticating | [`dbt_cloud.yml`](?registration-path=dbt-cloud-yml#choose-a-sign-in-path) from the dbt VS Code extension. |
</SimpleTable>

<Tabs queryString="registration-path">

<TabItem value="dbt-login" label="dbt login">

<h3 id="dbt-login">dbt login</h3>

<VersionBlock lastVersion="1.99">

`dbt login` is available in <Constant name="core" /> v2.0 and later. To install the dbt VS Code extension, [upgrade your project to the <Constant name="fusion_engine" />](/docs/upgrade-to-fusion-extension).

</VersionBlock>

Use this path if you prefer the terminal or want a single auth flow that works across the CLI and the dbt VS Code extension. Running `dbt login` opens the same browser flow that the extension uses when you select **dbt: Register dbt extension** from the command palette, so completing it once authenticates both.

1. From your terminal, run:

    ```shell
    dbt login
    ```

2. Complete the sign-in or sign-up flow in your browser. 
   - Refer to [First-time registration](?registration-path=first-time#first-time-registration) if you've never registered
   - Refer to [Existing account sign-in](?registration-path=existing-account#existing-dbt-account) if you already have a dbt account.
   - Refer to [Recover your login](?registration-path=recover-login#recover-your-login) if you've forgotten your password or your account is locked.

3. On the **Authorize dbt login** screen, click **Allow access**. dbt saves your credentials to your local dbt configuration directory and uses them for future CLI commands:
   - macOS and Linux: `~/.dbt/`
   - Windows: `C:\Users\[username]\.dbt\`

   <Lightbox src="/img/docs/extension/signin-authorize-extension.png" width="70%" title="The Authorize VS Code Extension consent screen."/>

4. Return to your editor and restart the dbt VS Code extension, or open a new editor window.
5. The extension detects the credentials and shows **Registered**.

<AuthorizeAdditionalAccess />

You've now unlocked the full feature set of the dbt VS Code extension. For details on what `dbt login` unlocks across tools, refer to the [`dbt login` reference](/reference/commands/login).

</TabItem>

<TabItem value="first-time" label="First-time registration">

<h3 id="first-time-registration">First-time registration</h3>

Register to unlock the full [feature set](/docs/dbt-extension-features) of the dbt VS Code extension. Use this path if you've never registered before. The extension and the CLI open the same browser flow, so you can start from either entry point:

- **From the extension:** Click the registration prompt, or open the command palette (Windows/Linux: Ctrl + Shift + P, macOS: Cmd + Shift + P) and run **dbt: Register dbt extension**.

   <Lightbox src="/img/docs/extension/registration-prompt.png" width="70%" title="The extension registration prompt in VS Code."/>

- **From the CLI:** Run `dbt login` in your terminal.


After you start the flow, complete the browser steps:

1. On the **Log in to dbt platform** page, enter your email and click **Continue**.
2. On the **Create your dbt platform** page, enter your name, create a password, then click **Continue**. dbt creates a free account for you.
3. On the **Authorize dbt login** screen, review the requested access. Leave **Keep session alive** on if you want dbt to renew your session automatically, then click **Allow access**.

   <Lightbox src="/img/docs/extension/signin-authorize-extension.png" width="70%" title="The Authorize dbt login consent screen."/>

4. Return to your editor. The extension shows **Registered**. If you started from the CLI, your credentials are also saved for future CLI commands.
5. Continue with the [Get started](/docs/install-dbt-extension#getting-started) workflow.

<AuthorizeAdditionalAccess />

</TabItem>

<TabItem value="existing-account" label="Existing account sign-in">

<h3 id="existing-dbt-account">Existing account sign-in</h3>

Use this path if you've registered before, including with an older or inactive registration. The extension and the CLI open the same browser flow, so you can start from either entry point:

- **From the extension:** [Update the VS Code extension](https://code.visualstudio.com/docs/setup/setup-overview#_update-cadence) to the latest version, restart your editor, then click the registration prompt or run **dbt: Register dbt extension** from the command palette.
- **From the CLI:** Run `dbt login` in your terminal.

After you start the flow, complete the browser steps:

1. On the **Sign in to dbt** page, enter the email you used to register, agree to the terms of service, complete the "I'm not a robot" check, then click **Continue**.
2. On the **Verify your email** page, enter the verification code dbt sent to your email and click **Continue**.
3. If your email is linked to more than one account, select the account you want to use on the account selection page.
4. If your account uses an authenticator app, choose a method to verify your identity, then complete the prompt.

   <Lightbox src="/img/docs/extension/signin-verify-identity.png" width="70%" title="The verify-your-identity screen for accounts that use an authenticator app."/>

5. On the **Authorize dbt login** screen, review the requested access and click **Allow access**.

**When you might still need a [`dbt_cloud.yml`](/reference/dbt_cloud.yml):**

- You want a file-based credential for automations or defer.
- You use platform features that require `dbt_cloud.yml`, such as Mesh or auto-deferral.

<AuthorizeAdditionalAccess />

</TabItem>

<TabItem value="recover-login" label="Recover your login">

<h3 id="recover-your-login">Recover your login</h3>

Use this path if the login flow says you have an account but you don't remember your password.

1. On the **Sign in to dbt** page, click **Reset password**.
2. On the reset-password screen, enter the email you used to register.
3. Check your inbox for the password-reset email and follow the link.
4. Set a new password.
5. Return to your terminal and run `dbt login` again. The password reset opens a separate browser session from the original terminal login session, so you need to restart the login flow.
6. On the **Sign in to dbt** page, sign in with the email and new password you just set, agree to the terms of service, complete the "I'm not a robot" check, then click **Continue**.
7. If your email is linked to more than one account, select the account you want to use.
8. On the **Authorize dbt login** screen, click **Allow access**. When authorization completes, the flow returns to your terminal and the dbt VS Code extension.

If you still can't sign in, your account may be locked. Contact [dbt Support](mailto:support@getdbt.com) to unlock your account, then continue with the **Existing account sign-in** flow.

<AuthorizeAdditionalAccess />

</TabItem>

<TabItem value="dbt-cloud-yml" label="dbt_cloud.yml">

<h3 id="register-with-dbt_cloudyml">Register with <code>dbt_cloud.yml</code></h3>

Use this path if your workflow requires a credential file or if you want to remove the need to re-authenticate when sessions expire.

`dbt_cloud.yml` is a separate, complementary authentication path. You may still need `dbt_cloud.yml` for <Constant name="dbt_platform" /> features such as Mesh and auto-deferral.

1. Log in to <Constant name="dbt_platform" />.
2. Go to **Account settings** → **VS Code extension**.
3. In the **Set up your credentials** section, click **Download credentials** to get your [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file.

    <Lightbox src="/img/docs/extension/download-registration-2.png" width="70%" title="Download the dbt_cloud.yml file from your dbt platform account."/>

4. Move the file into your `.dbt` directory:
   - macOS and Linux: `~/.dbt/dbt_cloud.yml`
   - Windows: `C:\Users\[username]\.dbt\dbt_cloud.yml`
5. Return to your editor, open the command palette, and run **dbt: Register dbt extension**.
6. The extension detects the credential file and continues the registration flow.

**Behavior details:**

- If a [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file exists, the extension uses it automatically.
- If the file is missing, the extension prompts you to sign in or add the file.

If your dbt project uses environment variables, configure them locally so the extension can use the same values as your dbt environment. For more information, refer to [Configure environment variables](/docs/configure-dbt-extension).

</TabItem>

</Tabs>

## Troubleshooting

<!-- This anchor is linked from the VS Code extension. Please do not change it -->

<FusionTroubleshooting />

<AboutFusion />
