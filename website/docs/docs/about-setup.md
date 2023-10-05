---
title: About dbt setup
id: about-setup
description: "About setup of dbt Core and Cloud"
sidebar_label: "About dbt setup"
pagination_next: "docs/environments-in-dbt"
pagination_prev: null
---

dbt compiles and runs your analytics code against your data platform, enabling you and your team to collaborate on a single source of truth for metrics, insights, and business definitions. There are two options for deploying dbt:

**dbt Cloud** runs dbt Core in a hosted (single or multi-tenant) environment with a browser-based interface. The intuitive UI will aid you in setting up the various components. dbt Cloud comes equipped with turnkey support for scheduling jobs, CI/CD, hosting documentation, monitoring & alerting, and an integrated developer environment (IDE).

**dbt Core** is an open-source command line tool that can be installed locally in your environment, and communication with databases is facilitated through adapters.

If you're not sure which is the right solution for you, read our [What is dbt?](/docs/introduction) and our [dbt Cloud features](/docs/cloud/about-cloud/dbt-cloud-features) articles to help you decide. If you still have questions, don't hesitate to [contact us](https://www.getdbt.com/contact/).

To begin configuring dbt now, select the option that is right for you.

<div className="grid--2-col">

<Card
    title="dbt Cloud setup"
    body="Learn how to connect to a data platform, integrate with secure authentication methods, configure a sync with a git repo, and how to use the IDE."
    link="/docs/cloud/about-cloud-setup"
    icon="dbt-bit"/>

<Card
    title="dbt Core installation"
    body="Learn how to connect install dbt Core using Pip, Homebrew, Docker, or the open source repo."
    link="/docs/core/installation"
    icon="dbt-bit"/>

</div>
