---
title: "June 2023 product docs updates"
description: "June 2023: The Product docs team merged 132 PRs, made various updates to dbt Cloud and Core, such as the Deploy sidebar, Supported platforms page, added a landing page on the References section, added an ADO example to the CI/CD guide, and more"
sidebar_label: "Update: Product docs changes"
tags: [June-2023, product-docs]
date: 2023-07-04
sidebar_position: 10
---

Hello from the dbt Docs team: @mirnawong1, @matthewshaver, @nghi-ly, and @runleonarun! First, we’d like to thank the 17 new community contributors to docs.getdbt.com &mdash; ✨ @aaronbini, @sjaureguimodo, @aranke, @eiof, @tlochner95, @mani-dbt, @iamtodor, @monilondo, @vrfn, @raginjason, @AndrewRTsao, @MitchellBarker, @ajaythomas, @smitsrr, @leoguyaux, @GideonShils, @michaelmherrera!

Here's what's new to [docs.getdbt.com](http://docs.getdbt.com/) in June:

## ☁ Cloud projects

- We clarified the nuances of [CI and CI jobs](/docs/deploy/continuous-integration), updated the [Scheduler content](/docs/deploy/job-scheduler), added two new pages for the job settings and run visibility, moved the project state page to the [Syntax page](/reference/node-selection/syntax), and provided a landing page for [Deploying with Cloud](/docs/deploy/jobs) to help readers navigate the content better.
- We reformatted the [Supported data platforms page](/docs/supported-data-platforms) by adding dbt Cloud to the page, splitting it into multiple pages, using cards to display verified adapters, and moving the [Warehouse setup pages](/docs/core/connect-data-platform/about-core-connections) to the Docs section. 
- We launched a new [Lint and format page](/docs/cloud/dbt-cloud-ide/lint-format), which highlights the awesome new dbt Cloud IDE linting/formatting function.
- We enabled a connection between [dbt Cloud release notes](/docs/dbt-versions/dbt-cloud-release-notes) and the dbt Slack community. This means new dbt Cloud release notes are automatically sent to the slack community [#dbt-cloud channel](https://getdbt.slack.com/archives/CMZ2V0X8V) via RSS feed, keeping users up to date with changes that may affect them. 
- We’ve added two new docs links in the dbt Cloud Job settings user interface (UI). This will provide additional guidance and help users succeed when setting up a dbt Cloud job: [job commands](/docs/deploy/job-commands) and job triggers.    
- We added information related to the newly created [IT license](/docs/cloud/manage-access/about-user-access#license-based-access-control), available for Team and Enterprise plans. 
- We added a new [Supported browser page](/docs/cloud/about-cloud/browsers), which lists the recommended browsers for dbt Cloud.
- We launched a new page informing users of [new Experimental features option](/docs/dbt-versions/experimental-features) in dbt Cloud.
- We worked with dbt Engineering to help publish new beta versions of the dbt [dbt Cloud Administrative API docs](/docs/dbt-cloud-apis/admin-cloud-api). 


## 🎯 Core projects

- We launched the new [MetricFlow docs](/docs/build/build-metrics-intro) on dbt Core v1.6 beta.
- Split [Global configs](reference/global-configs/about-global-configs) into individual pages, making it easier to find, especially using search. 


## New 📚 Guides, ✏️ blog posts, and FAQs

- Add an Azure DevOps example to the in the [Customizing CI/CD with Custom Pipelines](/guides/custom-cicd-pipelines) guide.
