The following table summarizes the differences between visualizing and orchestrating downstream exposures:

| Info | Set up and visualize downstream exposures | Orchestrate downstream exposures <Lifecycle status="beta"/> |
| ---- | ---- | ---- |
| Purpose | Automatically brings downstream assets into your dbt lineage. | Proactively refreshes the underlying data sources during scheduled dbt jobs. |
| Benefits | Provides visibility into data flow and dependencies. | Ensures BI tools always have up-to-date data without manual intervention. |
| Location  | Exposed in dbt [<Constant name="explorer"/>](/docs/explore/explore-projects) | Exposed in [<Constant name="cloud" /> scheduler](/docs/deploy/deployments) |
| Supported BI tool | Tableau | Tableau |
| Use case | Helps users understand how models are used and reduces incidents. | Optimizes timeliness and reduces costs by running models when needed. |

Check out the following sections for more information on visualizing and orchestrating downstream exposures:

<div className="grid--2-col">

<Card
    title="Set up and visualize downstream exposures"
    body="Set up downstream exposures automatically from dashboards to understand how models are used in downstream tools for a richer downstream lineage."
    link="/docs/cloud-integrations/downstream-exposures-tableau"
    icon="dbt-bit"/>

<Card
    title="Orchestrate downstream exposures"
    link="/docs/cloud-integrations/orchestrate-exposures"
    body="Proactively refreshes the underlying data sources (like Tableau extracts) using the dbt scheduler during scheduled dbt jobs."
    icon="dbt-bit"/>

</div>
