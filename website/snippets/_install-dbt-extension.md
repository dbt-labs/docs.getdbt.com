
import FusionManualInstall from '/snippets/_fusion-manual-install.md';

The dbt extension &mdash; available for [VS Code and Cursor](https://marketplace.visualstudio.com/items?itemName=dbtLabsInc.dbt&ssr=false#overview), and [Windsurf](https://open-vsx.org/extension/dbtLabsInc/dbt) &mdash; uses the <Constant name="fusion_engine" /> to make dbt development smoother and more efficient.

The dbt VS Code extension is compatible with the <Constant name="fusion_engine" />. It isn't compatible with <Constant name="core" />.

:::note

This is the only official dbt Labs VS Code extension. Other extensions _can_ work alongside the dbt VS Code extension, but they aren't tested or supported by dbt Labs. Read the [Fusion Diaries](https://github.com/dbt-labs/dbt-core/discussions/categories/announcements?discussions_q=is:open+diaries+category:Announcements) for the latest updates.

:::

## Prerequisites

Before installing, review the [limitations](/docs/dbt/supported-features#limitations) page because some features don't support <Constant name="fusion" /> yet.

To use the extension, you need the following:

<SimpleTable>

| Prerequisite | Details |
| --- | --- |
| **<Constant name="fusion_engine" />** | The dbt VS Code extension requires the <Constant name="fusion_engine" /> binary. The extension prompts you to install it, or you can [install it manually](#install-the-dbt-fusion-engine-from-the-command-line-if-you-havent-already). |
| **Project files** | You need a `profiles.yml` file. You may also need a [`dbt_cloud.yml`](/reference/dbt_cloud.yml) file for some <Constant name="dbt_platform" /> features or credential-based workflows. You don't need a <Constant name="dbt_platform" /> project to use the extension. |
| **Editor** | [VS Code](https://code.visualstudio.com/), [Cursor](https://www.cursor.com/en), or [Windsurf](https://windsurf.com/editor). |
| **Operating system** | macOS, Windows, or Linux. |
| **Local configuration** (optional) | [Configure the extension](/docs/configure-dbt-extension) to mirror your dbt environment locally and set any environment variables required by your project. |
| **Project migration support** (optional) | Use the **Migrate <Constant name="core" /> to <Constant name="fusion" />** agent skill or [run dbt-autofix](/guides/prepare-fusion-upgrade?step=5#what-the-autofix-tool-handles) to help resolve errors and deprecations before using <Constant name="fusion" />. |

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

6. If the <Constant name="fusion_engine" /> isn't installed, the extension prompts you to download and install it. Follow the notification steps, or [install it manually from the command line](#install-the-dbt-fusion-engine-from-the-command-line-if-you-havent-already).

    <Lightbox src="/img/docs/extension/install-dbt-fusion-engine.png" width="60%" title="Follow the prompt to install the dbt Fusion engine"/>

7. Run the VS Code extension [upgrade tool](/docs/upgrade-to-fusion-extension) to check whether your project is ready for <Constant name="fusion" /> and fix any errors or deprecations.
8. Optional: [Configure your local environment](/docs/configure-dbt-extension) to mirror your <Constant name="dbt_platform" /> environment and [set environment variables](/docs/configure-dbt-extension#configure-environment-variables) required by your project.

:::note The language server ships with the Fusion engine

The dbt language server is part of the <Constant name="fusion_engine" /> binary rather than a separate download &mdash; the extension runs it through <Constant name="fusion" />. If you install <Constant name="fusion" /> manually (for example, in an air-gapped environment) instead of letting the extension manage it, use the [version compatibility matrix](/docs/dbt-versions/fusion-version-compatibility) to pick a binary that matches your extension version.

:::

You're ready to use the dbt extension. Next, you can:

- Follow the [getting started](#getting-started) workflow to finish setup.
- [Upgrade your project to Fusion](/docs/upgrade-to-fusion-extension) if you're migrating from <Constant name="core" />.
- [Sign in or register](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account to keep using advanced features after the 14-day trial.
- Review the [limitations and unsupported features](/docs/dbt/supported-features#limitations).

<Expandable alt_header="Install the dbt Fusion engine from the command line, if you haven't already.">

<FusionManualInstall />

After installation, follow the [getting started](#getting-started) workflow. You can get started by:

- Running `dbt init --fusion-upgrade` to start terminal onboarding.
- Running **dbt: Register dbt extension** from the command palette.
- Selecting **Get started** from the extension menu.

</Expandable>

## Getting started

After the <Constant name="fusion_engine" /> and dbt VS Code extension are installed, the dbt logo appears in the sidebar. Click it to open the **Get started** panel.

The **Get started** panel is a persistent setup companion available in VS Code and Cursor. It monitors your environment and shows the most important next action. As new <Constant name="fusion" /> releases ship or your project changes, the panel resurfaces relevant steps automatically. For more details refer to [Upgrade to Fusion](/docs/upgrade-to-fusion-extension).

<Lightbox src="/img/docs/extension/vsce-get-started.png" width="100%" title="The Get started panel in VS Code showing the setup steps, with the active step highlighted."/>

The panel guides you through:

1. **Install or update <Constant name="fusion_engine" />**: Detects whether the <Constant name="fusion_engine" /> binary is missing or outdated and installs or updates it with a single click.
2. **Open project**: Checks for a `dbt_project.yml` file in your workspace to confirm a valid dbt project is open before proceeding.
3. **Check Fusion compatibility**: Guides you through upgrading your project to <Constant name="fusion" />. You can choose between an agentic migration or manual CLI onboarding &mdash; refer to [Upgrade to Fusion](/docs/upgrade-to-fusion-extension).
4. **Register**: Confirms you've registered your email to use the extension beyond the 14-day trial period &mdash; refer to [Sign in or register](/docs/sign-in-dbt-extension).

When all setup steps are complete, the panel shows a green **Extension setup complete** button.

<Lightbox src="/img/docs/extension/vsce-get-started-complete.png" width="100%" title="The Get started panel showing Extension setup complete with all four steps checked."/>
