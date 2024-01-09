---
title: "Semantic manifest"
id: sl-manifest
description: "Learn about the semantic manifest.json file and how you can use artifacts to gain insights about your dbt Semantic Layer."
tags: [Semantic Layer, APIs]
sidebar_label: "Semantic manifest"
pagination_next: null
---

<VersionBlock lastVersion="1.5">

import DeprecationNotice from '/snippets/_sl-deprecation-notice.md';

<DeprecationNotice />
 
</VersionBlock>

dbt creates an [artifact](/reference/artifacts/dbt-artifacts) file called the _Semantic Manifest_ (`semantic_manifest.json`), which MetricFlow requires to build and run metric queries properly for the dbt Semantic Layer. This artifact contains comprehensive information about your dbt Semantic Layer. It is an internal file that acts as the integration point with MetricFlow. 

By using the semantic manifest produced by dbt Core, MetricFlow will instantiate a data flow plan and generate SQL from Semantic Layer query requests. It's a valuable reference that you can use to understand the structure and details of your data models.

Similar to the [`manifest.json` file](/reference/artifacts/manifest-json), the `semantic_manifest.json` also lives in the `/target` directory of your dbt project. This is where dbt stores various artifacts (such as compiled models and tests) generated during the execution of your project.

## How it's produced 

The `semantic_manifest.json` is produced whenever your dbt project is parsed. The easiest way to generate the file yourself is to run `dbt parse`. Since `dbt run`, `dbt build`, and `dbt compile` all parse your dbt project, these commands will generate a semantic manifest as well. 


## Top level keys

Top-level keys for the semantic manifest are:
-  `semantic_models` &mdash; Starting points of data with entities, dimensions, and measures, and correspond to models in your dbt project. 
-  `metrics` &mdash; Functions combining measures, constraints, and so on to define quantitative indicators.
- `project_configuration` &mdash; Contains information around your project configurations 

<details>
<summary>Example <code>target/semantic_manifest.json</code> file </summary>

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
    }
}
    ]
}
```

</details>

## Related docs

- [dbt Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview)
- [About dbt artifacts](/reference/artifacts/dbt-artifacts)
