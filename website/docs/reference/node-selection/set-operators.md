---
title: "Set operators"
description: "Union and intersection set operators for dbt --select and --exclude."
---

Unions and intersections combine <Term id="selector-expression">selector expressions</Term> when you list multiple arguments for `--select` or `--exclude`. A selector expression defines a subset of nodes in your project (models, tests, seeds, and other resource types) so you do not have to run the entire DAG. For the full selection language and for named selectors in `selectors.yml`, refer to [Syntax overview](/reference/node-selection/syntax) and [YAML selectors](/reference/node-selection/yaml-selectors).

## Unions

A union merges the node sets from several selector expressions; every resource that matches _any_ of those expressions is kept. In other words, union behaves like OR across the arguments you pass to `--select` or `--exclude`.

With unions, you can pass multiple arguments separated by spaces (space-delimited). dbt resolves each argument using the normal selection rules ([selection methods](/reference/node-selection/methods), [graph operators](/reference/node-selection/graph-operators), and other selection syntax), then combines the results. If more than one argument matches the same node, that node still appears only once in the final selection (there are no duplicates).

For example, the following command combines two selector expressions. Each uses `+` to include a model and its ancestors, and the space between them merges both sets:

```bash
dbt run --select "+snowplow_sessions +fct_orders"
```

This behavior differs from an [intersection](#intersections), where comma-separated arguments with no spaces between them require a resource to satisfy _all_ criteria at once.

## Intersections

An intersection keeps only the nodes that match every selector expression; a resource must satisfy _all_ comma-separated arguments to remain in the final set.

Use commas with no spaces between them to request an intersection when you pass multiple arguments to `--select` or `--exclude`. Spaces between arguments still mean a [union](#unions). dbt resolves each argument using the normal selection rules ([selection methods](/reference/node-selection/methods), [graph operators](/reference/node-selection/graph-operators), and so on), then keeps only resources that satisfy _all_ of them. The order of comma-separated arguments does not change the final set.

Select shared upstream nodes (common ancestors of `snowplow_sessions` and `fct_orders`):

```bash
dbt run --select "+snowplow_sessions,+fct_orders"
```

Select shared downstream nodes (common descendants of `stg_invoices` and `stg_accounts`):

```bash
dbt run --select "stg_invoices+,stg_accounts+"
```

Select models that are under the `marts/finance` path and tagged `nightly`:

```bash
dbt run --select "marts.finance,tag:nightly"
```

## Combining unions and intersections

You can combine unions and intersections in a single `--select` or `--exclude` value. dbt evaluates each space-delimited argument on its own; commas with no spaces still create intersections within that argument. Joining two expressions with a space unions their results, so you can intersect to narrow one slice of the graph while still including another slice in the same run. That reduces how much of the project runs compared to a broader selection, without dropping nodes you still need.

For example, the following command unions two intersections: shared upstream nodes for `snowplow_sessions` and `fct_orders`, and models under `marts/finance` tagged `nightly`.

```bash
dbt run --select "+snowplow_sessions,+fct_orders marts.finance,tag:nightly"
```