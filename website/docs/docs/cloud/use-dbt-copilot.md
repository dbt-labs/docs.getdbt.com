--- 
title: "Use dbt Copilot" 
sidebar_label: "Use dbt Copilot" 
description: "Use dbt Copilot to generate documentation, tests, semantic models, and sql code from scratch, giving you the flexibility to modify or fix generated code." 
---

import CopilotResources from '/snippets/_use-copilot-resources.md';
import CopilotEditCode from '/snippets/_use-copilot-edit-code.md';
import CopilotVE from '/snippets/_use-copilot-ve.md';

# Use dbt Copilot <Lifecycle status="enterprise" /> 

<IntroText>
Use dbt Copilot to generate documentation, tests, semantic models, and code from scratch, giving you the flexibility to modify or fix generated code.

</IntroText>

This page explains how to use dbt Copilot to:

- [Generate resources](#generate-resources) &mdash; Save time by using dbt Copilot’s generation button to generate documentation, tests, and semantic model files during your development in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).
- [Generate and edit SQL inline](#generate-and-edit-sql-inline) &mdash; Use natural language prompts to generate SQL code from scratch or to edit existing SQL file by using keyboard shortcuts or highlighting code in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).
- [Build visual models](#build-visual-models)<Lifecycle status='beta'/> &mdash; Use dbt Copilot to generate models in the [Visual Editor](/docs/cloud/use-visual-editor) with natural language prompts.
- [Build queries](#build-queries) <Lifecycle status="beta"/> &mdash; Use dbt Copilot to generate queries in the [Query page](/docs/collaborate/query-page) for exploratory data analysis using natural language prompts.

## Generate resources

<CopilotResources/>

## Generate and edit SQL inline

<CopilotEditCode/>

## Build visual models <Lifecycle status='beta'/>

:::info
Building visual models in the Visual Editor is currently in private beta for [dbt Cloud Enterprise accounts](https://www.getdbt.com/pricing). To join the private beta, [register your interest](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform) or reach out to your account team to begin this process.
:::

dbt Copilot seamlessly integrates with the [Visual Editor](/docs/cloud/visual-editor), a drag-and-drop experience that helps you build your visual models using natural language prompts. Before you begin, make sure you can [access the Visual Editor](/docs/cloud/use-visual-editor#access-visual-editor).

<CopilotVE/>

## Build queries <Lifecycle status="beta"/>

:::info
Query page is currently in private beta for [dbt Cloud Enterprise accounts](https://www.getdbt.com/pricing). To join the private beta, reach out to your account team to begin this process.
:::

Use dbt Copilot to build queries in the [Query page](/docs/collaborate/query-page) with natural language prompts to seamlessly explore and query data with an intuitive, context-rich interface. Before you begin, make sure you can [access the Query page](/docs/collaborate/access-query-page).

To begin building SQL queries with natural language prompts in the Query page:

1. Click on the **dbt Copilot** icon in Query console sidebar menu.
2. In the dbt Copilot prompt box, enter your prompt in natural language for dbt Copilot to build the SQL query you want. <!--You can also reference existing models using the `@` symbol. For example, to build a model that calculates the total price of orders, you can enter `@orders` in the prompt and it'll pull in and reference the `orders` model.-->
3. Click **Submit** and dbt Copilot generates a summary of the SQL query you want to build. To clear the prompt, click on the **Clear** button. To close the prompt box, click the dbt Copilot icon again.
4. dbt Copilot will automatically generate the SQL with an explanation of the query. 
   - Click **Add** to add the generated SQL to the existing query. 
   - Click **Replace** to replace the existing query with the generated SQL.
5. In the **Query console menu**, click the **Run** button to preview the data.
6. Confirm the results or continue building your model. 

<Lightbox src="/img/docs/query-page/qp-copilot.gif" width="95%" title="Query page dbt Copilot" />
