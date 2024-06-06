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
        [description](/reference/resource-properties/description): <markdown_string>
        [quote](/reference/resource-properties/quote): true | false
        [tests](/reference/resource-properties/data-tests): ...
        [tags](/reference/resource-configs/tags): ...
        [meta](/reference/resource-configs/meta): ...
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
          [description](/reference/resource-properties/description): <markdown_string>
          data_type: <string>
          [quote](/reference/resource-properties/quote): true | false
          [tests](/reference/resource-properties/data-tests): ...
          [tags](/reference/resource-configs/tags): ...
          [meta](/reference/resource-configs/meta): ...
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
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [quote](/reference/resource-properties/quote): true | false
        [tests](/reference/resource-properties/data-tests): ...
        [tags](/reference/resource-configs/tags): ...
        [meta](/reference/resource-configs/meta): ...
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
        [description](/reference/resource-properties/description): <markdown_string>
        data_type: <string>
        [quote](/reference/resource-properties/quote): true | false
        [tests](/reference/resource-properties/data-tests): ...
        [tags](/reference/resource-configs/tags): ...
        [meta](/reference/resource-configs/meta): ...
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
        [description](/reference/resource-properties/description): <markdown_string>
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

Because columns are not resources, their `tags` and `meta` properties are not true configurations. They do not inherit the `tags` or `meta` values of their parent resources. However, you can select a generic test, defined on a column, using tags applied to its column or top-level resource; see [test selection examples](/reference/node-selection/test-selection-examples#run-tests-on-tagged-columns).

Columns may optionally define a `data_type`, which is necessary for:
- Enforcing a model [contract](/reference/resource-configs/contract)
- Use in other packages or plugins, such as the [`external`](/reference/resource-properties/external) property of sources and [`dbt-external-tables`](https://hub.getdbt.com/dbt-labs/dbt_external_tables/latest/)
