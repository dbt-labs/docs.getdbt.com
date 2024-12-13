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

You can apply access modifiers in config files, including the `dbt_project.yml`, or to models one-by-one in `properties.yml`. Applying access configs to a subfolder modifies the default for all models in that subfolder, so make sure you intend for this behavior. When setting individual model access, a group or subfolder might contain a variety of access levels, so when you designate a model with `access: public` make sure you intend for this behavior.

There are multiple approaches to configuring access:

- In `properties.yml` using the older method: 

  <File name='models/properties_my_public_model.yml'>
  
  ```yml
  version: 2
  
  models:
    - name: my_public_model
      access: public # Older method, still supported
      
  ```
  </File>
  
- In `properties.yml` using the new method (for v1.7 or higher). Use either the older method or the new method, but not both for the same model:

  <File name='models/properties_my_public_model.yml'>
  
  ```yml
  version: 2
  
  models:
    - name: my_public_model
      config:
        access: public # newly supported in v1.7
      
  ```
  </File>


- In `dbt_project.yml`:

  <File name='dbt_project.yml'>
  
  ```yml
  models:
    my_project_name:
      subfolder_name:
        +group: my_group
        +access: private  # sets default for all models in this subfolder
  ```
  </File>

- In the `my_public_model.sql` file:

  <File name='models/my_public_model.sql'>
  
  ```sql
  -- models/my_public_model.sql
  
  {{ config(access = "public") }}
  
  select ...
  ```
  </File>

After you define `access`, rerun a production job to apply the change. 

## Definition
The access level of the model you are declaring properties for.

Some models (not all) are designed to be referenced through the [ref](/reference/dbt-jinja-functions/ref) function across [groups](/docs/build/groups).

| Access    | Referenceable by              |
|-----------|-------------------------------|
| private   | Same group                    |
| protected | Same project/package          |
| public    | Any group, package, or project. When defined, rerun a production job to apply the change. |

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
