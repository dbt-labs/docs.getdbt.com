---
title: Install the dbt VS Code extension
id: install-dbt-extension
description: "Installation instructions for the dbt extension."
sidebar_label: "Install the dbt extension"
---

# Install the dbt VS Code extension <Lifecycle status="beta" />

The dbt extensions for VS Code and Cursor streamlines dbt development workflows. The dbt extension is powered by the dbt Fusion engine.

## Prerequisites

To use the extension, you must meet the following prerequisites:

- The dbt extension requires installation of the dbt Fusion engine. Fusion installation is part of the extension installation process, but you can also [manually install](/docs/fusion/install-fusion) separate from this workflow, either before or after the extension is installed. 
- You are using the [VS Code](https://code.visualstudio.com/) or [Cursor](https://www.cursor.com/en) code editor.
- You are not using (or have disabled) 3rd party dbt extensions.
- You are using a macOS<!--, Windows,--> or Linux-based computer.

## Installation instructions

:::note

This is the only official dbt Labs VS Code extension. Please disable or uninstall any third-party dbt extensions before installing to avoid issues.

:::

import InstallExtension from '/snippets/_install-dbt-extension.md'; 

<InstallExtension/>

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
steps to finish setting up your account (_note: this is not required to use the dbt extension_).

1. Navigate to [us1.dbt.com](https://us1.dbt.com) and click **Forgot password?**.
2. Enter the email address you used for your dbt extension registration and click **Continue**.
3. Check your email for a verification link and follow the password reset instructions to set a password for your account.

Now that you have activated your dbt developer account, you can access features of the dbt platform. You can also re-download your registration key using the steps outlined in [Register with an existing dbt account](#register-with-an-existing-dbt-account) below if you need to set up the dbt extension on a new machine.

### Register with an existing dbt account 

<!-- This anchor is linked from the VS Code registration page. Please do not change it -->

If you already have a dbt account, you do not need to re-register to use the dbt extension. The dbt extension can authenticate with the dbt platform using a `dbt_cloud.yml` file. If this file is present in your `~/.dbt/` folder, then the registration flow will automatically attempt to use this
file during registration. If you do not have a `~/.dbt/dbt_cloud.yml` file downloaded, follow the directions below:

<Expandable alt_header="For dbt accounts with Fusion enabled">

1. Log in to your dbt account.
2. Click your account name at the bottom of the left-side menu and click **Account settings**.
3. Under the **Your profile** section, click **VS Code Extension**. 
4. In the **Set up your credentials** section, click **Download credentials**. This downloads the `dbt_cloud.yml` file. 
    <Lightbox src="/img/docs/extension/download-registration-2.png" width="60%" title="Download the dbt_cloud.yml file to complete registration."/>
5. Move the downloaded `dbt_cloud.yml` file to your `~/.dbt/` directory.
6. To update your registration in VS Code, open the command palette (`ctrl+shift+P` (<!--Windows/-->Linux) or `cmd+shift+p` (macOS)), then select `dbt: Register dbt extension` to complete the registration.

</Expandable>

<Expandable alt_header="For dbt accounts without Fusion enabled">

1. Log in to your dbt account.
2. Click your account name at the bottom of the left-side menu and click **Account settings**.
3. Under the **Your profile** section, click **CLI**. 
4. In the **Configure Cloud authentication** section, click **Download CLI configuration file**. This downloads the `dbt_cloud.yml` file. 
    <Lightbox src="/img/docs/extension/download-registration.png" width="60%" title="Download the dbt_cloud.yml file to complete registration."/>
5. Move the downloaded `dbt_cloud.yml` file to your `~/.dbt/` directory.
6. To update your registration in VS Code, open the command palette (`ctrl+shift+P` (<!--Windows/-->Linux) or `cmd+shift+p` (macOS)), then select `dbt: Register dbt extension` to complete the registration.

</Expandable>

## Troubleshooting
<!-- This anchor is linked from the  VS Code extension. Please do not change it -->

#### General troubleshooting tips

If the dbt extension has activated successfully, you will see the `dbt Extension` label in the status bar at the bottom left of your editor. You can view diagnostic information about the dbt extension by clicking on the **dbt Extension** button.

If the dbt extension label is not present, then it is likely that the dbt extension was not installed successfully. If this happens, try uninstalling the extension, restarting your editor, and then reinstalling the extension.

Note: It is possible to "hide" status bar items in VS Code. Double-check if the **dbt Extension** status bar label is hidden by right-clicking on the status bar in your editor. If you see **dbt Extension** in the right-click menu, then the extension has installed successfully.

#### Missing dbt LSP features

If you are not seeing dbt LSP features in your editor, first consult the general troubleshooting steps above. If you have confirmed that the dbt extension is installed correctly, but you still do not see dbt Language Server features (autocomplete, go-to-definition, hover text, etc):
 - Check the version of your dbt extension on the extensions page in your editor. Ensure that you are using the latest available version of the dbt extension.
 - Try reinstalling the dbt Language Server by pressing `cmd+shift+P` (macOS) or `ctrl+shift+P` (<!--Windows/-->Linux) and selecting the `dbt: Reinstall dbt LSP` command.

#### Unsupported dbt version

If you see an error message indicating that your version of dbt is unsupported, then there is likely a problem with your environment.
- Check the **dbt Path** setting in your VS Code settings. If this path is set, ensure that it is pointing to a valid dbt Fusion engine executable.
- If necessary, you can also install the dbt Fusion engine directly using these instructions: [Install the Fusion CLI](/docs/fusion/install-fusion).

import AboutFusion from '/snippets/_about-fusion.md';

<AboutFusion />