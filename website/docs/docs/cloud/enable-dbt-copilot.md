--- 
title: "Enable dbt Copilot" 
sidebar_label: "Enable dbt Copilot" 
description: "Enable dbt Copilot, an AI-powered assistant, in dbt to speed up your development." 
---

# Enable dbt Copilot <Lifecycle status="self_service,managed,managed_plus" /> 

<IntroText>
Enable <Constant name="copilot" />, an AI-powered assistant, in <Constant name="cloud" /> to speed up your development and focus on delivering quality data.
</IntroText>

This page explains how to enable <Constant name="copilot" /> in <Constant name="cloud" /> to speed up your development and allow you to focus on delivering quality data.

## Prerequisites

- Available in the <Constant name="cloud" /> only.
- Must have a [<Constant name="cloud" /> Starter, Enterprise, or Enterprise+ account](https://www.getdbt.com/pricing).
  - Certain features like [BYOK](#bringing-your-own-openai-api-key-byok), [natural prompts in Canvas](/docs/cloud/build-canvas-copilot), and more are only available on Enterprise and Enterprise+ plans.
- Development environment is on a supported [release track](/docs/dbt-versions/cloud-release-tracks) to receive ongoing updates.
- By default, <Constant name="copilot" /> deployments use a central OpenAI API key managed by dbt Labs. Alternatively, you can [provide your own OpenAI API key](#bringing-your-own-openai-api-key-byok).
- <Constant name="copilot" /> is optimized for OpenAI's `gpt-3.x`, `gpt-4o`, `gpt-4.1-[mini|nano]`, and `gpt-4.5` (deprecated by OpenAI) models. Other models, like `o1` and `o2`, are not supported and will not work with <Constant name="copilot"/>.
- Opt-in to AI features by following the steps in the next section in your **Account settings**.

## Enable dbt Copilot

To opt in to <Constant name="copilot" />, a <Constant name="cloud" /> admin can follow these steps:

1. Navigate to **Account settings** in the navigation menu.
2. Under **Settings**, confirm the account you're enabling.
3. Click **Edit** in the top right corner.
4. Enable the **Enable account access to Copilot features** option.
5. Click **Save**. You should now have <Constant name="copilot" /> AI enabled for use.

Note: To disable (only after enabled), repeat steps 1 to 3, toggle off in step 4, and repeat step 5.

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="90%" title="Example of the 'Enable account access to AI-powered feature' option in Account settings" />

## Bringing your own OpenAI API key (BYOK) <Lifecycle status="managed_plus,managed" /> 

Once AI features have been enabled, you can provide your organization's OpenAI API key. <Constant name="cloud" /> will then leverage your OpenAI account and terms to power <Constant name="copilot" />. This will incur billing charges to your organization from OpenAI for requests made by <Constant name="copilot" />.

Configure AI keys using:
- [dbt Labs-managed OpenAI API key](/docs/cloud/account-integrations?ai-integration=dbtlabs#ai-integrations)
- Your own [OpenAI API key](/docs/cloud/account-integrations?ai-integration=openai#ai-integrations)
- [Azure OpenAI](/docs/cloud/account-integrations?ai-integration=azure#ai-integrations)

For configuration details, see [Account integrations](/docs/cloud/account-integrations#ai-integrations).
