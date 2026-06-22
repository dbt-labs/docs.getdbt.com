---
title: "Fusion function support"
sidebar_label: "About function support"
id: "fusion-function-support"
description: "See which built-in SQL functions dbt Fusion can typecheck on each data platform, and compare functions that differ across platforms."
tags: ['dbt Fusion', 'static_analysis']
slug: "/reference/fusion-function-support"
pagination_next: null
---

<Constant name="fusion"/> can typecheck your SQL during static analysis — catching a wrong argument type or a misspelled function before you ever run a model. Support is tracked per data platform, since every warehouse ships its own set of built-in functions.

This section answers two questions:

- **Is _this_ function supported?** Each platform has a searchable table of every built-in function and whether <Constant name="fusion"/> can typecheck it.
- **Does this function behave the same everywhere?** The comparison page lines up functions that share a name but differ in their arguments across platforms.

## Turn on typechecking

To let <Constant name="fusion"/> typecheck your functions in <Constant name="dbt_platform"/>, the CLI, or the dbt VS Code extension:

1. Run `dbt login` to authenticate.
2. Set [`static_analysis: strict`](/docs/fusion/new-concepts?version=2.0) in your project configuration.

## Function support by platform

Pick your platform to see every built-in function and its typechecking status. Each bar shows how much of that platform's catalog <Constant name="fusion"/> can typecheck today — refreshed weekly.

<FunctionSupportGrid />

## Compare functions across platforms

Some functions share a name but take their arguments in a different order, or make different arguments optional — the kind of thing that quietly breaks a query when you move it between platforms.

<div className="grid--2-col">

<Card
    title="Snowflake vs BigQuery"
    body="Side-by-side syntax for ~20 common functions, starting with the ones most likely to trip you up."
    link="/reference/fusion-function-support/sql-functions-comparison"
    icon="fa-magnifying-glass"/>

</div>
