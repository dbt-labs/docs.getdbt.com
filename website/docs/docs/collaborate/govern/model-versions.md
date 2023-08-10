---
title: "Model versions"
id: model-versions
sidebar_label: "Model versions"
description: "Version models to help with lifecycle management"
keyword: governance, model version, model versioning, dbt model versioning
---

<VersionBlock firstVersion="1.5" lastVersion="1.8">
  
:::info New functionality

This functionality is new in v1.5 — if you have thoughts, participate in [the discussion on GitHub](https://github.com/dbt-labs/dbt-core/discussions/6736)!

:::

</VersionBlock>

import VersionsCallout from '/snippets/_version-callout.md';

<VersionsCallout />

Versioning APIs is a hard problem in software engineering. The root of the challenge is that the producers and consumers of an API have competing incentives:
- Producers of an API need the ability to modify its logic and structure. There is a real cost to maintaining legacy endpoints forever, but losing the trust of downstream users is far costlier.
- Consumers of an API need to trust in its stability: their queries will keep working, and won't break without warning. Although migrating to a newer API version incurs an expense, an unplanned migration is far costlier.

When sharing a final dbt model with other teams or systems, that model is operating like an API. When the producer of that model needs to make significant changes, how can they avoid breaking the queries of its users downstream?

Model versioning is a tool to tackle this problem, thoughtfully and head-on. The goal is not to make the problem go away entirely, nor to pretend it's easier or simpler than it is.

## Related documentation
- [`versions`](/reference/resource-properties/versions)
- [`latest_version`](/reference/resource-properties/latest_version)
- [`include` & `exclude`](/reference/resource-properties/include-exclude)
- [`ref` with `version` argument](/reference/dbt-jinja-functions/ref#versioned-ref)

## Why version a model?

If a model defines a ["contract"](/docs/collaborate/govern/model-contracts) (a set of guarantees for its structure), it's also possible to change that model's structure in a way that breaks the previous set of guarantees. This could be as obvious as removing or renaming a column, or more subtle, like changing its data type or nullability.

One approach is to force every model consumer to immediately handle the breaking change as soon as it's deployed to production. This is actually the appropriate answer at many smaller organizations, or while rapidly iterating on a not-yet-mature set of data models. But it doesn’t scale well beyond that.

Instead, for mature models at larger organizations, powering queries inside & outside dbt, the model owner can use **model versions** to:
- Test "prerelease" changes (in production, in downstream systems)
- Bump the latest version, to be used as the canonical source of truth
- Offer a migration window off the "old" version

During that migration window, anywhere that model is being used downstream, it can continue to be referenced at a specific version.

dbt Core 1.6 introduced first-class support for **deprecating models** by specifying a [`deprecation_date`](/reference/resource-properties/deprecation_date). Taken together, model versions and deprecation offer a pathway for model producers to _sunset_ old models, and consumers the time to _migrate_ across breaking changes. It's a way of managing change across an organization: develop a new version, bump the latest, slate the old version for deprecation, update downstream references, and then remove the old version.

There is a real trade-off that exists here—the cost to frequently migrate downstream code, and the cost (and clutter) of materializing multiple versions of a model in the data warehouse. Model versions do not make that problem go away, but by setting a deprecation date, and communicating a clear window for consumers to gracefully migrate off old versions, they put a known boundary on the cost of that migration.

## When should you version a model?

By enforcing a model's contract, dbt can help you catch unintended changes to column names and data types that could cause a big headache for downstream queriers. If you're making these changes intentionally, you should create a new model version. If you're making a non-breaking change, you don't need a new version—such as adding a new column, or fixing a bug in an existing column's calculation.

Of course, it's possible to change a model's definition in other ways—recalculating a column in a way that doesn't change its name, data type, or enforceable characteristics—but would substantially change the results seen by downstream queriers.

This is always a judgment call. As the maintainer of a widely-used model, you know best what's a bug fix and what's an unexpected behavior change.

The process of sunsetting and migrating model versions requires real work, and likely significant coordination across teams. You should opt for non-breaking changes whenever possible. Inevitably, however, these non-breaking additions will leave your most important models with lots of unused or deprecated columns.

Rather than constantly adding a new version for each small change, you should opt for a predictable cadence (once or twice a year, communicated well in advance) where you bump the "latest" version of your model, removing columns that are no longer being used.

## How is this different from "version control"?

[Version control](/docs/collaborate/git-version-control) allows your team to collaborate simultaneously on a single code repository, manage conflicts between changes, and review changes before deploying into production. In that sense, version control is an essential tool for versioning the deployment of an entire dbt project—always the latest state of the `main` branch. In general, only one version of your project code is deployed into an environment at a time. If something goes wrong, you have the ability to roll back changes by reverting a commit or pull request, or by leveraging data platform capabilities around "time travel." 

When you make updates to a model's source code &mdash; its logical definition, in SQL or Python, or related configuration &mdash; dbt can [compare your project to the previous state](/reference/node-selection/syntax#about-node-selection), enabling you to rebuild only models that have changed, and models downstream of a change. In this way, it's possible to develop changes to a model, quickly test in CI, and efficiently deploy into production &mdash; all coordinated via your version control system.

**Versioned models are different.** Defining model `versions` is appropriate when people, systems, and processes beyond your team's control, inside or outside of dbt, depend on your models. You can neither simply go migrate them all, nor break their queries on a whim. You need to offer a migration path, with clear diffs and deprecation dates.

Multiple versions of a model will live in the same code repository at the same time, and be deployed into the same data environment simultaneously. This is similar to how web APIs are versioned: Multiple versions are live simultaneously, two or three, and not more). Over time, newer versions come online, and older versions are sunsetted .

## How is this different from just creating a new model?

Honestly, it's only a little bit different! There isn't much magic here, and that's by design.

You've always been able to copy-paste, create a new model file, and name it `dim_customers_v2.sql`. Why should you opt for a "real" versioned model instead?

As the **producer** of a versioned model:
- You keep track of all live versions in one place, rather than scattering them throughout the codebase
- You can reuse the model's configuration, and highlight just the diffs between versions
- You can select models to build (or not) based on whether they're a `latest`, `prerelease`, or `old` version
- dbt will notify consumers of your versioned model when new versions become available, or when they are slated for deprecation

As the **consumer** of a versioned model:
- You use a consistent `ref`, with the option of pinning to a specific live version
- You will be notified throughout the life cycle of a versioned model

All versions of a model preserve the model's original name. They are `ref`'d by that name, rather than the name of the file that they're defined in. By default, the `ref` resolves to the latest version (as declared by that model's maintainer), but you can also `ref` a specific version of the model, with a `version` keyword.

Let's say that `dim_customers` has three versions defined: `v2` is the "latest", `v3` is "prerelease," and `v1` is an old version that's still within its deprecation window. Because `v2` is the latest version, it gets some special treatment: it can be defined in a file without a suffix, and `ref('dim_customers')` will resolve to `v2` if a version pin is not specified. The table below breaks down the standard conventions:

| v | version    | `ref` syntax                                          | File name                                       | Database relation                                                        |
|---|------------|-------------------------------------------------------|-------------------------------------------------|--------------------------------------------------------------------------|
| 3 | "prerelease" | `ref('dim_customers', v=3)`                           | `dim_customers_v3.sql`                          | `analytics.dim_customers_v3`                                             |
| 2 | "latest"     | `ref('dim_customers', v=2)` **and** `ref('dim_customers')`  | `dim_customers_v2.sql` **or** `dim_customers.sql` | `analytics.dim_customers_v2` **and** `analytics.dim_customers` (recommended) |
| 1 | "old"        |  `ref('dim_customers', v=1)`                           | `dim_customers_v1.sql`                          | `analytics.dim_customers_v1`                                             |

As you'll see in the implementation section below, a versioned model can reuse the majority of its YAML properties and configuration. Each version needs to only say how it _differs_ from the shared set of attributes. This gives you, as the producer of a versioned model, the opportunity to highlight the differences across versions—which is otherwise difficult to detect in models with dozens or hundreds of columns—and to clearly track, in one place, all versions of the model which are currently live.

dbt also supports [`version`-based selection](/reference/node-selection/methods#the-version-method). For example, you could define a [default YAML selector](/reference/node-selection/yaml-selectors#default) that avoids running any old model versions in development, even while you continue to run them in production through a sunset and migration period. (You could accomplish something similar by applying `tags` to these models, and cycling through those tags over time.)

<File name="selectors.yml">

```yml
selectors:
  - name: exclude_old_versions
    default: "{{ target.name == 'dev' }}"
    definition:
      method: fqn
      value: "*"
      exclude:
        - method: version
          value: old
```

</File>

Because dbt knows that these models are _actually the same model_, it can notify downstream consumers as new versions become available, and as older versions are slated for deprecation.

```bash
Found an unpinned reference to versioned model 'dim_customers'.
Resolving to latest version: my_model.v2
A prerelease version 3 is available. It has not yet been marked 'latest' by its maintainer.
When that happens, this reference will resolve to my_model.v3 instead.

  Try out v3: {{ ref('my_dbt_project', 'my_model', v='3') }}
  Pin to  v2: {{ ref('my_dbt_project', 'my_model', v='2') }}
```

## How to create a new version of a model

Most often, you'll start with a model that is not yet versioned. Let's go back in time to when `dim_customers` was a simple standalone model, with an enforced contract. For simplicity, let's pretend it has only two columns, `customer_id` and `country_name`, though most mature models will have many more.

<File name="models/dim_customers.sql">

```sql
-- lots of sql

final as (
  
    select
        customer_id,
        country_name
    from ...

)

select * from final
```

</File>

<File name="models/schema.yml">

```yaml
models:
  - name: dim_customers
    config:
      materialized: table
      contract:
        enforced: true
    columns:
      - name: customer_id
        description: This is the primary key
        data_type: int
      - name: country_name
        description: Where this customer lives
        data_type: varchar
```

</File>

Let's say you need to make a breaking change to the model: Removing the `country_name` column, which is no longer reliable. First, create a new model file (SQL or Python) encompassing those breaking changes.


The default convention is naming the new file with a `_v<version>` suffix. Let's make a new file, named `dim_customers_v2.sql`. (We don't need to rename the existing model file just yet, while it's still the "latest" version.)

<File name="models/dim_customers_v2.sql">

```sql
-- lots of sql

final as (
  
    select
        customer_id
        -- country_name has been removed!
    from ...

)

select * from final
```

</File>

Now, you could define properties and configuration for `dim_customers_v2` as a new standalone model, with no actual relation to `dim_customers` save a striking resemblance. Instead, we're going to declare that these are versions of the same model, both named `dim_customers`. We can define their properties in common, and then **just** highlight the diffs between them. (Or, you can choose to define each model version with full specifications, and repeat the values they have in common.)

<Tabs>
<TabItem value="Diffs only (recommended)">

<File name="models/schema.yml">

```yaml
models:
  - name: dim_customers
    latest_version: 1
    config:
      materialized: table
      contract: {enforced: true}
    columns:
      - name: customer_id
        description: This is the primary key
        data_type: int
      - name: country_name
        description: Where this customer lives
        data_type: varchar
    
    # Declare the versions, and highlight the diffs
    versions:
    
      - v: 1
        # Matches what's above -- nothing more needed
    
      - v: 2
        # Removed a column -- this is the breaking change!
        columns:
          # This means: use the 'columns' list from above, but exclude country_name
          - include: all
            exclude: [country_name]
      
```

</File>

</TabItem>

<TabItem value="Fully specified">

<File name="models/schema.yml">

```yaml
models:
  - name: dim_customers
    latest_version: 1
    
    # declare the versions, and fully specify them
    versions:
      - v: 2
        config:
          materialized: table
          contract: {enforced: true}
        columns:
          - name: customer_id
            description: This is the primary key
            data_type: int
          # no country_name column
      
      - v: 1
        config:
          materialized: table
          contract: {enforced: true}
        columns:
          - name: customer_id
            description: This is the primary key
            data_type: int
          - name: country_name
            description: Where this customer lives
            data_type: varchar
```

</File>

</TabItem>

</Tabs>

The configuration above says: Instead of two unrelated models, I have two versioned definitions of the same model: `dim_customers_v1` and `dim_customers_v2`.

**Where are they defined?** dbt expects each model version to be defined in a file named `<model_name>_v<v>`. In this case: `dim_customers_v1.sql` and `dim_customers_v2.sql`. It's also possible to define the "latest" version in `dim_customers.sql` (no suffix), without additional configuration. Finally, you can override this convention by setting [`defined_in: any_file_name_you_want`](/reference/resource-properties/versions#defined_in)—but we strongly encourage you to follow the convention, unless you have a very good reason.

**Where will they be materialized?** Each model version will create a database relation with alias `<model_name>_v<v>`. In this case: `dim_customers_v1` and `dim_customers_v2`. See [the section below](#configuring-database-location-with-alias) for more details on configuring aliases.

**Which version is "latest"?** If not specified explicitly, the `latest_version` would be `2`, because it's numerically greatest. In this case, we've explicitly specified that `latest_version: 1`. That means `v2` is a "prerelease," in early development and testing. When we're ready to roll out `v2` to everyone by default, we would bump `latest_version: 2`, or remove `latest_version` from the specification.

### Configuring versioned models

You can reconfigure each version independently. For example, you could materialize `v2` as a table and `v1` as a view:

<File name="models/schema.yml">

```yml
versions:
  - v: 2
    config:
      materialized: table
  - v: 1
    config:
      materialized: view
```

</File>

Like with all config inheritance, any configs set _within_ the versioned model's definition (`.sql` or `.py` file) will take precedence over the configs set in YAML.

### Configuring database location with `alias`

Following the example, let's say you wanted `dim_customers_v1` to continue populating the database table named `dim_customers`. That's what the table was named previously, and you may have several other dashboards or tools expecting to read its data from `<dbname>.<schemaname>.dim_customers`.

You could use the `alias` configuration:

<File name="models/schema.yml">

```yml
      - v: 1
        config:
          alias: dim_customers   # keep v1 in its original database location
```

</File>

**The pattern we recommend:** Create a view or table clone with the model's canonical name that always points to the latest version. By following this pattern, you can offer the same flexibility as `ref`, even if someone is querying outside of dbt. Want a specific version? Pin to version X by adding the `_vX` suffix. Want the latest version? No suffix, and the view will redirect you.

We intend to build this into `dbt-core` as out-of-the-box functionality. (Upvote or comment on [dbt-core#7442](https://github.com/dbt-labs/dbt-core/issues/7442).) In the meantime, you can implement this pattern yourself with a custom macro and post-hook:

<File name="macros/create_latest_version_view.sql">

```sql
{% macro create_latest_version_view() %}

    -- this hook will run only if the model is versioned, and only if it's the latest version
    -- otherwise, it's a no-op
    {% if model.get('version') and model.get('version') == model.get('latest_version') %}

        {% set new_relation = this.incorporate(path={"identifier": model['name']}) %}

        {% set existing_relation = load_relation(new_relation) %}

        {% if existing_relation and not existing_relation.is_view %}
            {{ drop_relation_if_exists(existing_relation) }}
        {% endif %}
        
        {% set create_view_sql -%}
            -- this syntax may vary by data platform
            create or replace view {{ new_relation }}
              as select * from {{ this }}
        {%- endset %}
        
        {% do log("Creating view " ~ new_relation ~ " pointing to " ~ this, info = true) if execute %}
        
        {{ return(create_view_sql) }}
        
    {% else %}
    
        -- no-op
        select 1 as id
    
    {% endif %}

{% endmacro %}
```

</File>


<File name="dbt_project.yml">

```yml
# dbt_project.yml
models:
  post-hook:
    - "{{ create_latest_version_view() }}"
```

</File>

:::info
If your project has historically implemented [custom aliases](/docs/build/custom-aliases) by reimplementing the `generate_alias_name` macro, and you'd like to start using model versions, you should update your custom implementation to account for model versions. Specifically, we'd encourage you to add [a condition like this one](https://github.com/dbt-labs/dbt-core/blob/ada8860e48b32ac712d92e8b0977b2c3c9749981/core/dbt/include/global_project/macros/get_custom_name/get_custom_alias.sql#L26-L30).

Your existing implementation of `generate_alias_name` should not encounter any errors upon first upgrading to v1.5. It's only when you create your first versioned model, that you may see an error like:

```sh
dbt.exceptions.AmbiguousAliasError: Compilation Error
  dbt found two resources with the database representation "database.schema.model_name".
  dbt cannot create two resources with identical database representations. To fix this,
  change the configuration of one of these resources:
  - model.project_name.model_name.v1 (models/.../model_name.sql)
  - model.project_name.model_name.v2 (models/.../model_name_v2.sql)
```

We opted to use `generate_alias_name` for this functionality so that the logic remains accessible to end users, and could be reimplemented with custom logic.
:::

### Optimizing model versions

How you define each model version is completely up to you. While it's easy to start by copy-pasting from one model's SQL definition into another, you should think about _what actually is changing_ from one version to another.

For example, if your new model version is only renaming or removing certain columns, you could define one version as a view on top of the other one:

<File name="models/dim_customers_v2.sql">

```sql
{{ config(materialized = 'view') }}

{% set dim_customers_v1 = ref('dim_customers', v=1) %}

select
{{ dbt_utils.star(from=dim_customers_v1, except=["country_name"]) }}
from {{ dim_customers_v1 }}
```

</File>

Of course, if one model version makes meaningful and substantive changes to logic in another, it may not be possible to optimize it in this way. At that point, the cost of human intuition and legibility is more important than the cost of recomputing similar transformations.

We expect to develop more opinionated recommendations as teams start adopting model versions in practice. One recommended pattern we can envision: Prioritize the definition of the `latest_version`, and define other versions (old and prerelease) based on their diffs from the latest. How?
- Define the properties and configuration for the latest version in the top-level model YAML, and the diffs for other versions below (via `include`/`exclude`)
- Where possible, define other versions as `select` transformations, which take the latest version as their starting point
- When bumping the `latest_version`, migrate the SQL and YAML accordingly.

In the example above, the third point might be tricky. It's easier to _exclude_ `country_name`, than it is to add it back in. Instead, we might need to keep around the full original logic for `dim_customers_v1`—but materialize it as a `view`, to minimize the data warehouse cost of building it. If downstream queriers see slightly degraded performance, it's still significantly better than broken queries, and all the more reason to migrate to the new "latest" version.
