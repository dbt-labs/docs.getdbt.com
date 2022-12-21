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

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: <model_name>
    columns:
      - name: <column_name>
        data_type: <string>
        [description](description): <markdown_string>
        [quote](quote): true | false
        [tests](resource-properties/tests): ...
        [tags](resource-configs/tags): ...
        [meta](resource-configs/meta): ...
      - name: <another_column>
        ...
```

</File>

</TabItem>

<TabItem value="sources">

<File name='models/<filename>.yml'>

```yml
version: 2

sources:
  - name: <source_name>
    tables:
    - name: <table_name>
      columns:
        - name: <column_name>
          [description](description): <markdown_string>
          data_type: <string>
          [quote](quote): true | false
          [tests](resource-properties/tests): ...
          [tags](resource-configs/tags): ...
          [meta](resource-configs/meta): ...
        - name: <another_column>
          ...

```

</File>

</TabItem>

<TabItem value="seeds">

<File name='seeds/<filename>.yml'>

```yml
version: 2

seeds:
  - name: <seed_name>

    columns:
      - name: <column_name>
        columns:
          - name: <column_name>
            [description](description): <markdown_string>
            data_type: <string>
            [quote](quote): true | false
            [tests](resource-properties/tests): ...
            [tags](resource-configs/tags): ...
            [meta](resource-configs/meta): ...
          - name: <another_column>
            ...
```

</File>

</TabItem>

<TabItem value="snapshots">

<File name='snapshots/<filename>.yml'>

```yml
version: 2

snapshots:
  - name: <snapshot_name>
    columns:
      - name: <column_name>
        [description](description): <markdown_string>
        data_type: <string>
        [quote](quote): true | false
        [tests](resource-properties/tests): ...
        [tags](resource-configs/tags): ...
        [meta](resource-configs/meta): ...
      - name: <another_column>

```

</File>

</TabItem>


<TabItem value="analyses">

<File name='analyses/<filename>.yml'>

```yml
version: 2

analyses:
  - name: <analysis_name>
    columns:
      - name: <column_name>
        [description](description): <markdown_string>
        data_type: <string>
      - name: <another_column>

```

</File>

</TabItem>

</Tabs>

Columns are not resources in and of themselves. Instead, they are child properties of another resource type. They can define sub-properties that are similar to properties defined at the resource level:
- `tags`
- `meta`
- `tests`
- `description`

Because columns are not resources, their `tags` and `meta` properties are not true configurations. They do not inherit the `tags` or `meta` values of their parent resources. However, you can select a generic test, defined on a column, using tags applied to its column or top-level resource; see [test selection examples](test-selection-examples#run-tests-on-tagged-columns).

Columns may optionally define a `data_type`. This is for metadata purposes only, such as to use alongside the [`external`](resource-properties/external) property of sources.
