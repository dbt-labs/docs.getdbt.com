---
title: "Jobs in dbt Cloud"
sidebar_label: "Jobs"
description: "Learn about deploy jobs and continuous integration (CI) jobs in dbt Cloud and what their differences are." 
tags: [scheduler]
---

In dbt Cloud, you can create and set up triggers for these jobs:
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Continuous integration (CI) jobs](/docs/deploy/continuous-integration)  

:::tip Join our beta 

dbt Labs is currently running a beta that provides improved UI updates for setting up deploy jobs and CI jobs. For docs on deploy jobs, refer to [Create and schedule jobs (Beta version)](/docs/deploy/deploy-jobs?version=beta#create-and-schedule-jobs). For docs on CI jobs, refer to [Set up CI jobs (Beta version)](/docs/deploy/ci-jobs?version=beta#set-up-ci-jobs).

If you're interested in joining our beta, please fill out our Google Form to [sign up](https://forms.gle/VxwBD1xjzouE84EQ6).

:::

Below is a comparison table that describes how deploy jobs and CI jobs behave differently:

|  | Deploy Jobs | CI Jobs |
| --- | --- | --- |
| Purpose | Builds production data assets | Builds and tests new code before merging changes into production |
| Trigger types | Triggered by a schedule or by API | Triggered by a webhook from a commit to a PR or by API |
| Destination | Builds into a production database and schema | Builds into a staging database and ephemeral schema, lived for the lifetime of the PR |
| Execution Mode | Runs execute sequentially, so as to not have collisions on the underlying DAG. | Runs execute in parallel to promote team velocity. |
| Efficiency run savings | Detects over scheduled jobs and cancels unnecessary runs to avoid queue clog. | Cancels runs when an in-flight run becomes stale when a new commit is pushed to the pull request. |
| State comparison | Only sometimes needs to detect state | Almost always needs to compare state against the production environment to build on modified code and its dependents. |
