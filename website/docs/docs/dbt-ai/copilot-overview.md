---
title: "dbt Copilot"
id: "copilot-overview"
description: "dbt Copilot is dbt's inline AI assistance experience, providing single-click generation of SQL, documentation, tests, and semantic models."
sidebar_label: "dbt Copilot overview"
tags: [AI, Copilot]
---

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

# dbt Copilot <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>
dbt Copilot helps you generate SQL, documentation, tests, and semantic models in the <Constant name="dbt_platform" />.
</IntroText>

<CopilotWizardDifferences/>

## Where to access dbt Copilot

dbt Copilot is available across the following experiences in the <Constant name="dbt_platform" />. Refer to the links for more info on how to use each experience.

- [dbt Copilot in <Constant name="studio_ide" />](/docs/platform/studio-ide/develop-studio-ai): Generate SQL, documentation, tests, and semantic models with single-click buttons directly in the <Constant name="studio_ide" />
- [dbt Copilot in Canvas](/docs/platform/build-canvas-copilot): Build visual models using natural language prompts in <Constant name="canvas" />
- [dbt Copilot in Insights](/docs/dbt-ai/analyst-agent): Chat with your data and get answers powered by the dbt Semantic Layer in <Constant name="insights" />

## Considerations

- dbt Copilot is a separate experience from <Constant name="wizard" />. For agentic, full-lifecycle AI development, use [<Constant name="wizard" />](/docs/platform/wizard-overview).
- dbt Copilot requires AI features to be [enabled](/docs/platform/enable-dbt-ai) for your account.
- Certain features are only available on Enterprise and Enterprise+ plans. Refer to [Billing](/docs/platform/billing) for details.
- dbt Copilot doesn't yet support generating semantic models with the latest YAML spec.
