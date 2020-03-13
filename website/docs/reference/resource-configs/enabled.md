---
resource_types: all
datatype: boolean
default_value: true
---

## Definition
An optional configuration for disabling models, seeds, and snapshots.

* Default: true

When a resource is disabled, dbt will not consider it as part of your project. Note that this can cause compilation errors.

If you instead want to exclude a model from a particular run, consider using the `--exclude` parameter as part of the [model selection syntax](docs/running-a-dbt-project/command-line-interface/model-selection-syntax.md)

If you are disabling models because they are no longer being used, but you want to version control their SQL, consider making them an [analysis](docs/building-a-dbt-project/analyses.md) instead.

## Examples
### Disable a model in a package in order to use your own version of the model.
This could be useful if you want to change the logic of a model in a package. For example, if you need to change the logic in the `segment_web_page_views` from the `segment` package ([original model](https://github.com/fishtown-analytics/segment/blob/master/models/base/segment_web_page_views.sql)):
1. Add a model named `segment_web_page_views` the same name to your own project.
2. To avoid a compilation error due to duplicate models, disable the segment package's version of the model like so:

<File name='dbt_project.yml'>

```yml
models:
  segment:
    base:
      segment_web_page_views:
        enabled: false
```

</File>
