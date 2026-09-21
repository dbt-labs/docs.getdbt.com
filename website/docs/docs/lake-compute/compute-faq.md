---
title: "Lake Compute FAQs"
id: compute-faq
sidebar_label: "Lake Compute FAQs"
description: "Answers to common questions about Lake Compute, including project configuration, SQL compatibility, pricing, and support during private beta."
---

# Lake Compute FAQs <Lifecycle status="private_beta" />

:::info Lake Compute is in private beta

To request access, fill out the [Lake Compute signup form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform). Lake Compute is in active development and likely to change. Breaking changes may occur, documentation may be incomplete, technical support may be limited, and no service-level agreement covers it during beta. Refer to [Private beta limitations](/docs/lake-compute#private-beta-limitations) before you plan real work around it.

:::

These questions cover how Lake Compute fits into an existing dbt project during private beta. For an introduction to the product and its requirements, refer to [About Lake Compute](/docs/lake-compute).

## Setup and requirements

<Expandable alt_header="Do I need to migrate my ingestion pipelines to Fivetran or MDLS?">

No. You don't need to migrate your existing ingestion pipelines or configure Fivetran connectors to load into an MDLS destination. During private beta, Lake Compute uses a Fivetran account and an MDLS destination to provision and authenticate access. Your existing ingestion pipelines stay in place.

</Expandable>

<Expandable alt_header="Do I need to set an environment variable to use Lake Compute?">

Yes. dbt gates Lake Compute behind an experimental opt-in, so set `DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true` before you run anything:

```bash
export DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true
```

One variable covers `type: lakecompute` in `profiles.yml`, the `adapter` config on a node, and the `--adapter` flag, so you need it whether you run Lake Compute as a "sidecar" or as your default adapter. While it's off, dbt fails at parse time with a message naming the variable rather than silently building on your default adapter.

`DBT_ALLOW_EXPERIMENTAL_ADAPTERS` doesn't lift this gate. Refer to [Required environment variable](/docs/lake-compute#required-environment-variable) for the full behavior.

</Expandable>

## Projects, models, and data

<Expandable alt_header="Does Lake Compute require moving or splitting my dbt project?">

No. dbt v2 supports an experimental feature called multi-adapter invocations, which runs the same dbt project as one unified DAG across both your primary data warehouse and Lake Compute. You select the adapter, or compute engine, at the model level.

</Expandable>

<Expandable alt_header="What table formats can Lake Compute read and write?">

Lake Compute reads from and writes to Iceberg tables. Any upstream source or table that a Lake Compute model references must therefore be available as an Iceberg table.

Downstream models can reference Lake Compute models as normal, and you can materialize those downstream models however you like: as views, warehouse-native tables, Iceberg tables, and more.

</Expandable>

<Expandable alt_header="Does Lake Compute automatically identify which models I should move?">

No. Review your warehouse workload and select the models to evaluate on Lake Compute. Start with a small number of models, test their outputs, and compare their behavior and performance against the existing warehouse implementation.

</Expandable>

<Expandable alt_header="Does Lake Compute automatically translate SQL dialects?">

No. Lake Compute runs DuckDB SQL and doesn't automatically translate SQL written for another warehouse. Some straightforward models work with zero or minimal changes, while more complex models require more substantial updates and testing.

When you migrate from one SQL dialect to another, pay attention to:

- Warehouse-native functions, including proprietary AI or ML functions
- Semi-structured types such as `VARIANT`, `OBJECT`, and `ARRAY`
- Implicit casting behavior for column data types
- Window functions, whose behavior varies by engine
- Timestamp and other data-type representations when you move data between your warehouse and Iceberg

</Expandable>

<Expandable alt_header="Which models should stay on my warehouse?">

Keep models on your warehouse when they need distributed or multi-node execution, large two-sided joins, warehouse-native AI or ML functions, proprietary SQL behavior, high concurrency, or other capabilities that Lake Compute doesn't support.

</Expandable>

<Expandable alt_header="Where does my data live?">

For models that Lake Compute executes, your data lives in your own cloud storage bucket, in an open catalog that Fivetran MDLS manages. Lake Compute reads and writes those tables. It doesn't store a separate copy of the data.

For models that your data platform executes and writes to Iceberg tables, your data lives in the platform's managed Iceberg catalog, either Snowflake Horizon or Databricks Unity. That catalog may use your own cloud storage bucket or platform-managed storage.

</Expandable>

<Expandable alt_header="Can my warehouse still read tables that Lake Compute writes?">

Yes. Your warehouse accesses the same Iceberg tables by integrating with MDLS or your storage bucket. Models running on your warehouse and models living in Lake Compute can reference each other within one unified DAG, without maintaining two independent copies of the data.

</Expandable>

<Expandable alt_header="What happens if a model doesn't work well on Lake Compute?">

Reconfigure the model to run on your primary data warehouse. All the data remains available in an Iceberg catalog, so switching the execution engine for one model doesn't require moving the data or splitting the dbt project.

</Expandable>

## Pricing

<Expandable alt_header="Does Lake Compute cost anything during private beta?">

No. Lake Compute is free during private beta.

</Expandable>

## Support

<Expandable alt_header="Is Lake Compute covered by a service-level agreement during private beta?">

No. No service-level agreement (SLA) covers Lake Compute during private beta. Use Lake Compute for evaluation and feedback only, and expect limited technical support. Don't treat beta workloads as production-critical unless your team has evaluated the risks and has a fallback plan.

For the full list of what Lake Compute doesn't support during private beta, refer to [Private beta limitations](/docs/lake-compute#private-beta-limitations).

</Expandable>

<Expandable alt_header="What should I include in a support ticket?">

Include enough detail for the support team to reproduce and route the issue:

- State that the issue involves **Lake Compute private beta**.
- Your MDLS destination name and cloud region. Don't include secrets, private keys, or access tokens.
- Whether the same model succeeds when you run it on your warehouse.
- Minimal SQL or a reproducible example, with sensitive values removed.

</Expandable>

<Expandable alt_header="Should I contact dbt Support or Fivetran Support?">

Start with the team that owns the component where the failure occurs:

| Contact | Examples |
|---------|----------|
| **dbt Support** | dbt project parsing or compilation; dbt v2 or Fusion behavior; model selection; DAG or `ref` behavior; job orchestration; dbt-side connection or model configuration; a model runs on the warehouse, but dbt doesn't route it to Lake Compute as expected. |
| **Fivetran Support** | Fivetran account or MDLS setup; MDLS destination health; write credentials; the MDLS-managed catalog; storage or catalog provisioning performed through Fivetran; a Fivetran service error. |
| **Either team, if ownership is unclear** | Lake Compute execution, authentication, networking, or a failure at the boundary between dbt, Lake Compute, MDLS, and the warehouse. Identify the ticket as a Lake Compute private beta issue and include both account IDs so support can route it. Don't open duplicate tickets unless support asks you to. |

</Expandable>

## Related docs

- [About Lake Compute](/docs/lake-compute)
- [Lake Compute setup](/docs/lake-compute/compute-onboarding)
