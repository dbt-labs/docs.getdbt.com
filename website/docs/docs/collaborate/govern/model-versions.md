---
title: "Model versions"
id: model-versions
sidebar_label: "Model versions"
description: "Version models to help with lifecycle management"
---

:::info New functionality
This functionality is new in v1.5 — if you have thoughts, weigh into the [GitHub discussion](https://github.com/dbt-labs/dbt-core/discussions/6736)!
:::

Versioning APIs is a hard problem in software engineering. At the root of the challenge is the fact that the producers and consumers of an API have competing incentives:
- Producers of an API need the ability to make changes to its logic. There is a real cost associated with maintaining legacy endpoints forever, but losing the trust of downstream users is far costlier.
- Consumers of an API need to trust in its stability—their queries will keep working, and won't break without warning. There is a real cost associated with migrating to a newer API version, but unplanned migration is far costlier.

The goal of model versions is not to make the problem go away, nor to pretend it's somehow easier or simpler than it is. Rather, we want dbt to provide tools that make it possible to tackle this problem, thoughtfully and head-on, and to develop standard patterns for solving it.

## Related documentation
- [`versions`](resource-properties/versions)
- [`latest_version`](resource-properties/latest_version)
- [`include` & `exclude`](resource-properties/include-exclude)
- [`ref` with `version` argument](ref#versioned-ref)

## Why version a model?

If a model defines a ["contract"](model-contracts) (a set of guarantees for its structure), it's also possible to change that model's structure in a way that breaks the previous set of guarantees. This could be as obvious as removing or renaming a column, or more subtle, like changing its data type or nullability.

One approach is to force every model consumer to immediately handle the breaking change as soon as it's deployed to production. This is actually the appropriate answer at many smaller organizations, or while rapidly iterating on a not-yet-mature set of data models. But it doesn’t scale well beyond that.

Instead, for mature models at larger organizations, powering queries inside & outside dbt, the model owner can use **model versions** to:
- Test "prerelease" changes (in production, in downstream systems)
- Bump the latest version, to be used as the canonical source of truth
- Offer a migration window off the "old" version

During that migration window, anywhere that model is being used downstream, it can continue to be referenced at a specific version.

In the future, dbt will also offer first-class support for **deprecating models** ([dbt-core#7433](https://github.com/dbt-labs/dbt-core/issues/7433)). Taken together, model versions and deprecation offer a pathway for model producers to _sunset_ old models, and consumers the time to _migrate_ across breaking changes. It's a way of managing change across an organization: develop a new version, bump the latest, slate the old version for deprecation, update downstream references, and then remove the old version.

There is a real trade-off that exists here—the cost to frequently migrate downstream code, and the cost (and clutter) of materializing multiple versions of a model in the data warehouse. Model versions do not make that problem go away, but by setting a deprecation date, and communicating a clear window for consumers to gracefully migrate off old versions, they put a known boundary on the cost of that migration.

## When should you version a model?

By enforcing a model's contract, dbt can help you catch unintended changes to column names and data types that could cause a big headache for downstream queriers. These changes, when made intentionally, would require a new model version. But many changes are not breaking, and don't require a new version—such as adding a new column, or fixing a bug in an existing column's calculation.

Of course, it's possible to change a model's definition in other ways—recalculating a column in a way that doesn't change its name, data type, or enforceable characteristics—but would substantially change the results seen by downstream queriers.

This is always a judgment call. As the maintainer of a widely-used model, you know best what's a bug fix and what's an unexpected behavior change.

The process of sunsetting and migrating model versions requires real work, and likely significant coordination across teams. You should opt for non-breaking changes whenever possible. Inevitably, however, these non-breaking additions will leave your most important models with lots of unused or deprecated columns.

Rather than constantly adding a new version for each small change, you should opt for a predictable cadence (once or twice a year, communicated well in advance) where you bump the "latest" version of your model, removing columns that are no longer being used.

## How is this different from "version control"?

[Version control](git-version-control) allows your team to collaborate simultaneously on a single code repository, manage conflicts between changes, and review changes before deploying into production. In that sense, version control is an essential tool for versioning the deployment of an entire dbt project—always the latest state of the `main` branch. In general, only one version of your project code is deployed into an environment at a time. If something goes wrong, you have the ability to roll back changes by reverting a commit or pull request, or by leveraging data platform capabilities around "time travel." 

When you make updates to a model's source code—its logical definition, in SQL or Python, or related configuration—dbt can [compare your project to previous state](project-state), enabling you to rebuild only models that have changed, and models downstream of a change. In this way, it's possible to develop changes to a model, quickly test in CI, and efficiently deploy into production—all coordinated via your version control system.

**Versioned models are different.** Defining model `versions` is appropriate when there are people, systems, and processes beyond your team's control, inside or outside of dbt. You can neither simply go migrate them all, nor break their queries on a whim. You need to do my part by offering a migration path, with clear diffs and deprecation dates.

Multiple versions of a model will live in the same code repository at the same time, and be deployed into the same data environment simultaneously. This is similar to how web APIs are versioned: Multiple versions are live simultaneously, two or three, and not more). Over time, newer versions come online, and older versions are sunsetted .

## How is this different from just creating a new model?

Honestly, it's only a little bit different! There isn't much magic here, and that's by design.

You've always been able to create a new model, and name it `dim_customers_v2`. Why should you opt for a "real" versioned model instead?

As the **producer** of a versioned model:
1. You keep track of all live versions in one place
2. You can reuse most configuration, and highlight just the diffs
3. You can select models to build (or not) based on their version

As the **consumer** of a versioned model:
1. You use a consistent `ref`, with the option of pinning to a specific live version
2. You will be notified throughout the life cycle of a versioned model

All versions of a model preserve the model's original name. They are `ref`'d by that name, rather than the name of the file that they're defined in. By default, the `ref` resolves to the latest version (as declared by that model's maintainer), but you can also `ref` a specific version of the model, with a `version` keyword.

Let's say that `dim_customers` has three versions defined: `v2` is the "latest", `v3` is "prerelease," and `v1` is an old version that's still within its deprecation window. Because `v2` is the latest version, it gets some special treatment: it can be defined in a file without a suffix, and `ref('dim_customers')` will resolve to `v2` if a version pin is not specified. The table below breaks down the standard conventions:

| v | `ref` syntax                                          | File name                                       | Database relation                                                        |
|---|-------------------------------------------------------|-------------------------------------------------|--------------------------------------------------------------------------|
| 3 | `ref('dim_customers', v=3)`                           | `dim_customers_v3.sql`                          | `analytics.dim_customers_v3`                                             |
| 2 | `ref('dim_customers')` or `ref('dim_customers', v=2)` | `dim_customers_v2.sql` (or `dim_customers.sql`) | `analytics.dim_customers_v2` and `analytics.dim_customers` (recommended) |
| 1 | `ref('dim_customers', v=1)`                           | `dim_customers_v1.sql`                          | `analytics.dim_customers_v1`                                             |

As you'll see in the implemenatation section below, a versioned model can reuse the majority of its yaml properties and configuration. Each version needs to only say how it _differs_ from the shared set of attributes. This gives you, as the producer of a versioned model, the opportunity to highlight the differences across versions—which is otherwise difficult to detect in models with dozens or hundreds of columns—and to clearly track, in one place, all versions of the model which are currently live.

dbt also supports [`version`-based selection](node-selection/methods#the-version-method). For example, you could define a [default yaml selector](node-selection/yaml-selectors#default), to avoid running any old model versions in development—even as you continue to run them in production through a sunset and migration period. (Of course, you could accomplish something similar by applying `tags` to these models, and cycling through them over time.)

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

Because dbt knows that these models are _actually the same model_, it can notify downstream consumers as new versions become available, and (in the future) as older versions are slated for deprecation.

```bash
Found an unpinned reference to versioned model 'dim_customers'.
Resolving to latest version: my_model.v2
A prerelease version 3 is available. It has not yet been marked 'latest' by its maintainer.
When that happens, this reference will resolve to my_model.v3 instead.

  Try out v3: {{ ref(my_dbt_project, my_model, v=3) }}
  Pin to v2: {{ ref(my_dbt_project, my_model, v=2) }}
```

## How to create a new version of a model

Most often, you'll start with a model that is not yet versioned. Let's go back in time to when `dim_customers` was a simple standalone model, with an enforced contract. For simplicity, we'll pretend it had only two columns—`customer_id` and `country_name`—though most mature models will obviously have many more.

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

If you wanted to make a breaking change to the model-for example, removing a column-you'd create a new model file (SQL or Python) encompassing those breaking changes. The default convention is naming the new file with a `_v<version>` suffix. The new version can then be configured in relation to the original model, in a way that highlights the diffs between them. Or, you can choose to define each model version with full specifications, and repeat the values they have in common.

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
    
    # Declare the versions, highlighting just the diffs
    versions:
      - v: 2
        columns:
          - include: all
            exclude: [country_name] # this is the breaking change!
      - v: 1
        # No need to redefine anything -- matches the properties defined above
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


The above configuration will create two models, `dim_customers.v1` and `dim_customers.v2`.

**Where are they defined?** By convention, dbt will expect those two models to be defined in files named `dim_customers_v1.sql` and `dim_customers_v2.sql`. It will also accept `dim_customers.sql` (no suffix) as the definition of the latest version. (It is possible to override this by setting [`defined_in: any_file_name_you_want`](resource-properties/versions#defined_in), but only if you have a good reason. We strongly encourage you to follow the convention.)

**Where will they be materialized?** By convention, these will create database relations with aliases `dim_customers_v1` and `dim_customers_v2`. In the future, dbt will also create a view or clone, named `dim_customers`, pointing to the latest version. See [the section below](#configuring-database-location-with-alias) for a way to implement this now.

**Which version is "latest"?** If not specified explicitly, the `latest_version` would be `2` (numerically greatest). In this case, `v1` is specified to still be the latest; `v2` is a prerelease in early development. When we're ready to roll out `v2` to everyone by default, we would bump the `latest_version` to `2`, or remove it from the specification.

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

Like with all config inheritance, any configs set _within_ the versioned model's definition (`.sql` or `.py` file) will take precedence over the configs set in yaml.

### Configuring database location with `alias`

Following the example, let's say you wanted `dim_customers.v1` to continue populating the database table named `dim_customers`. That's what the table was named previously, and you may have several other dashboards or tools expecting to read its data from `<dbname>.<schemaname>.dim_customers`.

You could use the `alias` configuration:

<File name="models/schema.yml">

```yml
      - v: 1
        config:
          alias: dim_customers   # keep v1 in its original database location
```

</File>

Or, you could do one better: Define a post-hook to create a view named `dim_customers`, which always points to the latest version of the `dim_customers` model. You can find logic for just such a hook in [this gist](https://gist.github.com/jtcohen6/68220cd76b0bde088d3439664ccfb013/edit). Then, you can implement this for all versioned models in your project:

<File name="dbt_project.yml">

```sql
{% macro create_latest_version_view() %}

    {% if model.get('version') and model.get('version') == model.get('latest_version') %}

        {% set new_relation = api.Relation.create(
            database = this.database,
            schema = this.schema,
            identifier = model['name']
        ) %}
        
        {% set existing_relation = load_relation(new_relation) %}
        {{ drop_relation_if_exists(existing_relation) }}
        
        {% set create_view_sql = create_view_as(new_relation, "select * from " ~ this) -%}
        
        {% do log("Creating view " ~ new_relation ~ " pointing to " ~ this, info = true) if execute %}
        
        {{ return(create_view_sql) }}
        
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

**This is the pattern we recommend,** and we intend to build it into to `dbt-core` as out-of-the-box functionality: [dbt-core#7442](https://github.com/dbt-labs/dbt-core/issues/7442).

By following this pattern, you can offer the same flexibility as `ref`, even if someone is querying outside of dbt. Want a specific version? Pin to version X by adding the `_vX` suffix. Want the latest version? No suffix.

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

{% set dim_customers_v1 = ref('dim_customers', v=1)}

select
{{ dbt_utils.star(from=dim_customers_v1, except=["country_name"]) }}
from {{ dim_customers_v1 }}
```

</File>

Of course, if one model version makes meaningful and substantive changes to logic in another, it may not be possible to optimize it in this way. At that point, the cost of human intuition and legibility is more important than the cost of recomputing similar transformations.

We expect to develop more opinionated recommendations as teams start adopting model versions in practice. One recommended pattern we can envision: Prioritize the definition of the `latest_version`, and define other versions (old and prerelease) based on their diffs from the latest. How?
- Define the properties and configuration for the latest version in the top-level model yaml, and the diffs for other versions below (via `include`/`exclude`)
- Where possible, define other versions as `select` transformations, which take the latest version as their starting point
- When bumping the `latest_version`, migrate the SQL and yaml accordingly.

In the example above, the third point might be tricky. It's easier to _exclude_ `country_name`, than it is to add it back in. Instead, we might need to keep around the full original logic for `dim_customers.v1`—but materialize it as a `view`, to minimize the data warehouse cost of building it. If downstream queriers see slightly degraded performance, it's still significantly better than broken queries, and all the more reason to migrate to the new "latest" version.
