---
title: "Auto-exposures"
sidebar_label: "Auto-exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
pagination_prev: null
pagination_next:  "docs/collaborate/data-tile"
image: /img/docs/cloud-integrations/auto-exposures/explorer-lineage.jpg
---

# Auto-exposures <Lifecycle status="preview,enterprise" />

As a data team, it’s critical that you have context into the downstream use cases and users of your data products. Auto-exposures integrates natively with Tableau (Power BI coming soon) and auto-generates downstream lineage in dbt Explorer for a richer experience.

Auto-exposures helps users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products. It imports and auto-generates exposures based on Tableau dashboards, with user-defined curation.

Auto-exposures is available on [Versionless](/docs/dbt-versions/versionless-cloud) and on [dbt Cloud Enterprise](https://www.getdbt.com/pricing/) plans.

For more information on how to set up auto-exposures, prerequisites, and more &mdash; refer to [configure auto-exposures in Tableau and dbt Cloud](/docs/cloud-integrations/configure-auto-exposures).

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>
