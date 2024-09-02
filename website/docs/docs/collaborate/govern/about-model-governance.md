---
title: "About model governance"
id: about-model-governance
description: "Information about new features related to model governance"
pagination_next: "docs/collaborate/govern/model-access"
pagination_prev: null
---

[**Model access**](model-access): Some models are mature, reusable data productions. Others are your team's implementation details on the way there. Mark models as "public" or "private," to make the distinction clear and to control who else can `ref` them.

[**Model contracts**](model-contracts): Guarantee the shape of a model while it is building to avoid surprises or breaking changes for downstream queries. Explicitly define column names, data types, and constraints (as supported by your data platform).

[**Model versions**](model-versions): When a breaking change is unavoidable, provide a smoother upgrade pathway by creating a new version of the model. These model versions share a common reference name and can reuse properties & configurations.

[**Project dependencies**](/docs/collaborate/govern/project-dependencies): Use cross project dependencies to reference public models across dbt projects using the [two-argument ref](/reference/dbt-jinja-functions/ref#ref-project-specific-models), which includes the project name.
