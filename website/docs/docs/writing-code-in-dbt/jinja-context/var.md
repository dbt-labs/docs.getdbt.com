---
title: "var"
id: "var"
---

Variables can be passed from your `dbt_project.yml` file into models during compilation.
These variables are useful for configuring packages for deployment in multiple environments, or defining values that should be used across multiple models within a package.

To add a variable to a model, use the `var()` function:

<File name='my_model.sql'>

```sql
select * from events where event_type = '{{ var("event_type") }}'
```

</File>

If you try to run this model without supplying an `event_type` variable, you'll receive
a compilation error that looks like this:

```
Encountered an error:
! Compilation error while compiling model package_name.my_model:
! Required var 'event_type' not found in config:
Vars supplied to package_name.my_model = {
}
```

To supply a variable to a given model, add one or more `vars` dictionaries to the `models`
config in your `dbt_project.yml` file. These `vars` are in-scope for all models at or below
where they are defined, so place them where they make the most sense. Below are three different
placements of the `vars` dict, all of which will make the `my_model` model compile.

<File name='dbt_project.yml'>

```yaml
# 1) scoped at the model level
models:
  package_name:
    my_model:
      materialized: view
      vars:
        event_type: activation

# 2) scoped at the package level
models:
  package_name:
    vars:
      event_type: activation
    my_model:
      materialized: view

# 3) scoped globally
models:
  vars:
    event_type: activation
  package_name:
    my_model:
      materialized: view
```

</File>

### Variable default values

The `var()` function takes an optional second argument, `default`. If this argument is provided, then it will be the default value for the variable if one is not explicitly defined.

<File name='my_model.sql'>

```sql
-- Use 'activation' as the event_type if the variable is not defined.
select * from events where event_type = '{{ var("event_type", "activation") }}'
```

</File>
