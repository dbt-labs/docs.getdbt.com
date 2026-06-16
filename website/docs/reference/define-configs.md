---
title: Define configs
sidebar_label: Define configs
intro_text: "Learn how to define configurations for your resources in a dbt project"
description: "Learn how to define configurations for your resources in a dbt project"
pagination_previous: "reference/configs-and-properties"
pagination_next: "reference/define-properties"
---

Depending on the resource type, you can define configurations in a dbt project and also in an installed package by:

<VersionBlock firstVersion="1.9">

1. Using a [`config` property](/reference/resource-properties/config) in a `.yml` file for supported resource directories like `models/`, `snapshots/`, `seeds/`, `analyses`, `tests/`, and more.
2. From the [`dbt_project.yml` file](dbt_project.yml), under the corresponding resource key (`models:`, `snapshots:`, `data_tests:`, and so on)
</VersionBlock>


## Config inheritance

The most specific config always takes precedence. This generally follows the order above: an in-file `config()` block --> properties defined in a `.yml` file --> config defined in the project file. 

Note - Generic data tests work a little differently when it comes to specificity. See [test configs](/reference/data-test-configs).

Within the project file, configurations are also applied hierarchically. The most specific config always takes precedence. In the project file, for example, configurations applied to a `marketing` subdirectory will take precedence over configurations applied to the entire `jaffle_shop` project. To apply a configuration to a model or directory of models, define the [resource path](/reference/resource-configs/resource-path) as nested dictionary keys.

Configurations in your root dbt project have _higher_ precedence than configurations in installed packages. This enables you to override the configurations of installed packages, providing more control over your dbt runs. 

## Combining configs

Most configurations are "clobbered"  when applied hierarchically. Whenever a more specific value is available, it will completely replace the less specific value. Note that a few configs have different merge behavior:
- [`tags`](/reference/resource-configs/tags) are additive. If a model has some tags configured in `dbt_project.yml`, and more tags are applied in its `.sql` file, the final set of tags will include all of them.
- When using the [`freshness`](/reference/resource-configs/freshness) config, a more specific key-value pair replaces a less specific value with the same key.
- [`pre-hook` and `post-hook`](/reference/resource-configs/pre-hook-post-hook) are also additive.
- [`meta`](/reference/resource-configs/meta) dictionaries are **shallow-merged**, meaning dbt merges only the top-level keys and does not look inside nested dictionaries. When the same top-level key appears at more than one level, the more specific value replaces the less specific one entirely — even if that value is itself a dictionary. Top-level keys that appear at only one level are kept.
  For example, if `dbt_project.yml` sets:
  ```yaml
  +meta: {owner: "alice", dagster: {automation_condition: "eager"}}
  ```
 
  and a model sets:
  ```yaml
  meta: {dagster: {asset_key: "my_key"}}
  ```
 
  the result is:
  ```yaml
  {owner: "alice", dagster: {asset_key: "my_key"}}
  ```
 
  `owner` is kept because it appears at only one level. `dagster` appears at both levels, so the more specific value replaces it as a whole — and because the merge never looks inside `dagster`, the nested `automation_condition` is lost.  A deep (recursive) merge would instead combine the nested keys, producing `dagster: {automation_condition: "eager", asset_key: "my_key"}`. `meta` doen't do this &mdash; nested dictionaries are replaced, not merged.

### Which config wins across levels
For clobbering and merging configurations that are inherited from multiple levels, the general rules are:
    - Node-level configs (more specific) clobber project-level configs (less specific).
    - For sources, table-level configs (more specific) clobber source-level configs (less specific).
    - The root project's configuration in `dbt_project.yml` clobbers configuration within package files. This is so that users can control the behavior of packages they are installing using `dbt deps` without needing to edit the code in those package files directly.

## The `+` prefix

import PlusPrefix from '/snippets/_plus-prefix.md';

<PlusPrefix />


import Example from '/snippets/_configs-properties.md'  ;

<Example />
