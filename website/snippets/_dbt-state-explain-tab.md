The **Explain** tab appears on job runs that used [dbt State](/docs/deploy/dbt-state-about). It shows why dbt State rebuilt, reused, or cloned each resource, so you can investigate unexpected behavior or verify that State is working as expected. The tab is available while a run is in progress and updates as resources finish.

The tab displays an **Explain results** table with one row per resource. You can search by resource name and download the full results as a text file.

Expand a row to see the full decision details. Not all analyses apply to every resource type:

<SimpleTable>

| Field | Description |
|---|---|
| **Resource name** | The name of the resource. |
| **Resource type** | The resource type: model, seed, snapshot, test, and so on. |
| **Decision** | The reason dbt State rebuilt, reused, or cloned this resource. |
| **Run step** | The job command that ran this resource (for example, `dbt build --exclude tag:ml_pipeline`). |
| **Table analysis** | Whether the target table already exists in the schema. |
| **Query analysis** | Whether the resource query or its upstream queries have changed. |
| **Data freshness analysis** | Whether upstream data is fresh or within the configured [`lag_tolerance`](/reference/resource-configs/lag-tolerance). |

</SimpleTable>

<Lightbox src="/img/docs/dbt-platform/deployment/explain-tab.png" title="Explain tab showing the decision breakdown" />

