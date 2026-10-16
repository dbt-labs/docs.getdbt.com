
### Key metrics

The **Model performance** section displays the following metrics that summarize the overall cost and optimization impact for your project:

- **Total cost reduction**
- **Total % reduction**
- **Total query run time deduction**
- **Reused assets** (when dbt State or state-aware orchestration is enabled)

### Filters

Use the time period filter to customize the data you want to view: from the last 3 months up to the last 1 week.

For **Cost insights**, **Usage**, and **Query run time** tabs, you can set the view granularity by **Daily**, **Weekly**, or **Monthly**.

### Visualization tabs

- **Cost insights**: Shows the estimated warehouse costs incurred by this model and cost reduction from dbt State or state-aware orchestration.
- **Usage**: Shows the estimated warehouse usage consumed by this model over time. The **Usage** tab represents generic usage for your warehouse. The specific unit depends on your data warehouse:
    - Snowflake: Credits
    - BigQuery: Slot hours or bytes scanned (currently combined into one generic usage number)
    - Databricks: Databricks Units (DBUs)
    - Amazon Redshift Serverless: Redshift Processing Unit hours (RPU-hours)
    - Amazon Redshift Provisioned: Node-hours
- **Query run time**: Shows the estimated query execution time and the reduction in run duration from dbt State or state-aware orchestration.
- **Build time**: Shows average execution time for the model and how it trends over the selected period.
- **Build count**: Tracks how many times the model was built or reused, including any failures or errors.
- **Test results**: Displays test execution outcomes and pass/fail rates for tests on this model.
- **Consumption queries**: Shows queries running against this model, helping you understand downstream usage patterns.

### Table view

For **Cost insights**, **Usage**, and **Query run time** tabs, you can access the table view by clicking **Show table**, which provides detailed optimization data such as models reused, usage reduction, and cost reduction.

import TableView from '/snippets/_table-view.md';

<TableView />

### Chart interactions

For **Build time** and **Build count** tabs:

- Click on any data point in the charts to see a detailed table listing all job runs for that day.
- Each row in the table provides a direct link to the run details if you want to investigate further.
