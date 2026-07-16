---
title: "dbt Copilot in Insights"
id: "analyst-agent"
description: "Chat with your data using the Analyst agent powered by the dbt Semantic Layer"
sidebar_label: "Copilot in Insights"
tags: [AI, Agents, Semantic Layer]
---

# dbt Copilot in Insights  <Lifecycle status="beta,managed,managed_plus"/>

dbt Copilot in Insights lets you chat with your data and get accurate answers powered by the [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). Unlike generic AI chat interfaces, <Constant name="wizard" /> in <Constant name="insights" /> provides consistent, explainable results with transparent SQL, lineage, and data policies.

import CopilotWizardDifferences from '/snippets/_copilot-wizard-diff.md';

<CopilotWizardDifferences/>


## Prerequisites 

- Enable beta features under **Account settings** > **Personal profile** > **Experimental features**. See [Preview new dbt platform features](/docs/dbt-versions/experimental-features) for steps.
- Have access to [dbt Insights](/docs/explore/dbt-insights) and meet those prerequisites.
- Be on a <Constant name="dbt_platform" /> [Enterprise-tier](https://www.getdbt.com/pricing) plan &mdash; [book a demo](https://www.getdbt.com/contact) to learn more about <Constant name="insights" />.
- Available on all [tenant](/docs/platform/about-platform/tenancy) configurations. 
- Have a <Constant name="dbt" /> [developer license](/docs/platform/manage-access/seats-and-users) with access to <Constant name="insights" />.
- Configured [user credentials](/docs/platform/studio-ide/develop-in-studio#get-started-with-the-studio-ide).

## Using dbt Copilot in Insights

import AnalystAgentsCopilot from '/snippets/_analyst_agents-copilot.md';

<AnalystAgentsCopilot/>
