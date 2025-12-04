---
title: How is state-aware orchestration different from using selectors in dbt Core?
description: "Compare how state-aware orchestration differs from using selectors in dbt Core"
sidebar_label: 'State-aware orchestration vs selectors in dbt Core'
id: sao-difference-core

---

In <Constant name="core" /> , running with the selectors `state:modified+` and `source_status:fresher+` builds models that either:

- Have changed since the prior run (`state:modified+`)
- Have upstream sources that are fresher than in the prior run (`source_status:fresher+`)

Instead of relying only on these selectors and prior-run artifacts, state-aware orchestration decides whether to rebuild a model based on:

- Compiled SQL diffs that ignore non-meaningful changes like whitespace and comments
- Upstream data changes at runtime and model-level freshness settings
- Shared state across jobs

This helps avoid unnecessary rebuilds when underlying source files changed without changing the compiled logic, while still rebuilding when upstream data changes require it.
