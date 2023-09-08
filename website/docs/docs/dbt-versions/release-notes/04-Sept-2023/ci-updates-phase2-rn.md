---
title: "Update: Improvements to dbt Cloud continuous integration"
description: "September 2023: dbt Cloud now has two types of jobs &mdash; deploy jobs and CI jobs &mdash; with streamlined setup and improved efficiency. "
sidebar_label: "Update: Improvements to dbt jobs"
tags: [Sept-2023, CI]
date: 2023-09-11
sidebar_position: 10
---

dbt Labs have separated out [deploy jobs](/docs/deploy/deploy-jobs), used to build production data assets, and [CI jobs](/docs/deploy/ci-jobs), used to check code changes, into two distinct types of jobs. These jobs perform fundamentally different tasks, and we’ve been improving the experience of both for you to have better fit for purpose tools. 

Since there are now two types of jobs, instead of one generic type, we can better guide you through the setup flow. Best practices are built into the default settings so you can go from curious to being set up in seconds.

And, we now have more efficient state comparisons on CI checks: Never waste a build or test on code that hasn’t been changed. We now diff between the PR code and what’s running in production more efficiently, with the introduction of deferral to an environment versus a job. To learn more, refer to [Continuous integration in dbt Cloud](/docs/deploy/continuous-integration).

Below is a comparison table that describes how deploy jobs and CI jobs behave differently:

|  | Deploy Jobs | CI Jobs |
| --- | --- | --- |
| Purpose | Builds production data assets. | Builds and tests new code before merging changes into production. |
| Trigger types | Triggered by a schedule or by API. | Triggered by a webhook from a commit to a PR or by API. |
| Destination | Builds into a production database and schema. | Builds into a staging database and ephemeral schema, lived for the lifetime of the PR. |
| Execution mode | Runs execute sequentially, so as to not have collisions on the underlying DAG. | Runs execute in parallel to promote team velocity. |
| Efficiency run savings | Detects over-scheduled jobs and cancels unnecessary runs to avoid queue clog. | Cancels runs when an in-flight run becomes stale when a new commit is pushed to the pull request. |
| State comparison | Only sometimes needs to detect state. | Almost always needs to compare state against the production environment to build on modified code and its dependents. |
