---
title: "Semantic manifest"
id: sl-manifest
description: "Learn about the semantic manifest.json file and how you can use artifacts to gain insights about your dbt Semantic Layer."
tags: [Semantic Layer, APIs]
sidebar_label: "Semantic manifest"
pagination_next: null
---

**Produced by:**  Any command that parses your project. This includes all commands _except_ [`deps`](/reference/commands/deps), [`clean`](/reference/commands/clean), [`debug`](/reference/commands/debug), and [`init`](/reference/commands/init).

dbt creates an [artifact](/reference/artifacts/dbt-artifacts) file called the _Semantic Manifest_ (`semantic_manifest.json`), which MetricFlow requires to build and run metric queries properly for the dbt Semantic Layer. This artifact contains comprehensive information about your dbt Semantic Layer. It is an internal file that acts as the integration point with MetricFlow. 

By using the semantic manifest produced by dbt Core, MetricFlow will instantiate a data flow plan and generate SQL from Semantic Layer query requests. It's a valuable reference that you can use to understand the structure and details of your data models.

Similar to the [`manifest.json` file](/reference/artifacts/manifest-json), the `semantic_manifest.json` file also lives in the [target directory](/reference/global-configs/json-artifacts) of your dbt project where dbt stores various artifacts (such as compiled models and tests) generated during the execution of your project.

## Top-level keys

Top-level keys for the semantic manifest are:
-  `semantic_models` &mdash; Starting points of data with entities, dimensions, and measures, and correspond to models in your dbt project. 
-  `metrics` &mdash; Functions combining measures, constraints, and so on to define quantitative indicators.
- `project_configuration` &mdash; Contains information around your project configurations 

### Example

<File name="target/semantic_manifest.json"> 

```json
{
    "semantic_models": [
        {
            "name": "semantic model name",
            "defaults": null,
            "description": "semantic model description",
            "node_relation": {
                "alias": "model alias",
                "schema_name": "model schema",
                "database": "model db",
                "relation_name": "Fully qualified relation name"
            },
            "entities": ["entities in the semantic model"],
            "measures": ["measures in the semantic model"],
            "dimensions": ["dimensions in the semantic model" ],
    "metrics": [
        {
            "name": "name of the metric",
            "description": "metric description",
            "type": "metric type",
            "type_params": {
                "measure": {
                    "name": "name for measure",
                    "filter": "filter for measure",
                    "alias": "alias for measure"
                },
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": ["metrics used in defining the metric. this is used in derived metrics"],
                "input_measures": []
            },
            "filter": null,
            "metadata": null
        }
    ],
    "project_configuration": {
        "time_spine_table_configurations": [
            {
                "location": "fully qualified table name for timespine",
                "column_name": "date column",
                "grain": "day"
            }
        ],
        "metadata": null,
        "dsi_package_version": {}
    },
    "saved_queries": [
        {
            "name": "name of the saved query",
            "query_params": {
                "metrics": [
                    "metrics used in the saved query"
                ],
                "group_by": [
                    "TimeDimension('model_primary_key__date_column', 'day')",
                    "Dimension('model_primary_key__metric_one')",
                    "Dimension('model__dimension')"
                ],
                "where": null
            },
            "description": "Description of the saved query",
            "metadata": null,
            "label": null,
            "exports": [
                {
                    "name": "saved_query_name",
                    "config": {
                        "export_as": "view",
                        "schema_name": null,
                        "alias": null
                    }
                }
            ]
        }
    ]
}
    ]
}
```

</File>

## Related docs

- [dbt Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview)
- [About dbt artifacts](/reference/artifacts/dbt-artifacts)
