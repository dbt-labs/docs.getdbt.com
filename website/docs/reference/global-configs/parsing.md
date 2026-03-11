---
title: "Parsing"
id: "parsing"
sidebar: "Parsing"
---

<VersionBlock firstVersion="2.0">

:::info Not supported in the <Constant name="fusion_engine" />
The `--partial-parse`, `--static-parser`, and `--use-experimental-parser` CLI flags are not supported in the <Constant name="fusion_engine" />. They will be silently ignored if passed. [Learn more about deprecated flags](/docs/dbt-versions/core-upgrade/upgrading-to-fusion#deprecated-flags).
:::

</VersionBlock>

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
