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

<VersionBlock firstVersion="1.12" lastVersion="1.99">

The `use_v2_parser` flag delegates parsing to the Fusion parser instead of <Constant name="core" />'s own parser. This is an opt-in flag — it changes no behavior unless explicitly set.

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

Other behaviors to know about include:


- **Partial parsing**: Partial parsing is disabled when `--use-v2-parser` is set. Any stale `partial_parse.msgpack` from a prior run is automatically removed on entry.
- **`write_manifest`**: `write_manifest` does not work in this mode because the Fusion parser's artifacts (`manifest.json` and `semantic_manifest.json`) are canonical and dbt Core does not re-serialize or overwrite them.
- **Artifacts in `target/`**: When `write_json` is enabled, the handoff `manifest.json` (and `semantic_manifest.json` if present) is copied into your project's `target/` directory.

<File name="Usage">

```bash
dbt run --use-v2-parser
```

</File>

When the v2 parser fails, dbt surfaces these exceptions to make failures easier to diagnose:

| Exception | Cause |
|---|---|
| `FusionParserError` | The parser exited with a non-zero code or produced no output |
| `FusionParserSchemaError` | The output could not be parsed as valid JSON. Please check your JSON and try again. |
| `FusionParserVersionError` | The output manifest uses an incompatible schema version. Make sure you're using Core v1.12 or higher. |

:::note Plugin authors

`get_nodes` plugin hooks are not supported when `--use-v2-parser` is enabled.

:::

</VersionBlock>