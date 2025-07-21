---
title: "Environment variable configs"
id: "environment-variable-configs"
sidebar: "Environment variable configs"
---

Environment variables contain a `DBT_` prefix. For a list of all dbt environment variables you can set, refer to [Available flags](/reference/global-configs/about-global-configs#available-flags).

<File name='Env var'>

```text

$ export DBT_<THIS-CONFIG>=True
dbt run

```

</File>

For more detailed information, read our [environment variables page](/docs/build/environment-variables).

## Config precedence

import SettingFlags from '/snippets/_setting-flags.md';

<SettingFlags />
