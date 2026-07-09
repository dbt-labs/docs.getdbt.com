---
title: "Using reservations"
sidebar_label: "Reservations"
description: "How to route dbt-submitted BigQuery jobs to a specific reservation at the target, project, or model level."
---

The `reservation` config routes dbt-submitted BigQuery jobs to a specific [reservation](https://docs.cloud.google.com/bigquery/docs/reservations-workload-management#flexible).

You can set `reservation` at three levels, from lowest to highest precedence:

1. **Target level** (`profiles.yml`) — applies to all jobs for the target. See [Connect BigQuery](/docs/local/connect-data-platform/bigquery-setup?version=1.12&name=Core#reservation).

2. **Project level** (`dbt_project.yml`) — applies to all matching models.

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    +reservation: 'projects/abc-123/locations/US/reservations/my-reservation'
```

</File>

3. **Model level** (`{{ config(...) }}`) — overrides project and target settings for a single model.

<File name='models/my_model.sql'>

```sql
{{ config(
    reservation='projects/abc-123/locations/US/reservations/my-reservation'
) }}

select ...
```

</File>
