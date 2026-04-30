---
title: "dbt products"
id: "dbt-products"
description: "Glossary of major dbt features on the dbt platform and beyond, with lifecycle and plan availability."
sidebar_label: "dbt products"
pagination_prev: null
pagination_next: null
---

You can use this catalog to peruse and acquaint yourself with <Constant name="dbt" />'s many features.

## <Constant name="dbt_platform" />

These features run in or alongside the <Constant name="dbt_platform" />:

**[<Constant name="dbt" /> <Constant name="insights" />](/docs/explore/dbt-insights)** <Lifecycle status="managed,managed_plus" />
<br />Explore and query warehouse data through an interface that combines metadata, docs, and assisted workflows.

**[<Constant name="dbt" /> <Constant name="mesh" />](/docs/mesh/about-mesh)** <Lifecycle status="managed,managed_plus" />
<br />Coordinate multi-project architectures with governance patterns, shared contracts, and cross-project references.

**[Project dependencies](/docs/mesh/govern/project-dependencies)** <Lifecycle status="managed,managed_plus" />
<br />Cross-project refs via the <Constant name="mesh" /> metadata service.

**[State-aware orchestration](/docs/deploy/state-aware-about)** <Lifecycle status="private_preview,managed,managed_plus" />
<br />Orchestration informed by source freshness, model staleness, and code changes to reduce unnecessary rebuilds.

**[Advanced CI](/docs/deploy/advanced-ci)** <Lifecycle status="managed,managed_plus" />
<br />CI enhancements for pull-request workflows.

**[APIs overview](/docs/dbt-apis/overview)** <Lifecycle status="self_service,managed,managed_plus" />
<br />REST and GraphQL APIs for administration, Discovery, the <Constant name="semantic_layer" />, and automation.

**[<Constant name="canvas" />](/docs/platform/use-canvas)** <Lifecycle status="managed,managed_plus" />
<br />Visual, drag-and-drop modeling in the <Constant name="dbt_platform" />.

**[Cost insights](/docs/explore/cost-insights)** <Lifecycle status="private_beta,managed,managed_plus" />
<br />Review estimated compute cost and runtime for models and projects to measure optimization impact.

**[<Constant name="copilot" />](/docs/platform/studio-ide/develop-copilot)** <Lifecycle status="self_service,managed,managed_plus" />
<br />Inline AI assistance to generate and edit SQL and resources in the <Constant name="studio_ide" />.

**[<Constant name="dev_agent" />](/docs/dbt-ai/developer-agent)** <Lifecycle status="beta,self_service,managed,managed_plus" />
<br />Agentic development in the <Constant name="studio_ide" /> with auditable changes.

**[<Constant name="catalog" />](/docs/explore/explore-projects)** <Lifecycle status="self_service,managed,managed_plus" />
<br />Browse models, tests, metrics, and lineage for your projects in <Constant name="catalog" />.

**[<Constant name="dbt" /> audit log](/docs/platform/manage-access/audit-log)** <Lifecycle status="managed,managed_plus" />
<br />Account activity history for compliance and troubleshooting.

**[<Constant name="dbt" /> <Constant name="semantic_layer" />](/docs/use-dbt-semantic-layer/dbt-sl)** <Lifecycle status="self_service,managed,managed_plus" />
<br />Centralize metric definitions on top of models for consistent consumption in downstream tools.

**[Enterprise permissions](/docs/platform/manage-access/enterprise-permissions)** <Lifecycle status="managed,managed_plus" />
<br />Enterprise-grade authorization patterns.

**[Hybrid projects](/docs/deploy/hybrid-projects)** <Lifecycle status="managed_plus" />
<br />Bring <Constant name="core" /> artifacts into the <Constant name="dbt_platform" /> for visibility and references.

**[<Constant name="platform_cli" />](/docs/platform/cloud-cli-installation)**
<br />Command-line interface for running <Constant name="dbt" /> against <Constant name="dbt_platform" /> environments. Available on any [plan](https://www.getdbt.com/pricing); intended only for use with the hosted platform CLI contract.

**[Job notifications](/docs/deploy/job-notifications)**
<br />Subscribe to email, Slack, and Microsoft Teams alerts keyed to job run outcomes and channels.

**[Job scheduler](/docs/deploy/job-scheduler)**
<br />Scheduled and triggered runs for production and CI workflows in the <Constant name="dbt_platform" />. Availability follows your plan and environment configuration; see linked docs for scheduler behavior.

**[Merge jobs](/docs/deploy/merge-jobs)** <Lifecycle status="self_service,managed" />
<br />Run jobs when pull requests merge.

**[SCIM](/docs/platform/manage-access/scim)** <Lifecycle status="managed,managed_plus" />
<br />Automated user and group provisioning.

**[Single sign-on (SSO) overview](/docs/platform/manage-access/sso-overview)** <Lifecycle status="managed,managed_plus" />
<br />SSO for your organization.

**[<Constant name="studio_ide" />](/docs/platform/studio-ide/develop-in-studio)**
<br />Browser-based development environment to build, test, run, and version-control <Constant name="dbt" /> projects. IDE access aligns with [plan entitlements](https://www.getdbt.com/pricing) for your account.

**[<Constant name="copilot" />](/docs/platform/use-dbt-copilot)** <Lifecycle status="self_service,managed,managed_plus" />
<br />Broader <Constant name="copilot" /> experiences in the <Constant name="dbt_platform" />.

**[Visualize and orchestrate downstream exposures](/docs/deploy/orchestrate-exposures)** <Lifecycle status="managed,managed_plus" />
<br />Dashboard lineage and exposure orchestration.

**[Webhooks](/docs/deploy/webhooks)** <Lifecycle status="self_service,managed,managed_plus" />
<br />Trigger jobs from external systems.

## Local tools and open-source surfaces

You can access these tools and surfaces outside the hosted <Constant name="dbt_platform" />. You typically install or run them on your laptop, in CI, or via open-source projects.

**[<Constant name="dbt" /> Model Context Protocol (MCP) server](/docs/dbt-ai/about-mcp)**
<br />Open-source MCP server connecting AI tools to <Constant name="dbt" /> metadata and actions. Runs locally or remote per deployment; complements APIs and CLIs rather than replacing [plan-based](/docs/platform/about-platform/dbt-cloud-features) platform features.

**[<Constant name="core" /> (local)](/docs/local/install-dbt?version=1#installation)**
<br />Install the Python <Constant name="core" /> locally using pip, virtual environments, and warehouse adapters. Use <Constant name="core" /> when you need classic Python-based workflows or adapters that are not yet available on <Constant name="fusion" />.

**[<Constant name="dbt" /> VS Code extension](/docs/about-dbt-extension)** <Lifecycle status="preview" />
<br />Editor integration powered by <Constant name="fusion_engine" /> and the language server for VS Code or Cursor.

**[<Constant name="fusion" /> CLI](/docs/local/install-dbt?version=2#installation)** <Lifecycle status="preview" />
<br />Local command-line interface for the <Constant name="fusion_engine" /> (Rust). See [Get started with <Constant name="fusion" />](/docs/fusion/get-started-fusion).

## Related

- [What is <Constant name="dbt" />?](/docs/introduction)
- [Product lifecycles](/docs/dbt-versions/product-lifecycles)
- [The <Constant name="dbt_platform" /> features](/docs/platform/about-platform/dbt-cloud-features) (overview cards)
- [Supported <Constant name="fusion" /> features](/docs/fusion/supported-features) (engine parity and “where” nuances)
