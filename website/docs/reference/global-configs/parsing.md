---
title: "Parsing"
id: "parsing"
sidebar: "Parsing"
---

import FusionPartialParseCliFlags from '/snippets/_fusion-partial-parse-cli-flags.md';

### Partial Parsing

<VersionBlock firstVersion="2.0">

:::note <Constant name="fusion" /> and partial parsing

<FusionPartialParseCliFlags />

:::

</VersionBlock>

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

### Opt-in v2 parser {#opt-in-v2-parser}

<VersionBlock firstVersion="1.12">

:::note <Constant name="core" /> flag

The v2 parser flag is only applies to <Constant name="core" /> v1.12 or higher. If you're already on v2, the flag has no impact.

:::

The `use_v2_parser` flag delegates parsing to the v2 parser. This is an opt-in flag.

The v2 parser is the Rust-based parser from the <Constant name="fusion_engine" />. It's significantly faster than the v1 Python parser, especially on larger projects, where it can be 5–10× quicker. Enabling it can speed up your development workflow and cut down on job startup times. Because it delegates to the parser used in v2.0, it's also a low-risk way to test compatibility with v2 from within <Constant name="core" /> v1.12.

You can enable the v2 parser in three ways:

- CLI flag: `--use-v2-parser`
- Environment variable: `DBT_ENGINE_USE_V2_PARSER=true`
- `dbt_project.yml` under `flags:`:

<File name="dbt_project.yml">

```yaml
flags:
  use_v2_parser: true
```

</File>

Note: Partial parsing is disabled when `--use-v2-parser` is set. Any stale `partial_parse.msgpack` from a prior run is automatically removed.

Because the flag only affects project parsing, the fastest way to check v2 parse compatibility is with `dbt parse`. You can also use `--use-v2-parser` with any other command.

<File name="Usage">

```bash
# Test v2 parser compatibility without running models (recommended)
dbt parse --use-v2-parser

# Or use it with any command
dbt run --use-v2-parser
```

</File>

:::note Plugin authors

`get_nodes` plugin hooks are not supported when `--use-v2-parser` is enabled.

:::

</VersionBlock>