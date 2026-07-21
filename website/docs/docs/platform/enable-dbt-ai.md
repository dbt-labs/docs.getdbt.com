---
title: "Enable AI in dbt platform"
sidebar_label: "Enable AI in dbt platform"
description: "Enable AI features in the dbt platform, including dbt Wizard and dbt Copilot, to speed up your development."
---

import WizardSupportedProviders from '/snippets/_wizard-supported-providers.md';
import WizardConfigureAiProvider from '/snippets/_wizard-configure-ai-provider.md';
import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';
import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

# Enable AI features in <Constant name="dbt_platform" /> <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>
Enable AI features in <Constant name="dbt_platform" /> to speed up your development and focus on delivering quality data.
</IntroText>

You can control AI features in <Constant name="dbt_platform" /> for <Constant name="wizard" /> and dbt Copilot in your **Account settings**.

- **<Constant name="wizard" />**: dbt's innovative and recommended agentic AI layer, available on the <Constant name="dbt_platform" /> and CLI. 
- **dbt Copilot**: Inline AI assistance (code generation, docs, tests, metrics buttons) in <Constant name="studio_ide" />, as well as <Constant name="canvas" /> and <Constant name="insights" />. 

Both experiences are controlled by a single AI toggle in **Account settings**.

<Expandable alt_header="What's the difference between dbt Wizard and dbt Copilot?">

<CopilotWizardDifferences />

</Expandable>

## Prerequisites

- Must have a [<Constant name="dbt_platform account" /> on Starter, Enterprise, or Enterprise+ plans](https://www.getdbt.com/pricing).
  - Certain features like [natural prompts in Canvas](/docs/platform/build-canvas-copilot) are only available on Enterprise and Enterprise+ plans.
- Development environment is on a supported [release track](/docs/dbt-versions/dbt-release-tracks) to receive ongoing updates.
- Opt-in to AI features by following the steps in the next section in your **Account settings**.
- Use a supported AI provider

<Expandable alt_header="See the full list of supported AI providers">

  <WizardSupportedProviders />

  #### dbt Copilot

  dbt Copilot supports different AI providers, including bring your own key (BYOK) for Enterprise and Enterprise+ plans:

  - dbt Labs-<Term id="managed" /> OpenAI API key
  - BYOK OpenAI API key
  - BYOK Azure OpenAI API key

  Snowflake Cortex, AWS Bedrock, Azure AI Foundry, and Anthropic aren't supported for dbt Copilot.

</Expandable>

## Enable AI features

To opt in to AI features, a <Constant name="dbt" /> admin can follow these steps:

1. Navigate to **Account settings** in the navigation menu.
2. Under **Settings**, confirm the account you're enabling.
3. Click **Edit** in the top right corner.
4. Enable the **Enable account access to AI features** option.
5. Click **Save**. You should now have AI features enabled for use.

Note: To disable (only after enabled), repeat steps 1 to 3, toggle off in step 4, and repeat step 5.


## Configure AI provider <Lifecycle status="managed,managed_plus" />

<WizardConfigureAiProvider />

To bring your own key instead of using dbt Labs' managed infrastructure, refer to [Configure BYOK for dbt Wizard in dbt platform](/docs/platform/wizard-byok-platform).

## Try your first prompt

After AI features are enabled, open <Constant name="wizard" /> from the left sidebar in the <Constant name="dbt_platform" />. You can use it from the home tab for an agent-native workflow, or from <Constant name="studio_ide" /> when you want to work alongside the file editor.

Try a prompt such as:

- `summarize what this project does`
- `which models in this project have no tests?`
- `add not_null and unique tests to the primary key of stg_customers`

Use the home tab to investigate, generate, review diffs, and run validations. Use <Constant name="studio_ide" /> when you want direct file control with the editor, console, and file explorer.

## Related docs

- [<Constant name="wizard" /> home tab](/docs/platform/wizard-home)
- [<Constant name="wizard" /> in <Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide)
- [Prompt cookbook](/guides/prompt-cookbook)

<WizardPlatformPreviewDisclaimer />
