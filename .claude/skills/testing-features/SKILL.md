---
name: testing-features
description: Use when testing a dbt feature against Snowflake using a draft doc as the test plan. Sets up a minimal dbt project, runs commands across engines, validates results, and produces a structured testing report.
---

# Testing dbt Features Against Snowflake

## Overview

Automates the workflow a technical writer uses to validate that a dbt feature works as documented before publishing. Given a draft doc as the test plan, the agent scaffolds a minimal dbt project, executes dbt commands across one or more engines, queries Snowflake to verify results, and produces a structured testing summary report.

## Looking Up dbt Documentation

Before and during testing, consult the official dbt documentation to understand expected behavior, syntax, and configuration options. Three methods are available:

**Option 1 — The docs.getdbt.com codebase in this repository**

Search the docs.getdbt.com codebase in this repository for the feature you're testing. Anything under `website/docs/` or `website/snippets/` is relevant.

**Option 3 — Fetch from docs.getdbt.com**

Use the `WebFetch` tool to retrieve pages from the live docs site:

```
https://docs.getdbt.com/docs/<path>
https://docs.getdbt.com/reference/<path>
https://docs.getdbt.com/guides/<path>
```

Common pages to check:

| Topic | URL path |
|-------|----------|
| Model configs | `/reference/model-configs` |
| Python models | `/docs/build/python-models` |
| Snapshots | `/docs/build/snapshots` |
| Sources | `/docs/build/sources` |
| Generic tests | `/docs/build/data-tests` |
| Macros | `/docs/build/jinja-macros` |
| dbt_project.yml reference | `/reference/dbt_project.yml` |
| Node selection | `/reference/node-selection/syntax` |

Use the docs to fill gaps in the draft doc, confirm that your test setup matches the documented interface, and check for version or adapter caveats that the draft doc may not yet mention.

## When to Use

- User provides a path to a draft doc or test plan for a dbt feature
- User asks to "test" or "validate" a dbt feature
- User asks for a "testing summary" or "feature test report"
- User wants to confirm code examples in a doc actually work before publishing

## Prerequisites

Before starting, collect all four inputs from the user:

1. **Draft doc path** — absolute or repo-relative path to the markdown file describing the feature (this is the test plan)
2. **Engines to test** — which of the following to run against (check which CLIs are installed first with `which dbt` and `which dbtf`):
   - dbt Core (`dbt`)
   - dbt Fusion (`dbtf`)
   - dbt platform CLI (`dbt`, but platform-connected)
3. **Test schema** — the `DATABASE.SCHEMA` to use for test artifacts in Snowflake (e.g. `MIRNA_DEV.FEATURE_TEST`)
4. **Snowflake connection** — check for `~/.dbt/profiles.yml` first. If found, ask which profile/target to use. If not found, prompt for: account, user, role, warehouse, database, schema, and auth method (password or SSO).

Do not proceed past Step 1 until all four inputs are confirmed.

## Workflow

### Step 1: Gather Inputs

Prompt the user for all four prerequisites above. Then display a confirmation summary and a progress checklist before proceeding:

```
## Test plan: <feature name>
- Engine(s): dbt Fusion / dbt Core / dbt platform CLI
- Schema:    DATABASE.SCHEMA
- Profile:   <profile name>

Progress:
[ ] Step 2  Read and analyze draft doc
[ ] Step 3  Scaffold dbt project
[ ] Step 4  Verify connection
[ ] Step 5  Compile all engines (pre-flight, parallel)
[ ] Step 6  Run commands — all engines in parallel
[ ] Step 7  platform CLI (if applicable)
[ ] Step 8  Validate in Snowflake
[ ] Step 9  Capture evidence
[ ] Step 10 Generate report
```

Mark each item `[x]` as it completes. If a step fails, mark it `[!]` with a one-line reason.

### Step 2: Read and Analyze the Draft Doc

Read the draft doc file and extract:

- **Feature name** — from the H1 or frontmatter title
- **Code examples** — all fenced code blocks, grouped by language:
  - SQL: models, macros, UDFs, ad-hoc queries
  - Python: Python models, UDFs, Snowpark code
  - YAML: config blocks, schema.yml, sources.yml
  - Shell: dbt commands to run
- **Testable claims** — statements like "this command produces X", "this config enables Y", "running Z results in..."
- **dbt resources involved** — models (SQL or Python), macros, UDFs, sources, snapshots, tests, seeds
- **Expected outputs** — any results or SQL the doc says should appear in the warehouse
- **Language note** — flag if the feature requires Python support; check engine compatibility before proceeding

If the draft doc is incomplete or ambiguous about syntax or config options, consult the dbt docs (see **Looking Up dbt Documentation** above) before proceeding.

List the extracted items so the user can review before you build the project.

### Step 3: Scaffold the dbt Project

Create the test project at `/tmp/dbt-feature-test-<feature-name>/` (use a slugified version of the feature name, e.g. `dbt-feature-test-python-udfs`).

Create the following files from the code examples extracted in Step 2:

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

**`profiles.yml`** (Snowflake — use credentials from Step 1, or reference existing profile):
```yaml
feature_test:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: <account>
      user: <user>
      role: <role>
      warehouse: <warehouse>
      database: <database>
      schema: <schema>
      authenticator: externalbrowser  # or password
```

**`packages.yml`** — only if the feature requires packages (e.g. dbt-utils). Run `dbt deps` if created.

**`models/`**, **`macros/`**, **`tests/`**, **`seeds/`** — create files from the draft doc's code examples. Adapt examples minimally to be runnable (e.g. fill in placeholder table names with real Snowflake references if needed).

**SQL model template** (`models/<name>.sql`):

```sql
-- depends_on: <ref or source if needed>
{{
  config(
    materialized='table'
  )
}}

SELECT
  1 AS id,
  'test' AS label
```

**Python model template** (`models/<name>.py`) — use when the feature involves Python models or UDFs:

```python
import pandas as pd

def model(dbt, session):
    dbt.config(materialized="table")

    # Replace with logic from the draft doc
    data = {"id": [1, 2, 3], "label": ["a", "b", "c"]}
    return pd.DataFrame(data)
```

For Python UDFs tested via `dbt run-operation`, use a macro wrapper:

```sql
{% macro create_python_udf() %}
  CREATE OR REPLACE FUNCTION {{ target.schema }}.my_udf(x NUMBER)
  RETURNS NUMBER
  LANGUAGE PYTHON
  RUNTIME_VERSION = '3.11'
  HANDLER = 'compute'
  AS $$
def compute(x):
    return x * 2
  $$;
{% endmacro %}
```

Show the user every file created with its full contents before proceeding.

### Step 4: Verify Connection

**Check for a cached auth token first** — Fusion caches `externalbrowser` tokens between sessions. Run a lightweight query to test connectivity before running the full `dbt debug`:

```bash
dbtf show --inline "SELECT 1 AS ok" --project-dir . --profiles-dir . 2>&1
```

- If it returns a result row: connection is live — skip `dbtf debug` and save ~2s
- If it fails with an auth error: run `dbtf debug --project-dir . --profiles-dir .` to trigger the SSO browser flow

If connection fails after debug: report the exact error, ask the user for corrected credentials, update `profiles.yml`, and retry. Do not proceed until connectivity is confirmed.

If packages are needed: run `dbt deps` before proceeding.

### Step 5: Compile First (pre-flight check)

Before running against Snowflake, compile the project for each engine that will be tested. This catches Jinja/YAML/SQL syntax errors without using warehouse credits.

Run for each requested engine **in parallel** (launch all compile commands in a single message):

```bash
# dbt Core
dbt compile --project-dir . --profiles-dir . 2>&1 | tee output/core-compile.txt

# dbt Fusion
dbtf compile --project-dir . --profiles-dir . 2>&1 | tee output/fusion-compile.txt

# dbt platform CLI
dbt compile --project-dir . --profiles-dir . 2>&1 | tee output/cloud-compile.txt
```

- If compile passes for all engines: proceed to Step 6
- If compile fails for an engine: fix the error before running that engine — do not attempt `dbt run` on a project that does not compile

**Python models:** Only include Python model files if the feature under test explicitly involves Python models. Skip them by default for SQL and YAML-only features — they add Snowpark execution time without adding signal.

### Step 6: Run Commands — All Engines in Parallel

Run the feature commands for all requested engines **simultaneously** (launch all `run`/`build`/`test` commands in a single message). Do not wait for one engine to finish before starting the next.

For each engine, run the commands described in the draft doc. Common patterns:

```bash
# Run models
dbt run --select <model> --project-dir . --profiles-dir .
dbtf run --select <model> --project-dir . --profiles-dir .

# Build (models + tests)
dbt build --select <model> --project-dir . --profiles-dir .
dbtf build --select <model> --project-dir . --profiles-dir .

# Build UDFs / functions
dbtf build --select "resource_type:function" --project-dir . --profiles-dir .

# Run macro
dbt run-operation <macro> --project-dir . --profiles-dir .
dbtf run-operation <macro> --project-dir . --profiles-dir .
```

Capture full stdout/stderr for each to `output/<engine>-<command>.txt`. Record: command, exit code, key output lines, warnings, and errors.

After all engines finish, note any behavioral differences between them: output format, error messages, unsupported features, performance.

### Step 7: Run Commands — dbt platform CLI (if requested)

If the platform CLI was requested and is distinct from the above, repeat with the platform CLI variant and note any differences.

### Step 8: Validate in Snowflake (parallel with Step 6 if possible)

After running dbt commands, query Snowflake directly to confirm the expected objects exist and contain correct data. Use `dbt run-operation` with an inline macro, or a direct query if snowsql/snowflake-cli is available.

Common validation patterns (adapt to what the feature creates):

```sql
-- Check table/view exists
SHOW TABLES LIKE '<model_name>' IN SCHEMA <database>.<schema>;

-- Check UDF exists
SHOW USER FUNCTIONS LIKE '<udf_name>' IN SCHEMA <database>.<schema>;

-- Describe UDF signature
DESCRIBE FUNCTION <udf_name>(<arg_types>);

-- Inspect rows
SELECT * FROM <database>.<schema>.<model_name> LIMIT 5;

-- Row count
SELECT COUNT(*) FROM <database>.<schema>.<model_name>;
```

Record: each query run, and whether the result matched expectations.

### Step 9: Capture Evidence

Output files are already being written to `/tmp/dbt-feature-test-<feature>/output/` via `tee` in the commands above. In the report, format key output lines as code blocks. Note in screenshot fields: "Raw output saved to `output/<filename>.txt` — take manual screenshot if needed."

### Step 10: Generate the Testing Summary Report

Fill in the Output Report Template below with all data collected. Write the completed report to:
- **Default location:** same directory as the draft doc, named `testing-summary-<feature-name>.md`
- **Or ask the user** if they prefer a different location

Present the completed report to the user and ask if any sections need revision.

---

## Reference: Engine Command Comparison

| Operation | dbt Core | dbt Fusion | dbt platform CLI |
|-----------|----------|------------|---------------|
| Run models | `dbt run` | `dbtf run` | `dbt run` |
| Run tests | `dbt test` | `dbtf test` | `dbt test` |
| Compile | `dbt compile` | `dbtf compile` | `dbt compile` |
| Debug connection | `dbt debug` | `dbtf debug` | `dbt debug` |
| Run macro | `dbt run-operation` | `dbtf run-operation` | `dbt run-operation` |
| Install packages | `dbt deps` | `dbtf deps` | `dbt deps` |
| List resources | `dbt ls` | `dbtf ls` | `dbt ls` |

Always pass `--project-dir` and `--profiles-dir` explicitly to target the temp project, not any other project on the machine.

## Reference: Snowflake Validation SQL

```sql
-- Does a table or view exist?
SHOW TABLES LIKE '<name>' IN SCHEMA <db>.<schema>;
SHOW VIEWS LIKE '<name>' IN SCHEMA <db>.<schema>;

-- Does a UDF exist?
SHOW USER FUNCTIONS LIKE '<name>' IN SCHEMA <db>.<schema>;

-- Describe UDF (verify signature and return type)
DESCRIBE FUNCTION <db>.<schema>.<name>(<arg_type>, ...);

-- Does a stored procedure exist?
SHOW PROCEDURES LIKE '<name>' IN SCHEMA <db>.<schema>;

-- Sample rows from a model
SELECT * FROM <db>.<schema>.<name> LIMIT 10;

-- Row count
SELECT COUNT(*) FROM <db>.<schema>.<name>;

-- Clean up after testing (optional)
DROP TABLE IF EXISTS <db>.<schema>.<name>;
```

## Reference: SQL Model Patterns

Common SQL model patterns for testing specific feature types:

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
-- Model with tags and meta (for testing config features)
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
-- Snapshot (for testing snapshot features)
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

## Reference: Python Model Patterns

```python
# Standard Python model (Snowpark)
def model(dbt, session):
    dbt.config(materialized="table")
    source_df = dbt.ref("source_model")
    return source_df.filter(source_df["active"] == True)
```

```python
# Python model with packages (add to requirements or packages.yml)
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

```python
# Python UDF via macro (run with dbt run-operation create_udf)
```

```sql
{% macro create_udf() %}
  CREATE OR REPLACE FUNCTION {{ target.database }}.{{ target.schema }}.add_one(n NUMBER)
  RETURNS NUMBER
  LANGUAGE PYTHON
  RUNTIME_VERSION = '3.11'
  HANDLER = 'add_one'
  AS $$
def add_one(n):
    return n + 1
  $$;
{% endmacro %}
```

For Python features, also check:

- Which Snowflake runtime versions are supported (`3.8`, `3.9`, `3.10`, `3.11`)
- Whether the feature works on dbt Core vs Fusion (Python model support differs)
- Package availability in Snowpark's Anaconda channel

---

## Output Report Template

Fill in the template below with results from the workflow steps above. Write it to a `.md` file alongside the draft doc.

---

# Testing summary: <Feature name>
**Date:** <date>
**Draft doc used as test plan:** <filename>
**Engines tested:** dbt Core / dbt Fusion / dbt platform (list which ones)
**CLI used:** dbt / dbtf / dbt platform CLI (list which ones)
**Adapter:** Snowflake (or other)
**Writer test schema:** <WRITER_DATABASE>.<WRITER_SCHEMA>
**Tested by:** dbt-feature-tester agent

---

## What was tested
<Describe the feature and what the test set out to verify — written as if the
writer is reading a summary of their own test plan>

## What I set up
<Show the exact files and config written, with code blocks>

## Commands run
<List each command, the CLI used, and the target>

## Output

### dbt Core engine
- Status: ✅ Pass / ⚠️ Warning / ❌ Fail
- CLI used: `dbt`
- Screenshot: `screenshots/<filename>.png`
- Raw output (collapsed): <key lines>

### dbt Fusion engine (if tested)
- Status: ✅ / ⚠️ / ❌
- CLI used: `dbtf` or `dbt` (specify)
- Screenshot: `screenshots/<filename>.png`
- Key difference from Core: <if any>

### dbt platform (if tested)
- Status: ✅ / ⚠️ / ❌
- CLI used: `dbt` (dbt platform CLI)
- Notes: <any>

## Snowflake Validation
- Query run: <show the SQL>
- Result: ✅ Object found / ❌ Not found
- Screenshot: `screenshots/<filename>.png`
- Details: <e.g. UDF signature, return type, language>

## Errors and bugs found
| Error | Type | Root cause | Fix tried | Outcome |
|-------|------|-----------|-----------|---------|
| <error text> | Feature bug / Scope limit / Environment / Config | <diagnosis> | <what was tried> | ✅ Resolved / ❌ Unresolved / 🐛 Confirmed bug |

## Feature findings
<!-- The primary output — what the agent learned about the feature itself -->
- 🐛 **Bug:** <describe the bug, exact error, and which engine/adapter it affects>
- ⚠️ **Limitation:** <e.g. Python UDFs not supported in dbt Core, Snowflake-only>
- ✅ **Works as expected:** <what behaved correctly>
- 🔍 **Scope clarification:** <e.g. this only works on Fusion, not Core>
- 💡 **Note for writer:** <anything the writer should know when writing the doc>

## How to reproduce this yourself
If you want to run this manually, here is exactly what to do:
1. <step by step, written for a technical writer, not an engineer>
2. ...

## Summary for writing
<Plain language paragraph: what works, what doesn't, what engine/adapter/version
caveats to include in the doc, known bugs to flag or avoid, and any open questions>
