---
title: "Fix: Default behavior for CI job runs without a custom branch"
description: "October 2023: CI job runs now default to the main branch of the Git repository when a custom branch isn't set"
sidebar_label: "Fix: Default behavior for CI job runs without a custom branch"
tags: [Oct-2023, CI]
date: 2023-10-06
sidebar_position: 08
---

If you don't set a [custom branch](/docs/dbt-cloud-environments#custom-branch-behavior) for your dbt Cloud environment, it now defaults to the default branch of your Git repository (for example, `main`). Previously, [CI jobs](/docs/deploy/ci-jobs) would run for pull requests (PRs) that were opened against _any branch_ or updated with new commits if the **Custom Branch** option wasn't set. 

## Azure DevOps 

Your Git pull requests (PRs) might not trigger against your default branch if you're using Azure DevOps and the default branch isn't `main` or `master`. To resolve this, [set up a custom branch](/faqs/Environments/custom-branch-settings) with the branch you want to target.  
