--- 
title: "About dbt Copilot" 
sidebar_label: "About dbt Copilot" 
description: "dbt Copilot is a powerful AI-powered assistant designed to accelerate your analytics workflows throughout your entire ADLC." 
pagination_next: "docs/cloud/enable-dbt-copilot"
keywords: ["dbt Copilot", "dbt Cloud", "AI", "AI-powered", "dbt"]
---

# About dbt Copilot <Lifecycle status="enterprise" /> 

<IntroText>
dbt Copilot is a powerful, AI-powered assistant fully integrated into your dbt Cloud experience—designed to accelerate your analytics workflows.

</IntroText>

dbt Copilot embeds AI-driven assistance across every stage of the [analytics development life cycle (ADLC)](https://www.getdbt.com/resources/guides/the-analytics-development-lifecycle) and harnesses rich metadata—capturing relationships, lineage, and context  &mdash; so you can deliver refined, trusted data products at speed.

With automatic code generation and using natural language prompts, dbt Copilot can [generate code](/docs/cloud/use-dbt-copilot), [documentation](/docs/build/documentation), [tests](/docs/build/data-tests), [metrics](/docs/build/metrics-overview), and [semantic models](/docs/build/semantic-models) for you with the click of a button in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-copilot), [Visual Editor (beta)](/docs/cloud/build-ve-copilot), and [Query page (beta)](/docs/collaborate/query-page).

:::tip
dbt Copilot is available to all Enterprise accounts. [Book a demo](https://www.getdbt.com/contact) to see how AI-driven development can streamline your workflow.
:::

<Lightbox src="/img/docs/dbt-cloud/cloud-ide/dbt-copilot-doc.gif" width="100%" title="Example of using dbt Copilot to generate documentation in the IDE" />

## How dbt Copilot works

dbt Copilot enhances efficiency by automating repetitive tasks while ensuring data privacy and security. It works as follows:

- Access dbt Copilot through:
  - The [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-copilot) to generate documentation, tests, semantic models.
  - The [Visual Editor (beta)](/docs/cloud/build-ve-copilot) to generate SQL code using natural language prompts.
  - The [Query page (beta)](/docs/collaborate/query-page) to generate SQL queries for analysis using natural language prompts.
- dbt Copilot gathers metadata (like column names, model SQL, documentation) but never accesses row-level warehouse data.
- The metadata and user prompts are sent to the AI provider (in this case, OpenAI) through API calls for processing.
- The AI-generated content is returned to dbt Cloud for you to review, edit, and save within your project files.
- dbt Copilot does not use warehouse data to train AI models.
- No sensitive data persists on dbt Labs' systems, except for usage data.
- Client data, including any personal or sensitive data inserted into the query by the user, is deleted within 30 days by OpenAI.
- dbt Copilot uses a best practice style guide to ensure consistency across teams.

:::tip
dbt Copilot accelerates, but doesn’t replace, your analytics engineer. It helps deliver better data products faster, but always review AI-generated content, as it may be incorrect.
:::
