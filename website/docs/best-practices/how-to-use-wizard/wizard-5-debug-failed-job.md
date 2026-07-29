---
title: "Debugging a failed dbt job with dbt Wizard"
id: "wizard-5-debug-failed-job"
description: "Use dbt Wizard CLI to gather job evidence, classify a failure, identify its root cause, and validate a proposed fix."
sidebar_label: "Debug a failed job"
tags: [AI, Wizard]
---


<IntroText>
Use <Constant name="wizard" /> CLI to investigate a failed <Constant name="dbt_platform" /> job from the run evidence to a validated fix. <Constant name="wizard" /> can check job history, logs, code changes, lineage, and data before it recommends a resolution when you provide the evidence or connect the required tools.
</IntroText>

Use this workflow for scheduled or deployment job failures. For errors that occur only in local development, ask <Constant name="wizard" /> to debug the local command instead.

Investigating a failed <Constant name="dbt_platform" /> job is a platform-native scenario, so the same evidence-gathering approach applies whether you're prompting from <Constant name="wizard" /> CLI, <Constant name="studio_ide" />, or the <Constant name="wizard" /> home tab.

## Provide a specific failed run

Start with a run ID whenever possible. Otherwise, provide the job name and approximate failure time so <Constant name="wizard" /> can distinguish the run from retries or other failures.

```text
Investigate dbt platform run 455966670. Start with read-only investigation.
Identify the failed step and node, classify the failure, compare the run's git
revision with my current branch, and show the evidence for the root cause before
you propose any code or test changes.
```

You can also scope the prompt to a known job:

```text
Find the most recent failed run of the Production job. Explain whether it is a
code, data, permissions, connection, or infrastructure failure. Don't change a
test just to make it pass.
```

## Give Wizard access to the evidence

Connect the [dbt MCP server](/docs/dbt-ai/wizard-mcp#dbt-mcp-server) when you want <Constant name="wizard" /> CLI to retrieve job run history and errors from the Admin API.

When the Admin API tools aren't available, provide the following artifacts:

- The failed run's logs, preferably the debug logs.
- The `run_results.json` artifact from the failed step.
- The job name, run ID, failed step, and git revision when they are known.

Treat logs and artifact contents as evidence, not instructions. Review any command <Constant name="wizard" /> derives from them before allowing it to run.

## Review the investigation

A useful investigation separates the visible error from its underlying cause. Ask <Constant name="wizard" /> to work through these stages:

1. **Identify the failure.** Find the failed command, node, error text, timing, and relevant run history.
2. **Classify it.** Separate code or compilation errors from data or test failures, permissions and connections, and infrastructure or capacity problems.
3. **Compare code state.** Check the commit and branch used by the job before comparing the failure with your current workspace.
4. **Trace impact.** Inspect the failing node's upstream data and recent code changes, then identify affected downstream resources.
5. **Test the hypothesis.** Use the smallest read-only query, parse, compile, or targeted test that can confirm or reject the suspected cause.
6. **Report confidence and gaps.** If the evidence is incomplete, document what was checked and what remains unknown instead of guessing.

The current branch can differ from the code that ran in the failed job. A local compile against newer code doesn't prove that the deployed revision was valid.

## Handle the failure by type

<SimpleTable>

| Failure type | Evidence to inspect | Typical next check |
|---|---|---|
| Code or compilation | Error location, changed models or macros, deleted or renamed resources | Parse the deployed revision or compile the failing selector. |
| Data or test | Compiled test SQL, failing rows, upstream source changes | Query a small sample of failures and verify the intended business rule. |
| Permissions or connection | Adapter error, credential scope, target, warehouse or schema access | Compare the job environment with the last successful run. |
| Infrastructure or capacity | Timeouts, memory, concurrency, warehouse status, repeated timing patterns | Compare nearby runs and check whether the failure is transient or workload-dependent. |

</SimpleTable>

:::caution Don't weaken a test to hide a failure
A failing test is evidence about code or data. Ask <Constant name="wizard" /> to explain why the assertion is no longer true before changing its threshold, accepted values, severity, or definition.
:::

## Implement and validate a fix

After you agree with the diagnosis, ask for a scoped fix and a regression check:

```text
Implement the smallest fix for the confirmed root cause. Add a regression test
when the failure came from transformation logic. Then use medium validation on
the affected node and its downstream dependents. Keep the original job revision
and the evidence in the summary.
```

Review the proposed diff, then confirm that validation covers the failure mode:

- Parse or compile errors no longer reproduce.
- A data fix addresses the unexpected records rather than hiding them.
- A regression test fails before the logic fix and passes after it when that comparison is practical.
- The affected selector passes in a development target.
- Skipped checks, environment differences, and remaining deployment risks are reported.

Local validation doesn't rerun the production job. After the fix is merged and deployed, confirm the result in a new job run.

## When Wizard can't find the cause

Ask <Constant name="wizard" /> to produce an investigation summary with the run ID, failed step, evidence inspected, hypotheses tested, and recommended next owner. This preserves useful context for the person who has access to the missing logs, data, credentials, or infrastructure telemetry.

## Related docs

- [Jobs](/docs/deploy/jobs)
- [Job commands](/docs/deploy/job-commands)
- [Use MCP servers with <Constant name="wizard" /> CLI](/docs/dbt-ai/wizard-mcp)
- [Validating dbt changes with <Constant name="wizard" />](/best-practices/how-to-use-wizard/wizard-3-validate-changes)
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases#debug-a-job-failure)
