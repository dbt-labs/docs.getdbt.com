---
title: "Automating dbt reviews in CI with dbt Wizard"
id: "wizard-ci-review"
description: "Run dbt Wizard review in continuous integration and preserve the findings as pull request evidence."
sidebar_label: "Automate CI reviews"
tags: [AI, Wizard]
---

# Automating dbt reviews in CI with <Constant name="wizard" />

<IntroText>
Run `wizard review` in continuous integration (CI) to analyze a pull request diff with dbt project context. Use the review as an additional source of findings alongside deterministic dbt commands, linting, and tests.
</IntroText>

This workflow uses the headless <Constant name="wizard" /> CLI. It doesn't require the terminal user interface (TUI) or interactive approvals.

## Choose the review target

`wizard review` accepts one review target at a time:

```bash
# Review all changes relative to a base branch.
wizard review --base origin/main

# Review staged, unstaged, and untracked local changes.
wizard review --uncommitted

# Review the changes introduced by one commit.
wizard review --commit COMMIT_SHA --title "COMMIT_TITLE"
```

For pull requests, review against the remote base branch after fetching full git history. For post-merge or release automation, review a specific commit.

## Add a GitHub Actions workflow

The following workflow runs a read-only review on pull requests and uploads the result as an artifact:

<File name='.github/workflows/wizard-review.yml'>

```yaml
name: dbt Wizard review

on:
  pull_request:

permissions:
  contents: read

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the pull request
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install dbt Wizard
        run: |
          curl -fsSL https://public.cdn.getdbt.com/dbt-wizard/install/install-wizard.sh | sh
          wizard --version

      - name: Review the pull request
        run: |
          wizard review \
            --base "origin/${{ github.base_ref }}" \
            > wizard-review.md
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Upload the review
        uses: actions/upload-artifact@v4
        with:
          name: wizard-review
          path: wizard-review.md
```

</File>

Replace `OPENAI_API_KEY` with the environment variable for your configured [AI provider](/docs/dbt-ai/wizard-byok) when needed. Store the value in your CI secret manager, and don't print it in logs or commit it to the repository.

The default sandbox is appropriate for a code review because the task only needs to read the repository and git diff. Don't grant write access or warehouse credentials unless the workflow has a separate, reviewed requirement for them.

## Use the findings correctly

`wizard review` reports review findings and code locations in human-readable output. A finding doesn't, by itself, cause the command to exit with a failure status. The command can still fail for operational errors, such as invalid configuration or an unavailable provider.

Use deterministic checks as required merge gates:

```yaml
      - name: Run deterministic checks
        run: |
          dbt parse
          dbt build --select state:modified+ --state PATH_TO_STATE
```

Then use the <Constant name="wizard" /> review to identify risks that command-based checks might miss, such as incorrect business logic, incomplete downstream updates, or missing tests. If your organization wants findings to block a merge, add an explicit policy step that consumes a stable, team-defined result format and threshold. Don't assume that review prose is a pass or fail signal.

## Generate machine-readable analysis

Use `wizard exec --json` when another program needs to process the event stream:

```bash
wizard exec --json \
  "Review this branch for breaking dbt changes and summarize each finding" \
  > wizard-events.jsonl
```

The `--json` flag emits newline-delimited JSON events, not one JSON object. Use `--output-schema` to constrain the final response for a purpose-built automation:

```bash
wizard exec \
  --json \
  --output-schema .github/wizard-review.schema.json \
  "Assess this diff against our dbt review policy" \
  > wizard-events.jsonl
```

Keep the schema narrow and version it with the workflow. Validate the final response before a downstream script acts on it.

## Make CI reviews reliable

- Record `wizard --version` in CI logs, and review version updates deliberately.
- Use `fetch-depth: 0` so the base branch and merge base are available.
- Keep the review read-only unless the job is explicitly designed to modify files.
- Separate AI review from parse, compile, lint, and test gates so the source of a failure is clear.
- Preserve the output as an artifact or publish it through a separately authenticated integration.
- Avoid sending warehouse credentials to a review job that only inspects code.

## Related docs

- [Headless mode](/docs/dbt-ai/wizard-headless)
- [<Constant name="wizard" /> command reference](/docs/dbt-ai/wizard-cli-reference)
- [Configure BYOK](/docs/dbt-ai/wizard-byok)
- [Validating dbt changes with <Constant name="wizard" />](/docs/dbt-ai/wizard-validate-changes)
