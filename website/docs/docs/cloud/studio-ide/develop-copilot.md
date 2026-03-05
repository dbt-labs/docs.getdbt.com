--- 
title: "Develop with dbt Copilot" 
sidebar_label: "Develop with dbt Copilot" 
description: "Use dbt Copilot to generate documentation, tests, semantic models, and SQL code from scratch, giving you the flexibility to modify or fix generated code." 
---

# Develop with dbt Copilot <Lifecycle status="self_service,managed,managed_plus" /> 

<IntroText>

This page describes how to use <Constant name="copilot" /> in the <Constant name="cloud_ide" /> to improve your development workflow.
</IntroText>

Use [<Constant name="copilot" />](/docs/cloud/dbt-copilot) in the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio) to generate documentation, tests, semantic models, metrics, and SQL code from scratch &mdash; making it easier for you to build your dbt project, accelerate your development, and focus on high-level tasks. For information about using <Constant name="copilot" /> in the [<Constant name="visual_editor" />](/docs/cloud/canvas), see [Build with <Constant name="copilot" />](/docs/cloud/build-canvas-copilot).

import CopilotResources from '/snippets/_use-copilot-resources.md';
import CopilotEditCode from '/snippets/_use-copilot-edit-code.md';
import CopilotAgentPanel from '/snippets/_copilot-agent-panel.md';
import DevAgent from '/snippets/_developer-agent-studio-setup.md';

## Developer agent <Lifecycle status="private_beta" />

The [Developer agent](/docs/dbt-ai/developer-agent) uses natural language prompts to generate or refactor dbt models, semantic models, tests, and documentation — all within the <Constant name="cloud_ide" />. The agent proactively creates or updates associated YAML files to stay in sync with any model changes it makes.

<DevAgent />

<CopilotAgentPanel />

## Generate resources

<CopilotResources/>

## Generate and edit code

<CopilotEditCode/>
