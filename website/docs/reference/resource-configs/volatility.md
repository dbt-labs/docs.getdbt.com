---
title: volatility
sidebar_label: "volatility"
id: volatility
---
<VersionCallout version="1.11" /> 

<File name='functions/<filename>.yml'>

```yml
functions:
  - name: <function name>
    config:
      volatility: deterministic | stable | non-deterministic
```

</File>

## Definition

import VolatilityDefinition from '/snippets/_volatility-definition.md';

<VolatilityDefinition />

By default, dbt does not specify a volatility value. If you don’t set volatility, dbt generates a `CREATE` statement without a volatility keyword, and the warehouse’s default behavior applies &mdash; except in Redshift. 

In Redshift, dbt sets `non-deterministic` (`VOLATILE`) by default if no volatility is specified, because Redshift requires an explicit volatility and `VOLATILE` is the safest assumption.

import Volatility from '/snippets/_warehouse-volatility.md';

<Volatility />

## Supported volatility types

In dbt, you can use the following values for the `volatility` config:

| Value | Description | Example |
| --- | --- | --- |
| `deterministic` | Always returns the same output for the same input. Safe for aggressive optimizations and caching. | `substr()` &mdash; Produces the same substring when given the same string and parameters. |
| `stable` | Returns the same value within a single query execution, but may change across executions. Not supported by all warehouses. For more information, see [Warehouse-specific volatility keywords](/reference/resource-configs/volatility#warehouse-specific-volatility-keywords).| `now()` &mdash; Returns the current timestamp the moment a query starts; constant within a single query but different across runs. |
| `non-deterministic` | May return different results for the same inputs. Warehouses shouldn't cache or reorder assuming stable results. | `first()` &mdash; May return different rows depending on query plan or ordering. <br></br>`random()` &mdash; Produces a random number that varies with each call, even with identical inputs. |

## Example

In this example, we're using the `deterministic` volatility for the `is_positive_int` function:

<File name='functions/schema.yml'>

```yaml
functions:
  - name: is_positive_int
    description: Check whether a string is a positive integer
    config:
      volatility: deterministic # Optional: stable | non-deterministic | deterministic
    arguments:
      - name: a_string
        data_type: string
    returns:
      data_type: boolean
```
</File>

## Related documentation

- [User-defined functions](/docs/build/udfs)
- [Function properties](/reference/function-properties)
- [Function configurations](/reference/function-configs)
- [Type](/reference/resource-configs/type)
- [Arguments](/reference/resource-properties/function-arguments)
- [Returns](/reference/resource-properties/returns)
