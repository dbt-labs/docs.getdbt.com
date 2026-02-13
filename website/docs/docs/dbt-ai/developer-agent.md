---
title: "Developer agent"
id: "developer-agent"
description: "Generate and refactor dbt models using the Developer agent in dbt Studio with natural language, review plans, and validate changes"
sidebar_label: "Developer agent"
tags: [AI, Agents, Studio]
---

# Developer agent <Lifecycle status="beta,managed,managed_plus"/>

<IntroText>
Use the Developer agent to generate or refactor dbt <!--add resource type--> from natural language, review and approve plans, and collaborate with the agent &mdash; all within the <Constant name="cloud_ide" />.
</IntroText>

The Developer agent in [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) creates plans from your natural language prompts, and applies dbt-aware logic. It can generate or refactor dbt models and semantic models, with full auditability for every action. 

The Developer agent is available only in [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) (not in VS Code or the <Constant name="cloud_cli" />).



## Setup and activation

import DeveloperAgentStudioSetup from '/snippets/_developer-agent-studio-setup.md';

<DeveloperAgentStudioSetup/>

## How to write prompts for model generation and refactoring

Effective prompts help the Developer agent produce better plans and code. For guidance on structuring prompts, what to include, and examples for SQL, documentation, tests, and semantic models, see the [Prompt cookbook](/guides/prompt-cookbook).

When asking the agent to generate or refactor models, consider:

- **Scope** &mdash; Specify the model(s), sources, or area of the project (e.g. "staging models for `orders`").
- **Intent** &mdash; Describe the transformation or business logic (e.g. "aggregate by customer and month").
- **Constraints** &mdash; Mention materialization, tests, or naming conventions when relevant.

## Understanding agent-generated plans and approving changes

The Developer agent produces a **plan** before making changes. The plan describes what will be created or updated (models, YAML, semantic models, etc.) and why, based on your prompt and dbt context.

- **Review the plan** &mdash; Check which files and resources will be added or modified.
- **Understand impact** &mdash; Use the agent’s awareness of lineage and metadata to see downstream impact.
- **Approve or edit** &mdash; Approve the plan to let the agent apply changes, or adjust your prompt and regenerate.

<!-- TODO: Add screenshot or UI description of plan view when available -->

## Best practices for prompting the Developer agent

- Be specific about **which part of the project** (e.g. a folder, source, or model set) you want to change.
- Describe **desired outcome** (e.g. "add a monthly rollup" or "add uniqueness tests on `id`").
- Mention **naming or conventions** if your project has standards (e.g. "staging model naming").
- Iterate: review the plan, then refine your prompt if you want different scope or behavior.

For more patterns and examples, see the [Prompt cookbook](/guides/prompt-cookbook).

## When to use the Developer agent vs manual development

| Use the Developer agent when… | Prefer manual development when… |
| ----------------------------- | ------------------------------- |
| You want to quickly scaffold or refactor models from a clear description. | You're doing exploratory or one-off SQL. |
| You want semantic models or tests generated from existing models. | You need fine-grained control over every line. |
| You want to see a plan and impact before applying changes. | The change is trivial or very project-specific. |
| You're working in dbt Studio and want auditable, plan-based changes. | You're in VS Code or CLI (agent not available there). |

## Related docs

- [dbt Agents overview](/docs/dbt-ai/dbt-agents)
- [Develop with dbt Copilot](/docs/cloud/studio-ide/develop-copilot)
- [Prompt cookbook](/guides/prompt-cookbook)
- [Semantic models](/docs/build/semantic-models)
- [About dbt AI and intelligence](/docs/dbt-ai/about-dbt-ai)
