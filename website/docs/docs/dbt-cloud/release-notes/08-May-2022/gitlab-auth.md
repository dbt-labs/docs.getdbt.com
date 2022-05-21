---
title: "Refresh expired access tokens in the IDE when using GitLab"
id: "gitlab-auth"
description: "Adding support for expiring OAuth access tokens."
sidebar_label: "Enhancement: Refreshing GitLab OAuth Access"
tags: [May-19-2022, v1.1.52]
---

On May 22, GitLab will change their treatment of [OAuth access tokens that don't expire](https://docs.gitlab.com/ee/update/deprecations.html#oauth-tokens-without-expiration). We updated our IDE logic to handle OAuth token expiration more gracefully. Now, after 2 hours of consecutive IDE usage, you will have to re-authenticate in GitLab to refresh your expired OAuth access token.

This additional security layer in the IDE is available only to the dbt Cloud enterprise plan.

