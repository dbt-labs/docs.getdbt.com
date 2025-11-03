---
title: "Administer the Semantic Layer"
id: setup-sl
description: "Seamlessly set up the credentials and tokens to start querying the dbt Semantic Layer."
sidebar_label: "Administer the Semantic Layer"
tags: [Semantic Layer]
pagination_next: "docs/use-dbt-semantic-layer/sl-architecture"
pagination_prev: "guides/sl-snowflake-qs"
---

# Administer the Semantic Layer <Lifecycle status="self_service,managed,managed_plus" />

With the dbt <Constant name="semantic_layer" />, you can centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. This topic shows you how to set up credentials and tokens so that other tools can query the <Constant name="semantic_layer" />.

:::info Not yet supported in the dbt Fusion engine
<Constant name="semantic_layer" /> is currently supported in the <Constant name="dbt_platform" /> for environments running versions of <Constant name="core" />. Support for environments on the dbt Fusion engine is coming soon.
:::

## Prerequisites

import SetUp from '/snippets/_v2-sl-prerequisites.md';

<SetUp/>

import SLCourses from '/snippets/_sl-course.md';

<SLCourses/>

## Administer the Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>

<!--
1. Create a new environment in <Constant name="cloud" /> by selecting **Deploy** and then **Environments**.
2. Select **dbt Version 1.6** (or the latest) and enter your deployment credentials.
3. To configure the new Semantic Layer, you must have a successful run in your new environment. We recommend running `dbt ls` since `dbt build` won’t succeed until you’ve created and defined semantic models and metrics.
4. To enable the <Constant name="semantic_layer" />, go to the **Account Settings** page and then select the specific project you want to enable the <Constant name="semantic_layer" /> for.
5. In the **Project Details** page, select **Configure <Constant name="semantic_layer" />.** This will prompt you to enter data platform connection credentials for the <Constant name="semantic_layer" /> and select the environment where you want to enable the <Constant name="semantic_layer" />. We recommend using a less privileged set of credentials when setting up your connection. The semantic layer requires SELECT and CREATE TABLE permissions.
6. After you've entered your credentials, you should see connection information that will allow you to connect to downstream tools. If the tool you are using can connect with JDBC, you can save the **JDBC URL** or each of the individual components provided (for example, environment id, host). Alternatively, if the tool you connect to uses the <Constant name="semantic_layer" /> GraphQL API, save the GraphQL API host information.
7. Next, go back to the **Project Details** page and select **Generate Service Token** to create a <Constant name="semantic_layer" /> service token. Save this token for later.
8. You’re done 🎉! The semantic layer should is now enabled for your project. 
-->

## Next steps

- Now that you've set up your credentials and tokens, start querying your metrics with the [available integrations](/docs/cloud-integrations/avail-sl-integrations).
- [Optimize querying performance](/docs/use-dbt-semantic-layer/sl-cache) using declarative caching.
- [Validate semantic nodes in CI](/docs/deploy/ci-jobs#semantic-validations-in-ci) to ensure code changes made to dbt models don't break these metrics.
- If you haven't already, learn how to [build you metrics and semantic models](/docs/build/build-metrics-intro) in your development tool of choice.
- Learn about commonly asked [<Constant name="semantic_layer" /> FAQs](/docs/use-dbt-semantic-layer/sl-faqs).

## FAQs

<DetailsToggle alt_header="How does caching interact with access controls?">

Cached data is stored separately from the underlying models. If metrics are pulled from the cache, we don’t have the security context applied to those tables at query time.

In the future, we plan to clone credentials, identify the minimum access level needed, and apply those permissions to cached tables.

</DetailsToggle>
