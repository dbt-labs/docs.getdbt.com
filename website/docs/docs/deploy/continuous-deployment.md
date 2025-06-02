---
title: "Continuous deployment in dbt"
sidebar_label: "Continuous deployment"
description: "Learn about continuous deployment (CD) workflows "
---

To help you improve data transformations and ship data products faster, you can run [merge jobs](/docs/deploy/merge-jobs) to implement a continuous deployment (CD) workflow in <Constant name="cloud" />. Merge jobs can automatically build modified models whenever a pull request (PR) merges, making sure the latest code changes are in production. You don't have to wait for the next scheduled job to run to get the latest updates. 

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/cd-workflow.png" width="90%" title="Workflow of continuous deployment in dbt"/>

You can also implement continuous integration (CI) in <Constant name="cloud" />, which can help further to reduce the time it takes to push changes to production and improve code quality. To learn more, refer to [Continuous integration in <Constant name="cloud" />](/docs/deploy/continuous-integration). 


## How merge jobs work

When you set up merge jobs, <Constant name="cloud" /> listens for notifications from your [<Constant name="git" /> provider](/docs/cloud/git/git-configuration-in-dbt-cloud) indicating that a PR has been merged. When <Constant name="cloud" /> receives one of these notifications, it enqueues a new run of the merge job.

You can set up merge jobs to perform one of the following when a PR merges:

| <div style={{width:'350px'}}>Command to run</div> | Usage description |
| -------- | ----------------- | 
| `dbt build --select state:modified+` | (Default) Build the modified data with every merge. <br /><br /><Constant name="cloud" /> builds only the changed data models and anything downstream of it, similar to CI jobs. This helps reduce computing costs and ensures that the latest code changes are always pushed to production.  |
| `dbt compile` | Refresh the applied state for performant (the slimmest) CI job runs. <br /><br /><Constant name="cloud" /> generates the executable SQL (from the source model, test, and analysis files) but does not run it. This ensures the changes are reflected in the manifest for the next time a CI job is run and keeps track of only the relevant changes. | 
