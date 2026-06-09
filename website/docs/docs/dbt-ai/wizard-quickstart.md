---
title: "Getting started with dbt Wizard CLI"
id: "wizard-quickstart"
description: "Set up dbt Wizard CLI, connect it to a sample dbt project, and use it to make and validate your first dbt change."
sidebar_label: "Getting started with Wizard CLI"
tags: [AI, CLI, dbt Wizard]
hide_table_of_contents: true
---

import WizardCliInstall from '/snippets/_wizard-cli-install-by-version.md';
import WizardCliOnboarding from '/snippets/_wizard-cli-onboarding.md';
import NewToTerminal from '/snippets/_new-to-terminal.md';
import WizardFeedbackCallout from '/snippets/_wizard-feedback-callout.md';
import WizardCliDbtCliSupport from '/snippets/_wizard-cli-dbt-cli-support.md';

<div style={{maxWidth: '900px'}}>

# Getting started with <Constant name="wizard" /> CLI

<IntroText>
Set up <Constant name="wizard" /> CLI in a local dbt project and use it to understand, edit, and validate dbt code from your terminal.
</IntroText>

By the end of this guide, you'll have:

- A local sample dbt project that <Constant name="wizard" /> can inspect
- <Constant name="wizard" /> CLI installed and configured with a supported AI provider
- A first <Constant name="wizard" /> session that explains the project
- A small dbt change proposed by <Constant name="wizard" />, reviewed by you, and validated with dbt

## Prerequisites

You'll need:

- A terminal and basic familiarity with `cd`, `ls`, and `pwd`
- Git installed locally
- A dbt project connected to a supported data platform
- A working dbt executable, such as <Constant name="fusion" /> or <Constant name="core" />
- A supported AI provider configured using [BYOK](/docs/dbt-ai/wizard-byok), or an OpenAI subscription

<WizardCliDbtCliSupport />

<NewToTerminal />

## Preparing a sample dbt project

Use a small dbt project for your first <Constant name="wizard" /> session so you can review changes safely. This guide uses a fictional Magic Shop dataset with four source tables and a small staging layer.

You can add the sample data to an existing local dbt project, or create a new dbt project for this walkthrough.

### Setting up sample data

Create or load the following source tables in your warehouse. The examples in this guide assume the tables are available in a database named `raw` and a schema named `magic_shop`. If you use a different location, update `models/staging/sources.yml` in the next step.

<SimpleTable>

| Source table | Columns |
| --- | --- |
| `wizards` | `id`, `w_name`, `email`, `phone`, `world` |
| `orders` | `id`, `customer`, `wand`, `date` |
| `wands` | `id`, `name` |
| `worlds` | `id`, `name` |

</SimpleTable>

<!-- TODO: Add a public sample data setup script or CSV download when available. -->

### Adding staging models

In your dbt project, create a `models/staging` directory:

```shell
mkdir -p models/staging
```

Add a source configuration file:

<File name="models/staging/sources.yml">

```yaml
version: 2

sources:
  - name: raw
    database: raw
    schema: magic_shop
    tables:
      - name: wizards
        columns:
          - name: id
          - name: w_name
          - name: email
            meta:
              contains_pii: true
          - name: phone
            meta:
              contains_pii: true
          - name: world
      - name: orders
        columns:
          - name: id
          - name: customer
          - name: wand
          - name: date
      - name: wands
        columns:
          - name: id
          - name: name
      - name: worlds
        columns:
          - name: id
          - name: name
```

</File>

Then add these staging models:

<File name="models/staging/stg_wizards.sql">

```sql
select
    id as wizard_id,
    w_name as wizard_name,
    email,
    coalesce(
        regexp_like(
            email,
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        ) = true,
        false
    ) as is_valid_email_address,
    phone as phone_number,
    world as world_id
from {{ source('raw', 'wizards') }}
```

</File>

<File name="models/staging/stg_orders.sql">

```sql
select
    id as order_id,
    customer as wizard_id,
    wand as wand_id,
    date as order_date,
    datediff(
        'day',
        order_date,
        {{ dbt.current_timestamp() }}
    ) as days_since_ordered
from {{ source('raw', 'orders') }}
```

</File>

<File name="models/staging/stg_wands.sql">

```sql
select
    id as wand_id,
    name as wand_name
from {{ source('raw', 'wands') }}
```

</File>

<File name="models/staging/stg_worlds.sql">

```sql
select
    id as world_id,
    name as world_name
from {{ source('raw', 'worlds') }}
```

</File>

Confirm that your project can compile:

```shell
dbt compile
```

If `dbt compile` fails, fix the dbt project before continuing. <Constant name="wizard" /> works best when it can compile and inspect your project.

## Installing dbt Wizard CLI

<WizardCliInstall />

After installing, confirm that <Constant name="wizard" /> is available:

```shell
wizard --version
```

## Configuring dbt Wizard CLI

From the root of your dbt project, start <Constant name="wizard" />:

```shell
wizard
```

Complete first-run onboarding:

<WizardCliOnboarding />

## Asking Wizard to explain the project

Start with a read-only prompt so you can verify that <Constant name="wizard" /> understands your project before asking it to make changes:

```text
summarize what this project does
```

Then ask <Constant name="wizard" /> to identify a focused improvement:

```text
which staging models are missing tests?
```

Review the response and choose one small change to make in the next step.

## Making your first dbt change

Ask <Constant name="wizard" /> to add tests or documentation to one staging model. For example:

```text
add not_null and unique tests to the primary key of stg_wizards
```

<Constant name="wizard" /> proposes a diff before it writes changes. Review the diff, then approve, reject, or redirect the change.

## Validating the change

After you apply a change, run dbt from the same project directory:

```shell
dbt build --select stg_wizards+
```

If the command succeeds, review the changed files:

```shell
git diff
```

If the command fails, return to <Constant name="wizard" /> and paste the error message:

```text
dbt build failed with this error: ERROR_MESSAGE
```

Replace `ERROR_MESSAGE` with the error from your terminal.

## Reviewing before you commit

Use <Constant name="wizard" /> to review your local changes:

```shell
wizard review --uncommitted
```

Then commit the change with your usual Git workflow:

```shell
git status
git add .
git commit -m "Add tests for staging model"
```

## Troubleshooting

### Wizard cannot find dbt

Confirm that your dbt executable works from the same terminal:

```shell
dbt --version
dbt compile
```

If your project uses a virtual environment, activate it before starting <Constant name="wizard" />.

### Provider authentication fails

Run `/providers` in the interactive <Constant name="wizard" /> session and check that your provider is enabled and authenticated. For BYOK setup details, refer to [Configure BYOK](/docs/dbt-ai/wizard-byok).

### The sample project does not compile

Run `dbt debug` and `dbt compile` before starting <Constant name="wizard" />. Fix connection, source, seed, or dependency errors first.

## Conclusion

You installed <Constant name="wizard" /> CLI, connected it to a local dbt project, asked project-aware questions, made a small model change, and validated that change with dbt.

## Next steps

- Try more [Wizard use cases](/docs/dbt-ai/wizard-use-cases)
- Configure default models and project settings in [Configuration reference](/docs/dbt-ai/wizard-config)
- Add reusable project guidance with [Wizard skills](/docs/dbt-ai/wizard-skills)

<WizardFeedbackCallout />

</div>
