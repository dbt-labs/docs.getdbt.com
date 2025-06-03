---
title: "Visualize downstream exposures"
sidebar_label: "Visualize downstream exposures"
description: "Configure downstream exposures automatically from dashboards and understand how models are used in downstream tools for a richer downstream lineage."
pagination_prev: null
pagination_next:  "docs/explore/data-tile"
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg
---

# Visualize downstream exposures <Lifecycle status="managed,managed_plus" />

<IntroText>
Downstream exposures integrate natively with Tableau (Power BI coming soon) and auto-generate downstream lineage in <Constant name="explorer" /> for a richer experience.
</IntroText>

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. By leveraging downstream [exposures](/docs/build/exposures) automatically, data teams can:

- Gain a better understanding of how models are used in downstream analytics, improving governance and decision-making.
- Reduce incidents and optimize workflows by linking upstream models to downstream dependencies.
- Automate exposure tracking for supported BI tools, ensuring lineage is always up to date.
- [Orchestrate exposures](/docs/cloud-integrations/orchestrate-exposures) to refresh the underlying data sources during scheduled dbt jobs, improving timeliness and reducing costs. Orchestrating exposures is essentially a way to ensure that your BI tools are updated regularly by using the [<Constant name="cloud" /> job scheduler](/docs/deploy/deployments).
  - For more info on the differences between visualizing and orchestrating exposures, see [Visualize and orchestrate downstream exposures](/docs/cloud-integrations/downstream-exposures).

To configure downstream exposures automatically from dashboards in Tableau, prerequisites, and more &mdash; refer to [Configure downstream exposures](/docs/cloud-integrations/downstream-exposures-tableau).

### Supported plans

Downstream exposures is available on all <Constant name="cloud" /> [Enterprise-tier plans](https://www.getdbt.com/pricing/). Currently, you can only connect to a single Tableau site on the same server.

:::info Tableau Server
If you're using Tableau Server, you need to [allowlist <Constant name="cloud" />'s IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for your <Constant name="cloud" /> region.
:::

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>
