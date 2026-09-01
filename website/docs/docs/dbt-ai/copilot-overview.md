---
title: "dbt Copilot"
id: "copilot-overview"
description: "dbt Copilot is dbt's inline AI assistance experience, providing single-click generation of SQL, documentation, tests, and semantic models."
sidebar_label: "dbt Copilot overview"
tags: [AI, Copilot]
availability:
  surface: platform
  access: paid_plan
  minPlan: starter
---

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';
import CopilotConfigureAiProvider from '/snippets/_copilot-configure-ai-provider.md';

# dbt Copilot

<IntroText>
dbt Copilot helps you generate SQL, documentation, tests, and semantic models in the <Constant name="dbt_platform" />.
</IntroText>

<CopilotWizardDifferences/>


_The earlier version of dbt Copilot in the Studio IDE is available only to a limited set of accounts. dbt Wizard is available to all accounts and is the recommended way to develop with AI in the Studio IDE &mdash; it covers everything dbt Copilot's quick actions did, plus multi-step changes with built-in validation._

## Where to access dbt Copilot

dbt Copilot is available across the following experiences in the <Constant name="dbt_platform" />. Refer to the links for more info on how to use each experience.

- [dbt Copilot in Canvas](/docs/platform/build-canvas-copilot): Build visual models using natural language prompts in <Constant name="canvas" />
- [dbt Copilot in Insights](/docs/dbt-ai/analyst-agent): Chat with your data and get answers powered by the dbt Semantic Layer in <Constant name="insights" />

## Action limits by plan

dbt Copilot usage is metered in actions &mdash; one completed AI request counts as one action. Each plan includes a monthly action allotment per license:

<SimpleTable>
|Plan                       |Actions per month |
|---------------------------|------------------|
|Developer                  | ❌               |
|Starter                    |100               |
|Enterprise                 |5,000             |
|Enterprise+                |10,000            |
</SimpleTable>

Enterprise and Enterprise+ limits don't apply if you [bring your own key (BYOK)](/docs/platform/wizard-byok-platform), since your AI provider bills that usage directly. Legacy Enterprise-tier plans enrolled before May 1, 2025 have a 1,000 action limit.

Refer to [dbt AI usage](/docs/platform/billing/dbt-ai-usage) for what counts as an action, what happens when you hit the limit, and how to check your usage. 

## Configure AI provider for dbt Copilot

You need <Constant name="dbt" /> admin permissions to change account settings and configure providers. dbt Copilot is configured separately from <Constant name="wizard" /> &mdash; for <Constant name="wizard" /> providers, refer to [Manage AI features](/docs/platform/manage-dbt-ai#configure-ai-provider).

<CopilotConfigureAiProvider />

## Considerations

- dbt Copilot is a separate experience from <Constant name="wizard" />. For agentic, full-lifecycle AI development, use [<Constant name="wizard" />](/docs/platform/wizard-overview).
- AI features are enabled by default. Admins can [turn them off or back on anytime](/docs/platform/manage-dbt-ai).
- Certain features are only available on Enterprise and Enterprise+ plans. Refer to [Billing](/docs/platform/billing) for details.
- dbt Copilot doesn't yet support generating semantic models with the latest YAML spec.
