
The [dbt extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) for VS Code and Cursor, powered by the <Constant name="fusion_engine" />, streamlines dbt development workflows. 

## Prerequisites

To use the extension, you must meet the following prerequisites:

- <Constant name="fusion_engine" /> &mdash; The [dbt extension](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview) requires the <Constant name="fusion_engine" />. Installing the extension prompts for installation of the <Constant name="fusion_engine" />. You can also [manually install](/docs/fusion/install-fusion) it at any time, before or after installing the extension.
- Editor &mdash; You're using the [VS Code](https://code.visualstudio.com/) or [Cursor](https://www.cursor.com/en) code editor.
- Operating systems &mdash; You're using a macOS, Windows, or Linux-based computer. 

## Installation instructions

:::note

This is the only official dbt Labs VS Code extension. Other extensions _can_ work alongside the dbt VS Code extension, but they aren’t tested or supported by dbt Labs.

Read the [Fusion Diaries](https://github.com/dbt-labs/dbt-fusion/discussions/categories/announcements) for the latest updates.

::: 

In VS Code:

1. Navigate to the **Extensions** tab of your editor and search for `dbt`. Locate the extension from the publisher `dbtLabsInc` or `dbt Labs Inc`. Click **Install**.
    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="60%" title="Search for the extension"/>
2. Open a dbt project in your VS Code environment if you haven't already. Make sure it is added to your current workspace. If you see a **dbt Extension** label in your editor's status bar, then the extension has installed successfully. You can hover over this **dbt Extension** label to see diagnostic information about the extension.
    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="If you see the 'dbt Extension` label, the extension is activated"/>
3. Once the dbt extension is activated, it will automatically begin downloading the correct dbt Language Server for your operating system.
    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="The dbt Language Server will be installed automatically"/>
4. If the dbt Fusion engine is not already installed on your machine, the extension will prompt you to download and install it. Follow the steps shown in the notification to complete the installation.
    <Lightbox src="/img/docs/extension/install-dbt-fusion-engine.png" width="60%" title="Follow the prompt to install the dbt Fusion engine"/>
5. Run the VS Code extension [upgrade tool](#upgrade-to-fusion) to ensure your dbt project is Fusion ready and help you fix any errors and deprecations.
6. You're all set up! See [about the dbt extension](/docs/about-dbt-extension) for more information on how to use the dbt extension.
    <Lightbox src="/img/docs/extension/kitchen-sink.png" width="60%" title="Showing lineage and compiled code in the extension"/>

## Getting started

Once the dbt VS Code extension has been installed in your environment, the dbt logo will appear on the sidebar. From here, you can access workflows to help you get started, offers information about the extension and your dbt project, and provides helpful links to guide you. For more information, see the [the dbt extension menu](/docs/about-dbt-extension#the-dbt-extension-menu) documentation. 

To get started with the extension:
1. From the sidebar menu, click the dbt logo to open the menu and expand the **Get started** section. 
2. Click the **dbt Walkthrough** status bar to view the welcome screen.
    <Lightbox src="/img/docs/extension/welcome-screen.png" width="60%" title="dbt VS Code extension welcome screen."/>
3. Click through the items to get started with the extension:
    - **Open your dbt project:** Launches file explorer so you can select the dbt project you want to open with Fusion.
    - **Check Fusion compatibility:** Runs the [Fusion upgrade](#upgrade-to-fusion) workflows to bring your project up-to-date.
    - **Explore features:** Opens the [documentation](/docs/about-dbt-extension) so you can learn more about all the extension has to offer.
    - **Register:** Launches the registration workflow so you can continue to use the extension beyond the trial period.


## Upgrade to Fusion

:::note

If you are already running the <Constant name="fusion_engine" />, you must be on version `2.0.0-beta.66` or higher to use the upgrade tool.

:::

The dbt extension provides a built-in upgrade tool to walk you through the process of configuring <Constant name="fusion" />  and updating your dbt project to support all of its features and fix any deprecated code. To start the process:

1. From the VS Code sidebar menu, click the **dbt logo**.
2. In the resulting pane, open the **Get started** section and click the **Get started** button. 

    <Lightbox src="/img/docs/extension/fusion-onboarding-experience.png" title="The dbt extension help pane and upgrade assistant." width="60%" /> 

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

    <Lightbox src="/img/docs/extension/fusion-onboarding-complete.png" title="The message received when you have completed upgrading your project to the dbt Fusion engine." width="60%" /> 

Once the upgrade is completed, you're ready to dive into all the features that the <Constant name="fusion_engine" /> has to offer!

## Register the extension

Users must complete registration within 14 days of installing the dbt extension. There are two ways to register:

- Users without an existing dbt account can register quickly and easily through an online registration form. For the initial installation, you only need to provide your name and email address to complete the registration. Subsequent installations will require you to complete the entire [dbt account registration process](#accessing-your-dbt-account) to use the extension. 
- Users with an existing dbt account can connect their account using a `dbt_cloud.yml` credentials file.

The VS Code extension is free for organizations for up to 15 users.

### New user registration

If you do not already have a dbt account, you'll need to get registered. This only takes a minute!
1. Click the registration prompt in your editor.
     <Lightbox src="/img/docs/extension/registration-prompt.png" width="60%" title="The extension registration prompt in VS Code."/>
2. Accept any prompts to open the link in your browser.
3. Fill out the registration form, then click **Continue**.
    <Lightbox src="/img/docs/extension/registration-screen.png" width="60%" title="The extension registration page in the browser."/>
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

If you already have a dbt account, you do not need to re-register to use the dbt extension. The dbt extension can authenticate with the dbt platform using a `dbt_cloud.yml` file. If this file is present in your `~/.dbt/` folder, then the registration flow will automatically attempt to use this
file during registration. If you do not have a `~/.dbt/dbt_cloud.yml` file downloaded, refer to the following instructions:

<Expandable alt_header="For dbt accounts with Fusion enabled">

1. Log in to your dbt account.
2. Click your account name at the bottom of the left-side menu and click **Account settings**.
3. Under the **Your profile** section, click **VS Code Extension**. 
4. In the **Set up your credentials** section, click **Download credentials**. This downloads the `dbt_cloud.yml` file. 
    <Lightbox src="/img/docs/extension/download-registration-2.png" width="60%" title="Download the dbt_cloud.yml file to complete registration."/>
5. Move the downloaded `dbt_cloud.yml` file to your `~/.dbt/` directory.
6. To update your registration in VS Code, open the command palette (`ctrl+shift+P` (Windows/Linux) or `cmd+shift+p` (macOS)), then select `dbt: Register dbt extension` to complete the registration.

</Expandable>

<Expandable alt_header="For dbt accounts without Fusion enabled">

1. Log in to your dbt account.
2. Click your account name at the bottom of the left-side menu and click **Account settings**.
3. Under the **Your profile** section, click **CLI**. 
4. In the **Configure Cloud authentication** section, click **Download CLI configuration file**. This downloads the `dbt_cloud.yml` file. 
    <Lightbox src="/img/docs/extension/download-registration.png" width="60%" title="Download the dbt_cloud.yml file to complete registration."/>
5. Move the downloaded `dbt_cloud.yml` file to your `~/.dbt/` directory.
6. To update your registration in VS Code, open the command palette (`ctrl+shift+P` (Windows/Linux) or `cmd+shift+p` (macOS)), then select `dbt: Register dbt extension` to complete the registration.

</Expandable>

## Troubleshooting
<!-- This anchor is linked from the  VS Code extension. Please do not change it -->

#### dbt platform configurations

If you're a cloud-based dbt platform user who has the `dbt-cloud:` config in the `dbt_project.yml` file and are also using [dbt Mesh](/docs/mesh/about-mesh), you must have the project ID configured:

```yaml
dbt-cloud:
  project-id: 12345 # Required
```

If you don’t configure this correctly, cross-platform references will not resolve properly, and you will encounter errors executing dbt commands.

#### General troubleshooting tips

If the dbt extension has activated successfully, you will see the `dbt Extension` label in the status bar at the bottom left of your editor. You can view diagnostic information about the dbt extension by clicking the **dbt Extension** button.

If the dbt extension label is not present, then it is likely that the dbt extension was not installed successfully. If this happens, try uninstalling the extension, restarting your editor, and then reinstalling the extension.

Note: It is possible to "hide" status bar items in VS Code. Double-check if the **dbt Extension** status bar label is hidden by right-clicking on the status bar in your editor. If you see **dbt Extension** in the right-click menu, then the extension has installed successfully.

#### Missing dbt LSP features

If you are not seeing dbt LSP features in your editor, first consult the general troubleshooting steps above. If you have confirmed that the dbt extension is installed correctly, but you still do not see dbt Language Server features (for example, autocomplete, go-to-definition, hover text):
 - Check the version of your dbt extension on the extensions page in your editor. Ensure that you are using the latest available version of the dbt extension.
 - Try reinstalling the dbt Language Server by pressing `cmd+shift+P` (macOS) or `ctrl+shift+P` (Windows/Linux) and selecting the `dbt: Reinstall dbt LSP` command.

#### Unsupported dbt version

If you see an error message indicating that your version of dbt is unsupported, then there is likely a problem with your environment.
- Check the **dbt Path** setting in your VS Code settings. If this path is set, ensure that it is pointing to a valid <Constant name="fusion_engine" />  executable.
- If necessary, you can also install the <Constant name="fusion_engine" />  directly using these instructions: [Install the Fusion CLI](/docs/fusion/install-fusion).

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />
