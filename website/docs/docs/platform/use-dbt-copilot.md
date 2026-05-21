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

<Constant name="copilot" /> includes the following capabilities:

- [Generate resources](#generate-resources): Save time by using <Constant name="copilot" />'s generation button to generate documentation, tests, and semantic model files during your development in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio).
- [Generate and edit SQL inline](#generate-and-edit-sql-inline): Use natural language prompts to generate SQL code from scratch or to edit existing SQL file by using keyboard shortcuts or highlighting code in the [<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio).
- [Build visual models](#build-visual-models): Use <Constant name="copilot" /> to generate models in [<Constant name="canvas" />](/docs/platform/use-canvas) with natural language prompts.
- [Build queries](#build-queries): Use <Constant name="copilot" /> to generate queries in [<Constant name="insights" />](/docs/explore/dbt-insights) for exploratory data analysis using natural language prompts.
- [dbt Agents](/docs/dbt-ai/dbt-agents): Delegate entire tasks like building new models end-to-end, refactoring existing models, or analyzing data with natural language &mdash; reducing context-switching and letting you stay in flow. Agents like the [<Constant name="dev_agent" />](/docs/dbt-ai/developer-agent) and [Analyst agent](/docs/dbt-ai/analyst-agent) are available in the same <Constant name="copilot" /> panel.

:::tip
Check out our [dbt Copilot on-demand course](https://learn.getdbt.com/learn/course/dbt-copilot/welcome-to-dbt-copilot/welcome-5-mins) to learn how to use <Constant name="copilot" /> to generate resources, and more!

To learn about prompt best practices, check out the [Prompt cookbook](/guides/prompt-cookbook).
:::

## Generate resources 

<CopilotResources/>

## Generate and edit SQL inline

<CopilotEditCode/>

## Build visual models

<Constant name="copilot" /> seamlessly integrates with the [<Constant name="canvas" />](/docs/platform/canvas), a drag-and-drop experience that helps you build your visual models using natural language prompts. Before you begin, make sure you can [access the <Constant name="canvas" />](/docs/platform/use-canvas#access-canvas).

<CopilotVE/>

## Build queries

Use <Constant name="copilot" /> to build queries in [<Constant name="insights" />](/docs/explore/dbt-insights) with natural language prompts to seamlessly explore and query data with an intuitive, context-rich interface. Before you begin, make sure you can [access <Constant name="insights" />](/docs/explore/access-dbt-insights).

To begin building SQL queries with natural language prompts in <Constant name="insights" />:

1. Click the **<Constant name="copilot" />** icon in the Query console sidebar menu. 
2. In the dropdown menu above the <Constant name="copilot" /> prompt box, select **Generate SQL**.
3. In the dbt Copilot prompt box, enter your prompt in natural language for dbt <Constant name="copilot" /> to build the SQL query you want. <!--You can also reference existing models using the `@` symbol. For example, to build a model that calculates the total price of orders, you can enter `@orders` in the prompt and it'll pull in and reference the `orders` model.-->
4. Click **↑** to submit your prompt. <Constant name="copilot" /> generates a summary of the SQL query you want to build. To clear the prompt, click on the **Clear** button. To close the prompt box, click the <Constant name="copilot" /> icon again.
5. <Constant name="copilot" /> will automatically generate the SQL with an explanation of the query. 
   - Click **Add** to add the generated SQL to the existing query. 
   - Click **Replace** to replace the existing query with the generated SQL.
6. In the **Query console menu**, click the **Run** button to preview the data.
7. Confirm the results or continue building your model. 

<Lightbox src="/img/docs/dbt-insights/insights-copilot.gif" width="95%" title="dbt Copilot in dbt Insights" />
