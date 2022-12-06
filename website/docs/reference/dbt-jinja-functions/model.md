---
title: "model"
id: "model"
---

`model` is the dbt [graph object](graph) (or node) for the current model. It can be used to:
- Access `config` settings, say, in a post-hook
- Access the path to the model

For example:
```jinja
{% if model.config.materialization = 'view' %}
  {{ log(model.name ~ " is a view.", info=True) }}
{% endif %}
```

To see the contents of `model` for a given model, you can use [log()](/reference/dbt-jinja-functions/log)
to print the full contents:

```jinja
{{ log(model, info=True) }}
```
