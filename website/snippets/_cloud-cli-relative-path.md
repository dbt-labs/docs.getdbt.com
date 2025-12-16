The <Constant name="cloud_cli" /> doesn't currently support relative paths in the [`packages.yml` file](/docs/build/packages). Instead, use the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), which supports relative paths in this scenario.

Here's an example of a [local package](/docs/build/packages#local-packages) configuration in the `packages.yml` that won't work with the <Constant name="cloud_cli" />:

```yaml
# repository_root/my_dbt_project_in_a_subdirectory/packages.yml

packages:
  - local: ../shared_macros
```

In this example, `../shared_macros` is a relative path that tells dbt to look for:
- `..` &mdash; Go one directory up (to `repository_root`).
- `/shared_macros` &mdash; Find the `shared_macros` folder in the root directory.

To work around this limitation, use the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio), which fully supports relative paths in `packages.yml`.
