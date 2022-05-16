---
resource_types: [models, seeds, snapshots, tests]
datatype: "{dictionary}"
---

<Changelog>
    - **v0.21.0** introduced the `config` property
</Changelog>

<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Tests', value: 'tests', },
  ]
}>

<TabItem value="models">

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: <model_name>
    config:
      [<model_config>](model-configs): <config_value>
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
    config:
      [<seed_config>](seed-configs): <config_value>
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
    config:
      [<snapshot_config>](snapshot-configs): <config_value>
      ...
```

</File>

</TabItem>


<TabItem value="tests">

<File name='<resource_path>/<filename>.yml'>

```yml
version: 2

<resource_type>:
  - name: <resource_name>
    tests:
      - [<test_name>](#test_name):
          <argument_name>: <argument_value>
          config:
            <test_config>: <config-value>
            ...

    [columns](columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              config:
                [<test_config>](test-configs): <config-value>
                ...

```

</File>

</TabItem>

</Tabs>

The `config` property allows you to configure resources at the same time you're defining properties in yaml files.
