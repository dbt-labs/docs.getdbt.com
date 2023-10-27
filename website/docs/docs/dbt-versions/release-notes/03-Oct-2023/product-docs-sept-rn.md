---
title: "September 2023 product docs updates"
id: "product-docs-sept"
description: "September 2023: The Product docs team merged 107 PRs, made various updates to dbt Cloud and Core, such as GAing continuous integration jobs, Semantic Layer GraphQL API doc, a new community plugin, and more"
sidebar_label: "Update: Product docs changes"
tags: [Sept-2023, product-docs]
date: 2023-10-10
sidebar_position: 09
---

Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! First, we’d like to thank the 15 new community contributors to docs.getdbt.com. We merged [107 PRs](https://github.com/dbt-labs/docs.getdbt.com/pulls?q=is%3Apr+merged%3A2023-09-01..2023-09-31) in September.

Here's what's new to [docs.getdbt.com](http://docs.getdbt.com/):

* Migrated docs.getdbt.com from Netlify to Vercel.

## ☁ Cloud projects
- Continuous integration jobs are now generally available and no longer in beta!
- Added [Postgres PrivateLink set up page](/docs/cloud/secure/postgres-privatelink)
- Published beta docs for [dbt Explorer](/docs/collaborate/explore-projects).
- Added a new Semantic Layer [GraphQL API doc](/docs/dbt-cloud-apis/sl-graphql) and updated the [integration docs](/docs/use-dbt-semantic-layer/avail-sl-integrations) to include Hex. Responded to dbt community feedback and clarified Metricflow use cases for dbt Core and dbt Cloud.
- Added an [FAQ](/faqs/Git/git-migration) describing how to migrate from one git provider to another in dbt Cloud.
- Clarified an example and added a [troubleshooting section](/docs/cloud/connect-data-platform/connect-snowflake#troubleshooting) to Snowflake connection docs to address common errors and provide solutions.


## 🎯 Core projects

- Deprecated dbt Core v1.0 and v1.1 from the docs.
- Added configuration instructions for the [AWS Glue](/docs/core/connect-data-platform/glue-setup) community plugin.
- Revised the dbt Core quickstart, making it easier to follow. Divided this guide into steps that align with the [other guides](/guides/manual-install?step=1).

## New 📚 Guides, ✏️ blog posts, and FAQs

Added a [style guide template](/guides/best-practices/how-we-style/6-how-we-style-conclusion#style-guide-template) that you can copy & paste to make sure you adhere to best practices when styling dbt projects!

## Upcoming changes

Stay tuned for a flurry of releases in October and a filterable guides section that will make guides easier to find!
