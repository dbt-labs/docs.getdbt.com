---
title: "Parsing"
id: "parsing"
sidebar: "Parsing"
---

### Partial Parsing

The `PARTIAL_PARSE` flag can turn partial parsing on or off in your project. See [the docs on parsing](/reference/parsing#partial-parsing) for more details.

<File name='dbt_project.yml'>

```yaml

flags:
  partial_parse: true

```

</File>

<File name='Usage'>

```text
dbt run --no-partial-parse
```

</File>

:::note <Constant name="fusion" /> and partial parsing

In <Constant name="fusion" /> job runs, the `--partial-parse` and `--no-partial-parse` CLI flags are deprecated. Passing them may log deprecation warning `dbt1700`. Remove these flags from <Constant name="fusion" /> job commands. For more information, refer to [Deprecated flags](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags) in the guide to upgrading to the <Constant name="fusion_engine" />.

:::

### Static parser

The `STATIC_PARSER` config can enable or disable the use of the static parser. See [the docs on parsing](/reference/parsing#static-parser) for more details.

<File name='profiles.yml'>

```yaml

config:
  static_parser: true

```

</File>

### Experimental parser

Not currently in use.
