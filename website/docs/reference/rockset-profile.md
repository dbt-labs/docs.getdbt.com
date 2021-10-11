---
title: "Rockset Profile"
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

## Overview of dbt-rockset

**Maintained by:** Rockset, Inc.      
**Source:** https://github.com/rockset/dbt-rockset
**Core version:** v0.0.3 and newer    

The easiest way to install is to use pip:

    pip install dbt-rockset

## Connecting to Rockset with **dbt-rockset**

The dbt profile for Rockset is very simple and contains the following fields:

<File name='profiles.yml'>

```yaml
rockset:
  target: dev
  outputs:
    dev:
      type: rockset
      workspace: [schema]
      api_key: [api_key]
      api_server: [api_server] # (Default is api.rs2.usw2.rockset.com)
```

</File>

### Materializations

Type | Supported? | Details
-----|------------|----------------
view | YES | Creates a [view](https://rockset.com/docs/views/#gatsby-focus-wrapper).
table | YES | Creates a [collection](https://rockset.com/docs/collections/#gatsby-focus-wrapper).
ephemeral | YES | Executes queries using CTEs.
incremental | YES | Creates a [collection](https://rockset.com/docs/collections/#gatsby-focus-wrapper) if it doesn't exist, and then writes results to it.
