---
title: "Use cases and examples for the Discovery API"
sidebar_label: "Uses and examples"
---

With the Discovery API, you can query the metadata in dbt Cloud to learn more about your dbt deployments and the data it generates to analyze them and make improvements.

You can use the API in a variety of ways to get answers to your business questions. Below describes some of the uses of the API and is meant to give you an idea of the questions this API can help you answer.

| Use case | Outcome | <div style={{width:'400px'}}>Example questions</div> |
| --- | --- | --- |
| [Performance](#performance) | Identify inefficiencies in pipeline execution to reduce infrastructure costs and improve timeliness. | <ul><li>What’s the latest status of each model?</li> <li>Do I need to run this model?</li><li>How long did my DAG take to run?</li> </ul>|
| [Quality](#quality) | Monitor data source freshness and test results to resolve issues and drive trust in data. | <ul><li>How fresh are my data sources?</li><li>Which tests and models failed?</li><li>What’s my project’s test coverage?</li></ul>  |
| [Discovery](#discovery) | Find and understand relevant datasets and semantic nodes with rich context and metadata. | <ul><li>What do these tables and columns mean?</li><li>What’s the full data lineage?</li><li>Which metrics can I query?</li> </ul> |
| [Governance](#governance) | Audit data development and facilitate collaboration within and between teams. | <ul><li>Who is responsible for this model?</li><li>How do I contact the model’s owner?</li><li>Who can use this model?</li></ul>|
| [Development](#development) | Understand dataset changes and usage and gauge impacts to inform project definition. | <ul><li>How is this metric used in BI tools?</li><li>Which nodes depend on this data source?</li><li>How has a model changed? What impact?</li> </ul>|

## Performance

You can use the Discovery API to identify inefficiencies in pipeline execution to reduce infrastructure costs and improve timeliness. Below are example questions and queries you can run.

For performance use cases, people typically query the historical or latest applied state across any part of the DAG (for example, models) using the `environment`, `modelByEnvironment`, or job-level endpoints.

### How long did each model take to run?

It’s helpful to understand how long it takes to build models (tables) and tests to execute during a dbt run. Longer model build times result in higher infrastructure costs and fresh data arriving later to stakeholders. Analyses like these can be in observability tools or ad-hoc queries, like in a notebook.

<Lightbox src="/img/docs/dbt-cloud/discovery-api/model-timing.png" width="200%" title="Model timing visualization in dbt Cloud"/>

<details>
<summary>Example query with code</summary>

Data teams can monitor the performance of their models, identify bottlenecks, and optimize the overall data pipeline by fetching execution details like `executionTime` and `runElapsedTime`:

1. Use latest state environment-level API to get a list of all executed models and their execution time. Then, sort the models by `executionTime` in descending order.

```graphql
query AppliedModels($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first) {
        edges {
          node {
            name
            uniqueId
            materializedType
            executionInfo {
              lastSuccessRunId
              executionTime
              executeStartedAt
            }
          }
        }
      }
    }
  }
}
```

2. Get the most recent 20 run results for the longest running model. Review the results of the model across runs or you can go to the job/run or commit itself to investigate further.

```graphql
query ModelHistoricalRuns(
  $environmentId: BigInt!
  $uniqueId: String
  $lastRunCount: Int
) {
  environment(id: $environmentId) {
    applied {
      modelHistoricalRuns(
        uniqueId: $uniqueId
        lastRunCount: $lastRunCount
      ) {
        name
        runId
        runElapsedTime
        runGeneratedAt
        executionTime
        executeStartedAt
        executeCompletedAt
        status
      }
    }
  }
}
```

3. Use the query results to plot a graph of the longest running model’s historical run time and execution time trends.

<!-- TODO: TEST THIS PYTHON CODE WORKS WITH NEW API AND DOCS! -->
```python
# Import libraries
import os
import matplotlib.pyplot as plt
import pandas as pd
import requests

# Set API key
auth_token = *[SERVICE_TOKEN_HERE]*

# Query the API
def query_discovery_api(auth_token, gql_query, variables):
    response = requests.post('https://metadata.cloud.getdbt.com/graphql',
        headers={"authorization": "Bearer "+auth_token, "content-type": "application/json"},
        json={"query": gql_query, "variables": variables})
    data = response.json()['data']

    return data

# Get the latest run metadata for all models
models_latest_metadata = query_discovery_api(auth_token, query_one, variables_query_one)['environment']

# Convert to dataframe
models_df = pd.DataFrame([x['node'] for x in models_latest_metadata['applied']['models']['edges']])

# Unnest the executionInfo column
models_df = pd.concat([models_df.drop(['executionInfo'], axis=1), models_df['executionInfo'].apply(pd.Series)], axis=1)

# Sort the models by execution time
models_df_sorted = models_df.sort_values('executionTime', ascending=False)

print(models_df_sorted)

# Get the uniqueId of the longest running model
longest_running_model = models_df_sorted.iloc[0]['uniqueId']

# Define second query variables
variables_query_two = {
    "environmentId": *[ENVR_ID_HERE]*
    "lastRunCount": 10,
    "uniqueId": longest_running_model
}

# Get the historical run metadata for the longest running model
model_historical_metadata = query_discovery_api(auth_token, query_two, variables_query_two)['environment']['applied']['modelHistoricalRuns']

# Convert to dataframe
model_df = pd.DataFrame(model_historical_metadata)

# Filter dataframe to only successful runs
model_df = model_df[model_df['status'] == 'success']

# Convert the runGeneratedAt, executeStartedAt, and executeCompletedAt columns to datetime
model_df['runGeneratedAt'] = pd.to_datetime(model_df['runGeneratedAt'])
model_df['executeStartedAt'] = pd.to_datetime(model_df['executeStartedAt'])
model_df['executeCompletedAt'] = pd.to_datetime(model_df['executeCompletedAt'])

# Plot the runElapsedTime over time
plt.plot(model_df['runGeneratedAt'], model_df['runElapsedTime'])
plt.title('Run Elapsed Time')
plt.show()

# # Plot the executionTime over time
plt.plot(model_df['executeStartedAt'], model_df['executionTime'])
plt.title(model_df['name'].iloc[0]+" Execution Time")
plt.show()
```

Plotting examples:

<Lightbox src="/img/docs/dbt-cloud/discovery-api/plot-of-runelapsedtime.png" width="80%" title="The plot of runElapsedTime over time"/>


<Lightbox src="/img/docs/dbt-cloud/discovery-api/plot-of-executiontime.png" width="80%" title="The plot of executionTime over time"/>

</details>

### What’s the latest state of each model?

The Discovery API provides information about the applied state of models and how they arrived in that state. You can retrieve the status information from the most recent run and most recent successful run (execution) from the `environment` endpoint and dive into historical runs using job-based and `modelByEnvironment` endpoints.

<details>
<summary>Example query</summary>

The API returns full identifier information (`database.schema.alias`) and the `executionInfo` for both the most recent run and most recent successful run from the database:

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first) {
        edges {
          node {
            uniqueId
            compiledCode
            database
            schema
            alias
            materializedType
            executionInfo {
              executeCompletedAt
              lastJobDefinitionId
              lastRunGeneratedAt
              lastRunId
              lastRunStatus
              lastRunError
              lastSuccessJobDefinitionId
              runGeneratedAt
              lastSuccessRunId
            }
          }
        }
      }
    }
  }
}
```

</details>

### What happened with my job run?

You can query the metadata at the job level to review results for specific runs. This is helpful for historical analysis of deployment performance or optimizing particular jobs.

<details>
<summary>Example query</summary>

Deprecated example:
```graphql
query ($jobId: Int!, $runId: Int!) {
  models(jobId: $jobId, runId: $runId) {
    name
    status
    tests {
      name
      status
    }
  }
}
```

New example:

```graphql
query ($jobId: BigInt!, $runId: BigInt!) {
  job(id: $jobId, runId: $runId) {
    models {
      name
      status
      tests {
        name
        status
      }
    }
  }
}
```

</details>

### What’s changed since the last run?
Unnecessary runs incur higher infrastructure costs and load on the data team and their systems. A model doesn’t need to be run if it’s a view and there's no code change since the last run, or if it’s a table/incremental with no code change since last run and source data has not been updated since the last run.

<details>
<summary>Example query</summary>

With the API, you can compare the `rawCode` between the definition and applied state, and review when the sources were last loaded (source `maxLoadedAt` relative to model `executeCompletedAt`) given the `materializedType` of the model:


```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(
        first: $first
        filter: { uniqueIds: "MODEL.PROJECT.MODEL_NAME" }
      ) {
        edges {
          node {
            rawCode
            ancestors(types: [Source]) {
              ... on SourceAppliedStateNestedNode {
                freshness {
                  maxLoadedAt
                }
              }
            }
            executionInfo {
              runGeneratedAt
              executeCompletedAt
            }
            materializedType
          }
        }
      }
    }
    definition {
      models(
        first: $first
        filter: { uniqueIds: "MODEL.PROJECT.MODEL_NAME" }
      ) {
        edges {
          node {
            rawCode
            runGeneratedAt
            materializedType
          }
        }
      }
    }
  }
}
```

</details>

## Quality

You can use the Discovery API to monitor data source freshness and test results to diagnose and resolve issues and drive trust in data. When used with [webhooks](/docs/deploy/webhooks), can also help with detecting, investigating, and alerting issues. Below lists example questions the API can help you answer. Below are example questions and queries you can run.

For quality use cases, people typically query the historical or latest applied state, often in the upstream part of the DAG (for example, sources), using the `environment` or `environment { applied { modelHistoricalRuns } }` endpoints.

### Which models and tests failed to run?

By filtering on the latest status, you can get lists of models that failed to build and tests that failed during their most recent execution. This is helpful when diagnosing issues with the deployment that result in delayed or incorrect data.

<details>
<summary>Example query with code</summary>

1. Get the latest run results across all jobs in the environment and return only the models and tests that errored/failed.


```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first, filter: { lastRunStatus: error }) {
        edges {
          node {
            name
            executionInfo {
              lastRunId
            }
          }
        }
      }
      tests(first: $first, filter: { status: "fail" }) {
        edges {
          node {
            name
            executionInfo {
              lastRunId
            }
          }
        }
      }
    }
  }
}
```

2. Review the historical execution and test failure rate (up to 20 runs) for a given model, such as a frequently used and important dataset.


```graphql
query ($environmentId: BigInt!, $uniqueId: String!, $lastRunCount: Int) {
  environment(id: $environmentId) {
    applied {
      modelHistoricalRuns(uniqueId: $uniqueId, lastRunCount: $lastRunCount) {
        name
        executeStartedAt
        status
        tests {
          name
          status
        }
      }
    }
  }
}
```

3. Identify the runs and plot the historical trends of failure/error rates.


</details>


### When was the data my model uses last refreshed?

You can get the metadata on the latest execution for a particular model or across all models in your project. For instance, investigate when each model or snapshot that's feeding into a given model was last executed or the source or seed was last loaded to gauge the _freshness_ of the data.

<details>
<summary>Example query with code</summary>


```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(
        first: $first
        filter: { uniqueIds: "MODEL.PROJECT.MODEL_NAME" }
      ) {
        edges {
          node {
            name
            ancestors(types: [Model, Source, Seed, Snapshot]) {
              ... on ModelAppliedStateNestedNode {
                name
                resourceType
                materializedType
                executionInfo {
                  executeCompletedAt
                }
              }
              ... on SourceAppliedStateNestedNode {
                sourceName
                name
                resourceType
                freshness {
                  maxLoadedAt
                }
              }
              ... on SnapshotAppliedStateNestedNode {
                name
                resourceType
                executionInfo {
                  executeCompletedAt
                }
              }
              ... on SeedAppliedStateNestedNode {
                name
                resourceType
                executionInfo {
                  executeCompletedAt
                }
              }
            }
          }
        }
      }
    }
  }
}
```

<!-- TODO: TEST THIS PYTHON CODE WORKS WITH NEW API AND DOCS! -->
```python
# Extract graph nodes from response
def extract_nodes(data):
    models = []
    sources = []
    groups = []
    for model_edge in data["applied"]["models"]["edges"]:
        models.append(model_edge["node"])
    for source_edge in data["applied"]["sources"]["edges"]:
        sources.append(source_edge["node"])
    for group_edge in data["definition"]["groups"]["edges"]:
        groups.append(group_edge["node"])
    models_df = pd.DataFrame(models)
    sources_df = pd.DataFrame(sources)
    groups_df = pd.DataFrame(groups)

    return models_df, sources_df, groups_df

# Construct a lineage graph with freshness info
def create_freshness_graph(models_df, sources_df):
    G = nx.DiGraph()
    current_time = datetime.now(timezone.utc)
    for _, model in models_df.iterrows():
        max_freshness = pd.Timedelta.min
        if "meta" in models_df.columns:
          freshness_sla = model["meta"]["freshness_sla"]
        else:
          freshness_sla = None
        if model["executionInfo"]["executeCompletedAt"] is not None:
          model_freshness = current_time - pd.Timestamp(model["executionInfo"]["executeCompletedAt"])
          for ancestor in model["ancestors"]:
              if ancestor["resourceType"] == "SourceAppliedStateNestedNode":
                  ancestor_freshness = current_time - pd.Timestamp(ancestor["freshness"]['maxLoadedAt'])
              elif ancestor["resourceType"] == "ModelAppliedStateNestedNode":
                  ancestor_freshness = current_time - pd.Timestamp(ancestor["executionInfo"]["executeCompletedAt"])

              if ancestor_freshness > max_freshness:
                  max_freshness = ancestor_freshness

          G.add_node(model["uniqueId"], name=model["name"], type="model", max_ancestor_freshness = max_freshness, freshness = model_freshness, freshness_sla=freshness_sla)
    for _, source in sources_df.iterrows():
        if source["maxLoadedAt"] is not None:
          G.add_node(source["uniqueId"], name=source["name"], type="source", freshness=current_time - pd.Timestamp(source["maxLoadedAt"]))
    for _, model in models_df.iterrows():
        for parent in model["parents"]:
            G.add_edge(parent["uniqueId"], model["uniqueId"])

    return G
```

Graph example:

<Lightbox src="/img/docs/dbt-cloud/discovery-api/lineage-graph-with-freshness-info.png" width="75%" title="A lineage graph with source freshness information"/>

</details>


### Are my data sources fresh?

Checking [source freshness](/docs/build/sources#snapshotting-source-data-freshness) allows you to ensure that sources loaded and used in your dbt project are compliant with expectations. The API provides the latest metadata about source loading and information about the freshness check criteria.

<Lightbox src="/img/docs/dbt-cloud/discovery-api/source-freshness-page.png" width="75%" title="Source freshness page in dbt Cloud"/>

<details>
<summary>Example query</summary>

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      sources(
        first: $first
        filter: { freshnessChecked: true, database: "production" }
      ) {
        edges {
          node {
            sourceName
            name
            identifier
            loader
            freshness {
              freshnessJobDefinitionId
              freshnessRunId
              freshnessRunGeneratedAt
              freshnessStatus
              freshnessChecked
              maxLoadedAt
              maxLoadedAtTimeAgoInS
              snapshottedAt
              criteria {
                errorAfter {
                  count
                  period
                }
                warnAfter {
                  count
                  period
                }
              }
            }
          }
        }
      }
    }
  }
}
```

</details>

### What’s the test coverage and status?

[Tests](https://docs.getdbt.com/docs/build/tests) are an important way to ensure that your stakeholders are reviewing high-quality data. You can execute tests during a dbt Cloud run. The Discovery API provides complete test results for a given environment or job, which it represents as the `children` of a given node that’s been tested (for example, a `model`).

<details>
<summary>Example query</summary>

For the following example, the `parents` are the nodes (code) that's being tested and `executionInfo` describes the latest test results:

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      tests(first: $first) {
        edges {
          node {
            name
            columnName
            parents {
              name
              resourceType
            }
            executionInfo {
              lastRunStatus
              lastRunError
              executeCompletedAt
              executionTime
            }
          }
        }
      }
    }
  }
}
```

</details>

### How is this model contracted and versioned?

To enforce the shape of a model's definition, you can define contracts on models and their columns. You can also specify model versions to keep track of discrete stages in its evolution and use the appropriate one.

<!-- TODO: The description above is not accurate for the desired query below because only applied models can query catalogs, so the query is changed to `environment.applied`. We need to change the description to refer to the applied state, or do not query `catalog` from the definition state node. -->

<details>
<summary>Example query</summary>


```graphql
query {
  environment(id: 123) {
    applied {
      models(first: 100, filter: { access: public }) {
        edges {
          node {
            name
            latestVersion
            contractEnforced
            constraints {
              name
              type
              expression
              columns
            }
            catalog {
              columns {
                name
                type
              }
            }
          }
        }
      }
    }
  }
}
```

</details>

## Discovery

You can use the Discovery API to find and understand relevant datasets and semantic nodes with rich context and metadata. Below are example questions and queries you can run.

For discovery use cases, people typically query the latest applied or definition state, often in the downstream part of the DAG (for example, mart models or metrics), using the `environment` endpoint.

### What does this dataset and its columns mean?

Query the Discovery API to map a table/view in the data platform to the model in the dbt project; then, retrieve metadata about its meaning, including descriptive metadata from its YAML file and catalog information from its YAML file and the schema.

<details>
<summary>Example query</summary>

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(
        first: $first
        filter: {
          database: "analytics"
          schema: "prod"
          identifier: "customers"
        }
      ) {
        edges {
          node {
            name
            description
            tags
            meta
            catalog {
              columns {
                name
                description
                type
              }
            }
          }
        }
      }
    }
  }
}
```
</details>

<!-- TODO: Revise this section to use the `environment.definition.lineage` endpoints instead of querying all nodes

### What’s the full data lineage?

Lineage, enabled by the `ref` function, is at the core of dbt. Understanding lineage provides many benefits, such as understanding the structure and relationships of datasets (and metrics) and performing impact-and-root-cause analyses to resolve or present issues given changes to definitions or source data. With the Discovery API, you can construct lineage using the `parents` nodes or its `children` and query the entire upstream lineage using `ancestors`.

<Lightbox src="/img/docs/dbt-cloud/discovery-api/example-dag.png" width="80%" title="Example of a DAG"/>

<details>
<summary>Example query with code</summary>

1. Query all project nodes

```graphql
query Lineage($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    definition {
      sources(first: $first) {
        edges {
          node {
            uniqueId
            name
            resourceType
            children {
              uniqueId
              name
              resourceType
            }
          }
        }
      }
      seeds(first: $first) {
        edges {
          node {
            uniqueId
            name
            resourceType
            children {
              uniqueId
              name
              resourceType
            }
          }
        }
      }
      snapshots(first: $first) {
        edges {
          node {
            uniqueId
            name
            resourceType
            parents {
              uniqueId
              name
              resourceType
            }
            children {
              uniqueId
              name
              resourceType
            }
          }
        }
      }
      models(first: $first) {
        edges {
          node {
            uniqueId
            name
            resourceType
            parents {
              uniqueId
              name
              resourceType
            }
            children {
              uniqueId
              name
              resourceType
            }
          }
        }
      }
      exposures(first: $first) {
        edges {
          node {
            uniqueId
            name
            resourceType
            parents {
              uniqueId
              name
              resourceType
            }
          }
        }
      }
      # metrics and semanticModels coming soon...
    }
  }
}
```

Then, extract the node definitions and create a lineage graph. You can traverse downstream from sources and seeds (adding an edge from each node with children to its children) or iterate through each node’s parents (if it has them). Remember that models, snapshots, and metrics can have parents and children, whereas sources and seeds have only children and exposures only have parents.


2. Extract the node definitions, construct a lineage graph, and plot the graph.

```python
# TODO: TEST THIS PYTHON CODE WORKS WITH NEW API AND DOCS!
import networkx as nx
import os
import matplotlib.pyplot as plt
import pandas as pd
import requests
from collections import defaultdict

# Write Discovery API query
gql_query = """
query Definition($environmentId: BigInt!, $first: Int!) {
*[ADD QUERY HERE]*
}

"""

# Define query variables
variables = {
    "environmentId": *[ADD ENV ID HERE]*,
    "first": 500
}


# Query the API
def query_discovery_api(auth_token, gql_query, variables):
    response = requests.post('https://metadata.cloud.getdbt.com/beta/graphql',
        headers={"authorization": "Bearer "+auth_token, "content-type": "application/json"},
        json={"query": gql_query, "variables": variables})
    data = response.json()['data']['environment']

    return data


# Extract nodes for graph
def extract_node_definitions(api_response):
    nodes = []
    node_types = ["models", "sources", "seeds", "snapshots", "exposures"]  # support for metrics and semanticModels coming soon
    for node_type in node_types:
        if node_type in api_response["definition"]:
            for node_edge in api_response["definition"][node_type]["edges"]:
                node_edge["node"]["type"] = node_type
                nodes.append(node_edge["node"])
    nodes_df = pd.DataFrame(nodes)
		return nodes_df


# Construct the graph
def create_generic_lineage_graph(nodes_df):
    G = nx.DiGraph()
    for _, node in nodes_df.iterrows():
        G.add_node(node["uniqueId"], name=node["name"], type=node["type"])
    for _, node in nodes_df.iterrows():
        if node["type"] not in ["sources", "seeds"]:
          for parent in node["parents"]:
              G.add_edge(parent["uniqueId"], node["uniqueId"])
    return G


# Assign graph layers
def assign_layers(G):
    layers = {}
    layer_counts = defaultdict(int)
    for node in nx.topological_sort(G):
        layer = 0
        for parent in G.predecessors(node):
            layer = max(layers[parent] + 1, layer)
        layers[node] = layer
        layer_counts[layer] += 1
    nx.set_node_attributes(G, layers, "layer")
    return layer_counts


# Plot the lineage graph
def plot_generic_graph(G):
    plt.figure(figsize=(10, 6.5))

    # Assign layers to the nodes
    layer_counts = assign_layers(G)

    # Use the multipartite_layout to create a layered layout
    pos = nx.multipartite_layout(G, subset_key="layer", align='vertical', scale=2)

    # Adjust the y-coordinate of nodes to spread them out
    y_offset = 1.0
    for node, coords in pos.items():
        layer = G.nodes[node]["layer"]
        coords[1] = (coords[1] - 0.5) * (y_offset * layer_counts[layer])

    # Define a color mapping for node types
    type_color_map = {
        "models": "blue",
        "sources": "green",
        "seeds": "lightgreen",
        "snapshots": "lightblue",
        "metrics": "red",
        "exposures": "orange"
    }

    node_colors = [type_color_map[G.nodes[n].get("type")] for n in G.nodes()]
    nx.draw(G, pos, node_color=node_colors, node_shape="s", node_size=3000, bbox=dict(facecolor="white", edgecolor='gray', boxstyle='round,pad=0.1'), edgecolors='Gray', alpha=0.8, with_labels=True, labels={n: G.nodes[n].get('name') for n in G.nodes()}, font_size=11, font_weight="bold")
    plt.axis("off")
    plt.show()


query_response = query_discovery_api(auth_token, gql_query, variables)

nodes_df = extract_node_definitions(query_response)

G = create_generic_lineage_graph(nodes_df)

plot_generic_graph(G)
```

Graph example:

<Lightbox src="/img/docs/dbt-cloud/discovery-api/lineage-graph.png" width="75%" title="A lineage graph"/>


</details>

-->

### Which metrics are available?

You can define and query metrics using the [dbt Semantic Layer](/docs/build/about-metricflow), use them for documentation purposes (like for a data catalog), and calculate aggregations (like in a BI tool that doesn’t query the SL).

<details>
<summary>Example query</summary>

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    definition {
      metrics(first: $first) {
        edges {
          node {
            name
            description
            type
            formula
            filter
            tags
            parents {
              name
              resourceType
            }
          }
        }
      }
    }
  }
}
```

</details>

## Governance

You can use the Discovery API to audit data development and facilitate collaboration within and between teams.

For governance use cases, people tend to query the latest definition state, often in the downstream part of the DAG (for example, public models), using the `environment` endpoint.

### Who is responsible for this model?

You can define and surface the groups each model is associated with. Groups contain information like owner. This can help you identify which team owns certain models and who to contact about them.

<details>
<summary>Example query</summary>

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      models(first: $first, filter: { uniqueIds: ["MODEL.PROJECT.NAME"] }) {
        edges {
          node {
            name
            description
            resourceType
            access
            group
          }
        }
      }
    }
    definition {
      groups(first: $first) {
        edges {
          node {
            name
            resourceType
            models {
              name
            }
            ownerName
            ownerEmail
          }
        }
      }
    }
  }
}
```
</details>

### Who can use this model?

You can enable people the ability to specify the level of access for a given model. In the future, public models will function like APIs to unify project lineage and enable reuse of models using cross-project refs.


<details>
<summary>Example query</summary>

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    definition {
      models(first: $first) {
        edges {
          node {
            name
            access
          }
        }
      }
    }
  }
}
```

---

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    definition {
      models(first: $first, filter: { access: public }) {
        edges {
          node {
            name
          }
        }
      }
    }
  }
}
```
</details>

## Development

You can use the Discovery API to understand dataset changes and usage and gauge impacts to inform project definition. Below are example questions and queries you can run.

For development use cases, people typically query the historical or latest definition or applied state across any part of the DAG using the `environment` endpoint.

### How is this model or metric used in downstream tools?
[Exposures](/docs/build/exposures) provide a method to define how a model or metric is actually used in dashboards and other analytics tools and use cases. You can query an exposure’s definition to see how project nodes are used and query its upstream lineage results to understand the state of the data used in it, which powers use cases like a freshness and quality status tile.

<Lightbox src="/img/docs/collaborate/dbt-explorer/data-tile-pass.jpg" width="60%" title="Embed data health tiles in your dashboards to distill trust signals for data consumers." />


<details>
<summary>Example query</summary>

Below is an example that reviews an exposure and the models used in it including when they were last executed.

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      exposures(first: $first) {
        edges {
          node {
            name
            description
            ownerName
            url
            parents {
              name
              resourceType
              ... on ModelAppliedStateNestedNode {
                executionInfo {
                  executeCompletedAt
                  lastRunStatus
                }
              }
            }
          }
        }
      }
    }
  }
}
```
</details>

### How has this model changed over time?

The Discovery API provides historical information about any resource in your project. For instance, you can view how a model has evolved over time (across recent runs) given changes to its shape and contents.

<details>
<summary>Example query</summary>

Review the differences in `compiledCode` or `columns` between runs or plot the “Approximate Size” and “Row Count” `stats` over time:

```graphql
query (
  $environmentId: BigInt!
  $uniqueId: String!
  $lastRunCount: Int!
  $withCatalog: Boolean!
) {
  environment(id: $environmentId) {
    applied {
      modelHistoricalRuns(
        uniqueId: $uniqueId
        lastRunCount: $lastRunCount
        withCatalog: $withCatalog
      ) {
        name
        compiledCode
        columns {
          name
        }
        stats {
          label
          value
        }
      }
    }
  }
}
```
</details>

### Which nodes depend on this data source?

dbt lineage begins with data sources. For a given source, you can look at which nodes are its children then iterate downstream to get the full list of dependencies.

Currently, querying beyond 1 generation (defined as a direct parent-to-child) is not supported. To see the grandchildren of a node, you need to make two queries: one to get the node and its children, and another to get the children nodes and their children.

<details>
<summary>Example query</summary>

```graphql
query ($environmentId: BigInt!, $first: Int!) {
  environment(id: $environmentId) {
    applied {
      sources(
        first: $first
        filter: { uniqueIds: ["SOURCE_NAME.TABLE_NAME"] }
      ) {
        edges {
          node {
            loader
            children {
              uniqueId
              resourceType
              ... on ModelAppliedStateNestedNode {
                database
                schema
                alias
              }
            }
          }
        }
      }
    }
  }
}
```
</details>

## Related docs

- [Query Discovery API](/docs/dbt-cloud-apis/discovery-querying)
