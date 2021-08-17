---
title: "Understanding state"
---

<Changelog>

 - The `--state` flag was introduced in dbt v0.18.0

</Changelog>

One of the greatest underlying assumptions about dbt is that its operations should be **stateless** and **idempotent**. That is, it doesn't matter how many times a model has been run before, or if it has ever been run before. It doesn't matter if you run it once or a thousand times. Given the same raw data, you can expect the same transformed result. A given run of dbt doesn't need to "know" about _any other_ run; it just needs to know about the code in the project and the objects in your database as they exist _right now_.

That said, dbt does store "state"—a detailed, point-in-time view of project resources, database objects, and invocation results—in the form of its [artifacts](dbt-artifacts). If you choose, dbt can use these artifacts to inform certain  operations. Crucially, the operations themselves are still stateless and idempotent: given the same manifest and the same raw data, dbt will produce the same transformed result.

dbt can leverage artifacts from a prior invocation as long as their file path is passed to the `--state` flag. This is a prerequsite for:
- [The `state:` selector](methods#the-state-method), whereby dbt can identify resources that are new or modified
by comparing code in the current project against the state manifest.
- [Deferring](defer) to another environment, whereby dbt can identify upstream, unselected resources that don't exist in your current environment and instead "defer" their references to the environment provided by the state manifest.

Together, these two features enable ["slim CI"](best-practices#run-only-modified-models-to-test-changes-slim-ci). We expect to add more features in future releases that can leverage artifacts passed to the `--state` flag.

### Establishing state

State and defer can be set by environment variables as well as CLI flags:

- `--state` or `DBT_ARTIFACT_STATE_PATH`: file path
- `--defer` or `DBT_DEFER_TO_STATE`: boolean

If both the flag and env var are provided, the flag takes precedence.

#### Notes:
- The `--state` artifacts must be of schema versions that are compatible with the currently running dbt version.
- The path to state artifacts can be set via the `--state` flag or `DBT_ARTIFACT_STATE_PATH` environment variable. If both the flag and env var are provided, the flag takes precedence.
- These are powerful, complex features. Read about [known caveats and limitations](node-selection/state-comparison-caveats) to state comparison.
