---
title: "About config property"
sidebar_label: "config"
resource_types: [models, seeds, snapshots, tests, sources, metrics, exposures]
datatype: "{dictionary}"
---


<Tabs
  defaultValue="models"
  values={[
    { label: 'Models', value: 'models', },
    { label: 'Seeds', value: 'seeds', },
    { label: 'Snapshots', value: 'snapshots', },
    { label: 'Tests', value: 'tests', },
    { label: 'Sources', value: 'sources', },
    { label: 'Metrics', value: 'metrics', },
    { label: 'Exposures', value: 'exposures', },
    { label: 'Semantic models', value: 'semantic models', },
  ]
}>

<TabItem value="models">

<File name='models/<filename>.yml'>

```yml
version: 2

models:
  - name: <model_name>
    config:
      [<model_config>](/reference/model-configs): <config_value>
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
      [<seed_config>](/reference/seed-configs): <config_value>
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
      [<snapshot_config>](/reference/snapshot-configs): <config_value>
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

    [columns](/reference/resource-properties/columns):
      - name: <column_name>
        tests:
          - [<test_name>](#test_name)
          - [<test_name>](#test_name):
              <argument_name>: <argument_value>
              config:
                [<test_config>](/reference/test-configs): <config-value>
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
    config:
      [<source_config>](/reference/source-configs): <config_value>
    tables:
      - name: <table_name>
        config:
          [<source_config>](/reference/source-configs): <config_value>
```

</File>

</TabItem>

<TabItem value="metrics">

<VersionBlock lastVersion="1.2">

We have added support for the `config` property on sources in dbt Core v1.3

</VersionBlock>

<VersionBlock firstVersion="1.3">

<File name='models/<filename>.yml'>

```yml
version: 2

metrics:
  - name: <metric_name>
    config:
      enabled: true | false
```

</File>

</VersionBlock>

</TabItem>

<TabItem value="exposures">

<VersionBlock lastVersion="1.2">

Support for the `config` property on `metrics` was added in dbt Core v1.3

</VersionBlock>

<VersionBlock firstVersion="1.3">

<File name='models/<filename>.yml'>

```yml
version: 2

exposures:
  - name: <exposure_name>
    config:
      enabled: true | false
```

</File>

</VersionBlock>

</TabItem>

<TabItem value="semantic models">

<VersionBlock lastVersion="1.6">

Support for the `config` property on `semantic_models` was added in dbt Core v1.7

</VersionBlock>

<VersionBlock firstVersion="1.7">

<File name='models/<filename>.yml'>

```yml
version: 2

semantic_models:
  - name: <semantic_model_name>
    config:
      enabled: true | false
      group: <string>
      meta: {dictionary}
```

</File>

</VersionBlock>

</TabItem>

</Tabs>

## Definition
The `config` property allows you to configure resources at the same time you're defining properties in YAML files.
