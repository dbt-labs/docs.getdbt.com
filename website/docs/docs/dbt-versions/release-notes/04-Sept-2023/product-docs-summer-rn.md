---
title: "Summer 2023 product docs updates"
id: "product-docs-summer"
description: "Summer 2023: The Product docs team merged 256 PRs, made various updates to dbt Cloud and Core, such as adding What's New, writing Semantic Layer beta docs, releasing dbt 1.6 docs, and more!"
sidebar_label: "Update: Product docs changes"
tags: [July-2023, Aug-2023, product-docs]
date: 2023-09-07
sidebar_position: 09
---

Hello from dbt's Product Documentation team (the stewards of the docs.getdbt.com site): @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! 

We'd like to recognize all of the docs and support from our partner team, Developer Experience: @jasnonaz @gwenwindflower @dbeatty10 @dataders @joellabes @Jstein77 @dave-connors-3! 

What a busy summer! We merged 256 PRs between July 1st and August 31. We’d like to thank the 22 community members who contributed to the [dbt Product docs](https://docs.getdbt.com) for the 1st time :pray: 

* Based on YOUR feedback, we made the following changes: 
	- [Permissions table](/docs/cloud/manage-access/enterprise-permissions) for Enterprise accounts
	- [Browser session page](/docs/cloud/about-cloud/browsers#browser-sessions) that clarifies dbt Cloud’s browser session time and when it logs users off.<br />
	
	You can reach us most directly by opening a pull request or issue in [our repo](https://github.com/dbt-labs/docs.getdbt.com) or reaching out in the dbt community Slack channel [#dbt-product-docs](https://getdbt.slack.com/archives/C0441GSRU04)).
	
* Added the ability to collapse sections you’re not currently looking at. There were quite a few people who wanted this, and it bugged us too, so we were happy to get this shipped!
* Introduced the idea of [“Trusted” adapters](/docs/supported-data-platforms#types-of-adapters).

## ☁ Cloud projects

* The **What’s new?** product update widget is back in the dbt Cloud UI! The Docs team will begin updating the content to keep you informed about new features.
* Launched the re-released [Semantic Layer beta docs](/docs/use-dbt-semantic-layer/dbt-sl), which introduces users to the new API, new guide to set up MetricFlow and the new Semantic Layer, as well as revamp the ‘Use the dbt Semantic Layer’ section for users.
* Updated [Admin API v2 and v3](/docs/dbt-cloud-apis/admin-cloud-api) to help you understand the differences between them and which version includes the endpoints you use.
* To improve discoverability, the docs team made changes to the [deploy dbt sidebar](/docs/deploy/deployments). We added cards and aligned better with the dbt Cloud UI and the way it’s used.
* Deprecated legacy job schemas in the [Discovery API](/docs/dbt-cloud-apis/discovery-api).
* Added a page to describe [experimental and beta features](/docs/dbt-versions/experimental-features) in dbt Cloud and what you need to know about them.
* Added a section to introduce a new beta feature [**Extended Attributes**](/docs/dbt-cloud-environments#extended-attributes-beta), which allows users to set a flexible `profiles.yml` snippet in their dbt Cloud Environment settings.
## 🎯 Core projects

* We released [dbt 1.6](/guides/migration/versions/upgrading-to-v1.6)! We added docs for the new commands `dbt retry` and `dbt clone`

## New 📚 Guides, ✏️ blog posts, and FAQs
* Check out how these community members use the dbt community in the [Community spotlight](/community/spotlight). 
* Blog posts published this summer include [Optimizing Materialized Views with dbt](/blog/announcing-materialized-views),  [Data Vault 2.0 with dbt Cloud](/blog/data-vault-with-dbt-cloud), and [Create dbt Documentation and Tests 10x faster with ChatGPT](/blog/create-dbt-documentation-10x-faster-with-chatgpt) 
* We now have two new best practice guides: [How we build our metrics](/guides/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) and [Set up Continuous Integration](/guides/orchestration/set-up-ci/overview).
