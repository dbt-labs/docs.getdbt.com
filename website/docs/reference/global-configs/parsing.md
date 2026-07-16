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

The v2 parser flag is only supported on <Constant name="core" /> v1.12 or higher. If you're already on <Constant name="fusion" />, the flag has no impact.

:::

The `use_v2_parser` flag delegates parsing to the Fusion parser instead of <Constant name="core" />'s own parser. This is an opt-in flag — it changes no behavior unless explicitly set.

The v2 parser is the Rust-based parser from the <Constant name="fusion_engine" />. It's significantly faster than <Constant name="core" />'s Python parser, especially on larger projects, where it can be 5–10× quicker. Enabling it can speed up your development workflow and cut down on job startup times. Because it delegates to the <Constant name="fusion" /> parser used in v2.0, it's also a low-risk way to test <Constant name="fusion" /> compatibility from within <Constant name="core" /> v1.12.

When enabled, dbt hands parsing off to the Fusion parser, loads the `manifest.json` it produces, and skips <Constant name="core" />'s own parser entirely. 

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


- **Partial parsing**: Partial parsing is disabled when `--use-v2-parser` is set. Any stale `partial_parse.msgpack` from a prior run is automatically removed.
- **`write_manifest`**: `write_manifest` does not work in this mode because the <Constant name="fusion" /> parser's artifacts (`manifest.json` and `semantic_manifest.json`) are canonical and <Constant name="core" /> does not re-serialize or overwrite them.
- **Artifacts in `target/`**: When `write_json` is enabled, the handoff `manifest.json` (and `semantic_manifest.json` if present) is copied into your project's `target/` directory.

Because the flag only changes _how_ your project is parsed, the lightest way to check <Constant name="fusion" /> parser compatibility is `dbt parse`. You can also pass `--use-v2-parser` with any other command.

<File name="Usage">

```bash
# Test Fusion parser compatibility without running models (recommended)
dbt parse --use-v2-parser

# Or use it with any command
dbt run --use-v2-parser
```

</File>

When the v2 parser fails, dbt surfaces these exceptions to make failures easier to diagnose:

| Exception | Cause |
|---|---|
| `FusionParserError` | The parser exited with a non-zero code, produced no manifest output, or couldn't be found. |
| `FusionParserSchemaError` | dbt couldn't load the `manifest.json` the parser produced (for example, it was malformed or unreadable). |
| `FusionParserVersionError` | The parser's manifest uses an incompatible schema version. Make sure you're on <Constant name="core" /> v1.12 or higher. |

:::note Plugin authors

`get_nodes` plugin hooks are not supported when `--use-v2-parser` is enabled.

:::

</VersionBlock>