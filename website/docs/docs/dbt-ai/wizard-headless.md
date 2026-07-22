---
title: "Headless mode"
id: "wizard-headless"
description: "Run dbt Wizard in headless mode for scripts, CI pipelines, and automation."
sidebar_label: "Headless mode"
tags: [AI, Wizard]
---

import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';

# Headless mode <Lifecycle status="beta"/>

<IntroText>
<Constant name="wizard" /> can run without the interactive TUI — useful for scripts, CI pipelines, pre-commit hooks, and any workflow where you want a one-shot result without human-in-the-loop approval.
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

Use `exec` in CI to gate on quality checks:

```bash
# Check test coverage before merging
wizard exec "are there any models in models/marts/ with no tests?"
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

Review a branch diff in CI:

```bash
wizard review --base main
```

Review a specific commit:

```bash
wizard review --commit abc1234
```

### Example: GitHub Actions code review

```yaml
- name: dbt Wizard review
  run: |
    wizard review \
      --base ${{ github.base_ref }} > review.md
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

## Permissions in headless mode

In headless `exec` mode, Wizard runs without interactive approval prompts. Pre-grant the sandbox permissions you need:

```bash
# Read-only analysis (default — safe for CI)
wizard exec "list models with no documentation"

# Allow file writes inside the workspace
wizard exec -s workspace-write "add not_null tests to all primary keys in staging"

# Allow shell commands like dbt compile
wizard exec -s workspace-write "compile and validate fct_orders"
```

For read-only analysis tasks (coverage checks, impact queries, documentation gaps), the default permissions are sufficient. For tasks that write files or run dbt commands, pass the appropriate flags explicitly.

## Related docs

- [<Constant name="wizard" /> command reference](/docs/dbt-ai/wizard-cli-reference)
- [Use cases and examples](/docs/dbt-ai/wizard-use-cases)
