---
title: Upgrade to Fusion
id: upgrade-to-fusion-extension
description: "Upgrade your dbt project to the Fusion engine from the VS Code extension."
sidebar_label: "Upgrade to Fusion"
---

# Upgrade to Fusion <Lifecycle status="preview" />

After [installing the dbt VS Code extension](/docs/install-dbt-extension), use the **Get started** panel to upgrade your project to the <Constant name="fusion_engine" /> if you haven't already done so.

:::note

If you are already running the <Constant name="fusion_engine" />, you must be on version `2.0.0-beta.66` or higher to use the upgrade tool.

:::

The dbt extension provides two ways to upgrade your project to <Constant name="fusion" /> from the **Get started** panel:

- [**Agentic migration**:](#agentic-migration) Runs the <Constant name="core" />-to-<Constant name="fusion" /> migration with <Constant name="copilot" /> or AI agents. Select this option in the **Check Fusion compatibility** step. Requires <Constant name="copilot" /> or AI agents.
- [**Manual CLI onboarding**:](#manual-cli-onboarding) Walks you through the upgrade in your terminal. Use this if you prefer the CLI or don't use <Constant name="copilot" /> or AI agents.

## Agentic migration

1. Select **Start with an agent** from the **Check Fusion compatibility** step.
2. The extension installs the **Migrate <Constant name="core" /> to <Constant name="fusion" />** agent skill to your editor's skill folder, then opens your AI chat with a migration prompt.
3. Click **Install & open chat** to continue. The chat opens with the migration prompt already loaded, so you can run it directly from the editor. No CLI commands are required.

## Manual CLI onboarding

The **Get started** panel has an upgrade assistant that guides you through the upgrade process in your terminal.

    <Lightbox src="/img/docs/extension/vsce-manual-upgrade.png" width="100%" title="The dbt extension Get started panel and upgrade assistant." />

You can start manual onboarding in either of the following ways:

<Tabs>
<TabItem value="panel" label="From the Get started panel">

- From the **Get started** panel, select **Start manually in CLI** in the **Check Fusion compatibility** step.
- Follow the prompts in the upgrade assistant to complete the upgrade.
- Run ` dbtf compile` to verify your project is ready for <Constant name="fusion" />.

<Lightbox src="/img/docs/extension/fusion-onboarding-complete.png" width="70%" title="The message received when you have completed upgrading your project to the dbt Fusion engine." />

Once the upgrade is completed, you're ready to dive into all the features that the <Constant name="fusion_engine" /> has to offer!

Next, [sign in or register](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account to keep using advanced features after the 14-day trial.

</TabItem>
<TabItem value="terminal" label="From your terminal">
- From your terminal, run:

    ```shell
    dbt init --fusion-upgrade
    ```

The upgrade tool guides you through a series of prompts:

<Expandable alt_header="Do you have an existing dbt platform account?">

If you answer `Y`, the tool provides instructions for downloading your dbt platform profile or authenticating. If you answer `N`, the flow continues to local project setup.

</Expandable>

<Expandable alt_header="Ready to run dbt init?">

If no `profiles.yml` file is present, the tool guides you through creating one and connecting to your data warehouse.
</Expandable>

<Expandable alt_header="Ready to run dbt debug?">

If a `profiles.yml` file exists, the tool validates that your project is configured correctly and can connect to your data warehouse.

</Expandable>

<Expandable alt_header="Ready to run dbt parse?">

The tool parses your dbt project to check compatibility with <Constant name="fusion" />.
  - If parsing fails, the tool can run [dbt-autofix](https://github.com/dbt-labs/dbt-autofix?tab=readme-ov-file#installation) to help resolve errors.
  - If you skip dbt-autofix, you can run it later or manually fix errors. The upgrade tool can't continue until parsing errors are resolved.

</Expandable>

<Expandable alt_header="Ready to run dbt compile with static analysis off?">

After parsing succeeds, the tool compiles your project without static analysis. This mimics <Constant name="core" /> behavior by rendering Jinja into SQL while temporarily disabling <Constant name="fusion" />'s advanced SQL comprehension.

</Expandable>

    :::tip AI Agents

    There are cases where dbt-autofix may not resolve all errors and requires manual intervention. For those cases, the dbt-autofix tool provides an [AI Agents.md](https://github.com/dbt-labs/dbt-autofix/blob/main/AGENTS.md) file to help AI agents continue the migration work after dbt-autofix has completed its part.

    :::

<Expandable alt_header="Ready to run dbt compile?">

The tool compiles your project with full <Constant name="fusion" /> static analysis. This checks that your SQL code is valid in the context of your warehouse's tables and columns.

    <Lightbox src="/img/docs/extension/fusion-onboarding-complete.png" width="70%" title="The message received when you have completed upgrading your project to the dbt Fusion engine." />

</Expandable>

Once the upgrade is completed, you're ready to dive into all the features that the <Constant name="fusion_engine" /> has to offer!

Next, [sign in or register](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account to keep using advanced features after the 14-day trial.

</TabItem>
</Tabs>

## Next steps

Once you've upgraded your project to <Constant name="fusion" />, you can:

- [Sign in or register](/docs/sign-in-dbt-extension) for a <Constant name="dbt_platform" /> account to keep using advanced features after the 14-day trial.
- [Configure your local environment](/docs/configure-dbt-extension) to mirror your <Constant name="dbt_platform" /> environment and [set environment variables](/docs/configure-dbt-extension#configure-environment-variables) required by your project.
- [Compare changes locally](/docs/fusion/vs-compare-changes) to preview data changes caused by your local edits.
- Review the [limitations and unsupported features](/docs/fusion/supported-features#limitations).
