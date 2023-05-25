---
title: "About debug macro"
sidebar_label: "debug"
id: "debug-method"
description: "The `{{ debug() }}` macro will open an iPython debugger."
---


:::caution New in v0.14.1

The `debug` macro is new in dbt v0.14.1, and is only intended to be used in a development context with dbt. Do not deploy code to production which uses the `debug` macro.

:::

The `{{ debug() }}` macro will open an iPython debugger in the context of a compiled dbt macro. The `DBT_MACRO_DEBUGGING` environment value must be set to use the debugger.

## Usage

<File name='my_macro.sql'>

```text

{% macro my_macro() %}

  {% set something_complex = my_complicated_macro() %}
  
  {{ debug() }}

{% endmacro %}
```

</File>

When dbt hits the `debug()` line, you'll see something like:

```shell
$ DBT_MACRO_DEBUGGING=write dbt compile
Running with dbt=0.14.0
> /var/folders/31/mrzqbbtd3rn4hmgbhrtkfyxm0000gn/T/dbt-macro-compiled-cxvhhgu7.py(14)root()
     13         environment.call(context, (undefined(name='debug') if l_0_debug is missing else l_0_debug)),
---> 14         environment.call(context, (undefined(name='source') if l_0_source is missing else l_0_source), 'src', 'seedtable'),
     15     )

ipdb> l 9,12
      9     l_0_debug = resolve('debug')
     10     l_0_source = resolve('source')
     11     pass
     12     yield '%s\nselect * from %s' % (
```
