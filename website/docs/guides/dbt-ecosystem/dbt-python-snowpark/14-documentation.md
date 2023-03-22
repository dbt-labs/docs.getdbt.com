---
title: "Documentation" 
id: "14-documentation"
description: "Documentation"
---
When it comes to documentation, dbt brings together both column and model level descriptions that you can provide as well as details from your Snowflake information schema in a static site for consumption by other data team members and stakeholders.

We are going to revisit 2 areas of our project to understand our documentation our:

- `intermediate.md` file
- `dbt_project.yml` file
To start, let’s look back at our `intermediate.md` file. We can see that we provided multi-line descriptions for the models in our intermediate models using [docs blocks](https://docs.getdbt.com/docs/collaborate/documentation#using-docs-blocks). Then we reference these docs blocks in our `.yml` file. Building descriptions with doc blocks in markdown files gives you the ability to format your descriptions with markdown and are particularly helpful when building long descriptions, either at the column or model level. In our `dbt_project.yml` we added `node_colors` at folder levels.

1. To see all these pieces come together **execute** `dbt docs generate` in the command bar. This will generate the documentation for your project. Click the book button, as shown in the screenshot below to access the docs.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation/1-docs-icon.png" title="dbt docs book icon"/>

2. Going to our project area and viewing `int_results` and view the description that we created in our doc block.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation/2-view-docblock-description.png" title="Docblock description within docs site"/>

3. View the mini-lineage that looks at the model we are currently selected on (`int_results` in this case).
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation/3-mini-lineage-docs.png" title="Mini lineage view on docs site"/>

4. In our `dbt_project.yml`we configured `node_colors` depending on the file directory. Now in dbt v1.3 we can see how our lineage in our docs looks. By color coding your project, it may help you cluster together similar models or steps and more easily troubleshoot.
  <Lightbox src="/img/guides/dbt-ecosystem/dbt-python-snowpark/14-documentation/4-full-dag-docs.png" title="Full project DAG on docs site"/>