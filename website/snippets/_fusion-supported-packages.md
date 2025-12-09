To determine if a package is compatible with the <Constant name="fusion_engine" />, visit the [dbt package hub](https://hub.getdbt.com/) and review the package's [`require-dbt-version` configuration](/reference/project-configs/require-dbt-version#pin-to-a-range). 

Even if a package doesn't reflect compatibility in the package hub, it may still work with Fusion.  Work with package maintainers to track updates, and thoroughly test packages that aren't clearly compatible before deploying.
- Packages with a `require-dbt-version` that equals or contains `2.0.0` are compatible with <Constant name="fusion"/>. For example, `require-dbt-version: ">=1.10.0,<3.0.0"`
- The Fivetran `source` and `transformation` packages have been combined into a single package. If you manually installed source packages like `fivetran/github_source`, you need to ensure `fivetran/github` is installed and deactivate the transformation models.
- Package maintainers who would like to make their package compatible with <Constant name="fusion"/> can refer to the [Fusion package upgrade guide](/guides/fusion-package-compat) for instructions.
