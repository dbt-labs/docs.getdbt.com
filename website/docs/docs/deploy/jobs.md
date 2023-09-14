---
title: "Jobs in dbt Cloud"
sidebar_label: "Jobs"
description: "Learn about deploy jobs and continuous integration (CI) jobs in dbt Cloud and what their differences are." 
tags: [scheduler]
---

In dbt Cloud, there are two types of jobs: 
- [Deploy jobs](/docs/deploy/deploy-jobs) &mdash; To create and set up triggers for building production data assets
- [Continuous integration (CI) jobs](/docs/deploy/continuous-integration) &mdash; To create and set up triggers for checking code changes

Below is a comparison table that describes how deploy jobs and CI jobs behave differently:

|  | Deploy Jobs | CI Jobs |
| --- | --- | --- |
| Purpose | Builds production data assets. | Builds and tests new code before merging changes into production. |
| Trigger types | Triggered by a schedule or by API. | Triggered by a commit to a PR or by API. |
| Destination | Builds into a production database and schema. | Builds into a staging database and ephemeral schema, lived for the lifetime of the PR. |
| Execution mode | Runs execute sequentially, so as to not have collisions on the underlying DAG. | Runs execute in parallel to promote team velocity. |
| Efficiency run savings | Detects over-scheduled jobs and cancels unnecessary runs to avoid queue clog. | Cancels existing runs when a newer commit is pushed to avoid redundant work. |
| State comparison | Only sometimes needs to detect state. | Almost always needs to compare state against the production environment to build on modified code and its dependents. |