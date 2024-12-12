---
title: "Node selection"
description: "Learn how to select and exclude resources in dbt."
sidebar_label: "About node selection"
id: node-selection
---

dbt's resource selection process is consistent across commands but can feel counterintuitive in certain cases. To clarify this, let's outline the steps dbt follows when selecting resources.

To understand dbt resource selection:

- Think of selection and exclusion as two filtering steps applied sequentially.
- Recognize that the type of command determines the final resources executed.
- Understand that edge cases like `dbt test` or `source:` aren't exceptions but logical outcomes of this schematic.

### Initial resource selection

dbt selects any resource that matches one or more `--models` or `--select` criteria in the order of:

- Selection methods: Methods like `tag:`, `source:`, `model:`.
- Graph operators: Operators like `+` (which selects upstream/downstream dependencies).
- Set operators: Combining resources with `,` or other logical operators.
- Selected resources may include:
  - models
  - sources
  - seeds
  - snapshots
  - 
  - tests

### Applying --exclude criteria

dbt removes any resource that matches one or more `--exclude` criteria. If the command is `dbt test`, dbt also de-selects any test that directly depends on an excluded resource.

### Resource filtering by command type

After applying selection and exclusion rules, dbt retains only the resources relevant to the current command:

- `dbt run`: Keeps models.
- `dbt seed`: Keeps seeds.
- `dbt test`: Keeps tests (and selects tests that depend on selected resources).
- Other commands: Filters resources specific to the actual command.

### Examples of resource selection

The following examples show how dbt selects resources based on the specific command and the `--select` and `--exclude` criteria.

#### Example 1 
Selecting a model and downstream dependencies:

```bash
dbt run -s my_model+
```

This command selects `my_model` and all downstream dependencies (`+`). It selects only models because `dbt run` filters out other resource types.

#### Example 2
Testing a model with its tests:

```bash
dbt test -s my_model
```

This command selects `my_model` and any tests directly associated with it. It filters out models, keeping only tests for execution.

#### Example 3
Excluding a resource:

```bash
dbt run -s my_model --exclude tag:deprecated
```

This selects `my_model` and all downstream dependencies. It excludes any resource tagged as `deprecated` and filters resources to retain only models (because `dbt run` is invoked).

#### Example 4
YAML selectors differ slightly:

The `exclude:` key in YAML selectors supports more complex set logic, allowing fine-grained control over resource inclusion and exclusion.

### Considerations
Certain cases may seem inconsistent but follow the same selection process:

- Tests that depend on excluded models are de-selected automatically in dbt test.
- `source:` and `model:` selection methods behave differently.
- Using `+` or `,` can feel unintuitive but works predictably based on graph structure.
