<!--remove when the deprecation warnings are updated to match `dbt-autofix`'s enhanced compatibility detection-->

#### Package compatibility messages

:::info Inconsistent Fusion warnings and `dbt-autofix` logs
<Constant name="fusion" /> warnings and `dbt-autofix` logs may show different messages about package compatibility.
:::

If you use [`dbt-autofix`](https://github.com/dbt-labs/dbt-autofix) while upgrading to <Constant name="fusion" /> in the <Constant name="cloud_ide" /> or dbt VS Code extension, you may see different messages about package compatibility between `dbt-autofix` and <Constant name="fusion" /> warnings. 

Here's why:
- <Constant name="fusion" /> warnings are emitted based on a package's `require-dbt-version` and whether `require-dbt-version` contains `2.0.0`.
- Some packages are already <Constant name="fusion" />-compatible even though package maintainers haven't yet updated `require-dbt-version`.
- `dbt-autofix` knows about these compatible packages and will not try to upgrade a package that it knows is already compatible.

This means that even if you see a <Constant name="fusion"/> warning for a package that `dbt-autofix` identifies as compatible, you don't need to change the package. 

The message discrepancy is temporary while we implement and roll out `dbt-autofix`'s enhanced compatibility detection to <Constant name="fusion" /> warnings. 

Here's an example of a <Constant name="fusion" /> warning in the <Constant name="cloud_ide" /> that says a package isn't compatible with <Constant name="fusion" /> but `dbt-autofix` indicates it is compatible:
```text
dbt1065: Package 'dbt_utils' requires dbt version [>=1.30,<2.0.0], but current version is 2.0.0-preview.72. This package may not be compatible with your dbt version. dbt(1065) [Ln 1, Col 1]
```
