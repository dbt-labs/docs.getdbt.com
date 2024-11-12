--- 
title: "Navigate the interface" 
id: visual-editor-interface      
sidebar_label: "Navigate the interface" 
description: "The visual editor interface contains an operator toolbar, operators, and a canvas to help you create dbt models through a seamless drag-and-drop experience in dbt Cloud." 
pagination_next: "docs/cloud/use-visual-editor"
pagination_prev: "docs/cloud/visual-editor"

---

# Navigate the interface <Lifecycle status='beta'/> 

<p style={{ color: '#717d7d', fontSize: '1.1em' }}>
The visual editor interface contains an operator toolbar, operators, canvas, built-in AI, and more to help you create dbt models through a seamless drag-and-drop experience in dbt Cloud.
</p>

:::tip Beta feature
The visual editor provides users with a seamless and visual, drag-and-drop experience inside dbt Cloud. It's available in private beta for [dbt Cloud Enterprise accounts](https://www.getdbt.com/pricing). 

To join the private beta, [register your interest](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform) or reach out to your account team to begin this process.
:::

This page offers comprehensive definitions and terminology of user interface elements, allowing you to navigate the dbt Cloud visual editor landscape with ease.

The visual editor interface is composed of:

- **Operator toolbar** &mdash; Located at the top of the interface, the toolbar displays all the nodes available. Use the toggle on the left of the toolbar to display or hide it.
- **Operators** &mdash; perform specific transformations or configurations (such as model, join, aggregate, filter, and so on). Use connectors to link the operators and build a complete data transformation pipeline. 
- **Canvas** &mdash; The main whiteboard space below the node toolbar. The canvas allows you to create or modify models through a sleek drag-and-drop experience.
- **Configuration panel** &mdash; Each operator has a configuration panel that opens when you click on it. The configuration panel allows you to configure the operator, review the current model, preview changes to the table, view the SQL code for the node, and delete the operator.

## Operators

The operator toolbar above the canvas contains the different transformation operators available to use. Use each operator to configure or perform specific tasks, like adding filters or joining models by dragging an operator onto the canvas. You can connect operators using the connector line, which allows you to form a complete dbt model for your data transformation.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/edit-model.png" width="90%" title="Use the operator toolbar to perform different transformation operations." />

Here the following operators are available:
- **Model**: This represents a data model. Use this to select the source table and the columns you want to include. There are no limits to the number of models you can have in a session.
- **Join**: Join two models and configure the join conditions by selecting which columns to include from each table. Requires two inputs. For example, you might want to join both tables using the 'ID' column found in both tables.
- **Select**: Use this to 'select' specific columns from a table.
- **Aggregate**: Allows you to perform aggregations like GROUP, SUM, AVG, COUNT, and so on.
- **Formula**: Create new columns using custom SQL formulas. Use a built-in AI code generator to generate SQL by clicking the ? icon. For example, you can use the formula node to only extract the email domain and ask the AI code generator to help you write the SQL for that code extraction.
- **Filter**: Filter data based on conditions you set.
- **Order**: Sort data by specific columns.
- **Limit**: Limits the number of rows returned back.

When you click on each operator, it opens a configuration panel. The configuration panel allows you to configure the operator, review the current model, preview changes to the model, view the SQL code for the node, and delete the operator.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/visual-editor.png" width="90%" title="Visual editor interface that contains a node toolbar and canvas." />

If you have any feedback on additional operators that you might need, we'd love to hear it! Please contact your dbt Labs account team and share your thoughts.

## Canvas

The visual editor has a sleek drag-and-drop canvas interface that allows you to create or modify dbt SQL models. It's like a digital whiteboard space that allows analysts to deliver trustworthy data. Use the canvas to:

- Drag-and-drop operators to create and configure your model(s)
- Generate SQL code using the built-in AI generator
- Zoom in or out for better visualization
- Version-control your dbt models
- [Coming soon] Test and document your created models

<Lightbox src="/img/docs/dbt-cloud/visual-editor/operator.png" width="90%" title="The operator toolbar allows you to select different nodes to configure or perform specific tasks, like adding filters or joining models." />

### Connector

Connectors allow you to connect your operators to create dbt models. Once you've added operators to the canvas:
- Hover over the "+" sign next to the operator and click. 
- Drag your cursor between the operator's "+" start point to the other node you want to connect to. This should create a connector line.
- As an example, to create a join, connect one operator to the "L" (Left) and the other to the "R" (Right). The endpoints are located to the left of the operator so you can easily drag the connectors to the endpoint.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/connector.png" width="100%" title="Click and drag your cursor to connect operators." />

## Configuration panel
Each operator has a configuration side panel that opens when you click on it. The configuration panel allows you to configure the operator, review the current model, preview changes, view the SQL code for the operator, and delete the operator.

The configuration side panel has the following:
- Configure tab &mdash; This section allows you to configure the operator to your specified requirements, such as using the built-in AI code generator to generate SQL.
- Input tab &mdash; This section allows you to view the data for the current source table. Not available for model operators.
- Output tab &mdash; This section allows you to preview the data for the modified source model.
- Code &mdash; This section allows you to view the underlying SQL code for the data transformation.

<Lightbox src="/img/docs/dbt-cloud/visual-editor/config-panel.png" width="90%" title="A sleek drag-and-drop canvas interface that allows you to create or modify dbt SQL models." />
