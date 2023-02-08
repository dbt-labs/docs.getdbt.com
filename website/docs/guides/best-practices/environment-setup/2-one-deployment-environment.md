---
title: "One deployment environment"
id: 2-one-deployment-environment
description: Learn how to configure environments in dbt Cloud.
displayText: "dbt Cloud environment best practices"
hoverSnippet: Learn how to configure environments in dbt Cloud.
---


## One deployment environment

### **What this looks like**

1. You have a **single *development* environment** where dbt users can access the dbt Cloud IDE and make changes to their code on feature branches created off of your default branch in your repository (most often the `main` branch)
2. You have a **single *deployment* environment** (let’s call it “Production”) where your scheduled jobs run referencing the `main` branch
3. You also have a [**Slim CI job](https://docs.getdbt.com/docs/deploy/cloud-ci-job)** that kicks off anytime you open a PR to merge a feature branch into `main`. This Slim CI job can run in your dbt “Production” environment

:::info
☁️ Slim CI jobs run in a dedicated custom schema for each PR, so there will no collision with your production schemas!

:::

![Untitled](Branches%20and%20Environments%20and%20dbt%20Projects,%20oh%20my!%2079979f54702d4a2db2059257cc413670/Untitled.png)

### `git` workflow

![Screen Shot 2023-01-03 at 11.16.06 AM.png](Branches%20and%20Environments%20and%20dbt%20Projects,%20oh%20my!%2079979f54702d4a2db2059257cc413670/Screen_Shot_2023-01-03_at_11.16.06_AM.png)

1. In the dbt Cloud IDE, developers work on feature branches, created from the `main` branch (`feature_a`, `feature_b`, `feature_c` above)
2. When code is ready, developer opens a PR to merge feature branch into `main`
3. [**Slim CI Job](https://docs.getdbt.com/docs/deploy/cloud-ci-job)** automatically kicks off, and tests the changes made in the PR
4. When Slim CI Job is successful ******and****** team is ready to deploy changes to Production, the PR is merged directly into the `main` branch! The next time a production job runs, these changes will be incorporated and executed!

### dbt Cloud setup

1. Create your [**development environment**](https://docs.getdbt.com/docs/collaborate/environments/dbt-cloud-environments#create-a-development-environment) to power the dbt Cloud IDE. No extra customization needed!
2. Create your **[production deployment environment](https://docs.getdbt.com/docs/collaborate/environments/dbt-cloud-environments#create-a-deployment-environment)**.
3. Define your **dbt Cloud jobs** in the production deployment environment from step 2!
    1. **Production job(s)** — You will need to set up **at least one scheduled job** that deploys your project to your production databases/schemas. You may create multiple jobs based on your business SLAs.
    2. **Slim CI Job —** Unlike the production jobs, which are triggered via the scheduler, this job will be triggered when PRs are opened in your repository. Enable this option by selecting`Run on Pull Requests?` under the `Webhooks` tab under the `Triggers` section.

        :::info
        💡 This job will also need to **[defer to one of the Production jobs](https://docs.getdbt.com/docs/deploy/cloud-ci-job#deferral-and-state-comparison)** created in step 3a. This enables the use of the `[**state](https://docs.getdbt.com/docs/deploy/about-state)` modifiers** in your selection syntax to only run changes introduced by your PR.

        :::

### **When this works well**

This approach is the recommended approach for most use-cases as it allows changes to code to be quickly promoted to production, with confidence that they can be trusted. With this option, multiple developers can easily contributing to the same code base with confidence!

:::info
💡 Check out [Sunrun's Coalesce 2022 talk](https://www.youtube.com/watch?v=vmBAO2XN-fM) on Automating CI/CD in dbt Cloud, where they simplified their CI/CD process from several long-lived branches to a single long-lived main branch with feature branches.

:::

### **When this doesn’t work so well**

- You have a **formal QA process** before merging code into production .
- You want to **control when features are released** to production.
- You need to have scheduled **jobs running in many environments** due to dependencies on outside systems.
  - e.g. Your organization has many applications that consume and test data changes in a lower non-Production environment before changes should be promoted to Production.
