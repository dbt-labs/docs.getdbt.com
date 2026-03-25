---
name: testing-features
description: Use when the user asks to test, validate, or check whether a dbt feature works. Sets up a minimal dbt project, runs commands across engines, validates results in the warehouse, and produces a testing summary report.
---

# Testing dbt Features

## Overview

When the docs team asks to test or validate a dbt feature, this skill runs the test. It searches the local docs codebase to understand the feature, scaffolds a minimal dbt project, runs dbt commands across engines, validates results in the warehouse, and writes a clear testing summary the writer can read.

## Trigger conditions

- User asks to "test", "validate", or "check" a dbt feature
- User provides a path to a draft doc and wants to verify the code examples work
- User wants a "testing summary" before publishing a doc

---

## Step 1: Parse request and gather inputs

Extract from the user's request:
- **Feature or topic** — what are we testing? (e.g. "python udfs", "incremental models", "snapshots")
- **Doc path** — did they mention a specific file? (e.g. `website/docs/docs/build/snapshots.md`)
- **Engines** — did they mention specific engines? (dbt Core, dbt Fusion, dbt platform)
- **Adapter** — did they mention a warehouse? (Snowflake, BigQuery, Postgres, etc.)

**Check for saved defaults first.** If the request came via `dbt-docs-fox`, defaults may have been passed in a "User defaults" block above the request. Use those values directly without re-asking. If a value is missing or the user ran this directly in an AI chat, ask for it.

**Check the prompt for overrides.** If the user mentions a specific database, schema, adapter, or profile in their request, use that value instead of the saved default — no need to ask. After the run, if any values differed from what was saved, write the new values to `~/.dbt-docs-fox/config`:

```bash
mkdir -p ~/.dbt-docs-fox
cat > ~/.dbt-docs-fox/config <<EOF
# dbt-docs-fox local config — not tracked by git
DBT_FOX_ADAPTER="<adapter>"
DBT_FOX_DATABASE="<database>"
DBT_FOX_SCHEMA="<schema>"
DBT_FOX_PROFILE="<profile>"
EOF
```

Then tell the user: "I've updated your saved defaults to use `<DATABASE>.<SCHEMA>`."

The config is saved locally at `~/.dbt-docs-fox/config` (never in the repo). To reset it manually, the user can run `dbt-docs-fox --config-reset`.

Ask the user only for values not already provided by defaults or the prompt:
- **Adapter** — which warehouse are you testing against?
- **Test schema** — what schema should test artifacts be written to? (e.g. `MY_FEATURE_TEST`)
- **Database** — which database?
- **Profile** — check `~/.dbt/profiles.yml`. If found, ask which profile/target. If not, prompt for connection details.
- **Engines** — which engines to test: dbt Core (`dbt`), dbt Fusion (`dbtf`), dbt platform CLI, or all available? Check with `which dbt` and `which dbtf`.

Show a confirmation summary and progress checklist before proceeding:

```
## dbt docs fox — Test plan: <feature name>
Adapter:    <adapter>
Engine(s):  dbt Fusion / dbt Core / dbt platform CLI
Schema:     DATABASE.SCHEMA
Profile:    <profile name>

Progress:
[ ] Step 2  Research feature in local docs
[ ] Step 3  Scaffold dbt project
[ ] Step 4  Verify connection
[ ] Step 5  Compile (pre-flight)
[ ] Step 6  Run commands
[ ] Step 7  Validate in warehouse
[ ] Step 8a Write `/tmp/.../testing-summary.md` (no repo copy)
[ ] Step 8b Post row to Notion (docs PR testing database)
```

Mark each `[x]` as it completes. Mark `[!]` with a one-line reason if a step fails.

---

## Step 2: Research the feature

**Primary source — search the local docs codebase first:**

Search `website/docs/` and `website/snippets/` for content related to the feature. This is the authoritative source — use what's here before looking anywhere else.

- If the user gave a doc path, read that file directly
- Search by feature name (e.g. `grep -r "python udf" website/docs/` or glob for relevant files)
- Read the full page(s) and any snippets referenced in them
- Look for: syntax, config options, code examples, version caveats, adapter-specific behavior

**Fallback — fetch from the live site:**

If the local codebase doesn't have sufficient detail, fetch from `https://docs.getdbt.com`. Common paths:

| Topic | Path |
|-------|------|
| Model configs | `/reference/model-configs` |
| Python models | `/docs/build/python-models` |
| Snapshots | `/docs/build/snapshots` |
| Sources | `/docs/build/sources` |
| Generic tests | `/docs/build/data-tests` |
| Macros | `/docs/build/jinja-macros` |
| dbt_project.yml | `/reference/dbt_project.yml` |
| Node selection | `/reference/node-selection/syntax` |

**Extract from the research:**
- All code examples (SQL, Python, YAML, shell commands), grouped by type
- Testable claims: "this command produces X", "this config enables Y"
- dbt resources involved: models, macros, UDFs, sources, snapshots, tests, seeds
- Expected outputs: what should appear in the warehouse after running
- Version or adapter caveats

Show the extraction to the user before building the project.

---

## Step 3: Scaffold the dbt project

Create the test project at `/tmp/dbt-feature-test-<feature-name>/` (slugified, e.g. `dbt-feature-test-python-udfs`).

**`dbt_project.yml`** (minimal):
```yaml
name: feature_test
version: '1.0.0'
profile: feature_test
model-paths: ["models"]
macro-paths: ["macros"]
test-paths: ["tests"]
seed-paths: ["seeds"]
models:
  feature_test:
    +materialized: table
```

**`profiles.yml`** — use the adapter and credentials from Step 1. Generate the correct profile block for the adapter:

```yaml
feature_test:
  target: dev
  outputs:
    dev:
      type: <adapter>          # snowflake, bigquery, postgres, etc.
      # ... adapter-specific fields from user's input
      schema: <schema>
      database: <database>
```

**`models/`**, **`macros/`**, **`tests/`**, **`seeds/`** — create files from the code examples extracted in Step 2. Adapt examples minimally to be runnable (fill in placeholder names with real references if needed).

**`packages.yml`** — only if the feature requires packages (e.g. dbt-utils). Run `dbt deps` if created.

**Local Python environment (`.venv`) — create for every scaffold**

After writing project files, create a virtual environment in the project root so writers can reproduce commands without touching their global install:

```bash
cd /tmp/dbt-feature-test-<feature-name>/
python3 -m venv .venv
# Windows (cmd): .venv\Scripts\activate.bat
# Windows (PowerShell): .venv\Scripts\Activate.ps1
source .venv/bin/activate   # macOS / Linux
pip install "dbt-<adapter>"  # e.g. dbt-snowflake, dbt-bigquery, dbt-duckdb — match Step 1
```

If `pip install` fails (network, air-gapped), note that in the summary and still write `dbt-fox-env.sh` so the user can fix the venv later.

**`dbt-fox-env.sh`** — always write this file in the project root (executable: `chmod +x dbt-fox-env.sh`). Writers use **`source`** so their shell changes directory and activates the venv:

```bash
#!/usr/bin/env bash
# dbt docs fox — cd into this test project and activate .venv
# Usage: source /absolute/path/to/dbt-feature-test-<slug>/dbt-fox-env.sh
if [[ -n "${BASH_SOURCE[0]:-}" ]]; then
  _FOX_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
  _FOX_DIR="$(cd "$(dirname "$0")" && pwd)"
fi
cd "$_FOX_DIR" || exit 1
unset _FOX_DIR
if [[ -f .venv/bin/activate ]]; then
  # shellcheck disable=SC1091
  source .venv/bin/activate
  echo "dbt docs fox: venv active in $(pwd)"
else
  echo "dbt docs fox: no .venv here — run: python3 -m venv .venv && pip install dbt-<adapter>" >&2
fi
```

When running dbt yourself during the test, prefer invoking dbt from this `.venv` (`./.venv/bin/dbt`) so the writer sees the same versions.

Show the user every file created with its full contents before proceeding.

---

## Step 4: Verify connection

Run a lightweight query to test connectivity before a full debug:

```bash
dbtf show --inline "SELECT 1 AS ok" --project-dir . --profiles-dir . 2>&1
```

- If it returns a result row: connection confirmed — proceed
- If it fails: run `dbt debug --project-dir . --profiles-dir .` to diagnose

If connection fails: show the exact error, ask the user for corrected credentials, update `profiles.yml`, and retry. Do not proceed until connectivity is confirmed.

If packages are needed: run `dbt deps` before proceeding.

---

## Step 5: Compile (pre-flight check)

Before running against the warehouse, compile the project for each engine. This catches syntax errors without using compute.

Run for each requested engine in parallel:

```bash
# dbt Core
dbt compile --project-dir . --profiles-dir . 2>&1 | tee output/core-compile.txt

# dbt Fusion
dbtf compile --project-dir . --profiles-dir . 2>&1 | tee output/fusion-compile.txt
```

- If all engines compile: proceed to Step 6
- If an engine fails: fix the error before running it — never attempt `dbt run` on a project that doesn't compile

**Note on Python models:** Only include Python model files if the feature explicitly involves Python models. Skip for SQL/YAML-only features.

---

## Step 6: Run commands

Run the feature commands for all requested engines simultaneously. Do not wait for one engine before starting the next.

Common patterns:

```bash
# Run models
dbt run --select <model> --project-dir . --profiles-dir .
dbtf run --select <model> --project-dir . --profiles-dir .

# Build (models + tests)
dbt build --select <model> --project-dir . --profiles-dir .
dbtf build --select <model> --project-dir . --profiles-dir .

# Run macro
dbt run-operation <macro> --project-dir . --profiles-dir .
dbtf run-operation <macro> --project-dir . --profiles-dir .
```

Capture full stdout/stderr for each engine to `output/<engine>-<command>.txt`.

Record: command run, exit code, key output lines, warnings, errors.

After all engines finish, note any behavioral differences: output format, error messages, unsupported features, performance.

---

## Step 7: Validate in warehouse

Query the warehouse directly to confirm expected objects exist and contain correct data. Use `dbt run-operation` with an inline macro or a direct query tool if available.

Common validation queries (adapt to what the feature creates):

```sql
-- Does the table/view exist?
SHOW TABLES LIKE '<model_name>' IN SCHEMA <database>.<schema>;

-- Sample rows
SELECT * FROM <database>.<schema>.<model_name> LIMIT 5;

-- Row count
SELECT COUNT(*) FROM <database>.<schema>.<model_name>;

-- Does a UDF exist? (adapter-specific)
SHOW USER FUNCTIONS LIKE '<udf_name>' IN SCHEMA <database>.<schema>;
```

Record: each query run, and whether the result matched expectations from Step 2.

---

## Step 8: Write the testing summary and post to Notion

### Step 8a — Markdown file (temporary only)

Write the completed report to:

**`/tmp/dbt-feature-test-<feature-name>/testing-summary.md`**

That path is the only markdown artifact (`/tmp` may be cleared on reboot). **Do not** write `testing-summary-*.md` into the docs repo or next to draft docs — the **Notion** row (Step 8b) is the durable record for the team. Tell the user the absolute path to the temp file and that details also live in Notion.

**Navigation and environment — required in every summary**

Fill in the **Open this test project locally** section of the report template (below) with real paths:

- **Absolute path** to `/tmp/dbt-feature-test-<slug>/` (always use the full path, not `~`).
- **`file://` hyperlink** to the project directory for macOS/Linux: `file:///tmp/dbt-feature-test-<slug>/` (three slashes after `file:`). In Cursor or VS Code, the writer can also use **File → Open Folder** and paste the same absolute path. Clickable `file://` links work in many local Markdown previews; they do **not** activate a venv (that is not technically possible via a link).
- **Docs repo path:** when the session is in the docs repository, run `git rev-parse --show-toplevel` once and substitute that absolute path in **Return to the docs repository** so the writer can `cd` back in one paste.
- **One-liner for venv:** always include `source <absolute-path>/dbt-fox-env.sh` pointing at the helper script created in Step 3.

Clarify in the summary: opening a folder or a `file://` link does not run `source`; the writer must run the `source .../dbt-fox-env.sh` line in a terminal (or `cd` + `source .venv/bin/activate` manually).

**Tone:** Write as if a teammate ran all of this and is reporting back. Not a formal test log — a clear, friendly explanation of what happened. The writer should feel like they tested it themselves.

### Step 8b — Notion database row (required when Notion MCP works)

Every testing summary must also become **one row** in the **docs PR testing** database. **Always** run Step 8b after Step 8a unless the Notion MCP is unavailable — do not end the run without a Notion row when MCP is available (the temp markdown alone is not enough for the team). Use the **Notion MCP** (authenticate with `mcp_auth` if needed).

**Where to post**

- **Hub page (human-readable):** [docs PR testing](https://www.notion.so/dbtlabs/docs-pr-testing-32dbb38ebda780ccbbe1f25d6e9c4b4d)
- **Embedded database URL (use with MCP `fetch`):** `https://www.notion.so/32dbb38ebda78082ad46c4c975c2a566`
- **Database ID:** `32dbb38ebda78082ad46c4c975c2a566`

**MCP workflow**

1. Call **`notion-fetch`** with the **database URL** above (or the hub page URL — the response lists `<database>` and `<data-source url="collection://...">` tags).
2. Read the data source **schema** from the fetch result. Property names must match exactly (including `date:Date:start` / `date:Date:is_datetime` for the Date column).
3. Call **`notion-create-pages`** with:
   - `parent`: `{ "type": "data_source_id", "data_source_id": "<uuid from collection://...>" }`
   - `pages`: one object with `properties` for each column.

**Values to collect before posting**

- **Title:** `<Feature name> — <date>` (maps to the title column **Title**)
- **Branch:** `git branch --show-current`
- **Author:** `git config user.name`
- **Date:** set `date:Date:start` to today (ISO date, e.g. `2026-03-24`) and `date:Date:is_datetime` to `0` unless you need time precision
- **Summary:** the **Summary** paragraph from the bottom of the report
- **Status:** `Complete`

If the schema differs (for example after columns are renamed in Notion), follow the **fetch** output, not this list.

**After posting:** Paste the **new page URL** returned by `notion-create-pages` into the chat so the writer can open the row.

**If Notion MCP is unavailable** (no server, auth error, or user declined): skip Step 8b, say so explicitly, and remind the user to connect Notion MCP in Cursor or Claude Code settings and add the row manually to [docs PR testing](https://www.notion.so/dbtlabs/docs-pr-testing-32dbb38ebda780ccbbe1f25d6e9c4b4d).

**Spot-check:** Optionally open the database and confirm the new row appears next to prior entries.

---

## Report template

Fill in every section. Do not leave placeholders.

```markdown
# Testing summary: <Feature name>

**Date:** <date>
**What I tested:** <one-sentence description of the request>
**Doc used:** <file path or "searched codebase for <feature>">
**Engines:** <list>
**Adapter:** <adapter>
**Schema:** <DATABASE.SCHEMA>

---

## What I tested and why

<2-3 sentences: what the feature does, why the doc team needs to test it,
what the test set out to prove. Written for a writer, not an engineer.>

## What I set up

<Show every file created, with full contents in code blocks. Explain any
adaptations made from the doc examples — e.g. "I filled in the placeholder
table name with a real reference.">

## Commands I ran

<List each command as a copy-pasteable code block, with the engine and what it was testing.>

## What happened

### dbt Core
- **Status:** ✅ Pass / ⚠️ Warning / ❌ Fail
- **Key output:**
  ```
  <paste the most relevant output lines>
  ```
- **Full output:** `output/core-run.txt`

### dbt Fusion (if tested)
- **Status:** ✅ / ⚠️ / ❌
- **Key output:**
  ```
  <paste>
  ```
- **Difference from Core:** <if any>

### dbt platform (if tested)
- **Status:** ✅ / ⚠️ / ❌
- **Notes:** <any>

## What I checked in the warehouse

<Show the exact SQL queries run and their results. Be specific: "I ran
SELECT COUNT(*) and got 3 rows, which matches what the doc says.">

## Bugs and issues found

| What happened | Type | Diagnosis | Outcome |
|---------------|------|-----------|---------|
| <error> | Bug / Limitation / Config / Environment | <what caused it> | ✅ Fixed / ❌ Unresolved / 🐛 Confirmed bug |

## What this means for your doc

<Plain language. What works exactly as documented? What doesn't? What caveats
should the writer add? Any bugs to flag or work around? Open questions?>

Example format:
- ✅ The basic syntax works on both Core and Fusion
- ⚠️ The `merge` strategy requires `unique_key` — the doc example is missing this
- 🐛 Python UDFs fail on dbt Core with error: "..." — Fusion-only for now
- 💡 Add a note that this requires dbt 1.5+

## Open this test project locally

**Project directory:** `/tmp/dbt-feature-test-<slug>/`  
**Open in Finder / file browser (macOS):** [folder](file:///tmp/dbt-feature-test-<slug>/) — paste the same path into **File → Open Folder** in Cursor or VS Code if the link does not open.

**Enter the project and activate `.venv` (recommended — one command):**

```bash
source /tmp/dbt-feature-test-<slug>/dbt-fox-env.sh
```

**Or step by step:**

```bash
cd /tmp/dbt-feature-test-<slug>/
source .venv/bin/activate
```

**Return to the docs repository** (path from `git rev-parse --show-toplevel` when this run was started from the repo clone):

```bash
cd <ABSOLUTE_PATH_TO_DOCS_REPO>
```

**Note:** Clicking a `file://` link or opening the folder only opens files; it does not activate Python. Use `source .../dbt-fox-env.sh` or `source .venv/bin/activate` in the terminal where you run `dbt`.

---

## How to run this yourself

If you want to reproduce this test:

1. <step-by-step, written for a technical writer, not an engineer>
2. ...

## Summary

<One paragraph. What works, what doesn't, what to include in the doc,
what to flag or avoid. Written like a Slack message to a teammate.>
```

---

## Reference: Engine command comparison

| Operation | dbt Core | dbt Fusion | dbt platform |
|-----------|----------|------------|--------------|
| Run models | `dbt run` | `dbtf run` | `dbt run` |
| Run tests | `dbt test` | `dbtf test` | `dbt test` |
| Compile | `dbt compile` | `dbtf compile` | `dbt compile` |
| Debug | `dbt debug` | `dbtf debug` | `dbt debug` |
| Run macro | `dbt run-operation` | `dbtf run-operation` | `dbt run-operation` |
| Install packages | `dbt deps` | `dbtf deps` | `dbt deps` |
| List resources | `dbt ls` | `dbtf ls` | `dbt ls` |

Always pass `--project-dir` and `--profiles-dir` explicitly.

---

## Reference: SQL model patterns

```sql
-- Incremental model
{{
  config(
    materialized='incremental',
    unique_key='id'
  )
}}

SELECT id, updated_at, value
FROM {{ ref('source_model') }}
{% if is_incremental() %}
  WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
```

```sql
-- Model with tags and meta
{{
  config(
    materialized='table',
    tags=['test', 'feature'],
    meta={'owner': 'writer'}
  )
}}

SELECT 1 AS id
```

```sql
-- Snapshot
{% snapshot orders_snapshot %}
{{
  config(
    target_schema=target.schema,
    unique_key='id',
    strategy='timestamp',
    updated_at='updated_at'
  )
}}

SELECT id, status, updated_at FROM {{ ref('orders') }}

{% endsnapshot %}
```

---

## Reference: Python model patterns

```python
# Standard Python model
def model(dbt, session):
    dbt.config(materialized="table")
    source_df = dbt.ref("source_model")
    return source_df.filter(source_df["active"] == True)
```

```python
# Python model with packages
import pandas as pd
import numpy as np

def model(dbt, session):
    dbt.config(
        materialized="table",
        packages=["pandas", "numpy"]
    )
    df = dbt.ref("source_model").to_pandas()
    df["new_col"] = np.log(df["value"])
    return df
```

For Python features, check:
- Which runtime versions are supported by the adapter
- Whether the feature works on dbt Core vs Fusion (Python model support differs)
- Package availability in the adapter's package channel
