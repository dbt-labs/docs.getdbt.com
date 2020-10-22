---
title: "Understanding state"
---

<Changelog>

 - The `--state` flag was introduced in dbt v0.18.0 as a beta feature

</Changelog>

One of the greatest underlying assumptions about dbt is that its operations should be **stateless** and **idempotent**. That is, it doesn't matter how many times a model has been run before, or if it has ever been run before. It doesn't matter if you run it once or a thousand times. Given the same raw data, you can expect the same transformed result. A given run of dbt doesn't need to "know" about _any other_ run; it just needs to know about the code in the project and the objects in your database as they exist _right now_.

That said, dbt does store "state"—a detailed, point-in-time view of project resources, database objects, and invocation results—in the form of its [artifacts](dbt-artifacts). If you choose, dbt can use these artifacts to inform certain  operations. Crucially, the operations themselves are still stateless and idempotent: given the same manifest and the same raw data, dbt will produce the same transformed result.

dbt can leverage artifacts from a prior invocation as long as their file path is passed to the `--state` flag. This is a prerequsite for:
- [The `state:` selector](methods#the-state-method), whereby dbt can identify resources that are new or modified
by comparing code in the current project against the state manifest.
- [Deferring to a previous run](run#deferring-to-previous-run-state), whereby dbt can identify references to upstream, unselected models and "defer" them to the namespaces provided by the state manifest, instead of expecting them in the current run environment's namespace.

Together, these two features enable ["slim CI"](best-practices#run-only-modified-models-to-test-changes-slim-ci). We expect to add more features in future releases that can leverage artifacts passed to the `--state` flag.

#### Notes:
- The `--state` artifacts must be of schema versions that are compatible with the currently running dbt version.
- The path to state artifacts can be set via the `--state` flag or `DBT_ARTIFACT_STATE_PATH` environment variable. If both the flag and env var are provided, the flag takes precedence.
