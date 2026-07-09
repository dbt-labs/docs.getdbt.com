---
title: "Authorized views"
sidebar_label: "Authorized views"
description: "How to use the grant_access_to config to give BigQuery view models access to select from specific datasets."
---

If the `grant_access_to` config is specified for a model materialized as a
view, dbt will grant the view model access to select from the list of datasets
provided. See [BQ docs on authorized views](https://cloud.google.com/bigquery/docs/share-access-views)
for more details.

<Snippet path="grants-vs-access-to" />

<File name='dbt_project.yml'>

```yml
models:
  [<resource-path>](/reference/resource-configs/resource-path):
    +grant_access_to:
      - project: project_1
        dataset: dataset_1
      - project: project_2
        dataset: dataset_2
```

</File>

<File name='models/<modelname>.sql'>

```sql

{{ config(
    grant_access_to=[
      {'project': 'project_1', 'dataset': 'dataset_1'},
      {'project': 'project_2', 'dataset': 'dataset_2'}
    ]
) }}
```

</File>

Views with this configuration will be able to select from objects in `project_1.dataset_1` and `project_2.dataset_2`, even when they are located elsewhere and queried by users who do not otherwise have access to `project_1.dataset_1` and `project_2.dataset_2`.
