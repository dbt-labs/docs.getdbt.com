---
title: "Project-level configuration for analyses"
id: "require_corrected_analysis_fqns"
sidebar_label: "require corrected analysis fqns"
---

import AnalysesProjectLevelConfig from '/snippets/_analyses-project-level-config.md';

:::info Beta feature
The project-level configuration for analyses is a beta feature in <Constant name="core" /> v1.12.
:::

| require_corrected_analysis_fqns | <Constant name="dbt" /> **Latest** | <Constant name="core" /> |
|---|---|---|
| Introduced | 2026.3 | 1.12.0 |
| Matured (default → `true`) | — | — |
| Removed | — | — |

Previously, project-level configuration for [analyses](/docs/build/analyses) in `dbt_project.yml` was silently ignored. Fully qualified names (FQNs) for analyses also contained an extra `analyses` path segment that was inconsistent with other resource types.

When `require_corrected_analysis_fqns` is set to `true`, dbt:
- Routes analysis configurations from the `analyses` block in `dbt_project.yml`, enabling project-level configurations to take effect.
- Removes the extra FQN segment so that analysis FQNs are consistent with other resource types (for example, `your_project.my_analysis` instead of `your_project.analyses.my_analysis`).

<AnalysesProjectLevelConfig />

<File name='dbt_project.yml'>

```yaml
flags:
  require_corrected_analysis_fqns: true

analyses:
  +enabled: true | false
```
</File>

For more information, refer to [Analyses](/docs/build/analyses) and [Analysis properties](/reference/analysis-properties).
