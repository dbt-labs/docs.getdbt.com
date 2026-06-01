---
title: "dbt Wizard in Studio IDE"
id: "wizard-ide"
description: "Use dbt Wizard in the Studio IDE to write or refactor dbt models from natural language, validate with your dbt engine, and run against your warehouse with full project context."
sidebar_label: "Wizard in Studio IDE"
tags: [AI, Agents, Studio]
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import WizardIde from '/snippets/_wizard-ide.md';

# dbt Wizard in Studio IDE <Lifecycle status="preview,self_service,managed,managed_plus"/>

<IntroText>
Use <Constant name="wizard" /> in the <Constant name="studio_ide" /> to ship trusted dbt changes faster. It understands your project, answers context-grounded questions, generates models, tests, docs, and <Constant name="semantic_layer" /> definitions, and shows file diffs before changes are persisted.
</IntroText>

:::info
<Constant name="wizard" /> is in preview as of May 6, 2026 for Starter, Enterprise, and Enterprise+ plans. Enterprise and Enterprise+ customers can contact their account manager for access. Starter customers can contact [dbt Labs Support](mailto:support@getdbt.com).
:::

<Constant name="wizard" /> supports the dbt development lifecycle from investigation to review. Use it to:

- Ask project-aware questions using lineage, metadata, and catalog context.
- Build or refactor models from natural-language prompts.
- Generate and validate YAML for tests, documentation, semantic models, and metrics.
- Make scoped edits to logic, names, materializations, tests, and related YAML.
- Investigate job and run failures with dbt Agent Skills.

The agent comes with the following out of the box, meaning no configuration needed:

- [dbt Agent Skills](https://github.com/dbt-labs/dbt-agent-skills): dbt-recommended guidance and instructions, managed by dbt Labs.
- [dbt MCP server Product docs toolset](/docs/dbt-ai/mcp-available-tools#product-docs): Tools for searching and fetching content from dbt's official documentation.

### Prerequisites

- A Starter, Enterprise, or Enterprise+ plan
- A [<Constant name="dbt" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/platform/manage-access/seats-and-users).
- A [development environment](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.
- [Enabled AI features](/docs/platform/enable-dbt-ai) for your account.

<WizardIde />

## Related docs

- [About dbt Wizard in the dbt platform](/docs/platform/wizard-platform)
- [Fusion readiness checklist](/docs/fusion/fusion-readiness)
- [Develop with dbt Wizard](/docs/platform/studio-ide/develop-studio-ai)
- [Prompt cookbook](/guides/prompt-cookbook)
- [Semantic models](/docs/build/semantic-models)
- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai)
