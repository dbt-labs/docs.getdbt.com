---
title: Why am I receiving a Runtime Error in my packages?
description: "Update dbt_utils package in packages.yml file"
sidebar_label: 'Runtime error in packages.yml file'
id: runtime-packages.yml

---

If you're receiving the runtime error below in your packages.yml folder, it may be due to an old version of your dbt_utils package that isn't compatible with your current dbt Cloud version.

```shell
Running with dbt=xxx
Runtime Error
  Failed to read package: Runtime Error
    Invalid config version: 1, expected 2  
  Error encountered in dbt_utils/dbt_project.yml
  ```

Try updating the old version of the dbt_utils package in your packages.yml to the latest version found in the [dbt hub](https://hub.getdbt.com/dbt-labs/dbt_utils/latest/):

```shell
packages:
- package: dbt-labs/dbt_utils

version: xxx
```

If you've tried the workaround above and are still experiencing this behavior - reach out to the Support team at support@getdbt.com and we'll be happy to help!
