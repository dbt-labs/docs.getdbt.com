---
title: "as_native"
id: "as_native"
description: "Use this filter to coerce jinja-compiled output into its native python."
---

The `as_native` Jinja filter will coerce Jinja-compiled output into its 
Python native representation according to [`ast.literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval). 
The result can be any Python native type (set, list, tuple, dict, etc).

To render boolean and numeric values, it is recommended to use [`as_bool`](as_bool) 
and [`as_number`](as_number) instead.

:::danger Proceed with caution
Unlike `as_bool` and `as_number`, `as_native` will return a rendered value
regardless of the input type. Ensure that your inputs match expectations.
:::

<Changelog>

* `v0.17.1`: Native rendering is disabled by default. The `as_native` filter was 
introduced.

</Changelog>
