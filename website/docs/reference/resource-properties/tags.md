---
resource_types: all
datatype: test
---
<Alert type='warning'>
<h4>Heads up!</h4>
This is a work in progress document.

</Alert>

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

**Note:** To tag a model, use the [tag configuration](resource-configs/tags)
<File name='models/schema.yml'>

```yml
version: 2

models:
  - name: model_name

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

<File name='models/schema.yml'>

Unlike models, seeds, and snapshot, you _can_ tag sources as a property.

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

**Note:** To tag a model, use the [tag configuration](resource-configs/tags)

<File name='data/schema.yml'>

```yml
version: 2

seeds:
  - name: seed_name

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

<File name='snapshots/schema.yml'>

**Note:** To tag a snapshot, use the [tag configuration](resource-configs/tags)


```yml
version: 2

snapshots:
  - name: snapshot_name

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


#### tags

<Changelog> Added in v0.16.0 </Changelog>

The `tags` field can be used to set tags for a column, or to set tags on a specific test. Example:

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

Tests on column tags can be run using the `tag:` selector:

```
$ dbt test --models tag:pii
```
