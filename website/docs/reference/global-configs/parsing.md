---
title: "Parsing"
id: "parsing"
sidebar: "Parsing"
---

### Partial Parsing

The `PARTIAL_PARSE` config can turn partial parsing on or off in your project. See [the docs on parsing](/reference/parsing#partial-parsing) for more details.

<File name='profiles.yml'>

```yaml

config:
  partial_parse: true

```

</File>

<File name='Usage'>

```text
dbt --no-partial-parse run
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

With the `USE_EXPERIMENTAL_PARSER` config, you can opt into the latest and greatest experimental version of the static parser, which is still being sampled for 100% correctness. See [the docs on parsing](/reference/parsing#experimental-parser) for more details.

<File name='profiles.yml'>

```yaml

config:
  use_experimental_parser: true

```

</File>
