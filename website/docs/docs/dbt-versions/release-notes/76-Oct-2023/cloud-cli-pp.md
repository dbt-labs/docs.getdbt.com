---
title: "New: dbt Cloud CLI in Public Preview"
description: "October 2023: Learn about the new dbt Cloud CLI development experience, now in public preview,"
sidebar_position: 04
sidebar_label: "New: dbt Cloud CLI in Public Preview"
tags: [Oct-2023, CLI, dbt Cloud]
date: 2023-10-17
---

We are excited to announce the dbt Cloud CLI, **unified command line for dbt**, is available in public preview. It’s a local development experience, powered by dbt Cloud.  It’s easy to get started:  `pip3 install dbt` or `brew install dbt` and you’re ready to go.

We will continue to invest in the dbt Cloud IDE as the easiest and most accessible way to get started using dbt, especially for data analysts who have never developed software using the command line before. We will keep improving the speed, stability, and feature richness of the IDE, as we have been [all year long](https://www.getdbt.com/blog/improvements-to-the-dbt-cloud-ide/).

We also know that many people developing in dbt have a preference for local development, where they can use their favorite terminal, text editor, keybindings, color scheme, and so on. This includes people with data engineering backgrounds, as well as those analytics engineers who started writing code in the dbt Cloud IDE and have expanded their skills. 

The new dbt Cloud CLI offers the best of both worlds, including: 

- The power of developing against the dbt Cloud platform 
- The flexibility of your own local setup

Run whichever community-developed plugins, pre-commit hooks, or other arbitrary scripts you like.

Some of the unique capabilities of this dbt Cloud CLI include:

- Automatic deferral of build artifacts to your Cloud project's production environment
- Secure credential storage in the dbt Cloud platform
- Support for dbt Mesh ([cross-project `ref`](/docs/collaborate/govern/project-dependencies))
- Development workflow for dbt Semantic Layer
- Speedier, lower cost builds

Refer to [dbt Cloud CLI](/docs/cloud/cloud-cli-installation) to learn more.
