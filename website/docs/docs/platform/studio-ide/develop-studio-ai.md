---
title: "Develop with AI"
sidebar_label: "Develop with AI"
description: "Leverage AI to develop dbt projects in the Studio IDE"
---

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';
import CopilotResources from '/snippets/_use-copilot-resources.md';
import WizardIde from '/snippets/_wizard-ide.md';

# Develop with AI in the Studio IDE <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>
Leverage AI to develop dbt projects in the <Constant name="studio_ide" />.
</IntroText>

[<Constant name="wizard" />](/docs/platform/wizard-platform) in [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) is the new and recommended way to develop governed dbt projects with AI. It uses your project context to help you develop governed dbt changes faster. Think of it like a smart AI agent that has a map of your project: instead of reading through each file to understand context, it can answer questions and help you develop and validate changes faster.

dbt also supports dbt Copilot, a separate inline AI assistance experience for single-click generation of SQL, documentation, tests, and semantic models in <Constant name="studio_ide" />, <Constant name="canvas" />, and <Constant name="insights" />.

## Prerequisites

- A Starter, Enterprise, or Enterprise+ plan
- A [<Constant name="dbt" /> account](https://www.getdbt.com/signup) and [Developer seat license](/docs/platform/manage-access/seats-and-users).
- A [development environment](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide) and credentials set up in the <Constant name="studio_ide" />.
- [Enabled AI features](/docs/platform/enable-dbt-ai) for your account.

## dbt Wizard in Studio IDE <Lifecycle status="preview,self_service,managed,managed_plus" />

Use [<Constant name="wizard" />](/docs/dbt-ai/wizard-ide) for autonomous model generation, refactoring, and multi-step workflows in the <Constant name="studio_ide" />. It's grounded in dbt's native metadata engine &mdash; a structured index of your project's lineage, tests, model health, and semantic definitions &mdash; so it knows your data, not just your code.

<Constant name="wizard" /> is accessible from the sidebar panel or in the Console section of the <Constant name="studio_ide" />.

<WizardIde />

## dbt Copilot in Studio IDE

[dbt Copilot](/docs/dbt-ai/copilot-overview) provides single-click generation of SQL, documentation, tests, and semantic models in <Constant name="studio_ide" />, <Constant name="canvas" />, and <Constant name="insights" />.

1. Navigate to the <Constant name="studio_ide" /> and select a SQL model file under the **File Explorer**.
2. In the **Console** section, click the **dbt Copilot** button to view the available AI options.
3. Select the available options to [generate resources](#generate-resources) such as using the quick-action buttons to generate documentation, tests, semantic models, or metrics.

The following sections describe how to use dbt Copilot in the <Constant name="studio_ide" />.

### Generate resources
To generate resources with dbt Copilot, follow these steps:

<CopilotResources />

### Inline SQL editing

dbt Copilot supports a quick inline prompt window for targeted SQL edits directly in the editor. Press **Cmd+B** (Mac) or **Ctrl+B** (Windows) to open the prompt window within a model file, describe what you want to generate or change, and dbt Copilot displays a diff of the proposed changes — click **Accept** to apply or **Reject** to discard.

This is useful for scoped edits within a single SQL file. For larger or multi-step changes — like building a new model, refactoring across files, or generating YAML, review how [<Constant name="wizard" />](/docs/dbt-ai/wizard-ide) can help instead.
