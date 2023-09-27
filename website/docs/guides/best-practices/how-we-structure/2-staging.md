---
title: "Staging: Preparing our atomic building blocks"
id: 2-staging
description: Preparing our atomic building blocks.
displayText: Preparing our atomic building blocks.
hoverSnippet: Preparing our atomic building blocks.
---

The staging layer is where our journey begins. This is the foundation of our project, where we bring all the individual components we're going to use to build our more complex and useful models into the project.

We'll use an analogy for working with dbt throughout this guide: thinking modularly in terms of atoms, molecules, and more complex outputs like proteins or cells (we apologize in advance to any chemists or biologists for our inevitable overstretching of this metaphor). Within that framework, if our source system data is a soup of raw energy and quarks, then you can think of the staging layer as condensing and refining this material into the individual atoms we’ll later build more intricate and useful structures with.

### Staging: Files and folders

Let's zoom into the staging directory from our `models` file tree [in the overview](/guides/best-practices/how-we-structure/1-guide-overview) and walk through what's going on here.

```shell
models/staging
├── jaffle_shop
│   ├── _jaffle_shop__docs.md
│   ├── _jaffle_shop__models.yml
│   ├── _jaffle_shop__sources.yml
│   ├── base
│   │   ├── base_jaffle_shop__customers.sql
│   │   └── base_jaffle_shop__deleted_customers.sql
│   ├── stg_jaffle_shop__customers.sql
│   └── stg_jaffle_shop__orders.sql
└── stripe
    ├── _stripe__models.yml
    ├── _stripe__sources.yml
    └── stg_stripe__payments.sql
```

- **Folders.** Folder structure is extremely important in dbt. Not only do we need a consistent structure to find our way around the codebase, as with any software project, but our folder structure is also one of the key interfaces for understanding the knowledge graph encoded in our project (alongside the DAG and the data output into our warehouse). It should reflect how the data flows, step-by-step, from a wide variety of source-conformed models into fewer, richer business-conformed models. Moreover, we can use our folder structure as a means of selection in dbt [selector syntax](https://docs.getdbt.com/reference/node-selection/syntax). For example, with the above structure, if we got fresh Stripe data loaded and wanted to run all the models that build on our Stripe data, we can easily run `dbt build --select staging.stripe+` and we’re all set for building more up-to-date reports on payments.
  - ✅ **Subdirectories based on the source system**. Our internal transactional database is one system, the data we get from Stripe's API is another, and lastly the events from our Snowplow instrumentation. We've found this to be the best grouping for most companies, as source systems tend to share similar loading methods and properties between tables, and this allows us to operate on those similar sets easily.
  - ❌ **Subdirectories based on loader.** Some people attempt to group by how the data is loaded (Fivetran, Stitch, custom syncs), but this is too broad to be useful on a project of any real size.
  - ❌ **Subdirectories based on business grouping.** Another approach we recommend against is splitting up by business groupings in the staging layer, and creating subdirectories like 'marketing', 'finance', etc. A key goal of any great dbt project should be establishing a single source of truth. By breaking things up too early, we open ourselves up to creating overlap and conflicting definitions (think marketing and financing having different fundamental tables for orders). We want everybody to be building with the same set of atoms, so in our experience, starting our transformations with our staging structure reflecting the source system structures is the best level of grouping for this step.
- **File names.** Creating a consistent pattern of file naming is [crucial in dbt](https://docs.getdbt.com/blog/on-the-importance-of-naming). File names must be unique and correspond to the name of the model when selected and created in the warehouse. We recommend putting as much clear information into the file name as possible, including a prefix for the layer the model exists in, important grouping information, and specific information about the entity or transformation in the model.
  - ✅ `stg_[source]__[entity]s.sql` - the double underscore between source system and entity helps visually distinguish the separate parts in the case of a source name having multiple words. For instance, `google_analytics__campaigns` is always understandable, whereas to somebody unfamiliar `google_analytics_campaigns` could be `analytics_campaigns` from the `google` source system as easily as `campaigns` from the `google_analytics` source system. Think of it like an [oxford comma](https://www.youtube.com/watch?v=P_i1xk07o4g), the extra clarity is very much worth the extra punctuation.
  - ❌ `stg_[entity].sql` - might be specific enough at first, but will break down in time. Adding the source system into the file name aids in discoverability, and allows understanding where a component model came from even if you aren't looking at the file tree.
  - ✅ **Plural.** SQL, and particularly SQL in dbt, should read as much like prose as we can achieve. We want to lean into the broad clarity and declarative nature of SQL when possible. As such, unless there’s a single order in your `orders` table, plural is the correct way to describe what is in a table with multiple rows.

### Staging: Models

Now that we’ve got a feel for how the files and folders fit together, let’s look inside one of these files and dig into what makes for a well-structured staging model.

Below, is an example of a standard staging model (from our `stg_stripe__payments` model) that illustrates the common patterns within the staging layer. We’ve organized our model into two <Term id='cte'>CTEs</Term>: one pulling in a source table via the [source macro](https://docs.getdbt.com/docs/build/sources#selecting-from-a-source) and the other applying our transformations.

While our later layers of transformation will vary greatly from model to model, every one of our staging models will follow this exact same pattern. As such, we need to make sure the pattern we’ve established is rock solid and consistent.

```sql
-- stg_stripe__payments.sql

with

source as (

    select * from {{ source('stripe','payment') }}

),

renamed as (

    select
        -- ids
        id as payment_id,
        orderid as order_id,

        -- strings
        paymentmethod as payment_method,
        case
            when payment_method in ('stripe', 'paypal', 'credit_card', 'gift_card') then 'credit'
            else 'cash'
        end as payment_type,
        status,

        -- numerics
        amount as amount_cents,
        amount / 100.0 as amount,

        -- booleans
        case
            when status = 'successful' then true
            else false
        end as is_completed_payment,

        -- dates
        date_trunc('day', created) as created_date,

        -- timestamps
        created::timestamp_ltz as created_at

    from source

)

select * from renamed
```

- Based on the above, the most standard types of staging model transformations are:
  - ✅ **Renaming**
  - ✅ **Type casting**
  - ✅ **Basic computations** (e.g. cents to dollars)
  - ✅ **Categorizing** (using conditional logic to group values into buckets or booleans, such as in the `case when` statements above)
  - ❌ **Joins** — the goal of staging models is to clean and prepare individual source conformed concepts for downstream usage. We're creating the most useful version of a source system table, which we can use as a new modular component for our project. In our experience, joins are almost always a bad idea here — they create immediate duplicated computation and confusing relationships that ripple downstream — there are occasionally exceptions though (see [base models](#staging-other-considerations) below).
  - ❌ **Aggregations** — aggregations entail grouping, and we're not doing that at this stage. Remember - staging models are your place to create the building blocks you’ll use all throughout the rest of your project — if we start changing the grain of our tables by grouping in this layer, we’ll lose access to source data that we’ll likely need at some point. We just want to get our individual concepts cleaned and ready for use, and will handle aggregating values downstream.
- ✅ **Materialized as views.** Looking at a partial view of our `dbt_project.yml` below, we can see that we’ve configured the entire staging directory to be materialized as <Term id='view'>views</Term>. As they’re not intended to be final artifacts themselves, but rather building blocks for later models, staging models should typically be materialized as views for two key reasons:

  - Any downstream model (discussed more in [marts](/guides/best-practices/how-we-structure/4-marts)) referencing our staging models will always get the freshest data possible from all of the component views it’s pulling together and materializing
  - It avoids wasting space in the warehouse on models that are not intended to be queried by data consumers, and thus do not need to perform as quickly or efficiently

    ```yaml
    # dbt_project.yml

    models:
      jaffle_shop:
        staging:
          +materialized: view
    ```

- Staging models are the only place we'll use the [`source` macro](/docs/build/sources), and our staging models should have a 1-to-1 relationship to our source tables. That means for each source system table we’ll have a single staging model referencing it, acting as its entry point — _staging_ it — for use downstream.

:::tip Don’t Repeat Yourself.
Staging models help us keep our code <Term id='dry'>DRY</Term>. dbt's modular, reusable structure means we can, and should, push any transformations that we’ll always want to use for a given component model as far upstream as possible. This saves us from potentially wasting code, complexity, and compute doing the same transformation more than once. For instance, if we know we always want our monetary values as floats in dollars, but the source system is integers and cents, we want to do the division and type casting as early as possible so that we can reference it rather than redo it repeatedly downstream.
:::

This is a welcome change for many of us who have become used to applying the same sets of SQL transformations in many places out of necessity! For us, the earliest point for these 'always-want' transformations is the staging layer, the initial entry point in our transformation process. The DRY principle is ultimately the litmus test for whether transformations should happen in the staging layer. If we'll want them in every downstream model and they help us eliminate repeated code, they're probably okay.

### Staging: Other considerations

- **Base models when joins are necessary to stage concepts.** Sometimes, in order to maintain a clean and <Term id='dry'>DRY</Term> staging layer we do need to implement some joins to create a solid concept for our building blocks. In these cases, we recommend creating a sub-directory in the staging directory for the source system in question and building `base` models. These have all the same properties that would normally be in the staging layer, they will directly source the raw data and do the non-joining transformations, then in the staging models we’ll join the requisite base models. The most common use cases for building a base layer under a staging folder are:

  - ✅ **Joining in separate delete tables**. Sometimes a source system might store deletes in a separate table. Typically we’ll want to make sure we can mark or filter out deleted records for all our component models, so we’ll need to join these delete records up to any of our entities that follow this pattern. This is the example shown below to illustrate.

    ```sql
    -- base_jaffle_shop__customers.sql

    with

    source as (

        select * from {{ source('jaffle_shop','customers') }}

    ),

    customers as (

        select
            id as customer_id,
            first_name,
            last_name

        from source

    )

    select * from customers
    ```

    ```sql
    -- base_jaffle_shop__deleted_customers.sql

    with

    source as (

        select * from {{ source('jaffle_shop','customer_deletes') }}

    ),

    deleted_customers as (

        select
            id as customer_id,
            deleted as deleted_at

        from source

    )

    select * from deleted_customers
    ```

    ```sql
    -- stg_jaffle_shop__customers.sql

    with

    customers as (

        select * from {{ ref('base_jaffle_shop__customers') }}

    ),

    deleted_customers as (

        select * from {{ ref('base_jaffle_shop__deleted_customers') }}

    ),

    join_and_mark_deleted_customers as (

        select
            customers.*,
            case
                when deleted_customers.deleted_at is not null then true
                else false
            end as is_deleted

        from customers

        left join deleted_customers on customers.customer_id = deleted_customers.customer_id

    )

    select * from join_and_mark_deleted_customers
    ```

  - ✅ **Unioning disparate but symmetrical sources**. A typical example here would be if you operate multiple ecommerce platforms in various territories via a SaaS platform like Shopify. You would have perfectly identical schemas, but all loaded separately into your warehouse. In this case, it’s easier to reason about our orders if _all_ of our shops are unioned together, so we’d want to handle the unioning in a base model before we carry on with our usual staging model transformations on the (now complete) set — you can dig into [more detail on this use case here](https://discourse.getdbt.com/t/unioning-identically-structured-data-sources/921).

- **[Codegen](https://github.com/dbt-labs/dbt-codegen) to automate staging table generation.** It’s very good practice to learn to write staging models by hand, they’re straightforward and numerous, so they can be an excellent way to absorb the dbt style of writing SQL. Also, we’ll invariably find ourselves needing to add special elements to specific models at times — for instance, in one of the situations above that require base models — so it’s helpful to deeply understand how they work. Once that understanding is established though, because staging models are built largely following the same rote patterns and need to be built 1-to-1 for each source table in a source system, it’s preferable to start automating their creation. For this, we have the [codegen](https://github.com/dbt-labs/dbt-codegen) package. This will let you automatically generate all the source YAML and staging model boilerplate to speed up this step, and we recommend using it in every project.
- **Utilities folder.** While this is not in the `staging` folder, it’s useful to consider as part of our fundamental building blocks. The `models/utilities` directory is where we can keep any general purpose models that we generate from macros or based on seeds that provide tools to help us do our modeling, rather than data to model itself. The most common use case is a [date spine](https://github.com/dbt-labs/dbt-utils#date_spine-source) generated with [the dbt utils package](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/).

:::info Development flow versus DAG order.
This guide follows the order of the DAG, so we can get a holistic picture of how these three primary layers build on each other towards fueling impactful data products. It’s important to note though that developing models does not typically move linearly through the DAG. Most commonly, we should start by mocking out a design in a spreadsheet so we know we’re aligned with our stakeholders on output goals. Then, we’ll want to write the SQL to generate that output, and identify what tables are involved. Once we have our logic and dependencies, we’ll make sure we’ve staged all the necessary atomic pieces into the project, then bring them together based on the logic we wrote to generate our mart. Finally, with a functioning model flowing in dbt, we can start refactoring and optimizing that mart. By splitting the logic up and moving parts back upstream into intermediate models, we ensure all of our models are clean and readable, the story of our DAG is clear, and we have more surface area to apply thorough testing.
:::info
