---
title: "New: Support for Git repository caching"
description: "November 2023: dbt Cloud can cache your project's code (as well as other dbt packages) to ensure runs can begin despite an upstream Git provider's outage."
sidebar_label: "New: Support for Git repository caching"
sidebar_position: 07
tags: [Nov-2023]
date: 2023-11-29
---

Now available for dbt Cloud Enterprise plans is a new option to enable Git repository caching for your job runs. When enabled, dbt Cloud caches your dbt project's Git repository and uses the cached copy instead if there's an outage with the Git provider. This feature improves the reliability and stability of your job runs. 

To learn more, refer to [Repo caching](/docs/deploy/deploy-environments#git-repository-caching).

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Repository caching option" />