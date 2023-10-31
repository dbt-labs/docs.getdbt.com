---
title: "Advanced: Create a release train with additional environments"
slug: multiple-environments
description: Large and complex enterprises sometimes require additional layers of validation before deployment. Learn how to add these checks with dbt Cloud.
---

:::caution Are you sure you need this?
This approach can increase release safety, but creates additional manual steps in the deployment process as well as a greater maintenance burden.

As such, it may slow down the time it takes to get new features into production.

The team at Sunrun maintained a SOX-compliant deployment in dbt while reducing the number of environments. Check out [their Coalesce presentation](https://www.youtube.com/watch?v=vmBAO2XN-fM) to learn more.
:::

In this section, we will add a new **QA** environment. New features will branch off from and be merged back into the associated `qa` branch, and a member of your team (the "Release Manager") will create a PR against `main` to be validated in the CI environment before going live.

The git flow will look like this:
<Lightbox src="/img/best-practices/environment-setup/many-branch-git.png" title="git flow diagram with an intermediary branch" />

## Prerequisites

- You have the **Development**, **CI**, and **Production** environments, as described in [the Baseline setup](/guides/orchestration/set-up-ci/in-15-minutes).


## Step 1: Create a `release` branch in your git repo

As noted above, this branch will outlive any individual feature, and will be the base of all feature development for a period of time. Your team might choose to create a new branch for each sprint (`qa/sprint-01`, `qa/sprint-02`, etc), tie it to a version of your data product (`qa/1.0`, `qa/1.1`), or just have a single `qa` branch which remains active indefinitely.

## Step 2: Update your Development environment to use the `qa` branch

See [Custom branch behavior](/docs/dbt-cloud-environments#custom-branch-behavior). Setting `qa` as your custom branch ensures that the IDE creates new branches and PRs with the correct target, instead of using `main`.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dev-environment-custom-branch.png" title="A demonstration of configuring a custom branch for an environment" />

## Step 3: Create a new QA environment

See [Create a new environment](/docs/dbt-cloud-environments#create-a-deployment-environment). The environment should be called **QA**. Just like your existing Production and CI environments, it will be a Deployment-type environment.

Set its branch to `qa` as well.

## Step 4: Create a new job

Use the **Continuous Integration Job** template, and call the job **QA Check**.

In the Execution Settings, your command will be preset to `dbt build --select state:modified+`. Let's break this down:

- [`dbt build`](/reference/commands/build) runs all nodes (seeds, models, snapshots, tests) at once in DAG order. If something fails, nodes that depend on it will be skipped.
- The [`state:modified+` selector](/reference/node-selection/methods#the-state-method) means that only modified nodes and their children will be run ("Slim CI"). In addition to [not wasting time](https://discourse.getdbt.com/t/how-we-sped-up-our-ci-runs-by-10x-using-slim-ci/2603) building and testing nodes that weren't changed in the first place, this significantly reduces compute costs.

To be able to find modified nodes, dbt needs to have something to compare against. Normally, we use the Production environment as the source of truth, but in this case there will be new code merged into `qa` long before it hits the `main` branch and Production environment. Because of this, we'll want to defer the Release environment to itself.

### Optional: also add a compile-only job

dbt Cloud uses the last successful run of any job in that environment as its [comparison state](/reference/node-selection/syntax#about-node-selection). If you have a lot of PRs in flight, the comparison state could switch around regularly.

Adding a regularly-scheduled job inside of the QA environment whose only command is `dbt compile` can regenerate a more stable manifest for comparison purposes.

## Step 5: Test your process

When the Release Manager is ready to cut a new release, they will manually open a PR from `qa` into `main` from their git provider (e.g. GitHub, GitLab, Azure DevOps). dbt Cloud will detect the new PR, at which point the existing check in the CI environment will trigger and run. When using the [baseline configuration](/guides/orchestration/set-up-ci/in-15-minutes), it's possible to kick off the PR creation from inside of the dbt Cloud IDE. Under this paradigm, that button will create PRs targeting your QA branch instead.

To test your new flow, create a new branch in the dbt Cloud IDE then add a new file or modify an existing one. Commit it, then create a new Pull Request (not a draft) against your `qa` branch. You'll see the integration tests begin to run. Once they complete, manually create a PR against `main`, and within a few seconds you’ll see the tests run again but this time incorporating all changes from all code that hasn't been merged to main yet.
