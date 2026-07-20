---
title: "dbt AI FAQs"
sidebar_label: "dbt AI FAQs"
description: "Answers to common questions about dbt AI features, including dbt Wizard and dbt Copilot."
---

import WizardPlatformPreviewDisclaimer from '/snippets/_wizard-platform-preview-disclaimer.md';

# dbt AI FAQs

<IntroText>
Answers to common questions about dbt AI features, including <Constant name="wizard" /> and dbt Copilot.
</IntroText>

<WizardPlatformPreviewDisclaimer />

<Constant name="wizard" /> is an AI-powered assistant fully integrated into your <Constant name="dbt" /> experience that handles the tedious tasks, speeds up workflows, and ensures consistency, helping you deliver exceptional data products faster.

dbt Labs is committed to protecting your privacy and data. This page provides information about how <Constant name="wizard" /> handles your data. For more information, check out the [dbt Labs AI development principles](https://www.getdbt.com/legal/ai-principles) page.

## Overview

<Expandable alt_header="What is dbt Wizard?">

<Constant name="wizard" /> is the latest and recommended agentic experience for governed data development in dbt, available in both the <Constant name="dbt_platform" /> and the terminal CLI. It helps teams ship trusted dbt changes faster and with less risk by understanding project context, routing to the right dbt tools, validating changes, and supporting review before changes are persisted.

Use <Constant name="wizard" /> to investigate lineage and downstream impact, generate or refactor SQL from natural-language prompts, create [documentation](/docs/build/documentation), [data tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), and [semantic models](/docs/build/semantic-models), and validate changes with warehouse awareness.

In the <Constant name="dbt_platform" />, <Constant name="wizard" /> is available in experiences such as the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-studio-ai), [<Constant name="canvas" />](/docs/platform/use-canvas), and [<Constant name="insights" />](/docs/explore/dbt-insights).

In the CLI, you can use <Constant name="wizard" /> from your terminal for local development workflows.

</Expandable>

<Expandable alt_header="Where can I find dbt Wizard?">

<Constant name="wizard" /> is available in the <Constant name="dbt_platform" /> and as a terminal CLI.

- In the platform, you can use <Constant name="wizard" /> in the [<Constant name="studio_ide" />](/docs/dbt-ai/wizard-ide) for governed data development in dbt.
- In the CLI, use the [<Constant name="wizard" /> CLI](/docs/dbt-ai/about-dbt-wizard-cli) for local development and automation.

To use <Constant name="wizard" /> in the platform, you need a <Constant name="dbt" /> [Starter, Enterprise, or Enterprise+ account](https://www.getdbt.com/contact), and an admin must [enable <Constant name="wizard" />](/docs/platform/enable-dbt-ai) for your account.

</Expandable>

<Expandable alt_header="What are the benefits of using dbt Wizard?">

<Constant name="wizard" /> helps teams ship trusted dbt changes faster and with less risk. Use it to:

- Ask project-aware questions and investigate lineage, dependencies, and downstream impact.
- Generate or refactor SQL from natural-language prompts.
- Generate documentation, tests, metrics, and semantic models.
- Validate changes with warehouse awareness before review.
- Review proposed file changes as diffs before they are persisted.

<Constant name="wizard" /> is built into dbt experiences with dbt governance, privacy, and security controls.

</Expandable>

<Expandable alt_header="Is dbt Wizard the same as dbt Copilot?">

No, <Constant name="wizard" /> and dbt Copilot are separate products.

<Constant name="wizard" /> is the new and recommended agentic product available in the <Constant name="dbt_platform" /> and as a CLI. It uses your project context to help you develop governed dbt changes faster. Think of it like a smart AI agent that has a map of your project. Instead of having to read through each file and understand the context, it can answer questions and help you develop _and_ validate your changes faster.

dbt Copilot features include quick-action buttons in <Constant name="studio_ide" />, the Copilot pane in <Constant name="insights" /> and <Constant name="canvas" />.

</Expandable>

<Expandable alt_header="Can I use my existing dbt Copilot action allotment with dbt Wizard?">

Yes, as a temporary compatibility bridge through July 13, 2026 or longer (timeline subject to change).

</Expandable>

## Availability

<Expandable alt_header="Who has access to dbt Wizard?">

**In the <Constant name="dbt_platform" />**:

When enabled by an admin, <Constant name="wizard" /> is available to users with a <Constant name="dbt" /> [developer license](/docs/platform/manage-access/seats-and-users) on [Starter, Enterprise, and Enterprise+ accounts](https://www.getdbt.com/contact).

**In the CLI**:

For <Constant name="wizard" /> CLI, bring your own API key or credentials for a supported provider using [BYOK](/docs/dbt-ai/wizard-byok): OpenAI, Anthropic, Azure AI Foundry, AWS Bedrock, Google Gemini, or Snowflake Cortex (preview). Install and configure the CLI on your local machine. BYOK means any token costs will be billed directly by whichever provider you choose.

Refer to [Use dbt Wizard locally](/docs/dbt-ai/wizard-quickstart) for more information.

</Expandable>

<Expandable alt_header="Is dbt Wizard available for all deployment types?">

Yes, <Constant name="wizard" /> is powered by ai-codegen-api, which is deployed everywhere including [multi-tenant and single-tenant deployments](/docs/platform/about-platform/access-regions-ip-addresses).

</Expandable>

## How it works

<Expandable alt_header="What data/code is used to train the AI model supporting dbt Wizard?">


<Constant name="wizard" /> is supported by several third-party pre-trained AI models at your discretion. (<Term id="managed" /> OpenAI, BYOK OpenAI, BYOK Anthropic, or BYOK Azure AI Foundry). When using <Term id="managed" /> OpenAI, our agreement with OpenAI prohibits OpenAI from retaining your data persistently. Refer to our [dbt Labs AI principles page](https://www.getdbt.com/legal/ai-principles) for more information.


</Expandable>

<Expandable alt_header="Which AI model providers does dbt Wizard use?">

In the <Constant name="dbt_platform" />, <Constant name="wizard" /> supports <Term id="managed" /> OpenAI, BYOK OpenAI, BYOK Anthropic, and BYOK Azure AI Foundry. By default, accounts use <Term id="managed" /> OpenAI. Enterprise-tier accounts can [bring their own provider keys](/docs/platform/enable-dbt-ai#configure-ai-provider).

The [<Constant name="wizard"/> CLI](/docs/dbt-ai/wizard-cli) supports OpenAI, Anthropic, Azure AI Foundry, AWS Bedrock, Google Gemini, and Snowflake Cortex (preview) in bring-your-own-key mode. Refer to [Configure BYOK](/docs/dbt-ai/wizard-byok) and [Supported AI providers](/docs/dbt-ai/wizard-byok#supported-ai-providers) for more information.

</Expandable>

<Expandable alt_header="Do we support BYOK (bring your own key) at the project level?">

In <Constant name="dbt_platform" />, the <Constant name="wizard"/> BYOK option is currently an account-only configuration. However, there may be a future where we make this configurable on a project-level.

<Constant name="wizard" /> CLI supports BYOK locally for OpenAI, Anthropic, Azure AI Foundry, AWS Bedrock, Google Gemini, and Snowflake Cortex (preview). 

</Expandable>

## Privacy and data

<Expandable alt_header="Does dbt Wizard store or use personal data?">

dbt Wizard stores your conversation history, including prompts, responses, and query results returned during a session, so you can revisit past chats. Conversation history is retained for 90 days, and feedback submitted on a dbt Wizard conversation is retained for 400 days. 

You can delete your conversation history or feedback in the product at any time.
You control the information you submit to <Constant name="wizard" />. dbt Labs does not use your prompts, conversation history, command results, or feedback to train AI models.

</Expandable>

<Expandable alt_header="Can dbt Wizard data be deleted upon client written request?">

Yes. Conversation history is retained for 90 days by default, and feedback submitted on a <Constant name="wizard" /> conversation is retained for 400 days. You can delete this information in the product at any time.
If a client identifies personal or sensitive information uploaded to dbt Labs systems, that data can be deleted within 30 days of a written request.

</Expandable>

<Expandable alt_header="Does dbt Labs own the output generated by dbt Wizard?">


dbt Labs will not dispute your ownership of any output (e.g., code or artifacts) that are unique to your company generated when you use <Constant name="wizard" />. Your code will not be used to train AI models for the benefit of dbt Labs or other third parties, including other dbt Labs customers.

</Expandable>

<Expandable alt_header="Does dbt Labs have terms in place?">


dbt Wizard is governed by our [Terms of Use](https://www.getdbt.com/terms-of-use). In the event clients prefer additional terms, clients may enter into the presigned AI & Beta Addendum (the dbt Labs signature will be dated as of the date the client signs). Contact your account manager for more information.

Clients who signed with terms after January 2024 don't need additional terms prior to enabling <Constant name="wizard" />. Longer term clients have also protected their data through confidentiality and data deletion obligations. In the event clients prefer additional terms, clients may enter into the presigned AI & Beta Addendum (the dbt Labs signature will be dated as of the date the client signs).

</Expandable>

## Considerations

<Expandable alt_header="What are the considerations for using dbt Wizard?">

- <Constant name="wizard" /> is not available in the <Constant name="dbt" /> API.

Future releases are planned that may bring <Constant name="wizard" /> to even more parts of the <Constant name="dbt" /> application.

</Expandable>

## dbt Wizard allowlisting URLs

<Expandable alt_header="Allowlisting URLs">

<Constant name="wizard" /> doesn't specifically block AI-related URLs. However, if your organization use endpoint protection platforms, firewalls, or network proxies (such as Zscaler), you may encounter the following issues with <Constant name="wizard" />:

    - Block unknown or AI-related domains.
    - Break TLS/SSL traffic to inspect it.
    - Disallow specific ports or services.

We recommend the following URLs to be allowlisted:

**For <Constant name="wizard" /> in the IDE**:

- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_generic_tests/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_documentation/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_semantic_model/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_inline`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/generate_metrics/...`
- `/api/ide/accounts/${accountId}/develop/${developId}/ai/track_response`

**For dbt Copilot in Canvas**:

- `/api/private/visual-editor/v1/ai/llm-generate`
- `/api/private/visual-editor/v1/ai/track-response`
- `/api/private/visual-editor/v1/files/${fileId}/llm-generate-dag-through-chat`

</Expandable>
