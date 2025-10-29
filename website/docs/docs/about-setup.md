---
title: About dbt setup
id: about-setup
description: "About setup of dbt locally and on the dbt platform"
sidebar_label: "About dbt setup"
pagination_next: "docs/environments-in-dbt"
pagination_prev: null
---

dbt compiles and runs your analytics code against your data platform, enabling you and your team to collaborate on a single source of truth for metrics, insights, and business definitions. There are two options for deploying dbt:

- **<Constant name="dbt_platform" />** (formerly dbt Cloud) runs the <Constant name="fusion_engine" /> or <Constant name="core" /> in a hosted (single or multi-tenant) environment with a browser-based interface. The intuitive user interface aids you in setting up the various components. <Constant name="cloud" /> comes equipped with turnkey support for scheduling jobs, CI/CD, hosting documentation, monitoring, and alerting. It also offers an integrated development environment (<Constant name="cloud_ide" />) and allows you to develop and run dbt commands from your local command line (CLI) or code editor.

- **<Constant name="core" />** is an open-source command line tool that you can install locally in your environment, and communication with databases is facilitated through adapters.

If you're not sure which is the right solution for you, read our [What is dbt?](/docs/introduction) and our [<Constant name="cloud" /> features](/docs/cloud/about-cloud/dbt-cloud-features) articles to help you decide. If you still have questions, don't hesitate to [contact us](https://www.getdbt.com/contact/).

To begin configuring dbt now, select the option that is right for you.

<div className="grid--2-col">

<Card
    title="dbt platform setup"
    body="Learn how to connect to a data platform, integrate with secure authentication methods, and configure a sync with a git repo."
    link="/docs/cloud/about-cloud-setup"
    icon="dbt-bit"/>

<Card
    title="dbt local setup"
    body="Learn how to set up dbt locally using the dbt VS Code extension or CLI."
    link="/docs/about-dbt-install"
    icon="dbt-bit"/>

</div>
