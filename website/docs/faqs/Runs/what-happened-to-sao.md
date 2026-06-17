---
title: What happened to state-aware orchestration?
description: "Learn why state-aware orchestration is no longer available to new customers and how to adopt dbt State instead."
sidebar_label: 'What happened to state-aware orchestration?'
id: what-happened-to-sao
---

import DbtStateVsSao from '/snippets/_dbt-state-vs-sao.md';

On June 1, 2026, dbt Labs and Fivetran announced **[dbt State](/docs/deploy/dbt-state-about)**<Lifecycle status="preview" /> as a new and improved version of state-aware orchestration. A key feature is [`lag_tolerance`](/reference/resource-configs/lag-tolerance), which controls how much time must pass since the last upstream data change before a node is eligible for a rebuild.

<DbtStateVsSao />

To get started, refer to [Migrate from state-aware orchestration](/docs/deploy/dbt-state-migration).
