---
title: "How to integrate with dbt"
description: "This guide will cover the ways to integrate with dbt Cloud"
slug: integrating-with-dbtcloud

authors: [amy_chen]

tags: [dbt Cloud, Integrations, APIs]
hide_table_of_contents: false

date: 2023-12-20
is_featured: false
---
## Overview

Over the course of my three years running the Partner Engineering team at dbt Labs, the most common question I've been asked is, How do we integrate with dbt? Because those conversations often start out at the same place, I decided to create this guide so I’m no longer the blocker to fundamental information. This also allows us to skip the intro and get to the fun conversations so much faster, like what a joint solution for our customers would look like. 

This guide doesn't include how to integrate with dbt Core. If you’re interested in creating a dbt adapter, please check out the [adapter development guide](https://docs.getdbt.com/guides/dbt-ecosystem/adapter-development/1-what-are-adapters) instead.

Instead, we're going to focus on integrating with dbt Cloud. Integrating with dbt Cloud is a key requirement to become a dbt Labs technology partner, opening the door to a variety of collaborative commercial opportunities. 

Here I'll cover how to get started, potential use cases you want to solve for, and points of integrations to do so.

## New to dbt Cloud?

If you're new to dbt and dbt Cloud, we recommend you and your software developers try our [Getting Started Quickstarts](https://docs.getdbt.com/guides) after reading [What is dbt](https://docs.getdbt.com/docs/introduction). The documentation will help you familiarize yourself with how our users interact with dbt. By going through this, you will also create a sample dbt project to test your integration.

If you require a partner dbt Cloud account to test on, we can upgrade an existing account or a trial account. This account may only be used for development, training, and demonstration purposes. Please contact your partner manager if you're interested and provide the account ID (provided in the URL). Our partner account includes all of the enterprise level functionality and can be provided with a signed partnerships agreement.

## Integration points

- [Discovery API (formerly referred to as Metadata API)](https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-api)
    - **Overview** &mdash; This GraphQL API allows you to query the metadata that dbt Cloud generates every time you run a dbt project. We have two schemas available (environment and job level). By default, we always recommend that you integrate with the environment level schema because it contains the latest state and historical run results of all the jobs run on the dbt Cloud project. The job level will only provide you the metadata of one job, giving you only a small snapshot of part of the project.
- [Administrative (Admin) API](https://docs.getdbt.com/docs/dbt-cloud-apis/admin-cloud-api)
    - **Overview** &mdash; This REST API allows you to orchestrate dbt Cloud jobs runs and help you administer a dbt Cloud account. For metadata retrieval, we recommend integrating with the Discovery API instead.
- [Webhooks](https://docs.getdbt.com/docs/deploy/webhooks)
    - **Overview** &mdash; Outbound webhooks can send notifications about your dbt Cloud jobs to other systems. These webhooks allow you to get the latest information about your dbt jobs in real time.
- [Semantic Layers/Metrics](https://docs.getdbt.com/docs/dbt-cloud-apis/sl-api-overview)
    - **Overview** &mdash;  Our Semantic Layer is made up of two parts: metrics definitions and the ability to interactively query the dbt metrics. For more details, here is a [basic overview](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl) and [our best practices](https://docs.getdbt.com/guides/dbt-ecosystem/sl-partner-integration-guide).
    - Metrics definitions can be pulled from the Discovery API (linked above) or the Semantic Layer Driver/GraphQL API. The key difference is that the Discovery API isn't able to pull the semantic graph, which provides the list of available dimensions that one can query per metric. That is only available with the SL Driver/APIs. The trade-off is that the SL Driver/APIs doesn't have access to the lineage of the entire dbt project (that is, how the dbt metrics dependencies on dbt models).
    - Three integration points are available for the Semantic Layer API.

## dbt Cloud hosting and authentication

To use the dbt Cloud APIs, you'll need access to the customer’s access urls. Depending on their dbt Cloud setup, they'll have a different access URL. To find out more, refer to [Regions & IP addresses](https://docs.getdbt.com/docs/cloud/about-cloud/regions-ip-addresses) to understand all the possible configurations. My recommendation is to allow the customer to provide their own URL to simplify support. 

If the customer is on an Azure single tenant instance, they don't currently have access to the Discovery API or the Semantic Layer APIs. 

For authentication, we highly recommend that your integration uses account service tokens. You can read more about [how to create a service token and what permission sets to provide it](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens). Please note that depending on their plan type, they'll have access to different permission sets. We _do not_ recommend that users supply their user bearer tokens for authentication. This can cause issues if the user leaves the organization and provides you access to all the dbt Cloud accounts associated to the user rather than just the account (and related projects) that they want to integrate with. 

## Potential use cases

- Event-based orchestration
    - **Desired action** &mdash; You want to receive information that a scheduled dbt Cloud job has been completed or has kicked off a dbt Cloud job. You can align your product schedule to the dbt Cloud run schedule.
    - **Examples** &mdash; Kicking off a dbt job after the ETL job of extracting and loading the data is completed. Or receiving a webhook after the job has been completed to kick off your reverse ETL job.
    - **Integration points** &mdash; Webhooks and/or Admin API
- dbt lineage
    - **Desired action** &mdash; You want to interpolate the dbt lineage metadata into your tool.
    - **Example** &mdash; In your tool, you want to pull in the dbt DAG into your lineage diagram. For details on what you could pull and how to do this, refer to [Use cases and examples for the Discovery API](https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-use-cases-and-examples).
    - **Integration points** &mdash; Discovery API
- dbt environment/job metadata
    - **Desired action** &mdash; You want to interpolate the dbt Cloud job information into your tool, including the status of the jobs, the status of the tables executed in the run, what tests passed, etc.
    - **Example** &mdash; In your Business Intelligence tool, stakeholders select from tables that a dbt model created. You show the last time the model passed its tests/last run to show that the tables are current and can be trusted. For details on what you could pull and how to do this, refer to [What's the latest state of each model](https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-use-cases-and-examples#whats-the-latest-state-of-each-model).
    - **Integration points** &mdash; Discovery API
- dbt model documentation
    - **Desired action** &mdash; You want to interpolate the dbt project Information, including model descriptions, column descriptions, etc.
    - **Example** &mdash; You want to extract the dbt model description so you can display and help the stakeholder understand what they are selecting from. This way, the creators can easily pass on the information without updating another system. For details on what you could pull and how to do this, refer to [What does this dataset and its columns mean](https://docs.getdbt.com/docs/dbt-cloud-apis/discovery-use-cases-and-examples#what-does-this-dataset-and-its-columns-mean).
    - **Integration points** &mdash; Discovery API

dbt Core only users will have no access to the above integration points. For dbt metadata, oftentimes our partners will create a dbt Core integration by using the [dbt artifact](https://www.getdbt.com/product/semantic-layer/) files generated by each run and provided by the user. With the Discovery API, we are providing a dynamic way to get the latest information parsed out for you.

## dbt Cloud plans & permissions

[The dbt Cloud plan type](https://www.getdbt.com/pricing) will change what the user has access to. There are four different types of plans:

- **Developer** &mdash; This is free and available to one user with a limited amount of successful models built. This plan can't access the APIs, Webhooks, or Semantic Layer and is limited to just one project.
- **Team** &mdash; This plan provides access to the APIs, webhooks, and Semantic Layer. You can have up to eight users on the account and one dbt Cloud Project. This is limited to 15,000 successful models built.
- **Enterprise** (multi-tenant/multi-cell) &mdash; This plan provides access to the APIs, webhooks, and Semantic Layer. You can have more than one dbt Cloud project based on how many dbt projects/domains they have using dbt. The majority of our enterprise customers are on multi-tenant dbt Cloud instances.
- **Enterprise** (single tenant): This plan might have access to the APIs, webhooks, and Semantic Layer. If you're working with a specific customer, let us know and we can confirm if their instance has access.

## FAQs

- What is a dbt Cloud project?
    - A dbt Cloud project is made up of two connections: one to the Git repository and one to the data warehouse/platform. Most customers will have only one dbt Cloud project in their account but there are enterprise clients who might have more depending on their use cases. The project also encapsulates two types of environments at minimal: a development environment and deployment environment.
    - Folks commonly refer to the [dbt project](https://docs.getdbt.com/docs/build/projects) as the code hosted in their Git repository.
- What is a dbt Cloud environment?
    - For an overview, check out [About environments](https://docs.getdbt.com/docs/environments-in-dbt). At a minimum, a project will have one deployment type environment that they will be executing jobs on. The development environment powers the dbt Cloud IDE and Cloud CLI.
- Can we write back to the dbt project?
    - At this moment, we don't have a Write API. A dbt project is hosted in a Git repository, so if you have a Git provider integration, you can manually open a pull request (PR) on the project to maintain the version control process.
- Can you provide column-level information in the lineage?
    - Column-level lineage is currently in beta release with more information to come.
- How do I get a Partner Account?
    - Contact your Partner Manager with your account ID (in your URL).
- Why shouldn't I use the Admin API to pull out the dbt artifacts for metadata?
    - We recommend not integrating with the Admin API to extract the dbt artifacts documentation. This is because the Discovery API provides more extensive information, a user-friendly structure, and a more reliable integration point.
- How do I get access to the dbt brand assets?
    - Check out our [Brand guidelines](https://www.getdbt.com/brand-guidelines/) page. Please make sure you’re not using our old logo (hint: there should only be one hole in the logo). Please also note that the name dbt and the dbt logo are trademarked by dbt Labs, and that use is governed by our brand guidelines, which are fairly specific for commercial uses. If you have any questions about proper use of our marks, please ask your partner manager.
- How do I engage with the partnerships team?
    - Email partnerships@dbtlabs.com.