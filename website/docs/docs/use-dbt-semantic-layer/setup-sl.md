---
title: "Set up the dbt Semantic Layer"
id: setup-sl
description: "Seamlessly set up the dbt Semantic Layer in dbt Cloud using intuitive navigation."
sidebar_label: "Set up the Semantic Layer"
tags: [Semantic Layer]
pagination_next: "docs/use-dbt-semantic-layer/sl-architecture"
pagination_prev: "guides/sl-snowflake-qs"
---

With the dbt Semantic Layer, you can centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. 

## Prerequisites

import SetUp from '/snippets/_v2-sl-prerequisites.md';

<SetUp/>

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>

<!--
1. Create a new environment in dbt Cloud by selecting **Deploy** and then **Environments**.
2. Select **dbt Version 1.6** (or the latest) and enter your deployment credentials.
3. To configure the new Semantic Layer, you must have a successful run in your new environment. We recommend running `dbt ls` since `dbt build` won’t succeed until you’ve created and defined semantic models and metrics.
4. To enable the dbt Semantic Layer, go to the **Account Settings** page and then select the specific project you want to enable the Semantic Layer for.
5. In the **Project Details** page, select **Configure Semantic Layer.** This will prompt you to enter data platform connection credentials for the Semantic Layer and select the environment where you want to enable the Semantic Layer. We recommend using a less privileged set of credentials when setting up your connection. The semantic layer requires SELECT and CREATE TABLE permissions.
6. After you’ve entered your credentials, you should see connection information that will allow you to connect to downstream tools. If the tool you are using can connect with JDBC, you can save the **JDBC URL** or each of the individual components provided (e.g., environment id, host). Alternatively, if the tool you connect to uses the Semantic Layer GraphQL API, save the GraphQL API host information.
7. Next, go back to the **Project Details** page and select **Generate Service Token** to create a Semantic Layer service token. Save this token for later.
8. You’re done 🎉! The semantic layer should is now enabled for your project. 
-->

## Next steps

- Now that you've set up the dbt Semantic Layer, start querying your metrics with the [available integrations](/docs/cloud-integrations/avail-sl-integrations).
- [Optimize querying performance](/docs/use-dbt-semantic-layer/sl-cache) using declarative caching.
- [Validate semantic nodes in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci) to ensure code changes made to dbt models don't break these metrics.
- If you haven't already, learn how to [build you metrics and semantic models](/docs/build/build-metrics-intro) in your development tool of choice.
- Learn about commonly asked [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs).

## FAQs

<DetailsToggle alt_header="How does caching interact with access controls?">

Cached data is stored separately from the underlying models. If metrics are pulled from the cache, we don’t have the security context applied to those tables at query time.

In the future, we plan to clone credentials, identify the minimum access level needed, and apply those permissions to cached tables.

</DetailsToggle>
