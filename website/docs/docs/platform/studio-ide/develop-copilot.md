--- 
title: "Develop with dbt Copilot" 
sidebar_label: "Develop with dbt Copilot" 
description: "Use dbt Copilot to generate documentation, tests, semantic models, and SQL code from scratch, giving you the flexibility to modify or fix generated code." 
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import CopilotEditCode from '/snippets/_use-copilot-edit-code.md';

# Develop with dbt Copilot <Lifecycle status="self_service,managed,managed_plus" /> 

<IntroText>

This page describes how to use <Constant name="copilot" /> in the <Constant name="studio_ide" /> to improve your development workflow.
</IntroText>

Use [<Constant name="copilot" />](/docs/platform/dbt-copilot) in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio) to generate documentation, tests, semantic models, metrics, and SQL code from scratch &mdash; making it easier for you to build your dbt project, accelerate your development, and focus on high-level tasks. For information about using <Constant name="copilot" /> in the [<Constant name="canvas" />](/docs/platform/canvas), see [Build with <Constant name="copilot" />](/docs/platform/build-canvas-copilot).

## Developer agent <Lifecycle status="preview,self_service,managed,managed_plus" />

For autonomous model generation, refactoring, and multi-step workflows in the <Constant name="studio_ide" />, see the [<Constant name="dev_agent" />](/docs/dbt-ai/developer-agent). 

The <Constant name="dev_agent" /> is accessible from the Copilot panel. Switch to **Ask** or **Code** mode to activate the agent.

<div style={{maxWidth: '100%', margin: '20px 0'}}>
<video width="100%" controls autoPlay muted loop playsInline>
  <source src="/img/docs/dbt-platform/dev-agent.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
<span style={{display: 'block', textAlign: 'center', fontSize: '0.9em', color: 'var(--ifm-color-emphasis-600)', marginTop: '8px'}}>Example of using the Developer agent to refactor a model in the Studio IDE.</span>
</div>

## Generate resources

<CopilotResources/>

## Generate and edit code

<CopilotEditCode/>
