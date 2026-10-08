---
title: "Intermediate: Purpose-built transformation steps"
id: "3-intermediate"
description: Purpose-built transformation steps.
displayText: Purpose-built transformation steps.
hoverSnippet: Purpose-built transformation steps.
---

:::info Note on the example project.
The [Jaffle Shop](https://github.com/dbt-labs/jaffle-shop) example project uses a **staging → marts** flow for simplicity. Larger projects often add an intermediate layer between staging and marts. This page covers when and how to use that layer.
:::

Once we've got our atoms ready to work with, we'll set about bringing them together into more intricate, connected molecular shapes. The intermediate layer is where these molecules live, creating varied forms with specific purposes on the way towards the more complex proteins and cells we'll use to breathe life into our data products.

### Intermediate: Files and folders

In a project that uses an intermediate layer, models typically live in an `intermediate/` subdirectory:

```shell
models/intermediate
└── finance
    ├── _int_finance__models.yml
    └── int_orders_summed_to_customer.sql
```

- **Folders**
  - ✅ **Subdirectories based on business groupings.** Much like the staging layer, we'll house this layer of models inside their own `intermediate` subfolder. Unlike the staging layer, here we shift towards being business-conformed, splitting our models up into subdirectories not by their source system, but by their area of business concern.
- **File names**
  - `✅ int_[entity]s_[verb]s.sql` - the variety of transformations that can happen inside of the intermediate layer makes it harder to dictate strictly how to name them. The best guiding principle is to think about _verbs_ (e.g. `pivoted`, `aggregated_to_user`, `joined`, `fanned_out_by_quantity`, `funnel_created`, etc.) in the intermediate layer. In a larger project, you might use an intermediate model to aggregate order items to the order grain, and name it `int_order_items_summed_to_orders`. It's easy for anybody to quickly understand what's happening in that model, even if they don't know [SQL](https://mode.com/sql-tutorial/). That clarity is worth the long file name. It's important to note that we've dropped the double underscores at this layer. In moving towards business-conformed concepts, we no longer need to separate a system and an entity and simply reference the unified entity if possible. In cases where you need intermediate models to operate at the source system level (e.g. `int_shopify__orders_summed`, `int_core__orders_summed` which you would later union), you'd preserve the double underscores. Some people like to separate the entity and verbs with double underscores as well. That's a matter of preference, but in our experience, there is often an intrinsic connection between entities and verbs in this layer that make that difficult to maintain.

:::tip Don't over-optimize too early!
The example project is very simple for illustrative purposes. This level of division in our post-staging layers is probably unnecessary when dealing with these few models. Remember, our goal is a _single_ _source of truth._ We don't want finance and marketing operating on separate `orders` models, we want to use our dbt project as a means to bring those definitions together! As such, don't split and optimize too early. If you have less than 10 marts models and aren't having problems developing and using them, feel free to forego subdirectories completely (except in the staging layer, where you should always implement them as you add new source systems to your project) until the project has grown to really need them. Using dbt is always about bringing simplicity to complexity.
:::

### Intermediate: Models

Intermediate models serve a clear, single purpose: preparing staging models for marts. Common patterns include grouping and pivoting to a different grain, fanning out rows, or isolating complex logic so marts stay readable.

- ❌ **Exposed to end users.** Intermediate models should generally not be exposed in the main production schema. They are not intended for output to final targets like dashboards or applications, so it's best to keep them separated from models that are so you can more easily control data governance and discoverability.
- ✅ **Materialized ephemerally.** Considering the above, one popular option is to default to intermediate models being materialized [ephemerally](/docs/build/materializations#ephemeral). This is generally the best place to start for simplicity. It will keep unnecessary models out of your warehouse with minimum configuration. Keep in mind though that the simplicity of ephemerals does translate a bit more difficulty in troubleshooting, as they're interpolated into the models that `ref` them, rather than existing on their own in a way that you can view the output of.
- ✅ **Materialized as views in a custom schema with special permissions.** A more robust option is to materialize your intermediate models as views in a specific [custom schema](/docs/build/custom-schemas), outside of your main production schema. This gives you added insight into development and easier troubleshooting as the number and complexity of your models grows, while remaining easy to implement and taking up negligible space.

:::tip Keep your warehouse tidy!
There are three interfaces to the organizational knowledge graph we're encoding into dbt and folder structure of our codebase, and the output into the warehouse. As such, it's really important that we consider that output intentionally! Think of the schemas, tables, and views we're creating in the warehouse as _part of the UX,_ in addition to the dashboards, ML, apps, and other use cases you may be targeting for the data. Ensuring that our output is named and grouped well, and that models not intended for broad use are either not materialized or built into special areas with specific permissions is crucial to achieving this.
:::

- Intermediate models' purposes, as these serve to break up complexity from our marts models, can take as many forms as [data transformation](https://www.getdbt.com/analytics-engineering/transformation/) might require. Some of the most common use cases of intermediate models include:

  - ✅ **Structural simplification.** Bringing together a reasonable number (typically 4 to 6) of entities or concepts (staging models, or perhaps other intermediate models) that will be joined with another similarly purposed intermediate model to generate a mart — rather than have 10 joins in our mart, we can join two intermediate models that each house a piece of the complexity, giving us increased readability, flexibility, testing surface area, and insight into our components.
  - ✅ **Re-graining.** Intermediate models are often used to fan out or collapse models to the right composite grain — if we're building a mart for `order_items` that requires us to fan out our `orders` based on the `quantity` column, creating a new single row for each item, this would be ideal to do in a specific intermediate model to maintain clarity in our mart and more easily view that our grain is correct before we mix it with other components.
  - ✅ **Isolating complex operations.** It's helpful to move any particularly complex or difficult to understand pieces of logic into their own intermediate models. This not only makes them easier to refine and troubleshoot, but simplifies later models that can reference this concept in a more clearly readable way. For example, in the `quantity` fan out example above, we benefit by isolating this complex piece of logic so we can quickly debug and thoroughly test that transformation, and downstream models can reference `order_items` in a way that's intuitively easy to grasp.

:::tip Narrow the DAG, widen the tables.
Until we get to the marts layer and start building our various outputs, we ideally want our DAG to look like an arrowhead pointed right. As we move from source-conformed to business-conformed, we're also moving from numerous, narrow, isolated concepts to fewer, wider, joined concepts. We're bringing our components together into wider, richer concepts, and that creates this shape in our DAG. This way when we get to the marts layer we have a robust set of components that can quickly and easily be put into any configuration to answer a variety of questions and serve specific needs. One rule of thumb to ensure you're following this pattern on an individual model level is allowing multiple _inputs_ to a model, but **not** multiple _outputs_. Several arrows going _into_ our post-staging models is great and expected, several arrows coming _out_ is a red flag. There are absolutely situations where you need to break this rule, but it's something to be aware of, careful about, and avoid when possible.
:::
