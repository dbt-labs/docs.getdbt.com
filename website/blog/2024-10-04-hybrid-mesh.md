---
title: "How Hybrid Mesh unlocks dbt collaboration at scale"
description: A deep-dive into the Hybrid Mesh pattern for enabling collaboration between domain teams using dbt Core and dbt Cloud. 
slug: hybrid-mesh
authors: [jason_ganz]
tags: [analytics craft]
hide_table_of_contents: false
date: 2024-09-30
is_featured: true
---

One of the most important things that dbt does is unlock the ability for teams to collaborate on creating and disseminating organizational knowledge.

In the past, this primarily looked like a team working in one dbt Project to create a set of transformed objects in their data platform.

As dbt was adopted by larger organizations and began to drive workloads at a global scale, it became clear that we needed mechanisms to allow teams to operate independently from each other, creating and sharing data models across teams &mdash; [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro).

<!-- truncate -->

dbt Mesh is powerful because it allows teams to operate _independently_ and _collaboratively_, each team free to build on their own but contributing to a larger, shared set of data outputs.

The flexibility of dbt Mesh means that it can support [a wide variety of patterns and designs](/best-practices/how-we-mesh/mesh-3-structures). Today, let’s dive into one pattern that is showing promise as a way to enable teams working on very different dbt deployments to work together.

## How Hybrid Mesh enables collaboration between dbt Core and dbt Cloud teams

**_Scenario_** &mdash; A company with a central data team uses dbt Core. The setup is working well for that team. They want to scale their impact to enable faster decision-making, organization-wide. The current dbt Core setup isn't well suited for onboarding a larger number of less-technical, nontechnical, or less-frequent contributors. 

**_The goal_** &mdash; Enable three domain teams of less-technical users to leverage and extend the central data models, with full ownership over their domain-specific dbt models.

    - **Central data team:** Data engineers comfortable using dbt Core and the command line interface (CLI), building and maintaining foundational data models for the entire organization.

    - **Domain teams:** Data analysts comfortable working in SQL but not using the CLI and prefer to start working right away without managing local dbt Core installations or updates. The team needs to build transformations specific to their business context. Some of these users may have tried dbt in the past, but they were not able to successfully onboard to the central team's setup.

**_Solution: Hybrid Mesh_** &mdash; Data teams can use dbt Mesh to connect projects *across* dbt Core and dbt Cloud, creating a workflow where everyone gets to work in their preferred environment while creating a shared lineage that allows for visibility, validation, and ownership across the data pipeline. 

Each team will fully own its dbt code, from development through deployment, using the product that is appropriate to their needs and capabilities _while sharing data products across teams using both dbt Core and dbt Cloud._

<Lightbox src="/img/blog/2024-09-30-hybrid-mesh/hybrid-mesh.png" width="75%" title="A before and after diagram highlighting how a Hybrid Mesh allows central data teams using dbt Core to work with domain data teams using dbt Cloud." />

Creating a Hybrid Mesh is mostly the same as creating any other [dbt Mesh](/guides/mesh-qs?step=1) workflow &mdash; there are a few considerations but mostly _it just works_. We anticipate it will continue to see adoption as more central data teams look to onboard their downstream domain teams. 

A Hybrid Mesh can be adopted as a stable long-term pattern, or as an intermediary while you perform a [migration from dbt Core to dbt Cloud](/guides/core-cloud-2?step=1).

## How to build a Hybrid Mesh
Enabling a Hybrid Mesh is as simple as a few additional steps to import the metadata from your Core project into dbt Cloud. Once you’ve done this, you should be able to operate your dbt Mesh like normal and all of our [standard recommendations](/best-practices/how-we-mesh/mesh-1-intro) still apply. 

### Step 1: Prepare your Core project for access through dbt Mesh

Configure public models to serve as stable interfaces for downstream dbt Projects.

- Decide which models from your Core project will be accessible in your Mesh. For more information on how to configure public access for those models, refer to the [model access page.](/docs/collaborate/govern/model-access)
- Optionally set up a [model contract](/docs/collaborate/govern/model-contracts) for all public models for better governance.
- Keep dbt Core and dbt Cloud projects in separate repositories to allow for a clear separation between upstream models managed by the dbt Core team and the downstream models handled by the dbt Cloud team.

### Step 2: Mirror each "producer" Core project in dbt Cloud 
This allows dbt Cloud to know about the contents and metadata of your project, which in turn allows for other projects to access its models.

- [Create a dbt Cloud account](https://www.getdbt.com/signup/) and a dbt project for each upstream Core project.
  - Note: If you have [environment variables](/docs/build/environment-variables) in your project, dbt Cloud environment variables must be prefixed with `DBT_ `(including `DBT_ENV_CUSTOM_ENV_` or `DBT_ENV_SECRET`). Follow the instructions in [this guide](https://docs.getdbt.com/guides/core-to-cloud-1?step=8#environment-variables) to convert them for dbt Cloud.
- Each upstream Core project has to have a production [environment](/docs/dbt-cloud-environments) in dbt Cloud. You need to configure credentials and environment variables in dbt Cloud just so that it will resolve relation names to the same places where your dbt Core workflows are deploying those models.
- Set up a [merge job](/docs/deploy/merge-jobs) in a production environment to run `dbt parse`. This will enable connecting downstream projects in dbt Mesh by producing the necessary [artifacts](/reference/artifacts/dbt-artifacts) for cross-project referencing.
  - Note: Set up a regular job to run `dbt build` instead of using a merge job for `dbt parse`, and centralize your dbt orchestration by moving production runs to dbt Cloud. Check out [this guide](/guides/core-to-cloud-1?step=9) for more details on converting your production runs to dbt Cloud.
- Optional: Set up a regular job (for example, daily) to run `source freshness` and `docs generate`. This will hydrate dbt Cloud with additional metadata and enable features in [dbt Explorer](/docs/collaborate/explore-projects) that will benefit both teams, including [Column-level lineage](/docs/collaborate/column-level-lineage).

### Step 3: Create and connect your downstream projects to your Core project using dbt Mesh
Now that dbt Cloud has the necessary information about your Core project, you can begin setting up your downstream projects, building on top of the public models from the project you brought into Cloud in [Step 2](#step-2-mirror-each-producer-core-project-in-dbt-cloud). To do this:
- Initialize each new downstream dbt Cloud project and create a [`dependencies.yml` file](/docs/collaborate/govern/project-dependencies#use-cases). 
- In that `dependencies.yml` file, add the dbt project name from the `dbt_project.yml` of the upstream project(s). This sets up cross-project references between different dbt projects:

    ```yaml
    # dependencies.yml file in dbt Cloud downstream project
    projects:
    - name: upstream_project_name
    ```
- Use [cross-project references](/reference/dbt-jinja-functions/ref#ref-project-specific-models) for public models in upstream project. Add [version](/reference/dbt-jinja-functions/ref#versioned-ref) to references of versioned models:
  ```yaml
  select * from {{ ref('upstream_project_name', 'monthly_revenue') }}
  ```

And that’s all it takes! From here, the domain teams that own each dbt Project can build out their models to fit their own use cases. You can now build out your Hybrid Mesh however you want, accessing the full suite of dbt Cloud features.
- Orchestrate your Mesh to ensure timely delivery of data products and make them available to downstream consumers.
- Use [dbt Explorer](/docs/collaborate/explore-projects) to trace the lineage of your data back to its source.
- Onboard more teams and connect them to your Mesh.
- Build [semantic models](/docs/build/semantic-models) and [metrics](/docs/build/metrics-overview) into your projects to query them with the [dbt Semantic Layer](https://www.getdbt.com/product/semantic-layer).


## Conclusion

In a world where organizations have complex and ever-changing data needs, there is no one-size fits all solution. Instead, data practitioners need flexible tooling that meets them where they are. The Hybrid Mesh presents a model for this approach, where teams that are comfortable and getting value out of dbt Core can collaborate frictionlessly with domain teams on dbt Cloud.
