---
title: "About debug macro"
sidebar_label: "debug"
id: "debug-method"
description: "The `{{ debug() }}` macro will open an iPython debugger."
---


:::warning Requires Core CLI

The `debug()` macro is only available when using <Constant name="core" /> CLI in a local development environment. It's _not available_ in <Constant name="dbt_platform" />. 

Do not deploy code to production that uses the `debug` macro.

If developing in <Constant name="dbt_platform"/> or using <Constant name="fusion"/>, you can instead use:
- [`{{ print() }}`](/reference/dbt-jinja-functions/print) - Print messages to both the log file and standard output (`stdout`).
- [`{{ log() }}`](/reference/dbt-jinja-functions/log) - Structured logging that prints messages during Jinja rendering.


:::

The `{{ debug() }}` macro will open an iPython debugger in the context of a compiled dbt macro. The <VersionBlock lastVersion="1.10">`DBT_MACRO_DEBUGGING`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_MACRO_DEBUGGING`</VersionBlock> environment variable must be set to use the debugger.

This function requires:
- Interactive terminal access with iPython debugger (`ipdb`) installed. <Constant name="fusion"/> doesn't provide a iPython (ipdb) debugger since its built on Rust. It instead outputs a non-interactive snapshot of the MiniJinja render context in the compiled code.
- Local development environment running <Constant name="core" /> CLI
- <VersionBlock lastVersion="1.10">`DBT_MACRO_DEBUGGING`</VersionBlock><VersionBlock firstVersion="1.11">`DBT_ENGINE_MACRO_DEBUGGING`</VersionBlock> environment variable set

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

<VersionBlock lastVersion="1.10">

```shell
$ DBT_MACRO_DEBUGGING=write dbt compile
Running with dbt=1.0
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

</VersionBlock>

<VersionBlock firstVersion="1.11">

```shell
$ DBT_ENGINE_MACRO_DEBUGGING=write dbt compile
Running with dbt=1.0
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

</VersionBlock>
