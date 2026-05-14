
import FusionManualInstall from '/snippets/_fusion-manual-install.md';


The dbt extension &mdash; available for [VS Code, Cursor](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview), and [Windsurf](https://open-vsx.org/extension/dbtLabsInc/dbt) &mdash; uses the <Constant name="fusion_engine" /> to make dbt development smoother and more efficient. 

The dbt VS Code extension is only compatible with the <Constant name="fusion_engine" />, but not with <Constant name="core" />.

:::note

This is the only official dbt Labs VS Code extension. Other extensions _can_ work alongside the dbt VS Code extension, but they aren’t tested or supported by dbt Labs. Read the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements) for the latest updates.

:::

## Prerequisites

Before installing, make sure to review the [Limitations](/docs/fusion/supported-features#limitations) page as some features don't support <Constant name="fusion"/> just yet.

To use the extension, you must meet the following prerequisites:

| Prerequisite | Details |
| --- | --- |
| **<Constant name="fusion_engine" />**  | The [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) requires the <Constant name="fusion_engine" /> binary (a small executable program). The extension will prompt you to install it, or you can [install it manually](#install-the-dbt-fusion-engine-from-the-command-line-if-you-havent-already) at any time. <br /><br />[Register your email](#register-the-extension) within 14 days of installing the dbt extension.  Free for up to 15 users.  |
| **Project files** | - You need a `profiles.yml` configuration file.<br /><br />⁃ You _may_ need to [download a `dbt_cloud.yml`](/reference/dbt_cloud.yml) file depending on your [registration path](#choose-your-registration-path).<br /><br />⁃ You don't need a <Constant name="dbt_platform" /> project to use the extension. |
| **Editor** | [VS Code](https://code.visualstudio.com/), [Cursor](https://www.cursor.com/en), or [Windsurf](https://windsurf.com/editor) code editor. |
| **Operating systems** | macOS, Windows, or Linux-based computer. |
|  **Configure your local setup** (Optional) | [Configure the extension](/docs/configure-dbt-extension) to mirror your dbt environment locally and set any environment variables locally to use the VS Code extension features. |
| **Run  dbt-autofix** (Optional) | If you haven't already installed the "Migrate <Constant name="core"/> to <Constant name="fusion" /> agent skill", you can alternatively [run dbt-autofix](/guides/prepare-fusion-upgrade?step=5#what-the-autofix-tool-handles) to fix any errors and deprecations in your dbt project. |

## Install the extension

To install the dbt VS Code extension, follow these steps in your editor of choice:

1. Navigate to the **Extensions** tab of your editor and search for `dbt`. Locate the extension from the publisher `dbtLabsLLC` or `dbt Labs, LLC`. Click **Install**.
    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="90%" title="Search for the extension"/>
2. Open a dbt project in your VS Code environment if you haven't already. Make sure it is added to your current workspace. If you see a **dbt Extension** label in your editor's status bar, then the extension has installed successfully. You can hover over this **dbt Extension** label to see diagnostic information about the extension.
    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="If you see the 'dbt Extension` label, the extension is activated"/>
3. Once the dbt extension is activated, it will automatically begin downloading the correct dbt Language Server (<Term id="lsp"/>) for your operating system.
    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="The dbt Language Server will be installed automatically"/>
4. If the dbt Fusion engine is not already installed on your machine, the extension will prompt you to download and install it. Follow the steps shown in the notification to complete the installation or [install it manually from the command line](#install-the-dbt-fusion-engine-from-the-command-line-if-you-havent-already).
    <Lightbox src="/img/docs/extension/install-dbt-fusion-engine.png" width="60%" title="Follow the prompt to install the dbt Fusion engine"/>
5. Run the VS Code extension [upgrade tool](#upgrade-to-fusion) to ensure your dbt project is Fusion ready and help you fix any errors and deprecations.
6. (Optional) If you're new to the extension or VS Code/Cursor, you [can set your local environment](/docs/configure-dbt-extension) to mirror your <Constant name="dbt_platform" /> environment and [set any environment variables](/docs/configure-dbt-extension#configure-environment-variables) locally to use the VS Code extension features.

You're all set up with the dbt extension! The next steps are:
- Follow the [getting started](#getting-started) section to begin the terminal onboarding workflow and configure your set up. If you encounter any parsing errors, you can also run the [`dbt-autofix` tool](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) to resolve them.
- <Expandable alt_header="Install the dbt Fusion engine from the command line, if you haven't already." > 
    <FusionManualInstall />
  3. Follow the [getting started](/docs/install-dbt-extension#getting-started) guide to get started with the extension. You can get started using one of these methods:
      - Running `dbtf init` to use terminal onboarding.
      - Running **Run dbt: Register dbt extension** in the command palette.
      - Using the **Get started** button in the extension menu.
  </Expandable>
- [Register the extension](#register-the-extension) with your email address or <Constant name="dbt_platform" /> account to continue using it beyond the trial period.
- Review the [limitations and unsupported features](/docs/fusion/supported-features#limitations) if you haven't already.

## Getting started

Once the <Constant name="fusion_engine"/> and dbt VS Code extension have been installed in your environment, the dbt logo will appear in the sidebar. Click it to open the **Get started** panel.

The **Get started** panel is a persistent, always-on setup companion available in both VS Code and Cursor.  It continuously monitors your environment and surfaces the single most important next action. As new <Constant name="fusion" /> releases ship or your project changes, the panel resurfaces relevant steps automatically.

<Lightbox src="/img/docs/extension/vsce-get-started.png" width="100%" title="The Get started panel in VS Code showing the four setup steps, with the active step highlighted as an orange CTA button."/>

The panel guides you through four setup steps in order, showing only what's relevant to your current state:

1. **Install or update <Constant name="fusion_engine" />**: Detects whether the <Constant name="fusion_engine" /> binary is missing or outdated and installs or updates it with a single click.
2. **Open project**: Checks for a `dbt_project.yml` file in your workspace to confirm a valid dbt project is open before proceeding.
3. **Check Fusion compatibility**: Guides you through upgrading your project to <Constant name="fusion" />. When you click this step, you can choose between two paths:
    - **Start with an agent**: Installs the **Migrate <Constant name="core" /> to <Constant name="fusion" />** agent skill to your editor's skill folder
        - This opens your AI chat (dbt Copilot or Cursor) with a migration prompt pre-filled. 
        - A notification will confirm: _"We'll install the Migrate <Constant name="core" /> to <Constant name="fusion" /> agent skill to the editor's skill folder. Then we'll open your AI chat with a prompt to start the migration."_
        - Click **Install & open chat** to proceed &mdash; the chat opens with the prompt already loaded, so you just press enter and the agent handles the migration. No CLI commands needed. Requires Copilot or Cursor.
    - **Start manually in CLI**: Runs the <Constant name="fusion" /> upgrade workflow in your terminal. Refer to [Upgrade to <Constant name="fusion" />](#upgrade-to-fusion) for more info.
4. **Register**: Confirms you've registered your email to use the extension beyond the 14-day trial period. See [Register the extension](#register-the-extension).

When all four steps are complete, the panel shows a green **Extension setup complete** button.

<Lightbox src="/img/docs/extension/vsce-get-started-complete.png" width="100%" title="The Get started panel showing Extension setup complete with all four steps checked."/>

## Upgrade to Fusion

:::note

If you are already running the <Constant name="fusion_engine" />, you must be on version `2.0.0-beta.66` or higher to use the upgrade tool.

:::

The dbt extension provides two ways to upgrade your project to <Constant name="fusion" /> from the **Get started** panel:

- **Agentic migration** &mdash; Automatically runs the <Constant name="dbt_core" />-to-<Constant name="fusion" /> migration via dbt Copilot or Cursor without any CLI steps. Select this option in the **Check Fusion compatibility** step of the **Get started** panel. Requires Copilot or Cursor.
- **Manual CLI onboarding** &mdash; Walks you through the upgrade interactively in your terminal. Use this if you prefer the CLI or don't have Copilot or Cursor.

### Manual CLI onboarding

You can manually update your project to <Constant name="fusion" /> in a couple of ways:

- Trigger the manual flow from the **Get started** panel by selecting the **Manual CLI onboarding** option in the **Check Fusion compatibility** step.
- Run the following command in your terminal:

    ```
    dbt init --fusion-upgrade
    ```
    <br />

    <Lightbox src="/img/docs/extension/vsce-manual-upgrade.png" width="100%" title="The dbt extension Get started panel and upgrade assistant." /> 

This starts the upgrade tool and guides you through the <Constant name="fusion" />  upgrade with a series of prompts:
- **Do you have an existing dbt platform account?**: If you answer `Y`, you will be given instructions for downloading your dbt platform profile to register the extension. An `N` answer will skip to the next step.
- **Ready to run a dbtf init?** (If there is no `profiles.yml` file present): You will go through the dbt configuration processes, including connecting to your data warehouse. 
- **Ready to run a dbtf debug?** (If there is an existing `profiles.yml` file): Validates that your project is configured correctly and can connect to your data warehouse.
- **Ready to run a dbtf parse?**: Your dbt project will be parsed to check for compatibility with <Constant name="fusion" />.
    - If any issues are encountered during the parsing, you'll be given the option to run the [dbt-autofix](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) tool to resolve the errors. If you opt to not run the tool during the upgrade processes, you can always run it later or manually fix any errors. However, the upgrade tool cannot continue until the errors are resolved.
        :::tip AI Agents
        There are cases where dbt-autofix may not resolve all errors and requires manual intervention. For those cases, the dbt-autofix tool provides an [AI Agents.md](https://github.com/dbt-labs/dbt-autofix/blob/main/AGENTS.md) file to enable AI agents to help with migration work after dbt-autofix has completed its part.
        :::
- **Ready to run a ‘dbtf compile -static-analysis off’?** (Only runs once the parse passes): Compiles your project without any static analysis, mimicking dbt Core. This compile only renders Jinja into SQL, so <Constant name="fusion" />'s advanced SQL comprehension is temporarily disabled. 
- **Ready to run a ‘dbtf compile’?**: Compiles your project with full <Constant name="fusion" /> static analysis. It checks that your SQL code is valid in the context of your warehouse's tables and columns. 

    <Lightbox src="/img/docs/extension/fusion-onboarding-complete.png" width="70%" title="The message received when you have completed upgrading your project to the dbt Fusion engine." /> 

Once the upgrade is completed, you're ready to dive into all the features that the <Constant name="fusion_engine" /> has to offer!

## Register the extension
After downloading the extension and installing the <Constant name="fusion_engine" />, make sure you’re running the latest version of the dbt VS Code extension and restart VS Code, then register the extension within 14 days of installing (or re-installing) it.

**Key points:**
- The extension is free for organizations for up to 15 users (see the [acceptable use policy](https://www.getdbt.com/dbt-assets/vscode-plugin-aup)).
- Registration links your editor to a dbt account so you can keep using the extension beyond the grace period.
- This _does not_ require a <Constant name="dbt_platform" /> project — just a dbt account.
- If a valid [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file exists on your machine, the extension will automatically use it and skip login.
- If you already have a dbt account (even from years ago), you will be directed into an OAuth sign-in flow.

<Expandable alt_header="Understanding regions">

Most users can sign in from the extension's browser registration page for the default `US1` region. If that works, you have an account in the default region and don't need to consider other [regions](/docs/platform/about-platform/access-regions-ip-addresses).

Use a credential file (`dbt_cloud.yml`) instead of sign-in when:

- You can't sign in.
- Your organization uses a non-default region (`eu1`, `us2`, and so on).
- You prefer file-based credentials.

If you're unsure whether you have a `US1` account from the past, try signing in or using **Forgot password** at [us1.dbt.com](http://us1.dbt.com). If nothing comes up, continue with the [Register with `dbt_cloud.yml`](#register-with-dbt_cloudyml) section.
</Expandable>

#### Choose your registration path

Your dbt VS Code extension registration path depends on your situation. Select the one that applies to you:

- **New to dbt and never created a dbt account?** → Use [First-time registration](#first-time-registration).
- **Have an existing dbt account and can sign in?** → Use [Existing dbt account](#existing-dbt-account).
- **Email already exists or can’t sign in?** (locked, forgot password) → Use [Recover your login](#recover-your-login).
- **Can't sign in or your organization uses a non-default region** (`eu1`, `us2`) → Read the [Register with `dbt_cloud.yml`](#register-with-dbt_cloudyml) section for more information.

### First-time registration

Use this if you've _never_ created a dbt account before. 

1. Click the registration prompt or open the command palette (Ctrl + Shift + P (Windows/Linux) or Cmd + Shift + P (macOS)) and type: **dbt: Register dbt extension**.
   <Lightbox src="/img/docs/extension/registration-prompt.png" width="70%" title="The extension registration prompt in VS Code."/>
2. In the browser registration form, enter your name and email, then click **Continue**.
3. Check your inbox for a verification email and click the verification link.
4. After verification, return to the browser flow to complete sign‑in.
5. You'll return to the editor and see **Registered**.
6. Continue with the [Get started](#getting-started) onboarding workflow and get your dbt project up and running.

**Note:** You do not need a <Constant name="dbt_platform" /> project to register; this only creates your dbt account.

### Existing account sign-in {#existing-dbt-account}

Use this if you have an existing dbt account &mdash; including older or inactive accounts. dbt automatically detects your account and [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file if it exists (no file download needed). Use this to easily work across machines.

1. [Update the VS Code extension](https://code.visualstudio.com/docs/setup/setup-overview#_update-cadence) to the latest version and restart your editor before beginning the registration process.
2. Click the registration prompt or open the command palette and type: **dbt: Register dbt extension.**
3. In the browser registration form, select **Sign in** at the bottom of the form.
4. Enter your email address associated with your dbt account and click **Continue**. If you don't remember your password, see [Recover your login](#recover-your-login) for help.
5. You'll then have the option to select your existing dbt account. If you don't have a dbt account, you will be prompted to create an account instead with your existing dbt user. 
6. Select the account you want to use and click **Continue**.
7. You should see a page confirming your successful registration. Close the tab and go back to your editor to continue the registration.

**When you might still need a [`dbt_cloud.yml`](/reference/dbt_cloud.yml):**
- You want a file-based credential for automations.
- You're on the free Developer plan and your workflow needs a local credential file for defer.
- Your region requires it (for example, regions like `eu1` or `us2`).

#### Recover your login 

Choose this path if the registration form tells you your email already exists but you don't remember your password or your account is locked.

To reset your password and sign in through the OAuth flow:

1. On the sign-in screen, click **Forgot password**.
2. Enter the email associated with your dbt account.
3. Check your inbox and reset your password.
4. Return to the sign in screen in the browser and complete the sign-in process.
5. If you've signed in, you will then have the option to select your existing dbt account.
6. Select the account you want to use and click **Continue**.
7. You should see a page confirming your successful registration. Close the tab and go back to your editor to continue the registration.

**If you still can't sign in:**
- Your account may be locked. Contact [dbt Support](mailto:support@getdbt.com) to unlock.
- After unlocking, continue with the registration flow as described in [Sign in with your existing dbt account](#existing-dbt-account).

### Register with `dbt_cloud.yml` {#register-with-dbt_cloudyml}

Use this if you can't sign in to your dbt account, your org uses a non-default region (`eu1`, `us2`), or your workflow requires a credential file.

1. Log in to <Constant name="dbt_platform" /> and open **Account settings** → **VS Code extension**.
2. In the **Set up your credentials** section, click **Download credentials** to get your [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file.
    <Lightbox src="/img/docs/extension/download-registration-2.png" width="70%" title="Download the dbt_cloud.yml file from your dbt platform account."/>
3. Move the file into your `.dbt` directory (`~/.dbt/dbt_cloud.yml` on macOS/Linux, `C:\Users\[username]\.dbt\` on Windows). Refer to [`dbt_cloud.yml`](/reference/dbt_cloud.yml#download-dbt_cloudyml) for setup steps including how to create the `.dbt` directory.

4. Return to the VS Code editor, open the command palette and type: **dbt: Register dbt extension**.
5. The extension will detect the credential file and you can continue with the registration flow.

**Behavior details:**
- If the [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file exists, it takes precedence over any login flow and the extension uses it automatically.
- If the file is missing, you'll be prompted to sign in or add the file.

## Configure environment variables locally {#configure-environment-variables}

_This section is optional. You only need to configure environment variables locally if your dbt project uses environment variables that are already configured in the dbt platform._

If your dbt project uses environment variables, you can configure them to use the extension's features. See the [Configure environment variables](/docs/configure-dbt-extension) page for more information.

## Troubleshooting
<!-- This anchor is linked from the  VS Code extension. Please do not change it -->

import FusionTroubleshooting from '/snippets/_fusion-troubleshooting.md';

<FusionTroubleshooting />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
