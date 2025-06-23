---
title: "Copilot chat in Studio"
id: copilot-chat-in-studio 
description: "Use the Copilot chat feature in the Studio to generate SQL using your input and the context of the active project." 
sidebar_label: Copilot chat in studio
pagination_next: null
pagination_prev: null
---

# Copilot chat in Studio <Lifecycle status="Starter,Enterprise,Enterprise+" />

<IntroText>
Use the <Constant name="copilot" /> chat feature in <Constant name="cloud_ide" /> to generate SQL using your input and the context of the active project.
</IntroText>

<Constant name="copilot" /> chat is an interactive interface within <Constant name="cloud_ide" /> that allows users to generate SQL from natural language prompts and ask analytics-related questions. By integrating contextual understanding of your dbt project, <Constant name="copilot" /> assists in streamlining SQL development while ensuring users remain actively involved in the process. This collaborative approach helps maintain accuracy, relevance, and adherence to best practices in your organization’s analytics workflows.

## Prerequisites

- Must have a [<Constant name="cloud" /> Starter, Enterprise or Enterprise+ account](https://www.getdbt.com/pricing).
- Development environment is on a supported [release track](/docs/dbt-versions/cloud-release-tracks) to receive ongoing updates.
- <Constant name="copilot" /> enabled for your account.
    - Admins must [enable <Constant name="copilot" />](/docs/cloud/enable-dbt-copilot#enable-dbt-copilot) (and opt-in to AI features, if required) in your dbt Cloud project settings.

## Copilot chat overview

<Expandable alt_header="Generate SQL" >

Ask <Constant name="copilot" /> to generate SQL queries using natural language, making it faster to build or modify dbt models without manual SQL coding.

You can describe the query or data transformation you want, and <Constant name="copilot" /> will produce the corresponding SQL code for you within the <Constant name="cloud_ide" /> environment.⁠

This includes the ability to:
- Scaffold new SQL models from scratch by describing your needs in plain English.
- Refactor or optimize existing SQL in your models.
- Generate complex queries, CTEs, and even automate best-practice SQL formatting, all directly in the chat or command palette UI.

To generate SQL queries: 
1. Navigate to the **<Constant name="copilot" />** button in the <Constant name="cloud_ide" />
2. Select **[*] SQL** from the menu

<Lightbox src="/img/docs/dbt-cloud/copilot-chat-generate-sql.png" width="70%" title="SQL option."/> 

</Expandable>

<Expandable alt_header="Mention a model in the project" >
⁠​
This model mention capability is designed to provide a much more project-aware experience than generic code assistants, enabling you to:

- Pose questions about specific models (For example, "Add a test for the model `stg_orders`")

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-cloud/copilot-chat-mention-model-menu-open.png" width="75%" title="Mention model with menu open." />

<Lightbox src="/img/docs/dbt-cloud/copilot-chat-mention-model-menu-select.png" width="75%" title="Mention model after selecting from menu."/>

</DocCarousel>

</Expandable>

<Expandable alt_header="Add and replace buttons" >

Add generated code or content into your project, or replace the selected section with the <Constant name="copilot" /> suggestion, all directly from the chat interface. This lets you review and apply changes with a single click for an efficient workflow.⁠
⁠​<br />

These buttons are often tracked as specific user actions in the underlying event/telemetry data, confirming they are core to the expected interaction with <Constant name="copilot" /> in <Constant name="cloud_ide" /> and related surfaces.⁠
⁠​<br />

The **Add** button lets you append <Constant name="copilot" />'s output, while **Replace** swaps your current code or selection with the generated suggestion, giving you precise, in-context editing control.

Note, if the file is empty, you'll only see **Add** as an option, since there's nothing to replace.

<Lightbox src="/img/docs/dbt-cloud/copilot-chat-add-replace.png" width="70%" title="Add and replace buttons."/> 

</Expandable>