---
title: How can I see the SQL that dbt is running?
description: "Review logs to check the SQL dbt is running"
sidebar_label: 'Reviewing SQL that dbt runs'
id: checking-logs

---

To review the SQL that dbt runs, find the compiled SQL for the model, test, or other resource you want to inspect.

<Tabs
  defaultValue="core"
  values={[
    { label: 'dbt Core', value: 'core' },
    { label: 'Job runs (Fusion)', value: 'fusion' },
    { label: 'Studio IDE', value: 'platform-ide' },
  ]}
>

<TabItem value="core">

If you ran a dbt command locally with <Constant name="core" />:

1. Check the terminal output. When a resource fails, dbt prints a `compiled code at` line with the file path to the compiled SQL.
2. Open the file at that path from your project directory, or print its contents with `cat` and the file path.
3. If you need to browse manually, look in these directories:
    * `target/compiled/` for compiled `select` statements (for example, models and data tests)
    * `target/run/` for compiled `create` statements (for example, the SQL dbt executed to build a model)
4. For verbose logging of all queries dbt runs, open `logs/dbt.log`.

```text
compiled code at target/compiled/<project>/models/<model_name>.sql
```

</TabItem>

<TabItem value="fusion">

If the command ran during a scheduled or deployed job on the <Constant name="fusion_engine" />:

1. Click **Orchestration** in the top navigation.
2. Click **Runs**.
3. Select the run from the list. The **Run summary** tab opens.
4. In the run steps list, select the **Invoke dbt** step for the command you want to inspect (for example, `dbt run` or `dbt test`).
5. Click the resource name (for example, a model or test) to expand its log output. Use the status filters (for example, **Success** or **Failure**) to narrow the list if needed.
6. Turn on the **Debug logs** toggle.
7. If the log output is truncated, click **Download** → **Download all debug logs**, then search the file for the resource name or `select`.
8. Find the compiled SQL in the log output.

For more on job run logs, refer to [Run visibility](/docs/deploy/run-visibility).

If a data test failed and you want to inspect the failing records, refer to [Debug failed tests](/faqs/Runs/failed-tests).

</TabItem>

<TabItem value="platform-ide">

If you ran a dbt command in the <Constant name="studio_ide" />:

1. Click the `^` icon next to the command bar to open the **Invocation history** drawer.
2. In the invocation list, select the dbt command you want to inspect (for example, `dbt run` or `dbt test`).
3. Click the resource name (for example, a model or test) to expand its log output. Use the status tabs (for example, **Pass** or **Error**) to filter the list if needed.
4. Turn on the **Debug logs** toggle.
5. Find the compiled SQL in the log output.

If a data test failed and you want to inspect the failing records, refer to [Debug failed tests](/faqs/Runs/failed-tests).

</TabItem>

</Tabs>
