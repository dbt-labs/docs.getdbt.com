| Parameter | Type | Default | Description |
| :-------- | :--- | :------ | :---------- |
| `python_version` | `<string>` | `3.10` | Python version the Snowpark model runs on. |
| `packages` | `<list>` | `[]` | Anaconda packages to install when the model runs. dbt always adds `snowflake-snowpark-python`. |
| `imports` | `<list>` | `[]` | Staged files, such as zip files, to make available to your model. Refer to [Third-party Snowflake packages](/reference/resource-configs/snowflake-configs#third-party-snowflake-packages). |
| `external_access_integrations` | `<list>` | `[]` | Snowflake external access integrations that let your model reach external APIs. |
| `secrets` | `<dictionary>` | `{}` | Maps a variable name in your code to a Snowflake secret. Use it with `external_access_integrations`. |
| `use_anonymous_sproc` | `<boolean>` | `True` | When `True`, dbt runs your model as an anonymous stored procedure. When `False`, dbt creates a named procedure (`<model_name>__dbt_sp`), calls it, then drops it. |
