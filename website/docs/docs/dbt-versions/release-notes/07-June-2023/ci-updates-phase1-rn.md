---
title: "Update: Improvements to dbt Cloud continuous integration"
description: "dbt Cloud's CI checks now run in parallel, will not block production runs, and stale runs are automatically canceled when a newer commit is pushed."
sidebar_label: "Update: Improvements to continuous integration"
tags: [June-2023, CI]
date: 2023-06-20
sidebar_position: 8
---

dbt Cloud CI is a critical part of the analytics engineering workflow. Large teams rely on process to ensure code quality is high, and they look to dbt Cloud CI to automate testing code changes in an efficient way, enabling speed while keep the bar high. With status checks directly posted to their dbt PRs, developers gain the confidence that their code changes will work as expected in production, and once you’ve grown accustomed to seeing that green status check in your PR, you won’t be able to work any other way.

<Lightbox src="/img/docs/release-notes/ci-checks.png" width="75%" title="CI checks directly from within Git"/>

What separates dbt Cloud CI from other CI providers is its ability to keep track of state of what’s running in your production environment, so that when you run a CI job, only the modified data assets in your pull request and their downstream dependencies get built and tested in a staging schema. dbt Cloud aims to make each CI check as efficient as possible, so as to not waste any data warehouse resources. As soon as the CI run completes, its status posts directly back to the PR in GitHub, GitLab, or Azure DevOps, depending on which Git provider you’re using. Teams can set up guardrails to let only PRs with successful CI checks be approved for merging, and the peer review process is greatly streamlined because dbt Cloud does the first testing pass. 

We're excited to introduce a few critical capabilities to dbt Cloud CI that will improve productivity and collaboration in your team’s testing and integration workflow. As of this week, you can now:

- **Run multiple CI checks in parallel**. If more than one contributor makes changes to the same dbt project in dbt Cloud in short succession, the later arriving CI check no longer has to wait for the first check to complete. Both checks will execute concurrently.

- **Automatically cancel stale CI runs**. If you push multiple commits to the same PR, dbt Cloud will cancel older, now-out-of-date CI checks automatically. No resources wasted on checking stale code.

- **Run CI checks without blocking production runs**. CI checks will no longer consume run slots, meaning you can have as many CI checks running as you want, without impeding your production jobs.

To learn more, refer to [Continuous integration](/docs/deploy/continuous-integration) and [CI jobs](/docs/deploy/ci-jobs).
