---
title: One of my tests failed, how can I debug it?
description: "You can debug failed tests by finding the SQL"
sidebar_label: 'Debug failed tests'
id: failed-tests

---

To debug a failing test, find the SQL that dbt ran, run it in a query editor, and inspect the rows that failed.

<Tabs
  defaultValue="core"
  values={[
    { label: 'dbt Core', value: 'core' },
    { label: 'Job runs (Fusion)', value: 'fusion' },
    { label: 'Studio IDE', value: 'platform-ide' },
  ]}
>

<TabItem value="core">

If you ran `dbt test` locally with <Constant name="core" />:

1. In your terminal, locate the failed test in the `dbt test` output.
2. Find the line that includes `compiled code at` followed by a file path, for example `target/compiled/<project>/models/schema.yml/unique_my_model_id.sql`.
3. Open that file from your project directory, or print its contents with `cat` and the file path.
4. Copy the SQL from the file.
5. Paste the SQL into your warehouse query tool and run it to see the records that failed.

```text
[ERROR]: in test unique_my_model_id (models/schema.yml)
  Got 1 result, configured to fail if != 0
  compiled code at target/compiled/dbt_test_debug/models/schema.yml/unique_my_model_id.sql
```

</TabItem>

<TabItem value="fusion">

If the test failed during a scheduled or deployed job on the <Constant name="fusion_engine" />:

1. Click **Orchestration** in the top navigation.
2. Click **Runs**.
3. Select the failed run from the list. The **Run summary** tab opens.
4. In the run steps list, select the **Invoke dbt** step that ran `dbt test`.
5. Click **Failure** to filter to the failed test.
6. Click the failed test name to expand its log output.
7. Turn on the **Debug logs** toggle.
8. If the log output is truncated, click **Download** → **Download all debug logs**, then search the file for the test name or `select`.
9. Copy the compiled `select` statement from the log output.
10. Paste the SQL into a query editor (in <Constant name="dbt" />, you can use a **Statement**) and run it to see the records that failed.

<Lightbox src="/img/docs/dbt-platform/deployment/debug-failed-test-fusion.png" width="90%" title="Find a failed test in Fusion job run logs." />

For more on job run logs, refer to [Run visibility](/docs/deploy/run-visibility).

</TabItem>

<TabItem value="platform-ide">

If you ran `dbt test` in the <Constant name="studio_ide" />:

1. Click the `^` icon next to the command bar to open the **Invocation history** drawer.
2. In the invocation list, select the failed `dbt test` run.
3. Click the **Error** tab to filter to the failed test.
4. Click the failed test name to expand its log output.
5. Turn on the **Debug logs** toggle.
6. Find the compiled `select` statement in the log output.
7. Copy the SQL from the log output.
8. Paste the SQL into a new **Statement** and run it to see the records that failed.

<Lightbox src="/img/docs/dbt-platform/platform-ide/debug-failed-test-ide.png" width="90%" title="Find compiled test SQL in the Studio IDE invocation history with Debug logs enabled." />

</TabItem>

</Tabs>
