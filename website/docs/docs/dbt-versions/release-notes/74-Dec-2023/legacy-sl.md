---
title: "Deprecation: dbt Metrics and the Legacy dbt Semantic Layer  for Git repository caching"
description: "December 2023: dbt Cloud can cache your project's code (as well as other dbt packages) to ensure runs can begin despite an upstream Git provider's outage."
sidebar_label: "Deprecation: Support for Git repository caching"
sidebar_position: 10
date: 2023-12-15
---

Now available for dbt Cloud Enterprise plans is a new option to enable Git repository caching for your job runs. When enabled, dbt Cloud caches your dbt project's Git repository and uses the cached copy instead if there's an outage with the Git provider. This feature improves the reliability and stability of your job runs. 

To learn more, refer to [Repo caching](/docs/deploy/deploy-environments#git-repository-caching).

<Lightbox src="/img/docs/deploy/example-repo-caching.png" width="85%" title="Example of the Repository caching option" />
