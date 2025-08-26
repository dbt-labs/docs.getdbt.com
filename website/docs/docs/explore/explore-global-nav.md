---
title: "Global navigation"
sidebar_label: "Global navigation"
id: global-navigation
description: "Learn how to enable and use global navigation to search, explore, and analyze data assets across all your dbt projects and connected metadata sources."

---

# Global navigation <Lifecycle status='self_service,managed,managed_plus' /> <Lifecycle status="preview" />

<IntroText>Learn how to enable and use global navigation in <Constant name="explorer" /> to search, explore, and analyze data assets across all your dbt projects and connected metadata sources. Discover cross-project lineage, data discovery, and unified analytics governance.</IntroText>


For enterprise plans, <Constant name="explorer" /> introduces the ability to widen your search by including dbt resources (models, seeds, snapshots, sources, exposures, and more) across your entire account, and the option to discover external metadata. For Starter plans (single project), you’ll still benefit from the new navigation and search experience within your project.

<LoomVideo id="ae93b3d241cd439fbe5f98f5e6872113" />

## Prerequisites

To enable global navigation:

- Have a [developer license with Owner](/docs/cloud/manage-access/about-user-access#role-based-access-control) permissions.
- Navigate to your [account settings](/docs/cloud/account-settings) in your <Constant name="cloud" /> account and check the box to **Enable dbt Catalog’s (formerly dbt Explorer) New Navigation**.


## About Global navigation

Global navigation in <Constant name="explorer" /> lets you search, explore, and analyze data assets across all your dbt projects and connected metadata sources—giving you a unified, account-wide view of your analytics ecosystem. With global navigation, you can:

- Search data assets &mdash; expand your search by including dbt resources (models, seeds, snapshots, sources, exposures, and more) across your entire account. This broadens the results returned and gives you greater insight into all the assets across your dbt projects.
    - External metadata ingestion &mdash; connect directly to your data warehouse, giving you visibility into tables, views, and other resources that aren't defined in dbt with <Constant name="explorer" />.
- Explore lineage &mdash; explore an interactive map of data relationships across all your dbt projects. It lets you:
    - View upstream/downstream dependencies for models, sources, and more.
    - Drill into project and column-level lineage, including multi-project (Mesh) links.
    - Filter with "lineage lenses" by resource type, materialization, layer, or run status.
    - Troubleshoot data issues by tracing root causes and downstream impacts.
    - Optimize pipelines by spotting slow, failing, or unused parts of your DAG.
- See recommendations &mdash; global navigation offers a project-wide snapshot of dbt health, highlighting actionable tips to enhance your analytics engineering. These insights are automatically generated using <Constant name="cloud" /> metadata and best practices from the project evaluator ruleset.
- View model query history &mdash; see how often each dbt model is queried in your warehouse, helping you:
    - Track real usage via successful `SELECT`s (excluding builds/tests)
    - Identify most/least used models for optimization or deprecation
    - Guide investment and maintenance with data-driven insights
- Track downstream exposures &mdash; monitor how your dbt models and sources are used by BI tools, apps, ML models, and reports across all connected projects

