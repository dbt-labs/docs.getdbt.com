---
title: "Fix: Custom branches"
description: "October 2023: CI job runs now default to the main branch of the Git repository when a custom branch isn't set"
sidebar_label: "Fix: Custom branches"
tags: [Oct-2023]
date: 2023-10-06
sidebar_position: 09
---

If you don't set a [custom branch](/docs/dbt-cloud-environments#custom-branch-behavior) for your dbt Cloud environment, it now defaults to the `main` branch of your Git repository. Previously, [CI jobs](/docs/deploy/ci-jobs) would run for pull requests (PRs) that were opened against any branch if **Custom Branch** wasn't set. 


