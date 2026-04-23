---
title: "About the Discovery API schema"
sidebar_label: "About the schema"
id: "discovery-schema-about"
---

With the Discovery API, you can query the metadata in dbt to learn more about your dbt deployments and the data they generate. You can analyze the data to make improvements. If you are new to the API, refer to [About the Discovery API](/docs/dbt-cloud-apis/discovery-api) for an introduction. You might also find the [use cases and examples](/docs/dbt-cloud-apis/discovery-use-cases-and-examples) helpful.

The Discovery API *schema* provides all the pieces necessary to query and interact with the Discovery API. The most common queries use the `environment` endpoint:

<div className="grid--2-col">

<Card
    title="Environment schema"
    body="Query and compare a model’s definition (intended) and its applied (actual) state."
    link="/docs/dbt-cloud-apis/discovery-schema-environment"
    icon="dbt-bit"/>
<Card
    title="Applied schema"
    body="Query the actual state of objects and metadata in the warehouse after a `dbt run` or `dbt build`."
    link="/docs/dbt-cloud-apis/discovery-schema-environment-applied"
    icon="dbt-bit"/>
<Card
    title="Definition schema"
    body="Query intended state in project code and configuration defined in your dbt project."
    link="/docs/dbt-cloud-apis/discovery-schema-environment-definition"
    icon="dbt-bit"/>

 <Card
    title="Model Historical Runs schema"
    body="Query information about a model's run history."
    link="/docs/dbt-cloud-apis/discovery-schema-environment-applied-modelHistoricalRuns"
    icon="dbt-bit"/>

</div>
