
## Use cases

Starting from dbt v1.6, `dependencies.yml` has replaced `packages.yml`. The `dependencies.yml` file can now contain both types of dependencies: "package" and "project" dependencies.
- ["Package" dependencies](/docs/build/packages) lets you add source code from someone else's dbt project into your own, like a library. 
- ["Project" dependencies](/docs/collaborate/govern/project-dependencies) provide a different way to build on top of someone else's work in dbt. 

If your dbt project doesn't require the use of Jinja within the package specifications, you can simply rename your existing `packages.yml` to `dependencies.yml`. However, something to note is if your project's package specifications use Jinja, particularly for scenarios like adding an environment variable or a [Git token method](/docs/build/packages#git-token-method) in a private Git package specification, you should continue using the `packages.yml` file name. 

There are some important differences between Package dependencies and Project dependencies:

<Tabs>
<TabItem value="project" label="When to use Project dependencies">

Project dependencies are designed for the [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro) and [cross-project reference](/docs/collaborate/govern/project-dependencies#how-to-use-ref) workflow:

- Use `dependencies.yml` when you need to set up cross-project references between different dbt projects, especially in a dbt Mesh setup.
- Use `dependencies.yml` when you want to include both projects and non-private dbt packages in your project's dependencies. 
  - Private packages are not supported in `dependencies.yml` because they intentionally don't support Jinja rendering or conditional configuration. This is to maintain static and predictable configuration and ensures compatibility with other services, like dbt Cloud.
- Use `dependencies.yml` for organization and maintainability. It can help maintain your project's organization by allowing you to specify [dbt Hub packages](https://hub.getdbt.com/) like `dbt_utils`. This reduces the need for multiple YAML files to manage dependencies.

</TabItem>

<TabItem value="packages" label="When to use Package dependencies">

Package dependencies allow you to add source code from someone else's dbt project into your own, like a library:

- Use `packages.yml` when you want to download dbt packages, such as dbt projects, into your root or parent dbt project. Something to note is that it doesn't contribute to the dbt Mesh workflow.
- Use `packages.yml` to include packages, including private packages, in your project's dependencies. If you have private packages that you need to reference, `packages.yml` is the way to go.
- `packages.yml` supports Jinja rendering for historical reasons, allowing dynamic configurations. This can be useful if you need to insert values, like a [Git token method](/docs/build/packages#git-token-method) from an environment variable, into your package specifications.

Currently, to use private git repositories in dbt, you need to use a workaround that involves embedding a git token with Jinja. This is not ideal as it requires extra steps like creating a user and sharing a git token. We're planning to introduce a simpler method soon that won't require Jinja-embedded secret environment variables. For that reason, `dependencies.yml` does not support Jinja.
</TabItem>
</Tabs>
