---
resource_types: [models]
datatype: access
---

<File name='models/<schema>.yml'>

```yml
version: 2

models:
  - name: model_name
    access: private | protected | public
```

</File>

<VersionBlock lastVersion="1.6">

Access modifiers may be applied to models one-by-one in YAML properties. In v1.5 and v1.6, it is not possible to configure `access` for multiple models at once. Upgrade to v1.7 for additional configuration options. A group or subfolder contains models with a variety of access levels, and designating a model with `access: public` should always be a conscious and intentional choice.

</VersionBlock>

<VersionBlock firstVersion="1.7">

Access modifiers can be applied in config files, including `the dbt_project.yml`, or to models one-by-one in YAML properties. Apply access configs to a subfolder, and it will configure the default for all models in that subfolder. When setting individual model access, a group or subfolder might contain a variety of access levels, and designating a model with `access: public` should always be a conscious and intentional choice.

There are multiple approaches to configuring access:

In the model configs of `dbt_project.yml``: 

```yaml
models:
  - name: my_public_model
    access: public # Older method, still supported
    
```
Or (but not both)

```yaml
models:
  - name: my_public_model
    config:
      access: public # newly supported in v1.7
    
```

In a subfolder: 
```yaml
models:
  my_project_name:
    subfolder_name:
      +group: <my_group>
      +access: private  # sets default for all models in this subfolder
```

In the model.sql file:

```sql
-- models/my_public_model.sql

{{ config(access = "public") }}

select ...
```

</VersionBlock>

## Definition
The access level of the model you are declaring properties for.

Some models (not all) are designed to be referenced through the [ref](/reference/dbt-jinja-functions/ref) function across [groups](/docs/build/groups).

| Access    | Referenceable by              |
|-----------|-------------------------------|
| private   | same group                    |
| protected | same project/package          |
| public    | any group, package or project |

If you try to reference a model outside of its supported access, you will see an error:

```shell
dbt run -s marketing_model
...
dbt.exceptions.DbtReferenceError: Parsing Error
  Node model.jaffle_shop.marketing_model attempted to reference node model.jaffle_shop.finance_model, 
  which is not allowed because the referenced node is private to the finance group.
```

## Default

By default, all models are "protected." This means that other models in the same project can reference them.

## Related docs

* [Model Access](/docs/collaborate/govern/model-access#groups)
* [Group configuration](/reference/resource-configs/group)
