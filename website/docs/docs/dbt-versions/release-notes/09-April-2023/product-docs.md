---
title: "April 2023 product docs updates"
id: "april-product-docs"
description: "April 2023: "
sidebar_label: "Update: product docs changes"
sidebar_position: 8
tags: [Apr-2023, product-docs]
---

Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! We want to share some highlights introduced to docs.getdbt.com in the last month:

## 🔎 Discoverability

- [API docs](/docs/dbt-cloud-apis/overview) now live in the left sidebar to improve discoverability.
- [The deploy dbt jobs sidebar](/docs/deploy/deployments) has had a glow up 💅 that splits the ‘about deployment’ into two paths (deploy w dbt cloud and deploy w other tools), adds more info about the dbt cloud scheduler, its features, and how to create a job, adds ADF deployment guidance. We hope the changes improve the user experience and provide users with guidance when deploying with other tools.

## ☁ Cloud projects

- Added Starburst/Trino adapter docs, including:
  * [dbt Cloud quickstart guide](/guides/starburst-galaxy), 
  * [connection page](/docs/cloud/connect-data-platform/connect-starburst-trino), 
  * [set up page](/docs/core/connect-data-platform/trino-setup), and [config page](/reference/resource-configs/trino-configs). 
- Enhanced [dbt Cloud jobs page](/docs/deploy/jobs) and section to include conceptual info on the queue time, improvements made around it, and about failed jobs. 
- Check out the April dbt [Cloud release notes](/docs/dbt-versions/dbt-cloud-release-notes)

## 🎯 Core projects 

- Clearer descriptions in the [Jinja functions page](/reference/dbt-jinja-functions), that improve content for each card. 
- [1.5 Docs](/docs/dbt-versions/core-upgrade/upgrading-to-v1.5) have been released as an RC! 
- See the beautiful [work captured in Core v 1.5](https://github.com/dbt-labs/docs.getdbt.com/issues?q=is%3Aissue+label%3A%22dbt-core+v1.5%22+is%3Aclosed).

## New 📚 Guides and ✏️ blog posts

- [Use Databricks workflows to run dbt Cloud jobs](/guides/orchestration/how-to-use-databricks-workflows-to-run-dbt-cloud-jobs)
- [Refresh Tableau workbook with extracts after a job finishes](/guides/orchestration/webhooks/zapier-refresh-tableau-workbook)
- [dbt Python Snowpark workshop/tutorial](/guides/dbt-ecosystem/dbt-python-snowpark/1-overview-dbt-python-snowpark)
- [How to optimize and troubleshoot dbt Models on Databricks](/guides/dbt-ecosystem/databricks-guides/how_to_optimize_dbt_models_on_databricks)
- [The missing guide to debug() in dbt](https://docs.getdbt.com/blog/guide-to-jinja-debug)
- [dbt Squared: Leveraging dbt Core and dbt Cloud together at scale](https://docs.getdbt.com/blog/dbt-squared)
- [Audit_helper in dbt: Bringing data auditing to a higher level](https://docs.getdbt.com/blog/audit-helper-for-migration)
