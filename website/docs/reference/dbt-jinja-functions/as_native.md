---
title: "About as_native filter"
sidebar_label: "as_native"
id: "as_native"
description: "Use this filter to coerce Jinja-compiled output into its native python."
---

The `as_native` Jinja filter will coerce Jinja-compiled output into its 
Python native representation according to [`ast.literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval). 
The result can be any Python native type (set, list, tuple, dict, etc).

To render boolean and numeric values, it is recommended to use [`as_bool`](/reference/dbt-jinja-functions/as_bool) 
and [`as_number`](/reference/dbt-jinja-functions/as_number) instead.

:::danger Proceed with caution
Unlike `as_bool` and `as_number`, `as_native` will return a rendered value
regardless of the input type. Ensure that your inputs match expectations.
:::
