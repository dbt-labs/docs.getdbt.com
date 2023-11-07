
## Use cases

Starting from dbt v1.6, `dependencies.yml` has replaced `packages.yml`. The `dependencies.yml` file can now contain both types of dependencies: "package" and "project" dependencies.
- "Package" dependencies lets you add source code from someone else's dbt project into your own, like a library. 
- "Project" dependencies provide a different way to build on top of someone else's work in dbt. Refer to [Project dependencies](/docs/collaborate/govern/project-dependencies) for more info.
- You can rename your existing `packages.yml` to `dependencies.yml` unless you need to use Jinja within your packages specification. This is necessary if you want to add an environment variable with a Git token in a private Git package specification.

There are some important differences between using a `dependencies.yml` compared to a `packages.yml` file:

<Tabs>
<TabItem value="dependencies" label="When to use dependencies.yml">

`dependencies.yml` is designed for the [dbt Mesh](/guides/best-practices/how-we-mesh/mesh-1-intro) and cross-project reference workflow. Consider using it in the following scenarios:

- Use `dependencies.yml` when you need to set up cross-project references between different dbt projects, especially in a dbt Mesh setup.
- Use `dependencies.yml` when you want to include both projects and non-private dbt packages in your project's dependencies. 
  - Private packages are not supported in `dependencies.yml` because it intentionally doesn't support Jinja rendering or conditional configuration. This is to maintain static and predictable configuration, and ensures compatibility with other services, like dbt Cloud.
- Use `dependencies.yml` for organization and maintainability. It can help maintain your project's organization by allowing you to specify hub packages like `dbt_utils`. This reduces the need for multiple YAML files to manage dependencies.

</TabItem>

<TabItem value="packages" label="When to use packages.yml">

Packages allows you to add source code from someone else's dbt project into your own, like a library. Consider using it in the following scenarios:

- Use `packages.yml` when you want to download dbt packages, such as dbt projects, into your root or parent dbt project. Something to note is that it doesn't contribute to the dbt Mesh workflow.
- Use `packages.yml` to include packages, including private packages, in your project's dependencies. If you have private packages that you need to reference, `packages.yml` is the way to go.
- `packages.yml` supports Jinja rendering for historical reasons, allowing dynamic configurations. This can be useful if you need to insert values, like a Git token from an environment variable, into your package specifications.
 
</TabItem>
</Tabs>
