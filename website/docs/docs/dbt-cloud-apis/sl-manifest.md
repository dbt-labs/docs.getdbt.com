---
title: "Semantic manifest"
id: sl-manifest
description: "Learn about the semantic manifest.json file and how you can use artifacts to gain insights about your Semantic Layer."
sidebar_label: "Semantic manifest"
---

<VersionBlock lastVersion="1.5">

import UpgradeSL from '/snippets/_upgrade-new-sl.md';

<UpgradeSL />

</VersionBlock>

The dbt Semantic Layer creates an [artifact](/reference/artifacts/dbt-artifacts) file called the "Semantic Manifest" (`semantic_manifest.json`). This artifact contains comprehensive information about your Semantic Layer. You can use it as a valuable reference to understand the structure and details of your data models.

Similar to the `manifest.json` file, the Semantic Manifest also lives in the `/target` directory of your dbt project. This is where dbt stores various artifacts (such as compiled models and tests) generated during the execution of your project.

The Semantic Manifest allows you to gain insights into the entities and relationships defined in your Semantic Layer, making it easier to understand your data models and their dependencies.

QUESTIONS:
- WHAT IS IT PRODUCED BY?
- WHAT ARE THE TOP LEVEL KEYS?
- HOW DOES IT RELATED TO THE [JSON SCHEMA FILE](https://schemas.getdbt.com/)?

<details>
<summary><code>target/semantic_manifest.json</code> file </summary>

```json
{
    "semantic_models": [
        {
            "name": "orders",
            "defaults": {
                "agg_time_dimension": "ds"
            },
            "description": "Model containing order data. The grain of the table is the order id.\n",
            "node_relation": {
                "alias": "orders",
                "schema_name": "dbt_sl_test",
                "database": "ANALYTICS",
                "relation_name": "ANALYTICS.dbt_sl_test.orders"
            },
            "entities": [
                {
                    "name": "order",
                    "description": null,
                    "type": "primary",
                    "role": null,
                    "expr": "order_id",
                    "metadata": null
                },
                {
                    "name": "location",
                    "description": null,
                    "type": "foreign",
                    "role": null,
                    "expr": "location_id",
                    "metadata": null
                },
                {
                    "name": "customer",
                    "description": null,
                    "type": "foreign",
                    "role": null,
                    "expr": "customer_id",
                    "metadata": null
                }
            ],
            "measures": [
                {
                    "name": "order_total",
                    "agg": "sum",
                    "description": null,
                    "create_metric": true,
                    "expr": null,
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "food_orders",
                    "agg": "sum",
                    "description": null,
                    "create_metric": false,
                    "expr": "case when is_food_order then order_total else 0 end",
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "orders",
                    "agg": "sum",
                    "description": null,
                    "create_metric": false,
                    "expr": "1",
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "max_order_value",
                    "agg": "max",
                    "description": null,
                    "create_metric": false,
                    "expr": "order_total",
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "min_order_value",
                    "agg": "min",
                    "description": null,
                    "create_metric": false,
                    "expr": "order_total",
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "customers",
                    "agg": "count_distinct",
                    "description": null,
                    "create_metric": false,
                    "expr": "customer_id",
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "average_order_value",
                    "agg": "average",
                    "description": null,
                    "create_metric": false,
                    "expr": "order_total",
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "order_cost",
                    "agg": "sum",
                    "description": null,
                    "create_metric": false,
                    "expr": null,
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "locations_with_orders",
                    "agg": "count_distinct",
                    "description": null,
                    "create_metric": true,
                    "expr": "location_id",
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "median_order_value",
                    "agg": "median",
                    "description": null,
                    "create_metric": true,
                    "expr": "order_total",
                    "agg_params": null,
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "order_value_p99",
                    "agg": "percentile",
                    "description": null,
                    "create_metric": true,
                    "expr": "order_total",
                    "agg_params": {
                        "percentile": 0.99,
                        "use_discrete_percentile": true,
                        "use_approximate_percentile": false
                    },
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                },
                {
                    "name": "discrete_order_value_p99",
                    "agg": "percentile",
                    "description": null,
                    "create_metric": true,
                    "expr": "order_total",
                    "agg_params": {
                        "percentile": 0.99,
                        "use_discrete_percentile": true,
                        "use_approximate_percentile": false
                    },
                    "metadata": null,
                    "non_additive_dimension": null,
                    "agg_time_dimension": "ds"
                }
            ],
            "dimensions": [
                {
                    "name": "location_name",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "ds",
                    "description": null,
                    "type": "time",
                    "is_partition": false,
                    "type_params": {
                        "time_granularity": "day",
                        "validity_params": null
                    },
                    "expr": "ordered_at",
                    "metadata": null
                },
                {
                    "name": "is_food_order",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "is_drink_order",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "order_total_dim",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": "order_total",
                    "metadata": null
                }
            ],
            "metadata": null
        },
        {
            "name": "customers",
            "defaults": {
                "agg_time_dimension": "first_ordered_at"
            },
            "description": "Customer dimension table. The grain of the table is one row per customer.\n",
            "node_relation": {
                "alias": "customers",
                "schema_name": "dbt_sl_test",
                "database": "ANALYTICS",
                "relation_name": "ANALYTICS.dbt_sl_test.customers"
            },
            "entities": [
                {
                    "name": "customer",
                    "description": null,
                    "type": "primary",
                    "role": null,
                    "expr": "customer_id",
                    "metadata": null
                }
            ],
            "measures": [],
            "dimensions": [
                {
                    "name": "customer_name",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "count_lifetime_orders",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "lifetime_spend_pre_tax",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "lifetime_spend",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "customer_type",
                    "description": null,
                    "type": "categorical",
                    "is_partition": false,
                    "type_params": null,
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "first_ordered_at",
                    "description": null,
                    "type": "time",
                    "is_partition": false,
                    "type_params": {
                        "time_granularity": "day",
                        "validity_params": null
                    },
                    "expr": null,
                    "metadata": null
                },
                {
                    "name": "last_ordered_at",
                    "description": null,
                    "type": "time",
                    "is_partition": false,
                    "type_params": {
                        "time_granularity": "day",
                        "validity_params": null
                    },
                    "expr": null,
                    "metadata": null
                }
            ],
            "metadata": null
        }
    ],
    "metrics": [
        {
            "name": "east_coast_order_amount",
            "description": "Sum of orders from the east coast.",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "orders",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": {
                "where_sql_template": "dimension('location_name') in ('Philadelphia')\""
            },
            "metadata": null
        },
        {
            "name": "large_order",
            "description": "Sum of orders from the east coast.",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "orders",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": {
                "where_sql_template": "dimension('order_total_dim')\" >= 20"
            },
            "metadata": null
        },
        {
            "name": "food_order_amount",
            "description": "Sum order amount for food orders.",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "food_orders",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "food_order_pct",
            "description": "The food cost as the % of the total order",
            "type": "ratio",
            "type_params": {
                "measure": null,
                "measures": [],
                "numerator": {
                    "name": "food_orders",
                    "filter": null,
                    "alias": null
                },
                "denominator": {
                    "name": "order_total",
                    "filter": null,
                    "alias": null
                },
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "new_customer_order_pct",
            "description": "The food cost as the % of the total order",
            "type": "ratio",
            "type_params": {
                "measure": null,
                "measures": [],
                "numerator": {
                    "name": "customers",
                    "filter": {
                        "where_sql_template": "dimension('customer_type', entity_path=['customer'])\" = 'new'"
                    },
                    "alias": "customer_numerator"
                },
                "denominator": {
                    "name": "customers",
                    "filter": null,
                    "alias": null
                },
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "order_gross_profit",
            "description": "Gross profit from each order.",
            "type": "derived",
            "type_params": {
                "measure": null,
                "measures": [],
                "numerator": null,
                "denominator": null,
                "expr": "revenue - cost",
                "window": null,
                "grain_to_date": null,
                "metrics": [
                    {
                        "name": "food_order_amount",
                        "filter": null,
                        "alias": "revenue",
                        "offset_window": null,
                        "offset_to_grain": null
                    },
                    {
                        "name": "order_amount",
                        "filter": null,
                        "alias": "cost",
                        "offset_window": null,
                        "offset_to_grain": null
                    }
                ]
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "food_order_pct_cumulative",
            "description": "Example to show a ratio referenced in a derived ",
            "type": "derived",
            "type_params": {
                "measure": null,
                "measures": [],
                "numerator": null,
                "denominator": null,
                "expr": "food_order_pct * 100",
                "window": null,
                "grain_to_date": null,
                "metrics": [
                    {
                        "name": "food_order_pct",
                        "filter": null,
                        "alias": null,
                        "offset_window": null,
                        "offset_to_grain": null
                    }
                ]
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "cumulative_growth_mom",
            "description": "Example to show a ratio referenced in a derived ",
            "type": "derived",
            "type_params": {
                "measure": null,
                "measures": [],
                "numerator": null,
                "denominator": null,
                "expr": "cumulative_order_amount/cumulative_order_amount_lm",
                "window": null,
                "grain_to_date": null,
                "metrics": [
                    {
                        "name": "cumulative_order_amount",
                        "filter": null,
                        "alias": null,
                        "offset_window": null,
                        "offset_to_grain": null
                    },
                    {
                        "name": "cumulative_order_amount",
                        "filter": null,
                        "alias": "cumulative_order_amount_lm",
                        "offset_window": {
                            "count": 1,
                            "granularity": "month"
                        },
                        "offset_to_grain": null
                    }
                ]
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "food_order_gross_profit",
            "description": "The gross profit for each order",
            "type": "derived",
            "type_params": {
                "measure": null,
                "measures": [],
                "numerator": null,
                "denominator": null,
                "expr": "revenue - cost",
                "window": null,
                "grain_to_date": null,
                "metrics": [
                    {
                        "name": "order_total",
                        "filter": {
                            "where_sql_template": "dimension('is_food_order')\" = True"
                        },
                        "alias": "revenue",
                        "offset_window": null,
                        "offset_to_grain": null
                    },
                    {
                        "name": "order_amount",
                        "filter": {
                            "where_sql_template": "dimension('is_food_order')\" = True"
                        },
                        "alias": "cost",
                        "offset_window": null,
                        "offset_to_grain": null
                    }
                ]
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "cumulative_order_amount",
            "description": "The cumulative value of all orders",
            "type": "cumulative",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "order_total",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "cumulative_order_amount_l1m",
            "description": "The cumulative value of all orders",
            "type": "cumulative",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "order_total",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": {
                    "count": 1,
                    "granularity": "month"
                },
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "cumulative_order_amount_mtd",
            "description": "The cumulative value of all orders",
            "type": "cumulative",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "order_total",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": "month",
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "order_count",
            "description": "The number of orders placed",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "orders",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "max_order_amount",
            "description": "The highest order value for a given period",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "max_order_value",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "min_order_amount",
            "description": "The lowest order value for a given period",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "min_order_value",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "customers_with_orders",
            "description": "Unique count of customers placing orders",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "customers",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "returning_customers_with_orders",
            "description": "Unique count of customers placing orders",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "customers",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": {
                "where_sql_template": "dimension('customer_type', entity_path=['customer']) \" = 'returning'"
            },
            "metadata": null
        },
        {
            "name": "new_customer_with_orders",
            "description": "Unique count of customers placing orders",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "customers",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": {
                "where_sql_template": "dimension('customer_type', entity_path=['customer']) \" = 'new'"
            },
            "metadata": null
        },
        {
            "name": "average_order_amount",
            "description": "The average order value",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "average_order_value",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        },
        {
            "name": "order_amount",
            "description": "The cost of fulfilling each order",
            "type": "simple",
            "type_params": {
                "measure": null,
                "measures": [
                    {
                        "name": "order_cost",
                        "filter": null,
                        "alias": null
                    }
                ],
                "numerator": null,
                "denominator": null,
                "expr": null,
                "window": null,
                "grain_to_date": null,
                "metrics": []
            },
            "filter": null,
            "metadata": null
        }
    ],
    "interfaces_version": "0.1.0.dev3"
}
```
</details>

## Related docs

- [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview)
- [About dbt artifacts](/reference/artifacts/dbt-artifacts)

