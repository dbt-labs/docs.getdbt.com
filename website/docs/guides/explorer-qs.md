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

This quickstart guide accompanies the Explorer hands-on workshop and help you dive into a production-level dbt Mesh implementation and discover how to explore your data workflows.⁠ Whether you're looking to streamline your data operations, improve data quality, or self-serve information about your data platform, this workshop will equip you with the tools and knowledge to take your dbt projects to the next level.

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
- Go to this URL:  https://cloud.getdbt.com/coalesce-workshop-signup
  - Sign out if you're already logged in.
  - Enter your first name and last name.
  - Select the **Exploring a dbt Mesh implementation with dbt Explorer** option.
  - Use the passcode provided by the workshop facilitator.
- Agree to the terms of service and click the **Complete Registration** button.
- Wait about 30 seconds, you’ll be in the dbt Cloud project for this course and already connected to a data warehouse.

## Project overview and latest run status

<Lightbox src="/img/quickstarts/dbt-cloud/explorer_performance_tab.png" width="100%" title="dbt Explorer performance tab" />

With dbt Explorer, you can view your project's resources (such as models, tests, and metrics), their lineage, and model consumption to gain a better understanding of its latest production state. Navigate and manage your projects within dbt Cloud to help you and other data developers, analysts, and consumers discover and leverage your dbt resources.

### Hands-On
- Explore the **Model** tab 
  - Which job took the Longest? 
  - Which job/jobs failed? Why?

- Explore the **Sources** tab
  - What sources can we see?

- Explore the **Tests** Tab
  - Did we run the right test?, Which test were missing? Why?

- Explore **Exposures** 
  - Check Quality and where they came from
 
## Lineage

dbt Explorer provides a visualization of your project’s <Term id="dag"/> that you can interact with. The nodes in the lineage graph represent the project’s resources and the edges represent the relationships between the nodes. Nodes are color-coded and include iconography according to their resource type.

- Use the search bar and [node selectors](/reference/node-selection/syntax) to filter your DAG.
- [Lenses](/docs/collaborate/explore-projects#lenses) make it easier to understand your project’s contextual metadata at scales, especially to distinguish a particular model or a subset of models.
  - Applying a lens adds tags to the nodes, showing metadata like layer values, with color coding to help you distinguish them.

 <Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_dag.png" width="100%" title="dbt Explorer's lineage graph" />
  
- Use the [advanced search](/docs/collaborate/explore-projects#search-resources) feature to locate resources in your project. Perform hard searches and keyword searches. All resource names, column names, resources descriptions, warehouse relations, and code matching your search criteria will appear in the center of the page. Apply filters to fully refine your search
- When searching for a column name, the results show all relational nodes containing that column in their schemas. 

 <Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_advanced_search.png" width="100%" title="dbt Explorer's advanced search feature" />

### Hands-On
1. On the left hand side, click on the company and ensure you're in the **Overview Project details** section → Next to **Overview** → Select **View Lineage**.

2. Select a mart model and select everything downstream.
   - Which models depend on models from another project?
   - Click on the other project's lineage.

3. Explore lenses and find table materializations in your current project.
   - Which are the biggest view clusters?

4. Experiment with different lenses, such as **Model layer**, **Test status**, **Resource type**, and so on.

5. Drill down on a node and explore the **Column Lineage** and its evolution.
   - Expand each column's full lineage.

## Multi-project
Use dbt Explorer to gain a deeper understanding of *all* of you dbt Cloud projects with its [multi-project capabilities](/docs/collaborate/explore-multiple-projects). 
- See the number of public, protected, and private models, as well as metrics for each project.
- View cross-project lineage and navigate between individual projects’ lineage graphs.
- Explore column-level lineage across projects.

### Hands-On
- Identify which models in the project are public and being referenced by another project.
- Switch between the lineage graphs of two different projects and explore the available assets.
  - What sources are visible?
- Use the multi-project column-level lineage to locate a column that exists in models across multiple projects.

## Project recommendations
Project recommendations suggests project improvements and provides insight into how you can create a better-documented, better-tested, and better-built dbt project.

These recommendations are designed to build trust in your project and reduce confusion.

To learn more about the specific suggestions and the reasons behind them, check out the [Project recommendations page](/docs/collaborate/project-recommendations).

<Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_project_recs.png" width="80%" title="dbt Explorer's project recommendation tab" />

### Hands-On
- Review your project recommendations and choose one improvement to implement (such as adding a description to a primary key that’s missing one).

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
- More auto exposure integrations (like PowerBI)
- Model query history for additional warehouses (like Redshift and DataBricks)
- Improvements to data health tiles

</ConfettiTrigger>
