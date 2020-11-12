---
resource_types: all
datatype: test
---


<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Sources', value: 'sources', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Analyses', value: 'analyses', },
  ]
}>
<TabItem value="models">

**Note:** To tag a model, use the [tag _configuration_](resource-configs/tags).

<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: model_name
    # tags: [] # this is not supported — check out the above link for more info

    columns:
      - name: column_name
        tags: [<string>]
        tests:
          <test-name>:
            tags: [<string>]

```

</File>

</TabItem>

<TabItem value="sources">

Unlike models, seeds, and snapshot, you _can_ tag sources as a property.

<File name='models/schema.yml'>

```yml
version: 2

sources:
  - name: source_name
    tags: [<string>]

    tables:
      - name: table_name
        tags: [<string>]

        columns:
          - name: column_name
            tags: [<string>]
            tests:
              <test-name>:
                tags: [<string>]

```

</File>

</TabItem>

<TabItem value="seeds">

**Note:** To tag a model, use the [tag _configuration_](resource-configs/tags).

<File name='data/schema.yml'>

```yml
version: 2

seeds:
  - name: seed_name
    # tags: [] # this is not supported — check out the above link for more info

    columns:
      - name: column_name
        tags: [<string>]
        tests:
          <test-name>:
            tags: [<string>]

```

</File>

</TabItem>

<TabItem value="snapshots">

**Note:** To tag a snapshot, use the [tag _configuration_](resource-configs/tags).

<File name='snapshots/schema.yml'>

```yml
version: 2

snapshots:
  - name: snapshot_name
    # tags: [] # this is not supported — check out the above link for more info

    columns:
      - name: column_name
        tags: [<string>]
        tests:
          <test-name>:
            tags: [<string>]

```

</File>

</TabItem>

<TabItem value="analyses">

<File name='analysis/schema.yml'>

```yml
version: 2

analyses:
  - name: analysis_name
    description: markdown_string

    columns:
      - name: column_name
        tags: [<string>]
        tests:
          <test-name>:
            tags: [<string>]

```

</File>

</TabItem>

</Tabs>


### Definition

The `tags` _property_ can be used to:
- set tags for a column
- set tags on a specific test
- set tags for a source or source table.

These tags can be used as part of the [resource selection syntax](node-selection/syntax).

Note that you need to use the [tag _configuration_](resource-configs/tags) to apply tags to models, seeds, and snapshots. (Yes, we know this is confusing, and hope to resolve it in a future release!)

<Changelog>

- `v0.16.0`: Added ability to apply tags to columns and tests

</Changelog>

### Scopes of `tags` _property_
The scopes of the `tags` _property_ are different depending on the annotated targets.
When we run schema tests, `tags` _property_ affects all schema tests on a particular tagged source, column or test.
Even though a schema test is not applied by any `tags`.

|tagged target           |scopes                                                    |
|------------------------|----------------------------------------------------------|
|a source or source table|all schema tests under a particular source or source table|
|a column                |all schema tests under a particular column                |
|a schema test           |a particular schema test                                  |


## Examples
### Tag a column and test

```yml
models:
  - name: users
    columns:
      - name: email
        # Add a "pii" tag to this column, and all associated tests
        tags:
          - pii
        tests:
          - unique

      - name: account_id
        tests:
          - relationships:
              to: ref("accounts")
              field: id
              # Add a "foreign-key" tag to this test
              tags:
                - foreign-key
```

Then, use the `tag:` selector to run the tests on a particular column.

```
$ dbt test --models tag:pii
```
