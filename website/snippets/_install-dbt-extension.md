
import FusionManualInstall from '/snippets/_fusion-manual-install.md';


The dbt extension &mdash; available for [VS Code, Cursor](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview), and [Windsurf](https://open-vsx.org/extension/dbtLabsInc/dbt) &mdash; uses the <Constant name="fusion_engine" /> to make dbt development smoother and more efficient. 

:::note

This is the only official dbt Labs VS Code extension. Other extensions _can_ work alongside the dbt VS Code extension, but they aren’t tested or supported by dbt Labs. Read the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements) for the latest updates.

:::

## Prerequisites

Before installing, make sure to review the [Limitations](/docs/fusion/supported-features#limitations) page as some features don't support <Constant name="fusion"/> just yet.

To use the extension, you must meet the following prerequisites:

| Prerequisite | Details |
| --- | --- |
| **<Constant name="fusion_engine" />**  | The [dbt VS Code extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) requires the <Constant name="fusion_engine" /> binary (a small executable program). The extension will prompt you to install it, or you can [install it manually](#install-fusion-manually) at any time. <br /><br />[Register your email](#register-the-extension) within 14 days of installing the dbt extension.  Free for up to 15 users.  |
| **Project files** | - You need a `profiles.yml` configuration file.<br /><br />⁃ Existing <Constant name="dbt_platform" /> users need to [download](#download-the-dbt_cloudyml-file) a `dbt_cloud.yml` file as well as a `profiles.yml` file configured in their dbt project.<br /><br />⁃ Having a <Constant name="dbt_platform" /> user account isn't the same as having a <Constant name="dbt_platform" /> project — you  don't need a <Constant name="dbt_platform" /> project to use the extension. |
| **Editor** | [VS Code](https://code.visualstudio.com/), [Cursor](https://www.cursor.com/en), or [Windsurf](https://windsurf.com/editor) code editor. |
| **Operating systems** | macOS, Windows, or Linux-based computer. |
|  **Configure your local setup** (Optional) | [Configure the extension](/docs/configure-dbt-extension) to mirror your dbt environment locally and set any environment variables locally to use the VS Code extension features. |
| **Run dbt-autofix** (Optional) | [Run dbt-autofix](/docs/dbt-versions/upgrade-dbt-version-in-cloud#dbt-autofix) to fix any errors and deprecations in your dbt project. |

## Install the extension

To install the dbt VS Code extension, follow these steps in your editor of choice:

1. Navigate to the **Extensions** tab of your editor and search for `dbt`. Locate the extension from the publisher `dbtLabsInc` or `dbt Labs Inc`. Click **Install**.
    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="90%" title="Search for the extension"/>
2. Open a dbt project in your VS Code environment if you haven't already. Make sure it is added to your current workspace. If you see a **dbt Extension** label in your editor's status bar, then the extension has installed successfully. You can hover over this **dbt Extension** label to see diagnostic information about the extension.
    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="If you see the 'dbt Extension` label, the extension is activated"/>
3. Once the dbt extension is activated, it will automatically begin downloading the correct dbt Language Server (<Term id="lsp"/>) for your operating system.
    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="The dbt Language Server will be installed automatically"/>
4. If the dbt Fusion engine is not already installed on your machine, the extension will prompt you to download and install it. Follow the steps shown in the notification to complete the installation or [install it manually from the command line](#install-fusion-manually).
    <Lightbox src="/img/docs/extension/install-dbt-fusion-engine.png" width="60%" title="Follow the prompt to install the dbt Fusion engine"/>
5. Run the VS Code extension [upgrade tool](#upgrade-to-fusion) to ensure your dbt project is Fusion ready and help you fix any errors and deprecations.
6. (Optional) If you're new to the extension or VS Code/Cursor, you [can set your local environment](/docs/configure-dbt-extension) to mirror your <Constant name="dbt_platform" /> environment and [set any environment variables](/docs/configure-dbt-extension#configure-environment-variables) locally to use the VS Code extension features.

You're all set up with the dbt extension! The next steps are:
- Follow the [getting started](#getting-started) section to begin the terminal onboarding workflow and configure your set up. If you encounter any parsing errors, you can also run the[`dbt-autofix` tool](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) to resolve them.
- [Install the dbt Fusion engine](#install-fusion-manually) from the command line, if you haven't already.
- [Register the extension](#register-the-extension) with your email address or <Constant name="dbt_platform" /> account to continue using it beyond the trial period.
- Review the [limitations and unsupported features](/docs/fusion/supported-features#limitations) if you haven't already.

#### Install Fusion manually

    <FusionManualInstall />
3. Follow the [getting started](/docs/install-dbt-extension#getting-started) guide to get started with the extension. You can get started by either:
   - Running `dbtf init` to use terminal onboarding,
   - Running **Run dbt: Register dbt extension** in the command palette,
   - Using the **Get started** button in the extension menu.

## Getting started

Once the <Constant name="fusion_engine"/> and dbt VS Code extension have been installed in your environment, the dbt logo will appear on the sidebar. From here, you can access workflows to help you get started, offers information about the extension and your dbt project, and provides helpful links to guide you. For more information, see the [the dbt extension menu](/docs/about-dbt-extension#the-dbt-extension-menu) documentation. 

You can get started with the extension a couple of ways: 
- Running `dbtf init` to use the terminal onboarding,
- Opening **Run dbt: Register dbt extension** in the command palette,
- Using the **Get started** button in the extension menu.

The following steps explain how to get started using the **Get started** button in the extension menu:

1. From the sidebar menu, click the dbt logo to open the menu and expand the **Get started** section. 
2. Click the **dbt Walkthrough** status bar to view the welcome screen.
    <Lightbox src="/img/docs/extension/welcome-screen.png" width="80%" title="dbt VS Code extension welcome screen."/>
3. Click through the items to get started with the extension:
    - **Open your dbt project:** Launches file explorer so you can select the dbt project you want to open with Fusion.
    - **Check Fusion compatibility:** Runs the [Fusion upgrade](#upgrade-to-fusion) workflows to bring your project up-to-date. If you encounter any parsing errors, you can also run the[`dbt-autofix` tool](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) to resolve them.
    - **Explore features:** Opens the [documentation](/docs/about-dbt-extension) so you can learn more about all the extension has to offer.
    - **Register:** Launches the registration workflow so you can continue to use the extension beyond the trial period.

## Upgrade to Fusion

:::note

If you are already running the <Constant name="fusion_engine" />, you must be on version `2.0.0-beta.66` or higher to use the upgrade tool.

:::

The dbt extension provides a built-in upgrade tool to walk you through the process of configuring <Constant name="fusion" />  and updating your dbt project to support all of its features and fix any deprecated code. To start the process:

1. From the VS Code sidebar menu, click the **dbt logo**.
2. In the resulting pane, open the **Get started** section and click the **Get started** button. 

    <Lightbox src="/img/docs/extension/fusion-onboarding-experience.png" width="80%" title="The dbt extension help pane and upgrade assistant." /> 

You can also manually start this process by opening a CLI window and running: 

```
dbt init --fusion-upgrade
```

This will start the upgrade tool and guide you through the Fusion upgrade with a series of prompts:
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

Users must complete registration within 14 days of installing the dbt extension. There are two ways to register:

- [Don't have a dbt account?](#new-user-registration) &mdash; Follow the VS Code [“get started”](/docs/install-dbt-extension#getting-started) workflow to register and verify your email. For the initial installation, you only need to provide your name and email address to complete the registration. Subsequent installations will require you to complete the entire [dbt account registration process](#accessing-your-dbt-account) to use the extension. 
- [Returning user or existing <Constant name="dbt_platform" /> user?](#register-with-an-existing-dbt-account) &mdash; If you have an existing <Constant name="dbt_platform" /> or previously created one in the past (whether expired or active), no need to register! Just log in with the same email to prevent duplicate accounts. If you can't log in or if it's locked, reach out to [dbt Support](mailto:support@getdbt.com) to have it unlocked or reset before logging in.

The VS Code extension is free for organizations for up to 15 users. See the [acceptable use policy](https://www.getdbt.com/dbt-assets/vscode-plugin-aup) for more information.

### New user registration

If you do not already have a dbt account, you'll need to get registered. This only takes a minute!
1. Click the registration prompt in your editor.
     <Lightbox src="/img/docs/extension/registration-prompt.png" width="70%" title="The extension registration prompt in VS Code."/>
2. Accept any prompts to open the link in your browser.
3. Fill out the registration form, then click **Continue**.
    <Lightbox src="/img/docs/extension/registration-screen.png" width="70%" title="The extension registration page in the browser."/>
4. You will receive an email with a verification link. Once you click it, your registration is complete!

### Accessing your dbt account

Registering to use the dbt extension makes it easy to create a full dbt account. You can follow these
steps to finish setting up your account (_Note: This is not required to use the dbt extension_).

1. Navigate to [us1.dbt.com](https://us1.dbt.com) and click **Forgot password?**.
2. Enter the email address you used for your dbt extension registration and click **Continue**.
3. Check your email for a verification link and follow the password reset instructions to set a password for your account.

Now that you have activated your dbt developer account, you can access features of the <Constant name="dbt_platform" />. You can also re-download your registration key using the steps outlined in [Register with an existing dbt account](#register-with-an-existing-dbt-account) if you need to set up the dbt extension on a new machine.

### Register with an existing dbt account 
<!-- This anchor is linked from the VS Code registration page. Please do not change it -->

During the VS Code extension registration workflow it can detect if you already have a <Constant name="dbt_platform" /> account or previously created one in the past (no need to create a new one!). 
- If you already have a <Constant name="dbt_platform" /> account, you will need to use the same account to connect the extension. 
- If you've never created a <Constant name="dbt_platform"/> account, skip this section and follow the earlier [New user registration](#new-user-registration) steps.
- The extension will use the `dbt_cloud.yml` file from your <Constant name="dbt_platform"/> account, which securely stores your <Constant name="dbt_platform"/> account credentials for authentication. You can download this file from your <Constant name="dbt_platform"/>'s **Account settings** page.

#### How the registration works
- If a `dbt_cloud.yml` file already exists in your `~/.dbt/` (macOS/Linux) or `C:\Users\[username]\.dbt` (Windows) folder, the extension automatically detects it in the registration flow and uses it.
- If you don’t have the file yet, you’ll need to download it from the <Constant name="dbt_platform"/>.

#### Download the `dbt_cloud.yml` file

Follow these steps to download the `dbt_cloud.yml` file:

1. Log into <Constant name="dbt_platform" /> and click your account name at the bottom left. 
   - If you can't login, follow the [accessing your dbt account](#accessing-your-dbt-account) steps.
2. Click **Account settings**.
3. Under **Your profile**, click **VS Code Extension**.
4. In the **Set up your credentials** section, click **Download credential**s to download the `dbt_cloud.yml` file.
5. Download the `dbt_cloud.yml` file to complete registration.
<Lightbox src="/img/docs/extension/download-registration-2.png" width="70%" title="Download the dbt_cloud.yml file to complete registration."/>

6. Move the downloaded `dbt_cloud.yml` file to your dbt directory:
    - macOS/Linux: `~/.dbt/`
    - Windows: `C:\Users\[username]\.dbt\`

For detailed instructions on how to create a `.dbt` directory and move the file, see [this FAQ](#how-to-create-a-dbt-directory-in-root-and-move-dbt_cloudyml-file).
7. Then go back to VS Code and open the command palette (`Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (macOS)).  
8. Run `dbt: Register dbt extension` to complete registration.
9. If you run into any issues, reach out to [support](/docs/dbt-support) &mdash; we're here to help!

## Configure environment variables locally {#configure-environment-variables}

_This section is optional. You only need to configure environment variables locally if your dbt project uses environment variables that are already configured in the dbt platform._

If your dbt project uses environment variables, you can configure them to use the extension's features. See the [Configure environment variables](/docs/configure-dbt-extension) page for more information.

## Troubleshooting
<!-- This anchor is linked from the  VS Code extension. Please do not change it -->

import FusionTroubleshooting from '/snippets/_fusion-troubleshooting.md';

<FusionTroubleshooting />

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
