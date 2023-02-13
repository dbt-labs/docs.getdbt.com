---
title: "dbt Cloud environment best practices"
id: 1-env-guide-overview
description: Learn how to configure environments in dbt Cloud.
displayText: "dbt Cloud environment best practices"
hoverSnippet: Learn how to configure environments in dbt Cloud.
---

> *How do I manage environments in my dbt Cloud project? How many do I need?*
>
> *How does my <Term id="data-warehouse" /> structure map to environments in dbt Cloud?*
>
> *What do git branches have to do with my dbt Cloud environments?*
>

If these questions keep you up at night, you’ve come to the right place! When it comes to managing your dbt Cloud environments, there is not a one-size-fits-all solution for all teams. In this guide we’ll walk you through a few environment architecture options for dbt Cloud that we’d recommend, and hopefully you find an option that works for you.

## Learning goals

This guide has three main goals:

- Provide our recommendations on managing dbt Cloud environments
- Illustrate these recommendations with comprehensive examples
- At each stage, explain *why* we recommend the approach that we do, so that you're equipped to decide when and where to deviate from these recommendations to better fit your organization’s unique needs

:::info
☁️ This guide focuses on architecture for **dbt Cloud**. However, similar principles apply for developers using dbt Core. Before diving into this guide we recommend taking a look at our **[dbt Cloud environments](docs/collaborate/environments/dbt-cloud-environments)** page for more context.

:::

### How many environments do I really need?

Environments define the way that dbt will execute your code, including:

- The **version of dbt** that will run.
- The **version of your code** to be executed.
- The **connection information** for your warehouse.
- In dbt Cloud, there are **two types of environments:**
  - **Development** — the environment settings in which you work in the IDE on a development branch.
  - **Deployment** — the environment settings in which a dbt Cloud job runs.

In this guide, we’re going to focus on **deployment environments**, which determine how your project is executed when a **dbt Cloud job executes**.

Depending on your desired outcome, the number of deployment environments in your dbt Cloud Project will vary. Let’s dive in to see how many deployment environments works best for you.

| Setup option | Works well if you | Relative complexity level  |
| --- | --- | --- |
| One deployment environment | - only scheduled runs for one set of data objects <br /> - development branches are merged directly to main | Low |
| Many deployment environments | - feature branches move through several promotion stages | High |

### TL;DR — One deployment environment

We usually recommended folks start with the basics; having one deployment environment is usually the simplest and most maintainable approach to start. This approach works well if:

- You only need to have **scheduled jobs running in a single environment** within your data warehouse.
- You use a **single primary branch** and follow a direct promotion (**Dev —> Prod**) strategy

With this option, your production jobs and your [Slim CI jobs](docs/deploy/cloud-ci-job) that ensure code integrity are managed within one single deployment environment.

### TL;DR — Many deployment environments
This approach adds a bit more complexity and may slow down the development process, but adds a layer of security that can be worth the tradeoff. This approach works well if:

- Your organization maintains **several long-lived git branches** to control how and when changes are tested and promoted to production.
  - Some orgs follow a **Dev —> QA —>  Prod release cycle** — if that sounds like your org, this approach is probably right for you.
- The **output of your dbt project is an input to other systems**, and you need to test and validate any changes in a pre-production environment.

The two options are explored in more detail in the following sections, including the benefits, trade-offs, the steps required to implement the setup in dbt Cloud.
