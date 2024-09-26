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
  - Use the password provided by the workshop facilitator.
- Agree to the terms of service and click the **Complete Registration** button.
- Wait about 30 seconds, you’ll be in the dbt Cloud project for this course and already connected to a data warehouse.

## Project overview and latest run status

<Lightbox src="/img/quickstarts/dbt-cloud/explorer_performance_tab.png" width="90%" title="dbt Explorer performance tab" />

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

- Use the search bar and [node selectors](/reference/node-selection/syntax) to filter your dag.
- [Lenses](/docs/collaborate/explore-projects#lenses) make it easier to understand your project’s contextual metadata at scales, especially to distinguish a particular model or a subset of models.
  - Applying a lens adds tags to the nodes, showing metadata like layer values, with color coding to help you distinguish them.

 <Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_dag.png" width="90%" title="dbt Explorer's lineage graph" />
  
- Use the [advanced search](/docs/collaborate/explore-projects#search-resources) feature to locate resources in your project. Perform hard searches and keyword searches. All resource names, column names, resources descriptions, warehouse relations, and code matching your search criteria will appear in the center of the page. Apply filters to fully refine your search
- When searching for a column name, the results show all relational nodes containing that column in their schemas. 

 <Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_advanced_search.png" width="90%" title="dbt Explorer's advanced search feature" />

#### Hands-On
1. On the left hand side, click on the company and ensure you're in the **Overview Project details** section → Next to **Overview** → Select **View Lineage**.
2. Select a mart model and select everything downstream.
  - Which models depend on models from another project?
  - Click on the other project's lineage.
3. Explore lenses and find table materializations in your current project.
  - Which are the biggest view clusters?
4. Experiment with different lenses, such as **Model layer**, **Test status**, **Resource type**, and so on.
5. Drill down on a node and explore the **Column Lineage** and its evolution.
  - Expand each column's full lineage.

## Mutli-Project
Use dbt Explorer to gain a deeper understanding of *all* of you dbt Cloud projects with it's [multi-project capabilities](/docs/collaborate/explore-multiple-projects). 
- See the number of public models, protected models, private models, and metrics in each project.
- View cross-project lineage and navigate between individual projects’ lineage graphs
- View cross-project column-level lineage

#### Hands-On
- See which models in the platform project are public and being referenced by another project.
- Swap between two projects’ lineages. Explore the  assets provided.
  - What sources can we see?
- Use multi-project column level lineage to find a column that exists in models in multiple projects.

## Project Recommendations
The [project recommendations](/docs/collaborate/project-recommendations) page suggests project improvements and provides insight into how you can create a better-documented, better-tested, and better-built dbt project, creating more trust and less confusion.
Learn more about what sort of suggestions it makes and why on our [docs site](/docs/collaborate/project-recommendations).

 <Lightbox src="/img/quickstarts/dbt-cloud/dbt_explorer_project_recs.png" title="dbt Explorer's project recommendation tab" />

#### Hands-On
- Read through the project recommendations. Select one improvement to make and make it! (Ex: Add a description to a primary key that lacks one)
