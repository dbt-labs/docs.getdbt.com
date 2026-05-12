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

<Constant name="fusion" /> job runs no longer support the `--partial-parse` and `--no-partial-parse` CLI flags. If you pass them (for example, from a <Constant name="core" />command or script), dbt logs deprecation warning `dbt1700`. Remove these flags from your <Constant name="fusion" /> job commands. For more information, refer to [Deprecated flags](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags) in the guide to upgrading to the <Constant name="fusion_engine" />.


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
