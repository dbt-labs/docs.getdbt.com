---
title: How is state-aware orchestration different from using selectors in dbt Core?
description: "Compare how state-aware orchestration differs from using selectors in dbt Core"
sidebar_label: 'State-aware orchestration vs selectors in dbt Core'
id: sao-difference-core

---

In <Constant name="core" />, running with the selectors `state:modified+` and `source_status:fresher+` builds models that either:

- Have changed since the prior run (`state:modified+`)
- Have upstream sources that are fresher than in the prior run (`source_status:fresher+`)

Instead of relying only on these selectors and prior-run artifacts, state-aware orchestration decides whether to rebuild a model based on:

- Compiled SQL diffs that ignore non-meaningful changes like whitespace and comments
- Upstream data changes at runtime and model-level freshness settings
- Shared state across jobs

While <Constant name="core" /> uses selectors like `state:modified+` and `source_status:fresher+` to decide what to build _only for a single run in a single job_, state-aware orchestration with <Constant name="fusion" /> maintains a _shared, real-time model state across every job in the environment_ and uses that state to determine whether a model’s code or upstream data have actually changed before rebuilding. This ensures dbt only rebuilds models when something has changed, no matter which job runs them.