---
title: How does dbt State calculate that a model has changed?
description: "Learn how dbt State determines whether a model has meaningfully changed."
sidebar_label: 'How do you calculate that a model has changed?'
id: model-change-calculation
---

dbt State only considers substantial changes to a model. Because dbt State understands the entire lineage of your models, it can see through things like whitespace and aliases to determine whether a model is the same or different across environments.

By default, dbt State compares rendered SQL to detect code changes. Any change to the rendered SQL &mdash; including from non-deterministic macros or environment variables &mdash; triggers a rebuild.

You can enable [`compare_unrendered_code`](/reference/resource-configs/compare-unrendered-code) to also check the Jinja template (unrendered code). When enabled, a rebuild only occurs when both the template _and_ the rendered SQL have changed. Non-deterministic values (for example, `{{ env_var('AIRFLOW_RUN_ID') }}` or a macro that calls `uuid()`) don't trigger rebuilds as long as the template itself is unchanged, which helps avoid unnecessary warehouse compute costs.