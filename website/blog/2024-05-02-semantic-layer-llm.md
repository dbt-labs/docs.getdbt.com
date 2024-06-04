---
title: "Conversational Analytics: A Natural Language Interface to your Snowflake Data"
description: "A tutorial on building a natural language interface to your Snowflake data using dbt Cloud Semantic Layer with Snowflake Cortex and Streamlit"
slug: semantic-layer-cortex

authors: [doug_guthrie]

tags: [llm, semantic-layer]
hide_table_of_contents: false

date: 2024-05-02
is_featured: true
---

## Introduction

As a solutions architect at dbt Labs, my role is to help our customers and prospects understand how to best utilize the dbt Cloud platform to solve their unique data challenges.  That uniqueness presents itself in different ways - organizational maturity, data stack, team size and composition, technical capability, use case, or some combination of those.  With all those differences though, there has been one common thread throughout most of my engagements:  Generative AI and Large Language Models (LLMs).  Data teams are either 1) proactively thinking about applications for it in the context of their work or 2) being pushed to think about it by their stakeholders.  It has become the elephant in every single (zoom) room I find myself in.

<!--truncate-->

<Lightbox src="/img/blog/2024-05-02-semantic-layer-llm/gen-ai-everywhere.png" width="85%" title="Gen AI Everywhere!" />

Clearly, this technology is not going away. There are already countless number of use cases and applications already showing very real improvements to efficiency, productivity, and creativity. Inspired by the common problem faced by data teams I'm talking to, I built a [Streamlit app](https://dbt-semantic-layer.streamlit.app/) which uses Snowflake Cortex and the dbt Semantic Layer to answer free-text questions accurately and consistently. You can preview examples of the questions it's able to answer below:

<LoomVideo id='3b5cc878ef53488583691c390159007d?t=0' />

## Why Build This

So, why build this and what makes it different?

- The outcome of an application like this aligns incredibly well with the mandate of most data teams - empower stakeholders by providing them with the data they need, in a medium they can consume, all while considering aspects of trust, governance, and accuracy
- The accuracy component is the very unique value proposition of an application like this relative to any other solution out there that purports to write SQL from a text prompt (check out some early benchmarks [here](https://www.getdbt.com/blog/semantic-layer-as-the-data-interface-for-llms)).  The reason for that is we’re not asking the LLM to write a SQL query, which is prone to hallucinating tables, columns, or just SQL that’s not valid. Instead, it generates a highly structured [MetricFlow](https://docs.getdbt.com/docs/build/about-metricflow) request. MetricFlow is the underlying piece of technology in the semantic layer that will translate that request to SQL based on the semantics you’ve defined in your dbt project.
- If I’m being honest, it’s also an incredibly valuable tool to show our customers and prospects!

## The Tech

The application uses [dbt Cloud’s Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl) alongside [Snowflake Cortex](https://docs.snowflake.com/en/user-guide/snowflake-cortex/overview) and [Streamlit](https://docs.snowflake.com/en/developer-guide/streamlit/about-streamlit) to power a natural language interface that enables users to retrieve data from their Snowflake platforms by simply asking questions like “What is total revenue by month in 2024?”.  Before we go too deep, let’s review what these tools are:

|  | **Semantic Layer** | **Snowflake Cortex** | **Streamlit** |
|---|---|---|---|
| What Is it? | Acts as an intermediary between a customer’s data platform and the various consumption points within their organization taking in requests and translating them into SQL. | Fully managed Snowflake service that offers machine learning and AI solutions, including LLM Functions and ML Functions. | Open-source Python framework that enables the rapid development of interactive web application |
| Why Use It? | Ensure consistent self-service access to metrics in downstream data tools and applications, eliminating the need for duplicate coding and, more importantly, ensuring that any stakeholder is working from the same, trusted metric definitions, regardless of their tool of  choice or technical capability. | Provides a seamless experience for interacting with LLMs, all from within your Snowflake account. | Declarative approach to building data-driven applications, allowing developers to focus on the core functionality rather than spending excessive time on frontend development. |

## Prerequisites

### Snowflake

Within Snowflake, you’ll need the following:

The required privileges for Snowflake Cortex are laid out in detail [here](https://docs.snowflake.com/en/user-guide/snowflake-cortex/llm-functions#required-privileges), but at a high level you’ll need to grant the `SNOWFLAKE.CORTEX_USER` database role to the user(s) accessing any of the functions available via Cortex.  For example:

```sql
use role accountadmin;

create role cortex_user_role;
grant database role snowflake.cortex_user to role cortex_user_role;

grant role cortex_user_role to user some_user;
```

To create streamlit apps within Snowflake, you need to grant the `CREATE STREAMLIT` privilege.  An example script is below:

```sql
-- If you want all roles to create Streamlit apps, run
grant usage on database <database_name> to role public;
grant usage on schema <database_name>.<schema_name> to role public;
grant create streamlit on schema <database_name>.<schema_name> to role public;
grant create stage on schema <database_name>.<schema_name> to role public;

-- Don't forget to grant USAGE on a warehouse (if you can).
grant usage on warehouse <warehouse_name> to role public;

-- If you only want certain roles to create Streamlit apps, 
-- change the role name in the above commands.
```

Additionally, you’ll need to set up a network rule, an external access integration, and a UDF that makes a request to the dbt Cloud Semantic Layer.  Be mindful of the values you have in your network rule and UDF - they'll need to correspond to the host where your dbt Cloud account is [deployed](https://docs.getdbt.com/docs/dbt-cloud-apis/sl-graphql#dbt-semantic-layer-graphql-api).

```sql
grant create network rule on schema <database_name>.<schema_name> to role public;
grant create secret on schema <database_name>.<schema_name> to role public;

use database <database_name>;
use schema <schema_name>;

create or replace network rule dbt_cloud_semantic_layer_rule
    mode = egress
    type = host_port
    value_list = (
        'semantic-layer.cloud.getdbt.com',
        'semantic-layer.emea.dbt.com',
        'semantic-layer.au.dbt.com'
    );

create or replace secret dbt_cloud_service_token
    type = generic_string
    secret_string = '<service_token>';

create or replace external access integration dbt_cloud_semantic_layer_integration
    allowed_network_rules = (dbt_cloud_semantic_layer_rule)
    allowed_authentication_secrets = (dbt_cloud_service_token)
    enabled = true;

grant usage on integration dbt_cloud_semantic_layer_integration to role public;
grant ownership on secret dbt_cloud_service_token to role public;
grant usage on secret dbt_cloud_service_token to role public;
```

The UDFs are called out individually in further sections below.

### dbt Cloud

Within dbt Cloud, you’ll need the following (more detail can be found [here](https://docs.getdbt.com/docs/use-dbt-semantic-layer/quickstart-sl#prerequisites)):

- Have a dbt Cloud Team or Enterprise account. Suitable for both Multi-tenant and Single-tenant deployment.
- Have both your production and development [environments](https://docs.getdbt.com/docs/dbt-cloud-environments) running dbt version 1.6 or higher.
- Create a successful job run in the environment where you [configure the Semantic Layer](https://docs.getdbt.com/docs/use-dbt-semantic-layer/setup-sl#set-up-dbt-semantic-layer).

## The Code
There are several components to the application that are worth calling out here individually: retrieving your project’s semantics (specifically metrics and dimensions) when the application loads, examples that guide the LLM to what valid and invalid output looks like, parsing the output to a structured object, and then using that output as an argument in the UDF we built earlier that makes a request to the Semantic Layer.

### Retrieving Semantics
When we create our prompt for the LLM, we’ll need to pass in the relevant metrics and dimensions that have been defined in our dbt project.  Without this, the LLM wouldn’t have the relevant information to parse when a user asks their particular question.  Additionally, this is an external request to dbt Cloud’s Semantic Layer API, so we’ll need to use an existing UDF.  Again, make sure you update the url to match your deployment type.  Also, note that we're using the external access integration and secret that we created earlier.

```sql
create or replace function retrieve_sl_metadata()
    returns object
    language python
    runtime_version = 3.9
    handler = 'main'
    external_access_integrations = (dbt_cloud_semantic_layer_integration)
    packages = ('requests')
    secrets = ('cred' = dbt_cloud_service_token)
as
$$
from typing import Dict
import _snowflake
import requests

query = """
query GetMetrics($environmentId: BigInt!) {
  metrics(environmentId: $environmentId) {
    description
    name
    queryableGranularities
    type
    dimensions {
      description
      name
      type
    }
  }
}
"""

def main():
    session = requests.Session()
    token = _snowflake.get_generic_secret_string('cred')
    session.headers = {'Authorization': f'Bearer {token}'}

    # TODO: Update for your environment ID
    payload = {"query": query, "variables": {"environmentId": 1}}

    # TODO: Update for your deployment type
    response = session.post("https://semantic-layer.cloud.getdbt.com/api/graphql", json=payload)
    response.raise_for_status()
    return response.json()

$$;

grant usage on function retrieve_sl_metadata() to role public;
```

Couple of things to note about the code above:

- Make sure you update the code to include your environment ID and your URL that’s specific to your [deployment type](https://docs.getdbt.com/docs/dbt-cloud-apis/sl-graphql#dbt-semantic-layer-graphql-api).
You could modify the function to accept arguments for payload, variables, query, etc. to make it more dynamic and satisfy other use cases outside of this one.
- Once the data has been returned, we’re going to use streamlit’s [session state](https://docs.streamlit.io/develop/api-reference/caching-and-state/st.session_state) feature to store the dbt project’s defined metrics and dimensions.  This feature will allow us to make multiple calls without having to continually retrieve this metadata.

### Creating Examples

Aside from using the metrics and dimensions that we retrieved in the step above, we’re also going to use in the prompt, examples of questions a user would ask and what the corresponding output should look like.  This allows us to “train” the LLM and ensure we can accommodate the various ways people ask questions.  An example of this is guiding the LLM in how it can structure SQL used in a where clause when a question is time-based (e.g. “Give me year-to-date revenue by department”).  An example of this might look like:

```python
{
    "metrics": "revenue, costs, profit",
    "dimensions": "department, salesperson, cost_center, metric_time, product__product_category",
    "question": "Give me YTD revenue by department?",
    "result": Query.model_validate(
        {
            "metrics": [{"name": "revenue"}],
            "groupBy": [{"name": "department"}],
            "where": [
                {
                    "sql": "{{ TimeDimension('metric_time', 'DAY') }} >= date_trunc('year', current_date)"
                }
            ],
        }
    )
    .model_dump_json()
    .replace("{", "{{")
    .replace("}", "}}"),
}
```

There is a tradeoff with this approach though that is worth mentioning - the examples we use to guide the LLM will be used in the prompt and thus increase the number of tokens processed, which is how Snowflake’s Cortex functions measure compute cost.  For some context, the LLM used in this application is mistral-8x7b, which charges .22 Credits / 1M Tokens and has a context window of 32,000 tokens.

### Structured Object Parsing
Another important piece to this application is parsing the output from the LLM into a structured object, specifically a [Pydantic model](https://docs.pydantic.dev/latest/concepts/models/).  As I was building out this application, I continually ran into problems with the LLM.  The problem was not providing correct responses, which it did, but responses that had the same structure and continuity from question to question.  Even trying very explicit instructions in the prompt like “Only return relevant metrics and dimensions” or “Do not explain your output in any way”, I continued to receive output that made it hard to parse and then extract the relevant information to form an appropriate request to the semantic layer.  This led me to LangChain and the [PydanticOutputParser](https://python.langchain.com/docs/modules/model_io/output_parsers/types/pydantic/), which allowed me to specify an arbitrary Pydantic Model and make the output from the LLM conform to that schema.

```python
class Query(BaseModel):
    metrics: List[MetricInput]
    groupBy: Optional[List[GroupByInput]] = None
    where: Optional[List[WhereInput]] = None
    orderBy: Optional[List[OrderByInput]] = None
    limit: Optional[int] = None
```

The beauty of this approach is that I can create the individual attributes that form a query, like `metrics` or `groupBy`, and create individual Pydantic models for each of those that map to the schema that the GraphQL API expects.  Once I get it into this format, it becomes very easy to create the API request to finally return data from my snowflake warehouse that answers the question the user asked.

### Retrieving Data

Once my `Query` object has been created, I can use that output to both form the GraphQL query and the relevant variables to be used in the payload.  This payload will be the argument we pass to the UDF that we created earlier to 1) create a query via the Semantic Layer and 2) using that query ID, poll until a completion event and return the data back to the Streamlit application.  This is again an external request to the dbt Cloud Semantic Layer so a UDF will be used.

```sql
create or replace function submit_sl_request(payload string)
    returns object
    language python
    runtime_version = 3.9
    handler = 'main'
    external_access_integrations = (dbt_cloud_semantic_layer_integration)
    packages = ('requests')
    secrets = ('cred' = dbt_cloud_service_token )
as
$$
from typing import Dict
import _snowflake
import json
import requests


def main(payload: str):
    session = requests.Session()
    token = _snowflake.get_generic_secret_string('cred')
    session.headers = {'Authorization': f'Bearer {token}'}
    payload = json.loads(payload)
    results = submit_request(session, payload)
    try:
        query_id = results["data"]["createQuery"]["queryId"]
    except TypeError as e:
        raise e
    
    data = None
    while True:
        graphql_query = """
            query GetResults($environmentId: BigInt!, $queryId: String!) {
                query(environmentId: $environmentId, queryId: $queryId) {
                    arrowResult
                    error
                    queryId
                    sql
                    status
                }
            }
        """
        results_payload = {"variables": {"queryId": query_id}, "query": graphql_query}
        results = submit_request(session, results_payload)
        try:
            data = results["data"]["query"]
        except TypeError as e:
            break
        else:
            status = data["status"].lower()
            if status in ["successful", "failed"]:
                break

    return data

def submit_request(session: requests.Session, payload: Dict):
    if not "variables" in payload:
        payload["variables"] = {}
    payload["variables"].update({"environmentId": 1})
    response = session.post(
        "https://semantic-layer.cloud.getdbt.com/api/graphql", json=payload
    )
    response.raise_for_status()
    return response.json()
$$;

grant usage on function submit_sl_request(string) to role public;
```

## Wrapping Up

Building this application has been an absolute blast for multiple reasons.  First, we’ve been able to use it internally within the SA org to demonstrate how the semantic layer works.  It provides yet another [integration](https://docs.getdbt.com/docs/cloud-integrations/avail-sl-integrations) point that further drives home the fundamental value prop of using the Semantic Layer.  Secondly, and more importantly, it has served as an example to those customers thinking about (or being pushed to think about) how they can best utilize these technologies to further their goals.  Finally, I’ve been able to be heads down, hands on keyboard learning about all of these interesting technologies and stepping back into the role of builder is something I will never turn down!

Finally, to see the entire code, from Snowflake to Streamlit, check out the repo [here](https://github.com/dpguthrie/dbt-sl-cortex-streamlit-blog/tree/main?tab=readme-ov-file).
