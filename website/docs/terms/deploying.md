---
id: deploying
title: Deploying
description: Deploying dbt in production means setting up a system to run a dbt job on a schedule, rather than running dbt commands manually from the command line.
displayText: Deploying
hoverSnippet: Deploying dbt in production means setting up a system to run a dbt job on a schedule, rather than running dbt commands manually from the command line.
---

Deploying dbt in production means setting up a system to run a dbt job on a schedule, rather than running dbt commands manually from the command line. For more details, refer to [Deploy dbt jobs](/docs/deploy/deployments). 



- The complexity involved in creating a new dbt job or editing an existing one.
- Setting up notifications if a step within your job returns an error code (for example, a model can't be built or a test fails).
- Pulling the latest version of your git repo before running dbt (continuous deployment).
- Running and testing your dbt project before merging code into master (continuous integration).
- Allowing access for team members that need to collaborate on your dbt project.
