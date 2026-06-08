---
title: "Use subagents with dbt Wizard in the dbt platform"
id: "wizard-platform-subagents"
description: "Delegate work to specialized subagents in dbt Wizard in the dbt platform."
sidebar_label: "Use subagents"
tags: [AI, Wizard]
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Use subagents with <Constant name="wizard" /> in the <Constant name="dbt_platform" /> <Lifecycle status="beta"/>

<IntroText>
Subagents let <Constant name="wizard" /> spin up focused agents to handle parts of a larger task, such as exploring your project, making changes, or reviewing results. <Constant name="wizard"/> orchestrates them and consolidates the results back into your session.
</IntroText>

Use subagents when you can split a task into independent pieces of work. They're useful for reviewing a large pull request, debugging a failed job, adding tests across multiple models, or researching documentation while another agent inspects your project.

For smaller, direct tasks, you usually don't need subagents. Ask a single question, like "What does this model do?" or "Fix this failing test," without splitting the work across agents.

Subagents use more tokens than handling the same task in a single-agent session. Use them when the task benefits from dividing the work.

<WizardFeedbackCallout />

## How subagents work

An agent is a role that describes a type of work, like `explorer`, `worker`, or `test_writer`.

A subagent is a running instance of one of those roles. For example, if you start two explorer agents to answer two different questions, you have two subagents that share the same agent role.

<Constant name="wizard"/> handles orchestration for you. It starts subagents, routes work to them, waits for their results, and consolidates their output into your session.

You can use subagents in the following ways:

<SimpleTable>

| How subagents start | Example |
| ------------------- | ------- |
| You ask to split up the work. | `Review PR #123. Use one agent to map what changed, one to check tests and downstream impact, and one to look up the relevant dbt docs.` |
| <Constant name="wizard"/> automatically uses a configured agent because your task matches that agent's description. | `Add tests for stg_customers and check whether similar staging models are missing tests.` |

</SimpleTable>

## Built-in agents

<Constant name="wizard"/> ships with built-in agents that it can spawn without any configuration. Several are purpose-built for dbt work:

<SimpleTable>

| Agent | What it's for | Example |
|-------|---------------| ------- |
| `explorer` | Answers specific, well-scoped questions about your project. Fast and read-only &mdash; spawn several in parallel for independent questions. | `Use explorer to explain what depends on fct_orders.` |
| `worker` | Performs execution and production work, such as implementing part of a feature, fixing tests or bugs, or splitting a large refactor into independent chunks. | `Use worker to update these staging models to follow our naming convention.` |
| `validation` | Provides dbt validation. After model edits, runs structured validation &mdash; SQL check, `dbt run` with `--defer`, prod vs. dev comparison, and impact analysis &mdash; to validate changes before you merge. | `Use validation to check whether my changes to int_payments are safe to merge.` |
| `test_writer` | Improves dbt test coverage. Analyzes project metadata and warehouse data to find coverage gaps, validates assumptions with queries, and writes `schema.yml` tests for models with low or no coverage. | `Use test_writer to add tests to stg_customers.` |

</SimpleTable>

You don't need to declare these &mdash; <Constant name="wizard"/> routes to them automatically when a task fits, or you can ask for one by name.

## Related docs

- [About <Constant name="wizard" /> in the <Constant name="dbt_platform" />](/docs/platform/wizard-platform)
- [<Constant name="wizard" /> in Studio IDE](/docs/dbt-ai/wizard-ide)
- [Use subagents locally](/docs/dbt-ai/wizard-subagents)
- [How <Constant name="wizard" /> works](/docs/dbt-ai/wizard-how-it-works)
