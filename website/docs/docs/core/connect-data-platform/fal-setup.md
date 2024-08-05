---
title: "fal setup (Python models)"
description: "Read this guide to learn about the fal warehouse setup in dbt."
meta:
  maintained_by: fal.ai
  authors: 'Features & Labels'
  github_repo: 'fal-ai/fal'
  pypi_package: 'dbt-fal'
  min_core_version: 'v1.3.0'
  max_core_version: 'v1.5.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#tools-fal'
  slack_channel_link: 'https://getdbt.slack.com/archives/C02V8QW3Q4Q'
  platform_name: 'fal'
  config_page: '/reference/resource-configs/fal-configs'
---

:::info Adapter no longer maintained
The [`dbt-fal` adapter](https://github.com/fal-ai/dbt-fal) is no longer actively maintained. This means although the adapter is still operational, there is no further development or bug fixes planned and it may not be compatible with future versions of dbt. `dbt-fal` was test until dbt v1.5.

Documentation for `dbt-fal` are kept for reference purposes only and will eventually be removed from the site in the future.
:::

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Setting up fal with other adapter

[fal](http://github.com/fal-ai/fal) offers a Python runtime independent from what database you are using and integrates seamlessly with dbt. It works by downloading the data as a Pandas DataFrame, transforming it in a local Python runtime and uploading it to the database. The only configuration change you need to do is adding it to the `profiles.yml` and setting the `db_profile` property as the database profile you are already using.

It will run all the SQL dbt models with the main adapter you specified in your `profiles.yml` and all the Python models are executed by the fal adapter.

Example:

<File name='profiles.yml'>

```yaml
jaffle_shop:
  target: dev_with_fal
  outputs:
    dev_with_fal:
      type: fal
      db_profile: dev_pg # This points to your main adapter
    dev_pg:
      type: postgres
      ...
```

</File>
