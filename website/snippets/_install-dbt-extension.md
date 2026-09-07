
import FusionManualInstall from '/snippets/_fusion-manual-install.md';

The dbt extension &mdash; available for [VS Code and Cursor](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview), and [Windsurf](https://open-vsx.org/extension/dbtLabsInc/dbt) &mdash; makes dbt development smoother and more efficient. dbt v1 and v2 both support the extension &mdash; refer to [Version compatibility](/docs/about-dbt-extension#version-compatibility) for which features need which setup.

:::note

This is the only official dbt Labs VS Code extension. Other extensions _can_ work alongside the dbt VS Code extension, but they aren't tested or supported by dbt Labs. Read the [Fusion Diaries](https://github.com/dbt-labs/dbt-core/discussions/categories/announcements?discussions_q=is:open+diaries+category:Announcements) for the latest updates.

:::

## Prerequisites


To use the extension, you need the following:

<SimpleTable>

| Prerequisite | Details |
| --- | --- |
| **Project files** | You need a `profiles.yml` file. You may also need a [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file for some <Constant name="dbt_platform" /> features or credential-based workflows. You don't need a <Constant name="dbt_platform" /> project to use the extension. |
| **Editor** | [VS Code](https://code.visualstudio.com/), [Cursor](https://www.cursor.com/en), or [Windsurf](https://windsurf.com/editor). |
| **Operating system** | macOS, Windows, or Linux. |
| **Local configuration** (optional) | [Configure the extension](/docs/configure-dbt-extension) to mirror your dbt environment locally and set any environment variables required by your project. |
| **Project migration support** (optional) | The extension has [dbt-autofix](https://github.com/dbt-labs/dbt-autofix) built in, so you can fix deprecations from the **Problems** pane or in a single pull request. You can also use the **Migrate dbt v1 to dbt v2** agent skill or [run dbt-autofix](/guides/prepare-dbt-upgrade?step=5#what-the-autofix-tool-handles) yourself. |

</SimpleTable>

## Install the extension

1. In your editor, open the **Extensions** tab and search for `dbt`.
2. Locate the extension from the publisher `dbtLabsInc` or `dbt Labs Inc`, then click **Install**.

    <Lightbox src="/img/docs/extension/extension-marketplace.png" width="90%" title="Search for the extension"/>

3. Open a dbt project in your editor. Make sure the project is added to your current workspace.
4. Confirm that the extension is active by checking for the **dbt Extension** label in the status bar. Hover over the label to view diagnostic information.

    <Lightbox src="/img/docs/extension/dbt-extension-statusbar.png" width="60%" title="If you see the 'dbt Extension' label, the extension is activated"/>

5. After the extension activates, it automatically downloads the correct dbt Language Server (<Term id="lsp"/>) for your operating system.

    <Lightbox src="/img/docs/extension/extension-lsp-download.png" width="60%" title="The dbt Language Server will be installed automatically"/>

6. If dbt isn't installed, the extension prompts you to download and install it. Follow the notification steps, or [install it manually from the command line](#install-dbt-v2-from-the-command-line-if-you-havent-already).

    <Lightbox src="/img/docs/extension/install-dbt-fusion-engine.png" width="60%" title="Follow the prompt to install v2"/>

7. Run the VS Code extension [upgrade tool](/docs/upgrade-to-dbt-extension) to check whether your project is ready for dbt v2 and fix any errors or deprecations.
8. Optional: [Configure your local environment](/docs/configure-dbt-extension) to mirror your <Constant name="dbt_platform" /> environment and [set environment variables](/docs/configure-dbt-extension#configure-environment-variables) required by your project.

:::note The language server ships with dbt v2

The dbt language server is part of the dbt v2 binary rather than a separate download &mdash; the extension runs it through dbt v2. If you install v2 manually (for example, in an air-gapped environment) instead of letting the extension manage it, use the [version compatibility matrix](/docs/dbt-versions/dbt-version-compatibility) to pick a binary that matches your extension version.

:::

You're ready to use the dbt extension. Next, you can:

- Follow the [getting started](#getting-started) workflow to finish setup.
- [Upgrade your project to dbt v2](/docs/upgrade-to-dbt-extension) if you're migrating from dbt v1.
- [Sign in or register](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account to keep using advanced features after the 14-day trial.
- Review the [limitations and unsupported features](/docs/dbt/supported-features#limitations).

<Expandable alt_header="Install dbt v2 from the command line, if you haven't already.">

<FusionManualInstall />

After installation, follow the [getting started](#getting-started) workflow. You can get started by:

- Running `dbt init --fusion-upgrade` to start terminal onboarding.
- Running **dbt: Register dbt extension** from the command palette.
- Selecting **Get started** from the extension menu.

</Expandable>

## Getting started

After v2 and the dbt VS Code extension are installed, the dbt logo appears in the sidebar. Click it to open the **Get started** panel.

The **Get started** panel is a persistent setup companion available in VS Code and Cursor. It monitors your environment and shows the most important next action. As new dbt v2 releases ship or your project changes, the panel resurfaces relevant steps automatically. For more details refer to [Upgrade to dbt v2](/docs/upgrade-to-dbt-extension).

<Lightbox src="/img/docs/extension/vsce-get-started.png" width="100%" title="The Get started panel in VS Code showing the setup steps, with the active step highlighted."/>

The panel guides you through:

1. **Install or update dbt v2**: Detects whether the dbt v2 binary is missing or outdated and installs or updates it with a single click.
2. **Open project**: Checks for a `dbt_project.yml` file in your workspace to confirm a valid dbt project is open before proceeding.
3. **Check dbt v2 compatibility**: Guides you through upgrading your project to dbt v2. You can choose between an agentic migration or manual CLI onboarding &mdash; refer to [Upgrade to dbt v2](/docs/upgrade-to-dbt-extension).
4. **Register**: Confirms you've registered your email to use the extension beyond the 14-day trial period &mdash; refer to [Sign in or register](/docs/sign-in-dbt-extension).

When all setup steps are complete, the panel shows a green **Extension setup complete** button.

<Lightbox src="/img/docs/extension/vsce-get-started-complete.png" width="100%" title="The Get started panel showing Extension setup complete with all four steps checked."/>
