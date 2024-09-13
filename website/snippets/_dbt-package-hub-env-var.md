If you're hosting an internal version of the [dbt Labs hosted package hub](https://hub.getdbt.com/), you can set the [`DBT_PACKAGE_HUB_URL`](https://github.com/dbt-labs/dbt-core/blob/main/core/dbt/clients/registry.py#L23) environment variable to point to your instance of the dbt package hub. This allows you to install packages from your self-hosted version. 

It provides organizations with the flexibility, control, and security when managing dbt packages:

- Host internal dbt packages for organizational use &mdash; Useful for sharing sensitive or proprietary data models, macros, or other items across the organization.
- Manage custom versions of public dbt packages &mdash; Beneficial for maintaining a fork of a public package with customizations or bug fixes.
- Operate in secure, regulated, or air-gapped environments &mdash; Useful for organizations that require strict control over the software they use.
- Gain control over package updates and dependencies &mdash; Useful for organizations that need to manage dependencies and updates carefully.

To set the `DBT_PACKAGE_HUB_URL` environment variable:

1. [Set the environment variable](/docs/build/environment-variables#setting-and-overriding-environment-variables) to the URL of your package hub.
   <Lightbox src="/img/docs/building-a-dbt-project/set-env-var.jpg" title="Set up the 'DBT_PACKAGE_HUB_URL' environment variable in the Environment settings page."/>
2. Configure the `packages.yml` file with the usual package name and version:

    ```yaml
        packages:
        - package: santi_corp/package_name
            version: [">=0.7.0", "<0.8.0"]
    ```

3. Run `dbt deps` to install the packages from your self-hosted package hub.
