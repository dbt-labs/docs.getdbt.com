---
title: "About state in dbt"
description: "dbt operations are stateless and idempotent, but artifacts enable state-based features like slim CI and deferral."
pagination_next: "reference/node-selection/configure-state"
---

One of the greatest underlying assumptions about dbt is that its operations should be **stateless** and **<Term id="idempotent" />**. That is, it doesn't matter how many times a model has been run before, or if it has ever been run before. It doesn't matter if you run it once or a thousand times. Given the same raw data, you can expect the same transformed result. A given run of dbt doesn't need to "know" about _any other_ run; it just needs to know about the code in the project and the objects in your database as they exist _right now_.

That said, dbt does store "state" &mdash; a detailed, point-in-time view of project resources (also referred to as nodes), database objects, and invocation results &mdash; in the form of its [artifacts](/docs/deploy/artifacts). If you choose, dbt can use these artifacts to inform certain  operations. Crucially, the operations themselves are still stateless and <Term id="idempotent" />: given the same manifest and the same raw data, dbt will produce the same transformed result.

dbt can leverage artifacts from a prior invocation as long as their file path is passed to the `--state` flag. This is a prerequisite for:
- [The `state` selector](/reference/node-selection/methods#state), whereby dbt can identify resources that are new or modified
by comparing code in the current project against the state manifest.
- [Deferring](/reference/node-selection/defer) to another environment, whereby dbt can identify upstream, unselected resources that don't exist in your current environment and instead "defer" their references to the environment provided by the state manifest.
- The [`dbt clone` command](/reference/commands/clone), whereby dbt can clone nodes based on their location in the manifest provided to the `--state` flag.

Together, the [`state`](/reference/node-selection/methods#state) selector and deferral enable ["slim CI"](/best-practices/best-practice-workflows#run-only-modified-models-to-test-changes-slim-ci). We expect to add more features in future releases that can leverage artifacts passed to the `--state` flag.

## Related docs
- [Configure state selection](/reference/node-selection/configure-state)
- [State comparison caveats](/reference/node-selection/state-comparison-caveats)
