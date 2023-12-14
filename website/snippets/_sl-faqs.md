- **Is the dbt Semantic Layer open source?**
  - The dbt Semantic Layer is proprietary; however, some components of the dbt Semantic Layer are open source, such as dbt-core and MetricFlow.

    dbt Cloud Developer or dbt Core users can define metrics in their project, including a local dbt Core project, using the dbt Cloud IDE, dbt Cloud CLI, or dbt Core CLI. However, to experience the universal dbt Semantic Layer and access those metrics using the API or downstream tools, users must be on a dbt Cloud [Team or Enterprise](https://www.getdbt.com/pricing/) plan.

    Refer to [Billing](https://docs.getdbt.com/docs/cloud/billing) for more information.

- **How can open-source users use the dbt Semantic Layer?**
  - The dbt Semantic Layer requires the use of the dbt Cloud-provided service for coordinating query requests. Open source users who don’t use dbt Cloud can currently work around the lack of a service layer. They can do this by running `mf query --explain` in the command line. This command generates SQL code, which they can then use in their current systems for running and managing queries.
  
    As we refine MetricFlow’s API layers, some users may find it easier to set up their own custom service layers for managing query requests. This is not currently recommended, as the API boundaries around MetricFlow are not sufficiently well-defined for broad-based community use

- **Why is my query limited to 100 rows in the dbt Cloud CLI?**
- The default `limit` for query issues from the dbt Cloud CLI is 100 rows. We set this default to prevent returning unnecessarily large data sets as the dbt Cloud CLI is typically used to query the dbt Semantic Layer during the development process, not for production reporting or to access large data sets. For most workflows, you only need to return a subset of the data.
  
  However, you can change this limit if needed by setting the `--limit` option in your query. For example, to return 1000 rows, you can run `dbt sl list metrics --limit 1000`.

- **Can I reference MetricFlow queries inside dbt models?**
  - dbt relies on Jinja macros to compile SQL, while MetricFlow is Python-based and does direct SQL rendering targeting at a specific dialect. MetricFlow does not support pass-through rendering of Jinja macros, so we can’t easily reference MetricFlow queries inside of dbt models.
  
    Beyond the technical challenges that could be overcome, we see Metrics as the leaf node of your DAG, and a place for users to consume metrics. If you need to do additional transformation on top of a metric, this is usually a sign that there is more modeling that needs to be done. 

- **Can I create tables in my data platform using MetricFlow?**
  - You can use the upcoming feature, Exports, which will allow you to create a [pre-defined](/docs/build/saved-queries) MetricFlow query as a table in your data platform. This feature will be available to dbt Cloud customers only. This is because MetricFlow is primarily for query rendering while dispatching the relevant query and performing any DDL is the domain of the service layer on top of MetricFlow.

- **How do I migrate from the legacy Semantic Layer to the new one?**
  - If you're using the legacy Semantic Layer, we highly recommend you [upgrade your dbt version](/docs/dbt-versions/upgrade-core-in-cloud) to dbt v1.6 or higher to use the new dbt Semantic Layer. Refer to the dedicated [migration guide](/guides/sl-migration) for more info.

- **How are you storing my data?**
  - User data passes through the Semantic Layer on its way back from the warehouse. dbt Labs ensures security by authenticating through the customer's data warehouse. Currently, we don't cache data for the long term, but it might temporarily stay in the system for up to 10 minutes, usually less. In the future, we'll introduce a caching feature that allows us to cache data on our infrastructure for up to 24 hours.

- **Is there a dbt Semantic Layer discussion hub?**
  - Yes absolutely! Join the [dbt Slack community](https://getdbt.slack.com) and [#dbt-cloud-semantic-layer slack channel](https://getdbt.slack.com/archives/C046L0VTVR6) for all things related to the dbt Semantic Layer.
