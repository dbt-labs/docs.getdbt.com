## Feature availability

The dbt VS Code extension is free to install, and its editor features are available to all users. What's available depends on your project's [static analysis](/docs/build/about-static-analysis) mode rather than your account:

| Feature | Availability |
|---------|--------------|
| Error diagnostics for Jinja, YAML, and SQL syntax | All users |
| Jinja <Term id="lsp" /> go-to ref, source, and macro | All users |
| Linter warning diagnostics | All users |
| Table-level lineage | All users |
| Basic dbt command UI (run, build, test, and query results) | All users |
| Ref autocomplete | All users |
| Refactor ref names | All users |
| Dialect-aware function autocomplete | All users |
| Query cache for faster incremental compiles | All users |
| Preview CTE | `baseline` (the default) or `strict` |
| SQL type and schema error diagnostics | `static_analysis: strict` |
| Refactor column names | `static_analysis: strict` |
| Column-level lineage | `static_analysis: strict` |
| SQL <Term id="lsp" /> go-to column and CTE | `static_analysis: strict` |
| SQL <Term id="lsp" /> hover to see the schema for `select *` | `static_analysis: strict` |

A few capabilities read data from your <Constant name="dbt_platform" /> account and need you to [sign in](/docs/sign-in-dbt-extension) so the extension can reach it:

| Feature | Why it needs a <Constant name="dbt_platform" /> account |
|---------|--------------------------------------------------------|
| Model docs tab with platform metadata | Reads build status, descriptions, and test results from your <Constant name="dbt_platform" /> account. |
| [Compare changes](/docs/dbt/vs-compare-changes) with <Constant name="dbt_platform" /> deferral | Fetches the deferred manifest from your <Constant name="dbt_platform" /> environment. You can also point it at a local `manifest.json` instead, with no account. |
