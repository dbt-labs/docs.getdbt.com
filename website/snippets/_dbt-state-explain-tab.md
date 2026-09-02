The **Explain** tab is available on job runs where [dbt State](/docs/deploy/dbt-state-about) is enabled. It shows why dbt State rebuilt or reused each node in the run, so you can investigate unexpected behavior or verify that State is working as expected.

The tab displays an **Explain results** table with one row per node. You can search by node name and download the full results as a text file.

Expand a row to see the full decision details. Not all analyses apply to every node type:

<SimpleTable>

| Field | Description |
|---|---|
| **Resource name** | The node identifier. |
| **Resource type** | The node type: model, seed, snapshot, test, and so on. |
| **Decision** | The reason dbt State rebuilt or reused this node. |
| **Run step** | The job command that ran this node (for example, `dbt build --exclude tag:ml_pipeline`). |
| **Table analysis** | Whether the target table already exists in the schema. |
| **Query analysis** | Whether the model query or its upstream queries have changed. |
| **Data freshness analysis** | Whether upstream data is fresh or within the configured [`lag_tolerance`](/reference/resource-configs/lag-tolerance). |

</SimpleTable>

<Lightbox src="/img/docs/dbt-platform/deployment/explain-tab.png" title="Explain tab showing the decision breakdown" />

