---
title: "Interactive shell"
sidebar_label: "Interactive shell"
description: "Run dbt commands and query your DuckDB database in an integrated CLI that launches the DuckDB UI."
---

<VersionBlock firstVersion="1.9" lastVersion="1.99">

In `dbt-duckdb` 1.9.3 and later, the interactive shell lets you run dbt commands and query the DuckDB database in an integrated CLI environment. The shell automatically launches the [DuckDB UI](https://duckdb.org/2025/03/12/duckdb-ui.html), which gives you a visual interface to explore your data while you work with your dbt models.

To start the interactive shell:

```bash
python -m dbt.adapters.duckdb.cli
```

You can specify a profile with the `--profile` flag:

```bash
python -m dbt.adapters.duckdb.cli --profile my_profile
```

The shell provides access to all standard dbt commands (`run`, `test`, `build`, `seed`, `snapshot`, `compile`, `parse`, `debug`, `deps`, `list`) and supports model name autocompletion if you install the optional `iterfzf` package.

</VersionBlock>
