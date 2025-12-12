To determine if a package is compatible with the <Constant name="fusion_engine" />, visit the [dbt package hub](https://hub.getdbt.com/) and review the package's [`require-dbt-version` configuration](/reference/project-configs/require-dbt-version#pin-to-a-range).

- Packages with a `require-dbt-version` that equals or contains `2.0.0` are compatible with <Constant name="fusion" />. For example, `require-dbt-version: ">=1.10.0,<3.0.0"`.

    Even if a package doesn't reflect compatibility in the package hub, it may still work with <Constant name="fusion" />. Work with package maintainers to track updates, and [thoroughly test packages](https://docs.getdbt.com/guides/fusion-package-compat?step=5) that aren't clearly compatible before deploying.

- Package maintainers who would like to make their package compatible with <Constant name="fusion" /> can refer to the [Fusion package upgrade guide](/guides/fusion-package-compat) for instructions.

Fivetran package considerations:

- The Fivetran `source` and `transformation` packages have been combined into a single package.
- If you manually installed source packages like `fivetran/github_source`, you need to ensure `fivetran/github` is installed and deactivate the transformation models.

import FusionPackageCompatibility from '/snippets/_fusion-package-compatibility.md';

<FusionPackageCompatibility />
