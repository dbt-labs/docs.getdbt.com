---
title: "Updating our permissioning guidelines: grants as configs in dbt Core v1.2"
description: "End consumers (like users and BI tools) will need to be granted the privilege to read the tables and views dbt creates in your warehouse. In v1.2, we introduced a `grants` config that is easier to use than hooks and uses syntax that is database agnostic."

slug: configuring-grants

authors: [jeremy_cohen, doug_beatty]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2022-07-26
is_featured: true
---

If you’ve needed to grant access to a dbt model between 2019 and today, there’s a good chance you’ve come across the ["The exact grant statements we use in a dbt project"](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430) post on Discourse. It explained options for covering two complementary abilities:
1. querying relations via the "select" privilege
1. using the schema those relations are within via the "usage" privilege

<!--truncate-->

## The solution then
Prior to dbt Core v1.2, we proposed three possible approaches (each coming with [caveats and trade-offs](#caveats-and-trade-offs-of-the-original-guidance)):

1. Using `on-run-end` hooks to `grant select on all` tables/views dbt has just built
1. Using `post-hook` to grant `select` on a model as soon as it’s built
1. Using either default grants (future grants on Snowflake) or a combination of `post-hooks` and `on-run-end` hooks instead

These options were the state of the art... until today!

## What’s changed?

In v1.2, we [introduced](https://www.getdbt.com/blog/teaching-dbt-about-grants) a [`grants` config](https://docs.getdbt.com/reference/resource-configs/grants) that works a lot like `post-hook`, with two key differences:

- You configure `grants` as a structured dictionary rather than writing all the SQL yourself
- dbt will take *the most efficient path* to apply those grants

### Why `grants` are better than hooks

First of all, [hooks are hard](#issues-related-to-hooks)! Especially that nonsense around [nested curlies](https://docs.getdbt.com/docs/building-a-dbt-project/dont-nest-your-curlies).

#### A problem then
Let’s say you’ve been working on an incremental model. Previously, you granted access on this incremental model directly to `reporter`, so people can query it downstream:

```sql
-- models/my_incremental_model.sql

{{ config(
	materialized = 'incremental',
	post_hook = ["grant select on {{ this }} to reporter"]
) }}

select ...
```

Over time, this model took on more and more responsibilities and you decided to refactor the incremental model to feed a series of dedicated views instead. Thoughtfully, you also removed the `post_hook` that granted direct access to the incremental model:

```sql
-- models/my_incremental_model.sql

{{ config(materialized = 'incremental') }}

select ...
```

**The problem?** Until you `--full-refresh` it, your incremental model is still granted to the `reporter` role!

#### The solution today

dbt’s new `grants` implementation takes account of this. It knows whether grants are “carried over” when a model is re-run based on its materialization and your database. It makes up the difference between the existing grants and the ones you actually want.

Try it out!

```sql

-- models/my_incremental_model.sql

{{ config(
	materialized = 'incremental',
	grants = {'select': ['another_user']}
) }}

select ...
```

Run that, verify that `another_user` can select from your model. Then change your model and run it again:

```sql
-- models/my_incremental_model.sql

{{ config(
	materialized = 'incremental',
	grants = {'select': []}
) }}

select ...
```

If you check your database, you should see that *no one* can select from the incremental model. You could also see, in the debug-level logs, that dbt has run a `revoke` statement.

(Note that, if `grants` is missing or set to `{}`, dbt will understand that you don’t want it managing grants for this table. So it’s best to explicitly specify the privilege, and that you want *no one* to have it!)

Great! Now that you’re using the `grants` feature in dbt v1.2, you’ve just given this more thought than you should ever need to again 😎

## Is there still a place for hooks?

Yes, indeed! Some areas that stand out:
- [Granting permissions on other object types](#granting-permissions-on-other-object-types) like granting usage on a schema
- [Advanced permissions](#advanced-permissions-or-other-operations) like row-level access

### Granting permissions on other object types

For now, it’s still necessary to grant `usage` on schemas to users that will need to select from objects in those schemas. Even though dbt creates schemas at the start of runs, there isn’t really a way to configure *schemas as their own objects* within dbt.

Here's a couple ways you could approach it:
- Option A -- simple and familiar -- hooks to the rescue
- Option B -- too clever by half -- use the dbt graph to infer which schemas need "usage"

#### Option A: simple and familiar

```yaml
on-run-end:
	# better as a macro
	- "{% for schema in schemas %}grant usage on schema {{ schema }} to reporter;{% endfor %}"
```

Upside: Short, sweet, to the point.

Downside: we need to repeat the same list of roles here that we specified in our `grants` config.

#### Option B: Too clever by half

Now that `grants` is a real config in dbt, available via dbt metadata, you can do all sorts of fun things with it. For instance, figure out which schemas have at least one object granting `select` to a role, and then grant `usage` on that schema to that role!

```sql
-- macros/operations/reporting_grants.sql
{% macro grant_usage_on_schemas_where_select() %}
    /*
      Note: This is pseudo code only, for demonstration purposes
      For every role that can access at least one object in a schema,
      grant 'usage' on that schema to the role.
      That way, users with the role can run metadata queries showing objects
      in that schema (a common need for BI tools)
    */
    {% set schema_grants = {} %}
    {% if execute %}
      {% for node in graph.nodes.values() %}
        {% set grants = node.config.get('grants') %}
        {% set select_roles = grants['select'] if grants else [] %}
        {% if select_roles %}
          {% set database_schema = node.database ~ "." ~ node.schema %}
          {% if database_schema in database_schemas %}
            {% do schema_grants[database_schema].add(select_roles) %}
          {% else %}
            {% do schema_grants.update({database_schema: set(select_roles)}) %}
          {% endif %}
        {% endif %}
      {% endfor %}
    {% endif %}
    {% set grant_list %}
      {% for schema in schema_grants %}
        {% for role in schema_grants[schema] %}
          grant usage on schema {{ schema }} to {{ role }};
        {% endfor %}
      {% endfor %}
    {% endset %}
    {{ return(grant_list) }}
{% endmacro %}
```

This is certainly too clever -- but you get the idea, and an illustration of what's possible!

You can even do this at the *start* of the run, right after dbt creates its schemas, rather than waiting until the end. (Although it’s not a huge deal to wait.)

```yaml
on-run-start:
	- {{ grant_usage_on_schemas_where_select() }}
```

### Advanced permissions (or other operations)

Want to restrict access to specific rows in a table for specific users? Or dynamically mask column values depending on who’s asking?

The approach varies by database: in Snowflake, you’ll still want a `post-hook` to apply a [row access policy](https://docs.snowflake.com/en/user-guide/security-row-intro.html) or a column [masking policy](https://docs.snowflake.com/en/sql-reference/sql/create-masking-policy.html) to your table whereas in Databricks you'd use [dynamic view functions](https://docs.databricks.com/security/access-control/table-acls/object-privileges.html#dynamic-view-functions).

It’s good to have hooks and operations as a method to utilize cutting-edge database capabilities. Any cases that become a wide and clearly demonstrated need can be upgraded by being built into `dbt-core`.

## Appendix

### Caveats and trade-offs of the original guidance
`on-run-end` hooks:
> for the period of time between when a model runs, and the end of the run, no one will be able to query that model, instead they’ll get a “permission denied” error. This creates downtime in your BI tool.”

`manage grants` privilege:
> It is worth noting that this privilege *is* a global privilege – now anyone using the `transformer` role can change grants on any object as though they are the owner of the object. Up to you if you’re comfortable with this! If not, you may want to use a combination of `post-hooks` and `on-run-end` hooks instead 🙂”

The biggest problems:

- Even if you wrote the [DRYest](https://en.wikipedia.org/wiki/Don't_repeat_yourself) code you could, there are still *thousands* of projects who have all written the same exact [DCL](https://en.wikipedia.org/wiki/Data_control_language) statements, wrapped in the same exact macros.
- Default + future grants—our original recommendation, back in 2019— are *tricky.* They often require extra permissions (superuser status!), they take effect automatically, and they don’t fly for folks at many organizations with tighter security policies.

### Issues related to hooks
This is just a sample of the issues we've seen:
- [Post hooks that call macros get parsed with execute = False #2370](https://github.com/dbt-labs/dbt-core/issues/2370)
- [get_relation returns none in hook context #2938](https://github.com/dbt-labs/dbt-core/issues/2938)
- [this.is_view and this.is_table not working in BigQuery inside a hook #3529](https://github.com/dbt-labs/dbt-core/issues/3529)
- [custom table schema path of {{ this }} parsed in correctly in post-hook macro #3985](https://github.com/dbt-labs/dbt-core/issues/3985)
- [Post-hook doesn't resolve custom schema #4023](https://github.com/dbt-labs/dbt-core/issues/4023)
- [[CT-80] [Bug] post-hook macro generates SQL with incorrect source table #4606](https://github.com/dbt-labs/dbt-core/issues/4606)
