---
title: About dbt installation
id: about-dbt-install
description: "Learn how to install dbt in local environments"
sidebar_label: "About dbt installation"
pagination_next: "docs/core/dbt-core-environments"
pagination_prev: null
---

<Constant name="dbt" /> enables data teams to transform data using analytics engineering best practices. Choose your local development experience from these tools:

**Local command line interface (CLI)**
- Leverage the speed and scale of the <Constant name="fusion_engine" /> or use <Constant name="core" />:
  - [Install dbt Core](/docs/core/installation-overview) &mdash; Uses the Python-based <Constant name="core" /> engine for traditional workflows. Does not include <Term id="lsp"/> features found in the dbt VS Code extension like autocomplete, hover insights, lineage, and more. 
  - [Install dbt Fusion CLI](/docs/fusion/install-fusion-cli) &mdash; Provides Fusion performance benefits (faster parsing, compilation, execution) but does not include <Term id="lsp"/> features.

**dbt VS Code extension**
- [Install the official dbt VS Code extension](/docs/install-dbt-extension) which combines <Constant name="fusion_engine" /> performance with visual <Term id="lsp"/> features when developing locally to make dbt development smoother and more efficient.

## Getting started

 After installing your local development experience, you can get started:

- Explore a detailed first-time setup guide for [dbt Fusion engine](/guides/fusion?step=1).
- [Connect to a data platform](/docs/core/connect-data-platform/about-core-connections).
- Learn [how to run your dbt projects](/docs/running-a-dbt-project/run-your-dbt-projects).

If you're interested in using the <Constant name="dbt_platform" />, our feature-rich, browser-based UI, you can learn more in [About dbt set up](/docs/cloud/about-cloud-setup).

