---
title: "Set operators"
---

### Unions
Providing multiple space-delineated arguments to the `--select`, `--exclude`, or `--selector` flags selects
the union of them all. If a resource is included in at least one selector, it will be
included in the final set.

Run snowplow_sessions, all ancestors of snowplow_sessions, fct_orders, and all ancestors of fct_orders:

<Tabs
  defaultValue="modern"
  values={[
    { label: 'v0.21.0 and later', value: 'modern', },
    { label: 'v0.20.x and earlier', value: 'legacy', }
  ]
}>
<TabItem value="modern">

  ```bash
  $ dbt run --select +snowplow_sessions +fct_orders
  ```

</TabItem>
<TabItem value="legacy">

  ```bash
  $ dbt run --models +snowplow_sessions +fct_orders
  ```

</TabItem>
</Tabs>

### Intersections
<Changelog>New in v0.18.0</Changelog>

If multiple arguments to `--select`, `--exclude`, and `--select` can be comma-separated (with no whitespace in between),
dbt will select only resources which satisfy _all_ arguments.

Run all the common ancestors of snowplow_sessions and fct_orders:

<Tabs
  defaultValue="modern"
  values={[
    { label: 'v0.21.0 and later', value: 'modern', },
    { label: 'v0.20.x and earlier', value: 'legacy', }
  ]
}>
<TabItem value="modern">

  ```bash
  $ dbt run --select +snowplow_sessions,+fct_orders
  ```

</TabItem>
<TabItem value="legacy">

  ```bash
  $ dbt run --models +snowplow_sessions,+fct_orders
  ```

</TabItem>
</Tabs>


Run all the common descendents of stg_invoices and stg_accounts:

<Tabs
  defaultValue="modern"
  values={[
    { label: 'v0.21.0 and later', value: 'modern', },
    { label: 'v0.20.x and earlier', value: 'legacy', }
  ]
}>
<TabItem value="modern">

  ```bash
  $ dbt run --select stg_invoices+,stg_accounts+
  ```

</TabItem>
<TabItem value="legacy">

  ```bash
  $ dbt run --models stg_invoices+,stg_accounts+
  ```

</TabItem>
</Tabs>

Run models that are in the marts/finance subdirectory *and* tagged nightly:

<Tabs
  defaultValue="modern"
  values={[
    { label: 'v0.21.0 and later', value: 'modern', },
    { label: 'v0.20.x and earlier', value: 'legacy', }
  ]
}>
<TabItem value="modern">

  ```bash
  $ dbt run --select marts.finance,tag:nightly
  ```

</TabItem>
<TabItem value="legacy">

  ```bash
  $ dbt run --models marts.finance,tag:nightly
  ```

</TabItem>
</Tabs>
