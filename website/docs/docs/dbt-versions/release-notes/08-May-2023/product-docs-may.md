---
title: "May 2023 product docs updates"
id: "May-product-docs"
description: "May 2023: Find out what the product docs team has been busy doing in the month of May."
sidebar_label: "Update: Product docs changes"
sidebar_position: 1
tags: [May-2023, product-docs]
date: 2023-06-01
---

Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! First, we’d like to thank the 13 new community contributors to docs.getdbt.com!

Here's what's new to [docs.getdbt.com](http://docs.getdbt.com/) in May:

## 🔎 Discoverability

- We made sure everyone knows that Cloud-users don’t need a [profiles.yml file](/docs/core/connect-data-platform/profiles.yml) by adding a callout on several key pages.
- Fleshed out the [model jinja variable page](/reference/dbt-jinja-functions/model), which originally lacked conceptual info and didn’t link to the schema page.
- Added a new [Quickstarts landing page](/guides). This new format sets up for future iterations that will include filtering! But for now, we are excited you can step through quickstarts in a focused way.

## ☁ Cloud projects

- We launched [dbt Cloud IDE user interface doc](/docs/cloud/dbt-cloud-ide/ide-user-interface), which provides a thorough walkthrough of the IDE UI elements and their definitions.
- Launched a sparkling new [dbt Cloud Scheduler page](/docs/deploy/job-scheduler) ✨! We went from previously having little content around the scheduler to a subsection that breaks down the awesome scheduler features and how it works.
- Updated the [dbt Cloud user license page](/docs/cloud/manage-access/seats-and-users#licenses) to clarify how to add or remove cloud users.
- Shipped these Discovery API docs to coincide with the launch of the Discovery API:
    - [About the Discovery API](/docs/dbt-cloud-apis/discovery-api)
    - [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
    - [Query the Discovery API](/docs/dbt-cloud-apis/discovery-querying)

## 🎯 Core projects

- See what’s coming up [in Core v 1.6](https://github.com/dbt-labs/docs.getdbt.com/issues?q=is%3Aissue+label%3A%22dbt-core+v1.6%22)!
- We turned the `profiles.yml` [page](/docs/core/connect-data-platform/profiles.yml) into a landing page, added more context to profile.yml page, and moved the ‘About CLI’ higher up in the `Set up dbt` section.

## New 📚 Guides, ✏️ blog posts, and FAQs

If you want to contribute to a blog post, we’re focusing on content

- Published a blog post: [Accelerate your documentation workflow: Generate docs for whole folders at once](/blog/generating-dynamic-docs-dbt)
- Published a blog post: [Data engineers + dbt v1.5: Evolving the craft for scale](/blog/evolving-data-engineer-craft)
- Added an [FAQ](/faqs/Warehouse/db-connection-dbt-compile) to clarify the common question users have on *Why does dbt compile needs to connect to the database?*
- Published a [discourse article](https://discourse.getdbt.com/t/how-to-configure-external-user-email-notifications-in-dbt-cloud/8393) about configuring job notifications for non-dbt Cloud users
