---
id: deploying
title: Deploying
description: Deploying dbt in production means setting up a system to run a dbt job on a schedule, rather than running dbt commands manually from the command line.
displayText: Deploying, deploying
hoverSnippet: Deploying dbt in production means setting up a system to run a dbt job on a schedule, rather than running dbt commands manually from the command line.
---

Deploying dbt in production means setting up a system to run a dbt job on a schedule, rather than running dbt commands manually from the command line.

Your production dbt jobs should create the tables and <Term id="view">views</Term> that your business intelligence tools and end users query. Before continuing, make sure you understand dbt's approach to [managing environments](/docs/collaborate/environments/environments-in-dbt).

In addition to setting up a schedule, there are other considerations when setting up dbt to run in production:

- The complexity involved in creating a new dbt job or editing an existing one.
- Setting up notifications if a step within your job returns an error code (for example, a model can't be built or a test fails).
- Accessing logs to help debug any issues.
- Pulling the latest version of your git repo before running dbt (continuous deployment).
- Running and testing your dbt project before merging code into master (continuous integration).
- Allowing access for team members that need to collaborate on your dbt project.
