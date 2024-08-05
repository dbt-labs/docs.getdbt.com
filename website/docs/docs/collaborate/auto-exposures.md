---
title: "Auto-exposures"
sidebar_label: "Auto-exposures"
description: "Import and auto-generate exposures from dashboards and understand how models are used in downstream tools for a richer lineage."
---

# About auto-exposures <Lifecycle status='beta' />


As a data team, it’s critical that you have context into the downstream use cases and users of your data products. Auto-exposures integrates natively with Tableau (Power BI coming soon) and auto-generates downstream lineage in dbt Explorer for a richer experience.

:::info Available in beta
Auto-exposures is currently in beta. If you have any feedback or would like to take part in the beta, please reach out to your account manager.
:::

Auto-exposures help data teams optimize their efficiency and ensure data quality by:

- Helping users understand how their models are used in downstream analytics tools to inform investments and reduce incidents — ultimately building trust and confidence in data products.
- Importing and auto-generating exposures based on Tableau dashboards, with user-defined curation.
- Enabling the active exposure work to run models based on when exposures are updated or need to be updated, improving timeliness and reducing costs.

Auto-exposures is available to [dbt Cloud Enterprise plans](https://www.getdbt.com/pricing/).

For more info on how to set up auto-exposures, [prerequisites](/docs/cloud-integrations/configure-auto-exposures#prerequisites), and more &mdash; refer to [configure auto-exposures in dbt Cloud](/docs/cloud-integrations/configure-auto-exposures)

import ViewExposures from '/snippets/_auto-exposures-view.md';

<ViewExposures/>
