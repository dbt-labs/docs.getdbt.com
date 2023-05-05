---
title: "Many deployment environments"
id: 3-many-deployment-environments
description: Learn how to configure a many deployment environment setup in dbt Cloud.
displayText: "dbt Cloud environment best practices"
hoverSnippet: Learn how to configure a many deployment environment setup in dbt Cloud.
---


## What this looks like

1. You have a **single *development* environment** where dbt users can access the dbt Cloud IDE and make changes to their code. However, you’ll want to update the **[custom branch settings](faqs/Environments/custom-branch-settings)** to ensure that developers create feature branches off of the a non-production branch. For this example, we’ll refer to this as the `qa` branch.
2. You have a **QA deployment environment**, running scheduled jobs from the `qa` branch that deploys your dbt project to a pre-production warehouse location.
3. You have a **Production deployment environment,** running scheduled jobs from the `main` branch that deploys your dbt project to your production warehouse location.
4. You have **multiple Slim CI jobs** (one in each deployment environment) to ensure changes to each branch are tested.  

<Lightbox src="/img/guides/best-practices/environment-setup/many-deployments-table.png" title="Table of basic setup for many deployment environment" />

### Git workflow

<Lightbox src="/img/guides/best-practices/environment-setup/many-branch-git.png" title="git flow diagram for many deployment environments" />

1. In the dbt Cloud IDE, developers work on feature branches, **created from the `qa` branch** (`feature_a`, `feature_b`, `feature_c` above).
2. When code is ready, developer opens a PR to merge feature branch into `qa`.
3. The **first Slim CI Job** automatically kicks off to test the changes introduced in the PR. This job will *defer to a regularly-scheduled job in the QA environment* and run in the QA deployment environment.
4. When **Slim CI Job is successful** and team is ready to deploy changes, the **PR is merged into `qa`.**
5. Scheduled jobs run in the QA deployment environment, running on `qa` branch to ensure the new changes work as indended.
6. When **all feature branches** for a given release (e.g. sprint) have been **successfully merged** to `qa` and are **running without error** in the QA deployment environment, a team member opens a **PR to merge `qa` → `main`.**
7. The **second Slim CI Job** automatically kicks off to test changes in PR. This job will *defer to a regularly-scheduled job in the Production environment* and run in the Production deployment environment.
8. When **second Slim CI Job** is successful and team is ready to deploy changes, the **PR is merged into `main`**.
9. Monitor scheduled jobs in the Production deployment environment that are running on `main` branch. Voila! All changes are released and ready for your stakeholders.

:::info
💡 Considering a different branching strategy that involves cherry picking? [Maybe reconsider!](https://docs.getdbt.com/blog/the-case-against-git-cherry-picking)

:::

### dbt Cloud setup

1. Create your [**development environment**](docs/collaborate/environments/dbt-cloud-environments#create-a-development-environment) to power the dbt Cloud IDE.

    Here, we’ll set a **custom branch** so that users in the IDE create their feature branches from `qa` instead of `main`. Click **Only run on a custom branch** in **General settings**, enter `qa` into **Custom Branch.**

2. Set up your **QA [deployment environment](docs/collaborate/environments/dbt-cloud-environments#create-a-deployment-environment)**

    Here, we’ll apply the same custom branch settings as the development environment in Step 1. All scheduled jobs in the QA deployment environment will use the code from the `qa` branch during execution.

3. **Define QA jobs**
    1. **QA job(s)**: You’ll want to create at least one scheduled job, running on a roughly daily cadence. This will allow us to make sure all the code executes without error before you release it to production, and will also power the first Slim CI job.
    2. **Slim CI Job**: As above, this job will be triggered when PRs are opened in your repository. Enable this option by selecting **Run on Pull Requests?** under the **Webhooks** tab under the **Triggers** section. Since we’re using the custom branch setting in the QA environment, you'll also want to be sure to select the second option **Run only on Custom Branch** (selected by default) — this means that only PRs created against the `qa` branch will trigger this job, rather than any PR at all.

        This job will also need to defer to one of the QA jobs created in step 3a. This enables the use of the `state` modifier in your selection syntax to only run changes introduced by your PR.

4. Set up your **Production [deployment environment](docs/collaborate/environments/dbt-cloud-environments#create-a-deployment-environment)**

    Here, we’ll *also* use the same custom branch settings as the other environments, but set the custom branch as `main`. Even thought the `main` branch is the default, setting this value enables us to properly set up the CI Job in the next step.

5. **Define production jobs**
    1. **Production job(s)**: You will need to set up at least one scheduled job that deploys your project to your production databases/schemas. You may create multiple jobs based on your business SLAs.
    2. **Production Slim CI Job**: As above, this job will be triggered when PRs are opened in your repository. Enable this option by selecting **Run on Pull Requests?** under the **Webhooks** tab under the **Triggers** section. Since we’re using the custom branch setting in the QA environment, we’ll also want to select the second option **Run only on Custom Branch** — this means that only PRs created against the `main` branch will trigger this job, rather than any PR at all.

        This job will also need to defer to one of the QA jobs created in step 5a. This enables the use of the `state` modifier in your selection syntax to only run changes introduced by your PR.

### When this works well

This approach works well when it’s critical to **apply user acceptance and integration testing to your project in a pre-production environment**. This approach allows you to have scheduled jobs running in **many environments** on your data warehouse.

### When this doesn’t work so well

This approach may slow down the time it takes to get new feature into production, since it requires additional steps in the deployment process and additional branches to maintain. Keep in mind that adding complexity to your deployment process might cause some slowdown in your release cycle.

## Conclusion

While there’s no single correct answer to how to setup your dbt Cloud environments, they are flexible enough to enable just about any code promotion workflow your organization uses. We would love to hear how you’ve set up your deployment infrastructure in dbt Cloud!
