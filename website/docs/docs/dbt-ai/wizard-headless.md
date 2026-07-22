---
title: "Headless mode"
id: "wizard-headless"
description: "Run dbt Wizard in headless mode for one-shot prompts, scripts, and automated local workflows."
sidebar_label: "Headless mode"
tags: [AI, Wizard]
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Headless mode <Lifecycle status="beta"/>

<IntroText>
<Constant name="wizard" /> can run without the interactive TUI. Use it for one-shot prompts, scripts, and automated local workflows that don't need human-in-the-loop approval.
</IntroText>

<WizardFeedbackCallout />

## `exec` — one-shot prompts

Run a single prompt and exit:

```bash
wizard exec "list all models with no tests"
```

Pipe input via stdin:

```bash
echo "which sources have stale freshness?" | wizard exec -
```

Use `exec` in a script to analyze a quality question:

```bash
# Check test coverage before merging
wizard exec "are there any models in models/marts/ with no tests?"
```

Resume the most recent recorded session with a new prompt:

```bash
wizard exec resume --last "continue the previous analysis"
```

To resume a specific session, replace `SESSION_ID` with its identifier:

```bash
wizard exec resume SESSION_ID "summarize the remaining work"
```

### JSON output

For downstream processing, emit a structured JSON event stream:

```bash
wizard exec --json "summarize test coverage by schema" > coverage.json
```

With a JSON Schema to constrain the response shape:

```bash
wizard exec \
  --json \
  --output-schema ./schemas/coverage-response.json \
  "summarize test coverage by schema"
```

Write the final message to a file:

```bash
wizard exec \
  --output-last-message ./review-output.md \
  "review the changes in this branch for correctness"
```

## `review` — automated code review

Review uncommitted changes:

```bash
wizard review --uncommitted
```

Review a branch diff:

```bash
wizard review --base main
```

Review a specific commit:

```bash
wizard review --commit abc1234
```

Review findings don't automatically produce a failing exit status. Treat the review as additional evidence, and run required parse, lint, and test commands separately.

## Permissions in headless mode

In headless `exec` mode, Wizard runs without interactive approval prompts. Pre-grant the sandbox permissions you need:

```bash
# Restrict the agent to read-only analysis
wizard exec --sandbox read-only "list models with no documentation"

# Allow file writes inside the workspace
wizard exec -s workspace-write "add not_null tests to all primary keys in staging"

# Allow shell commands like dbt compile
wizard exec -s workspace-write "compile and validate fct_orders"
```

For read-only analysis tasks, such as coverage checks, impact queries, and documentation gaps, pass `--sandbox read-only` explicitly. For tasks that write files or run dbt commands, use a write-enabled sandbox only after reviewing the task and its required credentials.

## Related docs

- [<Constant name="wizard" /> command reference](/docs/dbt-ai/wizard-cli-reference)
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases)
