---
title: "Modernizing the Semantic Layer Spec"
description: "Learn about the new semantic layer specification and how it improves data modeling."
slug: modernizing-the-semantic-layer-spec
authors: [dave_connors  ]

tags: [ai, data ecosystem]
hide_table_of_contents: false

date: 2026-01-21
is_featured: true
---

## New engine, who dis?

It’s unlikely that anyone reading this blog has not heard about the new dbt Fusion engine — it’s been the talk of the data town since last January, culminating in Elias’s legendary live Coalesce 2025 demo of the incredible capabilities that native SQL comprehension in dbt can unlock. If you attended Coalesce, or have upgraded your project to Fusion already, you’ve likely also heard about the changes we’ve made to the authoring layer of dbt (the literal code you write in your project). As part of the major version upgrade, we took the opportunity to simplify + standardize the configuration language of dbt to be built to scale as we enter the next era of analytics engineering.

In particular, we wanted to reevaluate how metrics are defined in the dbt Semantic Layer. We’ve heard from numerous community members over the years that defining metrics was *just plain hard*. In conversation with internal + external users and our newest pals from SDF, we’ve come up with a redesigned YAML spec that is simpler, more integrated to the dbt configuration experience we’ve come to know and love, and built for the future. 

<!-- truncate -->

### What’s changing?

There are three major updates to the structure of semantic modeling in dbt:

- **Measures → Metrics:** Measures are removed from the authorship spec. Simple metrics now can include aggregations and expressions and are the primary building block for more complex metrics.
- **Reducing nesting:** We removed as much deep dictionary nesting as possible to simplify the look and feel of the code, and renamed keys to more directly describe their behavior.
- **Standardizing on models YAML entries:** Semantic annotations are embedded within the model’s YAML entry to remove the need to manage many YAML entries across many files to enrich your models with semantic metadata.

<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', margin: '0 -20px 20px -20px', maxWidth: 'calc(100% + 40px)'}}>

<div style={{padding: '0 12px'}}>

### Legacy implementation

```yaml
models:
  - name: customers
    description: Customer overview data mart, offering key details for each unique customer. One row per customer.
    columns:
      - name: customer_id
        description: The unique key of the orders mart.
      - name: first_ordered_at
        description: The timestamp when a customer placed their first order.

semantic_models: 
  - name: customers: 
    model: ref('customers')
    description: Semantic Model for Customers
    defaults: 
      agg_time_dimension: first_ordered_at
    entities: 
      - name: customer
        type: primary
        expr: customer_id
     dimensions: 
       - name: first_ordered_at
         type: time
         type_params:
           time_granularity: day
     measures:
       - name: lifetime_spend_pretax
         agg: sum
 
 metrics: 
   - name: lifetime_spend_pretax
     type: simple
     description: Customer's lifetime spend before tax
     label: LTV Pre-tax
     type_params:
        measure: 
          name: lifetime_spend_pretax
 
```

</div>

<div style={{padding: '0 12px'}}>

### New implementation

```yaml
models:
  - name: customers
    
    # enable semantic modeling on this model
    semantic_model:
      enabled: true 
    
    # set default aggregation time dimension as a model property
    agg_time_dimension: first_ordered_at
    
    description: Customer overview data mart, offering key details for each unique customer. One row per customer.
    
    columns:
      - name: customer_id
        description: The unique key of the orders mart.

        # annotate column as a primary entity
        entity:
          name: customer
          type: primary
          
      - name: first_ordered_at
        description: The timestamp when a customer placed their first order.

        # annotate column as a time dimension
        granularity: day
        dimension:
          type: time
          

    # define simple metric directly within the model's YAML
    metrics:

      - name: lifetime_spend_pretax
        type: simple
        description: Customer's lifetime spend before tax
        label: LTV Pre-tax
        agg: sum
```

</div>

</div>

This has a few clear benefits: 

- **DRYer code:** Semantic annotations are now alongside the model’s YAML entry, reducing duplicative work. Now, if a column within the model is a dimension or entity, you can configure it as such. The properties of the column, like its description, are then reflected as the description of the dimension / entity!
- **Tidier YAML:** A tidier metric entry is easier to write, easier to read, and easier to share context across your data team. Maintenance of metric code should be as easy as possible!

### Is this the OSI spec?

You may have heard some buzz that dbt joined the industry initiative called the [Open Semantic Interchange](https://www.snowflake.com/en/blog/open-semantic-interchange-ai-standard/), working with partners like Snowflake and Tableau to create an open standard for semantic metadata. This is not the OSI Spec! This is an update to the existing dbt Semantic Layer spec, designed to make it easier for dbt users to define and manage their metrics. However, we are actively exploring how we can align with the OSI spec in the future, and we see this as a step towards that goal.

### Get started today

This new spec is **live on the Fusion engine today.** If you’ve [migrated](/guides/upgrade-to-fusion?step=1) onto the engine, and are curious about getting started with the dbt Semantic Layer, [check out our docs](/docs/build/latest-metrics-spec) and get started defining your metrics! This new spec will also be released to dbt Core in version 1.12, coming in the near future. dbt platform users on the dbt Core engine will be able to migrate to the new spec as soon as they upgrade to the Latest dbt version!

Additionally, if you’re an existing user of the semantic layer, our [`dbt-autofix` script](https://github.com/dbt-labs/dbt-autofix) now has support for migrating from the legacy metrics implementation to the new one! Simply run `dbt-autofix deprecations --semantic-layer`, locally or in dbt Studio on the platform, and the vast majority of the code will be migrated automatically!

We’re eager for feedback! Reach out in dbt Community Slack in the [`#dbt-semantic-layer` channel](https://getdbt.slack.com/archives/C046L0VTVR6) and let us know how your migration / onboarding experience goes!
