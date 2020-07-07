---
title: "as_native"
id: "as_native"
---

The `as_native` Jinja filter will coerce Jinja-compiled output into its 
Python native representation according to [`ast.literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval). 
The result can be any Python native type (set, list, tuple, dict, etc).

:::danger Proceed with caution
Unlike `as_bool` and `as_number`, `as_native` will return a rendered value
regardless of the input type. Ensure that your inputs match expectations.
:::

### Usage

In the example below, the `as_native` filter is used to coerce a dbt project
variable into a dictionary for freshness testing.

<File name='src_stripe.yml'>

```yml
sources:
  - name: stripe
    freshness: "{{ var('stripe_freshness') | as_native }}"
```

</File>

<File name='dbt_project.yml'>

```yml
vars:
  stripe_freshness:
    warn_after: {count: 12, period: hour}
    error_after: {count: 24, period: hour}
```

</File>

<Changelog>

* `v0.17.1`: Native rendering is disabled by default. The `as_native` filter was 
introduced.

</Changelog>
