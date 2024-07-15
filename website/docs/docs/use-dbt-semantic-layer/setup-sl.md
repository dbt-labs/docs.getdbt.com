---
title: "Set up the dbt Semantic Layer"
id: setup-sl
description: "Seamlessly set up the dbt Semantic Layer in dbt Cloud using intuitive navigation."
sidebar_label: "Set up your Semantic Layer"
tags: [Semantic Layer]
---

With the dbt Semantic Layer, you can centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool.

<VersionBlock lastVersion="1.5">

import DeprecationNotice from '/snippets/_sl-deprecation-notice.md';

<DeprecationNotice />
 
 </VersionBlock>

## Prerequisites

import SetUp from '/snippets/_v2-sl-prerequisites.md';

<SetUp/>

#### Group permissions
- You must be part of the Owner group, and have the correct [license](/docs/cloud/manage-access/seats-and-users) and [permissions](/docs/cloud/manage-access/self-service-permissions) to set up the Semantic Layer at the environment and project level.
  - Enterprise plan:
    - Developer license with Account Admin permissions, or
    - Owner with a Developer license, assigned Project Creator, Database Admin, or Admin permissions.
  - Team plan: Owner with a Developer license.
  - Free trial: You are on a free trial of the Team plan as an Owner, which means you have access to the dbt Semantic Layer.

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

## Related docs

- [Build your metrics](/docs/build/build-metrics-intro)
- [Available integrations](/docs/cloud-integrations/avail-sl-integrations)
- [Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview)
- [Get started with the dbt Semantic Layer](/guides/sl-snowflake-qs)
- [dbt Semantic Layer FAQs](/docs/use-dbt-semantic-layer/sl-faqs)
