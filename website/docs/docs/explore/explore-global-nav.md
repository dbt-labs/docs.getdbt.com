---
title: "Global navigation"
sidebar_label: "Global navigation"
id: global-navigation
description: "Learn how to enable and use global navigation to search, explore, and analyze data assets across all your dbt projects and connected metadata sources."

---

# Global navigation <Lifecycle status='self_service,managed,managed_plus' /> <Lifecycle status="preview" />

<IntroText>Search, explore, and analyze data assets across all your dbt projects and connected metadata sources. Discover cross-project lineage, data discovery, and unified analytics governance.</IntroText>


**Plan availability**

Global navigation search varies depending on your [<Constant name="dbt_platform" />](https://www.getdbt.com/pricing) plan:
- Enterprise plans &mdash; <Constant name="catalog" /> lets you search across all [dbt resources](/docs/build/projects)
 (models, seeds, snapshots, sources, exposures, and more) in your account, plus discover external metadata.
 - Starter plans (single project) &mdash; Use global navigation to search and navigate resources within your project 

<LoomVideo id="ae93b3d241cd439fbe5f98f5e6872113" />

## About Global navigation

Global navigation in <Constant name="catalog" /> lets you search, explore, and analyze data assets across all your dbt projects and connected metadata sources—giving you a unified, account-wide view of your analytics ecosystem. With global navigation, you can:

- Search data assets &mdash; expand your search by including dbt resources (models, seeds, snapshots, sources, exposures, and more) across your entire account. This broadens the results returned and gives you greater insight into all the assets across your dbt projects.
    - External metadata ingestion &mdash; connect directly to your data warehouse, giving you visibility into tables, views, and other resources that aren't defined in dbt with <Constant name="catalog" />.
- Explore lineage &mdash; explore an interactive map of data relationships across all your dbt projects. It lets you:
    - View upstream/downstream dependencies for models, sources, and more.
    - Drill into project and column-level lineage, including multi-project (Mesh) links.
    - Filter with "lineage lenses" by resource type, materialization, layer, or run status.
    - Troubleshoot data issues by tracing root causes and downstream impacts.
    - Optimize pipelines by spotting slow, failing, or unused parts of your DAG.
- See recommendations &mdash; global navigation offers a project-wide snapshot of dbt health, highlighting actionable tips to enhance your analytics engineering. These insights are automatically generated using <Constant name="dbt" /> metadata and best practices from the project evaluator ruleset.
- View model query history &mdash; see how often each dbt model is queried in your warehouse, helping you:
    - Track real usage via successful `SELECT`s (excluding builds/tests)
    - Identify most/least used models for optimization or deprecation
    - Guide investment and maintenance with data-driven insights
- Track downstream exposures &mdash; monitor how your dbt models and sources are used by BI tools, apps, ML models, and reports across all connected projects

