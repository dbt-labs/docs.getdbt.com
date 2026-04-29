--- 
title: "About dbt Copilot" 
sidebar_label: "About dbt Copilot" 
description: "dbt Copilot is a powerful AI-powered assistant designed to accelerate your analytics workflows throughout your entire ADLC." 
pagination_next: "docs/platform/enable-dbt-copilot"
keywords: ["dbt Copilot", "dbt", "AI", "AI-powered", "dbt"]
---

# About dbt Copilot <Lifecycle status="self_service,managed,managed_plus" /> 

<IntroText>
<Constant name="copilot" /> is a powerful, AI-powered assistant fully integrated into your <Constant name="dbt" /> experience—designed to accelerate your analytics workflows.

</IntroText>

<Constant name="copilot" /> embeds AI-driven assistance across every stage of the [analytics development life cycle (ADLC)](https://www.getdbt.com/resources/guides/the-analytics-development-lifecycle) and harnesses rich metadata—capturing relationships, lineage, and context  &mdash; so you can deliver refined, trusted data products at speed.

:::tip
<Constant name="copilot" /> is available on Starter, Enterprise, and Enterprise+ accounts. [Book a demo](https://www.getdbt.com/contact) to see how AI-driven development can streamline your workflow.
:::

<Lightbox src="/img/docs/dbt-platform/platform-ide/dbt-copilot-doc.gif" width="100%" title="Example of using dbt Copilot to generate documentation in the IDE" />

## How dbt Copilot works

<Constant name="copilot" /> enhances efficiency by automating repetitive tasks while ensuring data privacy and security. It works as follows:

- Access <Constant name="copilot" /> through:
  - The [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-copilot) to generate documentation, tests, semantic models. Access the [<Constant name="dev_agent" />](/docs/dbt-ai/developer-agent) from the same Copilot panel to build, refactor, and validate models end-to-end.
  - The [<Constant name="canvas" /> ](/docs/platform/build-canvas-copilot) to generate SQL code using natural language prompts. <Lifecycle status="managed,managed_plus" /> 
  - The [<Constant name="insights" />](/docs/explore/dbt-insights) to generate SQL queries for analysis using natural language prompts. <Lifecycle status="managed,managed_plus" /> 
- <Constant name="copilot" /> gathers metadata (like column names, model SQL, documentation) but never accesses row-level warehouse data.
- The metadata and user prompts are sent to the AI provider (in this case, OpenAI) through API calls for processing.
- The AI-generated content is returned to <Constant name="dbt" /> for you to review, edit, and save within your project files.
- <Constant name="copilot" /> does not use warehouse data to train AI models.
- No sensitive data persists on dbt Labs' systems, except for usage data.
- Client data, including any personal or sensitive data inserted into the query by the user, is deleted within 30 days by OpenAI.
- <Constant name="copilot" /> uses a best practice style guide to ensure consistency across teams.

:::tip
<Constant name="copilot" /> accelerates, but doesn’t replace, your analytics engineer. It helps deliver better data products faster, but always review AI-generated content, as it may be incorrect. To learn about prompt best practices, check out the [Prompt cookbook](/guides/prompt-cookbook).
:::
