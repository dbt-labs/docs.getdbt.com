--- 
title: "Use dbt Copilot" 
sidebar_label: "Use dbt Copilot" 
description: "Use dbt Copilot to generate documentation, tests, semantic models, and SQL code from scratch, giving you the flexibility to modify or fix generated code." 
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import CopilotEditCode from '/snippets/_use-copilot-edit-code.md';
import CopilotVE from '/snippets/_use-copilot-ve.md';

# Use dbt Copilot <Lifecycle status="self_service,managed,managed_plus" /> 

<IntroText>
Use <Constant name="copilot" /> to generate documentation, tests, semantic models, and code from scratch, giving you the flexibility to modify or fix generated code.

</IntroText>

This page explains how to use <Constant name="copilot" /> to:

- [Generate resources](#generate-resources) &mdash; Save time by using <Constant name="copilot" />’s generation button to generate documentation, tests, and semantic model files during your development in the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).
- [Generate and edit SQL inline](#generate-and-edit-sql-inline) &mdash; Use natural language prompts to generate SQL code from scratch or to edit existing SQL file by using keyboard shortcuts or highlighting code in the [<Constant name="cloud_ide" />](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).
- [Build visual models](#build-visual-models) &mdash; Use <Constant name="copilot" /> to generate models in [<Constant name="visual_editor" />](/docs/cloud/use-canvas) with natural language prompts.
- [Build queries](#build-queries) &mdash; Use <Constant name="copilot" /> to generate queries in [<Constant name="query_page" />](/docs/explore/dbt-insights) for exploratory data analysis using natural language prompts.

## Generate resources 

<CopilotResources/>

## Generate and edit SQL inline

<CopilotEditCode/>

## Build visual models

<Constant name="copilot" /> seamlessly integrates with the [<Constant name="visual_editor" />](/docs/cloud/canvas), a drag-and-drop experience that helps you build your visual models using natural language prompts. Before you begin, make sure you can [access the <Constant name="visual_editor" />](/docs/cloud/use-canvas#access-canvas).

<CopilotVE/>

## Build queries

Use <Constant name="copilot" /> to build queries in [<Constant name="query_page" />](/docs/explore/dbt-insights) with natural language prompts to seamlessly explore and query data with an intuitive, context-rich interface. Before you begin, make sure you can [access <Constant name="query_page" />](/docs/explore/access-dbt-insights).

To begin building SQL queries with natural language prompts in <Constant name="query_page" />:

1. Click on the **<Constant name="copilot" />** icon in Query console sidebar menu.
2. In the dbt Copilot prompt box, enter your prompt in natural language for dbt Copilot to build the SQL query you want. <!--You can also reference existing models using the `@` symbol. For example, to build a model that calculates the total price of orders, you can enter `@orders` in the prompt and it'll pull in and reference the `orders` model.-->
3. Click **Submit** and <Constant name="copilot" /> generates a summary of the SQL query you want to build. To clear the prompt, click on the **Clear** button. To close the prompt box, click the <Constant name="copilot" /> icon again.
4. <Constant name="copilot" /> will automatically generate the SQL with an explanation of the query. 
   - Click **Add** to add the generated SQL to the existing query. 
   - Click **Replace** to replace the existing query with the generated SQL.
5. In the **Query console menu**, click the **Run** button to preview the data.
6. Confirm the results or continue building your model. 

<Lightbox src="/img/docs/dbt-insights/insights-copilot.gif" width="95%" title="dbt Copilot in dbt Insights" />
