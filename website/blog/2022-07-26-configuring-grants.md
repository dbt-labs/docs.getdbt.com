---
title: "Configuring Grants"
description: "End consumers (like users and BI tools) will need to be granted the privilege to read the tables and views dbt creates in your warehouse. dbt Core 1.2 allows you to add grants to your model configuration."
slug: configuring-grants

authors: [jeremy_cohen, doug_beatty]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2022-07-26
is_featured: true
---

If you’ve needed to grant access to a dbt model, between 2019 and today, there’s a good chance you’ve come across this Discourse post:

[https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430)

This was the state of the art until recently—in fact, until today!

<!--truncate-->

This was the state of the art until recently—in fact, until today! It proposed three possible approaches:

- Using `on-run-end` hooks to `grant select on all` tables/views dbt has just built. But: “for the period of time between when a model runs, and the end of the run, no one will be able to query that model, instead they’ll get a “permission denied” error. This creates downtime in your BI tool.”
- Using `post-hook` to grant `select` on a model as soon as it’s built.
- Using default grants (future grants on Snowflake)… with the caveat that you need to give dbt’s user the `manage grants` privilege. “It is worth noting that this privilege *is* a global privilege – now anyone using the `transformer` role can change grants on any object as though they are the owner of the object. Up to you if you’re comfortable with this! If not, you may want to use a combination of `post-hooks` and `on-run-end` hooks instead 🙂”

The biggest problems:

- Even if you wrote the DRYest code you could, there are still *thousands* of projects who have all written the same exact DCL statements, wrapped in the same exact macros.
- Default + future grants—our original recommendation, back in 2019— are *tricky.* They often require extra permissions (superuser status!), they take effect automatically, and they don’t fly for folks at many organizations with tighter security policies.

## What’s changed?

In v1.2, we introduced a `grants` config.

[**https://docs.getdbt.com/reference/resource-configs/grants**](https://docs.getdbt.com/reference/resource-configs/grants)

The `grants` config works a lot like `post-hook`, with two key differences:

- You configure `grants` as a structured dictionary, `{privilege: [grantees]}`, rather than writing all the SQL yourself.
- dbt will take *the most efficient path* to apply those grants. In some cases, that means asking the database about grants already on the object, calculating diffs, and revoking + applying *just* what’s needed.

### Why `grants` are better than hooks

First of all, hooks are hard! Especially that nonsense around nested curlies. This is just a sample of the issues we get:

- [Post hooks that call macros get parsed with execute = False #2370](https://github.com/dbt-labs/dbt-core/issues/2370)
- [get_relation returns none in hook context #2938](https://github.com/dbt-labs/dbt-core/issues/2938)
- [this.is_view and this.is_table not working in BigQuery inside a hook #3529](https://github.com/dbt-labs/dbt-core/issues/3529)
- [custom table schema path of {{ this }} parsed in correctly in post-hook macro #3985](https://github.com/dbt-labs/dbt-core/issues/3985)
- [Post-hook doesn't resolve custom schema #4023](https://github.com/dbt-labs/dbt-core/issues/4023)
- [[CT-80] [Bug] post-hook macro generates SQL with incorrect source table #4606](https://github.com/dbt-labs/dbt-core/issues/4606)

Let’s say you’ve been working on an incremental model. Previously, you granted access on this incremental model directly to `reporter`, so people can query it downstream:

```sql
-- models/my_incremental_model.sql

{{ config(
	materialized = 'incremental',
	post_hook = ["grant select on {{ this }} to reporter"]
) }}

select ...
```

Over time, this model took on more and more responsibilities, it served more use cases, and you decided to refactor your project so that the incremental model actually feeds a series of more-dedicated views. Each of those views. Thoughtfully, you also removed the post hook granting access:

```sql
-- models/my_incremental_model.sql

{{ config(materialized = 'incremental') }}

select ...
```

**The problem?** Until you `--full-refresh` it, your incremental model is still granted to the `reporter` role!

dbt’s implementation takes account of this. It knows whether grants are “carried over” when a model is re-run, based on its materialization and your database. In those cases, it figures out which grants are already applied, which ones you want, and makes up the difference.

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

(Note that, if `grants` is missing or set to `{}`, dbt will understand that you don’t want it managing grants for this table. So it’s best to explicitly specify the privilege, and that you want *no one* to have it!)

If you check your database, you should see that *no one* can select from the incremental model. You could also see, in the debug-level logs, that dbt has run a `revoke` statement.

Great! You’ve just given this more thought than you should ever need to again, now that you’re using the `grants` feature in dbt v1.2 :))))

## Is there still a place for hooks???

### Granting permissions on other object types

In the v1.2 implementation, `grants` are configurable on the things that you’re used to configuring in dbt — models, seeds, snapshots. (If you’re used to `persist_docs`, it’s very similar.)

Even though dbt creates schemas at the start of runs, there isn’t really a way to configure *schemas as their own objects* within dbt. So, for now, it’s still necessary to grant `usage` on those schemas to any user that will need to select from objects in those schemas.

**Simple and familiar:**

```yaml
on-run-end:
	# better as a macro
	- "{% for schema in schemas %}grant usage on schema {{ schema }} to reporter;{% endfor %}"
```

**Too clever by half** (but—you get the idea!)

[https://github.com/dbt-labs/internal-analytics/compare/jerco/refactor-grants](https://github.com/dbt-labs/internal-analytics/compare/jerco/refactor-grants)

Now that `grants` is a real config in dbt, available via dbt metadata, you can do all sorts of fun things with it. For instance, figure out which schemas have at least one object granting `select` to a role, and then grant `usage` on that schema to that role! You can even do this at the *start* of the run, right after dbt creates its schemas, rather than waiting until the end. (It’s not a huge deal to wait.)

```yaml
on-run-start:
	- {{ grant_usage_on_schemas_where_select() }}
```

### More advanced permissions (or other operations)

Want to restrict access in a table, to specific rows for specific users? Or dynamically mask column values depending on who’s asking?

This is different for different databases. In Snowflake, for instance, you’ll still want a post-hook to apply a `row access policy` or `column access policy` to your table.

- [https://docs.snowflake.com/en/user-guide/security-row-intro.html](https://docs.snowflake.com/en/user-guide/security-row-intro.html)

On other databases, you go about this in different ways:

- [https://docs.databricks.com/security/access-control/table-acls/object-privileges.html#dynamic-view-functions](https://docs.databricks.com/security/access-control/table-acls/object-privileges.html#dynamic-view-functions)

There will always be some cutting-edge database capabilities that you may want to explore. It’s good to have hooks and operations, as a way to get started — and, when there’s a wide and clearly demonstrated need, we can build it into `dbt-core`, saving you some custom code.
