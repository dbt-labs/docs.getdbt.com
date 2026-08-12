## Feature availability

The dbt VS Code extension is free to install. All features work for 14 days with no login; after that, the vast majority keep working, and a few advanced features need a free <Constant name="dbt_platform" /> account (sign in or register with your email, or run `dbt login`).

| Feature | Works without login/registration | Register or login <br /><small>Any dbt platform account, free or paid</small>|
|---------|:-------------------:|:----------------------:|
| Error diagnostics for Jinja, YAML, and SQL syntax | ✅ | ✅ |
| Jinja <Term id="lsp" /> go-to ref, source, and macro | ✅ | ✅ |
| Linter warning diagnostics | ✅ | ✅ |
| Table-level lineage | ✅ | ✅ |
| Basic dbt command UI (run, build, test, and query results) | ✅ | ✅ |
| Ref autocomplete | ✅ | ✅ |
| Refactor ref and column names | ✅ | ✅ |
| Dialect-aware function autocomplete | ✅ | ✅ |
| SQL type and schema error diagnostics | - | ✅ |
| Preview CTE | - | ✅ |
| Query cache for faster incremental compiles | - | ✅ |
| Model docs tab with platform metadata | - | ✅ |
| Column-level lineage | - | ✅ |
| Compare changes| - | ✅ |
| SQL <Term id="lsp" /> go-to column and CTE | - | ✅ |
| SQL <Term id="lsp" /> hover to see the schema for `select *` | - | ✅ |

