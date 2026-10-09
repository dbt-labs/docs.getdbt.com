
## Use cases

The following setup will work for every dbt project:

- Add [any package dependencies](/docs/mesh/govern/project-dependencies#when-to-use-project-dependencies) to `packages.yml`
- Add [any project dependencies](/docs/mesh/govern/project-dependencies#when-to-use-package-dependencies) to `dependencies.yml`

However, you may be able to consolidate both into a single `dependencies.yml` file. Read the following section to learn more.

#### About packages.yml and dependencies.yml
The `dependencies.yml` file can contain both types of dependencies: "package" and "project" dependencies.
- [Package dependencies](/docs/build/packages#how-do-i-add-a-package-to-my-project) lets you add source code from someone else's dbt project into your own, like a library.
- Project dependencies provide a different way to build on top of someone else's work in dbt.
- For private Git packages that need Jinja (for example the [Git token method](/docs/build/packages#git-token-method)), use `packages.yml` on <Constant name="core" />, which supports Jinja in package specs. The <Constant name="fusion_engine" /> also supports Jinja in `dependencies.yml`. Prefer `packages.yml` if the project must also run on <Constant name="core" />. Refer to [Jinja support by file type](/reference/jinja-file-support). For private packages without Jinja tokens, you can use [native private packages](/docs/build/packages#native-private-packages) in `packages.yml` or `dependencies.yml`.

If your dbt project doesn't require Jinja in package specifications, you can rename `packages.yml` to `dependencies.yml`. If you need Jinja in package specs (for example an environment variable or the [Git token method](/docs/build/packages#git-token-method)):
- On <Constant name="core" />, keep using `packages.yml`. <Constant name="core" /> does not render Jinja in `dependencies.yml`.
- On the <Constant name="fusion_engine" />, you can use Jinja in `dependencies.yml`. Prefer `packages.yml` if the project must also run on <Constant name="core" />.

Refer to [Jinja support by file type](/reference/jinja-file-support) for the full matrix. Use the following toggles to understand the differences and determine when to use `dependencies.yml` or `packages.yml` (or both). Refer to the [FAQs](#faqs) for more info.

<Expandable alt_header="When to use Project dependencies" >

Project dependencies are designed for the [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) and [cross-project reference](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) workflow:

- Use `dependencies.yml` when you need to set up cross-project references between different dbt projects, especially in a dbt Mesh setup.
- Use `dependencies.yml` when you want to include both projects and non-private dbt packages in your project's dependencies.
- Use `dependencies.yml` for organization and maintainability if you're using both [cross-project refs](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) and [dbt Hub packages](https://hub.getdbt.com/). This reduces the need for multiple YAML files to manage dependencies.

</Expandable>

<Expandable alt_header="When to use Package dependencies" >

Package dependencies allow you to add source code from someone else's dbt project into your own, like a library:

- If you only use packages like those from the [dbt Hub](https://hub.getdbt.com/), remain with `packages.yml`.
- Use `packages.yml` when you want to download dbt packages, such as dbt projects, into your root or parent dbt project. Something to note is that it doesn't contribute to the dbt Mesh workflow.
- Use `packages.yml` to include packages in your project's dependencies. This includes both public packages, such as those from the [dbt Hub](https://hub.getdbt.com/), and private packages. dbt now supports [native private packages](/docs/build/packages#native-private-packages).
- [`packages.yml` supports Jinja rendering](/docs/build/dbt-tips#yaml-tips) for historical reasons, allowing dynamic configurations. This can be useful if you need to insert values, like a [Git token method](/docs/build/packages#git-token-method) from an environment variable, into your package specifications. The <Constant name="fusion_engine" /> also supports Jinja in `dependencies.yml`; refer to [Jinja support by file type](/reference/jinja-file-support).

Previously, to use private Git repositories in dbt, you needed to use a workaround that involved embedding a Git token with Jinja. This is not ideal as it requires extra steps like creating a user and sharing a Git token. We’ve introduced support for [native private packages](/docs/build/packages#native-private-packages-) to address this.

</Expandable>
