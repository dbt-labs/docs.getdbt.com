---
title: "New: Support for Git repository caching"
description: "November 2023: New option in dbt Cloud to enable Git repository caching for your job runs."
sidebar_label: "New: Support for Git repository caching"
sidebar_position: 07
tags: [Nov-2023]
date: 2023-11-29
---

Now available in dbt Cloud is a new option to enable Git repository caching for your job runs. When enabled, it tells dbt Cloud to cache your dbt project's Git repository and to use the cached copy instead if there's an outage with the Git provider. This feature helps improve the reliability and stability of your job runs. 

To learn more, refer to [Repo caching](/docs/deploy/deploy-environments#repo-caching).

<Lightbox src="/img/docs/deploy/example-repo-caching.png" width="85%" title="Example of the Repository caching option" />