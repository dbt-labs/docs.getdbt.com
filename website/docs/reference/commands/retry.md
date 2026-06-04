---
title: "About dbt retry command"
sidebar_label: "retry"
id: "retry"
---

Retry re-executes the last invocation from the point of failure.

- If no nodes are executed before the failure (for example, if a run failed early due to a warehouse connection or permission errors), retry won't run anything since there are no recorded nodes to retry from.
- In these cases, we recommend checking your [`run_results.json` file](/reference/artifacts/run-results-json) and manually re-running the full job so the nodes build. 
- Once some nodes have run, you can use retry to re-execute from any new point of failure.
- If the previously executed command completed successfully, retry will finish as `no operation`. 

## Retry flags

The `dbt retry` flags apply when you use a local dbt installation or the <Constant name="studio_ide" />.

:::note dbt platform CLI
If you use the [<Constant name="dbt_platform" /> CLI](/docs/platform/dbt-cli-installation) against your cloud environment, `dbt retry` accepts only a small subset of overrides—typically `--threads`, `--vars`, and related options. Use `dbt retry --help` on your machine for the exact list your CLI build supports.
:::

<VersionBlock lastVersion="1.99">

The following flags are supported when you run `dbt retry` with the <Constant name="core" /> engine:

| Flag | Input value | Description | Example |
|------|-------------|-------------|---------|
| <code style={{ whiteSpace: 'nowrap' }}>--threads</code> | int | Override the number of threads used in the original run | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --threads 8</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--vars</code> | YAML | Override variables from the original run | <code style={{ whiteSpace: 'nowrap' }}>{`dbt retry --vars '{"my_var": "new_value"}'`}</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--target</code> | target | Override the target from the original run | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --target prod</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--profile</code> | profile | Override the profile from the original run | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --profile jaffle_shop</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--profiles-dir</code> | path | Path to the directory containing `profiles.yml` | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --profiles-dir ~/.dbt</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--project-dir</code> | path | Path to the directory containing `dbt_project.yml` | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --project-dir .</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--target-path</code> | path | Override the target directory path | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --target-path target</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--state</code> | path | Path to a directory containing `run_results.json` from a previous run (defaults to the target directory) | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --state path/to/previous/run</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--full-refresh</code> | — | Override incremental models to run as full refreshes | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --full-refresh</code> |
<br />
Run `dbt retry --help` for the full list of flags available.
</VersionBlock>

<VersionBlock firstVersion="2.0">

The following flags are supported when you run `dbt retry` with the <Constant name="fusion_engine" />:

| Flag | Input value | Description | Example |
|------|-------------|-------------|---------|
| <code style={{ whiteSpace: 'nowrap' }}>-t, --target</code> | target | The target to execute | <code style={{ whiteSpace: 'nowrap' }}>dbt retry -t prod</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--project-dir</code> | path | The directory to load the dbt project from | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --project-dir .</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--profile</code> | profile | The profile to use | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --profile jaffle_shop</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--profiles-dir</code> | path | The directory to load the profiles from | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --profiles-dir ~/.dbt</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--packages-install-path</code> | path | The directory to install packages | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --packages-install-path dbt_packages</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--target-path</code> | path | The output directory for all produced assets | <code style={{ whiteSpace: 'nowrap' }}>dbt retry --target-path target</code> |
| <code style={{ whiteSpace: 'nowrap' }}>--vars</code> | vars | Variables for the project (use the format shown in the CLI help) | <code style={{ whiteSpace: 'nowrap' }}>{`dbt retry --vars '{"my_var": "new_value"}'`}</code> |

<br />
Run `dbt retry --help` for the full list of flags available.

### Fusion node selection

Unlike `dbt retry` with <Constant name="core" />, <Constant name="fusion" /> lets you narrow what gets retried using [`--select`](/reference/node-selection/syntax), [`--exclude`](/reference/node-selection/syntax), and [`--selector`](/reference/node-selection/yaml-selectors). Those arguments override the prior invocation’s selection set for the retry run instead of only inheriting it.

#### Examples

```shell
dbt retry --select my_model+
```

```shell
dbt retry --exclude package:analytics --selector nightly_models
```

</VersionBlock>

## Supported commands

Retry works with the following commands:

- [`build`](/reference/commands/build)
- [`compile`](/reference/commands/compile)
- [`clone`](/reference/commands/clone)
- [`docs generate`](/reference/commands/cmd-docs#dbt-docs-generate)
- [`seed`](/reference/commands/seed)
- [`snapshot`](/reference/commands/snapshot)
- [`test`](/reference/commands/test)
- [`run`](/reference/commands/run)
- [`run-operation`](/reference/commands/run-operation)

Retry references [run_results.json](/reference/artifacts/run-results-json) to determine where to start. Executing retry without correcting the previous failures yields <Term id="idempotent" /> results.

<VersionBlock lastVersion="1.99">

`dbt retry` reuses the prior command’s selection, including any [`--select`](/reference/node-selection/syntax), [`--exclude`](/reference/node-selection/syntax), or [`--selector`](/reference/node-selection/yaml-selectors) arguments. You cannot override those selectors on retry with <Constant name="core" /> or the <Constant name="dbt_platform" /> CLI.

</VersionBlock>

<VersionBlock firstVersion="2.0">

With `dbt retry`, you can optionally pass new [`--select`](/reference/node-selection/syntax), [`--exclude`](/reference/node-selection/syntax), or [`--selector`](/reference/node-selection/yaml-selectors) arguments to narrow the retry scope, as described in [Retry flags](#retry-flags).

</VersionBlock>

Example results of executing `dbt retry` after a successful `dbt run`:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models
 
Nothing to do. Try checking your model configs and model specification args
```

Example of when `dbt run` encounters a syntax error in a model:

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models

Concurrency: 24 threads (target='dev')
 
1 of 5 START sql view model main.stg_customers ................................. [RUN]
2 of 5 START sql view model main.stg_orders .................................... [RUN]
3 of 5 START sql view model main.stg_payments .................................. [RUN]
1 of 5 OK created sql view model main.stg_customers ............................ [OK in 0.06s]
2 of 5 OK created sql view model main.stg_orders ............................... [OK in 0.06s]
3 of 5 OK created sql view model main.stg_payments ............................. [OK in 0.07s]
4 of 5 START sql table model main.customers .................................... [RUN]
5 of 5 START sql table model main.orders ....................................... [RUN]
4 of 5 ERROR creating sql table model main.customers ........................... [ERROR in 0.03s]
5 of 5 OK created sql table model main.orders .................................. [OK in 0.04s]
 
Finished running 3 view models, 2 table models in 0 hours 0 minutes and 0.15 seconds (0.15s).
  
Completed with 1 error and 0 warnings:
  
Runtime Error in model customers (models/customers.sql)
 Parser Error: syntax error at or near "selct"

Done. PASS=4 WARN=0 ERROR=1 SKIP=0 TOTAL=5
```


Example of a subsequent failed `dbt retry` run without fixing the error(s):

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models

Concurrency: 24 threads (target='dev')

1 of 1 START sql table model main.customers .................................... [RUN]
1 of 1 ERROR creating sql table model main.customers ........................... [ERROR in 0.03s]

Done. PASS=4 WARN=0 ERROR=1 SKIP=0 TOTAL=5
```

Example of a successful `dbt retry` run after fixing error(s):

```shell
Running with dbt=1.6.1
Registered adapter: duckdb=1.6.0
Found 5 models, 3 seeds, 20 tests, 0 sources, 0 exposures, 0 metrics, 348 macros, 0 groups, 0 semantic models
 
Concurrency: 24 threads (target='dev')

1 of 1 START sql table model main.customers .................................... [RUN]
1 of 1 OK created sql table model main.customers ............................... [OK in 0.05s]

Finished running 1 table model in 0 hours 0 minutes and 0.09 seconds (0.09s).
 
Completed successfully
  
Done. PASS=1 WARN=0 ERROR=0 SKIP=0 TOTAL=1
```

In each scenario `dbt retry` picks up from the error rather than running all of the upstream dependencies again.
