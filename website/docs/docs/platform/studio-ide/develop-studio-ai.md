---
title: "Develop with AI"
sidebar_label: "Develop with AI"
description: "Leverage AI to develop dbt projects in the Studio IDE"
availability: platform_usage
---


import WizardIde from '/snippets/_wizard-ide.md';

# Develop with AI in the Studio IDE

<IntroText>
Leverage AI to develop dbt projects in the <Constant name="studio_ide" />.
</IntroText>

[<Constant name="wizard" />](/docs/platform/wizard-platform) in [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) is the new and recommended way to develop governed dbt projects with AI. It uses your project context to help you develop governed dbt changes faster. Think of it like a smart AI agent that has a map of your project: instead of reading through each file to understand context, it can answer questions and help you develop and validate changes faster.

## Prerequisites

- A [<Constant name="dbt" /> account](https://www.getdbt.com/signup) on any plan and [Developer seat license](/docs/platform/manage-access/seats-and-users).
- A [development environment](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.

AI features are enabled by default. Admins can [turn them off or back on anytime](/docs/platform/manage-dbt-ai).

## dbt Wizard in Studio IDE <Lifecycle status="preview" />

Use [<Constant name="wizard" />](/docs/dbt-ai/wizard-ide) for autonomous model generation, refactoring, and multi-step workflows in the <Constant name="studio_ide" />. It's grounded in the [dbt Information Schema](/docs/build/dbt-information-schema) &mdash; a structured view of your project's lineage, tests, model health, and semantic definitions &mdash; so it knows your data, not just your code.

<Constant name="wizard" /> is accessible from the sidebar panel or in the Console section of the <Constant name="studio_ide" />.

<WizardIde />
