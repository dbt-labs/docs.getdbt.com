---
title: Putting Your DAG on the internet
description: "Use dbt and Snowflake's external access integrations to allow Snowflake Python models access the internet."
slug: dag-on-the-internet

authors: [ernesto_ongaro, sebastian_stan, filip_byrén]

tags: [analytics craft, APIs, data ecosystem]
hide_table_of_contents: false

date: 2024-06-14
is_featured: true
---

**New in dbt: allow Snowflake Python models to access the internet**

With dbt 1.8, dbt released support for Snowflake’s [external access integrations](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview) further enabling the use of dbt + AI to enrich your data. This allows querying of external APIs within dbt Python models, a functionality that was required for dbt Cloud customer, [EQT AB](https://eqtgroup.com/). Learn about why they needed it and how they helped build the feature and get it shipped!

<!--truncate-->
## Why did EQT require this functionality? 
by Filip Bryén, VP and Software Architect (EQT) and Sebastian Stan, Data Engineer (EQT)

_EQT AB is a global investment organization and as a long-term customer of dbt Cloud, presented at dbt’s Coalesce [2020](https://www.getdbt.com/coalesce-2020/seven-use-cases-for-dbt) and [2023](https://www.youtube.com/watch?v=-9hIUziITtU)._

_Motherbrain Labs is EQT’s bespoke AI team, primarily focused on accelerating our portfolio companies' roadmaps through hands-on data and AI work. Due to the high demand for our time, we are constantly exploring mechanisms for simplifying our processes and increasing our own throughput. Integration of workflow components directly in dbt has been a major efficiency gain and helped us rapidly deliver across a global portfolio._

Motherbrain Labs is focused on creating measurable AI impact in our portfolio. We work hand-in-hand with leadership from our deal teams and portfolio company leadership but our starting approach is always the same: identify which data matters. 

While we have access to reams of proprietary information, we believe the greatest effect happens when we combine that information with external datasets like geolocation, demographics, or competitor traction. 

These valuable datasets often come from third-party vendors who operate on a pay-per-use model; a single charge for every piece of information we want. To avoid overspending, we focus on enriching only the specific subset of data that is relevant to an individual company's strategic question. 

In response to this recurring need, we have partnered with Snowflake and dbt to introduce new functionality that facilitates communication with external endpoints and manages secrets within dbt. This new integration enables us to incorporate enrichment processes directly into our DAGs, similar to how current Python models are utilized within dbt environments. We’ve found that this augmented approach allows us to reduce complexity and enable external communications before materialization.

## An example with Carbon Intensity: How does it work?

In this section, we will demonstrate how to integrate an external API to retrieve the current Carbon Intensity of the UK power grid. The goal is to illustrate how the feature works, and perhaps explore how the scheduling of data transformations at different times can potentially reduce their carbon footprint, making them a greener choice. We will be leveraging the API from the [UK National Grid ESO](https://www.nationalgrideso.com/) to achieve this.

To start, we need to set up a network rule (Snowflake instructions [here](https://docs.snowflake.com/en/user-guide/network-rules)) to allow access to the external API. Specifically, we'll create an egress rule to permit Snowflake to communicate with api.carbonintensity.org.

Next, to access network locations outside of Snowflake, you need to define an external access integration first and reference it within a dbt Python model. You can find an overview of Snowflake's external network access [here](https://docs.snowflake.com/en/developer-guide/external-network-access/external-network-access-overview).

This API is open and if it requires an API key, handle it similarly to managing secrets. More information on API authentication in Snowflake is available [here](https://docs.snowflake.com/en/user-guide/api-authentication).

For simplicity’s sake, we will show how to create them using [pre-hooks](/reference/resource-configs/pre-hook-post-hook) in a model configuration yml file:


```
models:
  - name: external_access_sample
    config:
      pre_hook: 
        - "create or replace network rule test_network_rule type = host_port mode = egress value_list= ('api.carbonintensity.org.uk:443');"
        - "create or replace external access integration test_external_access_integration allowed_network_rules = (test_network_rule) enabled = true;"
```

Then we can simply use the new external_access_integrations configuration parameter to use our network rule within a Python model (called external_access_sample.py):


```
import snowflake.snowpark as snowpark
def model(dbt, session: snowpark.Session):
    dbt.config(
        materialized="table",
        external_access_integrations=["test_external_access_integration"],
        packages=["httpx==0.26.0"]
    )
    import httpx
    return session.create_dataframe(
            [{"carbon_intensity": httpx.get(url="https://api.carbonintensity.org.uk/intensity").text}]
    )
```


The result is a model with some json I can parse, for example, in a SQL model to extract some information: 


```
{{
    config(
        materialized='incremental',
        unique_key='dbt_invocation_id'
    )
}}

with raw as (
    select parse_json(carbon_intensity) as carbon_intensity_json
    from {{ ref('external_access_demo') }}
)

select
    '{{ invocation_id }}' as dbt_invocation_id,
    value:from::TIMESTAMP_NTZ as start_time,
    value:to::TIMESTAMP_NTZ as end_time,
    value:intensity.actual::NUMBER as actual_intensity,
    value:intensity.forecast::NUMBER as forecast_intensity,
    value:intensity.index::STRING as intensity_index
from raw,
    lateral flatten(input => raw.carbon_intensity_json:data)
```


The result is a model that will keep track of dbt invocations, and the current UK carbon intensity levels.

<Lightbox src="/img/blog/2024-06-12-putting-your-dag-on-the-internet/image1.png" title="Preview in dbt Cloud IDE of output" />

## dbt best practices

This is a very new area to Snowflake and dbt -- something special about SQL and dbt is that it’s very resistant to external entropy. The second we rely on API calls, Python packages and other external dependencies, we open up to a lot more external entropy. APIs will change, break, and your models could fail.

Traditionally dbt is the T in ELT (dbt overview [here](https://docs.getdbt.com/terms/elt)), and this functionality unlocks brand new EL capabilities for which best practices do not yet exist. What’s clear is that EL workloads should be separated from T workloads, perhaps in a different modeling layer. Note also that unless using incremental models, your historical data can easily be deleted. dbt has seen a lot of use cases for this, including this AI example as outlined in this external [engineering blog post](https://klimmy.hashnode.dev/enhancing-your-dbt-project-with-large-language-models). 

**A few words about the power of Commercial Open Source Software**

In order to get this functionality shipped quickly, EQT opened a pull request, Snowflake helped with some problems we had with CI and a member of dbt Labs helped write the tests and merge the code in!  

dbt now features this functionality in dbt 1.8+ or the "Latest" option of dbt Cloud (dbt overview [here](/docs/dbt-versions/upgrade-dbt-version-in-cloud#latest)). 

dbt Labs staff and community members would love to chat more about it in the [#db-snowflake](https://getdbt.slack.com/archives/CJN7XRF1B) slack channel.
