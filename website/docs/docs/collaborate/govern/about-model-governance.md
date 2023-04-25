---
title: "About model governance"
id: about-model-governance
description: "Information about new features related to model governance"
---

:::info

This section contains features new in dbt Core v1.5. To see the documentation related to **model access, contracts, and versions**, make sure to [select v1.5 or higher](/docs/collaborate/govern/about-model-governance?version=1.5).

:::

[**Model access**](model-access): Some models are mature, reusable data productions. Others are your team's implementation details on the way there. Mark models as "public" or "private," to make the distinction clear and to control who else can `ref` them.

[**Model contracts**](model-contracts): Guarantee the shape of a model while it is building to avoid surprises or breaking changes for downstream queries. Explicitly define column names, data types, and constraints (as supported by your data platform).

[**Model versions**](model-versions): When a breaking change is unavoidable, provide a smoother upgrade pathway by creating a new version of the model. These model versions share a common reference name and can reuse properties & configurations.
