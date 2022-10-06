<aside>
📌 The dbt Semantic Layer is currently available for public preview! Review the info below to see what this means for you:

1. **Who?** The dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise) during public preview. Review the [Product architecture](url) section for more information.

2. **What?** Public preview provides early access to unreleased features, is supported and production ready, but not priced yet.  Pricing for the dbt Semantic Layer will be introduced alongside the Generally Available (GA) release (expected first half of the calendar year 2023). 

3. **When?** Public preview will end once the dbt Semantic Layer is available for GA (expected first half of 2023). During GA, the dbt Semantic Layer will only be available to dbt Cloud Team and Enterprise plans.

4. **Where?** Public preview is enabled at the account level so you don’t need to worry about enabling it per user.

5. **Why?** Public preview is designed to test the functionality and collect feedback from our community on performance, usability, and documentation.

</aside>

The dbt Semantic Layer allows data teams to centrally define essential business metrics like `revenue`, `customer`, and `churn` in the modeling layer (your dbt project), for consistent self-service within downstream data tools like BI and metadata management solutions. The result? You have less duplicative coding for data teams and more consistency for data consumers.

The Semantic Layer has four main parts:

- Define your metrics in version-controlled dbt project code
- Import your metric definitions via the [Metadata API](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-querying)
- Query your metric data via the dbt Proxy Server
- Explore and analyze dbt metrics in downstream tools

![Screen Shot 2022-09-30 at 8.59.50 AM.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5ee001f1-21bb-4546-99a2-37a6737c5c02/Screen_Shot_2022-09-30_at_8.59.50_AM.png)

**What makes the dbt Semantic Layer different?** 

The dbt Semantic Layer removes code duplication and inconsistency when it comes to your business metrics. By moving metric definitions out of the BI layer and into the modeling layer, data teams can feel confident that different business units are working from the same data definitions, regardless of their tool of choice. If a metric definition changes in dbt, it’s refreshed everywhere it’s invoked and creates consistency across all applications.

**Prerequisites** 
To use the dbt Semantic Layer, you’ll need to meet the following:

**•** Have multi-tenant [dbt Cloud](https://cloud.getdbt.com/) Teams or Enterprise account 
**•** Have both your production and development environments running dbt version 1.2 (latest) or higher
**•** Use Snowflake data warehouse 
**•** [Install](https://docs.getdbt.com/docs/building-a-dbt-project/package-management#how-do-i-add-a-package-to-my-project) the [metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/) version 0.3.2 or higher in your dbt project
**•** Set up the [Metadata API](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview) in the integrated tool to import metric definitions (Depending on your integrated tool)
**•** Recommended - Review the [dbt metrics](https://docs.getdbt.com/docs/building-a-dbt-project/metrics) page and [Getting started with the dbt Semantic Layer](https://docs.getdbt.com/blog/getting-started-with-the-dbt-semantic-layer) blog

**Considerations**

There are some modifications to consider when using the dbt Semantic Layer during Public preview: 

- Support for Snowflake data warehouse only (additional warehouses coming soon)
- Support for the deployment environment only (development experience coming soon)
- Do not use environment variables for the job/environment (coming soon)

### Product architecture

The dbt Semantic Layer product architecture includes four primary components:

1. 

In practice, dbt Semantic Layer integrations will:

- Leverage the Metadata API to fetch a list of objects and their attributes, like metrics
- Generate a dbt-SQL statement
- Then query the SQL proxy to evaluate the results of this statement.
