---
title: What other model configurations are there?
---
You can also configure:
* [tags](https://docs.getdbt.com/docs/tags) to support easy categorization
and graph selection
* [custom schemas](https://docs.getdbt.com/docs/using-custom-schemas) to split
your models across multiple schemas
* [aliases](https://docs.getdbt.com/docs/using-custom-aliases) if your view/table
name should differ from the filename
* Snippets of SQL to run at the start or end of a model, known as [hooks](https://docs.getdbt.com/docs/hooks)
* Warehouse-specific configurations for performance (e.g. `sort` and `dist` keys
on Redshift, `partitions` on BigQuery)

Check out the docs on [models](https://docs.getdbt.com/docs/building-models) to
learn more.
