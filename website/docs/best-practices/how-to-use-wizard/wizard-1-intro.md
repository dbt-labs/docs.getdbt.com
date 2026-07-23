---
title: "How to use Wizard in your dbt project"
id: "wizard-1-intro"
description: "Recommended workflows for using dbt Wizard CLI on a real dbt project, from understanding a codebase to shipping and validating changes."
hoverSnippet: Learn recommended workflows for using dbt Wizard CLI on your dbt project
---

<Constant name="wizard" /> is an AI agent that works from your project's dbt metadata &mdash; models, lineage, tests, and metrics &mdash; instead of guessing from code alone. You can run it locally from your CLI or <Constant name="dbt_platform" />. Refer to [dbt Wizard overview](/docs/platform/wizard-overview) for what it is and [Use Wizard locally](/docs/dbt-ai/wizard-quickstart) to set it up.

This guide collects the workflows we recommend once Wizard is running on a real project: mapping an unfamiliar codebase, validating a change before you ship it, adding tests, debugging a failed job, developing against production state, building Semantic Layer definitions, and extending Wizard with plugins and hooks.

## Learning goals

- Understand the prompts and context that get reliable results from <Constant name="wizard" /> on real project tasks.
- Develop an intuition for when to reach for <Constant name="wizard" /> versus doing a task by hand.
- Establish repeatable workflows you and your team can reuse across projects.

## Before you begin

These workflows assume <Constant name="wizard" /> CLI is already installed and connected to a dbt project with a current `target/manifest.json`. Refer to [Use Wizard locally](/docs/dbt-ai/wizard-quickstart) for setup, and [Wizard CLI config reference](/docs/dbt-ai/wizard-config) for configuration options like deferral and approval policy.
