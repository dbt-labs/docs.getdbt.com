---
title: "Project state in dbt"
---

<Constant name="cloud" /> provides a stateful way of deploying dbt. Artifacts are accessible programmatically via the [Discovery API](/docs/dbt-cloud-apis/discovery-querying) in the metadata platform.

With the implementation of the `environment` endpoint in the Discovery API, we've introduced the idea of multiple states. The Discovery API provides a single API endpoint that returns the latest state of models, sources, and other nodes in the DAG. 

A single [deployment environment](/docs/environments-in-dbt) should represent the production state of a given <Constant name="cloud" /> project.

There are two states that can be queried in <Constant name="cloud" />:

- **Applied state** refers to what exists in the data warehouse after a successful `dbt run`. The model build succeeds and now exists as a table in the warehouse.
    
- **Definition state** depends on what exists in the project given the code defined in it (for example, manifest state), which hasn’t necessarily been executed in the data platform (maybe just the result of `dbt compile`).

## Definition (logical) vs. applied state of dbt nodes

In a dbt project, the state of a node _definition_ represents the configuration, transformations, and dependencies defined in the SQL and YAML files. It captures how the node should be processed in relation to other nodes and tables in the data warehouse and may be produced by a `dbt build`, `run`, `parse`, or `compile`. It changes whenever the project code changes. 

A node’s _applied state_ refers to the node’s actual state after it has been successfully executed in the DAG; for example, models are executed; thus, their state is applied to the data warehouse via `dbt run` or `dbt build`. It changes whenever a node is executed. This state represents the result of the transformations and the actual data stored in the database, which for models can be a table or a view based on the defined logic.

The applied state includes execution info, which contains metadata about how the node arrived in the applied state: the most recent execution (successful or attempted), such as when it began, its status, and how long it took.

Here’s how you’d query and compare the definition  vs. applied state of a model using the Discovery API: 

```graphql
query Compare($environmentId: Int!, $first: Int!) {
	environment(id: $environmentId) {
		definition {
			models(first: $first) {
				edges {
					node {
						name
						rawCode
					}
				}
			}
		}
		applied {
			models(first: $first) {
				edges {
					node {
						name
						rawCode 
						executionInfo {
							executeCompletedAt
						}
					}
				}
			}
		}
	}
}

```

Most Discovery API use cases will favor the _applied state_ since it pertains to what has actually been run and can be analyzed.
 
## Affected states by node type

The following table shows the states of dbt nodes and how they are affected by the Discovery API. 

| Node                                          | Executed in DAG  | Created by execution | Exists in database | Lineage               | States               |
|-----------------------------------------------|------------------|----------------------|--------------------|-----------------------|----------------------|
| [Analysis](/docs/build/analyses)   	        | No               | No                   | No                 | Upstream            | Definition 	      |
| [Data test](/docs/build/data-tests)           | Yes              | Yes                  | No                 | Upstream              | Applied & definition |
| [Exposure](/docs/build/exposures)             | No               | No                   | No                 | Upstream              | Definition           |
| [Group](/docs/build/groups)                   | No               | No                   | No                 | Downstream            | Definition           |
| [Macro](/docs/build/jinja-macros)             | Yes              | No                   | No                 | N/A                   | Definition           |
| [Metric](/docs/build/metrics-overview)     	| No               | No                   | No                 | Upstream & downstream | Definition           |
| [Model](/docs/build/models)                   | Yes              | Yes                  | Yes                | Upstream & downstream | Applied & definition |
| [Saved queries](/docs/build/saved-queries) <br /> (not in API)  | N/A               | N/A                  |   N/A         | N/A | N/A           |
| [Seed](/docs/build/seeds)                     | Yes              | Yes                  | Yes                | Downstream            | Applied & definition |
| [Semantic model](/docs/build/semantic-models) | No               | No                   | No                 | Upstream & downstream | Definition           |
| [Snapshot](/docs/build/snapshots)             | Yes              | Yes                  | Yes                | Upstream & downstream | Applied & definition |
| [Source](/docs/build/sources)                 | Yes              | No                   | Yes                | Downstream            | Applied & definition |
| [Unit tests](/docs/build/unit-tests)          | Yes              | Yes                  | No                 | Downstream   	       | Definition 	      |


## Caveats about state/metadata updates 

Over time, Cloud Artifacts will provide information to maintain state for features/services in <Constant name="cloud" /> and enable you to access state in <Constant name="cloud" /> and its downstream ecosystem. Cloud Artifacts is currently focused on the latest production state, but this focus will evolve.

Here are some limitations of the state representation in the Discovery API:

- Users must access the default production environment to know the latest state of a project.
- The API gets the definition from the latest manifest generated in a given deployment environment, but that often won’t reflect the latest project code state.
- Compiled code results may be outdated depending on <Constant name="cloud" /> run step order and failures.
- Catalog info can be outdated, or incomplete (in the applied state), based on if/when `docs generate` was last run.
- Source freshness checks can be out of date (in the applied state) depending on when the command was last run, and it’s not included in `build`. 
