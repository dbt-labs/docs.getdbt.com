---
title: "Quickstart for the dbt Explorer workshop"
id: "explorer-quickstart"
description: "Use this guide to build and define metrics, set up the dbt Cloud Semantic Layer, and query them using Google Sheets."
sidebar_label: "Quickstart dbt Explorer"
icon: 'guides'
hide_table_of_contents: true
tags: ['Explorer', 'Snowflake', 'dbt Cloud','Quickstart']
keywords: ['dbt Explorer','Mesh','dbt Cloud', 'Snowflake', 'Multi-Project']
level: 'Beginner'
recently_updated: true
---

## Introduction

Unlock the power of [dbt Explorer](/docs/collaborate/explore-projects) in this hands-on workshop designed for analytics engineers, data analysts, stakeholders, and data leaders.

This quickstart guide accompanies the Explorer hands-on workshop and helps you dive into a production-level dbt Mesh implementation and discover how to explore your data workflows.⁠ Whether you're looking to streamline your data operations, improve data quality, or self-serve information about your data platform, this workshop will equip you with the tools and knowledge to take your dbt projects to the next level.

By the end of the guide and workshop, you'll understand how to leverage dbt Explorer and have the confidence to navigate multiple dbt projects, trace dependencies, and identify opportunities to improve performance and data quality.

### What you'll learn
In this guide, you will learn how to:
- Navigate multiple dbt projects using dbt Explorer
- Self-serve on data documentation
- Trace dependencies at the model and column level
- Identify opportunities to improve performance and data quality

### Prerequisites
- Familiarity with data platforms

## Setup
Now we’ll be creating your dbt Cloud account and connecting it to a data warehouse. 
1. Go to this URL (sign out if you're already logged in):  https://cloud.getdbt.com/coalesce-workshop-signup
2. Enter your first name and last name.
3. Select the **Exploring a dbt Mesh implementation with dbt Explorer** option.
4. Use the passcode provided by the workshop facilitator.
5. Agree to the terms of service and click the **Complete Registration** button.
6. Wait about 30 seconds, you’ll be in the dbt Cloud account for this workshop and already connected to a data warehouse.
7. Toggle into the **Platform project**. Go to the **Deploy** tab and select **Jobs** from the dropdown menu. 
8. Run each job you see by clicking on the job and then selecting **Run**. This will run the *upstream* project job in both a production and staging environment.
9. Toggle into the **Analytics project**. Go to the **Deploy** tab and select **Jobs** from the dropdown menu. 
10. Run each job you see by clicking on the job and then selecting **Run**. This will run the *downstream* project job in both a production and staging environment.
 <Lightbox src="/img/quickstarts/dbt-cloud/go_to_jobs.png" width="80%" title="Click on the Jobs tab" />
 <Lightbox src="/img/quickstarts/dbt-cloud/run_job.png" width="80%" title="Run the jobs" />
   

## Performance
<Lightbox src="/img/quickstarts/dbt-cloud/explorer_performance_tab.png" width="100%" title="dbt Explorer's Performance tab" />
dbt Explorer will show you your project's most executed models, longest model executions, most failed models and tests, and most consumed models all in one place: The performance tab.

### Hands-On
- Trigger the Daily Prod job to run again
- Explore the **Performance** tab on the **Project details** page
  - Which model took the longest over the last two weeks? Over the last month? 
  - Which model failed the most tests? 
  - Click on the model that took the longest to run in the _Longest model executions_ graph
    - What is the average duration time over the last two weeks? Over the last month?
    - How often is the model being built? What is the Model Test Failure Rate?

## Resources

With dbt Explorer, you can view your project's resources (such as models, tests, and metrics), their lineage, and model consumption to gain a better understanding of its latest production state. 

Navigate and manage your projects within dbt Cloud to help you and other data developers, analysts, and consumers discover and leverage your dbt resources.

<Lightbox src="/img/quickstarts/dbt-cloud/explorer_performance_tab.png" width="100%" title="dbt Explorer's Models tab" />

### Hands-On
- Explore the **Model** tab 
  - Pick a model. What’s its row count?
  - Use the test results drop down to see if  this model’s tests passed. What other models does it depend on?
- Explore the **Tests** tab
  - What tests do we see? Which tests have warnings? Failures?
- Explore the **Sources** tab
  - What sources can we see? Which sources have stale data? Which sources have fresh data?
- Explore **Exposures**
  - Use the lineage graph to find an exposure. Which  models and metrics does the Exposure reference?
 
## Lineage

dbt Explorer provides a visualization of your project’s <Term id="dag"/> that you can interact with. The nodes in the lineage graph represent the project’s resources and the edges represent the relationships between the nodes. Nodes are color-coded and include iconography according to their resource type.

- Use the search bar and [node selectors](/reference/node-selection/syntax) to filter your DAG.
- [Lenses](/docs/collaborate/explore-projects#lenses) make it easier to understand your project’s contextual metadata at scales, especially to distinguish a particular model or a subset of models.
  - Applying a lens adds tags to the nodes, showing metadata like layer values, with color coding to help you distinguish them.

 <Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_dag.png" width="100%" title="dbt Explorer's lineage graph" />
  
- Use the [advanced search](/docs/collaborate/explore-projects#search-resources) feature to locate resources in your project. 
  - Perform hard searches and keyword searches. 
  - All resource names, column names, resource descriptions, warehouse relations, and code matching your search criteria will appear in the center of the page. 
  - Apply filters to fully refine your search.
- When searching for a column name, the results show all relational nodes containing that column in their schemas. 

 <Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_advanced_search.png" width="100%" title="dbt Explorer's advanced search feature" />

### Hands-On
- Explore **Project-Level lineage**
  - Pick a model and review its upstream and downstream dependencies
  - Which sources does this model depend on? Which models depend on this model?
- Explore **Lenses**
  - Apply the Test Status Lenses. Which models passed tests? Which had warnings?
  - Explore different lenses (Model Layer, Materialization Type, Resource). What information do you see?
- Explore **Column-Level Lineage**
  - Navigate to the model’s **Model resource** page and explore the primary key column’s **Column-Level Lineage**

## Multi-project
Use dbt Explorer to gain a deeper understanding of *all* your dbt Cloud projects with its [multi-project capabilities](/docs/collaborate/explore-multiple-projects).
- See the number of public, protected, and private models, as well as metrics for each project.
- View cross-project lineage and navigate between individual projects’ lineage graphs.
- Explore column-level lineage across projects.

### Hands-On
- In the lineage graph, filter the Platform Project’s Project-Level Lineage for Public models using the `access:public` filter
  - Make a note of which models are referenced by the analytics project.
- Explore the Analytics Project’s lineage
  - Choose a model in the Platform project referenced by the Analytics project.
  - Look at the multi-project column-level lineage of its primary key column.
  - Open the Analytics project’s lineage graph. Which models does it reference? 


## Project recommendations

These recommendations are designed to build trust in your project and reduce confusion.

To learn more about the specific suggestions and the reasons behind them, check out [our docs](/docs/collaborate/project-recommendations).

<Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_project_recs.png" width="80%" title="dbt Explorer's project recommendation tab" />

### Hands-On
- Review your project recommendations.
- Find the project recommendation for the model `agg_daily_returned_orders`.
- Add documentation to this model in the `aggregates.yml` file.

## What's next

<ConfettiTrigger>

Congratulations! You've completed the dbt Explorer workshop. You now have the tools and knowledge to navigate multiple dbt projects, trace dependencies, and identify opportunities to improve performance and data quality.

You've learned how to:
- Use dbt Explorer to visualize your project’s lineage and interact with the DAG
- Search for resources in your project and apply filters to refine your search
- Explore lenses and find table materializations in your current project
- Navigate multiple dbt projects using dbt Explorer
- Trace dependencies at the model and column level
- Review project recommendations and implement improvements

For the next steps, you can check out the [dbt Explorer documentation](/docs/collaborate/explore-projects) and [FAQs](/docs/collaborate/dbt-explorer-faqs) to learn more about how to use dbt Explorer.

Keep an eye out for new features coming out soon, like:
- More [auto-exposure](/docs/collaborate/auto-exposures) integrations (like PowerBI and Tableau).
- [Model query history](/docs/collaborate/model-query-history) for additional warehouses (like Redshift and Databricks)
- Improvements to [data health tiles](/docs/collaborate/data-tile)

</ConfettiTrigger>
