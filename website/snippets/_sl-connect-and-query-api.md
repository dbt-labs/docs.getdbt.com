This section will guide you on how to query and use the Google Sheets integration. You can also query your metrics using:
- [First-class integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations) (such as Tableau, Hex, and more) 
- Other tools using the [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview).
- [Exports](/docs/use-dbt-semantic-layer/exports) to expose tables of metrics and dimensions in your data platform and create a custom integration with tools such as PowerBI, and more.

To query your metrics using Google Sheets:
1. Make sure you have a [Gmail](http://gmail.com/) account.
2. To set up Google Sheets and query your metrics, follow the detailed instructions on [Google Sheets integration](/docs/use-dbt-semantic-layer/gsheets).
3. Start using with it. You can query a metric, like `order_total`. Filter it with a dimension, like `order_date`. You can also use the `group_by` parameter to group your metrics by a specific dimension.

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/sl-gsheets.jpg" width="90%" title="Use the dbt Semantic Layer's Google Sheet integration to query metrics with a Query Builder menu."  />
