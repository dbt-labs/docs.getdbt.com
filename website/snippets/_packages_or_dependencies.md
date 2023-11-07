
## Use cases

Starting from dbt v1.6, `dependencies.yml` has replaced `packages.yml`. The `dependencies.yml` file can now contain both types of dependencies: "package" and "project" dependencies.
- "Package" dependencies lets you add source code from someone else's dbt project into your own, like a library. 
- "Project" dependencies provide a different way to build on top of someone else's work in dbt. Refer to [Project dependencies](/docs/collaborate/govern/project-dependencies) for more info.
- You can rename your existing `packages.yml` to `dependencies.yml` unless you need to use Jinja within your packages specification. This is necessary if you want to add an environment variable with a Git token in a private Git package specification.

There are some important differences between using a `dependencies.yml` compared to a `packages.yml` file:

<Tabs>
<TabItem value="dependencies" label="When to use dependencies.yml">

`dependencies.yml` is designed for the [dbt Mesh](/guides/best-practices/how-we-mesh/mesh-1-intro) and cross-project reference workflow. Consider using it in the following scenarios:

- When you need to set up cross-project references between different dbt projects, especially in a dbt Mesh setup.
- When you want to include both projects and non-private dbt packages in your project's dependencies. 
  - Note that private packages are not supported yet in `dependencies.yml`.
- For organization and maintainability. `dependencies.yml` can help maintain your project's organization by allowing you to specify hub packages like `dbt_utils`. This reduces the need for multiple YAML files to manage dependencies.
- Keep in mind that `dependencies.yml` does not currently support Jinja rendering or conditional configuration. This is something important to consider if you need to configure your packages with dynamic or conditional settings.

</TabItem>
<TabItem value="packages" label="When to use packages.yml">

Packages allows you to add source code from someone else's dbt project into your own, like a library. Consider using it in the following scenarios:

- Use `packages.yml` when you want to download dbt packages, such as dbt projects, into your root or parent dbt project. Something to note is that it doesn't contribute to the dbt Mesh workflow.
- Use `packages.yml` to include packages, including private packages, in your project's dependencies. If you have private packages that you need to reference, `packages.yml` is the way to go.
- It supports Jinja rendering, which can be useful if you need to insert values, like a Git token from an environment variable, into your package specifications.

</TabItem>
</Tabs>
