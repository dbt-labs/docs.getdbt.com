---
title: "build"
id: "build"
---

:::info Beta

dbt v0.21.0-b1 is currently available as a prerelease. If you have questions or encounter bugs, please let us know in [#dbt-prereleases](https://community.getdbt.com/) or by opening an issue [in GitHub](https://github.com/dbt-labs/dbt).

:::

<Changelog>

- Introduced in **v0.21.0**
    
</Changelog>

The `dbt build` command will:
- run models
- test tests
- snapshot snapshots
- seed seeds

In DAG order, for selected resources or an entire project.

### Implementation details

- The `build` task uses the same selection syntax as `run` and `test`: `--models`, `--exclude`, `--selector`, etc.
- The `build` task will write a single [manifest](artifacts/manifest-json) and a single [run results artifact](artifacts/run-results-json). The run results will include information about all models, tests, seeds, and snapshots that were selected to build, combined into one file.

### Current limitations

v0.21 is currently in beta, and as such there are some limitations to `dbt build` that we're hoping to address before the final release:

- A test on a resource should block that resource's other downstream children from running, and a test failure should cause those other children to `SKIP` ([dbt#3597](https://github.com/dbt-labs/dbt/issues/3597))
- The `build` command should be supported in the [dbt Server](rpc) ([#3595](https://github.com/dbt-labs/dbt/issues/3595))
- The `build` command should support the superset of CLI flags supported by `run`, `test`, `seed`, and `snapshot` ([dbt#3596](https://github.com/dbt-labs/dbt/issues/3596)). The `build` command should also support a `--resource-type` flag, as the `list` command does.
- Ahead of the final v0.21 release, we're thinking about switching all commands to use `--select`, with backwards compatibility for `--models` ([dbt#3210](https://github.com/dbt-labs/dbt/issues/3210)). It doesn't make much sense to use a `--models` flag, when the whole point is building more than models.

```
$ dbt build
Running with dbt=0.21.0-a1
Found 1 model, 4 tests, 1 snapshot, 1 analysis, 341 macros, 0 operations, 1 seed file, 2 sources, 2 exposures

18:49:43 | Concurrency: 1 threads (target='dev')
18:49:43 |
18:49:43 | 1 of 7 START seed file dbt_jcohen.my_seed............................ [RUN]
18:49:43 | 1 of 7 OK loaded seed file dbt_jcohen.my_seed........................ [INSERT 2 in 0.09s]
18:49:43 | 2 of 7 START view model dbt_jcohen.my_model.......................... [RUN]
18:49:43 | 2 of 7 OK created view model dbt_jcohen.my_model..................... [CREATE VIEW in 0.12s]
18:49:43 | 3 of 7 START test not_null_my_seed_id................................ [RUN]
18:49:43 | 3 of 7 PASS not_null_my_seed_id...................................... [PASS in 0.05s]
18:49:43 | 4 of 7 START test unique_my_seed_id.................................. [RUN]
18:49:43 | 4 of 7 PASS unique_my_seed_id........................................ [PASS in 0.03s]
18:49:43 | 5 of 7 START snapshot snapshots.my_snapshot.......................... [RUN]
18:49:43 | 5 of 7 OK snapshotted snapshots.my_snapshot.......................... [INSERT 0 5 in 0.27s]
18:49:43 | 6 of 7 START test not_null_my_model_id............................... [RUN]
18:49:43 | 6 of 7 PASS not_null_my_model_id..................................... [PASS in 0.03s]
18:49:43 | 7 of 7 START test unique_my_model_id................................. [RUN]
18:49:43 | 7 of 7 PASS unique_my_model_id....................................... [PASS in 0.02s]
18:49:43 |
18:49:43 | Finished running 1 seed, 1 view model, 4 tests, 1 snapshot in 1.01s.

Completed successfully

Done. PASS=7 WARN=0 ERROR=0 SKIP=0 TOTAL=7
```
