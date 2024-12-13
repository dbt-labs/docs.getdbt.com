---
title: "Marts: Business-defined entities"
id: "4-marts"
---

:::info
Our guidance here diverges if you use the dbt Semantic Layer. In a project without the Semantic Layer we recommend you denormalize heavily, per the best practices below. On the other hand, if you're using the Semantic Layer, we want to stay as normalized as possible to allow MetricFlow the most flexibility. Guidance for marts in a Semantic Layer context is on the next page.
:::

This is the layer where everything comes together and we start to arrange all of our atoms (staging models) and molecules (intermediate models) into full-fledged cells that have identity and purpose. We sometimes like to call this the _entity_ _layer_ or _concept layer_, to emphasize that all our marts are meant to represent a specific entity or concept at its unique grain. For instance, an order, a customer, a territory, a click event, a payment — each of these would be represented with a distinct mart, and each row would represent a discrete instance of these concepts. Unlike in a traditional Kimball star schema though, in modern data warehousing — where storage is cheap and compute is expensive — we’ll happily borrow and add any and all data from other concepts that are relevant to answering questions about the mart’s core entity. Building the same data in multiple places, as we do with `orders` in our `customers` mart example below, is more efficient in this paradigm than repeatedly rejoining these concepts (this is a basic definition of denormalization in this context). Let’s take a look at how we approach this first layer intended expressly for exposure to end users.

### Marts: Files and folders

The last layer of our core transformations is below, providing models for both `finance` and `marketing` departments.

```shell
models/marts
├── finance
│   ├── _finance__models.yml
│   ├── orders.sql
│   └── payments.sql
└── marketing
    ├── _marketing__models.yml
    └── customers.sql
```

✅ **Group by department or area of concern.** If you have fewer than 10 or so marts you may not have much need for subfolders, so as with the intermediate layer, don’t over-optimize too early. If you do find yourself needing to insert more structure and grouping though, use useful business concepts here. In our marts layer, we’re no longer worried about source-conformed data, so grouping by departments (marketing, finance, etc.) is the most common structure at this stage.

✅ **Name by entity.** Use plain English to name the file based on the concept that forms the grain of the mart’s `customers`, `orders`. Marts that don't include any time-based rollups (pure marts) should not have a time dimension (`orders_per_day`) here, typically best captured via metrics.


❌ **Build the same concept differently for different teams.** `finance_orders` and `marketing_orders` is typically considered an anti-pattern. There are, as always, exceptions — a common pattern we see is that, finance may have specific needs, for example reporting revenue to the government in a way that diverges from how the company as a whole measures revenue day-to-day. Just make sure that these are clearly designed and understandable as _separate_ concepts, not departmental views on the same concept: `tax_revenue` and `revenue` not `finance_revenue` and `marketing_revenue`.

### Marts: Models

Finally we’ll take a look at the best practices for models within the marts directory by examining two of our marts models. These are the business-conformed — that is, crafted to our vision and needs — entities we’ve been bringing these transformed components together to create.

```sql
-- orders.sql

with

orders as  (

    select * from {{ ref('stg_jaffle_shop__orders' )}}

),

order_payments as (

    select * from {{ ref('int_payments_pivoted_to_orders') }}

),

orders_and_order_payments_joined as (

    select
        orders.order_id,
        orders.customer_id,
        orders.order_date,
        coalesce(order_payments.total_amount, 0) as amount,
        coalesce(order_payments.gift_card_amount, 0) as gift_card_amount

    from orders

    left join order_payments on orders.order_id = order_payments.order_id

)

select * from orders_and_payments_joined
```

```sql
-- customers.sql

with

customers as (

    select * from {{ ref('stg_jaffle_shop__customers')}}

),

orders as (

    select * from {{ ref('orders')}}

),

customer_orders as (

    select
        customer_id,
        min(order_date) as first_order_date,
        max(order_date) as most_recent_order_date,
        count(order_id) as number_of_orders,
        sum(amount) as lifetime_value

    from orders

    group by 1

),

customers_and_customer_orders_joined as (

    select
        customers.customer_id,
        customers.first_name,
        customers.last_name,
        customer_orders.first_order_date,
        customer_orders.most_recent_order_date,
        coalesce(customer_orders.number_of_orders, 0) as number_of_orders,
        customer_orders.lifetime_value

    from customers

    left join customer_orders on customers.customer_id = customer_orders.customer_id

)

select * from customers_and_customer_orders_joined
```

- ✅ **Materialized as tables or incremental models.** Once we reach the marts layer, it’s time to start building not just our logic into the warehouse, but the data itself. This gives end users much faster performance for these later models that are actually designed for their use, and saves us costs recomputing these entire chains of models every time somebody refreshes a dashboard or runs a regression in python. A good general rule of thumb regarding materialization is to always start with a view (as it takes up essentially no storage and always gives you up-to-date results), once that view takes too long to practically _query_, build it into a table, and finally once that table takes too long to _build_ and is slowing down your runs, [configure it as an incremental model](https://docs.getdbt.com/docs/build/incremental-models/). As always, start simple and only add complexity as necessary. The models with the most data and compute-intensive transformations should absolutely take advantage of dbt’s excellent incremental materialization options, but rushing to make all your marts models incremental by default will introduce superfluous difficulty. We recommend reading this [classic post from Tristan on the limits of incremental modeling](https://discourse.getdbt.com/t/on-the-limits-of-incrementality/303).
- ✅ **Wide and denormalized.** Unlike old school warehousing, in the modern data stack storage is cheap and it’s compute that is expensive and must be prioritized as such, packing these into very wide denormalized concepts that can provide everything somebody needs about a concept as a goal.
- ❌ **Too many joins in one mart.** One good rule of thumb when building dbt transformations is to avoid bringing together too many concepts in a single mart. What constitutes ‘too many’ can vary. If you need to bring 8 staging models together with nothing but simple joins, that might be fine. Conversely, if you have 4 concepts you’re weaving together with some complex and computationally heavy window functions, that could be too much. You need to weigh the number of models you’re joining against the complexity of the logic within the mart, and if it’s too much to read through and build a clear mental model of then look to modularize. While this isn’t a hard rule, if you’re bringing together more than 4 or 5 concepts to create your mart, you may benefit from adding some intermediate models for added clarity. Two intermediate models that bring together three concepts each, and a mart that brings together those two intermediate models, will typically result in a much more readable chain of logic than a single mart with six joins.
- ✅ **Build on separate marts thoughtfully.** While we strive to preserve a narrowing DAG up to the marts layer, once here things may start to get a little less strict. A common example is passing information between marts at different grains, as we saw above, where we bring our `orders` mart into our `customers` marts to aggregate critical order data into a `customer` grain. Now that we’re really ‘spending’ compute and storage by actually building the data in our outputs, it’s sensible to leverage previously built resources to speed up and save costs on outputs that require similar data, versus recomputing the same views and CTEs from scratch. The right approach here is heavily dependent on your unique DAG, models, and goals — it’s just important to note that using a mart in building another, later mart is okay, but requires careful consideration to avoid wasted resources or circular dependencies.

:::tip Marts are entity-grained.
The most important aspect of marts is that they contain all of the useful data about a _particular entity_ at a granular level. That doesn’t mean we don’t bring in lots of other entities and concepts, like tons of `user` data into our `orders` mart, we do! It just means that individual `orders` remain the core grain of our table. If we start grouping `users` and `orders` along a [date spine](https://github.com/dbt-labs/dbt-utils#date_spine-source), into something like `user_orders_per_day`, we’re moving past marts into _metrics_.
:::

### Marts: Other considerations

- **Troubleshoot via tables.** While stacking views and ephemeral models up until our marts — only building data into the warehouse at the end of a chain when we have the models we really want end users to work with — is ideal in production, it can present some difficulties in development. Particularly, certain errors may seem to be surfacing in our later models that actually stem from much earlier dependencies in our model chain (ancestor models in our DAG that are built before the model throws the errors). If you’re having trouble pinning down where or what a database error is telling you, it can be helpful to temporarily build a specific chain of models as tables so that the warehouse will throw the error where it’s actually occurring.

### The dbt Semantic Layer and marts

Our structural recommendations are impacted quite a bit by whether or not you’re using the dbt Semantic Layer. If you're using the Semantic Layer, we recommend a more normalized approach to your marts. If you're not using the Semantic Layer, we recommend a more denormalized approach that has become typical in dbt projects. For the full list of recommendations on structure, naming, and organization in the Semantic Layer, check out the [How we build our metrics](/best-practices/how-we-build-our-metrics/semantic-layer-1-intro) guide, particularly the [Refactoring an existing rollup](/best-practices/how-we-build-our-metrics/semantic-layer-8-refactor-a-rollup) section.
