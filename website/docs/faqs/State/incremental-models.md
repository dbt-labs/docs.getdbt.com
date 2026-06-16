---
title: Does dbt State support incremental models?
description: "Learn how dbt State works with incremental models."
sidebar_label: 'Does this support incremental models?'
id: incremental-models
---

dbt State works with incremental models. When you make a change to an incremental model and run it in development, dbt State automatically clones the model from production if it exists, then runs the new model logic on top of the clone.

If you want to revert to the original dbt behavior and fully refresh the incremental model, pass the [`--full-refresh` flag](/reference/commands/run#refresh-incremental-models).
