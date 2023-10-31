---
title: "Baseline: Enable CI in 15 minutes"
slug: in-15-minutes
description: Find issues before they are deployed to production with dbt Cloud's Slim CI.
---

In this guide, we're going to add a **CI environment**, where proposed changes can be validated in the context of the entire project without impacting production systems. We will use a single set of deployment credentials (like the Prod environment), but models are built in a separate location to avoid impacting others (like the Dev environment).

Your git flow will look like this:
<Lightbox src="/img/best-practices/environment-setup/one-branch-git.png" title="git flow diagram" />

## Prerequisites

As part of your initial dbt Cloud setup, you should already have Development and Production environments configured. Let's recap what each does:

- Your **Development environment** powers the IDE. Each user has individual credentials, and builds into an individual dev schema. Nothing you do here impacts any of your colleagues.
- Your **Production environment** brings the canonical version of your project to life for downstream consumers. There is a single set of deployment credentials, and everything is built into your production schema(s).

## Step 1: Create a new CI environment

See [Create a new environment](/docs/dbt-cloud-environments#create-a-deployment-environment). The environment should be called **CI**. Just like your existing Production environment, it will be a Deployment-type environment.

When setting a Schema in the **Deployment Credentials** area, remember that dbt Cloud will automatically generate a custom schema name for each PR to ensure that they don't interfere with your deployed models. This means you can safely set the same Schema name as your Production job.

## Step 2: Double-check your Production environment is identified

Go into your existing Production environment, and ensure that the **Set as Production environment** checkbox is set. It'll make things easier later.

## Step 3: Create a new job in the CI environment

Use the **Continuous Integration Job** template, and call the job **CI Check**.

In the Execution Settings, your command will be preset to `dbt build --select state:modified+`. Let's break this down:

- [`dbt build`](/reference/commands/build) runs all nodes (seeds, models, snapshots, tests) at once in DAG order. If something fails, nodes that depend on it will be skipped.
- The [`state:modified+` selector](/reference/node-selection/methods#the-state-method) means that only modified nodes and their children will be run ("Slim CI"). In addition to [not wasting time](https://discourse.getdbt.com/t/how-we-sped-up-our-ci-runs-by-10x-using-slim-ci/2603) building and testing nodes that weren't changed in the first place, this significantly reduces compute costs.

To be able to find modified nodes, dbt needs to have something to compare against. dbt Cloud uses the last successful run of any job in your Production environment as its [comparison state](/reference/node-selection/syntax#about-node-selection). As long as you identified your Production environment in Step 2, you won't need to touch this. If you didn't, pick the right environment from the dropdown.

## Step 4: Test your process

That's it! There are other steps you can take to be even more confident in your work, such as [validating your structure follows best practices](/guides/orchestration/set-up-ci/run-dbt-project-evaluator) and [linting your code](/guides/orchestration/set-up-ci/lint-on-push), but this covers the most critical checks.

To test your new flow, create a new branch in the dbt Cloud IDE then add a new file or modify an existing one. Commit it, then create a new Pull Request (not a draft). Within a few seconds, you’ll see a new check appear in your git provider.

## Things to keep in mind

- If you make a new commit while a CI run based on older code is in progress, it will be automatically canceled and replaced with the fresh code.
- An unlimited number of CI jobs can run at once. If 10 developers all commit code to different PRs at the same time, each person will get their own schema containing their changes. Once each PR is merged, dbt Cloud will drop that schema.
- CI jobs will never block a production run.
