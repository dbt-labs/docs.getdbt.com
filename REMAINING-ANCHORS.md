# Remaining anchor issues (not fixed)

Generated after the anchor-link cleanup. These are NOT stale links: in every case the
heading exists in the source file, but it sits inside a `<VersionBlock>` (or a tab), so it
does not render on the page's default version. The link resolves for a reader who has the
matching version selected, and fails for everyone else.

Fixing these properly means a heading-side change (restructuring the version blocks, or
giving the v2 copy of each heading an explicit `{#id}`), which was out of scope here.

73 links across 44 distinct targets.

## `/reference/commands/cmd-docs#dbt-docs-generate`  (8 links)
Target file: `docs/reference/commands/cmd-docs.md`
- `docs/docs/build/documentation.md:81` - `/reference/commands/cmd-docs#dbt-docs-generate`
- `docs/docs/dbt-versions/dbt-upgrade/01-upgrading-to-v2.md:174` - `/reference/commands/cmd-docs#dbt-docs-generate`
- `docs/guides/duckdb-qs.md:142` - `/reference/commands/cmd-docs#dbt-docs-generate`
- `docs/reference/commands/retry.md:81` - `/reference/commands/cmd-docs#dbt-docs-generate`
- `docs/reference/commands/rpc.md:361` - `cmd-docs#dbt-docs-generate`
- `docs/reference/commands/rpc.md:382` - `cmd-docs#dbt-docs-generate`
- `docs/reference/global-configs/sqlparse.md:50` - `/reference/commands/cmd-docs#dbt-docs-generate`
- `blog/2025-06-16-the-new-dbt-vscode-extension.md:30` - `/reference/commands/cmd-docs#dbt-docs-generate`

## `/reference/commands/cmd-docs#dbt-docs-serve`  (4 links)
Target file: `docs/reference/commands/cmd-docs.md`
- `docs/docs/build/documentation.md:84` - `/reference/commands/cmd-docs#dbt-docs-serve`
- `docs/guides/duckdb-qs.md:143` - `/reference/commands/cmd-docs#dbt-docs-serve`
- `docs/guides/duckdb-qs.md:297` - `/reference/commands/cmd-docs#dbt-docs-serve`
- `blog/2025-06-16-the-new-dbt-vscode-extension.md:30` - `/reference/commands/cmd-docs#dbt-docs-serve`

## `/docs/build/semantic-models#name`  (3 links)
Target file: `docs/docs/build/semantic-models.md`
- `docs/docs/build/semantic-models.md:52` - `#name`
- `docs/docs/build/semantic-models.md:68` - `#name`
- `docs/reference/semantic-model-properties.md:36` - `/docs/build/semantic-models#name`

## `/docs/build/semantic-models#entities`  (3 links)
Target file: `docs/docs/build/semantic-models.md`
- `docs/docs/build/semantic-models.md:56` - `#entities`
- `docs/docs/build/semantic-models.md:70` - `#entities`
- `docs/guides/sl-qs.md:835` - `/docs/build/semantic-models#entities`

## `/docs/build/semantic-models#measures`  (3 links)
Target file: `docs/docs/build/semantic-models.md`
- `docs/docs/build/semantic-models.md:59` - `#measures`
- `docs/docs/build/semantic-models.md:74` - `#measures`
- `docs/guides/sl-qs.md:966` - `/docs/build/semantic-models#measures`

## `/docs/local/connect-data-platform/bigquery-setup#service-account-json`  (3 links)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/local/connect-data-platform/bigquery-setup.md:215` - `#service-account-json`
- `docs/docs/platform/connect-data-platform/connect-bigquery.md:291` - `/docs/local/connect-data-platform/bigquery-setup#service-account-json`
- `snippets/_cloud-environments-info.md:94` - `/docs/local/connect-data-platform/bigquery-setup#service-account-json`

## `/reference/events-logging#info-fields`  (3 links)
Target file: `docs/reference/events-logging.md`
- `docs/reference/dbt-jinja-functions/env_var.md:127` - `/reference/events-logging#info-fields`
- `docs/reference/dbt-jinja-functions/invocation_id.md:12` - `/reference/events-logging#info-fields`
- `docs/reference/dbt-jinja-functions/thread_id.md:14` - `/reference/events-logging#info-fields`

## `/docs/local/connect-data-platform/snowflake-setup#platform_detection_timeout_seconds`  (2 links)
Target file: `docs/docs/local/connect-data-platform/snowflake-setup.md`
- `docs/docs/dbt-versions/2025-release-notes.md:37` - `/docs/local/connect-data-platform/snowflake-setup#platform_detection_timeout_seconds`
- `docs/docs/dbt-versions/dbt-upgrade/05-upgrading-to-v1.10.md:319` - `/docs/local/connect-data-platform/snowflake-setup#platform_detection_timeout_seconds`

## `/docs/local/connect-data-platform/bigquery-setup#job_execution_timeout_seconds`  (2 links)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/dbt-versions/dbt-upgrade/03-upgrading-to-v1.12.md:165` - `/docs/local/connect-data-platform/bigquery-setup#job_execution_timeout_seconds`
- `docs/docs/dbt-versions/release-tracks.md:159` - `/docs/local/connect-data-platform/bigquery-setup#job_execution_timeout_seconds`

## `/docs/local/connect-data-platform/redshift-setup#datasharing`  (2 links)
Target file: `docs/docs/local/connect-data-platform/redshift-setup.md`
- `docs/docs/dbt-versions/dbt-upgrade/04-upgrading-to-v1.11.md:126` - `/docs/local/connect-data-platform/redshift-setup#datasharing`
- `docs/docs/dbt-versions/release-notes.md:223` - `/docs/local/connect-data-platform/redshift-setup#datasharing`

## `/docs/local/connect-data-platform/spark-setup#session`  (2 links)
Target file: `docs/docs/local/connect-data-platform/spark-setup.md`
- `docs/docs/dbt-versions/dbt-upgrade/11-Older versions/15-upgrading-to-v1.1.md:67` - `/docs/local/connect-data-platform/spark-setup#session`
- `docs/docs/local/connect-data-platform/spark-setup.md:235` - `#session`

## `/docs/dbt-versions#eol-version-support`  (2 links)
Target file: `?`
- `docs/docs/dbt-versions/release-tracks.md:142` - `/docs/dbt-versions#eol-version-support`
- `docs/docs/dbt-versions/release-tracks.md:148` - `/docs/dbt-versions#eol-version-support`

## `/docs/local/connect-data-platform/databricks-setup#examples`  (2 links)
Target file: `docs/docs/local/connect-data-platform/databricks-setup.md`
- `docs/docs/local/connect-data-platform/databricks-setup.md:268` - `/docs/local/connect-data-platform/databricks-setup?tokenoauth=token#examples`
- `docs/docs/local/connect-data-platform/databricks-setup.md:268` - `/docs/local/connect-data-platform/databricks-setup?tokenoauth=oauth#examples`

## `/docs/local/connect-data-platform/snowflake-setup#account`  (2 links)
Target file: `docs/docs/local/connect-data-platform/snowflake-setup.md`
- `docs/docs/local/connect-data-platform/snowflake-setup.md:437` - `#account`
- `docs/docs/platform/connect-data-platform/connect-snowflake.md:36` - `/docs/local/connect-data-platform/snowflake-setup#account`

## `/reference/node-selection/yaml-selectors#difference-between---select-and---selector`  (2 links)
Target file: `docs/reference/node-selection/yaml-selectors.md`
- `docs/reference/node-selection/syntax.md:47` - `/reference/node-selection/yaml-selectors#difference-between---select-and---selector`
- `docs/reference/node-selection/syntax.md:147` - `/reference/node-selection/yaml-selectors#difference-between---select-and---selector`

## `/docs/local/connect-data-platform/bigquery-setup#running-python-models-on-dataproc`  (2 links)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/reference/resource-configs/bigquery-configs.md:1170` - `/docs/local/connect-data-platform/bigquery-setup#running-python-models-on-dataproc`
- `docs/reference/resource-configs/bigquery-configs.md:1190` - `/docs/local/connect-data-platform/bigquery-setup#running-python-models-on-dataproc`

## `/docs/build/semantic-models#description`  (1 link)
Target file: `docs/docs/build/semantic-models.md`
- `docs/docs/build/semantic-models.md:53` - `#description`

## `/docs/build/semantic-models#model`  (1 link)
Target file: `docs/docs/build/semantic-models.md`
- `docs/docs/build/semantic-models.md:54` - `#model`

## `/docs/build/semantic-models#defaults`  (1 link)
Target file: `docs/docs/build/semantic-models.md`
- `docs/docs/build/semantic-models.md:55` - `#defaults`

## `/docs/local/connect-data-platform/bigquery-setup#execution-project`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/dbt-versions/2024-release-notes.md:41` - `/docs/local/connect-data-platform/bigquery-setup#execution-project`

## `/docs/platform/manage-access/scim#set-up-scim`  (1 link)
Target file: `docs/docs/platform/manage-access/scim.md`
- `docs/docs/dbt-versions/2025-release-notes.md:111` - `/docs/platform/manage-access/scim#set-up-scim`

## `/docs/local/connect-data-platform/bigquery-setup#job_link_info_level_log`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/dbt-versions/dbt-upgrade/03-upgrading-to-v1.12.md:164` - `/docs/local/connect-data-platform/bigquery-setup#job_link_info_level_log`

## `/docs/local/connect-data-platform/bigquery-setup#timeouts-and-retries`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/dbt-versions/dbt-upgrade/05-upgrading-to-v1.10.md:324` - `/docs/local/connect-data-platform/bigquery-setup#timeouts-and-retries`

## `/docs/dbt/dbt-availability#adapter-lifecycle`  (1 link)
Target file: `docs/docs/dbt/dbt-availability.md`
- `docs/docs/dbt-versions/release-notes.md:137` - `/docs/dbt/dbt-availability?version=2.0#adapter-lifecycle`

## `/docs/dbt-ai/about-mcp#product-docs`  (1 link)
Target file: `docs/docs/dbt-ai/about-mcp.md`
- `docs/docs/dbt-versions/release-notes.md:240` - `/docs/dbt-ai/about-mcp?version=2.0#product-docs`

## `/docs/local/install-dbt#upgrade`  (1 link)
Target file: `docs/docs/local/install-dbt.md`
- `docs/docs/deploy/hybrid-setup.md:112` - `/docs/local/install-dbt?version=1#upgrade`

## `/docs/local/connect-data-platform/bigquery-setup#oauth-via-gcloud`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/local/connect-data-platform/bigquery-setup.md:212` - `#oauth-via-gcloud`

## `/docs/local/connect-data-platform/bigquery-setup#oauth-token-based`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/local/connect-data-platform/bigquery-setup.md:213` - `#oauth-token-based`

## `/docs/local/connect-data-platform/bigquery-setup#service-account-file`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/local/connect-data-platform/bigquery-setup.md:214` - `#service-account-file`

## `/docs/local/connect-data-platform/bigquery-setup#optional-configurations`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/local/connect-data-platform/bigquery-setup.md:223` - `#optional-configurations`

## `/docs/local/connect-data-platform/bigquery-setup#dataproc-serverless`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/local/connect-data-platform/bigquery-setup.md:757` - `/docs/local/connect-data-platform/bigquery-setup#dataproc-serverless`

## `/docs/local/connect-data-platform/bigquery-setup#dataproc-cluster`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/local/connect-data-platform/bigquery-setup.md:758` - `/docs/local/connect-data-platform/bigquery-setup#dataproc-cluster`

## `/docs/local/connect-data-platform/bigquery-setup#bigframes`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/docs/local/connect-data-platform/bigquery-setup.md:759` - `/docs/local/connect-data-platform/bigquery-setup#bigframes`

## `/docs/local/connect-data-platform/snowflake-setup#client_session_keep_alive`  (1 link)
Target file: `docs/docs/local/connect-data-platform/snowflake-setup.md`
- `docs/docs/local/connect-data-platform/snowflake-setup.md:443` - `#client_session_keep_alive`

## `/docs/local/connect-data-platform/spark-setup#odbc`  (1 link)
Target file: `docs/docs/local/connect-data-platform/spark-setup.md`
- `docs/docs/local/connect-data-platform/spark-setup.md:230` - `#odbc`

## `/docs/local/connect-data-platform/spark-setup#thrift`  (1 link)
Target file: `docs/docs/local/connect-data-platform/spark-setup.md`
- `docs/docs/local/connect-data-platform/spark-setup.md:231` - `#thrift`

## `/docs/local/connect-data-platform/spark-setup#http`  (1 link)
Target file: `docs/docs/local/connect-data-platform/spark-setup.md`
- `docs/docs/local/connect-data-platform/spark-setup.md:232` - `#http`

## `/docs/local/install-dbt#install-your-adapter`  (1 link)
Target file: `docs/docs/local/install-dbt.md`
- `docs/faqs/Core/install-pip-best-practices.md:18` - `/docs/local/install-dbt?version=1#install-your-adapter`

## `/docs/dbt-versions#minor-versions`  (1 link)
Target file: `?`
- `docs/faqs/Core/install-python-compatibility.md:10` - `/docs/dbt-versions#minor-versions`

## `/docs/local/connect-data-platform/databricks-setup#supported-functionality`  (1 link)
Target file: `docs/docs/local/connect-data-platform/databricks-setup.md`
- `docs/guides/migrate-from-spark-to-databricks.md:41` - `/docs/local/connect-data-platform/databricks-setup#supported-functionality`

## `/guides/sl-qs#measures`  (1 link)
Target file: `docs/guides/sl-qs.md`
- `docs/guides/sl-qs.md:819` - `#measures`

## `/reference/dbt-jinja-functions/cross-database-macros#cross-database-macros`  (1 link)
Target file: `docs/reference/dbt-jinja-functions/cross-database-macros.md`
- `docs/reference/dbt-jinja-functions/cross-database-macros.md:21` - `#cross-database-macros`

## `/docs/local/connect-data-platform/bigquery-setup#reservation`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `docs/reference/resource-configs/bigquery-configs.md:313` - `/docs/local/connect-data-platform/bigquery-setup?version=1.12#reservation`

## `/docs/local/connect-data-platform/bigquery-setup#required-permissions`  (1 link)
Target file: `docs/docs/local/connect-data-platform/bigquery-setup.md`
- `snippets/_fusion-dwh-platform.md:6` - `/docs/local/connect-data-platform/bigquery-setup#required-permissions`
