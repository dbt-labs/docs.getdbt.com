---
title: "Jobs in the dbt platform"
sidebar_label: "About jobs"
description: "Learn about the different job types in dbt and what their differences are." 
tags: [scheduler]
pagination_next: "docs/deploy/deploy-jobs"
hide_table_of_contents: true
availability: platform_login
---

:::info
Use the [<Constant name="wizard"/>](/docs/dbt-ai/wizard-ide) to investigate and troubleshoot dbt job and run failures by asking the agent about recent failures, root causes, and fixes &mdash; powered by the `troubleshooting-dbt-job-errors` skill in dbt Agent Skills.
:::

These are the available job types in <Constant name="dbt" />: 
- [Deploy jobs](/docs/deploy/deploy-jobs) &mdash; Build production data assets. Runs on a schedule, by API, or after another job completes.
- [Continuous integration (CI) jobs](/docs/deploy/continuous-integration) &mdash; Test and validate code changes before merging. Triggered by commit to a PR or by API.
- [Merge jobs](/docs/deploy/merge-jobs) &mdash; Deploy merged changes into production. Runs after a successful PR merge or by API.
- [dbt State](/docs/deploy/dbt-state-about) &mdash; Reuse an existing node by cloning it or skipping the rebuild when the logic and data haven't changed.

The following comparison table describes the behaviors of the different job types:

|  | **Deploy jobs** | **CI jobs** | **Merge jobs** | **dbt State** |
| --- | --- | --- | --- | --- |
| Purpose | Builds production data assets. | Builds and tests new code before merging changes into production. | Build merged changes into production or update state for deferral. | Reuse a node when its logic and data haven't changed. Rebuild it only when the result would be different. |
| Trigger types | Triggered by a schedule, API, or the successful completion of another job. | Triggered by a commit to a PR or by API. | Triggered by a successful merge into the environment's branch or by API.| Evaluated on every run. A node is skipped or cloned when its logic is unchanged and upstream data is still within `lag_tolerance`. |
| Destination | Builds into a production database and schema. | Builds into a staging database and ephemeral schema, lived for the lifetime of the PR. | Builds into a production database and schema. | Builds into a production database and schema. |
| Execution mode | Runs execute sequentially, so as to not have collisions on the underlying DAG. | Runs execute in parallel to promote team velocity. | Runs execute sequentially, so as to not have collisions on the underlying DAG. | |
| Efficiency run savings | Detects over-scheduled jobs and cancels unnecessary runs to avoid queue clog. | Cancels existing runs when a newer commit is pushed to avoid redundant work. | N/A | Skips the rebuild, or clones an existing node, when the logic and data haven't changed. |
| State comparison | Only sometimes needs to detect state. | Almost always needs to compare state against the production environment to build on modified code and its dependents. | Almost always needs to compare state against the production environment to build on modified code and its dependents. | |
| Job run duration | Limit is 24 hours. | Limit is 24 hours. | Limit is 24 hours. | Limit is 24 hours. |
