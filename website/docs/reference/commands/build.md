---
title: "About dbt build command"
sidebar_label: "build"
id: "build"
---

The `dbt build` command will:
- run models
- test tests
- snapshot snapshots
- seed seeds

In DAG order, for selected resources or an entire project.

### Details

**Artifacts:** The `build` task will write a single [manifest](/reference/artifacts/manifest-json) and a single [run results artifact](/reference/artifacts/run-results-json). The run results will include information about all models, tests, seeds, and snapshots that were selected to build, combined into one file.

**Skipping on failures:** Tests on upstream resources will block downstream resources from running, and a test failure will cause those downstream resources to skip entirely. E.g. If `model_b` depends on `model_a`, and a `unique` test on `model_a` fails, then `model_b` will `SKIP`.
- Don't want a test to cause skipping? Adjust its [severity or thresholds](/reference/resource-configs/severity) to `warn` instead of `error`
- In the case of a test with multiple parents, where one parent depends on the other (e.g. a `relationships` test between `model_a` + `model_b`), that test will block-and-skip children of the most-downstream parent only (`model_b`).

**Selecting resources:** The `build` task supports standard selection syntax (`--select`, `--exclude`, `--selector`), as well as a `--resource-type` flag that offers a final filter (just like `list`). Whichever resources are selected, those are the ones that `build` will run/test/snapshot/seed.
- Remember that tests support indirect selection, so `dbt build -s model_a` will both run _and_ test `model_a`. What does that mean? Any tests that directly depend on `model_a` will be included, so long as those tests don't also depend on other unselected parents. See [test selection](/reference/node-selection/test-selection-examples) for details and examples.

**Flags:** The `build` task supports all the same flags as `run`, `test`, `snapshot`, and `seed`. For flags that are shared between multiple tasks (e.g. `--full-refresh`), `build` will use the same value for all selected resource types (e.g. both models and seeds will be full refreshed).

### Examples

```
$ dbt build
Running with dbt=0.21.0-b2
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
